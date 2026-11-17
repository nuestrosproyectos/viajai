#!/usr/bin/env python3
"""Deja la baraja Rider-Waite-Smith (RoxyAPI, 600x1072) coherente en español:
- Arcanos mayores: sustituye el título en inglés de la banda inferior por el nombre en español, con la misma tinta y papel.
- Genera un dorso al estilo de la propia baraja (papel envejecido, tinta negra, azul y amarillo de la paleta de 1909).
Uso: cartas_es.py CARPETA_CARTAS   (lee <id>.jpg y escribe <id>_es.jpg y dorso_rws.jpg)
"""
import os, sys, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
D = sys.argv[1]
FUENTE = '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'
MAYORES = {'fool': 'EL LOCO', 'magician': 'EL MAGO', 'high-priestess': 'LA SUMA SACERDOTISA', 'empress': 'LA EMPERATRIZ',
           'emperor': 'EL EMPERADOR', 'hierophant': 'EL HIEROFANTE', 'lovers': 'LOS ENAMORADOS', 'chariot': 'EL CARRO',
           'strength': 'LA FUERZA', 'hermit': 'EL ERMITAÑO', 'wheel-of-fortune': 'LA RUEDA DE LA FORTUNA', 'justice': 'LA JUSTICIA',
           'hanged-man': 'EL COLGADO', 'death': 'LA MUERTE', 'temperance': 'LA TEMPLANZA', 'devil': 'EL DIABLO', 'tower': 'LA TORRE',
           'star': 'LA ESTRELLA', 'moon': 'LA LUNA', 'sun': 'EL SOL', 'judgement': 'EL JUICIO', 'world': 'EL MUNDO'}

def lineas_banda(im):
    """Busca la banda del título: las dos líneas negras que cruzan casi toda la carta en el 15 % inferior."""
    g = im.convert('L'); w, h = g.size
    xs = range(30, w - 30, 3)
    llenas = [y for y in range(int(h * 0.80), h - 5) if sum(1 for x in xs if g.getpixel((x, y)) < 120) / len(xs) > 0.85]
    grupos = []
    for y in llenas:
        if grupos and y - grupos[-1][-1] <= 3: grupos[-1].append(y)
        else: grupos.append([y])
    for a, b in zip(grupos, grupos[1:]):
        if 40 < b[0] - a[-1] < 110: return (a[-1] + 1, b[0] - 1)
    return None

def papel_de(im, caja):
    """Textura de papel: copia de una zona limpia del margen inferior, estirada al tamaño de la caja."""
    w, h = im.size
    tira = im.crop((40, h - 34, w - 40, h - 14))
    return tira.resize((caja[2] - caja[0], caja[3] - caja[1]), Image.BICUBIC).filter(ImageFilter.GaussianBlur(0.6))

def titulo_es(cid):
    im = Image.open(os.path.join(D, cid + '.jpg')).convert('RGB'); w, h = im.size
    b = lineas_banda(im)
    if not b: print(cid, 'sin banda detectada'); return im
    top, bot = b
    # bordes laterales de la banda (línea vertical negra)
    g = im.convert('L'); ymid = (top + bot) // 2
    xs = [x for x in range(0, w) if g.getpixel((x, ymid)) < 110]
    izq = max([x for x in xs if x < 28] or [8]) + 2; der = min([x for x in xs if x > w - 28] or [w - 8]) - 2
    caja = (izq, top + 1, der, bot)
    im.paste(papel_de(im, caja), caja[:2])
    d = ImageDraw.Draw(im); txt = MAYORES[cid] + '.'
    tam = 44
    while True:
        fnt = ImageFont.truetype(FUENTE, tam); tw = d.textlength(txt, font=fnt) * 1.06
        if tw < (der - izq) - 40 or tam < 18: break
        tam -= 2
    # letra espaciada como en la baraja original
    esp = 0.06 * tam; anchos = [d.textlength(c, font=fnt) for c in txt]; total = sum(anchos) + esp * (len(txt) - 1)
    x = (izq + der) / 2 - total / 2; asc, desc = fnt.getmetrics(); y = (top + bot) / 2 - (asc - desc * 0.2) / 2 - 2
    for c, a in zip(txt, anchos):
        d.text((x, y), c, font=fnt, fill=(38, 26, 28)); x += a + esp
    return im

def dorso():
    ref = Image.open(os.path.join(D, 'moon.jpg')).convert('RGB'); w, h = ref.size
    im = Image.new('RGB', (w, h)); papel = papel_de(ref, (0, 0, w, h)); im.paste(papel, (0, 0))
    d = ImageDraw.Draw(im); tinta = (38, 26, 28); azul = (150, 196, 206); amar = (238, 214, 96); rosa = (214, 120, 96)
    m = 14; d.rounded_rectangle([m, m, w - m, h - m], radius=10, outline=tinta, width=5)
    m2 = 34; d.rectangle([m2, m2, w - m2, h - m2], fill=azul, outline=tinta, width=4)
    random.seed(7)
    paso = 72
    for j, y in enumerate(range(m2 + 40, h - m2 - 20, paso)):
        for i, x in enumerate(range(m2 + 40 + (paso // 2 if j % 2 else 0), w - m2 - 20, paso)):
            r = 15
            pts = [(x + math.cos(k * math.pi / 4) * (r if k % 2 == 0 else r * 0.45), y + math.sin(k * math.pi / 4) * (r if k % 2 == 0 else r * 0.45)) for k in range(8)]
            d.polygon(pts, fill=amar, outline=tinta)
            d.ellipse([x - 3, y - 3, x + 3, y + 3], fill=rosa, outline=tinta)
    cx, cy = w // 2, h // 2
    d.ellipse([cx - 120, cy - 120, cx + 120, cy + 120], fill=(244, 233, 205), outline=tinta, width=5)
    for k in range(24):
        a = k * math.pi / 12; r1, r2 = 70, 112 if k % 2 == 0 else 95
        d.line([cx + math.cos(a) * r1, cy + math.sin(a) * r1, cx + math.cos(a) * r2, cy + math.sin(a) * r2], fill=tinta, width=3)
    d.ellipse([cx - 66, cy - 66, cx + 66, cy + 66], fill=amar, outline=tinta, width=4)
    d.ellipse([cx - 22, cy - 22, cx + 22, cy + 22], fill=rosa, outline=tinta, width=3)
    # leve envejecido para que la tinta no quede «digital»
    im = Image.blend(im, papel_de(ref, (0, 0, w, h)), 0.10).filter(ImageFilter.GaussianBlur(0.5))
    return im

for fn in sorted(os.listdir(D)):
    cid = fn[:-4]
    if not fn.endswith('.jpg') or fn.endswith('_es.jpg') or cid.startswith('dorso'): continue
    (titulo_es(cid) if cid in MAYORES else Image.open(os.path.join(D, fn)).convert('RGB')).save(os.path.join(D, cid + '_es.jpg'), quality=95)
dorso().save(os.path.join(D, 'dorso_rws.jpg'), quality=95)
print('ok')
