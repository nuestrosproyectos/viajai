# Semana de reels reutilizando material. Subtítulos y rótulos anclados a las palabras (transcripción de ElevenLabs).
import json, subprocess, sys, unicodedata, re, os
from PIL import Image, ImageOps, ImageFilter, ImageDraw
S = '/tmp/claude-0/-home-user-viajai/4c5b1fc2-71db-5701-b556-c00ef1dc644e/scratchpad'
FONTS = f'{S}/web/reel'
HDR = open(f'{S}/web/reel/v7/head.ass').read()
TAIL, X = 1.8, 0.3
L, R3, EQ, CART = f'{S}/web/reel', f'{S}/reels3', f'{S}/equipo', f'{S}/lia-web/public/cartas'
def t(s): return f"{int(s // 3600)}:{int(s % 3600 // 60):02d}:{s % 60:05.2f}"
def norm(w): return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFD', w.lower()).encode('ascii', 'ignore').decode())

REELS = {
 'r1-lia-enamorados': dict(nombre='Lía', disc='TAROT', clips=[(f'{L}/v7/c5.mp4', 4.5), (f'{L}/v7/c7.mp4', 6.0), (f'{L}/d2.mp4', 4.5), (f'{L}/v7/c8.mp4', 5.0), (f'{L}/d3.mp4', None)],
   carta=[('enamorados', 'lovers', 5.5)], big=[]),
 'r2-mei-aliados': dict(nombre='Mei', disc='HORÓSCOPO CHINO', clips=[(f'{R3}/c1.mp4', 4.5), (f'{EQ}/t14.png', 4.5), (f'{R3}/c3.mp4', 5.0), (f'{EQ}/t16.png', 4.5), (f'{R3}/s1.png', None)],
   carta=[], big=[('caballo', 'Caballo', 'SU GRAN ALIADO · 92 / 100', 2.6), ('conejo', 'Conejo · Cerdo', 'TRES ARMONÍAS · 85 / 100', 2.3), ('buey', 'Buey', 'EL QUE MÁS CHOCA · 30 / 100', 2.6)]),
 'r3-mateo-ascendente': dict(nombre='Mateo', disc='ASTROLOGÍA', clips=[(f'{R3}/c4.mp4', 4.2), (f'{EQ}/t4.png', 4.5), (f'{R3}/s6.png', 4.8), (f'{EQ}/t7.png', 4.5), (f'{EQ}/t5.png', None)],
   carta=[], big=[('dos', '≈ 2 horas', 'LO QUE TARDA EN CAMBIAR EL ASCENDENTE', 3.6), ('necesito', 'Tu hora', 'LA NECESITO PARA TU CARTA', 3.0)]),
 'r4-ines-maestros': dict(nombre='Inés', disc='NUMEROLOGÍA', clips=[(f'{R3}/c10.mp4', 4.5), (f'{EQ}/t25.png', 4.5), (f'{R3}/s9.png', 4.5), (f'{EQ}/t26.png', 4.5), (f'{R3}/c8.mp4', None)],
   carta=[], big=[('11', '11 · 22 · 33', 'NÚMEROS MAESTROS', 3.2), ('11', '11', 'LA INTUICIÓN', 2.0), ('22', '22', 'EL CONSTRUCTOR', 2.2), ('33', '33', 'EL QUE ENSEÑA Y CUIDA', 2.6)]),
 'r5-lia-miedo': dict(nombre='Lía', disc='TAROT', clips=[(f'{L}/v7/c4.mp4', 4.5), (f'{L}/v7/c9.mp4', 6.0), (f'{L}/d1.mp4', 5.0), (f'{L}/d2.mp4', 4.5), (f'{L}/v7/c8.mp4', None)],
   carta=[('muerte', 'death', 3.6), ('torre', 'tower', 3.2), ('diablo', 'devil', 3.4)], big=[]),
 'r6-mateo-carta': dict(nombre='Mateo', disc='ASTROLOGÍA', clips=[(f'{R3}/c7.mp4', 4.5), (f'{R3}/s4.png', 4.5), (f'{EQ}/t1.png', 4.5), (f'{R3}/c4.mp4', None)],
   carta=[], big=[('14', '14', 'ASTROS', 1.6), ('12', '12', 'CASAS', 1.6), ('nasa', 'NASA', 'EFEMÉRIDE DE440 DEL JPL', 3.0)]),
 'r7-ines-biorritmo': dict(nombre='Inés', disc='BIORRITMO', clips=[(f'{R3}/c8.mp4', 4.5), (f'{EQ}/t24.png', 4.5), (f'{R3}/s10.png', 5.0), (f'{EQ}/t28.png', None)],
   carta=[], big=[('fisico', '23 días', 'CICLO FÍSICO', 2.0), ('emocional', '28 días', 'CICLO EMOCIONAL', 2.0), ('mental', '33 días', 'CICLO MENTAL', 2.4)]),
}

def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))

def carta_png(cid):
    p = f'carta-{cid}.png'
    if os.path.exists(p): return p
    im = Image.open(f'{CART}/{cid}.jpg').convert('RGB').resize((440, 786), Image.LANCZOS)
    im = ImageOps.colorize(ImageOps.grayscale(im), black=(40, 24, 20), white=(244, 234, 214), mid=(170, 140, 110)).convert('RGB')
    im = Image.blend(Image.open(f'{CART}/{cid}.jpg').convert('RGB').resize((440, 786)), im, .45)
    W, H = 440 + 24 + 80, 786 + 24 + 80
    sombra = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sombra).rounded_rectangle([40, 52, W - 40, H - 28], 12, fill=(0, 0, 0, 190))
    sombra = sombra.filter(ImageFilter.GaussianBlur(18))
    marco = Image.new('RGBA', (440 + 24, 786 + 24), (236, 228, 214, 255)); marco.paste(im, (12, 12))
    sombra.paste(marco, (40, 40), marco); sombra.save(p); return p

def frases(words):
    out, cur = [], []
    for w in words:
        cur.append(w); txt = ' '.join(x['text'] for x in cur)
        if re.search(r'[.?!:]$', w['text']) or (w['text'].endswith(',') and len(txt) >= 20) or len(txt) >= 34:
            out.append(cur); cur = []
    if cur: out.append(cur)
    res = []
    for f in out:
        txt = ' '.join(x['text'] for x in f)
        if len(txt) > 26:
            sp = [i for i, ch in enumerate(txt) if ch == ' ']; mid = min(sp, key=lambda i: abs(i - len(txt) / 2)); txt = txt[:mid] + '\\N' + txt[mid + 1:]
        res.append((f[0]['start'], txt))
    return res

def build(n):
    r = REELS[n]; vd = dur(f'{n}.mp3'); total = round(vd + 0.15 + TAIL, 2)
    words = [w for w in json.load(open(f'{n}.json'))['words'] if w['type'] == 'word']
    segs, used = [], 0
    for c, Ln in r['clips']:
        if Ln is None: Ln = total - used
        segs.append((c, Ln)); used += Ln
    ev = [f"Dialogue: 2,{t(0)},{t(total - TAIL)},Etiqueta,,0,0,0,,Creado con IA", f"Dialogue: 1,{t(0)},{t(total - TAIL)},Marca,,0,0,0,,LÍA Y COMPAÑÍA · {r['nombre'].upper()}"]
    fr = frases(words)
    for i, (a, tx) in enumerate(fr):
        b = fr[i + 1][0] - 0.06 if i + 1 < len(fr) else vd + 0.1
        st = 'Oro' if i in (0, len(fr) - 1) else 'Sub'
        tx = tx.replace('+', '{\\fnHanken Grotesk}+{\\fnBodoni Moda}')
        ev.append(f"Dialogue: 0,{t(a + 0.15)},{t(b + 0.15)},{st},,0,0,0,,{{\\fad(80,80)}}{tx}")
    # anclas: cada rótulo o carta aparece cuando se dice su palabra
    def ancla(clave, desde):
        for j in range(desde, len(words)):
            if norm(words[j]['text']).startswith(norm(clave)): return j
        raise SystemExit(f'{n}: no encuentro «{clave}»')
    paneles, j = [], 0
    for clave, big, sub, d in r['big']:
        j = ancla(clave, j); a = words[j]['start']; j += 1
        fs = '' if len(big) <= 5 else ('\\fs150' if len(big) <= 9 else '\\fs118')
        ev.append(f"Dialogue: 0,{t(a + 0.1)},{t(a + d + 0.15)},Big,,0,0,0,,{{\\fad(200,160)\\pos(540,1120){fs}}}{big}")
        ev.append(f"Dialogue: 0,{t(a + 0.25)},{t(a + d + 0.15)},BigSub,,0,0,0,,{{\\fad(200,160)\\pos(540,{1262 if not fs else 1240})}}{sub}")
        paneles.append((a, a + d))
    cartas, j = [], 0
    for clave, cid, d in r['carta']:
        j = ancla(clave, j); a = words[j]['start']; j += 1
        cartas.append((carta_png(cid), a + 0.05, a + d))
    cs = total - TAIL + 0.05
    ev.append(f"Dialogue: 0,{t(cs)},{t(total)},Cierre,,0,0,0,,{{\\fad(300,0)\\pos(540,1480)}}{r['nombre']}")
    ev.append(f"Dialogue: 0,{t(cs + 0.25)},{t(total)},CierreSub,,0,0,0,,{{\\fad(300,0)\\pos(540,1620)}}{r['disc']} · LÍA Y COMPAÑÍA")
    open(f'{n}.ass', 'w').write(HDR + '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n' + '\n'.join(ev) + '\n')
    ins, fc = [], []
    for i, (c, Ln) in enumerate(segs):
        need = Ln + (X if i < len(segs) - 1 else 0)
        if c.endswith('.png'):
            ins += ['-framerate', '30', '-loop', '1', '-t', f'{need + 0.2:.2f}', '-i', c]
            fr_ = int((need + 0.2) * 30)
            if '/equipo/' in c:  # retrato 3:4: foto entera arriba y fondo desenfocado, para dejar libre la zona de los textos
                fc.append(f"[{i}:v]split[pa{i}][pb{i}];[pa{i}]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:2,eq=brightness=-0.10[bg{i}];[pb{i}]scale=1080:-1[fg{i}];[bg{i}][fg{i}]overlay=0:60,scale=2160:3840,zoompan=z='1+0.06*on/{fr_}':x='iw/2-(iw/zoom/2)':y='0':d=1:s=1080x1920:fps=30,trim=0:{need:.3f},setpts=PTS-STARTPTS,format=yuv420p[v{i}]")
            else:
                fc.append(f"[{i}:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,zoompan=z='1+0.10*on/{fr_}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,trim=0:{need:.3f},setpts=PTS-STARTPTS,format=yuv420p[v{i}]")
        else:
            d = dur(c); ins += ['-i', c]; sp = max(1.0, need / (d - 0.05))
            ch = f"[{i}:v]setpts={sp:.4f}*(PTS-STARTPTS),scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920"
            ch += ",minterpolate=fps=30:mi_mode=blend" if sp > 1.15 else ",fps=30"
            fc.append(ch + f",trim=0:{need:.3f},setpts=PTS-STARTPTS,format=yuv420p[v{i}]")
    prev, off = 'v0', 0
    for i in range(1, len(segs)):
        off += segs[i - 1][1]
        fc.append(f"[{prev}][v{i}]xfade=transition=fade:duration={X}:offset={off - X / 2:.3f}[x{i}]"); prev = f'x{i}'
    k = len(segs); ins += ['-loop', '1', '-i', f'{R3}/g-bottom.png', '-loop', '1', '-i', 'g-panel2.png']
    fc.append(f"[{prev}]eq=contrast=1.04:saturation=0.96,vignette=PI/5[base]")
    fc.append(f"[base][{k}:v]overlay=0:0:shortest=1[b1]")
    en = '+'.join(f'between(t,{a},{b + 0.2})' for a, b in paneles) or '0'
    fc.append(f"[b1][{k + 1}:v]overlay=0:0:shortest=1:enable='{en}'[b2]")
    cur, nxt = 'b2', k + 2
    for idx, (png, a, b) in enumerate(cartas):
        ins += ['-loop', '1', '-t', str(total), '-i', png]
        fc.append(f"[{nxt}:v]format=rgba,fade=t=in:st={a}:d=0.35:alpha=1,fade=t=out:st={b - 0.3}:d=0.3:alpha=1[ca{idx}]")
        fc.append(f"[{cur}][ca{idx}]overlay=(W-w)/2:240:enable='between(t,{a},{b})'[cc{idx}]"); cur = f'cc{idx}'; nxt += 1
    fc.append(f"[{cur}]subtitles={n}.ass:fontsdir={FONTS},fade=t=in:st=0:d=0.25,fade=t=out:st={total - 0.45}:d=0.45[v]")
    ins += ['-i', f'{n}.mp3']
    fc.append(f"[{nxt}:a]adelay=150|150,apad,atrim=0:{total},afade=t=out:st={total - 0.4}:d=0.4[aud]")
    cmd = ['ffmpeg', '-y', '-loglevel', 'error'] + ins + ['-filter_complex', ';'.join(fc), '-map', '[v]', '-map', '[aud]', '-t', str(total), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', f'{n}.mp4']
    subprocess.run(cmd, check=True); print(n, total, 'ok')

for n in (sys.argv[1:] or REELS): build(n)
