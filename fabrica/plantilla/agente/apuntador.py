"""
El apuntador (común a todas las webs): lee la conversación en segundo plano y saca los datos del cliente.

Por qué existe: el cerebro rápido del asistente (Claude Haiku sin pensamiento) se centra en hablar y
casi nunca da las órdenes a la web (medido en Reparo el 22-11-2026: ninguna orden en seis turnos). Así que
rellenar la solicitud, enseñar la página y colgar no dependen de él: después de cada frase del cliente,
esta pieza pregunta aparte, sin frenar la voz, qué datos hay y si el cliente se despide.
Los campos salen de web.json (los mismos de la solicitud de la web). Cuesta unas décimas de céntimo por llamada.
"""

import json
import logging
import os
import re

import anthropic

log = logging.getLogger("fabrica")

CAMPOS: tuple[str, ...] = ()
TIPOS: tuple[str, ...] = ("visita", "llamada")
SISTEMA = ""
TEMAS: list[tuple[str, re.Pattern]] = []


def configurar(web: dict) -> None:
    """Prepara el apuntador con los campos, tipos y criterios de urgencia de la web."""
    global CAMPOS, TIPOS, SISTEMA, TEMAS
    CAMPOS = tuple(c["id"] for c in web["campos"])
    TIPOS = tuple(web.get("tipos") or ("visita", "llamada"))
    asis = web["asistente"]["nombre"].upper()
    lineas = "\n".join(f"- {c['id']}: {c.get('etiqueta') or c['id']}" + (f" ({c['pista']})" if c.get("pista") else "") for c in web["campos"])
    SISTEMA = f"""Eres el apuntador de {web['marca']} ({web.get('sector', '')}). Lees una conversación de voz entre CLIENTE y {asis} (el asistente) y devuelves SOLO un objeto JSON, sin nada más, con lo que el CLIENTE ha dicho hasta ahora.

Campos de datos (omite los que no se sepan; no inventes ni deduzcas nada que el cliente no haya dicho):
{lineas}
- telefono: 9 cifras seguidas, sin espacios

Campos de estado (siempre):
- tipo: {", ".join(f'"{t}"' for t in TIPOS)} ("llamada" si solo quiere que le llamen)
- urgente: true si {web.get('urgente') or 'hay riesgo para las personas o la casa'}
- confirmado: true si el cliente ha aceptado la cita o la llamada Y ha dado por buenos sus datos (por ejemplo, contesta «sí» o «correcto» cuando {asis} le lee el teléfono, o dice que lo ve bien en pantalla)
- se_despide: true SOLO si en su ÚLTIMA frase el cliente se despide o dice que no necesita nada más

La voz se transcribe con errores: une las cifras del teléfono aunque vengan sueltas; si el cliente corrige un dato, vale el último que haya dicho EL CLIENTE.
MUY IMPORTANTE: los datos salen solo de las frases del CLIENTE. Lo que dice {asis} no es un dato. Si el cliente dice que algo «está bien apuntado», no lo cambies."""
    destinos = set(web.get("destinos") or [])
    candidatos = [
        ("garantia", re.compile(r"\bgarant[ií]a", re.I)),
        ("precios", re.compile(r"\b(euros?|€|precio|presupuesto|cuesta|sale por|gratis)", re.I)),
        ("plazo", re.compile(r"\b(plazo|d[ií]as|semanas|meses)\b", re.I)),
        ("zona", re.compile(r"\b(zona|llegamos a|área metropolitana|provincia)\b", re.I)),
    ]
    TEMAS = [(d, p) for d, p in candidatos if d in destinos]


_cliente: anthropic.AsyncAnthropic | None = None


def _api() -> anthropic.AsyncAnthropic:
    global _cliente
    if _cliente is None:
        _cliente = anthropic.AsyncAnthropic(timeout=12.0, max_retries=1)
    return _cliente


async def apuntar(turnos: list[dict], ya: dict | None = None) -> dict:
    """turnos: [{"role": "user"|"assistant", "content": str}]. ya: lo que ya está en pantalla.
    Devuelve el JSON del apuntador ({} si falla: nunca tumba la llamada)."""
    guion = "\n".join(("CLIENTE: " if t["role"] == "user" else "ASISTENTE: ") + t["content"].strip() for t in turnos[-24:] if t["content"].strip())
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
    except Exception as e:
        log.warning("apuntador: no ha contestado bien (%s)", e)
        return {}
    return limpiar(datos, turnos)


def limpiar(datos: dict, turnos: list[dict]) -> dict:
    limpio = {}
    for c in CAMPOS:
        v = datos.get(c)
        if isinstance(v, (str, int)) and str(v).strip() and str(v).strip().lower() not in ("null", "none", "desconocido", "-"):
            limpio[c] = str(v).strip()
    if "telefono" in limpio:
        cifras = re.sub(r"\D", "", limpio["telefono"])
        cifras = cifras[2:] if len(cifras) == 11 and cifras.startswith("34") else cifras
        # Solo vale un teléfono de 9 cifras que haya dicho el CLIENTE (lo que lee el asistente no cuenta).
        dicho = [re.sub(r"\D", "", t["content"]) for t in turnos if t["role"] == "user"]
        hay_cifras = any(len(d) >= 7 for d in dicho)
        if len(cifras) == 9 and (not hay_cifras or any(cifras in d for d in dicho)):
            limpio["telefono"] = cifras
        else:
            del limpio["telefono"]
    limpio["tipo"] = datos.get("tipo") if datos.get("tipo") in TIPOS else TIPOS[0]
    for c in ("urgente", "confirmado", "se_despide"):
        limpio[c] = datos.get(c) is True
    return limpio


def tema_de(texto: str) -> str:
    for destino, patron in TEMAS:
        if patron.search(texto):
            return destino
    return ""
