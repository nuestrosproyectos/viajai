#!/usr/bin/env python3
"""Miniatura (1280x720) y 4 Shorts verticales (1080x1920) del vídeo 02, reutilizando el material ya hecho (0 € de avatar).
Uso: extras_video02.py CARPETA_YT02 CARPETA_FUENTES
CARPETA_YT02 contiene: heygen/lia_heygen.mp4, A1.mp3/.json, M1_3/M2_3/M3_3 .mp3/.json, cartas/*_es.jpg, cartas/dorso_rws.jpg
"""
import json, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

Y = os.path.abspath(sys.argv[1]); FU = os.path.abspath(sys.argv[2])
OUT = os.path.join(Y, 'extras'); os.makedirs(OUT, exist_ok=True)
TMP = os.path.join(OUT, 'tmp'); os.makedirs(TMP, exist_ok=True)
BOD = os.path.join(FU, 'BodoniModa.ttf'); BODI = os.path.join(FU, 'BodoniModa-Italic.ttf'); HAN = os.path.join(FU, 'HankenGrotesk.ttf')
HUESO = (236, 228, 214); GRIS = (181, 172, 160); GRANATE = (122, 28, 42)
f = lambda p, s: ImageFont.truetype(p, s)
LIA = os.path.join(Y, 'heygen', 'lia_heygen.mp4'); OFF = 0.8

def sh(*a):
    r = subprocess.run(a, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-1500:]); raise SystemExit('fallo')
    return r.stdout

def fondo(w, h):
    im = Image.new('RGB', (w, h)); px = im.load(); cx, cy = w / 2, h * 0.42
    for y in range(h):
        for x in range(w):
            d = min(1, (((x - cx) / (w * 0.7)) ** 2 + ((y - cy) / (h * 0.7)) ** 2) ** 0.5); k = (1 - d) ** 1.6
            px[x, y] = (int(8 + 52 * k), int(6 + 12 * k), int(7 + 16 * k))
    return im

def centrado(d, y, t, fnt, col, cx, esp=0, sombra=False):
    anchos = [d.textlength(c, font=fnt) for c in t]; tw = sum(anchos) + esp * (len(t) - 1); x = cx - tw / 2
    for c, a in zip(t, anchos):
        if sombra: d.text((x + 4, y + 5), c, font=fnt, fill=(0, 0, 0))
        d.text((x, y), c, font=fnt, fill=col); x += a + esp

def carta(nombre, h):
    im = Image.open(os.path.join(Y, 'cartas', nombre)).convert('RGB'); return im.resize((int(h * im.width / im.height), h), Image.LANCZOS)

def pegar(base, c, x, y):
    s = Image.new('RGBA', (c.width + 90, c.height + 90), (0, 0, 0, 0)); ImageDraw.Draw(s).rectangle([45, 60, c.width + 45, c.height + 60], fill=(0, 0, 0, 180))
    s = s.filter(ImageFilter.GaussianBlur(24)); base.paste(s, (x - 45, y - 45), s)
    base.paste(Image.new('RGB', (c.width + 8, c.height + 8), HUESO), (x - 4, y - 4)); base.paste(c, (x, y))

# ---------------- MINIATURA ----------------
fr = os.path.join(TMP, 'cara.png')
sh('ffmpeg', '-v', 'error', '-y', '-ss', '19.7', '-i', LIA, '-frames:v', '1', fr)
cara = Image.open(fr).convert('RGB')                       # 720x1280
cara = cara.crop((0, 40, 720, 40 + 900)).resize((640, 800), Image.LANCZOS)
mini = fondo(1280, 720)
mascara = Image.new('L', cara.size, 255); md = ImageDraw.Draw(mascara)
for i in range(120): md.line([(cara.width - 120 + i, 0), (cara.width - 120 + i, cara.height)], fill=int(255 * (1 - i / 120)))
mini.paste(cara, (0, -20), mascara)
d = ImageDraw.Draw(mini)
centrado(d, 70, '¿QUÉ SIENTE', f(BOD, 88), HUESO, 950, sombra=True)
centrado(d, 170, 'POR TI?', f(BOD, 118), HUESO, 950, sombra=True)
pill = (790, 318, 1110, 378); d.rounded_rectangle(pill, radius=30, fill=GRANATE)
centrado(d, 330, 'AHORA MISMO', f(HAN, 34), HUESO, 950, esp=4)
dorso = carta('dorso_rws.jpg', 190); xs = [742, 892, 1042]
for i, x in enumerate(xs):
    pegar(mini, dorso, x - dorso.width // 2 + 0, 430)
    centrado(d, 632, str(i + 1), f(BOD, 54), HUESO, x)
mini.save(os.path.join(OUT, 'miniatura_video02.jpg'), quality=94)

# ---------------- SHORTS ----------------
W, H = 1080, 1920
def ass_t(t): return f'0:{int(t // 60):02d}:{t % 60:05.2f}'
def subs_ass(palabras, ini, desp, fin=None):
    ev, cur = [], []
    for w in palabras:
        if w.get('type') != 'word' or w['start'] < ini or (fin and w['end'] > fin + 0.05): continue
        cur.append(w)
        if len(cur) >= 4 or re.search(r'[.,:;?!]$', w['text']):
            ev.append((cur[0]['start'] - ini + desp, cur[-1]['end'] - ini + desp, ' '.join(x['text'] for x in cur))); cur = []
    if cur: ev.append((cur[0]['start'] - ini + desp, cur[-1]['end'] - ini + desp, ' '.join(x['text'] for x in cur)))
    return ev

def ass_file(ev, nombre):
    p = os.path.join(TMP, nombre + '.ass')
    cab = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: S,Hanken Grotesk,74,&H00D6E4EC,&H00FFFFFF,&H00100A0A,&H8C0A0A0C,1,0,0,0,100,100,0,0,1,4,3,2,80,80,430,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    open(p, 'w').write(cab + ''.join(f'Dialogue: 0,{ass_t(a)},{ass_t(b + 0.12)},S,,0,0,0,,{t}\n' for a, b, t in ev)); return p

def png_clip(im, dur_s, nombre, zoom=0.04):
    png = os.path.join(TMP, nombre + '.png'); im.save(png); out = os.path.join(TMP, nombre + '.mp4'); n = round(dur_s * 25)
    sh('ffmpeg', '-v', 'error', '-y', '-framerate', '25', '-loop', '1', '-t', f'{dur_s:.2f}', '-i', png,
       '-vf', f"scale={W*2}:{H*2},zoompan=z='1+{zoom}*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps=25,format=yuv420p",
       '-t', f'{dur_s:.2f}', '-c:v', 'libx264', '-crf', '18', '-an', out)
    return out

def lia_clip(ini, fin, nombre):
    out = os.path.join(TMP, nombre + '.mp4')
    sh('ffmpeg', '-v', 'error', '-y', '-ss', f'{ini + OFF:.2f}', '-t', f'{fin - ini:.2f}', '-i', LIA,
       '-vf', f'scale={W}:{H}:flags=lanczos,setsar=1,format=yuv420p', '-r', '25', '-c:v', 'libx264', '-crf', '18', '-an', out)
    return out

def lamina_final(texto2):
    im = fondo(W, H); d = ImageDraw.Draw(im)
    centrado(d, 700, 'Lectura completa', f(BOD, 96), HUESO, W // 2)
    centrado(d, 830, texto2, f(BODI, 56), GRIS, W // 2)
    centrado(d, 1010, 'EN EL CANAL  ·  ENLACE EN EL PERFIL', f(HAN, 36), HUESO, W // 2, esp=4)
    centrado(d, 1760, 'Lía es una inteligencia artificial', f(HAN, 28), (140, 132, 122), W // 2)
    return im

def unir(videos, audio, ini_audio, dur_total, subs, nombre):
    lista = os.path.join(TMP, nombre + '.txt'); open(lista, 'w').write(''.join(f"file '{v}'\n" for v in videos))
    out = os.path.join(OUT, nombre + '.mp4')
    sh('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-ss', f'{ini_audio:.2f}', '-i', audio,
       '-filter_complex', f"[1:a]apad,atrim=0:{dur_total:.2f}[a];[0:v]subtitles={subs}:fontsdir={FU}[v]",
       '-map', '[v]', '-map', '[a]', '-t', f'{dur_total:.2f}', '-c:v', 'libx264', '-crf', '20', '-preset', 'medium',
       '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out)
    return out

# Short 1: Lía presenta + «elige 1, 2 o 3»
A1 = json.load(open(os.path.join(Y, 'A1.json')))['words']
i0, i1, i2 = 15.6, 26.6, 35.8
v1 = lia_clip(i0, i1, 's1_lia')
mont = fondo(W, H); d = ImageDraw.Draw(mont); dor = carta('dorso_rws.jpg', 470)
centrado(d, 230, 'ELIGE UN MONTÓN', f(HAN, 44), GRIS, W // 2, esp=8)
for i, x in enumerate([195, 540, 885]):
    pegar(mont, dor, x - dor.width // 2, 520); centrado(d, 1030, str(i + 1), f(BOD, 120), HUESO, x)
v2 = png_clip(mont, i2 - i1, 's1_montones')
v3 = png_clip(lamina_final('«¿Qué siente esa persona por ti?»'), 3.5, 's1_final', zoom=0.0)
s1 = unir([v1, v2, v3], os.path.join(Y, 'A1.mp3'), i0, (i2 - i0) + 3.5, ass_file(subs_ass(A1, i0, 0, i2), 's1'), 'short1_elige_un_monton')

# Shorts 2–4: «lo que no se atreve a decirte» de cada montón
datos = [(1, 'hermit_es.jpg', 'M1_3'), (2, 'five-of-pentacles_es.jpg', 'M2_3'), (3, 'fool_es.jpg', 'M3_3')]
for n, cid, k in datos:
    pal = json.load(open(os.path.join(Y, k + '.json')))['words']; dur_voz = float(sh('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', os.path.join(Y, k + '.mp3')))
    gancho = fondo(W, H); d = ImageDraw.Draw(gancho); dor = carta('dorso_rws.jpg', 760)
    pegar(gancho, dor, (W - dor.width) // 2, 560)
    centrado(d, 200, f'MONTÓN {n}', f(HAN, 46), GRIS, W // 2, esp=8)
    centrado(d, 280, 'Lo que NO se atreve', f(BOD, 84), HUESO, W // 2); centrado(d, 385, 'a decirte…', f(BODI, 84), HUESO, W // 2)
    c = fondo(W, H); d2 = ImageDraw.Draw(c); ca = carta(cid, 1000); pegar(c, ca, (W - ca.width) // 2, 330)
    centrado(d2, 170, f'MONTÓN {n}  ·  LO QUE NO SE ATREVE A DECIRTE', f(HAN, 34), GRIS, W // 2, esp=3)
    va = png_clip(gancho, 2.6, f's{n+1}_gancho', zoom=0.03)
    vb = png_clip(c, dur_voz + 0.3, f's{n+1}_carta', zoom=0.05)
    vc = png_clip(lamina_final(f'Montón {n} · las 5 cartas'), 3.5, f's{n+1}_final', zoom=0.0)
    total = 2.6 + dur_voz + 0.3 + 3.5
    # el audio empieza 2,6 s más tarde: se antepone silencio
    voz = os.path.join(TMP, f'{k}_desp.wav')
    sh('ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-t', '2.6', '-i', 'anullsrc=r=44100:cl=stereo', '-i', os.path.join(Y, k + '.mp3'),
       '-filter_complex', '[0][1]concat=n=2:v=0:a=1', voz)
    unir([va, vb, vc], voz, 0, total, ass_file(subs_ass(pal, 0, 2.6), f's{n+1}'), f'short{n+1}_monton{n}_no_se_atreve')
print('OK', sorted(os.listdir(OUT)))
