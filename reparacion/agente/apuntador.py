"""
El apuntador: lee la conversación en segundo plano y saca los datos del cliente.

Por qué existe: el cerebro rápido de Andrés (Claude Haiku sin pensamiento) se centra en hablar y
casi nunca da las órdenes a la web (medido el 22-11-2026: ninguna orden en seis turnos). Así que
rellenar la solicitud, enseñar la página y colgar ya no dependen de él: después de cada frase del
cliente, esta pieza pregunta aparte, sin frenar la voz, qué datos hay y si el cliente se despide.

Cuesta una consulta pequeña de Haiku por turno (unas décimas de céntimo por llamada).
"""

import json
import logging
import os
import re

import anthropic

log = logging.getLogger("reparo")

CAMPOS = ("aparato", "marca", "modelo", "averia", "codigo", "nombre", "telefono", "direccion", "municipio", "franja")

SISTEMA = """Eres el apuntador de un servicio de reparación de electrodomésticos en Granada. Lees una conversación de voz entre CLIENTE y ANDRÉS (el asistente) y devuelves SOLO un objeto JSON, sin nada más, con lo que el CLIENTE ha dicho hasta ahora.

Campos de datos (omite los que no se sepan; no inventes ni deduzcas nada que el cliente no haya dicho):
- aparato: lavadora, secadora, frigorífico, lavavajillas, horno, placa, termo, campana, aire acondicionado, caldera...
- marca, modelo
- averia: resumen de 3 a 8 palabras con las palabras del cliente
- codigo: código de error que sale en la pantalla, si lo dice
- nombre
- telefono: 9 cifras seguidas, sin espacios
- direccion: calle, número y piso
- municipio
- franja: cuándo quiere la visita (por ejemplo "mañana por la mañana, de 12 a 2")

Campos de estado (siempre):
- tipo: "visita", "llamada" (quiere que le llamen) o "venta" (quiere comprar un aparato nuevo)
- urgente: true si hay agua saliendo, olor a gas o a quemado, o una necesidad básica sin cubrir
- confirmado: true SOLO si el cliente ya ha dicho que su teléfono es correcto y ha aceptado la visita, la llamada o la compra
- se_despide: true SOLO si en su ÚLTIMA frase el cliente se despide o dice que no necesita nada más (adiós, hasta luego, gracias y nada más, eso es todo...)

La voz se transcribe con errores: une las cifras del teléfono aunque vengan sueltas o con puntos; si el cliente corrige un dato, vale el último que haya dicho EL CLIENTE.
MUY IMPORTANTE: los datos salen solo de las frases del CLIENTE. Lo que dice ANDRÉS no es un dato: si ANDRÉS lee un teléfono o una dirección distintos de los que dijo el cliente, ANDRÉS se ha equivocado y vale lo del CLIENTE. Si el cliente dice que algo «está bien apuntado», no lo cambies.
Usa siempre el mismo nombre para el aparato (si el cliente dice «calentador», pon «calentador»; no lo cambies luego por «termo»)."""

_cliente: anthropic.AsyncAnthropic | None = None


def _api() -> anthropic.AsyncAnthropic:
    global _cliente
    if _cliente is None:
        _cliente = anthropic.AsyncAnthropic(timeout=12.0, max_retries=1)
    return _cliente


async def apuntar(turnos: list[dict], ya: dict | None = None) -> dict:
    """turnos: [{"role": "user"|"assistant", "content": str}] sin fichas del manual.
    ya: lo que ya está apuntado en pantalla (para no cambiarlo sin motivo). Devuelve el JSON del apuntador ({} si falla)."""
    guion = "\n".join(("CLIENTE: " if t["role"] == "user" else "ANDRÉS: ") + t["content"].strip() for t in turnos[-24:] if t["content"].strip())
    if ya:
        guion += ("\n\nDATOS YA APUNTADOS EN PANTALLA: " + json.dumps(ya, ensure_ascii=False)
                  + "\nRepítelos EXACTAMENTE igual, salvo que el CLIENTE haya dado después un valor distinto con sus propias palabras.")
    try:
        r = await _api().messages.create(
            model=os.getenv("APUNTADOR_MODELO", "claude-haiku-5-5"),
            max_tokens=400,
            thinking={"type": "disabled"},
            system=[{"type": "text", "text": SISTEMA, "cache_control": {"type": "ephemeral"}}],
            messages=[{"role": "user", "content": "CONVERSACIÓN:\n" + guion + "\n\nDevuelve el JSON."}],
        )
        texto = "".join(b.text for b in r.content if b.type == "text")
        m = re.search(r"\{.*\}", texto, re.S)
        datos = json.loads(m.group(0)) if m else {}
    except Exception as e:  # el apuntador nunca debe tumbar la llamada
        log.warning("apuntador: no ha contestado bien (%s)", e)
        return {}
    limpio = {}
    for c in CAMPOS:
        v = datos.get(c)
        if isinstance(v, (str, int)) and str(v).strip() and str(v).strip().lower() not in ("null", "none", "desconocido", "-"):
            limpio[c] = str(v).strip()
    if "telefono" in limpio:
        cifras = re.sub(r"\D", "", limpio["telefono"])
        cifras = cifras[2:] if len(cifras) == 11 and cifras.startswith("34") else cifras
        # Solo vale un teléfono de 9 cifras que haya dicho el CLIENTE. Lo que lee Andrés en voz alta no cuenta:
        # el 22-11-2026 Andrés lo leyó mal y el apuntador machacó el número bueno con el malo.
        dicho = [re.sub(r"\D", "", t["content"]) for t in turnos if t["role"] == "user"]
        hay_cifras = any(len(d) >= 7 for d in dicho)
        if len(cifras) == 9 and (not hay_cifras or any(cifras in d for d in dicho)):
            limpio["telefono"] = cifras
        else:
            del limpio["telefono"]  # a medias, o no lo ha dicho el cliente: no se escribe
    limpio["tipo"] = datos.get("tipo") if datos.get("tipo") in ("visita", "llamada", "venta") else "visita"
    for c in ("urgente", "confirmado", "se_despide"):
        limpio[c] = datos.get(c) is True
    return limpio


# Qué parte de la web enseñar según lo que Andrés acaba de decir (solo en ordenador la página se mueve;
# en el móvil sale una tarjeta en la conversación)
TEMAS = [
    ("garantia", re.compile(r"\bgarant[ií]a", re.I)),
    ("precios", re.compile(r"\b(euros?|€|precio|presupuesto|cuesta|sale por|descuent)", re.I)),
    ("plazo", re.compile(r"\b(24|48|veinticuatro|cuarenta y ocho) ?(h|horas)|\bplazo\b", re.I)),
    ("zona", re.compile(r"\b(zona|cobertura|llegamos a|área metropolitana|alrededores)\b", re.I)),
]


def tema_de(texto: str) -> str:
    for destino, patron in TEMAS:
        if patron.search(texto):
            return destino
    return ""


if __name__ == "__main__":
    import asyncio
    from dotenv import load_dotenv

    load_dotenv()
    CONV = [
        ("assistant", "Hola, soy Andrés, el técnico virtual de Reparo. Cuéntame: ¿qué aparato te está dando guerra y qué le pasa?"),
        ("user", "O una secadora Balay. Que no no seca."),
        ("assistant", "Lo más probable es el filtro o el condensador. ¿Te viene mejor mañana por la mañana o por la tarde?"),
        ("user", "Por la mañana."),
        ("assistant", "Perfecto. ¿Me dices tu nombre y un teléfono de contacto?"),
        ("user", "Sí, soy Juan."),
        ("assistant", "Encantado, Juan. Dame un teléfono de contacto."),
        ("user", "6 0 0. 1 1 2 2 3 3."),
        ("assistant", "Te leo el teléfono para confirmar: 600 112 233. ¿Es correcto?"),
        ("user", "Sí, es correcto."),
        ("assistant", "Perfecto. ¿En qué dirección y municipio es la visita?"),
        ("user", "En Granada, capital, en la calle Mayor número 10 5º A, código postal 18001."),
        ("assistant", "Gracias. ¿La visita te viene mejor de nueve a doce o de doce a dos?"),
        ("user", "Correcto. De 12 a 2."),
        ("assistant", "Listo, Juan, queda apuntado para mañana de doce a dos."),
        ("user", "Vale, muchas gracias, hasta luego."),
    ]

    async def prueba():
        import time
        for corte in (2, 6, 8, 12, 14, 16):
            t0 = time.time()
            r = await apuntar([{"role": a, "content": b} for a, b in CONV[:corte]])
            print(f"tras {corte:2} frases ({time.time() - t0:.1f} s): {json.dumps(r, ensure_ascii=False)}")

    asyncio.run(prueba())
