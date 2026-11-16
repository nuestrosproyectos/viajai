# Genera las voces de la semana por la API directa de ElevenLabs (mucho más barata) y saca los tiempos de cada palabra.
import json, subprocess, os
VOCES = {'lia': 'BkOojM1ZhtSAHgsAkMx2', 'mateo': 'Fm7BveXW2pOo1gtPxYfM', 'mei': 'Ugu6b5thG2v8TpHWKQhs', 'ines': 'XirH81OfTmRrNPuPRQCg'}
GUIONES = {
 'r1-lia-enamorados': ('lia', 'Soy Lía. Si ahora mismo estás pensando en alguien, esta carta es para ti. Los Enamorados. Habla de amor, sí... pero sobre todo de una elección. Decir sí a algo, y no a lo demás. Decidir con el corazón y con la cabeza a la vez. Si te ha llegado, guárdalo. Y si quieres tu tirada de amor completa, tienes el enlace en el perfil.'),
 'r2-mei-aliados': ('mei', 'Soy Mei. En el año de la Cabra, a unos animales les irá mejor que a otros. Según la tradición china, el gran aliado de la Cabra es el Caballo. Le siguen el Conejo y el Cerdo. Y el que más choca con ella es el Buey. ¿Cuál es el tuyo? Pon tu fecha en mi web y te digo cómo te trata dos mil veintisiete.'),
 'r3-mateo-ascendente': ('mateo', 'Soy Mateo. ¿Sabías que el ascendente cambia, de media, cada dos horas? Dos personas nacidas el mismo día, en la misma ciudad, pueden tener ascendentes distintos. Por eso, para tu carta astral, necesito tu hora de nacimiento. Si no la sabes, suele venir en el certificado literal de nacimiento. Merece la pena buscarla.'),
 'r4-ines-maestros': ('ines', 'Soy Inés. En numerología hay tres números que no se reducen: el once, el veintidós y el treinta y tres. Son los números maestros. El once es la intuición. El veintidós, quien construye en grande. Y el treinta y tres, quien enseña y cuida de los demás. ¿Te ha salido alguno? Calcúlalo en mi web.'),
 'r5-lia-miedo': ('lia', 'Soy Lía. Hay tres cartas que asustan a todo el mundo. La Muerte... casi nunca habla de morir: habla de cerrar una etapa. La Torre: algo que se cae porque estaba mal construido. Y el Diablo: aquello que te ata y no te conviene. Ninguna es una condena. Son avisos. Y un aviso a tiempo... es un regalo.'),
 'r6-mateo-carta': ('mateo', 'Soy Mateo. Tu signo es solo una parte de ti. Tu carta astral tiene catorce astros, doce casas y decenas de ángulos entre ellos. Yo los calculo con los datos planetarios de la NASA. Dime tu fecha, tu hora y tu ciudad en mi web... y te enseño tu cielo completo.'),
 'r7-ines-biorritmo': ('ines', 'Soy Inés. El día que naciste empezaron tres ciclos que siguen hoy. El físico dura veintitrés días. El emocional, veintiocho. Y el mental, treinta y tres. Hay días en que los tres están arriba... y días en que todo cuesta. En mi web te enseño cómo están los tuyos hoy.'),
}
def cuenta():
    return json.loads(subprocess.run(['curl', '-s', '-H', 'xi-api-key: dummy', 'https://api.elevenlabs.io/v1/user/subscription'], capture_output=True).stdout)['character_count']
c0 = cuenta()
for nombre, (quien, texto) in GUIONES.items():
    if not os.path.exists(f'{nombre}.mp3'):
        json.dump({'text': texto, 'model_id': 'eleven_flash_v2_5', 'language_code': 'es'}, open('req.json', 'w'))
        subprocess.run(['curl', '-s', '-X', 'POST', f'https://api.elevenlabs.io/v1/text-to-speech/{VOCES[quien]}?output_format=mp3_44100_128', '-H', 'xi-api-key: dummy', '-H', 'Content-Type: application/json', '-d', '@req.json', '-o', f'{nombre}.mp3'], check=True)
    if not os.path.exists(f'{nombre}.json'):
        r = subprocess.run(['curl', '-s', '-X', 'POST', 'https://api.elevenlabs.io/v1/speech-to-text', '-H', 'xi-api-key: dummy', '-F', 'model_id=scribe_v1', '-F', 'language_code=es', '-F', f'file=@{nombre}.mp3'], capture_output=True).stdout
        open(f'{nombre}.json', 'wb').write(r)
    d = json.load(open(f'{nombre}.json'))
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{nombre}.mp3']))
    print(f'{nombre}: {dur:.1f} s · {d["text"][:90]}')
print('caracteres gastados (puede tardar en actualizarse):', cuenta() - c0)
