# Añade las secciones «Por qué una IA», cifras y preguntas frecuentes. Todo dato es verificable (ver comentarios).
import os
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(B, *a)
h = open(P('public', 'index.html'), encoding='utf8').read()

# Fuentes: RoxyAPI llms.txt y https://roxyapi.com/methodology (DE440 de NASA JPL; 231/231 posiciones a <0,32" de JPL Horizons;
# ángulos y casas a <1,5"; 5.180.000+ localidades; 13.957 pruebas por despliegue). 936 = 78 cartas x 2 posiciones x 6 temas (datos de la API).
# Moneda de 1 € = 23,25 mm: a 0,32" se ve desde 23,25 mm x 206265 / 0,32 = 15 km.
cifras = '''
<!-- CIFRAS -->
<section class="cifras" id="cifras" aria-label="Datos de cómo trabajamos"><div class="wrap">
  <div class="cifra"><b data-n="936">0</b><span>significados de tarot que Lía tiene presentes en cada tirada: 78 cartas, al derecho y del revés, en 6 temas</span></div>
  <div class="cifra"><b data-n="0.32" data-dec="2" data-suf="″">0</b><span>segundos de arco de diferencia máxima con los datos de la NASA al situar los planetas: como una moneda de un euro vista a 15 km</span></div>
  <div class="cifra"><b data-n="5.18" data-dec="2" data-suf=" M">0</b><span>de pueblos y ciudades con su hora oficial de cada época, para que tu carta parta del sitio exacto</span></div>
  <div class="cifra"><b data-n="24" data-suf=" h">0</b><span>al día, todos los días. Sin turnos, sin esperas y sin que nadie tenga prisa por colgar</span></div>
</div></section>
'''
porque = '''
<!-- POR QUÉ UNA IA -->
<section class="seccion oscuro" id="porque"><div class="wrap">
  <div class="sec-cab"><div><p class="rotulo">Por qué una inteligencia artificial</p><h2>No adivina. <em>Calcula, recuerda y no se cansa.</em></h2></div>
  <p>Nadie puede garantizarte el futuro, y desconfía de quien lo haga. Lo que sí podemos garantizarte es rigor: un cálculo de precisión astronómica y una lectura que tiene en cuenta todo, siempre igual de cuidada.</p></div>
  <div class="comparativa" role="table" aria-label="Comparación con una consulta tradicional">
    <div class="cmp-cab" role="row"><span role="columnheader"></span><span role="columnheader">Una consulta tradicional</span><span role="columnheader">Lía y compañía</span></div>
    <div class="cmp-fila" role="row"><b role="rowheader">Dónde están los planetas</b><span role="cell">Depende de la herramienta de cada profesional y de que tenga en cuenta la hora de verano de tu año.</span><span role="cell">La efeméride DE440 del laboratorio JPL de la NASA, con la hora oficial que regía el día que naciste. Diferencia máxima comprobada con la NASA: 0,32 segundos de arco.</span></div>
    <div class="cmp-fila" role="row"><b role="rowheader">El lugar de nacimiento</b><span role="cell">A menudo se toma la ciudad grande más cercana.</span><span role="cell">Las coordenadas exactas de tu pueblo, entre más de 5 millones de localidades. Tu ascendente cambia con unos kilómetros.</span></div>
    <div class="cmp-fila" role="row"><b role="rowheader">Las cartas del tarot</b><span role="cell">Depende de la memoria y la experiencia de cada tarotista.</span><span role="cell">Los 936 significados de la baraja Rider-Waite-Smith, la de referencia del tarot moderno, presentes en cada tirada: amor, trabajo, dinero, salud y espiritualidad, al derecho y del revés.</span></div>
    <div class="cmp-fila" role="row"><b role="rowheader">El horóscopo chino</b><span role="cell">Muchas veces solo se mira el año de nacimiento.</span><span role="cell">El calendario lunar real: tu animal cambia el día exacto del año nuevo chino, que cada año cae en una fecha distinta.</span></div>
    <div class="cmp-fila" role="row"><b role="rowheader">El precio</b><span role="cell">En las líneas 806 se paga por minuto, así que el precio final depende de lo que dure la llamada.</span><span role="cell">Precio cerrado antes de empezar, con IVA. Lo gratis es gratis de verdad.</span></div>
    <div class="cmp-fila" role="row"><b role="rowheader">La sinceridad</b><span role="cell">Hay consultas que se presentan como videntes con dones especiales.</span><span role="cell">Te decimos desde el primer momento que somos una IA. Sin dones, sin promesas y sin presión.</span></div>
  </div>
  <div class="metodo">
    <div><i>i.</i><b>Datos de la NASA</b><span>Las posiciones de los planetas salen de la efeméride DE440 del Jet Propulsion Laboratory de la NASA, una de las efemérides de referencia de la astronomía actual.</span></div>
    <div><i>ii.</i><b>Comprobado en público</b><span>231 de 231 posiciones comparadas con JPL Horizons, el servicio oficial de la NASA, dentro de 0,32″. Las casas y el ascendente, dentro de 1,5″. La prueba es abierta y se repite cada mes.</span></div>
    <div><i>iii.</i><b>13.957 pruebas</b><span>Cada vez que el motor de cálculo que usamos se actualiza, pasa casi 14.000 pruebas automáticas, incluidos los casos raros: cambios de hora, nacimientos a medianoche o en el Polo Sur.</span></div>
    <div><i>iv.</i><b>Siempre igual de cuidado</b><span>La lectura de las tres de la madrugada tiene el mismo rigor que la de las diez de la mañana. Una IA no tiene días malos.</span></div>
  </div>
</div></section>
'''
faq = '''
  <div class="faq">
    <h3>Preguntas que nos hacéis</h3>
    <details><summary>¿Una inteligencia artificial puede leer el tarot?</summary><p>Puede hacer lo mismo que un buen tarotista: conocer el significado de cada carta en cada posición y relacionarlas entre sí. La diferencia es que no se le olvida ninguno de los 936 significados y no se cansa. Las cartas se barajan de verdad en cada tirada; nadie elige cuál te sale.</p></details>
    <details><summary>¿De dónde salen los datos de la carta astral?</summary><p>De la efeméride DE440 del Jet Propulsion Laboratory de la NASA. Con tu fecha, hora y lugar calculamos dónde estaban el Sol, la Luna, los planetas y otros puntos el minuto exacto en que naciste, con la hora oficial de esa fecha en tu localidad.</p></details>
    <details><summary>¿Acertáis el futuro?</summary><p>No, y nadie puede garantizarlo. Lo que te ofrecemos es una forma de mirar tu situación desde otro ángulo, con un cálculo exacto y una lectura cuidada. Las decisiones importantes de salud, dinero o leyes, siempre con un profesional.</p></details>
    <details><summary>¿Por qué no llamo a un vidente por teléfono?</summary><p>Puedes hacerlo. Aquí sabes desde el principio que hablas con una IA, pagas un precio cerrado y no por minuto, y tienes la lectura por escrito para releerla cuando quieras.</p></details>
    <details><summary>¿Qué hacéis con mis datos?</summary><p>Tu fecha, hora y lugar de nacimiento solo se usan para hacer el cálculo que nos pides. No los vendemos ni los cedemos a nadie.</p></details>
    <details><summary>¿Quién está detrás?</summary><p>Area Internet Business Group, S.L.U., una empresa de Granada. Atención en español y precios en euros con IVA.</p></details>
  </div>
'''
if 'id="cifras"' not in h:
    a = '<!-- LÍA · TAROT SÍ O NO -->'
    assert a in h; h = h.replace(a, cifras.strip() + '\n\n' + a, 1)
if 'id="porque"' not in h:
    a = '<!-- TRANSPARENCIA -->'
    assert a in h; h = h.replace(a, porque.strip() + '\n\n' + a, 1)
if 'class="faq"' not in h:
    a = '''    <div><i>iv.</i><b>Quién responde</b><span>Una empresa española, con atención en español y precios en euros con IVA.</span></div>
  </div>'''
    assert a in h; h = h.replace(a, a + '\n' + faq.rstrip(), 1)
# Credenciales de Mateo y subtítulo de portada con el dato real
h = h.replace('<span class="herr">Posiciones planetarias reales · casas Placidus</span>', '<span class="herr">Efeméride DE440 de la NASA (JPL) · casas Placidus</span>')
h = h.replace('<span class="herr">Baraja Rider-Waite de 1909 · 78 cartas</span>', '<span class="herr">Baraja Rider-Waite-Smith · 936 significados</span>')
h = h.replace('Tienen cara y nombre, trabajan con datos astronómicos reales y te atienden a cualquier hora, sin esperas.', 'Tienen cara y nombre, calculan con los datos planetarios de la NASA y te atienden a cualquier hora, sin esperas y a precio cerrado.')
h = h.replace('<nav aria-label="Secciones"><a href="#equipo">Quién te atiende</a>', '<nav aria-label="Secciones"><a href="#equipo">Quién te atiende</a><a href="#porque">Por qué una IA</a>')
open(P('public', 'index.html'), 'w', encoding='utf8').write(h)

c = open(P('public', 'estilo.css'), encoding='utf8').read()
if '.cifras{' not in c:
    c += """
/* Cifras */
.cifras{background:#0b0807;border-top:1px solid var(--linea);border-bottom:1px solid var(--linea)}
.cifras .wrap{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(20px,3vw,44px);padding-block:clamp(44px,6vw,72px)}
@media(max-width:900px){.cifras .wrap{grid-template-columns:1fr 1fr}}
.cifra b{display:block;font:400 clamp(46px,5vw,72px)/1 var(--titulo);font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.cifra span{display:block;margin-top:12px;font-size:14.5px;color:var(--gris2);line-height:1.5}
/* Comparativa */
.comparativa{border-top:1px solid var(--linea2)}
.cmp-cab,.cmp-fila{display:grid;grid-template-columns:.8fr 1fr 1.2fr;gap:clamp(14px,2.5vw,36px);padding:20px 0;border-bottom:1px solid var(--linea)}
.cmp-cab span{font-size:13.5px;color:var(--gris)}.cmp-cab span:last-child{color:var(--hueso);font-weight:600}
.cmp-fila b{font:400 22px/1.2 var(--titulo)}
.cmp-fila span:nth-of-type(1){color:var(--gris);font-size:15px;}
.cmp-fila span:nth-of-type(2){color:var(--hueso);font-size:15.5px;padding-left:18px;border-left:2px solid var(--lacre2)}
@media(max-width:820px){.cmp-cab{display:none}.cmp-fila{grid-template-columns:1fr;gap:8px}.cmp-fila span:nth-of-type(1)::before{content:"Tradicional: ";text-decoration:none;display:inline}.cmp-fila span:nth-of-type(2)::before{content:"Aquí: ";font-weight:600}}
.metodo{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(20px,3vw,40px);margin-top:clamp(48px,6vw,80px)}
@media(max-width:900px){.metodo{grid-template-columns:1fr 1fr}}@media(max-width:520px){.metodo{grid-template-columns:1fr}}
.metodo div{border-top:1px solid var(--linea2);padding-top:20px}.metodo i{display:block;font:italic 400 18px/1 var(--titulo);color:var(--gris);margin-bottom:18px}
.metodo b{display:block;font:400 clamp(22px,2vw,28px)/1.1 var(--titulo);margin-bottom:10px}.metodo span{color:var(--gris2);font-size:15px}
/* Preguntas frecuentes */
.faq{margin-top:clamp(56px,7vw,96px);max-width:860px}
.faq h3{font-size:clamp(30px,3vw,40px);margin-bottom:18px}
.faq details{border-top:1px solid rgba(28,21,18,.2)}.faq details:last-child{border-bottom:1px solid rgba(28,21,18,.2)}
.faq summary{cursor:pointer;list-style:none;padding:20px 40px 20px 0;font:400 21px/1.3 var(--titulo);position:relative}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";position:absolute;right:6px;top:16px;font:300 28px var(--cuerpo);transition:transform .3s}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq details p{padding:0 40px 22px 0;color:var(--tinta2);font-size:16px}
"""
open(P('public', 'estilo.css'), 'w', encoding='utf8').write(c)

j = open(P('public', 'app.js'), encoding='utf8').read()
if 'cifra b' not in j:
    a = "/* ---------- Arranque ---------- */"
    b = """/* ---------- Cifras animadas ---------- */
$$('.cifra b').forEach(el => alVer(el, () => {
  const n = parseFloat(el.dataset.n), dec = +(el.dataset.dec || 0), suf = el.dataset.suf || '';
  const t0 = performance.now(), ms = QUIETO ? 0 : 1600;
  const paso = t => { const k = ms ? Math.min(1, (t - t0) / ms) : 1, e = 1 - Math.pow(1 - k, 4); el.textContent = (n * e).toLocaleString('es-ES', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; if (k < 1) requestAnimationFrame(paso); };
  requestAnimationFrame(paso);
}, .4));

"""
    assert a in j; j = j.replace(a, b + a, 1)
open(P('public', 'app.js'), 'w', encoding='utf8').write(j)
print('ok')
