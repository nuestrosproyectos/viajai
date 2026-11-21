#!/usr/bin/env python3
"""Montaje del vídeo 01 de Inés: «Tu Luna lo explica todo: por qué sientes como sientes (los 12 signos)».
Uso: montar_ines01.py CARPETA_TRABAJO CARPETA_FUENTES
CARPETA_TRABAJO: ines_heygen.mp4 (HeyGen horizontal), C1..C3 y V0..V12 (.mp3/.json), cortes_camara.txt.
Estética de Inés: azul añil y plata, con una luna grande (Mateo es azul noche y latón; Lía, granate).
"""
import json, math, os, random, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

T = os.path.abspath(sys.argv[1]); FUENTES = os.path.abspath(sys.argv[2])
W, H = 1920, 1080
NOCHE = (11, 13, 32); ANIL = (30, 36, 84); PLATA = (205, 210, 228); PERLA = (243, 239, 230); GRIS = (150, 156, 182); ORO = (216, 190, 120)
OUT = os.path.join(T, 'final'); TMP = os.path.join(T, 'tmp'); os.makedirs(OUT, exist_ok=True); os.makedirs(TMP, exist_ok=True)
BOD = os.path.join(FUENTES, 'BodoniModa.ttf'); BODI = os.path.join(FUENTES, 'BodoniModa-Italic.ttf'); HAN = os.path.join(FUENTES, 'HankenGrotesk.ttf')
SIMB = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
OFFSET = float(os.environ.get('OFFSET_HEYGEN', '0.8'))
GUION = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'guion-i01-luna-12-signos.md')
f = lambda p, s: ImageFont.truetype(p, s)

def sh(*a):
    r = subprocess.run(a, capture_output=True, text=True)
    if r.returncode: print(r.stderr[-2000:]); raise SystemExit('fallo: ' + ' '.join(a[:6]))
    return r.stdout
def dur(p): return float(sh('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p))

SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']
GLIFO = dict(zip(SIGNOS, '♈♉♊♋♌♍♎♏♐♑♒♓'))
ELEMENTO = dict(zip(SIGNOS, ['Fuego', 'Tierra', 'Aire', 'Agua'] * 3))
# Lo que se lee en pantalla en cada párrafo de cada Luna (resumen fiel de lo que dice Inés en el guion)
CLAVES = {
    'Aries': [('Cómo sientes', 'Rápido y fuerte'), ('Lo que necesitas', 'Acción'), ('Cuando quieres', 'Proteges a los tuyos'), ('Mi consejo', 'Una pausa antes de responder')],
    'Tauro': [('Tu Luna', 'Exaltada: tranquila y en su mejor versión'), ('Lo que necesitas', 'Estabilidad'), ('Lo que te calma', 'Lo que se toca y lo conocido'), ('Mi consejo', 'El cambio no siempre es pérdida')],
    'Géminis': [('Lo que necesitas', 'Hablarlo para entenderlo'), ('Cómo sientes', 'Rápido y cambiante, como el aire'), ('Cuando quieres', 'Escuchas y haces reír'), ('Mi consejo', 'No todo se resuelve pensándolo')],
    'Cáncer': [('Tu Luna', 'En su casa: Cáncer rige la Luna'), ('Lo que necesitas', 'Un refugio'), ('Lo que te calma', 'Cuidar y que te cuiden'), ('24 de diciembre', 'Luna llena en Cáncer, en Nochebuena'), ('Mi consejo', 'Cuidarte también es cuidar')],
    'Leo': [('Lo que necesitas', 'Que te vean'), ('Cómo sientes', 'Con el corazón abierto'), ('Lo que te calma', 'Crear algo tuyo'), ('Mi consejo', 'Tu valor no depende del aplauso')],
    'Virgo': [('Cómo sientes', 'Ordenando'), ('Lo que necesitas', 'Sentirte útil'), ('Lo que te calma', 'Un plan claro'), ('Mi consejo', 'No tienes que ganarte el descanso')],
    'Libra': [('Lo que necesitas', 'Armonía'), ('Cómo sientes', 'En compañía'), ('Lo que te calma', 'La belleza y la paz'), ('Mi consejo', 'Tu enfado también es válido')],
    'Escorpio': [('Cómo sientes', 'En profundidad: todo o nada'), ('Lo que necesitas', 'Confianza de verdad'), ('Lo que te calma', 'La intimidad sin filtros'), ('Mi consejo', 'Soltar no es perder el control')],
    'Sagitario': [('Lo que necesitas', 'Libertad y horizonte'), ('Cómo sientes', 'Con optimismo'), ('Lo que te calma', 'Moverte y aprender'), ('Mi consejo', 'No huyas de lo que duele')],
    'Capricornio': [('Cómo sientes', 'Con contención'), ('Lo que necesitas', 'Seguridad que construyes tú'), ('Cuando quieres', 'Resuelves sin hacer ruido'), ('Mi consejo', 'Puedes mostrarte vulnerable')],
    'Acuario': [('Lo que necesitas', 'Espacio para ser tú'), ('Cómo sientes', 'Primero con la cabeza'), ('Lo que te calma', 'Tus amistades y tus causas'), ('Mi consejo', 'Sentir no te quita libertad')],
    'Piscis': [('Cómo sientes', 'Todo, también lo de los demás'), ('Lo que necesitas', 'Tiempo para soñar'), ('Lo que te calma', 'La música y el agua'), ('Mi consejo', 'Pon límites')],
}
PASOS_V0 = [('Lo básico', 'Sin tecnicismos', ''), ('Tu Sol y tu Luna', 'El Sol: quién quieres ser', 'La Luna: lo que necesitas para sentirte en casa'),
            ('Cuando manda la Luna', 'Cansancio, dolor, amor', 'Por eso dos personas del mismo signo sienten distinto'),
            ('Cada dos días y medio', 'La Luna cambia de signo', 'Hace falta tu fecha y, mejor, tu hora de nacimiento'), ('Las doce lunas', 'Busca la tuya en los capítulos', '')]

# ---------- fondo: cielo añil ----------
_fondo = None
def fondo():
    global _fondo
    if _fondo: return _fondo.copy()
    g = Image.new('L', (W // 4, H // 4)); gp = g.load()
    for y in range(H // 4):
        for x in range(W // 4):
            gp[x, y] = int(255 * max(0, 1 - math.hypot((x * 4 - W * 0.3) / W, (y * 4 - H * 0.4) / H) * 1.6))
    im = Image.composite(Image.new('RGB', (W, H), ANIL), Image.new('RGB', (W, H), NOCHE), g.resize((W, H), Image.BILINEAR))
    d = ImageDraw.Draw(im); random.seed(2026)
    for _ in range(850):
        x, y, r = random.uniform(0, W), random.uniform(0, H), random.choice([0.6, 0.8, 1, 1, 1.3, 1.7])
        b = random.randint(100, 235); d.ellipse([x - r, y - r, x + r, y + r], fill=(b, b, min(255, b + 20)))
    _fondo = im.filter(ImageFilter.GaussianBlur(0.4)); return _fondo.copy()

LUNA_IMG = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'escenas', 'luna-llena.jpg')   # luna fotorrealista generada (Higgsfield, 21-11-2026)
_disco = {}
def disco_luna(R):
    if R not in _disco:
        im = Image.open(LUNA_IMG).convert('RGB').resize((2 * R, 2 * R), Image.LANCZOS)
        im = Image.blend(im, Image.new('RGB', im.size, (255, 246, 225)), 0.06)   # un punto cálido, como a simple vista
        m = Image.new('L', im.size, 0); ImageDraw.Draw(m).ellipse([1, 1, 2 * R - 2, 2 * R - 2], fill=255)
        _disco[R] = (im, m.filter(ImageFilter.GaussianBlur(1.2)))
    return _disco[R]

def luna(im, cx, cy, R, brillo=1.0):
    halo = Image.new('L', (W, H), 0); ImageDraw.Draw(halo).ellipse([cx - R * 1.5, cy - R * 1.5, cx + R * 1.5, cy + R * 1.5], fill=int(105 * brillo))
    im.paste(Image.new('RGB', (W, H), (150, 160, 220)), (0, 0), halo.filter(ImageFilter.GaussianBlur(R * 0.45)))
    d, m = disco_luna(R); im.paste(d, (cx - R, cy - R), m)
    return im

def medallon(im, cx, cy, signo, r=72):
    """El símbolo del signo en un medallón plateado (sobre la superficie de la luna no se leería)."""
    d = ImageDraw.Draw(im)
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=NOCHE, outline=PLATA, width=3)
    d.text((cx, cy + 4), GLIFO[signo], font=f(SIMB, int(r * 1.1)), fill=PERLA, anchor='mm')
    return im

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

def panel(im, sup, titulo, linea2='', x=1060, y=330, ancho=760):
    d = ImageDraw.Draw(im)
    texto(d, (x, y), sup.upper(), f(HAN, 28), ORO, esp=6); yy = y + 56
    for l in partir(d, titulo, f(BOD, 76), ancho): d.text((x, yy), l, font=f(BOD, 76), fill=PERLA); yy += 92
    d.line([(x, yy + 16), (x + 120, yy + 16)], fill=PLATA, width=2); yy += 44
    for l in partir(d, linea2, f(BODI, 44), ancho) if linea2 else []: d.text((x, yy), l, font=f(BODI, 44), fill=PLATA); yy += 58
    return im

def lamina_luna(signo, sup, titulo, linea2=''):
    im = fondo(); luna(im, 520, 520, 300)
    d = ImageDraw.Draw(im)
    if signo: medallon(im, 520 + 220, 520 + 220, signo)
    return panel(im, sup, titulo, linea2)

def lamina_titulo(signo):
    im = fondo(); luna(im, W // 2, 430, 230, .8); medallon(im, W // 2 + 170, 430 + 170, signo, 60); d = ImageDraw.Draw(im)
    texto(d, (W // 2, 760), 'LUNA EN', f(HAN, 38), ORO, anchor='mm', esp=14)
    d.text((W // 2, 860), signo, font=f(BOD, 130), fill=PERLA, anchor='mm')
    texto(d, (W // 2, 960), ELEMENTO[signo].upper(), f(HAN, 26), GRIS, anchor='mm', esp=10)
    return im

def lamina_cierre():
    im = fondo(); luna(im, W // 2, 330, 150, .7); d = ImageDraw.Draw(im)
    texto(d, (W // 2, 560), 'TU LUNA Y TU RITUAL', f(HAN, 34), ORO, anchor='mm', esp=12)
    d.text((W // 2, 680), 'Calcula tu Luna gratis', font=f(BOD, 110), fill=PERLA, anchor='mm')
    d.text((W // 2, 800), 'Enlace en la descripción', font=f(BODI, 50), fill=PLATA, anchor='mm')
    texto(d, (W // 2, 920), 'INÉS · LUNA Y RITUALES', f(HAN, 26), GRIS, anchor='mm', esp=10)
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

def seg_ines(nombre, ini, fin, audio):
    out = os.path.join(TMP, nombre + '.mp4'); d = dur(audio)
    vf = "[0:v]scale=1920:1080:flags=lanczos,setsar=1,fade=t=in:st=0:d=0.3,format=yuv420p[v]"
    sh('ffmpeg', '-v', 'error', '-y', '-ss', f'{ini + OFFSET:.3f}', '-t', f'{d:.3f}', '-i', os.path.join(T, 'ines_heygen.mp4'), '-i', audio,
       '-filter_complex', vf, '-map', '[v]', '-map', '1:a', '-t', f'{d:.3f}', '-r', '25', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium',
       '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-ar', '44100', out)
    return out

norm = lambda x: re.findall(r'\w+', x.lower())
def parrafos(clave):
    g = open(GUION).read() + '\n\n## FIN'
    return re.search(rf'## {clave} · [^\n]*\n\n(.*?)\n\n##', g, re.S).group(1).strip().split('\n')

def inicios(clave, pars):
    """Segundo en que empieza cada párrafo, buscando sus 3 primeras palabras en la transcripción con tiempos."""
    pal = [w for w in json.load(open(os.path.join(T, clave + '.json')))['words'] if w.get('type') == 'word']
    tx = [norm(w['text'])[0] if norm(w['text']) else '' for w in pal]
    numeros = {'veinticuatro': '24', 'dos': '2', 'siete': '7'}
    out, j = [0.0], 0
    for p in pars[1:]:
        q = [numeros.get(w, w) for w in norm(p)[:3]]
        for i in range(j + 1, len(tx) - 2):
            if tx[i:i + 3] == q or tx[i:i + 2] == q[:2]: out.append(pal[i]['start'] - 0.15); j = i; break
        else: raise SystemExit(f'{clave}: no encuentro el párrafo «{" ".join(q)}»')
    return out

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
if __name__ == '__main__':
    cortes = {l.split()[0]: (float(l.split()[1]), float(l.split()[2])) for l in open(os.path.join(T, 'cortes_camara.txt'))}
    plan = [('ines', 'C1'), ('voz', 'V0'), ('ines', 'C2')] + [('voz', f'V{i}') for i in range(1, 13)] + [('ines', 'C3'), ('img', 'cierre')]
    CAPS = {'C1': 'Presentación', 'V0': 'Qué es tu Luna', 'C2': 'Cómo saber tu Luna', 'C3': 'Despedida'}
    CAPS.update({f'V{i}': f'Luna en {SIGNOS[i - 1]}' for i in range(1, 13)})
    segs, subs, t, caps = [], [], 0.0, []
    for tipo, k in plan:
        if tipo == 'ines':
            a = os.path.join(T, k + '.mp3'); s = seg_ines('I_' + k, *cortes[k], a)
            subs += bloques(json.load(open(os.path.join(T, k + '.json')))['words'], t)
        elif tipo == 'voz':
            a = os.path.join(T, k + '.mp3'); total = dur(a) + 0.8; pars = parrafos(k); ini = inicios(k, pars) + [total]
            vids = []
            for i, p in enumerate(pars):
                dd = ini[i + 1] - ini[i]
                if k == 'V0':
                    paso = PASOS_V0[min(i, len(PASOS_V0) - 1)]
                    vids.append(seg_imagen(f'{k}_{i}', lamina_luna(None, 'Inés · la Luna', paso[1], paso[2]) if i else lamina_luna(None, 'Inés · la Luna', 'Qué es tu Luna', 'Sin tecnicismos'), dd))
                else:
                    signo = SIGNOS[int(k[1:]) - 1]; cl = CLAVES[signo][min(i, len(CLAVES[signo]) - 1)]
                    im = lamina_luna(signo, f'Luna en {signo} · {cl[0]}', cl[1])
                    if i == 0: vids.append(seg_imagen(f'{k}_t', lamina_titulo(signo), 2.6, zoom=0.02)); vids.append(seg_imagen(f'{k}_{i}', im, dd - 2.6))
                    else: vids.append(seg_imagen(f'{k}_{i}', im, dd))
            s = con_audio('S_' + k, vids, a, total)
            subs += bloques(json.load(open(os.path.join(T, k + '.json')))['words'], t)
        else:
            s = seg_imagen('I_cierre_v', lamina_cierre(), 8.0, zoom=0.02); s2 = os.path.join(TMP, 'I_cierre_a.mp4')
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
Style: Caja,Hanken Grotesk,46,&H00E6EFF3,&H00FFFFFF,&H38200D0B,&H00000000,0,0,0,0,100,100,0,0,3,14,0,2,160,160,36,1
Style: IA,Hanken Grotesk,26,&H30E6EFF3,&H00FFFFFF,&H70200D0B,&H00000000,0,0,0,0,100,100,1,0,3,8,0,1,40,40,34,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    # Aviso de IA (Reglamento (UE) 2024/1689, art. 50): fijo abajo a la izquierda durante todo el vídeo
    total_video = sum(dur(s) for s in segs)
    open(ass, 'w').write(cab + f'Dialogue: 1,{ass_tiempo(0)},{ass_tiempo(total_video)},IA,,0,0,0,,Presentadora creada con IA\n'
                         + ''.join(f'Dialogue: 0,{ass_tiempo(a)},{ass_tiempo(b + 0.15)},Caja,,0,0,0,,{x}\n' for a, b, x in subs))
    final = os.path.join(OUT, 'ines01_luna_12_signos.mp4')
    sh('ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-vf', f"subtitles={ass}:fontsdir={FUENTES}",
       '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', final)
    print('FINAL', final, round(dur(final), 1), 's')
    mins = lambda x: f"{int(x // 60)}:{int(x % 60):02d}"
    open(os.path.join(OUT, 'capitulos.txt'), 'w').write('\n'.join(f"{mins(a)} {CAPS[k]}" for a, k in caps if k in CAPS) + '\n')
    print(open(os.path.join(OUT, 'capitulos.txt')).read())
