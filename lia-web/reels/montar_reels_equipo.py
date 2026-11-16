# Monta los reels de Mei, Mateo e Inés. Subtítulos al tiempo exacto de cada palabra (transcripción de ElevenLabs).
import subprocess, sys
TAIL, X = 1.8, 0.3
FONTS = '/tmp/claude-0/-home-user-viajai/4c5b1fc2-71db-5701-b556-c00ef1dc644e/scratchpad/web/reel'
HDR = open('/tmp/claude-0/-home-user-viajai/4c5b1fc2-71db-5701-b556-c00ef1dc644e/scratchpad/web/reel/v7/head.ass').read()
def t(s): return f"{int(s // 3600)}:{int(s % 3600 // 60):02d}:{s % 60:05.2f}"

R = {
 'mei': dict(nombre='Mei', disc='HORÓSCOPO CHINO',
  clips=[('c1', 5.5), ('c3', 5.7), ('s2', 6.7), ('c1', 4.1), ('c3', None)],
  subs=[(0.16, 'Oro', 'Soy Mei.'), (1.34, 'Sub', 'El 6 de febrero empieza\\Nel año de la Cabra de Fuego.'), (5.58, 'Oro', 'Y tú, ¿qué animal eres?'),
        (7.54, 'Sub', 'Ojo, porque mucha gente\\Nse equivoca.'), (11.30, 'Sub', 'Si naciste el 20 de enero de 1991,'), (14.90, 'Sub', 'no eres Cabra,'),
        (16.16, 'Oro', 'eres Caballo.'), (17.98, 'Sub', 'El año chino no empieza en enero,'), (20.22, 'Oro', 'empieza con la luna nueva.'),
        (22.02, 'Sub', 'Pon tu fecha en mi web\\Ny te lo digo.'), (24.12, 'Sub', 'El enlace está en el perfil.')],
  big=[(1.3, 5.4, '2027', 'AÑO DE LA CABRA DE FUEGO'), (11.3, 14.85, '20 · 1 · 1991', '¿CABRA?'), (14.9, 17.9, 'Caballo', 'SU AÑO CHINO EMPEZÓ EL 15 DE FEBRERO')],
  panel=[(1.2, 5.5), (11.2, 17.95)]),
 'mateo': dict(nombre='Mateo', disc='ASTROLOGÍA',
  clips=[('c4', 4.2), ('c7', 5.4), ('c5', 2.8), ('s6', 6.3), ('c4', None)],
  subs=[(0.12, 'Oro', 'Soy Mateo.'), (1.24, 'Sub', 'El martes 24 de noviembre\\Nhay luna llena'), (4.30, 'Oro', 'y esta vez cae en Géminis.'),
        (7.22, 'Sub', 'Géminis es la palabra,\\Nla mente, las conversaciones.'), (11.98, 'Sub', 'Si tienes algo pendiente de decir,'),
        (13.94, 'Oro', 'esa noche es buena para decirlo.'), (16.70, 'Sub', 'En mi web tienes la luna\\Nde cada noche del mes,'), (19.34, 'Oro', 'calculada con datos de la NASA.')],
  big=[(1.2, 4.15, '24 nov', 'LUNA LLENA EN GÉMINIS'), (4.2, 7.1, '24 nov', 'LUNA LLENA EN GÉMINIS', 1150)], panel=[(1.1, 4.2)]),
 'ines': dict(nombre='Inés', disc='NUMEROLOGÍA',
  clips=[('c8', 6.3), ('s9', 8.4), ('c10', 6.9), ('c8', 5.5), ('c10', None)],
  subs=[(0.16, 'Oro', 'Soy Inés.'), (1.18, 'Sub', '¿Sabes cuál es tu número de vida?'), (3.08, 'Sub', 'Sale de tu fecha de nacimiento.'), (4.90, 'Oro', 'Mira:'),
        (6.36, 'Sub', '21 de marzo de 1985.'), (10.14, 'Sub', 'El mes: 3.'), (11.86, 'Sub', 'El día: 2 + 1, 3.'), (14.72, 'Sub', 'El año: 1 + 9 + 8 + 5, 23…'),
        (19.40, 'Sub', 'y 2 + 3, 5.'), (21.66, 'Sub', '3 + 3 + 5…'), (24.52, 'Oro', 'once.'), (25.66, 'Oro', 'Un número maestro.'),
        (27.16, 'Sub', '¿Cuál es el tuyo?'), (28.22, 'Oro', 'Calcúlalo en mi web.')],
  big=[(6.3, 10.1, '21 · 3 · 1985', 'TU FECHA DE NACIMIENTO'), (10.1, 11.85, '3', 'EL MES'), (11.85, 14.7, '2 + 1 = 3', 'EL DÍA'),
       (14.7, 19.35, '1 + 9 + 8 + 5 = 23', 'EL AÑO'), (19.35, 21.6, '2 + 3 = 5', 'EL AÑO'), (21.6, 24.45, '3 + 3 + 5', 'SUMA FINAL'), (24.45, 27.1, '11', 'NÚMERO MAESTRO')],
  panel=[(6.25, 27.15)]),
}

def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))

def build(n):
    r = R[n]; vd = dur(f'voz-{n}.mp3'); total = round(vd + 0.15 + TAIL, 2)
    segs, used = [], 0
    for c, L in r['clips']:
        if L is None: L = total - used
        segs.append((c, L)); used += L
    # Subtítulos: cada frase dura hasta que empieza la siguiente
    ev = [f"Dialogue: 2,{t(0)},{t(total - TAIL)},Etiqueta,,0,0,0,,Creado con IA",
          f"Dialogue: 1,{t(0)},{t(total - TAIL)},Marca,,0,0,0,,LÍA Y COMPAÑÍA · {r['nombre'].upper()}"]
    subs = r['subs']
    for i, (a, st, tx) in enumerate(subs):
        b = subs[i + 1][0] - 0.06 if i + 1 < len(subs) else vd + 0.1
        tx = tx.replace('+', '{\\fnHanken Grotesk}+{\\fnBodoni Moda}')
        ev.append(f"Dialogue: 0,{t(a + 0.15)},{t(b + 0.15)},{st},,0,0,0,,{{\\fad(80,80)}}{tx}")
    MAS = '{\\fnHanken Grotesk}+{\\fnBodoni Moda}'
    for bg in r['big']:
        a, b, big, sub = bg[:4]; y = bg[4] if len(bg) > 4 else 960
        fs = '' if len(big) <= 5 else ('\\fs150' if len(big) <= 9 else '\\fs118')
        big = big.replace('+', MAS)
        ev.append(f"Dialogue: 0,{t(a + 0.15)},{t(b + 0.15)},Big,,0,0,0,,{{\\fad(220,180)\\pos(540,{y}){fs}}}{big}")
        ev.append(f"Dialogue: 0,{t(a + 0.3)},{t(b + 0.15)},BigSub,,0,0,0,,{{\\fad(220,180)\\pos(540,{y + (150 if not fs else 125)})}}{sub}")
    cs = total - TAIL + 0.05
    ev.append(f"Dialogue: 0,{t(cs)},{t(total)},Cierre,,0,0,0,,{{\\fad(300,0)\\pos(540,1480)}}{r['nombre']}")
    ev.append(f"Dialogue: 0,{t(cs + 0.25)},{t(total)},CierreSub,,0,0,0,,{{\\fad(300,0)\\pos(540,1620)}}{r['disc']} · LÍA Y COMPAÑÍA")
    open(f'subs-{n}.ass', 'w').write(HDR + '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n' + '\n'.join(ev) + '\n')
    ins, fc = [], []
    for i, (c, L) in enumerate(segs):
        need = L + (X if i < len(segs) - 1 else 0)
        if c.startswith('s'):  # foto fija con zoom lento
            ins += ['-framerate', '30', '-loop', '1', '-t', f'{need + 0.2:.2f}', '-i', f'{c}.png']
            fr = int((need + 0.2) * 30)
            fc.append(f"[{i}:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,zoompan=z='1+0.10*on/{fr}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=30,trim=0:{need:.3f},setpts=PTS-STARTPTS,format=yuv420p[v{i}]")
        else:
            f = f'{c}.mp4'; d = dur(f); ins += ['-i', f]
            sp = max(1.0, need / (d - 0.05))
            ch = f"[{i}:v]setpts={sp:.4f}*(PTS-STARTPTS),scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920"
            ch += ",minterpolate=fps=30:mi_mode=blend" if sp > 1.15 else ",fps=30"
            fc.append(ch + f",trim=0:{need:.3f},setpts=PTS-STARTPTS,format=yuv420p[v{i}]")
    prev, off = 'v0', 0
    for i in range(1, len(segs)):
        off += segs[i - 1][1]
        fc.append(f"[{prev}][v{i}]xfade=transition=fade:duration={X}:offset={off - X / 2:.3f}[x{i}]"); prev = f'x{i}'
    k = len(segs); ins += ['-loop', '1', '-i', 'g-bottom.png', '-loop', '1', '-i', 'g-panel.png']
    fc.append(f"[{prev}]eq=contrast=1.04:saturation=0.96,vignette=PI/5[base]")
    fc.append(f"[base][{k}:v]overlay=0:0:shortest=1[b1]")
    en = '+'.join(f'between(t,{a + 0.1},{b + 0.2})' for a, b in r['panel']) or '0'
    fc.append(f"[b1][{k + 1}:v]overlay=0:0:shortest=1:enable='{en}'[b2]")
    fc.append(f"[b2]subtitles=subs-{n}.ass:fontsdir={FONTS},fade=t=in:st=0:d=0.25,fade=t=out:st={total - 0.45}:d=0.45[v]")
    na = k + 2; ins += ['-i', f'voz-{n}.mp3']
    fc.append(f"[{na}:a]adelay=150|150,apad,atrim=0:{total},afade=t=out:st={total - 0.4}:d=0.4[aud]")
    cmd = ['ffmpeg', '-y', '-loglevel', 'error'] + ins + ['-filter_complex', ';'.join(fc), '-map', '[v]', '-map', '[aud]', '-t', str(total), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', f'reel-{n}.mp4']
    subprocess.run(cmd, check=True); print(n, total, 'ok')

for n in (sys.argv[1:] or R): build(n)
