#!/usr/bin/env python3
"""Montaje del vídeo 01 de Mateo: «2027 no va a ser igual para tu signo… mira tu ASCENDENTE».
Uso: montar_mateo01.py CARPETA_TRABAJO CARPETA_FUENTES
CARPETA_TRABAJO debe tener: mateo_heygen.mp4 (HeyGen horizontal), C1..C3.mp3/json, V0..V12.mp3/json y cortes_camara.txt.
Estética de Mateo: azul noche y latón dorado (Lía es granate). Gráficos 100 % generados aquí (gratis).
"""
import json, math, os, random, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

T = os.path.abspath(sys.argv[1]); FUENTES = os.path.abspath(sys.argv[2])
W, H = 1920, 1080
NOCHE = (8, 11, 22); AZUL = (22, 32, 60); ORO = (205, 168, 96); ORO_C = (232, 205, 150); HUESO = (238, 230, 216); GRIS = (148, 154, 172)
OUT = os.path.join(T, 'final'); TMP = os.path.join(T, 'tmp'); os.makedirs(OUT, exist_ok=True); os.makedirs(TMP, exist_ok=True)
BOD = os.path.join(FUENTES, 'BodoniModa.ttf'); BODI = os.path.join(FUENTES, 'BodoniModa-Italic.ttf'); HAN = os.path.join(FUENTES, 'HankenGrotesk.ttf')
SIMB = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
OFFSET = float(os.environ.get('OFFSET_HEYGEN', '0.8'))
f = lambda p, s: ImageFont.truetype(p, s)

def sh(*a):
    r = subprocess.run(a, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-2000:]); raise SystemExit('fallo: ' + ' '.join(a[:6]))
    return r.stdout
def dur(p): return float(sh('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p))

SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
GLIFO = dict(zip(SIGNOS, '♈♉♊♋♌♍♎♏♐♑♒♓'))
TEMAS = {1: 'Quién eres y cómo te muestras', 2: 'Lo que tienes y lo que vales', 3: 'Comunicación y entorno cercano', 4: 'Hogar, familia y raíces',
         5: 'Amor, creatividad y disfrute', 6: 'Rutinas y trabajo diario', 7: 'Pareja y socios', 8: 'Lo compartido y la intimidad',
         9: 'Viajes, estudios y creencias', 10: 'Vocación y carrera', 11: 'Amistades y proyectos', 12: 'Mundo interior y cierre de ciclos'}
# Cielo de 2027 (comprobado con efemérides, ver guion): planeta -> signo
PLANETAS = [('♄', 'Aries'), ('♆', 'Aries'), ('♅', 'Géminis'), ('♃', 'Leo'), ('♇', 'Acuario')]
ECLIPSES = [('Acuario', '6 feb'), ('Leo', '2 ago')]
casa = lambda asc, signo: (SIGNOS.index(signo) - SIGNOS.index(asc)) % 12 + 1

# ---------- fondo: cielo nocturno ----------
_fondo = None
def fondo():
    global _fondo
    if _fondo: return _fondo.copy()
    im = Image.new('RGB', (W, H), NOCHE); px = im.load()
    for y in range(H):
        for x in range(0, W, 2):
            d = math.hypot((x - W * 0.62) / W, (y - H * 0.45) / H)
            c = tuple(int(NOCHE[i] + (AZUL[i] - NOCHE[i]) * max(0, 1 - d * 1.7)) for i in range(3)); px[x, y] = c
            if x + 1 < W: px[x + 1, y] = c
    d = ImageDraw.Draw(im); random.seed(2027)
    for _ in range(900):
        x, y, r = random.uniform(0, W), random.uniform(0, H), random.choice([0.6, 0.8, 1, 1, 1.3, 1.8])
        b = random.randint(90, 235); d.ellipse([x - r, y - r, x + r, y + r], fill=(b, b, min(255, b + 15)))
    _fondo = im.filter(ImageFilter.GaussianBlur(0.4)); return _fondo.copy()

def texto(d, xy, t, fuente, color, anchor='la', esp=0):
    if not esp: d.text(xy, t, font=fuente, fill=color, anchor=anchor); return
    anchos = [d.textlength(c, font=fuente) for c in t]; tw = sum(anchos) + esp * (len(t) - 1)
    x = xy[0] - (tw / 2 if anchor[0] == 'm' else 0)
    for c, a in zip(t, anchos): d.text((x, xy[1]), c, font=fuente, fill=color, anchor='l' + anchor[1]); x += a + esp

def partir(d, t, fuente, ancho):
    lineas, cur = [], ''
    for p in t.split():
        if d.textlength((cur + ' ' + p).strip(), font=fuente) > ancho: lineas.append(cur); cur = p
        else: cur = (cur + ' ' + p).strip()
    return lineas + [cur]

# ---------- rueda del zodiaco ----------
def rueda(im, asc='Aries', casas_on=True, resaltar=(), planetas=PLANETAS, eclipses=ECLIPSES, cx=600, cy=520, R=400):
    """Ascendente a la izquierda (9 en punto); casas en sentido antihorario, como en una carta astral."""
    capa = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(capa)
    P = lambda th, r: (cx + r * math.cos(math.radians(th)), cy - r * math.sin(math.radians(th)))
    r1, r2, r3 = R, R * 0.80, R * 0.36
    for k in range(1, 13):
        a0 = 180 + (k - 1) * 30
        if k in resaltar:
            pts = [P(a0 + t, r1) for t in range(0, 31, 2)] + [P(a0 + 30 - t, r3) for t in range(0, 31, 2)]
            d.polygon(pts, fill=ORO + (70,))
    d.ellipse([cx - r1, cy - r1, cx + r1, cy + r1], outline=ORO + (230,), width=3)
    d.ellipse([cx - r2, cy - r2, cx + r2, cy + r2], outline=ORO + (150,), width=2)
    d.ellipse([cx - r3, cy - r3, cx + r3, cy + r3], outline=ORO + (150,), width=2)
    for k in range(12):
        th = 180 + k * 30; d.line([P(th, r3), P(th, r1)], fill=ORO + (120,), width=2)
    g = f(SIMB, 46); gp = f(SIMB, 50); num = f(HAN, 26)
    for k in range(1, 13):
        mid = 180 + (k - 1) * 30 + 15; signo = SIGNOS[(SIGNOS.index(asc) + k - 1) % 12]
        on = k in resaltar
        d.text(P(mid, (r1 + r2) / 2), GLIFO[signo], font=g, fill=(ORO_C if on else ORO) + (255,), anchor='mm')
        if casas_on: d.text(P(mid, r3 + 26), str(k), font=num, fill=(HUESO if on else GRIS) + (255,), anchor='mm')
    # planetas en su signo (repartidos dentro del sector)
    porsig = {}
    for gl, s in planetas: porsig.setdefault(s, []).append(gl)
    for s, gls in porsig.items():
        k = casa(asc, s); base = 180 + (k - 1) * 30
        for i, gl in enumerate(gls):
            th = base + 30 * (i + 1) / (len(gls) + 1)
            on = k in resaltar
            d.text(P(th, (r2 + r3) / 2 + 18), gl, font=gp, fill=(HUESO if on else ORO_C) + (255 if on else 200,), anchor='mm')
    for s, fecha in eclipses:   # eclipse: disco oscuro con corona
        k = casa(asc, s); th = 180 + (k - 1) * 30 + (8 if s == 'Leo' else 22); x, y = P(th, r3 + 62)
        d.ellipse([x - 15, y - 15, x + 15, y + 15], fill=ORO + (220,)); d.ellipse([x - 12, y - 12, x + 12, y + 12], fill=NOCHE + (255,))
    # marca del ascendente
    x, y = P(180, r1 + 34); d.text((x, y), 'ASC', font=f(HAN, 26), fill=ORO_C + (255,), anchor='mm')
    sombra = capa.filter(ImageFilter.GaussianBlur(6))
    im.paste(Image.new('RGB', (W, H), ORO), (0, 0), sombra.split()[3].point(lambda v: v // 5))
    im.paste(capa, (0, 0), capa)
    return im

def panel(im, sup, titulo, linea2='', linea3='', x=1130, y=300, ancho=680):
    d = ImageDraw.Draw(im)
    texto(d, (x, y), sup.upper(), f(HAN, 28), ORO, esp=6)
    yy = y + 56
    for l in partir(d, titulo, f(BOD, 74), ancho): d.text((x, yy), l, font=f(BOD, 74), fill=HUESO); yy += 90
    d.line([(x, yy + 16), (x + 120, yy + 16)], fill=ORO, width=2); yy += 44
    for l in partir(d, linea2, f(BODI, 44), ancho) if linea2 else []: d.text((x, yy), l, font=f(BODI, 44), fill=ORO_C); yy += 58
    for l in partir(d, linea3, f(HAN, 32), ancho) if linea3 else []: d.text((x, yy + 10), l, font=f(HAN, 32), fill=GRIS); yy += 44
    return im

def lamina_titulo(asc):
    im = fondo(); d = ImageDraw.Draw(im)
    texto(d, (W // 2, 330), 'ASCENDENTE', f(HAN, 38), ORO, anchor='mm', esp=14)
    d.text((W // 2, 520), asc, font=f(BOD, 190), fill=HUESO, anchor='mm')
    d.text((W // 2, 720), GLIFO[asc], font=f(SIMB, 110), fill=ORO, anchor='mm')
    texto(d, (W // 2, 840), 'TU 2027', f(HAN, 30), GRIS, anchor='mm', esp=10)
    return im

def lamina_tema(asc, tema, consejo=''):
    im = fondo()
    if tema == 'SN':
        k = casa(asc, 'Aries'); rueda(im, asc, resaltar={k})
        return panel(im, f'Ascendente {asc}', 'Saturno y Neptuno en Aries', f'Casa {k} · {TEMAS[k]}', 'Todo el año 2027')
    if tema == 'U':
        k = casa(asc, 'Géminis'); rueda(im, asc, resaltar={k})
        return panel(im, f'Ascendente {asc}', 'Urano en Géminis', f'Casa {k} · {TEMAS[k]}', 'Cambios y novedades')
    if tema == 'J':
        a, b = casa(asc, 'Leo'), casa(asc, 'Virgo'); rueda(im, asc, resaltar={a, b})
        return panel(im, f'Ascendente {asc}', 'Júpiter y el eclipse total', f'Casa {a}; desde el 27 de julio, casa {b}', f'Eclipse total del 2 de agosto en tu casa {a}: {TEMAS[a].lower()}')
    if tema == 'P':
        k = casa(asc, 'Acuario'); rueda(im, asc, resaltar={k})
        return panel(im, f'Ascendente {asc}', 'Plutón y el eclipse de febrero', f'Casa {k} · {TEMAS[k]}', 'Eclipse anular del 6 de febrero')
    rueda(im, asc)
    return panel(im, f'Ascendente {asc}', 'Mi consejo', consejo)

# ---------- el cielo de 2027 (V0) ----------
def lamina_cielo(paso):
    im = fondo()
    nat = dict(planetas=PLANETAS, eclipses=ECLIPSES)
    if paso == 'intro':
        rueda(im, 'Aries', casas_on=False, **nat); return panel(im, 'El cielo de 2027', 'El mapa del año', 'Cinco claves, sin tecnicismos', 'Posiciones calculadas con efemérides de la NASA (JPL)')
    if paso == 'SN':
        rueda(im, 'Aries', casas_on=False, resaltar={1}, **nat); return panel(im, 'Clave 1', 'Saturno y Neptuno en Aries', 'Bajar un sueño a tierra', 'Juntos todo el año. Saturno construye; Neptuno inspira.')
    if paso == 'U':
        rueda(im, 'Aries', casas_on=False, resaltar={3}, **nat); return panel(im, 'Clave 2', 'Urano en Géminis', 'Cambios que llegan sin avisar', 'Ideas, comunicación y aprendizaje')
    if paso == 'J':
        rueda(im, 'Aries', casas_on=False, resaltar={5, 6}, **nat); return panel(im, 'Clave 3', 'Júpiter: de Leo a Virgo', 'Cambia de signo el 27 de julio', 'Un año con dos mitades')
    if paso == 'P':
        rueda(im, 'Aries', casas_on=False, resaltar={11}, **nat); return panel(im, 'Clave 4', 'Plutón en Acuario', 'Transformación lenta y de fondo', 'Seguirá ahí muchos años')
    if paso == 'E':
        rueda(im, 'Aries', casas_on=False, resaltar={5, 11}, **nat); return panel(im, 'Clave 5', 'Dos eclipses de Sol', '6 de febrero en Acuario · 2 de agosto en Leo', 'El del 2 de agosto, total en Cádiz y Málaga')
    rueda(im, 'Aries', casas_on=False, **nat); return panel(im, 'Y ahora', 'Tu ascendente lo cambia todo', 'Cada planeta cae en una casa distinta', 'Busca el tuyo en los capítulos')

def lamina_cierre():
    im = fondo(); d = ImageDraw.Draw(im)
    texto(d, (W // 2, 360), 'TU CARTA ASTRAL', f(HAN, 36), ORO, anchor='mm', esp=12)
    d.text((W // 2, 500), 'Calcúlala gratis', font=f(BOD, 130), fill=HUESO, anchor='mm')
    d.text((W // 2, 640), 'Enlace en la descripción', font=f(BODI, 52), fill=ORO_C, anchor='mm')
    texto(d, (W // 2, 790), 'MATEO · ASTROLOGÍA', f(HAN, 28), GRIS, anchor='mm', esp=10)
    return im

# ---------- vídeo ----------
def seg_imagen(nombre, im, dur_s, zoom=0.03, fade_in=0.35, fade_out=0.35):
    png = os.path.join(TMP, nombre + '.png'); out = os.path.join(TMP, nombre + '.mp4'); im.save(png)
    n = max(1, round(dur_s * 25))
    vf = (f"scale={W*2}:{H*2},zoompan=z='1+{zoom}*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps=25,"
          f"fade=t=in:st=0:d={fade_in},fade=t=out:st={max(0, dur_s - fade_out):.2f}:d={fade_out},format=yuv420p")
    sh('ffmpeg', '-v', 'error', '-y', '-loop', '1', '-framerate', '25', '-i', png, '-vf', vf, '-t', f'{dur_s:.3f}', '-r', '25', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', out)
    return out

def con_audio(nombre, videos, audio, total):
    lista = os.path.join(TMP, nombre + '_l.txt'); open(lista, 'w').write(''.join(f"file '{v}'\n" for v in videos))
    out = os.path.join(TMP, nombre + '.mp4')
    sh('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-i', audio, '-filter_complex', f'[1:a]apad,atrim=0:{total:.3f}[a]',
       '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-ar', '44100', '-t', f'{total:.3f}', out)
    return out

def seg_mateo(nombre, ini, fin, audio):
    out = os.path.join(TMP, nombre + '.mp4'); d = dur(audio)
    vf = "[0:v]scale=1920:1080:flags=lanczos,setsar=1,fade=t=in:st=0:d=0.3,format=yuv420p[v]"
    sh('ffmpeg', '-v', 'error', '-y', '-ss', f'{ini + OFFSET:.3f}', '-t', f'{d:.3f}', '-i', os.path.join(T, 'mateo_heygen.mp4'), '-i', audio,
       '-filter_complex', vf, '-map', '[v]', '-map', '1:a', '-t', f'{d:.3f}', '-r', '25', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium',
       '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-ar', '44100', out)
    return out

norm = lambda x: re.findall(r'\w+', x.lower())
def parrafos(clave):
    g = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'guion-m01-2027-ascendente.md')).read() + '\n\n## FIN'
    return re.search(rf'## {clave} · [^\n]*\n\n(.*?)\n\n##', g, re.S).group(1).strip().split('\n')

def inicios(clave, pars):
    """Segundo en que empieza cada párrafo, buscando sus 3 primeras palabras en la transcripción con tiempos."""
    pal = [w for w in json.load(open(os.path.join(T, clave + '.json')))['words'] if w.get('type') == 'word']
    tx = [norm(w['text'])[0] if norm(w['text']) else '' for w in pal]
    out, j = [0.0], 0
    for p in pars[1:]:
        q = norm(p)[:3]
        for i in range(j + 1, len(tx) - 2):
            if tx[i:i + 3] == q: out.append(pal[i]['start'] - 0.15); j = i; break
        else: raise SystemExit(f'{clave}: no encuentro el párrafo «{" ".join(q)}»')
    return out

def tema_de(p):
    claves = [('Mi consejo', 'C'), ('Saturno', 'SN'), ('Urano', 'U'), ('Júpiter', 'J'), ('eclipse del dos de agosto', 'J'), ('Plutón', 'P'), ('eclipse de febrero', 'P'), ('eclipse del seis de febrero', 'P')]
    hits = [(p.find(k), t) for k, t in claves if k in p]
    return min(hits)[1]

def ass_tiempo(t): h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60; return f'{h}:{m:02d}:{s:05.2f}'
def bloques(palabras, ini):
    out, cur = [], []
    for w in palabras:
        if w.get('type') != 'word': continue
        cur.append(w); txt = ' '.join(x['text'] for x in cur)
        if len(cur) >= 7 or len(txt) > 42 or re.search(r'[.,:;?!]$', w['text']):
            out.append((ini + cur[0]['start'], ini + cur[-1]['end'], txt)); cur = []
    if cur: out.append((ini + cur[0]['start'], ini + cur[-1]['end'], ' '.join(x['text'] for x in cur)))
    return out

# ---------- guion de montaje ----------
cortes = {l.split()[0]: (float(l.split()[1]), float(l.split()[2])) for l in open(os.path.join(T, 'cortes_camara.txt'))}
plan = [('mateo', 'C1'), ('voz', 'V0'), ('mateo', 'C2')] + [('voz', f'V{i}') for i in range(1, 13)] + [('mateo', 'C3'), ('img', 'cierre')]
CAPS = {'C1': 'Presentación', 'V0': 'El cielo de 2027', 'C2': 'Por qué tu ascendente', 'C3': 'Despedida'}
CAPS.update({f'V{i}': f'Ascendente {SIGNOS[i - 1]}' for i in range(1, 13)})
PASOS_V0 = ['intro', 'SN', 'U', 'J', 'P', 'E', 'fin']

segs, subs, t, caps = [], [], 0.0, []
for tipo, k in plan:
    if tipo == 'mateo':
        a = os.path.join(T, k + '.mp3'); s = seg_mateo('M_' + k, *cortes[k], a)
        subs += bloques(json.load(open(os.path.join(T, k + '.json')))['words'], t)
    elif tipo == 'voz':
        a = os.path.join(T, k + '.mp3'); total = dur(a) + 0.8; pars = parrafos(k); ini = inicios(k, pars) + [total]
        vids = []
        for i, p in enumerate(pars):
            dd = ini[i + 1] - ini[i]
            if k == 'V0': im = lamina_cielo(PASOS_V0[i] if i < len(PASOS_V0) else 'fin'); vids.append(seg_imagen(f'{k}_{i}', im, dd))
            else:
                asc = SIGNOS[int(k[1:]) - 1]; tm = tema_de(p)
                im = lamina_tema(asc, tm, re.sub(r'^Mi consejo( para ti)?:\s*', '', p) if tm == 'C' else '')
                if i == 0:   # 2,6 s de cartela con el nombre del ascendente y luego la rueda
                    vids.append(seg_imagen(f'{k}_t', lamina_titulo(asc), 2.6, zoom=0.02)); vids.append(seg_imagen(f'{k}_{i}', im, dd - 2.6))
                else: vids.append(seg_imagen(f'{k}_{i}', im, dd))
        s = con_audio('S_' + k, vids, a, total)
        subs += bloques(json.load(open(os.path.join(T, k + '.json')))['words'], t)
    else:
        s = seg_imagen('I_' + k, lamina_cierre(), 8.0, zoom=0.02)
        s2 = os.path.join(TMP, 'I_cierre_a.mp4')
        sh('ffmpeg', '-v', 'error', '-y', '-i', s, '-f', 'lavfi', '-t', '8', '-i', 'anullsrc=r=44100:cl=stereo', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', s2); s = s2
    caps.append((t, k)); segs.append(s); t += dur(s); print(f'{t:7.1f}s  {os.path.basename(s)}', flush=True)

lista = os.path.join(TMP, 'lista.txt'); open(lista, 'w').write(''.join(f"file '{s}'\n" for s in segs))
ass = os.path.join(TMP, 'subs.ass')
cab = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caja,Hanken Grotesk,46,&H00E6EEF2,&H00FFFFFF,&H38160B08,&H00000000,0,0,0,0,100,100,0,0,3,14,0,2,160,160,36,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
open(ass, 'w').write(cab + ''.join(f'Dialogue: 0,{ass_tiempo(a)},{ass_tiempo(b + 0.15)},Caja,,0,0,0,,{x}\n' for a, b, x in subs))
final = os.path.join(OUT, 'mateo01_2027_ascendente.mp4')
sh('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-vf', f"subtitles={ass}:fontsdir={FUENTES}",
   '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', final)
print('FINAL', final, round(dur(final), 1), 's')
mins = lambda x: f"{int(x // 60)}:{int(x % 60):02d}"
open(os.path.join(OUT, 'capitulos.txt'), 'w').write('\n'.join(f"{mins(a)} {CAPS[k]}" for a, k in caps if k in CAPS) + '\n')
print(open(os.path.join(OUT, 'capitulos.txt')).read())
