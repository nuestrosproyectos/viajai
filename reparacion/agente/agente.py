"""
Agente de voz de Reparo para LiveKit (conversación continua, como una llamada).

Oído:    Deepgram Nova-3 en español
Cerebro: Claude Haiku (o Gemini Flash, según .env) con las instrucciones de ../cerebro.mjs
Voz:     ElevenLabs Flash v2.5 con voz de España (o Cartesia si no hay clave de ElevenLabs)

Mientras habla, controla la web por RPC: señala secciones, rellena el formulario
y lo envía cuando el cliente confirma. Cuelga solo tras 20 s de silencio (dos avisos).

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
from livekit.plugins import anthropic, cartesia, deepgram, elevenlabs, google, silero

load_dotenv()
log = logging.getLogger("reparo")

AQUI = Path(__file__).parent
INSTRUCCIONES = (AQUI / "instrucciones.txt").read_text(encoding="utf-8")
SALUDO = (AQUI / "saludo.txt").read_text(encoding="utf-8").strip()

CAMPOS = {"aparato", "marca", "modelo", "averia", "codigo", "nombre", "telefono", "direccion", "municipio", "franja"}
SILENCIO_SEG = float(os.getenv("SILENCIO_SEGUNDOS", "20"))
DURACION_MAX_MIN = float(os.getenv("DURACION_MAX_MINUTOS", "10"))


def crear_llm():
    proveedor = os.getenv("LLM_PROVEEDOR", "anthropic").lower()
    if proveedor == "google":
        return google.LLM(model=os.getenv("LLM_MODELO", "gemini-3.5-flash"), temperature=0.4)
    return anthropic.LLM(model=os.getenv("LLM_MODELO", "claude-haiku-4-5"), temperature=0.4, caching="ephemeral")


def crear_tts():
    if os.getenv("ELEVEN_API_KEY"):
        return elevenlabs.TTS(
            model="eleven_flash_v2_5",
            voice_id=os.environ["ELEVENLABS_VOZ_ID"],  # voz de España elegida en la biblioteca de ElevenLabs
            language="es",
        )
    return cartesia.TTS(model="sonic-3", language="es", voice=os.environ["CARTESIA_VOZ_ID"])


class Tecnico(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=INSTRUCCIONES)
        self.cliente: str | None = None  # identidad del visitante en la sala
        self.enviado = False

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
        return await self._rpc("rellenar", {"campo": campo, "valor": valor})

    @function_tool()
    async def enviar_solicitud(self, context: RunContext, tipo: str, urgente: bool, notas: str) -> str:
        """Envía el formulario. Solo cuando el cliente haya confirmado de viva voz que los datos de la pantalla son correctos.

        Args:
            tipo: "visita" o "llamada"
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
        stt=deepgram.STT(
            model="nova-3",
            language="es",
            smart_format=True,  # teléfonos y direcciones con formato
            keyterm=["Bosch", "Balay", "Siemens", "LG", "Samsung", "Whirlpool", "Indesit", "Beko", "Teka", "Fagor", "AEG", "Candy", "Haier", "Miele", "No Frost", "vitrocerámica", "inducción", "lavavajillas"],
        ),
        llm=crear_llm(),
        tts=crear_tts(),
        vad=silero.VAD.load(),
        turn_handling={
            "turn_detection": inference.TurnDetector(),  # detección semántica de fin de turno
            "interruption": {"enabled": True},          # el cliente puede interrumpir y el técnico se calla
        },
        user_away_timeout=SILENCIO_SEG / 2,
    )

    avisos_silencio = 0

    @voz.on("user_state_changed")
    def _ausencia(ev) -> None:
        nonlocal avisos_silencio
        if ev.new_state == "speaking":
            avisos_silencio = 0
        if ev.new_state != "away":
            return
        avisos_silencio += 1

        async def _actuar() -> None:
            if avisos_silencio == 1:
                await voz.say("¿Sigues ahí?")
            else:
                h = voz.say("Como no te oigo, cuelgo para no molestarte. Cuando quieras, aquí estoy.")
                await h
                ctx.shutdown("silencio")

        asyncio.create_task(_actuar())

    async def _limite_duracion() -> None:
        # Tope de duración para que una llamada olvidada no gaste saldo
        await asyncio.sleep(DURACION_MAX_MIN * 60)
        await voz.say("Tenemos que ir terminando. Si te falta algo, déjalo en el formulario o llámanos y te atendemos.")
        ctx.shutdown("duración máxima")

    await voz.start(agent=tecnico, room=ctx.room)
    asyncio.create_task(_limite_duracion())
    await voz.say(SALUDO, allow_interruptions=True)


if __name__ == "__main__":
    cli.run_app(servidor)
