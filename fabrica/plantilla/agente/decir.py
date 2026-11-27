"""
Prepara el texto de Andrés para decirlo en voz alta.

La voz rápida de ElevenLabs lee mal las cifras, el símbolo del euro y los teléfonos
(los trocea o los lee en otro idioma). Aquí se pasan a palabras, como los diría una
persona de España: «39 €» -> «treinta y nueve euros»; «958 12 34 56» ->
«nueve cinco ocho, uno dos tres, cuatro cinco seis».

Solo cambia lo que se pronuncia; lo que Claude escribe y lo que se guarda no se toca.
Prueba: python decir.py
"""

import re
from typing import AsyncIterable, AsyncIterator

UNIDADES = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
            "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve",
            "veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis",
            "veintisiete", "veintiocho", "veintinueve"]
DECENAS = {30: "treinta", 40: "cuarenta", 50: "cincuenta", 60: "sesenta", 70: "setenta", 80: "ochenta", 90: "noventa"}
CENTENAS = {100: "ciento", 200: "doscientos", 300: "trescientos", 400: "cuatrocientos", 500: "quinientos",
            600: "seiscientos", 700: "setecientos", 800: "ochocientos", 900: "novecientos"}
FEMENINAS = ("hora", "horas", "visita", "visitas", "semana", "semanas", "pieza", "piezas", "marca", "marcas",
             "vez", "veces", "persona", "personas", "llamada", "llamadas", "avería", "averías")


def numero(n: int, genero: str = "") -> str:
    """Número en palabras. genero: "" (uno), "m" (un, delante de nombre masculino) o "f" (una)."""
    if n < 0:
        return "menos " + numero(-n, genero)
    if n >= 1_000_000:
        return str(n)

    def final(texto: str) -> str:
        if genero == "m":
            return re.sub(r"veintiuno$", "veintiún", re.sub(r"\buno$", "un", texto))
        if genero == "f":
            return re.sub(r"veintiuno$", "veintiuna", re.sub(r"\buno$", "una", texto))
        return texto

    def hasta_999(x: int) -> str:
        if x < 30:
            return UNIDADES[x]
        if x < 100:
            d, u = x // 10 * 10, x % 10
            return DECENAS[d] + (" y " + UNIDADES[u] if u else "")
        if x == 100:
            return "cien"
        c, r = x // 100 * 100, x % 100
        return CENTENAS[c] + (" " + hasta_999(r) if r else "")

    if n < 1000:
        return final(hasta_999(n))
    miles, resto = n // 1000, n % 1000
    cab = "mil" if miles == 1 else re.sub(r"veintiuno$", "veintiún", re.sub(r"\buno$", "un", hasta_999(miles))) + " mil"
    return final(cab + (" " + hasta_999(resto) if resto else ""))


def _cifras(d: str) -> str:
    """Dos cifras de teléfono dichas como pareja: 12 -> doce, 05 -> cero cinco, 00 -> cero cero."""
    if len(d) == 2 and d[0] != "0":
        return numero(int(d))
    return " ".join(UNIDADES[int(c)] for c in d)


def _telefono(m: re.Match) -> str:
    d = re.sub(r"\D", "", m.group("num"))
    # 958 123 456 -> «nueve cinco ocho, uno dos tres, cuatro cinco seis»: cifra a cifra y de tres en tres,
    # que es como lo dicta el cliente y como mejor se comprueba de oído
    return ", ".join(" ".join(UNIDADES[int(c)] for c in d[i:i + 3]) for i in (0, 3, 6))


def _euros(entero: str, centimos: str | None) -> str:
    n = int(entero.replace(".", ""))
    txt = numero(n, "m") + (" euro" if n == 1 else " euros")
    if centimos and int(centimos):
        c = int(centimos.ljust(2, "0"))
        txt += " con " + numero(c)
    return txt


NUM = r"\d{1,3}(?:\.\d{3})+|\d+"   # 1.200 o 1200
EURO = r"(?:€|euros?\b|eur\b)"

REGLAS = [
    # teléfonos españoles de 9 cifras, con o sin espacios, puntos o guiones (y prefijo +34 opcional)
    (re.compile(r"(?<![\w\d])(?:\+34[\s.-]?)?(?P<num>[6789](?:[\s.-]?\d){8})(?![\d])"), _telefono),
    # rangos de precio: 80-130 € / entre 80 y 130 € / de 80 a 130 €
    (re.compile(rf"(?P<a>{NUM})\s*(?:[-–—]|a|y)\s*(?P<b>{NUM})\s*{EURO}", re.I),
     lambda m: numero(int(m["a"].replace(".", ""))) + (" a " if re.search(r"[-–—]", m.group(0)) else re.search(r"\s(a|y)\s", m.group(0), re.I).group(0).lower()) + _euros(m["b"], None)),
    # precios: 39 €, 39,50 €, 1.200 euros
    (re.compile(rf"(?P<e>{NUM})(?:,(?P<c>\d{{1,2}}))?\s*{EURO}", re.I), lambda m: _euros(m["e"], m["c"])),
    # porcentajes
    (re.compile(r"(?P<n>\d+)(?:,(?P<d>\d+))?\s*%"),
     lambda m: numero(int(m["n"])) + (" coma " + numero(int(m["d"])) if m["d"] else "") + " por ciento"),
    # plazos: 24-48 h, 24 h
    (re.compile(r"(?P<a>\d+)\s*[-–—]\s*(?P<b>\d+)\s*h(?:oras?)?\b", re.I),
     lambda m: numero(int(m["a"])) + " a " + numero(int(m["b"]), "f") + " horas"),
    (re.compile(r"(?P<a>\d+)\s*h\b"), lambda m: numero(int(m["a"]), "f") + (" hora" if int(m["a"]) == 1 else " horas")),
    # horas del reloj: 9:00 -> nueve, 9:30 -> nueve y media, 13:30 -> trece treinta
    (re.compile(r"(?<!\d)(?P<h>[01]?\d|2[0-3]):(?P<m>[0-5]\d)(?!\d)"),
     lambda m: numero(int(m["h"]), "f") + {"00": "", "30": " y media", "15": " y cuarto"}.get(m["m"], " " + numero(int(m["m"])))),
    # rangos sueltos: 10-12 años
    (re.compile(r"(?<![\w\d])(?P<a>\d{1,4})\s*[-–—]\s*(?P<b>\d{1,4})(?=\s+[a-záéíóúñ])", re.I),
     lambda m: numero(int(m["a"])) + " a " + m["b"]),
]

# números sueltos que no forman parte de un código (E18, F05, WAT28...) ni de un decimal
SUELTO = re.compile(r"(?<![\w\d.,:/-])(?P<n>\d{1,6})(?![\w\d]|[.,:/-]\d)(?P<sig>\s+[a-záéíóúñ]+)?", re.I)


def _suelto(m: re.Match) -> str:
    sig = m["sig"] or ""
    palabra = sig.strip().lower()
    genero = "f" if palabra in FEMENINAS else ("m" if palabra else "")
    return numero(int(m["n"]), genero) + sig


def decir(texto: str) -> str:
    """Devuelve el texto tal como hay que pronunciarlo."""
    for patron, cambio in REGLAS:
        texto = patron.sub(cambio, texto)
    texto = SUELTO.sub(_suelto, texto)
    return texto.replace("€", " euros")


CIFRAS_SUELTAS = re.compile(r"(?<![\d\w])(?:\d[\s.,;-]+){2,}\d(?![\d\w])")


def juntar_cifras(texto: str) -> str:
    """El oído transcribe un teléfono dictado como «6 0 0. 1 1 2 2 3 3». Aquí se junta en «600 112 233»
    antes de que lo lea el cerebro, que al reagrupar cifras sueltas las descolocaba
    (22-11-2026: de 600 112 233 leyó «600 211 332»)."""
    def unir(m: re.Match) -> str:
        d = re.sub(r"\D", "", m.group(0))
        cola = m.group(0)[len(m.group(0).rstrip(" .,;-")):]
        return (f"{d[:3]} {d[3:6]} {d[6:]}" if len(d) == 9 else d) + cola
    return quitar_deletreo(CIFRAS_SUELTAS.sub(unir, texto))


# «B de Barcelona», «V de Valencia», «M de Madrid»: el cliente está deletreando una letra, no nombrando
# una ciudad. El 22-11-2026 un cliente de Granada dijo «quinto B, de Barcelona» y Andrés le contestó
# que su dirección era de Barcelona. Solo se quita si la palabra empieza por esa misma letra.
DELETREO = re.compile(r"(?<![\wáéíóúñÁÉÍÓÚÑ])([A-ZÑ]),?\s+de\s+([A-ZÁÉÍÓÚÑ][\wáéíóúñ]+)")
_SIN_TILDE = str.maketrans("ÁÉÍÓÚ", "AEIOU")


def quitar_deletreo(texto: str) -> str:
    def letra(m: re.Match) -> str:
        return m.group(1) if m.group(2)[0].translate(_SIN_TILDE) == m.group(1) else m.group(0)
    return DELETREO.sub(letra, texto)


# Punto de corte seguro: un signo de puntuación seguido de espacio (fin de frase o de inciso).
# Una cifra, un precio o un teléfono nunca quedan partidos por ahí.
CORTE = re.compile(r"[.,;:!?…)]\s+")


async def para_voz(trozos: AsyncIterable[str]) -> AsyncIterator[str]:
    """Convierte el texto que va llegando a trozos, inciso a inciso, para no partir cifras por la mitad."""
    pendiente = ""
    async for trozo in trozos:
        pendiente += trozo
        cortes = list(CORTE.finditer(pendiente))
        if cortes:
            fin = cortes[-1].end()
            yield decir(pendiente[:fin])
            pendiente = pendiente[fin:]
    if pendiente:
        yield decir(pendiente)


if __name__ == "__main__":
    import asyncio

    CASOS = [
        ("La visita son 39 €, y se descuentan si reparas.", "La visita son treinta y nueve euros, y se descuentan si reparas."),
        ("Suele quedar entre 80 y 130 €.", "Suele quedar entre ochenta y ciento treinta euros."),
        ("Entre 160-260 € la pieza.", "Entre ciento sesenta a doscientos sesenta euros la pieza."),
        ("Son 39,50 euros.", "Son treinta y nueve euros con cincuenta."),
        ("Cuesta 1 € más.", "Cuesta un euro más."),
        ("Unos 1.200 € uno nuevo.", "Unos mil doscientos euros uno nuevo."),
        ("Te apunto el 654 12 34 56, ¿correcto?", "Te apunto el seis cinco cuatro, uno dos tres, cuatro cinco seis, ¿correcto?"),
        ("Llámanos al 958123405.", "Llámanos al nueve cinco ocho, uno dos tres, cuatro cero cinco."),
        ("El +34 600 000 000.", "El seis cero cero, cero cero cero, cero cero cero."),
        ("Vamos en 24-48 h.", "Vamos en veinticuatro a cuarenta y ocho horas."),
        ("Tenemos 20 años de oficio y 3 meses de garantía.", "Tenemos veinte años de oficio y tres meses de garantía."),
        ("Te da el E18 en la Bosch WAT28.", "Te da el E18 en la Bosch WAT28."),
        ("De 9:00 a 13:30.", "De nueve a trece y media."),
        ("Abrimos a las 9:45, de lunes a viernes.", "Abrimos a las nueve cuarenta y cinco, de lunes a viernes."),
        ("¿Te apunto el 654 12 34 56? La visita son 39 €.", "¿Te apunto el seis cinco cuatro, uno dos tres, cuatro cinco seis? La visita son treinta y nueve euros."),
        ("Un 21 % de IVA y 1 hora de trabajo.", "Un veintiuno por ciento de IVA y una hora de trabajo."),
        ("Tiene 21 años.", "Tiene veintiún años."),
    ]
    fallos = 0
    for entrada, esperado in [
        ("Sí, el 6 0 0 1 1 2 2 3 3.", "Sí, el 600 112 233."),
        ("6 0 0. 1 1 2 2 3 3.", "600 112 233."),
        ("Es el 600 11 22 33, apunta.", "Es el 600 11 22 33, apunta."),
        ("Tengo 2 lavadoras y 1 horno.", "Tengo 2 lavadoras y 1 horno."),
        ("Vivo en Avenida de la Constitución número 8, 5º B de Barcelona, 18001.", "Vivo en Avenida de la Constitución número 8, 5º B, 18001."),
        ("Es el tercero V de Valencia.", "Es el tercero V."),
        ("Portal A, de Alicante, segundo.", "Portal A, segundo."),
        ("Soy de Barcelona pero vivo en Granada.", "Soy de Barcelona pero vivo en Granada."),
        ("Vengo de Madrid.", "Vengo de Madrid."),
        ("Es una Bosch de Barcelona.", "Es una Bosch de Barcelona."),
        ("El código postal es 1 8 0 0 1, en Granada.", "El código postal es 18001, en Granada."),
    ]:
        if juntar_cifras(entrada) != esperado:
            fallos += 1
            print(f"MAL juntar_cifras: {entrada} -> {juntar_cifras(entrada)}")
    for entrada, esperado in CASOS:
        salida = decir(entrada)
        ok = salida == esperado
        fallos += not ok
        print(("bien  " if ok else "MAL   ") + entrada + "\n      -> " + salida + ("" if ok else "\n      (esperado: " + esperado + ")"))

    async def a_trozos(texto: str, n: int) -> str:
        async def gen():
            for i in range(0, len(texto), n):
                yield texto[i:i + n]
        return "".join([t async for t in para_voz(gen())])

    for entrada, _ in CASOS:
        for n in (1, 2, 3, 5, 7):
            if asyncio.run(a_trozos(entrada, n)) != decir(entrada):
                fallos += 1
                print(f"MAL a trozos de {n}: {entrada}\n      -> {asyncio.run(a_trozos(entrada, n))}")
    print("\nTodo bien." if not fallos else f"\n{fallos} fallos.")
    raise SystemExit(1 if fallos else 0)
