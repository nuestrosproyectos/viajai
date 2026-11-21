#!/usr/bin/env python3
"""Genera piezas de un guion con la voz de un presentador (ElevenLabs) y las revisa con transcripción.
Uso: voz_piezas.py GUION.md CARPETA PRESENTADOR CLAVE [CLAVE...]
  PRESENTADOR: lia | mateo | ines
  CLAVE: el código de la sección del guion (A1, C1, V6, S12...). Escribe CARPETA/CLAVE.mp3 y CARPETA/CLAVE.json
  (transcripción con tiempos por palabra, la que usan los montajes para subtítulos). Sobrescribe lo que haya.
La clave de ElevenLabs la pone el proxy (cabecera ficticia).
"""
import difflib, json, os, re, subprocess, sys

VOCES = {
    'lia': ('BkOojM1ZhtSAHgsAkMx2', 'eleven_flash_v2_5', None),
    'mateo': ('Fm7BveXW2pOo1gtPxYfM', 'eleven_flash_v2_5', None),
    'ines': ('XirH81OfTmRrNPuPRQCg', 'eleven_multilingual_v2', {'stability': 0.6, 'similarity_boost': 0.8, 'style': 0.15, 'speed': 0.92}),
}

def seccion(guion, clave):
    g = open(guion).read() + '\n## FIN'
    m = re.search(rf'^## {re.escape(clave)} · [^\n]*\n(.*?)\n## ', g, re.S | re.M)
    if not m: raise SystemExit(f'No encuentro la sección {clave} en {guion}')
    return m.group(1).strip()

norm = lambda x: re.findall(r'\w+', x.lower().replace('…', ' '))

def main():
    guion, carpeta, quien, *claves = sys.argv[1:]
    voz, modelo, ajustes = VOCES[quien]
    os.makedirs(carpeta, exist_ok=True)
    mal = []
    for k in claves:
        texto = seccion(guion, k)
        cuerpo = {'text': texto, 'model_id': modelo, 'language_code': 'es'}
        if ajustes: cuerpo['voice_settings'] = ajustes
        req = os.path.join(carpeta, f'.{k}.req.json'); json.dump(cuerpo, open(req, 'w'))
        mp3 = os.path.join(carpeta, k + '.mp3')
        subprocess.run(['curl', '-s', '-f', '-X', 'POST', f'https://api.elevenlabs.io/v1/text-to-speech/{voz}?output_format=mp3_44100_128',
                        '-H', 'xi-api-key: dummy', '-H', 'Content-Type: application/json', '-d', '@' + req, '-o', mp3], check=True)
        os.remove(req)
        r = subprocess.run(['curl', '-s', '-f', '-X', 'POST', 'https://api.elevenlabs.io/v1/speech-to-text', '-H', 'xi-api-key: dummy',
                            '-F', 'model_id=scribe_v1', '-F', 'language_code=es', '-F', 'timestamps_granularity=word', '-F', f'file=@{mp3}'],
                           capture_output=True, check=True).stdout
        open(os.path.join(carpeta, k + '.json'), 'wb').write(r)
        a, b = norm(texto), norm(json.loads(r).get('text', ''))
        dif = [(' '.join(a[i1:i2]), ' '.join(b[j1:j2])) for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b).get_opcodes() if op != 'equal']
        dif = [d for d in dif if not (d[1] and all(w.isdigit() for w in d[1].split()))]   # cifras en lugar de números escritos
        d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3], capture_output=True, text=True).stdout)
        print(f'{k}: {d:.1f} s', 'OK' if not dif else f'REVISAR {dif}', flush=True)
        if dif: mal.append(k)
    if mal: print('Piezas para revisar:', ' '.join(mal))

if __name__ == '__main__':
    main()
