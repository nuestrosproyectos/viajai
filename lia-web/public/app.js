/* Lía · lógica de la web. En la web real habla con /api (servidor propio que llama a RoxyAPI).
   En la vista previa (window.LIA_DEMO) usa datos reales de RoxyAPI descargados de antemano. */
(() => {
'use strict';
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const DEMO = window.LIA_DEMO || null;
const QUIETO = matchMedia('(prefers-reduced-motion: reduce)').matches;
const espera = ms => new Promise(r => setTimeout(r, QUIETO ? 0 : ms));
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, at = {}, padre) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (padre) padre.appendChild(e); return e; };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const azar = n => Math.floor(Math.random() * n);
const VS = '︎';

/* ---------- Diccionarios ---------- */
const SIGNOS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const SIGNO_ES = { Aries: 'Aries', Taurus: 'Tauro', Gemini: 'Géminis', Cancer: 'Cáncer', Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Scorpio: 'Escorpio', Sagittarius: 'Sagitario', Capricorn: 'Capricornio', Aquarius: 'Acuario', Pisces: 'Piscis' };
const GLIFO_S = { Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓' };
const ELEM = { Aries: 'fuego', Leo: 'fuego', Sagittarius: 'fuego', Taurus: 'tierra', Virgo: 'tierra', Capricorn: 'tierra', Gemini: 'aire', Libra: 'aire', Aquarius: 'aire', Cancer: 'agua', Scorpio: 'agua', Pisces: 'agua' };
const COLOR_EL = { fuego: '#b8463f', tierra: '#9a8263', aire: '#cfc7b8', agua: '#5f7f8f' };
const GLIFO_P = { Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇', 'North Node': '☊', 'South Node': '☋', Chiron: '⚷', 'Black Moon Lilith': '⚸' };
const PERSONALES = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const ARMONICOS = ['TRINE', 'SEXTILE'], TENSOS = ['SQUARE', 'OPPOSITION'];
const FIGURAS = { T_SQUARE: 'Cuadratura en T', GRAND_TRINE: 'Gran trígono', GRAND_CROSS: 'Gran cruz', YOD: 'Yod, el dedo del destino', KITE: 'Cometa', STELLIUM: 'Stellium', MYSTIC_RECTANGLE: 'Rectángulo místico', GRAND_SEXTILE: 'Gran sextil' };
const EN_ES = [[/\bfire\b/gi, 'fuego'], [/\bearth\b/gi, 'tierra'], [/\bair\b/gi, 'aire'], [/\bwater\b/gi, 'agua'], [/\bsituacion\b/g, 'situación'], [/\bresolucion\b/g, 'resolución'], [/\btension\b/g, 'tensión'], [/\bapice\b/g, 'ápice'], [/\bcontinuas\b/g, 'continúas'], [/\benergias\b/g, 'energías'], [/\bestas\b(?= ahora)/g, 'estás'], [/\bdel (Rata|Cabra|Serpiente)\b/g, 'de la $1'], [/\bal (Rata|Cabra|Serpiente)\b/g, 'a la $1'], [/\b[Ee]l (Rata|Cabra|Serpiente)\b/g, (m, a) => (m[0] === 'E' ? 'La ' : 'la ') + a]];
const limpia = t => EN_ES.reduce((s, [a, b]) => s.replace(a, b), String(t || ''));
const frases = (t, n) => { const m = limpia(t).match(/[^.!?]+[.!?]+/g) || [limpia(t)]; return m.slice(0, n).join(' ').trim(); };
const grados = d => { const g = Math.floor(d), m = Math.round((d - g) * 60); return `${g}°${String(m === 60 ? 59 : m).padStart(2, '0')}′`; };
const PERSONAS = {
  ana: { nombre: 'Ana', lugar: 'Granada', etiqueta: 'Ana · Granada, 21-3-1985, 9:30', date: '1985-03-21', time: '09:30:00', latitude: 37.1882, longitude: -3.6067, timezone: 'Europe/Madrid' },
  marcos: { nombre: 'Marcos', lugar: 'Madrid', etiqueta: 'Marcos · Madrid, 2-11-1988, 18:15', date: '1988-11-02', time: '18:15:00', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid' },
  lucia: { nombre: 'Lucía', lugar: 'Barcelona', etiqueta: 'Lucía · Barcelona, 8-7-1993, 23:40', date: '1993-07-08', time: '23:40:00', latitude: 41.3874, longitude: 2.1686, timezone: 'Europe/Madrid' },
};
const imgCarta = id => (DEMO && DEMO.img && DEMO.img[id]) || `cartas/${id}.jpg`;

/* ---------- Acceso a datos ---------- */
const demoApi = DEMO && (() => {
  const D = DEMO;
  const porId = Object.fromEntries(D.cards.map(c => [c.id, c]));
  const QUIZA = ['wheel-of-fortune', 'hanged-man', 'temperance', 'two-of-swords', 'four-of-swords'];
  const sacar = n => { const ids = D.cards.map(c => c.id); const out = []; while (out.length < n) { const i = ids.splice(azar(ids.length), 1)[0]; out.push(i); } return out; };
  const lado = (c, inv) => inv ? c.reversed : c.upright;
  return {
    hoy: async () => ({ fecha: '2026-11-15', luna: D.lunaHoy, mes: D.lunaMes, carta: D.cartaDia, prox: D.lunaProx }),
    sino: async ({ question }) => {
      const c = porId[sacar(1)[0]]; const inv = Math.random() < .35; const L = lado(c, inv);
      const quiza = QUIZA.includes(c.id); const ans = quiza ? 'Quizá' : inv ? 'No' : 'Sí';
      const fuerza = c.arcana === 'major' ? 'Rotundo' : 'Matizado';
      const k = L.keywords;
      const base = ans === 'Sí' ? `${c.name} apunta a que sí. Habla de ${k[0]} y ${k[1]}.` : ans === 'No' ? `${c.name} sale del revés y pide frenar. Habla de ${k[0]} y ${k[1]}.` : `${c.name} dice que la respuesta aún no está escrita. Habla de ${k[0]} y ${k[1]}.`;
      return { question, answerLocalized: ans, strengthLocalized: fuerza, card: { id: c.id, name: c.name, arcana: c.arcana, reversed: inv, keywords: k }, interpretation: base + ' ' + frases(L.career || L.love, 1) };
    },
    tres: async ({ question }) => {
      const nombres = ['Pasado', 'Presente', 'Futuro'];
      return { question, positions: sacar(3).map((id, i) => { const c = porId[id]; const inv = Math.random() < .3; const L = lado(c, inv); return { name: nombres[i], card: { id, name: c.name, reversed: inv, keywords: L.keywords, meaning: L.description, love: L.love, career: L.career, finances: L.finances } }; }) };
    },
    natal: async ({ preset }) => { if (!D.natal[preset]) throw new Error('demo'); return D.natal[preset]; },
    compat: async ({ preset }) => { if (!D.compat[preset]) throw new Error('demo'); return D.compat[preset]; },
    chino: async ({ date }) => {
      const y = +date.slice(0, 4); let ly = y; let a = D.cny[y];
      if (!a) throw new Error('Fecha fuera de rango');
      if (date < a[0]) { ly = y - 1; a = D.cny[ly]; }
      const animal = D.animals.find(x => x.id === a[1]);
      const [el, interp] = D.yearEl[ly];
      const k1 = `${animal.id}|goat`, k2 = `goat|${animal.id}`;
      return { signo: { animal, elementLocalized: el, interpretation: interp, lunarYear: ly, cny: a[0] }, comp: D.chinoComp[k1] || D.chinoComp[k2] };
    },
    numero: async ({ date }) => {
      const [y, m, d] = date.split('-').map(Number);
      const red = n => { while (n > 9 && ![11, 22, 33].includes(n)) n = String(n).split('').reduce((s, x) => s + +x, 0); return n; };
      const pasos = [];
      const rm = red(m), rd = red(d), ry1 = String(y).split('').reduce((s, x) => s + +x, 0), ry = red(ry1);
      pasos.push(`Mes: ${m}${m > 9 && rm !== m ? ' → ' + String(m).split('').join('+') + ' = ' + rm : ''}`);
      pasos.push(`Día: ${d}${d > 9 && rd !== d ? ' → ' + String(d).split('').join('+') + ' = ' + rd : ''}`);
      pasos.push(`Año: ${y} → ${String(y).split('').join('+')} = ${ry1}${ry1 !== ry ? ' → ' + ry : ''}`);
      const tot = rm + rd + ry, n = red(tot);
      pasos.push(`${rm}+${rd}+${ry} = ${tot}${tot !== n ? ' → ' + n : ''}`);
      const M = D.numeros[n];
      return { number: n, pasos, type: M.type, meaning: M.meaning };
    },
    bio: async () => null,
  };
})();

async function api(ruta, cuerpo) {
  if (DEMO) return demoApi[ruta](cuerpo || {});
  const r = await fetch('/api/' + ruta, { method: cuerpo ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'No he podido calcularlo. Prueba otra vez.');
  return j;
}

/* ---------- Utilidades de movimiento ---------- */
function contar(el, hasta, ms = 1400, dec = 0) {
  if (QUIETO) { el.textContent = hasta.toFixed(dec); return; }
  const t0 = performance.now();
  const paso = t => { const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 4); el.textContent = (hasta * e).toFixed(dec); if (k < 1) requestAnimationFrame(paso); };
  requestAnimationFrame(paso);
}
const alVer = (el, fn, umbral = .25) => {
  if (!('IntersectionObserver' in window)) return fn();
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.disconnect(); fn(); } }), { threshold: umbral });
  io.observe(el);
};
const pinta = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

/* ---------- Luna en SVG ---------- */
function luna(svg, ilum, creciente, r = 44) {
  svg.innerHTML = '';
  const g = svgEl('g', { transform: 'translate(50 50)' }, svg);
  svgEl('circle', { r, fill: '#1e1819', stroke: 'rgba(236,228,214,.18)', 'stroke-width': 1 }, g);
  const k = Math.max(0, Math.min(1, ilum / 100));
  if (k > .985) { svgEl('circle', { r, fill: '#ece4d6' }, g); return; }
  if (k < .015) return;
  const rx = r * Math.abs(1 - 2 * k);
  const d = `M0,${-r} A${r},${r} 0 0 ${creciente ? 1 : 0} 0,${r} A${rx},${r} 0 0 ${(k > .5) === creciente ? 1 : 0} 0,${-r}Z`;
  svgEl('path', { d, fill: '#ece4d6' }, g);
}
const esCreciente = f => /crecient|waxing/i.test(f || '');

/* ---------- Barra y portada ---------- */
const barra = $('#barra');
addEventListener('scroll', () => barra.classList.toggle('solida', scrollY > 40), { passive: true });
$$('.hero-txt > *').forEach((e, i) => { e.classList.add('entra'); e.style.animationDelay = (.15 + i * .12) + 's'; });
$$('.sec-cab').forEach(e => { e.classList.add('revela'); alVer(e, () => e.classList.add('visto'), .2); });

const FMT_FECHA = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
let HOY = null;
async function cargarHoy() {
  try {
    HOY = await api('hoy');
    const L = HOY.luna;
    luna($('#hoyLuna'), L.illumination, esCreciente(L.phase));
    $('#hoyFase').textContent = L.meaning?.name || L.phase;
    $('#hoyLunaTxt').textContent = `${Math.round(L.illumination)} % iluminada · en ${SIGNO_ES[L.sign] || L.sign}`;
    const C = HOY.carta.card;
    $('#hoyCartaImg').src = imgCarta(C.id);
    if (C.reversed) $('#hoyCartaImg').style.transform = 'rotate(180deg)';
    $('#hoyCarta').textContent = C.name + (C.reversed ? ' (invertida)' : '');
    $('#hoyCartaTxt').textContent = (C.keywords || []).slice(0, 3).join(' · ');
    $('#hoyFecha').textContent = FMT_FECHA.format(new Date(HOY.fecha + 'T12:00:00'));
    pintarMes();
  } catch (e) { $('#hoyFase').textContent = 'No disponible ahora'; }
}

/* ---------- I · Tarot sí o no ---------- */
const abanico = $('#abanico');
const N_NAIPES = 78;
for (let i = 0; i < N_NAIPES; i++) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'naipe'; b.setAttribute('aria-label', `Carta ${i + 1} de 78`);
  abanico.appendChild(b);
}
function abrirAbanico() {
  const ancho = abanico.clientWidth, abierto = ancho < 520 ? 48 : 56;
  $$('.naipe', abanico).forEach((n, i) => {
    const r = -abierto / 2 + abierto * i / (N_NAIPES - 1);
    n.style.setProperty('--r', r.toFixed(2) + 'deg');
    n.style.transitionDelay = QUIETO ? '0s' : (i * 9) + 'ms';
    n.style.zIndex = i;
  });
  abanico.classList.add('listo');
}
alVer(abanico, () => setTimeout(abrirAbanico, 250), .35);
addEventListener('resize', () => abanico.classList.contains('listo') && abrirAbanico());
// Arrastrar el dedo por la baraja levanta la carta que pisa
abanico.addEventListener('pointermove', e => {
  const t = document.elementFromPoint(e.clientX, e.clientY);
  $$('.naipe.alzada', abanico).forEach(n => n !== t && n.classList.remove('alzada'));
  if (t && t.classList.contains('naipe')) t.classList.add('alzada');
});
abanico.addEventListener('pointerleave', () => $$('.naipe.alzada', abanico).forEach(n => n.classList.remove('alzada')));

let tirando = false;
abanico.addEventListener('click', async e => {
  const n = e.target.closest('.naipe'); if (!n || tirando) return;
  tirando = true; n.classList.add('fuera');
  const q = $('#pregunta').value.trim() || '¿Va a salir bien?';
  const C3 = $('#cartaElegida'); C3.classList.remove('girada', 'invertida');
  $('#verRes').textContent = '…'; $('#verRes').className = ''; $('#verNom').textContent = 'Barajando…'; $('#verLect').textContent = ''; $('#verKw').innerHTML = '';
  if (matchMedia('(max-width: 980px)').matches) $('#veredicto').scrollIntoView({ behavior: 'smooth', block: 'center' });
  try {
    const [r] = await Promise.all([api('sino', { question: q }), espera(700)]);
    const img = $('img', C3); img.src = imgCarta(r.card.id); img.alt = r.card.name;
    await new Promise(ok => { if (img.complete) ok(); else { img.onload = ok; img.onerror = ok; } });
    if (r.card.reversed) C3.classList.add('invertida');
    C3.classList.add('girada');
    await espera(650);
    $('#verQ').textContent = '«' + q + '»';
    const ans = r.answerLocalized === 'Si' ? 'Sí' : r.answerLocalized;
    $('#verRes').textContent = ans; $('#verRes').className = ans === 'Sí' ? 'si' : '';
    $('#verNom').textContent = r.card.name + (r.card.reversed ? ', invertida' : '') + ' · ' + (r.strengthLocalized || '').toLowerCase();
    $('#verLect').textContent = frases(String(r.interpretation || '').replace(/^[^:]{0,30}:\s*/, ''), 2);
    $('#verKw').innerHTML = (r.card.keywords || []).slice(0, 4).map(k => `<span>${esc(k)}</span>`).join('');
    $('#verAcc').hidden = false;
    $('#tarotAyuda').textContent = 'Esta es tu tirada gratis de hoy.';
  } catch (err) { $('#verNom').textContent = err.message; n.classList.remove('fuera'); tirando = false; }
});
$('#barajar').addEventListener('click', async () => {
  abanico.classList.remove('listo'); $$('.naipe', abanico).forEach(n => { n.classList.remove('fuera', 'alzada'); n.style.transitionDelay = '0s'; });
  $('#cartaElegida').classList.remove('girada', 'invertida');
  $('#verRes').textContent = '—'; $('#verNom').textContent = 'Baraja mezclada. Elige otra carta.'; $('#verLect').textContent = ''; $('#verKw').innerHTML = ''; $('#verAcc').hidden = true;
  await espera(650); abrirAbanico(); tirando = false;
});

/* ---------- II · Carta astral ---------- */
const rueda = $('#rueda');
const pol = (lon, r, asc) => { const a = (180 + lon - asc) * Math.PI / 180; return [r * Math.cos(a), -r * Math.sin(a)]; };
function separar(lista, minimo = 7) {
  const L = lista.map(p => ({ ...p, vis: p.longitude })).sort((a, b) => a.vis - b.vis);
  for (let pase = 0; pase < 20; pase++) {
    let mov = false;
    for (let i = 0; i < L.length; i++) {
      const a = L[i], b = L[(i + 1) % L.length];
      let d = (b.vis - a.vis + 360) % 360;
      if (L.length > 1 && d < minimo) { const f = (minimo - d) / 2; a.vis = (a.vis - f + 360) % 360; b.vis = (b.vis + f) % 360; mov = true; }
    }
    if (!mov) break;
  }
  return L;
}
async function dibujarRueda(n) {
  rueda.innerHTML = ''; rueda.classList.remove('viva');
  const asc = n.ascendant.longitude;
  const R1 = 300, R2 = 252, R3 = 226, RP = 196, RA = 150;
  // Anillo del zodiaco (gira hasta su sitio)
  const anillo = svgEl('g', { class: 'anillo' }, rueda);
  anillo.style.transform = `rotate(${asc - 140}deg)`;
  SIGNOS.forEach((s, i) => {
    const a0 = i * 30, a1 = a0 + 30;
    const [x0, y0] = pol(a0, R1, 0), [x1, y1] = pol(a1, R1, 0), [x2, y2] = pol(a1, R2, 0), [x3, y3] = pol(a0, R2, 0);
    svgEl('path', { d: `M${x0},${y0} A${R1},${R1} 0 0 0 ${x1},${y1} L${x2},${y2} A${R2},${R2} 0 0 1 ${x3},${y3}Z`, fill: COLOR_EL[ELEM[s]], 'fill-opacity': .16, stroke: 'rgba(236,228,214,.22)', 'stroke-width': 1 }, anillo);
    const [tx, ty] = pol(a0 + 15, (R1 + R2) / 2, 0);
    const t = svgEl('text', { x: tx, y: ty, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 24, fill: COLOR_EL[ELEM[s]] === '#cfc7b8' ? '#ece4d6' : '#ece4d6', transform: `rotate(${-(a0 + 15) + 90} ${tx} ${ty})` }, anillo);
    t.textContent = GLIFO_S[s] + VS;
  });
  for (let d = 0; d < 360; d += 5) {
    const [a, b] = pol(d, R2, 0), [c, e] = pol(d, R2 - (d % 30 === 0 ? 0 : d % 10 === 0 ? 9 : 5), 0);
    if (d % 30) svgEl('line', { x1: a, y1: b, x2: c, y2: e, stroke: 'rgba(236,228,214,.35)', 'stroke-width': 1 }, anillo);
  }
  svgEl('circle', { r: R2, fill: 'none', stroke: 'rgba(236,228,214,.3)' }, rueda);
  svgEl('circle', { r: R3, fill: 'none', stroke: 'rgba(236,228,214,.14)' }, rueda);
  svgEl('circle', { r: RA, fill: 'rgba(12,10,10,.6)', stroke: 'rgba(236,228,214,.28)' }, rueda);
  // Casas
  const casas = svgEl('g', {}, rueda);
  n.houses.forEach((h, i) => {
    const ang = h.number === 1 || h.number === 10;
    const [x1, y1] = pol(h.longitude, RA, asc), [x2, y2] = pol(h.longitude, ang ? R1 + 14 : R2, asc);
    const l = Math.hypot(x2 - x1, y2 - y1);
    const ln = svgEl('line', { x1, y1, x2, y2, class: 'traza', stroke: ang ? '#ece4d6' : 'rgba(236,228,214,.32)', 'stroke-width': ang ? 1.6 : 1 }, casas);
    ln.style.setProperty('--l', l.toFixed(1)); ln.style.transitionDelay = (0.9 + i * .06) + 's';
    const sig = n.houses[(i + 1) % 12].longitude; const mid = h.longitude + (((sig - h.longitude) + 360) % 360) / 2;
    const [nx, ny] = pol(mid, (R2 + R3) / 2 - 0, asc);
    const t = svgEl('text', { x: nx, y: ny, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 12, fill: 'rgba(236,228,214,.55)', style: 'font-family:var(--cuerpo)' }, casas); t.textContent = h.number;
  });
  [['AC', n.ascendant.longitude], ['MC', n.midheaven.longitude]].forEach(([k, lon]) => {
    const [x, y] = pol(lon, R1 + 32, asc);
    const t = svgEl('text', { x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 13, fill: '#ece4d6', style: 'font-family:var(--cuerpo);font-weight:600;letter-spacing:.08em' }, rueda); t.textContent = k;
  });
  // Aspectos
  const P = Object.fromEntries(n.planets.map(p => [p.name, p]));
  const asp = svgEl('g', {}, rueda);
  n.aspects.filter(a => (ARMONICOS.includes(a.type) || TENSOS.includes(a.type)) && P[a.planet1] && P[a.planet2] && !(a.planet1.includes('Node') && a.planet2.includes('Node')))
    .sort((a, b) => b.strength - a.strength).forEach((a, i) => {
      const [x1, y1] = pol(P[a.planet1].longitude, RA - 4, asc), [x2, y2] = pol(P[a.planet2].longitude, RA - 4, asc);
      const l = Math.hypot(x2 - x1, y2 - y1);
      const ln = svgEl('line', { x1, y1, x2, y2, class: 'traza', stroke: TENSOS.includes(a.type) ? '#c23a4c' : '#86a7b4', 'stroke-width': .6 + a.strength / 70, 'stroke-opacity': .35 + a.strength / 180 }, asp);
      ln.style.setProperty('--l', l.toFixed(1)); ln.style.transitionDelay = (2.2 + i * .05) + 's';
    });
  // Planetas
  const sep = separar(n.planets);
  const tip = $('#ruedaTip');
  sep.forEach((p, i) => {
    const [mx, my] = pol(p.longitude, R2, asc), [mx2, my2] = pol(p.longitude, R2 - 12, asc);
    svgEl('line', { x1: mx, y1: my, x2: mx2, y2: my2, stroke: '#ece4d6', 'stroke-width': 1.4 }, rueda);
    const [x, y] = pol(p.vis, RP, asc);
    const g = svgEl('g', { class: 'astro', tabindex: 0, role: 'button', 'aria-label': `${p.nameLocalized} en ${p.signLocalized}` }, rueda);
    g.style.transform = 'translate(0px,0px) scale(.2)'; g.style.opacity = 0; g.style.transitionDelay = (1.2 + i * .07) + 's';
    svgEl('circle', { r: 17, fill: '#141011', stroke: 'rgba(236,228,214,.4)' }, g);
    const t = svgEl('text', { 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 19, y: 1 }, g); t.textContent = GLIFO_P[p.name] + VS;
    if (p.isRetrograde) { const r = svgEl('text', { x: 15, y: -12, 'font-size': 10, fill: '#c9737c', style: 'font-family:var(--cuerpo)' }, g); r.textContent = 'R'; }
    g.dataset.x = x; g.dataset.y = y;
    const ver = () => { tip.hidden = false; tip.innerHTML = `<b>${esc(p.nameLocalized)} en ${esc(p.signLocalized)} ${grados(p.degree)}</b>Casa ${p.house}${p.isRetrograde ? ' · retrógrado' : ''}<br>${esc(frases(p.interpretation?.summary, 1))}`; const box = rueda.getBoundingClientRect(), k = box.width / 640; tip.style.left = Math.min(box.width - 280, Math.max(0, (x + 320) * k - 140)) + 'px'; tip.style.top = ((y + 320) * k + 24) + 'px'; };
    g.addEventListener('mouseenter', ver); g.addEventListener('focus', ver); g.addEventListener('click', ver);
    g.addEventListener('mouseleave', () => tip.hidden = true); g.addEventListener('blur', () => tip.hidden = true);
  });
  await pinta();
  anillo.style.transform = 'rotate(0deg)';
  rueda.classList.add('viva');
  $$('.astro', rueda).forEach(g => { g.style.transform = `translate(${g.dataset.x}px,${g.dataset.y}px) scale(1)`; g.style.opacity = 1; });
}
function datosNatal(n) {
  const S = Object.fromEntries(n.planets.map(p => [p.name, p]));
  $('#big3').innerHTML = [['Sol', S.Sun], ['Luna', S.Moon], ['Ascendente', n.ascendant]].map(([k, p]) => `<div><small>${k}</small><b>${esc(p.signLocalized)}</b><span>${GLIFO_S[p.sign] + VS}</span> <small style="display:inline">${grados(p.degree)}</small></div>`).join('');
  const cuenta = { fuego: 0, tierra: 0, aire: 0, agua: 0 };
  PERSONALES.forEach(k => S[k] && cuenta[ELEM[S[k].sign]]++);
  const el = $('#elementos'); el.classList.remove('vivo');
  el.innerHTML = Object.entries(cuenta).map(([k, v], i) => `<div class="barra-f" style="--c:${COLOR_EL[k]};--v:${v / 10};--d:${.2 + i * .12}s"><span>${k[0].toUpperCase() + k.slice(1)}</span><i></i><b>${v * 10} %</b></div>`).join('');
  const A = n.aspectsInterpretation, tot = A.harmonious + A.challenging + A.neutral;
  const don = $('#donutAsp'); don.innerHTML = '';
  const C = 2 * Math.PI * 46; let acum = 0;
  const trozos = [['Armoniosos', A.harmonious, '#86a7b4'], ['De tensión', A.challenging, '#c23a4c'], ['Neutros', A.neutral, '#6d645c']];
  svgEl('circle', { cx: 60, cy: 60, r: 46, fill: 'none', stroke: 'rgba(236,228,214,.08)', 'stroke-width': 16 }, don);
  const arcos = trozos.map(([, v, c]) => { const c1 = svgEl('circle', { cx: 60, cy: 60, r: 46, fill: 'none', stroke: c, 'stroke-width': 16, 'stroke-dasharray': `0 ${C}`, 'stroke-dashoffset': -acum }, don); const largo = C * v / tot; acum += largo; return [c1, largo]; });
  $('#leyAsp').innerHTML = trozos.map(([k, v, c]) => `<span style="--c:${c}">${k}: <b>${v}</b></span>`).join('') + `<span style="--c:transparent">Total: ${tot}</span>`;
  const fig = n.patterns && n.patterns[0];
  $('#figura').innerHTML = fig ? `<b>${esc(FIGURAS[fig.kind] || fig.name)}</b>${esc(limpia(fig.interpretation))}` : `<b>Carta equilibrada</b>${esc(limpia(n.aspectsInterpretation.summary))}`;
  $('#planetas').innerHTML = n.planets.map(p => `<button type="button" aria-expanded="false"><span class="g">${GLIFO_P[p.name] + VS}</span><b>${esc(p.nameLocalized)}</b><small>en ${esc(p.signLocalized)} ${grados(p.degree)} · casa ${p.house}${p.isRetrograde ? ' · retrógrado' : ''}</small><p>${esc(limpia(p.interpretation?.summary))}</p></button>`).join('');
  return () => { el.classList.add('vivo'); arcos.forEach(([c, l]) => c.setAttribute('stroke-dasharray', `${l} ${C}`)); };
}
$('#planetas').addEventListener('click', e => { const b = e.target.closest('button'); if (b) b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') !== 'true'); });

let natalVisible = false, natalPendiente = null;
async function cargarNatal(datos, boton) {
  $$('#ejNatal button').forEach(b => b.setAttribute('aria-pressed', b === boton));
  const zona = $('#natal'); zona.classList.add('cargando');
  try {
    const n = await api('natal', datos);
    const animar = datosNatal(n);
    const lanzar = async () => { zona.classList.remove('cargando'); await dibujarRueda(n); await espera(400); animar(); };
    if (natalVisible) lanzar(); else natalPendiente = lanzar;
  } catch (e) { zona.classList.remove('cargando'); avisoNatal(e.message === 'demo' ? null : e.message); }
}
alVer($('#natal'), () => { natalVisible = true; if (natalPendiente) { natalPendiente(); natalPendiente = null; } }, .2);
const formN = $('#formNatal');
Object.entries(PERSONAS).forEach(([k, p]) => {
  const b = document.createElement('button'); b.type = 'button'; b.textContent = p.etiqueta; b.setAttribute('aria-pressed', 'false');
  b.addEventListener('click', () => { formN.date.value = p.date; formN.time.value = p.time.slice(0, 5); formN.city.value = p.lugar; ciudadSel = { latitude: p.latitude, longitude: p.longitude, timezone: p.timezone, nombre: p.lugar }; cargarNatal(DEMO ? { preset: k } : { date: p.date, time: p.time, latitude: p.latitude, longitude: p.longitude, timezone: p.timezone }, b); });
  $('#ejNatal').appendChild(b);
});
function avisoNatal(msg) {
  const a = $('.aviso-demo', formN);
  a.hidden = false;
  a.textContent = msg || 'En esta vista previa solo están calculados los tres ejemplos. En la web publicada escribes tu fecha, hora y ciudad y calculo tu carta al momento.';
}
// Ciudad con sugerencias
let ciudadSel = null, tCiudad = 0;
const lista = $('.sugerencias', formN);
formN.city.addEventListener('input', () => {
  ciudadSel = null; clearTimeout(tCiudad);
  if (DEMO) return;
  const q = formN.city.value.trim(); if (q.length < 2) { lista.classList.remove('abierta'); return; }
  tCiudad = setTimeout(async () => {
    try {
      const r = await api('lugares?q=' + encodeURIComponent(q));
      lista.innerHTML = (r.cities || []).map((c, i) => `<li role="option" data-i="${i}">${esc(c.city)}, ${esc(c.province || '')} · ${esc(c.country)}</li>`).join('');
      lista._c = r.cities || []; lista.classList.toggle('abierta', !!lista._c.length);
    } catch { }
  }, 250);
});
lista.addEventListener('click', e => { const li = e.target.closest('li'); if (!li) return; const c = lista._c[+li.dataset.i]; ciudadSel = { latitude: c.latitude, longitude: c.longitude, timezone: c.timezone, nombre: c.city }; formN.city.value = c.city + ', ' + c.country; lista.classList.remove('abierta'); });
document.addEventListener('click', e => { if (!e.target.closest('.ciudad')) lista.classList.remove('abierta'); });
formN.addEventListener('submit', async e => {
  e.preventDefault(); $('.aviso-demo', formN).hidden = true;
  if (DEMO) { const k = Object.keys(PERSONAS).find(k => PERSONAS[k].date === formN.date.value && PERSONAS[k].time.slice(0, 5) === formN.time.value); if (k) return cargarNatal({ preset: k }); return avisoNatal(); }
  if (!ciudadSel) { try { const r = await api('lugares?q=' + encodeURIComponent(formN.city.value)); const c = r.cities[0]; ciudadSel = { latitude: c.latitude, longitude: c.longitude, timezone: c.timezone }; } catch { return avisoNatal('No encuentro esa ciudad. Prueba a escribirla de otra forma.'); } }
  cargarNatal({ date: formN.date.value, time: formN.time.value, ...ciudadSel });
  $('#natal').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ---------- III · Compatibilidad ---------- */
const CATS = [['romantic', 'Romance'], ['emotional', 'Emociones'], ['intellectual', 'Mente'], ['physical', 'Físico'], ['spiritual', 'Espíritu']];
function radar(cats) {
  const s = $('#radar'); s.innerHTML = '';
  const R = 110, pt = (i, v) => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return [Math.cos(a) * R * v, Math.sin(a) * R * v]; };
  [.25, .5, .75, 1].forEach(v => svgEl('polygon', { points: CATS.map((_, i) => pt(i, v).join(',')).join(' '), fill: 'none', stroke: 'rgba(236,228,214,.14)' }, s));
  CATS.forEach(([k, n], i) => {
    const [x, y] = pt(i, 1); svgEl('line', { x1: 0, y1: 0, x2: x, y2: y, stroke: 'rgba(236,228,214,.14)' }, s);
    const [tx, ty] = pt(i, 1.24); const t = svgEl('text', { x: tx, y: ty, 'text-anchor': Math.abs(tx) < 5 ? 'middle' : tx > 0 ? 'start' : 'end', 'dominant-baseline': 'central' }, s);
    t.innerHTML = `${n} <tspan fill="#ece4d6" font-weight="600">${cats[k]}</tspan>`;
  });
  const z = svgEl('g', { class: 'zona' }, s); z.style.transformOrigin = '0 0';
  svgEl('polygon', { points: CATS.map(([k], i) => pt(i, Math.max(.04, cats[k] / 100)).join(',')).join(' '), fill: 'rgba(163,38,55,.35)', stroke: '#c23a4c', 'stroke-width': 2, 'stroke-linejoin': 'round' }, z);
  CATS.forEach(([k], i) => { const [x, y] = pt(i, Math.max(.04, cats[k] / 100)); svgEl('circle', { cx: x, cy: y, r: 4, fill: '#ece4d6' }, z); });
}
function anillo(v) {
  const s = $('#anillo'); s.innerHTML = '';
  const C = 2 * Math.PI * 88;
  svgEl('circle', { cx: 100, cy: 100, r: 88, fill: 'none', stroke: 'rgba(236,228,214,.1)', 'stroke-width': 10 }, s);
  const c = svgEl('circle', { cx: 100, cy: 100, r: 88, fill: 'none', stroke: '#ece4d6', 'stroke-width': 10, 'stroke-dasharray': `0 ${C}`, 'stroke-linecap': 'butt' }, s);
  c.style.transition = 'stroke-dasharray 1.8s cubic-bezier(.16,1,.3,1)';
  return () => c.setAttribute('stroke-dasharray', `${C * v / 100} ${C}`);
}
const sinPrefijo = t => limpia(String(t).replace(/^[^:]{0,80}:\s*/, ''));
let compatVisible = false, compatPend = null;
async function cargarCompat(clave, boton) {
  $$('#ejCompat button').forEach(b => b.setAttribute('aria-pressed', b === boton));
  const [a, b] = clave.split('|');
  const zona = $('#compat'); zona.classList.add('cargando');
  try {
    const r = await api('compat', DEMO ? { preset: clave } : { p1: PERSONAS[a], p2: PERSONAS[b] });
    const lanzar = async () => {
      zona.classList.remove('cargando');
      $('.compat-radar').classList.remove('vivo'); radar(r.categories); const go = anillo(r.overallScore);
      $('#arquetipo').textContent = r.archetype?.label || '';
      $('#compatDesc').textContent = frases(r.archetype?.description, 2) + ' ' + frases(r.elementBalance?.description, 1);
      $('#compatFuerte').innerHTML = (r.strengths || []).slice(0, 3).map(t => `<li>${esc(frases(sinPrefijo(t), 1))}</li>`).join('');
      $('#compatReto').innerHTML = (r.challenges || []).slice(0, 3).map(t => `<li>${esc(frases(sinPrefijo(t), 1))}</li>`).join('');
      await pinta(); go(); contar($('#compatNum'), r.overallScore, 1800); $('.compat-radar').classList.add('vivo');
    };
    if (compatVisible) lanzar(); else compatPend = lanzar;
  } catch (e) { zona.classList.remove('cargando'); $('#compatDesc').textContent = e.message; }
}
alVer($('#compat'), () => { compatVisible = true; if (compatPend) { compatPend(); compatPend = null; } }, .25);
[['ana|marcos', 'Ana y Marcos'], ['lucia|marcos', 'Lucía y Marcos']].forEach(([k, t]) => {
  const b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.setAttribute('aria-pressed', 'false');
  b.addEventListener('click', () => cargarCompat(k, b)); $('#ejCompat').appendChild(b);
});

/* ---------- IV · Horóscopo chino ---------- */
const ANIMALES = [['rat', '鼠', 'Rata'], ['ox', '牛', 'Buey'], ['tiger', '虎', 'Tigre'], ['rabbit', '兔', 'Conejo'], ['dragon', '龍', 'Dragón'], ['snake', '蛇', 'Serpiente'], ['horse', '馬', 'Caballo'], ['goat', '羊', 'Cabra'], ['monkey', '猴', 'Mono'], ['rooster', '雞', 'Gallo'], ['dog', '狗', 'Perro'], ['pig', '豬', 'Cerdo']];
const rc = $('#ruedaChina');
const giro = svgEl('g', { class: 'giro' }, rc);
const cuerda = svgEl('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: '#ece4d6', 'stroke-width': 1.2, 'stroke-dasharray': '4 6', opacity: 0 }, giro);
svgEl('circle', { r: 200, fill: 'none', stroke: 'rgba(236,228,214,.18)' }, giro);
svgEl('circle', { r: 244, fill: 'none', stroke: 'rgba(236,228,214,.08)' }, giro);
const items = ANIMALES.map(([id, han, nom], i) => {
  const g = svgEl('g', { transform: `rotate(${i * 30}) translate(0 -200)` }, giro);
  const d = svgEl('g', { class: 'der' }, g); d.style.transition = 'transform 2.2s cubic-bezier(.16,1,.3,1)'; d.style.transform = `rotate(${-i * 30}deg)`;
  svgEl('circle', { r: 33, fill: id === 'goat' ? '#7d1a28' : '#1b0a0e', stroke: 'rgba(236,228,214,.35)' }, d);
  const t = svgEl('text', { class: 'han', 'text-anchor': 'middle', 'dominant-baseline': 'central', y: 1 }, d); t.textContent = han;
  const n = svgEl('text', { class: 'nom', 'text-anchor': 'middle', y: 52 }, d); n.textContent = nom;
  return { id, g, d, i };
});
const centro = svgEl('g', {}, rc);
const c1 = svgEl('text', { 'text-anchor': 'middle', y: -18, style: 'font:400 64px var(--titulo);fill:#ece4d6' }, centro); c1.textContent = '2027';
const c2 = svgEl('text', { 'text-anchor': 'middle', y: 24, style: 'font:500 14px var(--cuerpo);fill:#c9c0b5;letter-spacing:.14em' }, centro); c2.textContent = 'CABRA DE FUEGO';
const c3 = svgEl('text', { 'text-anchor': 'middle', y: 70, style: 'font:400 40px var(--han);fill:rgba(236,228,214,.6)' }, centro); c3.textContent = '羊 火';
function girarA(id) {
  const k = ANIMALES.findIndex(a => a[0] === id), th = k * 30;
  giro.style.transform = `rotate(${-th}deg)`;
  items.forEach(it => { it.d.style.transform = `rotate(${-it.i * 30 + th}deg)`; it.g.classList.toggle('sel', it.id === id); });
  const p = a => [Math.sin(a * 30 * Math.PI / 180) * 200, -Math.cos(a * 30 * Math.PI / 180) * 200];
  const [x1, y1] = p(k), [x2, y2] = p(7);
  cuerda.setAttribute('x1', x1); cuerda.setAttribute('y1', y1); cuerda.setAttribute('x2', x2); cuerda.setAttribute('y2', y2); cuerda.setAttribute('opacity', id === 'goat' ? 0 : .7);
}
giro.style.transition = 'transform 2.2s cubic-bezier(.16,1,.3,1)'; giro.style.transformOrigin = '0 0';
const VERED = { excellent: 'Excelente', good: 'Buena', neutral: 'Neutra', challenging: 'Exigente', difficult: 'Difícil' };
async function cargarChino(fecha) {
  const out = $('#chinoRes'); out.classList.add('cargando');
  try {
    const { signo: s, comp } = await api('chino', { date: fecha });
    const A = s.animal; const yo = ANIMALES.find(a => a[0] === A.id);
    girarA(A.id);
    out.classList.remove('cargando');
    out.innerHTML = `<span class="han-g">${yo[1]}</span><small style="color:var(--gris);font-size:14px">Tu animal</small><h3>${esc(A.nameLocalized)}</h3>
      <p class="el">${esc(s.elementLocalized)} · ${A.polarity === 'yin' ? 'yin' : 'yang'}</p>
      <p>${esc(frases(s.interpretation, 2))}</p>
      ${comp ? `<div class="medidor"><div class="fila"><span class="rel"><span>${esc(comp.relationshipChinese || '')}</span>${esc(comp.relationshipNameLocalized || '')} con la Cabra</span><small>${esc(VERED[comp.verdict] || '')}</small></div><i style="--v:0"></i><div class="fila"><small>Cómo te trata 2027</small><b><span class="cnt">0</span><small> / 100</small></b></div><p>${esc(frases(comp.summary, 2))}</p></div>` : ''}`;
    if (comp) { await pinta(); $('.medidor i', out).style.setProperty('--v', comp.score / 100); contar($('.cnt', out), comp.score, 1600); }
  } catch (e) { out.classList.remove('cargando'); out.innerHTML = `<p class="error">${esc(e.message)}</p>`; }
}
$('#formChino').addEventListener('submit', e => { e.preventDefault(); cargarChino(e.target.date.value); });

/* ---------- V · Luna del mes ---------- */
function pintarMes() {
  if (!HOY) return;
  const M = HOY.mes, cont = $('#lunaMes'); cont.innerHTML = '';
  ['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach(d => { const e = document.createElement('div'); e.className = 'dow'; e.textContent = d; cont.appendChild(e); });
  const primero = new Date(M.calendar[0].date + 'T12:00:00'); const hueco = (primero.getDay() + 6) % 7;
  for (let i = 0; i < hueco; i++) { const e = document.createElement('div'); e.className = 'dia vacio'; cont.appendChild(e); }
  M.calendar.forEach((d, i) => {
    const e = document.createElement('div'); e.className = 'dia' + (d.date === HOY.fecha ? ' hoy-d' : '');
    e.style.transitionDelay = QUIETO ? '0s' : (i * 35) + 'ms';
    e.innerHTML = `<b>${+d.date.slice(8)}</b><svg viewBox="0 0 100 100" aria-hidden="true"></svg><small>${Math.round(d.illumination)} %<br>${esc(SIGNO_ES[d.sign] || d.sign)}</small>`;
    e.title = `${d.phase} · ${Math.round(d.illumination)} % · ${SIGNO_ES[d.sign] || d.sign}`;
    cont.appendChild(e);
    const prev = M.calendar[i - 1], next = M.calendar[i + 1];
    const crece = next ? next.illumination > d.illumination : prev ? d.illumination > prev.illumination : true;
    luna($('svg', e), d.illumination, crece);
  });
  const nombreMes = M.monthName || '';
  $('#lunaIntro').textContent = `Así se ve la luna cada noche de ${nombreMes}: fase, porcentaje iluminado y signo por el que pasa. Calculado para España.`;
  if (HOY.prox && HOY.prox.phases) {
    const pie = document.createElement('div'); pie.className = 'luna-pie';
    pie.innerHTML = HOY.prox.phases.slice(0, 4).map(p => `<div><b>${esc(p.phase)}</b>${new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(new Date(p.date + 'T12:00:00'))}</div>`).join('');
    cont.after(pie);
  }
  alVer(cont, () => cont.classList.add('vivo'), .15);
}

/* ---------- VI · Tres cartas ---------- */
let tresDatos = null;
async function echarTres(q) {
  const cont = $('#tres'); cont.innerHTML = ''; $('#temas').hidden = true;
  try {
    const r = await api('tres', { question: q });
    tresDatos = r.positions;
    cont.innerHTML = r.positions.map((p, i) => `<div class="pos"><div class="carta3d${p.card.reversed ? ' invertida' : ''}"><div class="cara dorso"></div><div class="cara frente"><img src="${imgCarta(p.card.id)}" alt="${esc(p.card.name)}"></div></div><small>${['I', 'II', 'III'][i]} · ${esc(p.name)}</small><h3>${esc(p.card.name)}</h3>${p.card.reversed ? '<span class="inv">invertida</span>' : ''}<p data-tema>${esc(frases(p.card.love, 2))}</p></div>`).join('');
    const pos = $$('.pos', cont);
    for (let i = 0; i < pos.length; i++) { await espera(i ? 380 : 60); pos[i].classList.add('dada'); }
    await espera(700);
    for (let i = 0; i < pos.length; i++) { $('.carta3d', pos[i]).classList.add('girada'); await espera(420); }
    $('#temas').hidden = false; $$('#temas button').forEach(b => b.setAttribute('aria-selected', b.dataset.t === 'love'));
  } catch (e) { cont.innerHTML = `<p class="error">${esc(e.message)}</p>`; }
}
$('#formTres').addEventListener('submit', e => { e.preventDefault(); echarTres(e.target.q.value.trim() || '¿Qué necesito saber?'); });
$('#temas').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b || !tresDatos) return;
  $$('#temas button').forEach(x => x.setAttribute('aria-selected', x === b));
  $$('#tres [data-tema]').forEach((p, i) => { p.style.opacity = 0; setTimeout(() => { p.textContent = frases(tresDatos[i].card[b.dataset.t], 2); p.style.transition = 'opacity .5s'; p.style.opacity = 1; }, 180); });
});
alVer($('#tres'), () => echarTres($('#formTres').q.value), .2);

/* ---------- VII · Número y biorritmo ---------- */
const CICLOS = [['Físico', 23, '#c23a4c'], ['Emocional', 28, '#86a7b4'], ['Mental', 33, '#ece4d6']];
function biorritmo(nac) {
  const s = $('#bioSvg'); s.innerHTML = ''; s.classList.remove('vivo');
  const hoy = new Date((HOY?.fecha || new Date().toISOString().slice(0, 10)) + 'T12:00:00');
  const dias = Math.round((hoy - new Date(nac + 'T12:00:00')) / 864e5);
  const W = 640, H = 240, X0 = 30, desde = -7, hasta = 23;
  const x = d => X0 + (d - desde) / (hasta - desde) * (W - X0), y = v => H / 2 - v * (H / 2 - 14);
  [-1, 0, 1].forEach(v => svgEl('line', { x1: X0, x2: W, y1: y(v), y2: y(v), stroke: v ? 'rgba(236,228,214,.08)' : 'rgba(236,228,214,.25)' }, s));
  for (let d = desde; d <= hasta; d += 7) { const t = svgEl('text', { x: x(d), y: H + 26, 'text-anchor': 'middle' }, s); t.textContent = d === 0 ? 'hoy' : (d > 0 ? '+' : '') + d + ' d'; }
  svgEl('line', { x1: x(0), x2: x(0), y1: 0, y2: H, stroke: '#ece4d6', 'stroke-dasharray': '3 5' }, s);
  const valores = CICLOS.map(([n, p, c], k) => {
    let d = '';
    for (let t = desde; t <= hasta; t += .25) { const v = Math.sin(2 * Math.PI * (dias + t) / p); d += (t === desde ? 'M' : 'L') + x(t).toFixed(1) + ',' + y(v).toFixed(1); }
    const path = svgEl('path', { d, class: 'curva', stroke: c }, s); path.style.transitionDelay = (k * .25) + 's';
    const hoyV = Math.sin(2 * Math.PI * dias / p), man = Math.sin(2 * Math.PI * (dias + 1) / p);
    svgEl('circle', { cx: x(0), cy: y(hoyV), r: 5, fill: c, stroke: '#0c0a0a', 'stroke-width': 2 }, s);
    return [n, Math.round(hoyV * 100), man > hoyV, c];
  });
  $('#bioHoy').innerHTML = valores.map(([n, v, sube, c]) => `<div style="--c:${c}"><small>${n}</small><b>${v > 0 ? '+' : ''}${v}</b><span>${v > 60 ? 'Muy alto' : v > 15 ? 'Alto' : v > -15 ? 'Día de cambio' : v > -60 ? 'Bajo' : 'Muy bajo'}, ${sube ? 'subiendo' : 'bajando'}</span></div>`).join('');
  alVer(s, async () => { await pinta(); s.classList.add('vivo'); }, .15);
}
async function numero(fecha) {
  const out = $('#numero');
  try {
    const r = await api('numero', { date: fecha });
    const pasos = r.pasos || String(r.calculation || '').replace(/Month/g, 'Mes').replace(/Day/g, 'Día').replace(/Year/g, 'Año').split(/,\s*/);
    out.innerHTML = `<h4>Tu número de vida</h4><div class="suma">${pasos.map(p => `<span>${esc(p)}</span>`).join('<span>·</span>')}</div><div class="num-grande">0</div><h3>${esc(r.meaning.title)}${r.type === 'master' ? '<span class="maestro">NÚMERO MAESTRO</span>' : ''}</h3><div class="kw" style="margin-top:14px">${r.meaning.keywords.slice(0, 5).map(k => `<span>${esc(k)}</span>`).join('')}</div><p>${esc(frases(r.meaning.description, 2))}</p>`;
    const lanzar = async () => { for (const s of $$('.suma span', out)) { s.classList.add('ok'); await espera(160); } contar($('.num-grande', out), r.number, 1200); };
    alVer(out, lanzar, .15);
  } catch (e) { out.innerHTML = `<p class="error">${esc(e.message)}</p>`; }
}
$('#formNum').addEventListener('submit', e => { e.preventDefault(); const f = e.target.date.value; numero(f); biorritmo(f); });

/* ---------- Arranque ---------- */
(async () => {
  await cargarHoy();
  const b1 = $('#ejNatal button'); cargarNatal(DEMO ? { preset: 'ana' } : PERSONAS.ana, b1); formN.date.value = PERSONAS.ana.date; formN.time.value = '09:30'; formN.city.value = 'Granada'; ciudadSel = { latitude: PERSONAS.ana.latitude, longitude: PERSONAS.ana.longitude, timezone: PERSONAS.ana.timezone };
  cargarCompat('ana|marcos', $('#ejCompat button'));
  alVer($('#chino'), () => cargarChino($('#formChino').date.value), .25);
  numero($('#formNum').date.value); biorritmo($('#formNum').date.value);
})();
})();
