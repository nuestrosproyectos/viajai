"""
Manual técnico de Andrés para el agente de voz: copia en Python de ../manual.mjs.

Lee conocimiento.json (lo genera `node exportar-instrucciones.mjs` a partir de
../conocimiento.mjs y ../manual.mjs), detecta aparato, marca, código y síntoma en
lo que dice el cliente y devuelve solo las fichas que tocan.
Si cambias la lógica en manual.mjs, cámbiala aquí: `node ../pruebas-manual.mjs`
comprueba que los dos dan el mismo resultado.
"""

import json
import re
import unicodedata
from pathlib import Path

CONTEXTO = "(?:pone|sale|salen|marca|error|codigo|aparece|parpadea|indica|muestra|err)"


def normalizar(t: str) -> str:
    t = unicodedata.normalize("NFD", str(t or "").lower())
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9ñ]+", " ", t).strip()


def clave(c: str) -> str:
    return normalizar(c).replace(" ", "")


class Manual:
    def __init__(self, ruta: Path):
        datos = json.loads(Path(ruta).read_text(encoding="utf-8"))
        d = datos["diccionarios"]
        self.aparatos: dict = d["APARATOS"]
        self.marcas: dict = d["MARCAS"]
        self.numeros: dict = d["NUMEROS"]
        self.letras: dict = d["LETRAS"]
        self.centenas: dict = d["CENTENAS"]
        base = datos["conocimiento"]
        self.fichas = []
        for fam in base["familias"]:
            for c in fam["codigos"]:
                self.fichas.append({**c, "tipo": "codigo", "familia": fam["familia"], "marcas": fam["marcas"],
                                    "claves": [clave(x) for x in c["codigos"]]})
        self.sintomas = []
        for s in base["sintomas"]:
            raices = list(dict.fromkeys(normalizar(x) for x in [s["sintoma"], *s.get("palabras", [])]))
            self.sintomas.append({**s, "tipo": "sintoma", "raices": raices})
        self.marca_a_familia: dict = {}
        for fam in base["familias"]:
            for m in fam["marcas"]:
                self.marca_a_familia.setdefault(m, []).append(fam["familia"])
        self.codigos_conocidos = {k for f in self.fichas for k in f["claves"]}

    # ---- detección ----
    def candidatos_codigo(self, original: str) -> set:
        salida = set()
        palabras = [p for p in normalizar(original).split(" ") if p]
        N, L = self.numeros, self.letras
        conv = []
        i = 0
        while i < len(palabras):
            p = palabras[i]
            C = self.centenas
            sig = lambda k: palabras[k] if k < len(palabras) else ""
            if p in N or p in C:
                if p == "cero" and sig(i + 1) in N and N[sig(i + 1)] < 10:
                    conv.append("0" + str(N[sig(i + 1)]))
                    i += 2
                    continue
                v = 0
                if p in C:
                    v = C[p]
                    if sig(i + 1) not in N:
                        conv.append(str(v))
                        i += 1
                        continue
                    i += 1
                n = N[palabras[i]]
                if n >= 30 and n % 10 == 0 and sig(i + 1) == "y" and sig(i + 2) in N and N[sig(i + 2)] < 10:
                    n += N[sig(i + 2)]
                    i += 2
                conv.append(str(v + n))
            else:
                previa = palabras[i - 1] if i > 0 else ""
                if p in L and i > 0 and re.fullmatch(r"un|una|la|el|pone|sale|marca|error|codigo|aparece|y", previa):
                    conv.append(L[p])
                else:
                    conv.append(p)
            i += 1
        t = " " + " ".join(conv) + " "
        for m in re.finditer(r"(?<= )([a-z]{1,3}) ?(\d{1,3})(?= )", t):
            if re.fullmatch(r"a|y|o|u|de|la|el|en|las|los|un|del|con|por|mas|hay|son|hace|que", m[1]) and not re.search(CONTEXTO + " " + m[1], t):
                continue
            salida.add(m[1] + m[2])
            if len(m[2]) == 1:
                salida.add(m[1] + "0" + m[2])
        for m in re.finditer(r"(?<= )(\d{1,2}) ?([a-z]{1,2})(?= )", t):
            if not re.fullmatch(r"y|o|a|de|en|la|el", m[2]):
                salida.add(m[1] + m[2])
        for w in conv:
            if re.fullmatch(r"[a-z]{1,3}\d{1,3}|\d{1,2}[a-z]{1,2}", w):
                salida.add(w)
        for m in re.finditer(CONTEXTO + r" (?:el |un |una |la )?(\d{1,3})(?= )", t):
            salida.add(m[1])
        for m in re.finditer(r"\b([A-Za-z]{0,2}[A-Z][A-Za-z]{0,2})\b", str(original or ""), flags=re.ASCII):
            if len(m[1]) >= 2:
                salida.add(m[1].lower())
        for m in re.finditer(CONTEXTO + r" (?:un |una |el |la )?([a-z]{1,2}) ([a-z]{1,2})(?= )", t):
            salida.add(m[1] + m[2])
        for m in re.finditer(CONTEXTO + r" (?:un |una |el |la )?([a-z]{2,4})(?= )", t):
            salida.add(m[1])
        return salida

    @staticmethod
    def detectar_en(texto: str, diccionario: dict) -> list:
        n = " " + normalizar(texto) + " "
        hallados = []
        for nombre, formas in diccionario.items():
            pos = max((n.rfind(" " + f + " ") for f in formas), default=-1)
            if pos >= 0:
                hallados.append((nombre, pos))
        hallados.sort(key=lambda h: -h[1])
        return [h[0] for h in hallados]

    @staticmethod
    def mismo_aparato(f: dict, aparato: str) -> bool:
        a = f["aparato"]
        return (not aparato or a == aparato
                or (aparato == "lavadora-secadora" and a in ("lavadora", "secadora"))
                or (aparato == "lavadora" and a == "lavadora-secadora")
                or (aparato == "congelador" and a == "frigorifico") or (aparato == "frigorifico" and a == "congelador"))

    def buscar(self, turnos: list, max_codigos: int = 3, max_sintomas: int = 2) -> dict:
        del_cliente = [t["content"] if isinstance(t.get("content"), str) else "" for t in turnos if t.get("role") == "user"]
        ultimo = del_cliente[-1] if del_cliente else ""
        recientes = " \n ".join(del_cliente[-3:])
        todo = " \n ".join(del_cliente)

        aparato = (self.detectar_en(ultimo, self.aparatos) or self.detectar_en(todo, self.aparatos) or [""])[0]
        nt = " " + normalizar(todo) + " "
        if aparato == "aire" and re.search(r" secadora (de |con )?bomba de calor ", nt) and not re.search(r" (split|aire acondicionado|acondicionado) ", nt):
            aparato = "secadora"
        marca = (self.detectar_en(ultimo, self.marcas) or self.detectar_en(todo, self.marcas) or [""])[0]
        familias = self.marca_a_familia.get(marca, []) if marca else []

        cand = [c for c in self.candidatos_codigo(recientes) if c in self.codigos_conocidos]
        por_codigo = []
        if cand:
            puntuadas = []
            for f in self.fichas:
                if any(k in cand for k in f["claves"]) and self.mismo_aparato(f, aparato):
                    p = (10 if f["familia"] in familias else 0) + (3 if f["aparato"] == aparato else 0) + (1 if f.get("confianza") == "alta" else 0)
                    puntuadas.append((f, p))
            puntuadas.sort(key=lambda x: -x[1])  # orden estable, como en JS
            if familias and any(f["familia"] in familias for f, _ in puntuadas):
                puntuadas = [x for x in puntuadas if x[0]["familia"] in familias]
            por_codigo = [f for f, _ in puntuadas[:max_codigos]]

        n_ult = " " + normalizar(ultimo) + " "
        n_rec = " " + normalizar(recientes) + " "
        puntuados = []
        for s in self.sintomas:
            if not self.mismo_aparato(s, aparato):
                continue
            p = 0.0
            for r in s["raices"]:
                if len(r) < 4:
                    continue
                if " " + r + " " in n_ult:
                    p += 3 + len(r.split(" "))
                elif " " + r + " " in n_rec:
                    p += 1 + len(r.split(" ")) / 2
            if p and aparato and s["aparato"] == aparato:
                p += 2
            if p >= 3:
                puntuados.append((s, p))
        puntuados.sort(key=lambda x: -x[1])
        por_sintoma = [s for s, _ in puntuados[: (1 if por_codigo else max_sintomas)]]

        fichas = por_codigo + por_sintoma
        return {"aparato": aparato, "marca": marca, "fichas": fichas, "texto": self.redactar(fichas, marca, aparato)}

    @staticmethod
    def redactar(fichas: list, marca: str, aparato: str) -> str:
        if not fichas:
            return ""
        lineas = []
        for f in fichas:
            if f["tipo"] == "codigo":
                t = f"- Código {' / '.join(f['codigos'])} en {f['aparato']} ({', '.join(f['marcas'])}): {f['significado']}"
                if f.get("causas"):
                    t += f" Causas habituales: {'; '.join(f['causas'])}."
                if f.get("que_puede_hacer_el_cliente"):
                    t += f" El cliente puede: {f['que_puede_hacer_el_cliente']}"
                if f.get("pieza_probable"):
                    t += f" Pieza que conviene llevar: {f['pieza_probable']}."
                if f.get("confianza") != "alta":
                    t += " (Dato de confianza media: dilo con prudencia, puede variar según el modelo.)"
            else:
                t = f"- Síntoma «{f['sintoma']}» en {f['aparato']}. Causas de más a menos frecuente: {'; '.join(f['causas'])}."
                if f.get("que_puede_hacer_el_cliente"):
                    t += f" El cliente puede comprobar: {f['que_puede_hacer_el_cliente']}"
                if f.get("pieza_probable"):
                    t += f" Piezas que suele llevar el técnico: {f['pieza_probable']}."
                if f.get("urgencia") == "alta":
                    t += " Es urgente."
            lineas.append(t)
        varias = len({f["familia"] for f in fichas if f["tipo"] == "codigo"}) > 1
        cab = "[Manual técnico interno (no lo menciones ni lo leas tal cual; úsalo como tu propio conocimiento)"
        if marca:
            cab += f". Marca detectada: {marca}"
        if aparato:
            cab += f". Aparato: {aparato}"
        if varias and not marca:
            cab += ". El código significa cosas distintas según la marca: pregunta la marca antes de concluir"
        return cab + "]\n" + "\n".join(lineas)
