#!/usr/bin/env python3
"""Monta el vídeo de YouTube 02 «¿Qué siente esa persona por ti?» (1920x1080). Lía a cámara: HeyGen (vertical 720x1280).
Entradas (carpeta de trabajo T):
  car/*.mp3 + car/*.json  -> voces de Lía (Carolina) y transcripción con tiempos por palabra
  car/cortes_camara.txt   -> dónde empieza y acaba cada pieza dentro del vídeo de Lía a cámara
  lia_cam01_1080.mp4      -> Lía a cámara (InfiniteTalk + RealESRGAN); si falta, se usa un fotograma fijo de prueba
  cartas/*.jpg            -> cartas de RoxyAPI (600x1072)
Salida: T/final/video01.mp4
"""
import json, os, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

T = os.path.abspath(sys.argv[1])
FUENTES = os.path.abspath(sys.argv[2])
W, H = 1920, 1080
HUESO = (236, 228, 214)
GRIS = (181, 172, 160)
GRANATE = (90, 20, 32)
OUT = os.path.join(T, 'final'); os.makedirs(OUT, exist_ok=True)
TMP = os.path.join(T, 'tmp'); os.makedirs(TMP, exist_ok=True)
BOD = os.path.join(FUENTES, 'BodoniModa.ttf'); BODI = os.path.join(FUENTES, 'BodoniModa-Italic.ttf'); HAN = os.path.join(FUENTES, 'HankenGrotesk.ttf')
f = lambda p, s: ImageFont.truetype(p, s)

def sh(*a):
    r = subprocess.run(a, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-2000:]); raise SystemExit('fallo: ' + ' '.join(a[:6]))
    return r.stdout

def dur(p): return float(sh('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p))

MONTONES = [
    ('five-of-cups', 'Cinco de Copas', 'pena · arrepentimiento · mirar atrás'),
    ('eight-of-pentacles', 'Ocho de Oros', 'constancia · esfuerzo · algo que se construye'),
    ('hermit', 'El Ermitaño', 'tiempo para sí · mirar hacia dentro'),
    ('hierophant', 'El Hierofante', 'compromiso · lo establecido · claridad'),
    ('high-priestess', 'La Sacerdotisa', 'intuición · silencio · paciencia'),
    ('seven-of-cups', 'Siete de Copas', 'ilusión · fantasía · dudas'),
    ('queen-of-pentacles', 'Reina de Oros', 'refugio · cuidado · seguridad'),
    ('five-of-pentacles', 'Cinco de Oros', 'inseguridad · orgullo · distancia'),
    ('king-of-swords', 'Rey de Espadas', 'la cabeza manda · hablar claro'),
    ('five-of-swords', 'Cinco de Espadas', 'sin competir · bajar la guardia'),
    ('world', 'El Mundo', 'plenitud · encaje · destino'),
    ('six-of-cups', 'Seis de Copas', 'nostalgia · ternura · sentirse en casa'),
    ('fool', 'El Loco', 'empezar de cero · vértigo · ganas'),
    ('eight-of-cups', 'Ocho de Copas', 'distancia · pausa · buscar sentido'),
    ('lovers', 'Los Enamorados', 'elegir · amor · valores alineados'),
]
POSICIONES = ['LO QUE SIENTE AHORA', 'LO QUE PIENSA DE TI', 'LO QUE NO SE ATREVE A DECIRTE', 'LO QUE HAY ENTRE VOSOTROS', 'CONSEJO PARA TI']
OFFSET_LIA = 0.8   # HeyGen añade 0,8 s al principio (medido por correlación de audio)

# ---------- fondos y piezas gráficas ----------
def fondo():
    p = os.path.join(TMP, 'fondo.png')
    if os.path.exists(p): return Image.open(p)
    im = Image.new('RGB', (W, H), (8, 6, 7)); px = im.load()
    cx, cy = W / 2, H * 0.45
    for y in range(H):
        for x in range(0, W):
            d = min(1, (((x - cx) / (W * 0.62)) ** 2 + ((y - cy) / (H * 0.75)) ** 2) ** 0.5)
            k = (1 - d) ** 1.6
            px[x, y] = (int(8 + 52 * k), int(6 + 12 * k), int(7 + 16 * k))
    import random; random.seed(1)
    ruido = Image.effect_noise((W, H), 18).convert('L')
    im = Image.blend(im, Image.merge('RGB', (ruido, ruido, ruido)), 0.035)
    im.save(p); return im

def dorso(h):
    w = int(h * 600 / 1072)
    im = Image.new('RGB', (w, h), GRANATE); d = ImageDraw.Draw(im)
    m = int(w * 0.05); d.rectangle([m, m, w - m, h - m], outline=HUESO, width=max(2, h // 300))
    m2 = int(w * 0.08); d.rectangle([m2, m2, w - m2, h - m2], outline=(170, 150, 140), width=1)
    cx, cy, r = w / 2, h / 2, w * 0.28
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=HUESO, width=max(2, h // 350))
    import math
    for i in range(16):
        a = i * math.pi / 8
        d.line([cx + math.cos(a) * r * 0.35, cy + math.sin(a) * r * 0.35, cx + math.cos(a) * r * 1.45, cy + math.sin(a) * r * 1.45], fill=(200, 185, 170), width=1)
    d.ellipse([cx - r * 0.3, cy - r * 0.3, cx + r * 0.3, cy + r * 0.3], fill=HUESO)
    return im

def con_sombra(base, carta, x, y):
    sombra = Image.new('RGBA', (carta.width + 80, carta.height + 80), (0, 0, 0, 0))
    ImageDraw.Draw(sombra).rectangle([40, 50, carta.width + 40, carta.height + 50], fill=(0, 0, 0, 170))
    sombra = sombra.filter(ImageFilter.GaussianBlur(22))
    base.paste(sombra, (x - 40, y - 40), sombra)
    marco = Image.new('RGB', (carta.width + 8, carta.height + 8), HUESO)
    base.paste(marco, (x - 4, y - 4)); base.paste(carta, (x, y))

def carta_img(cid, h):
    im = Image.open(os.path.join(T, 'cartas', cid + '_es.jpg')).convert('RGB')
    return im.resize((int(h * im.width / im.height), h), Image.LANCZOS)

def texto_centrado(d, y, t, fuente, color, cx=W // 2, esp=0):
    if esp:
        anchos = [d.textlength(c, font=fuente) for c in t]; tw = sum(anchos) + esp * (len(t) - 1); x = cx - tw / 2
        for c, a in zip(t, anchos): d.text((x, y), c, font=fuente, fill=color); x += a + esp
    else:
        tw = d.textlength(t, font=fuente); d.text((cx - tw / 2, y), t, font=fuente, fill=color)

def lamina_carta(n, idx, cid, nombre, claves):
    im = fondo().copy(); h = 820; c = carta_img(cid, h); x, y = 300, 80
    con_sombra(im, c, x, y); d = ImageDraw.Draw(im); cx = 1300
    texto_centrado(d, 210, f'MONTÓN {n}', f(HAN, 28), GRIS, cx, esp=6); texto_centrado(d, 255, POSICIONES[idx-1], f(HAN, 30), HUESO, cx, esp=4)
    texto_centrado(d, 310, nombre, f(BOD, 104), HUESO, cx)
    d.line([cx - 70, 470, cx + 70, 470], fill=(150, 60, 70), width=2)
    texto_centrado(d, 500, claves, f(BODI, 40), GRIS, cx)
    return im

def lamina_tres(n, trio):
    im = fondo().copy(); h = 470 if len(trio) > 3 else 600; d = ImageDraw.Draw(im)
    texto_centrado(d, 60, f'MONTÓN {n}', f(HAN, 32), GRIS, esp=8)
    ws = [carta_img(c, h).width for c, _, _ in trio]; gap = 50 if len(trio) > 3 else 90; x = (W - sum(ws) - gap * 2) // 2
    for (cid, nombre, _), w in zip(trio, ws):
        con_sombra(im, carta_img(cid, h), x, 140)
        texto_centrado(d, 140 + h + 30, nombre, f(BOD, 34 if len(trio) > 3 else 46), HUESO, x + w // 2); x += w + gap
    return im

def lamina_montones():
    im = fondo().copy(); h = 560; d = ImageDraw.Draw(im); b = Image.open(os.path.join(T, 'cartas', 'dorso_rws.jpg')).convert('RGB'); b = b.resize((int(h * b.width / b.height), h), Image.LANCZOS); gap = 140
    x = (W - 3 * b.width - 2 * gap) // 2
    for i in range(3):
        con_sombra(im, b, x, 170); texto_centrado(d, 770, str(i + 1), f(BOD, 120), HUESO, x + b.width // 2); x += b.width + gap
    texto_centrado(d, 60, 'ELIGE UN MONTÓN', f(HAN, 34), GRIS, esp=10)
    texto_centrado(d, 940, 'Piensa en esa persona y quédate con el primero que te llame', f(BODI, 40), GRIS)
    return im

def lamina_titulo(n):
    im = fondo().copy(); d = ImageDraw.Draw(im)
    texto_centrado(d, 380, 'Montón', f(BODI, 90), GRIS); texto_centrado(d, 470, str(n), f(BOD, 220), HUESO)
    return im

def lamina_cierre():
    im = fondo().copy(); d = ImageDraw.Draw(im)
    texto_centrado(d, 330, 'Tu propia tirada', f(BOD, 110), HUESO)
    texto_centrado(d, 480, 'con tus preguntas · las tres primeras cartas, gratis', f(BODI, 46), GRIS)
    texto_centrado(d, 640, 'ENLACE EN LA DESCRIPCIÓN', f(HAN, 34), HUESO, esp=8)
    texto_centrado(d, 980, 'Lía es una inteligencia artificial. El tarot es una herramienta de reflexión, no una predicción.', f(HAN, 24), (140, 132, 122))
    return im

# ---------- segmentos ----------
def seg_imagen(nombre, im, dur_s, audio=None, zoom=0.035):
    png = os.path.join(TMP, nombre + '.png'); out = os.path.join(TMP, nombre + '.mp4')
    if os.path.exists(out) and os.environ.get('REUSAR') == '1': return out
    im.save(png)
    n = max(1, round(dur_s * 25))
    vf = (f"scale={W*2}:{H*2},zoompan=z='1+{zoom}*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps=25,"
          f"fade=t=in:st=0:d=0.5,fade=t=out:st={max(0,dur_s-0.4):.2f}:d=0.4,format=yuv420p")
    a = ['-i', audio] if audio else ['-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo']
    sh('ffmpeg', '-v', 'error', '-y', '-framerate', '25', '-loop', '1', '-t', f'{dur_s:.3f}', '-i', png, *a, '-vf', vf,
       '-af', f'apad,atrim=0:{dur_s:.3f},aresample=44100', '-ac', '2', '-t', f'{dur_s:.3f}', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium',
       '-c:a', 'aac', '-b:a', '192k', out)
    return out

def seg_lia(nombre, ini, fin, audio):
    out = os.path.join(TMP, nombre + '.mp4'); src = os.path.join(T, 'lia_heygen.mp4'); d = dur(audio)
    if os.path.exists(src):
        vin = ['-ss', f'{ini + OFFSET_LIA:.3f}', '-t', f'{d:.3f}', '-i', src]
    else:
        vin = ['-loop', '1', '-framerate', '25', '-t', f'{d:.3f}', '-i', os.path.join(T, 'lia_fijo.png')]
    fondo().save(os.path.join(TMP, 'fondo.png'))
    vin += ['-loop', '1', '-framerate', '25', '-t', f'{d:.3f}', '-i', os.path.join(TMP, 'fondo.png')]
    vf = ("[0:v]scale=-2:1080,setsar=1[a];[1:v]format=rgb24[f];"
          "[f][a]overlay=(W-w)/2:0,fade=t=in:st=0:d=0.3,format=yuv420p[v]")
    sh('ffmpeg', '-v', 'error', '-y', *vin, '-i', audio, '-filter_complex', vf, '-map', '[v]', '-map', '2:a', '-t', f'{d:.3f}',
       '-r', '25', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-ar', '44100', out)
    return out

# ---------- subtítulos ----------
def ass_tiempo(t): h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60; return f'{h}:{m:02d}:{s:05.2f}'

def bloques(palabras, ini):
    out, cur = [], []
    for w in palabras:
        if w.get('type') != 'word': continue
        cur.append(w)
        txt = ' '.join(x['text'] for x in cur)
        if len(cur) >= 7 or len(txt) > 42 or re.search(r'[.,:;?!]$', w['text']):
            out.append((ini + cur[0]['start'], ini + cur[-1]['end'], txt)); cur = []
    if cur: out.append((ini + cur[0]['start'], ini + cur[-1]['end'], ' '.join(x['text'] for x in cur)))
    return out

# ---------- guion de montaje ----------
CAR = os.path.join(T, 'car')
cortes = {l.split()[0]: (float(l.split()[1]), float(l.split()[2])) for l in open(os.path.join(CAR, 'cortes_camara.txt'))}
plan = [('lia', 'A1')]
plan.append(('img', 'montones', lamina_montones(), 7.0))
for n in (1, 2, 3):
    cinco = MONTONES[(n - 1) * 5:(n - 1) * 5 + 5]
    plan.append(('img', f'titulo{n}', lamina_titulo(n), 2.6))
    plan.append(('lia', f'A{n+1}'))
    for i, (cid, nom, cla) in enumerate(cinco, 1):
        plan.append(('voz', f'M{n}_{i}', lamina_carta(n, i, cid, nom, cla)))
    plan.append(('voz', f'M{n}_6', lamina_tres(n, cinco)))
    plan.append(('lia', f'R{n}'))
plan.append(('lia', 'A5'))
plan.append(('img', 'cierre', lamina_cierre(), 7.0))

segs, subs, t, capitulos = [], [], 0.0, []
for p in plan:
    if p[0] == 'lia':
        k = p[1]; a = os.path.join(CAR, k + '.mp3'); s = seg_lia('L_' + k, *cortes[k], a)
        subs += bloques(json.load(open(os.path.join(CAR, k + '.json')))['words'], t)
    elif p[0] == 'voz':
        k = p[1]; a = os.path.join(CAR, k + '.mp3'); s = seg_imagen('V_' + k, p[2], dur(a) + 0.6, a)
        subs += bloques(json.load(open(os.path.join(CAR, k + '.json')))['words'], t)
    else:
        s = seg_imagen('I_' + p[1], p[2], p[3])
    capitulos.append((t, p[1])); segs.append(s); t += dur(s); print(f'{t:7.1f}s  {os.path.basename(s)}', flush=True)

lista = os.path.join(TMP, 'lista.txt'); open(lista, 'w').write(''.join(f"file '{s}'\n" for s in segs))
ass = os.path.join(TMP, 'subs.ass')
cab = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Hanken Grotesk,50,&H00D6E4EC,&H00FFFFFF,&H64100A0A,&H8C0A0A0C,0,0,0,0,100,100,0,0,1,2.2,3,2,160,160,46,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
open(ass, 'w').write(cab + ''.join(f'Dialogue: 0,{ass_tiempo(a)},{ass_tiempo(b+0.15)},Sub,,0,0,0,,{x}\n' for a, b, x in subs))
final = os.path.join(OUT, 'video02_que_siente_por_ti.mp4')
sh('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-vf', f"subtitles={ass}:fontsdir={FUENTES}",
   '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', final)
print('FINAL', final, round(dur(final), 1), 's')
# capítulos para la descripción de YouTube

mins = lambda x: f"{int(x//60)}:{int(x%60):02d}"
caps = {'A1': 'Presentación', 'montones': 'Elige tu montón', 'titulo1': 'Montón 1', 'titulo2': 'Montón 2', 'titulo3': 'Montón 3', 'A5': 'Despedida'}
open(os.path.join(OUT, 'capitulos.txt'), 'w').write('\n'.join(f"{mins(a)} {caps[k]}" for a, k in capitulos if k in caps) + '\n')
print(open(os.path.join(OUT, 'capitulos.txt')).read())
