import os
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(B, *a)
h = open(P('public', 'index.html'), encoding='utf8').read()
a = '<div class="abanico" id="abanico" role="group" aria-label="Baraja de 78 cartas: elige una"></div>'
b = '<p class="pista" id="pista"><span class="dedo" aria-hidden="true"></span>Toca una carta para ver tu respuesta</p>\n      ' + a
if 'id="pista"' not in h:
    assert a in h; h = h.replace(a, b, 1)
h = h.replace('<p class="ayuda" id="tarotAyuda">Pasa el dedo por la baraja y toca una carta.</p>', '<p class="ayuda" id="tarotAyuda">Puedes pasar el dedo por la baraja: la carta que pisas se levanta.</p>')
open(P('public', 'index.html'), 'w', encoding='utf8').write(h)

j = open(P('public', 'app.js'), encoding='utf8').read()
a = "alVer(abanico, () => setTimeout(abrirAbanico, 250), .35);"
b = """alVer(abanico, () => setTimeout(abrirAbanico, 250), .35);
// Ola que recorre la baraja cada pocos segundos para invitar a tocar
let tocado = false;
function ola() {
  if (tocado || tirando || !abanico.classList.contains('listo') || QUIETO) return;
  $$('.naipe', abanico).forEach((n, i) => setTimeout(() => { n.classList.add('ola'); setTimeout(() => n.classList.remove('ola'), 260); }, i * 14));
}
setInterval(ola, 4200);
abanico.addEventListener('pointerdown', () => { tocado = true; });"""
if 'function ola()' not in j:
    assert a in j; j = j.replace(a, b, 1)
a = "tirando = true; n.classList.add('fuera');"
b = "tirando = true; tocado = true; $('#pista').classList.add('oculta'); n.classList.add('fuera');"
if "$('#pista').classList.add('oculta')" not in j:
    assert a in j; j = j.replace(a, b, 1)
a = "await espera(650); abrirAbanico(); tirando = false;"
b = "await espera(650); abrirAbanico(); tirando = false; tocado = false; $('#pista').classList.remove('oculta');"
if "$('#pista').classList.remove('oculta')" not in j:
    assert a in j; j = j.replace(a, b, 1)
open(P('public', 'app.js'), 'w', encoding='utf8').write(j)

c = open(P('public', 'estilo.css'), encoding='utf8').read()
extra = """
/* Baraja más visible y con invitación a tocar */
.naipe{background:repeating-linear-gradient(45deg,rgba(236,228,214,.1) 0 1px,transparent 1px 7px),repeating-linear-gradient(-45deg,rgba(236,228,214,.1) 0 1px,transparent 1px 7px),linear-gradient(160deg,#8a2234,#561320);
  box-shadow:inset 0 0 0 3px #4a1019,inset 0 0 0 4.5px rgba(236,228,214,.7),-3px 6px 14px rgba(0,0,0,.55)}
.naipe::after{border-color:rgba(236,228,214,.6)}
.naipe.ola{--y:-16px;transition-delay:0s!important}
.naipe:hover,.naipe.alzada{--y:-30px;filter:brightness(1.3)}
.pista{display:inline-flex;align-items:center;gap:12px;margin-top:34px;padding:10px 18px 10px 14px;border:1px solid var(--linea2);border-radius:999px;font-size:15px;color:var(--hueso);background:rgba(236,228,214,.04);animation:latido 2.4s ease-in-out infinite;transition:opacity .4s}
.pista.oculta{opacity:0;pointer-events:none}
.dedo{width:10px;height:10px;border-radius:50%;background:var(--hueso);box-shadow:0 0 0 0 rgba(236,228,214,.6);animation:onda 1.6s ease-out infinite}
@keyframes onda{to{box-shadow:0 0 0 14px rgba(236,228,214,0)}}
@keyframes latido{50%{border-color:rgba(236,228,214,.6)}}
.abanico{margin-top:20px}
"""
if '.pista{' not in c:
    c += extra
open(P('public', 'estilo.css'), 'w', encoding='utf8').write(c)
print('ok')
