#!/usr/bin/env python3
"""Miniatura (1280x720) y 4 Shorts (1080x1920) del vídeo 01 de Mateo, con el material ya hecho (0 € de avatar).
Uso: extras_mateo01.py CARPETA_MATEO CARPETA_FUENTES
CARPETA_MATEO: mateo_heygen.mp4, C1..C3 y V0..V12 (.mp3/.json), cortes_camara.txt. Salida en CARPETA_MATEO/extras.
"""
import json, os, re, sys
from PIL import Image, ImageDraw, ImageFilter

M = os.path.abspath(sys.argv[1]); FU = os.path.abspath(sys.argv[2])
# funciones de dibujo del montaje (rueda, leyenda, fondo, fuentes...)
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'montar_mateo01.py')).read().split('# ---------- guion de montaje')[0]
sys.argv = [sys.argv[0], M, FU]; exec(compile(src, 'montar_mateo01', 'exec'))
OUT = os.path.join(M, 'extras'); TMPX = os.path.join(OUT, 'tmp'); os.makedirs(TMPX, exist_ok=True)
VID = os.path.join(M, 'mateo_heygen.mp4')
cortes = {l.split()[0]: (float(l.split()[1]), float(l.split()[2])) for l in open(os.path.join(M, 'cortes_camara.txt'))}

def cabe(d, t, ruta, tam, maxw=980):
    while d.textlength(t, font=f(ruta, tam)) > maxw and tam > 30: tam -= 4
    return f(ruta, tam)

def sombra_texto(d, xy, t, fuente, color, anchor='mm', off=(4, 5)):
    d.text((xy[0] + off[0], xy[1] + off[1]), t, font=fuente, fill=(0, 0, 0), anchor=anchor); d.text(xy, t, font=fuente, fill=color, anchor=anchor)

# ---------------- MINIATURA ----------------
fr = os.path.join(TMPX, 'cara.png')
sh('ffmpeg', '-v', 'error', '-y', '-ss', '100.5', '-i', VID, '-frames:v', '1', fr)
cara = Image.open(fr).convert('RGB').crop((300, 0, 980, 680)).resize((720, 720), Image.LANCZOS)
mini = fondo().resize((1280, 720), Image.LANCZOS)
mask = Image.new('L', cara.size, 255); md = ImageDraw.Draw(mask)
for i in range(160): md.line([(cara.width - 160 + i, 0), (cara.width - 160 + i, cara.height)], fill=int(255 * (1 - i / 160)))
mini.paste(cara, (-90, 0), mask)
d = ImageDraw.Draw(mini)
# eclipse con corona (el gran evento de 2027)
eco = Image.new('RGBA', (1280, 720), (0, 0, 0, 0)); ed = ImageDraw.Draw(eco); ex, ey = 1150, 120
ed.ellipse([ex - 70, ey - 70, ex + 70, ey + 70], fill=ORO_C + (255,)); eco = eco.filter(ImageFilter.GaussianBlur(16))
mini.paste(eco, (0, 0), eco); d = ImageDraw.Draw(mini); d.ellipse([ex - 52, ey - 52, ex + 52, ey + 52], fill=NOCHE)
sombra_texto(d, (900, 255), '2027', f(BOD, 250), ORO_C)
sombra_texto(d, (900, 425), 'NO SERÁ IGUAL', f(HAN, 54), HUESO)
pill = (690, 480, 1110, 560); d.rounded_rectangle(pill, radius=40, fill=ORO)
d.text(((pill[0] + pill[2]) / 2, (pill[1] + pill[3]) / 2 + 2), 'MIRA TU ASCENDENTE', font=f(HAN, 38), fill=NOCHE, anchor='mm')
d.text((900, 625), 'Los 12 ascendentes · eclipse del 2 de agosto', font=f(BODI, 32), fill=HUESO, anchor='mm')
mini.save(os.path.join(OUT, 'miniatura_mateo01.jpg'), quality=94)

# ---------------- SHORTS ----------------
WV, HV = 1080, 1920
_fv = None
def fondo_v():
    """Cielo nocturno vertical (mismo estilo que el del vídeo, sin estirar las estrellas)."""
    global _fv
    if _fv: return _fv.copy()
    import math, random
    g = Image.new('L', (WV // 4, HV // 4)); gp = g.load()
    for y in range(HV // 4):
        for x in range(WV // 4):
            gp[x, y] = int(255 * max(0, 1 - math.hypot((x * 4 - WV * 0.55) / WV, (y * 4 - HV * 0.42) / HV) * 1.5))
    g = g.resize((WV, HV), Image.BILINEAR)
    im = Image.composite(Image.new('RGB', (WV, HV), AZUL), Image.new('RGB', (WV, HV), NOCHE), g); d = ImageDraw.Draw(im); random.seed(2028)
    for _ in range(950):
        x, y, r = random.uniform(0, WV), random.uniform(0, HV), random.choice([0.6, 0.8, 1, 1, 1.3, 1.8])
        b = random.randint(90, 235); d.ellipse([x - r, y - r, x + r, y + r], fill=(b, b, min(255, b + 15)))
    _fv = im.filter(ImageFilter.GaussianBlur(0.4)); return _fv.copy()

def titular(im, sup, l1, l2='', y=170):
    d = ImageDraw.Draw(im)
    texto(d, (WV // 2, y), sup.upper(), f(HAN, 40), ORO, anchor='mm', esp=10)
    sombra_texto(d, (WV // 2, y + 110), l1, cabe(d, l1, BOD, 92), HUESO)
    if l2: sombra_texto(d, (WV // 2, y + 215), l2, cabe(d, l2, BODI, 80), ORO_C)
    return im

def cartela_final(l2):
    im = fondo_v(); d = ImageDraw.Draw(im)
    texto(d, (WV // 2, 700), 'VÍDEO COMPLETO', f(HAN, 44), ORO, anchor='mm', esp=10)
    d.text((WV // 2, 830), 'Los 12 ascendentes', font=f(BOD, 96), fill=HUESO, anchor='mm')
    d.text((WV // 2, 950), l2, font=f(BODI, 58), fill=ORO_C, anchor='mm')
    texto(d, (WV // 2, 1110), 'EN EL CANAL · ENLACE EN EL PERFIL', f(HAN, 34), HUESO, anchor='mm', esp=4)
    d.text((WV // 2, 1780), 'Mateo es una inteligencia artificial', font=f(HAN, 28), fill=GRIS, anchor='mm')
    return im

def clip_png(im, dur_s, nombre, zoom=0.04):
    png = os.path.join(TMPX, nombre + '.png'); im.save(png); out = os.path.join(TMPX, nombre + '.mp4'); n = max(1, round(dur_s * 25))
    sh('ffmpeg', '-v', 'error', '-y', '-framerate', '25', '-loop', '1', '-t', f'{dur_s:.2f}', '-i', png,
       '-vf', f"scale={WV*2}:{HV*2},zoompan=z='1+{zoom}*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={WV}x{HV}:fps=25,format=yuv420p",
       '-t', f'{dur_s:.2f}', '-c:v', 'libx264', '-crf', '18', '-an', out)
    return out

def clip_mateo(ini, fin, nombre, sup, l1, l2):
    """Mateo en cuadrado (sin perder nitidez) sobre el cielo, con titular arriba."""
    base = titular(fondo_v(), sup, l1, l2); png = os.path.join(TMPX, nombre + '_base.png'); base.save(png)
    out = os.path.join(TMPX, nombre + '.mp4')
    sh('ffmpeg', '-v', 'error', '-y', '-loop', '1', '-framerate', '25', '-t', f'{fin - ini:.2f}', '-i', png, '-ss', f'{ini + OFFSET:.2f}', '-t', f'{fin - ini:.2f}', '-i', VID,
       '-filter_complex', "[1:v]crop=720:720:280:0,scale=1000:1000:flags=lanczos,setsar=1[m];[0:v][m]overlay=40:520,format=yuv420p",
       '-r', '25', '-c:v', 'libx264', '-crf', '18', '-an', out)
    return out

def ass_t(t): return f'0:{int(t // 60):02d}:{t % 60:05.2f}'
def subs(palabras, ini, desp, fin=None, nombre='s'):
    ev, cur = [], []
    for w in palabras:
        if w.get('type') != 'word' or w['start'] < ini - 0.05 or (fin and w['end'] > fin + 0.05): continue
        cur.append(w)
        if len(cur) >= 4 or re.search(r'[.,:;?!]$', w['text']):
            ev.append((cur[0]['start'] - ini + desp, cur[-1]['end'] - ini + desp, ' '.join(x['text'] for x in cur))); cur = []
    if cur: ev.append((cur[0]['start'] - ini + desp, cur[-1]['end'] - ini + desp, ' '.join(x['text'] for x in cur)))
    p = os.path.join(TMPX, nombre + '.ass')
    cab = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {WV}
PlayResY: {HV}

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: S,Hanken Grotesk,64,&H00E6EEF2,&H00FFFFFF,&H30160B08,&H00000000,1,0,0,0,100,100,0,0,3,16,0,2,70,70,250,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    open(p, 'w').write(cab + ''.join(f'Dialogue: 0,{ass_t(a)},{ass_t(b + 0.12)},S,,0,0,0,,{t}\n' for a, b, t in ev)); return p

def unir(videos, audio, a0, a1, desp, total, ass, nombre):
    lista = os.path.join(TMPX, nombre + '.txt'); open(lista, 'w').write(''.join(f"file '{v}'\n" for v in videos))
    out = os.path.join(OUT, nombre + '.mp4')
    sh('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-ss', f'{a0:.2f}', '-t', f'{a1 - a0:.2f}', '-i', audio,
       '-filter_complex', f"[1:a]adelay={int(desp * 1000)}|{int(desp * 1000)},apad,atrim=0:{total:.2f}[a];[0:v]subtitles={ass}:fontsdir={FU}[v]",
       '-map', '[v]', '-map', '[a]', '-t', f'{total:.2f}', '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-movflags', '+faststart', out)
    print('short', nombre, round(total, 1), 's', flush=True)

pal = lambda k: json.load(open(os.path.join(M, k + '.json')))['words']

# Short 1: Mateo, el gancho del vídeo (C1 desde «Hoy vamos a hablar…»)
w = pal('C1'); i0 = next(x['start'] for x in w if x['text'].startswith('Hoy')) - 0.1; i1 = cortes['C1'][1] - cortes['C1'][0]
va = clip_mateo(i0, i1 + 0.3, 's1_mateo', 'Mateo · astrología', '2027 no será igual', 'para tu signo…')
vb = clip_png(cartela_final('¿Cuál es el tuyo?'), 3.2, 's1_fin', zoom=0)
unir([va, vb], os.path.join(M, 'C1.mp3'), i0, i1, 0, (i1 + 0.3 - i0) + 3.2, subs(w, i0, 0, nombre='s1'), 'short1_2027_mira_tu_ascendente')

# Shorts 2–4: un párrafo de la voz en off sobre la rueda en vertical
def short_rueda(clave, ipar, asc, resaltar, sup, l1, l2, gancho_l, nombre, casas_on=True):
    pars = parrafos(clave); ini = inicios(clave, pars); a0 = ini[ipar]; a1 = ini[ipar + 1] if ipar + 1 < len(ini) else dur(os.path.join(M, clave + '.mp3'))
    g = fondo_v(); dg = ImageDraw.Draw(g)
    texto(dg, (WV // 2, 640), sup.upper(), f(HAN, 44), ORO, anchor='mm', esp=12)
    for i, l in enumerate(gancho_l): sombra_texto(dg, (WV // 2, 790 + i * 130), l, cabe(dg, l, BOD if i == 0 else BODI, 118 if i == 0 else 96), HUESO if i == 0 else ORO_C)
    if casas_on and asc in GLIFO: dg.text((WV // 2, 1220), GLIFO[asc], font=f(SIMB, 130), fill=ORO, anchor='mm')
    r = titular(fondo_v(), sup, l1, l2)
    rueda(r, asc, casas_on=casas_on, resaltar=resaltar, cx=WV // 2, cy=930, R=360, leyenda=False)
    poner_leyenda(r, casas_on, x=120, y=1400)
    G = 2.2; vg = clip_png(g, G, nombre + '_g', zoom=0.03); vr = clip_png(r, a1 - a0 + 0.4, nombre + '_r', zoom=0.04)
    vf = clip_png(cartela_final('Busca el tuyo en los capítulos'), 3.2, nombre + '_f', zoom=0)
    total = G + (a1 - a0 + 0.4) + 3.2
    unir([vg, vr, vf], os.path.join(M, clave + '.mp3'), a0, a1, G, total, subs(pal(clave), a0, G, a1, nombre), nombre)

short_rueda('V5', 0, 'Leo', {1}, 'Ascendente Leo', 'El eclipse cae', 'en tu casa 1', ['Ascendente Leo:', '2027 es tuyo'], 'short2_ascendente_leo')
short_rueda('V6', 0, 'Virgo', {12, 1}, 'Ascendente Virgo', 'Júpiter entra en', 'tu ascendente', ['Ascendente Virgo:', 'empieza tu ciclo'], 'short3_ascendente_virgo')
short_rueda('V0', 5, 'Aries', {5, 11}, 'El cielo de 2027', 'Dos eclipses de Sol', '6 feb · 2 ago', ['2 de agosto de 2027:', 'eclipse total en España'], 'short4_eclipse_2_agosto', casas_on=False)
print('OK', sorted(x for x in os.listdir(OUT) if not x.startswith('tmp')))
