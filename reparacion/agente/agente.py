"""
Agente de voz de Reparo para LiveKit (conversación continua, como una llamada).

Oído:    Deepgram Nova-3 en español
Cerebro: Claude Haiku 5.5 sin "pensamiento" interno (rápido y barato), o Gemini Flash
Voz:     ElevenLabs Flash v2.5 con voz de España (la mejor); Inworld TTS-2 Flash como opción barata

Si el cliente sale de la web, le entra una llamada o se corta la conexión, se le espera (3 min / 90 s) sin colgar.
Pensado para gastar lo mínimo sin perder clientes: cuelga a los 30 s de silencio (pregunta
"¿Sigues ahí?" a los 15 s, que le da tiempo a buscar la marca) y corta a los 8 minutos solo
como seguridad contra llamadas olvidadas, con aviso amable antes y prórroga si está dando datos.

Mientras habla, controla la web por RPC: señala secciones, rellena el formulario
y lo envía cuando el cliente confirma.

Las instrucciones se generan desde cerebro.mjs con:  node exportar-instrucciones.mjs
"""

import asyncio
import json
import logging
import os
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
)
from livekit.agents import NOT_GIVEN, NotGivenOr, llm
from livekit.agents.utils import is_given
from livekit.agents.voice import room_io
from livekit.plugins import anthropic, cartesia, deepgram, elevenlabs, google, inworld, noise_cancellation, silero

from manual import Manual

load_dotenv()
log = logging.getLogger("reparo")

AQUI = Path(__file__).parent
INSTRUCCIONES = (AQUI / "instrucciones.txt").read_text(encoding="utf-8")
SALUDO = (AQUI / "saludo.txt").read_text(encoding="utf-8").strip()
MANUAL = Manual(AQUI / "conocimiento.json")  # manual técnico: códigos de error y averías por síntoma

CAMPOS = {"aparato", "marca", "modelo", "averia", "codigo", "nombre", "telefono", "direccion", "municipio", "franja"}
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


def crear_tts():
    proveedor = os.getenv("TTS_PROVEEDOR", "elevenlabs").lower()  # decisión de Juan: la mejor voz (Inworld, opción barata)
    if proveedor == "elevenlabs":
        return elevenlabs.TTS(model="eleven_flash_v2_5", voice_id=os.environ["ELEVENLABS_VOZ_ID"], language="es")
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
        extra["keyterm"] = ["Bosch", "Balay", "Siemens", "LG", "Samsung", "Whirlpool", "Indesit", "Beko", "Teka", "Fagor", "AEG", "Candy", "Haier", "Miele"]
    return deepgram.STT(model="nova-3", language="es", smart_format=True, **extra)


class Tecnico(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=INSTRUCCIONES)
        self.cliente: str | None = None  # identidad del visitante en la sala
        self.enviado = False
        self.dando_datos = False  # el cliente ya ha dado su teléfono: no cortar en seco

    async def on_user_turn_completed(self, turn_ctx: llm.ChatContext, new_message: llm.ChatMessage) -> None:
        """Antes de contestar, consulta el manual con lo que acaba de decir el cliente
        y añade a su mensaje solo las fichas que tocan (códigos y síntomas)."""
        turnos = [
            {"role": m.role, "content": m.text_content or ""}
            for m in turn_ctx.items
            if getattr(m, "type", None) == "message" and m.role in ("user", "assistant")
        ]
        turnos.append({"role": "user", "content": new_message.text_content or ""})
        consulta = MANUAL.buscar(turnos)["texto"]
        if consulta:
            new_message.content.append("\n\n" + consulta)

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
            destino: precios, garantia, zona, plazo, como, marcas, formulario, codigo:<CODIGO> o aparato:<aparato>
        """
        return await self._rpc("senalar", {"destino": destino})

    @function_tool()
    async def rellenar_campo(self, context: RunContext, campo: str, valor: str) -> str:
        """Escribe un dato del cliente en el formulario de solicitud que ve en pantalla.

        Args:
            campo: aparato, marca, modelo, averia, codigo, nombre, telefono, direccion, municipio o franja
            valor: el dato tal como debe quedar escrito
        """
        if campo not in CAMPOS:
            raise ToolError(f"Campo desconocido. Usa uno de: {', '.join(sorted(CAMPOS))}")
        if campo == "telefono" and valor.strip():
            self.dando_datos = True
        return await self._rpc("rellenar", {"campo": campo, "valor": valor})

    @function_tool()
    async def enviar_solicitud(self, context: RunContext, tipo: str, urgente: bool, notas: str) -> str:
        """Envía el formulario. Solo cuando el cliente haya confirmado de viva voz que los datos de la pantalla son correctos.

        Args:
            tipo: "visita", "llamada" o "venta" (quiere comprar un aparato nuevo)
            urgente: true si hay riesgo para la casa o las personas o una necesidad básica sin cubrir
            notas: lo que le sirva al técnico (diagnóstico probable, pieza a llevar, garantía...)
        """
        if self.enviado:
            return "La solicitud ya se envió antes; no hace falta repetirla."
        r = await self._rpc("enviar", {"tipo": tipo, "urgente": urgente, "notas": notas})
        if r.startswith("ok"):
            self.enviado = True
        return r

    @function_tool()
    async def terminar_llamada(self, context: RunContext) -> str:
        """Cuelga la llamada. Úsala solo después de haberte despedido."""
        await context.wait_for_playout()
        get_job_context().shutdown("despedida")
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
        },
        user_away_timeout=SILENCIO_SEG / 2,
    )

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
        ctx.shutdown(motivo)

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
