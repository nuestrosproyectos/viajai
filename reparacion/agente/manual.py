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


VACIAS = set("de la el los las un una unos unas y o que en por con se me mi mis su sus lo le les al del a muy mucho mucha muchos muchas ya es esta este esto son tiene tengo hay como pero mas cuando todo toda todos sale salen deja dejan hace hacen echa echan esta estan algo".split(" "))


EQUIVALE: dict = {}  # se carga desde conocimiento.json (misma tabla que manual.mjs)


def claves(t: str) -> list:
    """Palabras clave: sin palabras vacías, recortadas a 5 letras y con equivalencias."""
    return [EQUIVALE.get(w[:5], w[:5]) for w in normalizar(t).split(" ") if w and w not in VACIAS]


def cubre(claves_cliente: set, frase: str) -> int:
    c = claves(frase)
    if not c:
        return 0
    hay = sum(1 for w in c if w in claves_cliente)
    return len(c) if hay == len(c) or (len(c) >= 4 and hay >= len(c) - 1) else 0


def frase_flexible(palabras: list, frase: str) -> bool:
    """¿Aparecen las palabras de la frase en orden, con como mucho 2 intercaladas?"""
    f = frase.split(" ")
    for i in range(len(palabras)):
        if palabras[i] != f[0]:
            continue
        j, k, saltos = 1, i + 1, 0
        while j < len(f) and k < len(palabras) and saltos <= 2:
            if palabras[k] == f[j]:
                j += 1
            else:
                saltos += 1
            k += 1
        if j == len(f) and saltos <= 2:
            return True
    return False


class Manual:
    def __init__(self, ruta: Path):
        datos = json.loads(Path(ruta).read_text(encoding="utf-8"))
        d = datos["diccionarios"]
        self.aparatos: dict = d["APARATOS"]
        self.marcas: dict = d["MARCAS"]
        self.numeros: dict = d["NUMEROS"]
        self.letras: dict = d["LETRAS"]
        self.centenas: dict = d["CENTENAS"]
        self.marca_aparato: dict = d["MARCA_APARATO"]
        EQUIVALE.clear()
        EQUIVALE.update(d["EQUIVALE"])
        base = datos["conocimiento"]
        self.fichas = []
        for fam in base["familias"]:
            for c in fam["codigos"]:
                self.fichas.append({**c, "tipo": "codigo", "familia": fam["familia"], "marcas": fam["marcas"],
                                    "claves": [clave(x) for x in c["codigos"]]})
        self.sintomas = []
        for s in base["sintomas"]:
            raices = list(dict.fromkeys(normalizar(x) for x in [re.sub(r"\(.*?\)", "", s["sintoma"]), *s.get("palabras", [])]))
            self.sintomas.append({**s, "tipo": "sintoma", "raices": raices})
        self.marca_a_familia: dict = {}
        for fam in base["familias"]:
            for m in fam["marcas"]:
                self.marca_a_familia.setdefault(m, []).append(fam["familia"])
        self.codigos_conocidos = {k for f in self.fichas for k in f["claves"]}
        # Palabras que no cuentan para relacionar una avería de marca con lo que dice el cliente
        formas = [f for fs in list(self.aparatos.values()) + list(self.marcas.values()) for f in fs]
        self.ignorar = {w for f in formas for w in claves(f)} | set(claves("lavadoras frigorificos lavavajillas secadoras hornos placas calderas modelos aparato aparatos"))
        # Oficio de técnico veterano: diagnóstico guiado, averías típicas por marca, vida útil
        self.oficio_diag, self.oficio_marca, self.oficio_vida = [], [], {}
        for o in base.get("oficio", []):
            for d in o.get("diagnostico", []):
                raices = list(dict.fromkeys(normalizar(x) for x in [re.sub(r"\(.*?\)", "", d["sintoma"]), *d.get("palabras", [])]))
                self.oficio_diag.append({**d, "aparato": o["aparato"], "tipo": "oficio", "raices": raices})
            for a in o.get("averias_por_marca", []):
                self.oficio_marca.append({**a, "aparato": o["aparato"], "tipo": "marca", "marcasN": [normalizar(m) for m in a["marcas"]], "clavesTexto": None})
            if (o.get("vida_util") or {}).get("anos") or o.get("compensa_reparar"):
                self.oficio_vida[o["aparato"]] = {"tipo": "vida", "aparato": o["aparato"], "anos": (o.get("vida_util") or {}).get("anos", ""), "compensa": o.get("compensa_reparar", "")}

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
        if aparato == "aire" and re.search(r" secadora ", nt) and not re.search(r" (split|aire acondicionado|acondicionado) ", nt):
            aparato = "secadora"
        if aparato == "congelador" and re.search(r" (frigorifico|frigo|nevera|combi) ", nt):
            aparato = "frigorifico"
        if not aparato and re.search(r" (el|mi|del|un) aire ", nt):
            aparato = "aire"
        marca = (self.detectar_en(ultimo, self.marcas) or self.detectar_en(todo, self.marcas) or [""])[0]
        if not aparato and marca in self.marca_aparato:
            aparato = self.marca_aparato[marca]
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
            if marca:  # con marca conocida, solo fichas de su familia
                puntuadas = [x for x in puntuadas if x[0]["familia"] in familias]
            if any(f["aparato"] == aparato for f, _ in puntuadas):
                puntuadas = [x for x in puntuadas if x[0]["aparato"] == aparato]
            por_codigo = [f for f, _ in puntuadas[:max_codigos]]

        n_ult = " " + normalizar(ultimo) + " "
        n_rec = " " + normalizar(recientes) + " "
        p_ult, p_rec = n_ult.strip().split(" "), n_rec.strip().split(" ")
        c_ult, c_rec = set(claves(ultimo)), set(claves(recientes))
        def puntuar(s: dict) -> float:
            p = 0.0
            for r in s["raices"]:
                if len(r) < 4:
                    continue
                n = len(r.split(" "))
                if " " + r + " " in n_ult:
                    p += 3 + n
                elif n > 1 and frase_flexible(p_ult, r):
                    p += 2 + n
                elif " " + r + " " in n_rec:
                    p += 1 + n / 2
                elif n > 1 and frase_flexible(p_rec, r):
                    p += 0.5 + n / 2
                else:
                    k = cubre(c_ult, r)
                    if k >= 2:
                        p += 1 + k
                    elif k == 1 and (n == 1 or len(claves(r)[0]) >= 5):
                        p += 3
                    elif cubre(c_rec, r) >= 1:
                        p += 0.5
            if p and aparato and s["aparato"] == aparato:
                p += 2
            return p

        def elegir(lista: list, maximo: int) -> list:
            puntuados = []
            for s in lista:
                if not aparato or not self.mismo_aparato(s, aparato):
                    continue  # sin aparato no se diagnostica por síntoma
                p = puntuar(s)
                if p >= (6 if por_codigo else 3):
                    puntuados.append((s, p))
            if any(s["aparato"] == aparato for s, _ in puntuados):  # primero, el aparato exacto
                puntuados = [x for x in puntuados if x[0]["aparato"] == aparato]
            puntuados.sort(key=lambda x: -x[1])
            return [s for s, _ in puntuados[:maximo]]

        por_oficio = elegir(self.oficio_diag, 1)
        por_sintoma = elegir(self.sintomas, 1 if (por_codigo or por_oficio) else max_sintomas)
        habla_de_edad = re.search(r" (\d+ anos|anos tiene|tiene ya|vieja|viejo|antigua|antiguo|compensa|merece la pena|vale la pena|nueva|nuevo|cambiarla|cambiarlo|comprar) ", n_rec)
        por_marca = []
        if marca and aparato:
            marca_n = normalizar(marca)
            cand = []
            for a in self.oficio_marca:
                if a["aparato"] == aparato and marca_n in a["marcasN"]:
                    p = sum(1 for w in claves(a["averia"]) if len(w) >= 4 and w in c_rec and w not in self.ignorar)
                    seguridad = re.search(r"(retirad|revision|riesgo de incendio|incendio)", normalizar(a["averia"]))
                    p = p + (5 if seguridad else 0) if p >= 2 or (seguridad and (p >= 1 or habla_de_edad)) else 0
                    if p >= 2:
                        cand.append((a, p))
            cand.sort(key=lambda x: -x[1])
            por_marca = [a for a, _ in cand[:1]]
        por_vida = [self.oficio_vida[aparato]] if habla_de_edad and aparato and aparato in self.oficio_vida else []

        fichas = por_codigo + por_sintoma + por_oficio + por_marca + por_vida
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
            elif f["tipo"] == "oficio":
                pregs = (f.get("preguntas_clave") or [])[:2]
                t = f"- Cómo lo afinaría un técnico veterano («{f['sintoma']}»): "
                if pregs:
                    t += f"pregunta primero «{pregs[0]}»" + (f" y, si hace falta, «{pregs[1]}»" if len(pregs) > 1 else "") + ". "
                t += f.get("como_descartan") or ""
                if f.get("pruebas_tecnico"):
                    t += f" En casa el técnico: {'; '.join(f['pruebas_tecnico'][:3])}."
                if f.get("pieza_a_llevar"):
                    t += f" Pieza a llevar: {f['pieza_a_llevar']}."
            elif f["tipo"] == "marca":
                t = f"- Avería típica documentada en {', '.join(f['marcas'])}" + (f" ({f['epoca']})" if f.get("epoca") else "") + f": {f['averia']}"
                if f.get("confianza") != "alta":
                    t += " (confianza media: dilo con prudencia)"
            elif f["tipo"] == "vida":
                t = "- " + (f"Vida útil media de {f['aparato']}: {f['anos']} años. " if re.search(r"\d", f["anos"] or "") else "") + f"Cuándo compensa reparar: {f['compensa']}"
            else:
                t = f"- Síntoma «{f['sintoma']}» en {f['aparato']}. Causas de más a menos frecuente: {'; '.join(f['causas'])}."
                if f.get("que_puede_hacer_el_cliente"):
                    t += f" El cliente puede comprobar: {f['que_puede_hacer_el_cliente']}"
                if f.get("pieza_probable"):
                    t += f" Piezas que suele llevar el técnico: {f['pieza_probable']}."
                if f.get("urgencia") == "alta":
                    t += " Es urgente."
            lineas.append(t)
        hay_codigo = any(f["tipo"] == "codigo" for f in fichas)
        cab = "[Manual técnico interno (no lo menciones ni lo leas tal cual; úsalo como tu propio conocimiento)"
        if aparato:
            cab += f". Aparato: {aparato}"
        if marca:
            cab += f". Marca: {marca}"
        else:
            cab += ". Falta la marca: si el cliente aún no la ha dicho, pregúntala antes de explicar nada"
            if hay_codigo:
                cab += " (el mismo código significa cosas distintas según la marca)"
        return cab + "]\n" + "\n".join(lineas)
