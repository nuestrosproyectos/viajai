"""
Agente de voz COMÚN de las webs de la fábrica (LiveKit: conversación continua, como una llamada).
Sacado del agente de Reparo (probado en llamada real el 22-11-2026) y hecho general:
lo propio de cada web lo lee de la carpeta WEB_AGENTE (por defecto, la de este archivo):
  instrucciones.txt  · saludo.txt  · web.json (campos de la solicitud, obligatorios, voz y nombre del asistente)
Esos tres los genera  node fabrica/construir.mjs <web>  en <web>/agente/.
El nombre y la voz del asistente salen de <web>/asistente.json (un solo sitio): cambia allí y vuelve a construir.

Oído:    Deepgram Nova-3 en español
Cerebro: Claude Haiku 5.5 sin "pensamiento" interno (rápido y barato), o Gemini Flash
Voz:     ElevenLabs Flash v2.5 con la voz de asistente.json; Inworld o Cartesia como opción
"""

import asyncio
import json
import logging
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    RunContext,
    ToolError,
    cli,
    function_tool,
    get_job_context,
    inference,
    metrics,
)
from livekit.agents import NOT_GIVEN, NotGivenOr, llm
from livekit.agents.utils import is_given
from livekit.agents.voice import room_io
from livekit.plugins import anthropic, cartesia, deepgram, elevenlabs, google, inworld, noise_cancellation, silero

from apuntador import apuntar, tema_de, configurar
from decir import juntar_cifras, para_voz

load_dotenv()
log = logging.getLogger("fabrica")

AQUI = Path(os.getenv("WEB_AGENTE", Path(__file__).parent))
INSTRUCCIONES = (AQUI / "instrucciones.txt").read_text(encoding="utf-8")
SALUDO = (AQUI / "saludo.txt").read_text(encoding="utf-8").strip()
WEB = json.loads((AQUI / "web.json").read_text(encoding="utf-8"))
ASISTENTE = WEB["asistente"]
configurar(WEB)

# Manual por turno (opcional): solo si la web trae conocimiento.json y manual.py (como Reparo)
MANUAL = None
if (AQUI / "conocimiento.json").exists():
    try:
        from manual import Manual
        MANUAL = Manual(AQUI / "conocimiento.json")
    except ImportError:
        log.warning("hay conocimiento.json pero no manual.py: el agente sigue sin manual por turno")

CAMPOS_ORDEN = tuple(c["id"] for c in WEB["campos"])
CAMPOS = set(CAMPOS_ORDEN)
OBLIGATORIOS = tuple(WEB.get("obligatorios", ["nombre", "telefono"]))
DEL_CASO = tuple(c["id"] for c in WEB["campos"] if c.get("grupo") == "caso")
DE_CONTACTO = ("nombre", "telefono", "direccion", "municipio", "franja")
# Se añade a cada turno (no se guarda en la conversación): sin él, el asistente se alargaba a 40-65 palabras.
# La voz es el 83 % del coste de una llamada (medido el 22-11-2026): hablar menos es lo que abarata.
RECORDATORIO = ("[Recuerda (no lo leas): contesta en UNA o dos frases cortas, COMO MUCHO 18 PALABRAS en total "
                "(solo puedes pasarte al leer un teléfono o una dirección), con una sola pregunta al final. "
                "No repitas el nombre del cliente en cada respuesta ni datos que ya has dicho, y no empieces siempre "
                "con «Perfecto» o «Gracias». Si algo no está en tus instrucciones, no lo inventes: lo confirma el profesional.]")


async def cerrar_sala(motivo: str) -> None:
    """Cuelga de verdad: cierra la sala para que la web del cliente también cuelgue y apague el micro
    (si solo se va el agente, la llamada se quedaba abierta en la pantalla del cliente)."""
    ctx = get_job_context()
    try:
        await asyncio.wait_for(ctx.delete_room(), timeout=5)
    except Exception as e:
        log.warning("no se pudo cerrar la sala: %s", e)
    ctx.shutdown(motivo)


def _sin_tildes(t: str) -> str:
    return t.lower().translate(str.maketrans("áéíóúü", "aeiouu"))
SILENCIO_SEG = float(os.getenv("SILENCIO_SEGUNDOS", "30"))          # cuelga tras este silencio (avisa a la mitad): da tiempo a buscar la marca o la pegatina
DURACION_MAX_MIN = float(os.getenv("DURACION_MAX_MINUTOS", "8"))     # tope de seguridad contra llamadas olvidadas, no para cortar ventas
AVISO_ANTES_SEG = float(os.getenv("AVISO_ANTES_SEGUNDOS", "30"))     # aviso amable antes de cerrar
PRORROGA_DATOS_MIN = float(os.getenv("PRORROGA_DATOS_MINUTOS", "1.5"))  # solo si ya está dando sus datos
PAUSA_MAX_SEG = float(os.getenv("PAUSA_MAX_SEGUNDOS", "180"))       # le entra una llamada o sale de la web: se le espera sin colgar
ESPERA_VUELTA_SEG = float(os.getenv("ESPERA_VUELTA_SEGUNDOS", "90"))  # se corta la conexión: se le espera para que reconecte


class ClaudeRapido(anthropic.LLM):
    """Claude sin "pensamiento" interno: en una llamada de voz cada segundo de espera se nota
    y el pensamiento se cobra como texto de salida. Haiku 5.5 lo trae encendido de serie."""

    def chat(self, *args, extra_kwargs: NotGivenOr[dict] = NOT_GIVEN, **kwargs):
        extra = dict(extra_kwargs) if is_given(extra_kwargs) else {}
        extra.setdefault("thinking", {"type": "disabled"})
        return super().chat(*args, extra_kwargs=extra, **kwargs)


def crear_llm():
    proveedor = os.getenv("LLM_PROVEEDOR", "anthropic").lower()
    if proveedor == "google":
        return google.LLM(model=os.getenv("LLM_MODELO", "gemini-3.5-flash"))
    # Haiku 5.5: 0,10 $ / 0,50 $ por millón de tokens (diez veces más barato que Haiku 4.5).
    # Sin temperatura: los modelos actuales la rechazan. Respuestas cortas: tope de 300 tokens.
    return ClaudeRapido(model=os.getenv("LLM_MODELO", "claude-haiku-5-5"), caching="ephemeral", max_tokens=300)


VOZ = ASISTENTE.get("voz") or {}


def crear_tts():
    proveedor = os.getenv("TTS_PROVEEDOR", "elevenlabs").lower()  # decisión de Juan: la mejor voz (Inworld, opción barata)
    if proveedor == "elevenlabs":
        # Ajustes elegidos por Juan de oído (22-11-2026): con los de fábrica sonaba robótica.
        # Menos estabilidad = más entonación; velocidad 0,95 = un pelín más pausada.
        return elevenlabs.TTS(
            model=os.getenv("ELEVENLABS_MODELO", VOZ.get("modelo", "eleven_flash_v2_5")),
            voice_id=os.getenv("ELEVENLABS_VOZ_ID") or VOZ.get("id"),  # la voz de asistente.json (se puede forzar en .env)
            language="es",
            voice_settings=elevenlabs.VoiceSettings(
                stability=float(os.getenv("ELEVENLABS_ESTABILIDAD", VOZ.get("estabilidad", 0.35))),
                similarity_boost=float(os.getenv("ELEVENLABS_PARECIDO", VOZ.get("parecido", 0.8))),
                speed=float(os.getenv("ELEVENLABS_VELOCIDAD", VOZ.get("velocidad", 0.95))),
            ),
        )
    if proveedor == "cartesia":
        return cartesia.TTS(model="sonic-3", language="es", voice=os.environ["CARTESIA_VOZ_ID"])
    # Inworld TTS-2 Flash: la opción más barata con voz natural (unos 15 $ por millón de caracteres).
    # La voz se elige en el Playground de Inworld; tiene que ser de España (es-ES).
    return inworld.TTS(
        model=os.getenv("INWORLD_MODELO", "inworld-tts-2-flash"),
        voice=os.getenv("INWORLD_VOZ", "Ignacio"),
        language="es-ES",
    )


def crear_filtro_ruido():
    """Filtro de ruido de LiveKit Cloud (incluido en el plan, sin coste extra).
    BVC quita el ruido Y las voces de fondo (calle, bar, tele): Andrés solo oye a quien le habla.
    NC quita solo el ruido. "no" lo desactiva (si algún día degradara la voz en pruebas)."""
    modo = os.getenv("FILTRO_RUIDO", "bvc").lower()
    if modo == "no":
        return None
    return noise_cancellation.NC() if modo == "nc" else noise_cancellation.BVC()


def crear_stt():
    # Las "palabras clave" de Deepgram se cobran aparte (unos 0,0013 $ por minuto), pero oír bien
    # "Balay" o "Teka" decide el diagnóstico y la venta: compensa de sobra.
    extra = {}
    if os.getenv("DEEPGRAM_PALABRAS_CLAVE", "1") == "1":  # activadas: ~0,004 $ por llamada para entender bien las marcas
        extra["keyterm"] = WEB.get("palabrasClave") or [WEB["marca"]]
    return deepgram.STT(model="nova-3", language="es", smart_format=True, **extra)


class Tecnico(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=INSTRUCCIONES)
        self.cliente: str | None = None  # identidad del visitante en la sala
        self.enviado = False
        self.dando_datos = False  # el cliente ya ha dado su teléfono: no cortar en seco
        self.datos: dict[str, str] = {}      # lo que el apuntador ya ha escrito en la solicitud de la pantalla
        self.aviso = ""                      # número de aviso que devuelve la web al enviar
        self.formulario_visto = False
        self.senalados: set[str] = set()     # partes de la web ya enseñadas (no repetir)
        self.al_despedirse = None            # lo pone la sesión: cuelga cuando Andrés acabe de despedirse
        self.cliente_se_despide = False      # sin esto, Andrés no puede colgar
        self._tareas: set[asyncio.Task] = set()

    @staticmethod
    def _turnos(ctx: llm.ChatContext) -> list[dict]:
        return [
            {"role": m.role, "content": m.text_content or ""}
            for m in ctx.items
            if getattr(m, "type", None) == "message" and m.role in ("user", "assistant")
        ]

    def _nota_estado(self) -> str:
        """Lo que ya está apuntado en la pantalla del cliente, para que Andrés pida solo lo que falta."""
        if not self.datos and not self.enviado:
            return ""
        partes = []
        if self.datos:
            partes.append("En la solicitud que el cliente ve en pantalla ya están apuntados: "
                          + "; ".join(f"{c}: {v}" for c, v in self.datos.items()) + ".")
            if "telefono" in self.datos:
                t = self.datos["telefono"]
                partes.append(f"Si lees el teléfono en voz alta, cópialo EXACTAMENTE así, sin recolocar cifras: {t[:3]} {t[3:6]} {t[6:]}.")
            faltan = [c for c in dict.fromkeys(OBLIGATORIOS + ("franja",)) if c in CAMPOS and c not in self.datos]
            if faltan:
                partes.append("Para la solicitud faltan: " + ", ".join(faltan) + ". Pídelos de uno en uno.")
            elif not self.enviado:
                # Pedido por Juan (22-11-2026): Andrés preguntaba «¿son correctos?» y después «¿envío ya la
                # solicitud?». Con los datos a la vista y confirmados no hay que pedir permiso para enviar.
                partes.append("Ya están todos los datos y el cliente los ve en pantalla. Si todavía no le has leído "
                              "el teléfono (y la dirección, si la hay), léeselos UNA sola vez y pregunta si están bien. En cuanto diga "
                              "que sí, la solicitud se envía sola: dile que queda enviada y que le llamaremos para "
                              "confirmar la hora. NUNCA preguntes «¿envío la solicitud?» ni pidas una segunda confirmación.")
        if self.enviado:
            partes.append("La solicitud YA SE HA ENVIADO" + (f" ({self.aviso})" if self.aviso else "")
                          + ": si aún no se lo has dicho, confírmaselo en una frase y pregúntale si necesita algo más. "
                            "NO te despidas ni cuelgues hasta que el cliente se despida.")
        return "[Nota interna (no la leas ni la menciones): " + " ".join(partes) + "]"

    async def llm_node(self, chat_ctx: llm.ChatContext, tools, model_settings):
        """Antes de contestar, consulta el manual con lo que acaba de decir el cliente y añade las
        fichas que tocan SOLO a esta respuesta. No se guardan en la conversación: antes se quedaban
        en ella, el manual se leía a sí mismo y cambiaba de tema a media llamada
        (el 22-11-2026 pasó de «secadora Balay» a «lavadora Miele»)."""
        turnos = self._turnos(chat_ctx)
        notas = []
        if MANUAL and turnos and turnos[-1]["role"] == "user":
            consulta = MANUAL.buscar(turnos)["texto"]
            if consulta:
                notas.append(consulta)
        estado = self._nota_estado()
        if estado:
            notas.append(estado)
        notas.append(RECORDATORIO)
        ctx = chat_ctx.copy()
        for i in range(len(ctx.items) - 1, -1, -1):
            m = ctx.items[i]
            if getattr(m, "type", None) == "message" and m.role == "user":
                ctx.items[i] = m.model_copy(update={"content": list(m.content) + ["\n\n" + "\n\n".join(notas)]})
                break
        async for trozo in Agent.default.llm_node(self, ctx, tools, model_settings):
            yield trozo

    async def on_user_turn_completed(self, turn_ctx: llm.ChatContext, new_message: llm.ChatMessage) -> None:
        """Cada vez que el cliente termina de hablar, el apuntador saca sus datos en segundo plano
        (sin frenar la respuesta) y los escribe en la solicitud de la pantalla."""
        # Un teléfono dictado cifra a cifra se junta antes de que lo lean el cerebro y el apuntador
        # (solo cambia la frase cuando hay cifras sueltas, así no se pierde la respuesta adelantada).
        junto = [juntar_cifras(c) if isinstance(c, str) else c for c in new_message.content]
        if junto != new_message.content:
            new_message.content = junto
        turnos = self._turnos(turn_ctx)
        turnos.append({"role": "user", "content": new_message.text_content or ""})
        tarea = asyncio.create_task(self._apuntar(turnos))
        self._tareas.add(tarea)
        tarea.add_done_callback(self._tareas.discard)

    @staticmethod
    def _mismo(a: str, b: str) -> bool:
        """Dos formas de escribir el mismo dato («calle Mayor 10, 5º A» y «Mayor 10 5º A»)."""
        pa, pb = (set(re.findall(r"[a-z0-9áéíóúñ]+", x.lower())) - {"calle", "c", "numero", "número", "de", "la", "el"} for x in (a, b))
        return pa <= pb or pb <= pa

    async def _apuntar(self, turnos: list[dict]) -> None:
        try:
            r = await apuntar(turnos, dict(self.datos))
            nuevos ={c: r[c] for c in CAMPOS_ORDEN if c in r and not (c in self.datos and self._mismo(self.datos[c], r[c]))}
            for campo, valor in nuevos.items():
                if campo in DE_CONTACTO and not self.formulario_visto:
                    self.formulario_visto = True
                    await self._senalar("formulario")
                try:
                    res = await self._rpc("rellenar", {"campo": campo, "valor": valor})
                    self.datos[campo] = valor
                    log.info("APUNTADO %s = %s -> %s", campo, valor, str(res)[:80])
                except ToolError as e:
                    log.warning("no se pudo apuntar %s: %s", campo, e)
                if campo == "telefono":
                    self.dando_datos = True
            if r.get("confirmado") and not self.enviado and all(c in self.datos for c in OBLIGATORIOS):
                notas = "; ".join(f"{c}: {self.datos[c]}" for c in DEL_CASO if c in self.datos)
                try:
                    res = await self._rpc("enviar", {"tipo": r.get("tipo", WEB["tipos"][0]), "urgente": bool(r.get("urgente")), "notas": notas})
                    log.info("ENVIAR solicitud -> %s", str(res)[:120])
                    if str(res).startswith("ok"):
                        self.enviado, self.aviso = True, str(res)[2:].strip(" :.-")
                except ToolError as e:
                    log.warning("no se pudo enviar la solicitud: %s", e)
            if r.get("se_despide"):
                self.cliente_se_despide = True
            if r.get("se_despide") and self.al_despedirse:
                log.info("el cliente se despide: se cuelga cuando Andrés termine de hablar")
                self.al_despedirse()
        except Exception:
            log.exception("fallo del apuntador")

    async def _senalar(self, destino: str) -> None:
        if destino in self.senalados:
            return
        self.senalados.add(destino)
        try:
            await self._rpc("senalar", {"destino": destino})
            log.info("SEÑALA %s", destino)
        except ToolError as e:
            log.warning("no se pudo señalar %s: %s", destino, e)

    async def senalar_tema(self, texto: str) -> None:
        """Enseña en la web la parte de la que Andrés acaba de hablar (precios, garantía, plazo, zona)."""
        destino = tema_de(texto)
        if destino:
            await self._senalar(destino)

    def tts_node(self, text, model_settings):
        """Antes de pasar a voz, las cifras, los precios y los teléfonos se escriben con palabras
        (la voz rápida lee mal «39 €» y los números de teléfono)."""
        return Agent.default.tts_node(self, para_voz(text), model_settings)

    async def _rpc(self, metodo: str, datos: dict) -> str:
        if not self.cliente:
            raise ToolError("La web del cliente no está conectada.")
        sala = get_job_context().room
        try:
            return await sala.local_participant.perform_rpc(
                destination_identity=self.cliente,
                method=metodo,
                payload=json.dumps(datos, ensure_ascii=False),
                response_timeout=8.0,
            )
        except rtc.RpcError as e:
            raise ToolError(e.message or "La web no ha respondido.")

    @function_tool()
    async def mostrar_en_pagina(self, context: RunContext, destino: str) -> str:
        """Mueve la web hasta la sección que estás explicando y la resalta.

        Args:
            destino: una de las partes de la web que dicen tus instrucciones (por ejemplo precios, zona, como o formulario)
        """
        return await self._rpc("senalar", {"destino": destino})

    @function_tool()
    async def rellenar_campo(self, context: RunContext, campo: str, valor: str) -> str:
        """Escribe un dato del cliente en el formulario de solicitud que ve en pantalla.

        Args:
            campo: uno de los campos de la solicitud que dicen tus instrucciones (nombre, telefono, municipio, franja…)
            valor: el dato tal como debe quedar escrito
        """
        if campo not in CAMPOS:
            raise ToolError(f"Campo desconocido. Usa uno de: {', '.join(sorted(CAMPOS))}")
        if campo == "telefono" and valor.strip():
            self.dando_datos = True
        return await self._rpc("rellenar", {"campo": campo, "valor": valor})

    @function_tool()
    async def enviar_solicitud(self, context: RunContext, tipo: str, urgente: bool, notas: str) -> str:
        """Envía el formulario cuando el cliente ya ha dado sus datos por buenos. No le preguntes antes si quieres enviarla.

        Args:
            tipo: el tipo de solicitud que dicen tus instrucciones (por ejemplo "visita", "consulta" o "llamada")
            urgente: true si hay riesgo para la casa o las personas o una necesidad básica sin cubrir
            notas: lo que le sirva al profesional y lo que el cliente preguntó y no estaba en tus instrucciones
        """
        if self.enviado:
            return "La solicitud ya se envió antes; no hace falta repetirla."
        r = await self._rpc("enviar", {"tipo": tipo, "urgente": urgente, "notas": notas})
        if r.startswith("ok"):
            self.enviado = True
        return r

    @function_tool()
    async def terminar_llamada(self, context: RunContext) -> str:
        """Cuelga la llamada. Úsala solo cuando el CLIENTE se haya despedido y tú también."""
        await context.wait_for_playout()
        if not self.cliente_se_despide:
            # El 22-11-2026 Andrés se despidió y colgó nada más enviar la solicitud, sin esperar al cliente.
            return "No se ha colgado: el cliente todavía no se ha despedido. Pregúntale si necesita algo más y espera a que se despida él."
        await cerrar_sala("despedida")
        return "llamada terminada"


servidor = AgentServer()


@servidor.rtc_session(agent_name=os.getenv("AGENTE_NOMBRE", "andres"))
async def sesion(ctx: JobContext) -> None:
    await ctx.connect()
    participante = await ctx.wait_for_participant()

    tecnico = Tecnico()
    tecnico.cliente = participante.identity

    voz = AgentSession(
        stt=crear_stt(),
        llm=crear_llm(),
        tts=crear_tts(),
        vad=silero.VAD.load(),
        turn_handling={
            # Detección de fin de turno: "v1-mini" corre en el propio servidor (gratis); "v1" se cobra en la nube de LiveKit
            "turn_detection": inference.TurnDetector(version=os.getenv("DETECTOR_TURNOS", "v1-mini")),
            # El cliente puede interrumpir, pero un ruido no: hacen falta 2 palabras reconocidas y
            # medio segundo largo de voz; si fue una falsa alarma, Andrés retoma lo que decía.
            # (El modo "adaptive" de LiveKit lo hace con un modelo en la nube, que se cobra aparte.)
            "interruption": {
                "enabled": True,
                "mode": os.getenv("INTERRUPCIONES", "vad"),
                "min_duration": 0.6,
                "min_words": 2,
                "resume_false_interruption": True,
                "false_interruption_timeout": 1.5,
            },
            # Respuesta adelantada: el cerebro empieza a preparar la contestación en cuanto llega la
            # transcripción, sin esperar a confirmar que el cliente ha terminado (ahorra ~medio segundo).
            # Antes se tiraba siempre porque el manual modificaba la conversación; ya no (ver llm_node).
            "preemptive_generation": {"enabled": os.getenv("RESPUESTA_ADELANTADA", "1") == "1"},
        },
        user_away_timeout=SILENCIO_SEG / 2,
    )

    # ---- Enseñar en la web aquello de lo que Andrés acaba de hablar, y colgar tras la despedida ----
    despedida_pendiente = False

    def _al_despedirse() -> None:
        nonlocal despedida_pendiente
        despedida_pendiente = True

        async def _por_si_acaso() -> None:  # si Andrés no llegara a contestar, se despide igualmente
            await asyncio.sleep(12)
            await _colgar("despedida", f"Gracias por llamar a {WEB['marca']}. ¡Hasta luego!")
        asyncio.create_task(_por_si_acaso())

    tecnico.al_despedirse = _al_despedirse

    @voz.on("conversation_item_added")
    def _tras_hablar(ev) -> None:
        if getattr(ev.item, "type", None) != "message" or ev.item.role != "assistant" or colgando:
            return
        asyncio.create_task(tecnico.senalar_tema(ev.item.text_content or ""))
        if despedida_pendiente:
            nonlocal_colgar()

    def nonlocal_colgar() -> None:
        nonlocal colgando
        if not colgando:
            colgando = True
            log.info("llamada terminada tras la despedida")
            asyncio.create_task(cerrar_sala("despedida"))

    # ---- Diario de la llamada (queda en este ordenador): qué se dice, qué herramientas usa Andrés
    # y cuánto tarda cada pieza. Sirve para afinar; se apaga con DIARIO=0. ----
    if os.getenv("DIARIO", "1") == "1":
        @voz.on("metrics_collected")
        def _medidas(ev) -> None:
            m = ev.metrics
            if isinstance(m, metrics.EOUMetrics):
                log.info("TIEMPO fin de turno: %.2f s (transcripción %.2f s, manual %.2f s)",
                         m.end_of_utterance_delay, m.transcription_delay, m.on_user_turn_completed_delay)
            elif isinstance(m, metrics.LLMMetrics):
                log.info("TIEMPO cerebro: primera palabra %.2f s, total %.2f s%s",
                         m.ttft, m.duration, " (cancelada)" if m.cancelled else "")
            elif isinstance(m, metrics.TTSMetrics):
                log.info("TIEMPO voz: primer sonido %.2f s (%d letras)", m.ttfb, m.characters_count)

        @voz.on("function_tools_executed")
        def _herramientas(ev) -> None:
            for llamada, salida in zip(ev.function_calls, ev.function_call_outputs):
                log.info("HERRAMIENTA %s(%s) -> %s%s", llamada.name, llamada.arguments,
                         str(salida.output)[:160], " [FALLO]" if salida.is_error else "")

        @voz.on("conversation_item_added")
        def _frases(ev) -> None:
            if getattr(ev.item, "type", None) == "message" and ev.item.role in ("user", "assistant"):
                log.info("%s: %s", "CLIENTE" if ev.item.role == "user" else "ANDRÉS", (ev.item.text_content or "")[:400])

    # ---- Silencio: "¿Sigues ahí?" a la mitad y cuelga al llegar al total ----
    # LiveKit solo avisa una vez de que el cliente está "ausente" (no vuelve a avisar mientras
    # siga ausente), así que el segundo plazo lo cuenta este temporizador propio.
    espera_silencio: asyncio.Task | None = None
    colgando = False

    async def _colgar(motivo: str, despedida: str) -> None:
        nonlocal colgando
        if colgando:
            return
        colgando = True
        await voz.say(despedida, allow_interruptions=False)
        await cerrar_sala(motivo)

    # ---- Pausa: la web avisa (atributo "pausa") si el cliente sale de la página, le entra una
    # llamada o silencia el micro. Andrés se calla y le espera sin colgar; ese tiempo no cuenta
    # para el tope de duración. Si se corta la conexión, le espera para que reconecte. ----
    en_pausa = False
    espera_pausa: asyncio.Task | None = None

    def _cancelar(tarea: asyncio.Task | None) -> None:
        if tarea and not tarea.done():
            tarea.cancel()

    async def _fin_pausa(segundos: float, motivo: str) -> None:
        await asyncio.sleep(segundos)
        await _colgar(motivo, "Como no vuelves, cuelgo por ahora. Tus datos siguen en la web; cuando quieras, aquí estoy.")

    def _pausar(motivo: str, segundos: float) -> None:
        nonlocal en_pausa, espera_pausa, espera_silencio
        if colgando:
            return
        en_pausa = True
        _cancelar(espera_silencio)
        _cancelar(espera_pausa)
        voz.interrupt()
        espera_pausa = asyncio.create_task(_fin_pausa(segundos, motivo))

    def _reanudar() -> None:
        nonlocal en_pausa
        if not en_pausa or colgando:
            return
        en_pausa = False
        _cancelar(espera_pausa)
        voz.say("Ya estás de vuelta. Seguimos donde lo dejamos.", allow_interruptions=True)

    @ctx.room.on("participant_attributes_changed")
    def _atributos(cambios: dict, participante) -> None:
        if participante.identity != tecnico.cliente or "pausa" not in cambios:
            return
        if cambios["pausa"]:
            _pausar("pausa larga", PAUSA_MAX_SEG)
        else:
            _reanudar()

    @ctx.room.on("participant_disconnected")
    def _se_va(participante) -> None:
        if participante.identity == tecnico.cliente:
            _pausar("se cortó la conexión", ESPERA_VUELTA_SEG)

    @ctx.room.on("participant_connected")
    def _vuelve(participante) -> None:
        if participante.identity == tecnico.cliente:
            _reanudar()

    async def _cuenta_silencio() -> None:
        await voz.say("¿Sigues ahí?")
        await asyncio.sleep(SILENCIO_SEG / 2)
        await _colgar("silencio", "Como no te oigo, cuelgo para no molestarte. Cuando quieras, aquí estoy.")

    @voz.on("user_state_changed")
    def _ausencia(ev) -> None:
        nonlocal espera_silencio
        if ev.new_state == "speaking" and espera_silencio and not espera_silencio.done():
            espera_silencio.cancel()  # ha vuelto a hablar: se anula el cuelgue
        if ev.new_state == "away" and not colgando and not en_pausa and not (espera_silencio and not espera_silencio.done()):
            espera_silencio = asyncio.create_task(_cuenta_silencio())

    # ---- Duración máxima: aviso amable antes y cierre; prórroga corta si está dando sus datos ----
    async def _limite_duracion() -> None:
        # solo cuenta el tiempo de conversación, no las pausas
        activo, objetivo = 0.0, max(DURACION_MAX_MIN * 60 - AVISO_ANTES_SEG, 0)
        while activo < objetivo and not colgando:
            await asyncio.sleep(1)
            if not en_pausa:
                activo += 1
        if colgando:
            return
        if tecnico.dando_datos and not tecnico.enviado:
            # está dando sus datos: no se le corta, se le da un poco más de tiempo para terminar
            await asyncio.sleep(AVISO_ANTES_SEG + PRORROGA_DATOS_MIN * 60)
        else:
            await voz.say("Te comento que nos queda poco tiempo de llamada; si quieres, dejamos ya tu visita apuntada.", allow_interruptions=True)
            await asyncio.sleep(AVISO_ANTES_SEG)
        await _colgar("duración máxima", "Tengo que ir cerrando la llamada. Si te falta algo, déjalo en el formulario de la web y te llamamos. ¡Un saludo!")

    filtro = crear_filtro_ruido()
    # close_on_disconnect=False: si se corta la conexión no se cierra la sesión; se le espera (ver _se_va)
    opciones = room_io.RoomOptions(close_on_disconnect=False, audio_input=room_io.AudioInputOptions(noise_cancellation=filtro)) if filtro \
        else room_io.RoomOptions(close_on_disconnect=False)
    await voz.start(agent=tecnico, room=ctx.room, room_options=opciones)
    asyncio.create_task(_limite_duracion())
    await voz.say(SALUDO, allow_interruptions=True)


if __name__ == "__main__":
    cli.run_app(servidor)
