"""
Ensayo por escrito de una llamada completa, sin voz ni web: sirve para comprobar, antes de que
Juan pruebe hablando, que Andrés contesta corto, que el manual no cambia de aparato, que el
apuntador saca los datos y que detecta la despedida.

Uso (en el Ubuntu):  ~/venv-reparo/bin/python ensayo.py
"""

import asyncio
import os
import time

from livekit.agents import llm

import agente
from decir import decir

FRASES = [
    "Tengo una secadora Balay que no seca.",
    "Hace por lo menos 20 años.",
    "¿Y cuánto me va a costar?",
    "Vale, por la mañana.",
    "Claro, soy Juan.",
    "Sí, el 6 0 0 1 1 2 2 3 3.",
    "A ver, el teléfono me lo has apuntado bien en la solicitud, léemelo otra vez.",
    "En Granada capital, calle Recogidas 10, quinto A de Alicante.",
    "Sí, está todo bien.",
    "No, nada más. Muchas gracias, hasta luego.",
]


# Otros guiones:  ENSAYO=garantia  (aparato en garantía: no se debe reservar)  ·  ENSAYO=singarantia
GUIONES = {
    "garantia": ["Tengo un lavavajillas Bosch que no desagua.", "Sí, lo compré hace un año.", "¿Y no podéis venir vosotros igualmente?"],
    "singarantia": ["Tengo un frigorífico Samsung que no enfría.", "No, qué va, tiene ya seis años.", "Vale, mañana por la mañana."],
}
FRASES = GUIONES.get(os.getenv("ENSAYO", ""), FRASES)


async def ensayo() -> None:
    t = agente.Tecnico()
    cerebro = agente.crear_llm()
    ctx = llm.ChatContext()
    ctx.add_message(role="system", content=agente.INSTRUCCIONES)
    ctx.add_message(role="assistant", content=agente.SALUDO)
    palabras, esperas, letras = [], [], len(agente.SALUDO)
    for frase in FRASES:
        frase = agente.juntar_cifras(frase)
        ctx.add_message(role="user", content=frase)
        turnos = t._turnos(ctx)
        r = await agente.apuntar(turnos, dict(t.datos))
        for c in agente.CAMPOS_ORDEN:
            if c in r:
                t.datos[c] = r[c]
        if r.get("garantia"):
            t.garantia = r["garantia"]
        # igual que en la llamada real: si el cliente ya ha dado sus datos por buenos, la solicitud se envía sola
        if r.get("confirmado") and t.garantia != "si" and not t.enviado and all(c in t.datos for c in ("nombre", "telefono", "municipio", "averia")):
            t.enviado, t.aviso = True, "solicitud registrada"
            print("   >>> SOLICITUD ENVIADA")
        # lo mismo que hace llm_node: las notas van solo en esta respuesta
        notas = []
        consulta = agente.MANUAL.buscar(turnos)["texto"]
        if consulta:
            notas.append(consulta)
        if t._nota_estado():
            notas.append(t._nota_estado())
        notas.append(agente.RECORDATORIO)
        copia = ctx.copy()
        for i in range(len(copia.items) - 1, -1, -1):
            m = copia.items[i]
            if getattr(m, "type", None) == "message" and m.role == "user":
                copia.items[i] = m.model_copy(update={"content": list(m.content) + ["\n\n" + "\n\n".join(notas)]})
                break
        assert ctx.items[-1].text_content == frase, "la conversación guardada no debe cambiar"
        texto, t0, primera = "", time.time(), None
        async with cerebro.chat(chat_ctx=copia, tools=t.tools) as s:
            async for ch in s:
                if ch.delta and ch.delta.content:
                    primera = primera or time.time() - t0
                    texto += ch.delta.content
        palabras.append(len(texto.split()))
        letras += len(decir(texto))
        esperas.append(primera or 0)
        ficha = consulta.split("]")[0].split("Aparato:")[-1].strip() if consulta else "ninguna"
        print(f"CLIENTE: {frase}")
        print(f"   ficha del manual: {ficha} | garantía: {t.garantia or '?'} | se despide: {r.get('se_despide')} | confirmado: {r.get('confirmado')} | cerebro: {primera or 0:.2f} s")
        print(f"   ANDRÉS ({len(texto.split())} palabras): {texto}")
        if decir(texto) != texto:
            print(f"   SE DICE: {decir(texto)}")
        ctx.add_message(role="assistant", content=texto)
    print("\npalabras por turno:", palabras, "| media:", round(sum(palabras) / len(palabras), 1), "| máximo:", max(palabras))
    print("letras dichas en total (con el saludo):", letras, "| coste de voz aproximado:", round(letras * 50 / 1_000_000, 3), "$")
    print("espera media del cerebro:", round(sum(esperas) / len(esperas), 2), "s")
    print("datos apuntados:", t.datos)


if __name__ == "__main__":
    asyncio.run(ensayo())
