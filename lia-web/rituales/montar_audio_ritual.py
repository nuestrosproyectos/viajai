#!/usr/bin/env python3
"""Genera y monta el audio guiado de un ritual (voz de Inés + pausas + fondo suave + campana).
Uso: montar_audio_ritual.py GUION.md CARPETA_TRABAJO "Nombre de salida.mp3" [VOZ_ID]
El guion tiene una sección «## Audio guiado» con líneas «R1: texto» seguidas de «[PAUSA n]» (segundos).
Revisa cada pieza con transcripción automática (ElevenLabs scribe_v1) y avisa si no coincide con el texto.
"""
import difflib, json, os, re, subprocess, sys

guion, W, salida = sys.argv[1], os.path.abspath(sys.argv[2]), sys.argv[3]
VOZ = sys.argv[4] if len(sys.argv) > 4 else 'XirH81OfTmRrNPuPRQCg'   # Inés (ElevenLabs Sophie)
os.makedirs(W, exist_ok=True); os.chdir(W)
parte = open(guion).read().split('## Audio guiado')[1]
items = re.findall(r'^(R\d+): (.*?)(?=^\[PAUSA|^R\d+:|\Z)', parte, re.S | re.M)
pausas = {m.group(1): int(m.group(2)) for m in re.finditer(r'^(R\d+): .*?\n\[PAUSA (\d+)\]', parte, re.S | re.M)}
norm = lambda x: re.findall(r'\w+', x.lower())
dur = lambda f: float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
ESCRITOS = {'2', '6', '9', '24', '27', '31', '2026', '2027', '1'}   # la transcripción escribe cifras: no es error

for k, t in items:
    t = t.strip()
    if not os.path.exists(k + '.mp3'):
        json.dump({'text': t, 'model_id': 'eleven_multilingual_v2', 'language_code': 'es',
                   'voice_settings': {'stability': 0.6, 'similarity_boost': 0.8, 'style': 0.15, 'speed': 0.92}}, open('req.json', 'w'))
        subprocess.run(['curl', '-s', '-X', 'POST', f'https://api.elevenlabs.io/v1/text-to-speech/{VOZ}?output_format=mp3_44100_128',
                        '-H', 'xi-api-key: dummy', '-H', 'Content-Type: application/json', '-d', '@req.json', '-o', k + '.mp3'], check=True)
    r = json.loads(subprocess.run(['curl', '-s', '-X', 'POST', 'https://api.elevenlabs.io/v1/speech-to-text', '-H', 'xi-api-key: dummy',
                                   '-F', 'model_id=scribe_v1', '-F', 'language_code=es', '-F', f'file=@{k}.mp3'], capture_output=True).stdout)
    a, b = norm(t), norm(r.get('text', ''))
    dif = [(a[i1:i2], b[j1:j2]) for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b).get_opcodes() if op != 'equal']
    raros = [x for x in dif if not set(x[1]) <= ESCRITOS]
    print(k, round(dur(k + '.mp3'), 1), 's', 'OK' if not raros else f'REVISAR {raros}')

# voz con sus pausas
ins, fc, n = [], '', 0
for k, _ in items:
    ins += ['-i', k + '.mp3']; fc += f'[{n}:a]aresample=44100,aformat=channel_layouts=mono[a{n}];'; n += 1
    if pausas.get(k):
        ins += ['-f', 'lavfi', '-t', str(pausas[k]), '-i', 'anullsrc=r=44100:cl=mono']; fc += f'[{n}:a]aformat=channel_layouts=mono[a{n}];'; n += 1
subprocess.run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', fc + ''.join(f'[a{i}]' for i in range(n)) + f'concat=n={n}:v=0:a=1[v]', '-map', '[v]', 'voz.wav'], check=True)
T = dur('voz.wav') + 6
# fondo: viento lejano (ruido marrón filtrado, con vaivén lento) y campana al principio y al final
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'anoisesrc=color=brown:duration={T}:amplitude=0.6:seed=7',
                '-af', f"lowpass=f=320,highpass=f=60,volume='0.10*(0.75+0.25*sin(2*PI*t/14))':eval=frame,afade=t=in:d=6,afade=t=out:st={T - 6}:d=6", 'fondo.wav'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', 'sine=f=528:d=6', '-f', 'lavfi', '-i', 'sine=f=792:d=6',
                '-filter_complex', '[0][1]amix=inputs=2,afade=t=out:st=0.05:d=5.9:curve=exp,volume=0.35', 'campana.wav'], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'fondo.wav', '-i', 'voz.wav', '-i', 'campana.wav', '-i', 'campana.wav',
                '-filter_complex', f'[1]adelay=3000[v];[3]adelay={int((T - 6) * 1000)}[c2];[0][v][2][c2]amix=inputs=4:normalize=0,alimiter=limit=0.9,loudnorm=I=-18:TP=-1.5',
                '-ac', '2', '-ar', '44100', '-b:a', '192k', salida], check=True)
print('FINAL', salida, round(dur(salida), 1), 's')
