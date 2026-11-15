# Genera una vista previa de un solo archivo (sin servidor) con datos reales de RoxyAPI ya descargados.
import base64, json, os, re
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(BASE, *a)
b64 = lambda f: 'data:image/jpeg;base64,' + base64.b64encode(open(f, 'rb').read()).decode()
def frases(t, n):
    m = re.findall(r'[^.!?]+[.!?]+', t or '')
    return ' '.join(m[:n]).strip() if m else (t or '')

D = json.load(open(P('data', 'demo.json')))
# Recortar textos largos de las cartas para aligerar
for c in D['cards']:
    for lado in ('upright', 'reversed'):
        L = c[lado]
        c[lado] = {'keywords': L['keywords'], 'description': frases(L['description'], 3),
                   'love': frases(L.get('love'), 2), 'career': frases(L.get('career'), 2), 'finances': frases(L.get('finances'), 2)}
    c.pop('imageUrl', None); c.pop('keywords', None)
for k in list(D['natal']):
    n = D['natal'][k]
    for p in n['planets']:
        p['interpretation'] = {'summary': p.get('interpretation', {}).get('summary', '')}
    for a in n['aspects']:
        a.pop('aspectInterpretation', None)
D['bio'] = {}
D['img'] = {c['id']: b64(P('public', 'cartas', c['id'] + '.jpg')) for c in D['cards']}

html = open(P('public', 'index.html'), encoding='utf8').read()
css = open(P('public', 'estilo.css'), encoding='utf8').read()
js = open(P('public', 'app.js'), encoding='utf8').read()
head = re.search(r'<head>(.*?)</head>', html, re.S).group(1)
body = re.search(r'<body>(.*?)</body>', html, re.S).group(1)
head = re.sub(r'<meta charset[^>]*>\s*|<meta name="viewport"[^>]*>\s*', '', head)
head = head.replace('<link rel="stylesheet" href="estilo.css">', '<style>' + css + '</style>')
head = head.replace('<title>Lía y compañía · Tarot y astrología con IA</title>', '<title>Lía y compañía</title>\n<meta name="claude:viewport-fit-sides" content="cover">')
for f in sorted(set(re.findall(r'src="img/([a-z-]+)\.jpg"', body))):
    body = body.replace(f'src="img/{f}.jpg"', 'src="' + b64(P('public', 'img', f + '.jpg')) + '"')
assert 'src="img/' not in body
aviso = '<p class="aviso-prev">Vista previa · datos reales de RoxyAPI de hoy · la carta astral y la pareja, solo con los ejemplos · los botones de pago no cobran</p>'
body = body.replace('<script src="app.js"></script>', '<script>window.LIA_DEMO=' + json.dumps(D, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';</script>\n<script>' + js + '</script>')
body = body.replace('<a class="btn btn-sec" href="#equipo">Conocer al equipo</a></div>', '<a class="btn btn-sec" href="#equipo">Conocer al equipo</a></div>' + aviso, 1)
assert aviso in body
estilo_aviso = '<style>.aviso-prev{margin-top:22px;max-width:520px;font-size:13px;color:#9d948b;border-left:2px solid #a32637;padding-left:12px}</style>'
out = head.strip() + '\n' + estilo_aviso + '\n' + body.strip() + '\n'
open(P('lia-vista-previa.html'), 'w', encoding='utf8').write(out)
print(len(out) // 1024, 'KB')
