/* ---------- Tirada completa (Lía) ---------- */
const H_C = 536 / 300, G = .1;
const TIRADAS = {
  celtic: { W: 5.5, H: 4 * H_C + 3 * G, campo: 'meaning', pos: [
    ['Lo que está pasando', 'Cómo estás ahora mismo frente a tu pregunta.'], ['Lo que se cruza', 'El obstáculo o la tensión que lo atraviesa todo.'],
    ['De dónde viene', 'Lo que te ha traído hasta aquí.'], ['Lo que llega', 'Lo que viene en las próximas semanas.'],
    ['Lo que buscas', 'Tu meta, aunque no siempre la digas en voz alta.'], ['Lo que hay debajo', 'Lo que pesa por dentro y quizá no ves.'],
    ['Mi consejo', 'Cómo te conviene moverte.'], ['Lo que te rodea', 'Personas y circunstancias que influyen.'],
    ['Lo que esperas y temes', 'A veces es lo mismo.'], ['Hacia dónde va', 'El resultado si sigues por este camino.']] },
  love: { W: 4.1, H: 3 * H_C + 2 * G, campo: 'love', pos: [
    ['Tú', 'Cómo llegas a esta relación.'], ['La otra persona', 'Cómo está y qué necesita.'], ['Lo que hay entre vosotros', 'La energía que os une ahora.'],
    ['Lo que hay que cuidar', 'Lo que pide atención o arreglo.'], ['Hacia dónde va', 'El rumbo de esta historia.']] },
  career: { W: 4.9, H: 2 * H_C + G, campo: 'career', pos: [
    ['Dónde estás', 'Tu momento profesional.'], ['Tus fuerzas', 'Lo que haces bien y te sostiene.'], ['Lo que te frena', 'Lo que conviene trabajar.'],
    ['Oportunidades', 'Puertas que se pueden abrir.'], ['Amenazas', 'Lo que conviene vigilar.'], ['Mi consejo', 'Cómo moverte ahora.'], ['Hacia dónde va', 'El rumbo si sigues así.']] },
};
function sitios(tipo) {
  const h = H_C, g = G;
  if (tipo === 'celtic') {
    const yc = (4 * h + 3 * g) / 2;
    const sx = 4.95, st = i => h / 2 + i * (h + g);
    return [[2.05, yc, 0], [2.05, yc, 90], [.55, yc], [3.55, yc], [2.05, yc - h - g], [2.05, yc + h + g], [sx, st(3)], [sx, st(2)], [sx, st(1)], [sx, st(0)]];
  }
  if (tipo === 'love') { const y = h / 2 + h + g; return [[.85, y], [3.25, y], [2.05, y], [2.05, y + h + g], [2.05, h / 2]]; }
  const y1 = h / 2, y2 = y1 + h + g; return [[.6, y1], [1.83, y1], [3.06, y1], [4.29, y1], [1.21, y2], [2.45, y2], [3.68, y2]];
}
let tipoTirada = 'celtic', tiradaDatos = null;
const PALOS = { cups: ['Copas', 'las emociones y las relaciones'], pentacles: ['Oros', 'el dinero, el trabajo y lo material'], swords: ['Espadas', 'la cabeza: decisiones, dudas y conflictos'], wands: ['Bastos', 'la acción: proyectos, ganas y energía'] };
function colocar() {
  const T = TIRADAS[tipoTirada], tap = $("#tapete"), ancho = tap.parentElement.clientWidth - 40;
  const u = Math.min(108, ancho / T.W);
  tap.style.width = (u * T.W) + 'px'; tap.style.height = (u * T.H) + 'px';
  $$('.naipe-c', tap).forEach((c, i) => {
    const [x, y, rot = 0] = sitios(tipoTirada)[i];
    c.style.width = u + 'px'; c.style.height = (u * H_C) + 'px';
    c.dataset.x = (x * u - u / 2); c.dataset.y = (y * u - u * H_C / 2); c.dataset.r = rot;
    if (c.classList.contains('puesta')) c.style.transform = `translate(${c.dataset.x}px,${c.dataset.y}px) rotate(${rot}deg)`;
  });
}
addEventListener('resize', () => tiradaDatos && colocar());
async function echarCompleta(q) {
  const tap = $('#tapete'), lec = $('#lectura'), res = $('#resumen'), T = TIRADAS[tipoTirada];
  tap.innerHTML = ''; res.hidden = true; lec.innerHTML = '<p class="lectura-vacia">Barajando las 78 cartas…</p>';
  $('#formCompleta button').disabled = true;
  try {
    const r = await api('tirada', { tipo: tipoTirada, question: q });
    tiradaDatos = r.positions.slice(0, T.pos.length);
    tap.innerHTML = tiradaDatos.map((p, i) => `<button type="button" class="naipe-c carta3d${p.card.reversed ? ' invertida' : ''}" data-i="${i}" aria-label="Posición ${i + 1}: ${esc(T.pos[i][0])}"><div class="cara dorso"></div><div class="cara frente"><img src="${imgCarta(p.card.id)}" alt="${esc(p.card.name)}"></div><span class="num">${i + 1}</span></button>`).join('');
    colocar();
    const cartas = $$('.naipe-c', tap);
    const tw = parseFloat(tap.style.width), th = parseFloat(tap.style.height);
    cartas.forEach(c => { c.style.transform = `translate(${tw / 2 - parseFloat(c.style.width) / 2}px,${th + 40}px) rotate(-8deg)`; c.style.opacity = 0; });
    lec.innerHTML = `<ol>${tiradaDatos.map((p, i) => { const C = p.card; const txt = frases(C[T.campo] || C.meaning, 2); return `<li data-i="${i}"><span class="n">${i + 1}</span><div><small>${esc(T.pos[i][0])} · <em>${esc(T.pos[i][1])}</em></small><b>${esc(C.name)}${C.reversed ? ' <i>invertida</i>' : ''}</b><p>${esc(txt)}</p></div></li>`; }).join('')}</ol>`;
    await pinta();
    for (const c of cartas) { c.classList.add('puesta'); c.style.opacity = 1; c.style.transform = `translate(${c.dataset.x}px,${c.dataset.y}px) rotate(${c.dataset.r}deg)`; await espera(170); }
    await espera(500);
    const items = $$('#lectura li');
    for (let i = 0; i < cartas.length; i++) { cartas[i].classList.add('girada'); items[i].classList.add('vista'); await espera(260); }
    // Resumen de Lía con lo que dicen las cartas
    const n = tiradaDatos.length, mayores = tiradaDatos.filter(p => p.card.arcana === 'major').length, inv = tiradaDatos.filter(p => p.card.reversed).length;
    const cuenta = {}; tiradaDatos.forEach(p => p.card.suit && (cuenta[p.card.suit] = (cuenta[p.card.suit] || 0) + 1));
    const top = Object.entries(cuenta).sort((a, b) => b[1] - a[1])[0];
    const fin = tiradaDatos[n - 1].card;
    const fr = [];
    fr.push(mayores >= n / 2 ? `Han salido ${mayores} Arcanos Mayores de ${n}: esto no es un asunto pequeño, es un momento que te va a marcar.` : mayores ? `Han salido ${mayores} Arcanos Mayores de ${n}: hay algo de fondo, pero casi todo depende de lo que hagas en el día a día.` : 'No ha salido ningún Arcano Mayor: todo está en tus manos y en las decisiones del día a día.');
    if (top && top[1] >= 2 && PALOS[top[0]]) fr.push(`Domina el palo de ${PALOS[top[0]][0]} (${top[1]} cartas): la clave está en ${PALOS[top[0]][1]}.`);
    fr.push(inv === 0 ? 'Ninguna carta ha salido invertida: el camino está bastante despejado.' : inv >= n / 2 ? `${inv} cartas han salido invertidas: hay energía bloqueada, toca soltar antes de avanzar.` : `${inv} ${inv === 1 ? 'carta ha salido invertida' : 'cartas han salido invertidas'}: hay algo que frena, pero no lo para todo.`);
    fr.push(`Y la última carta, ${fin.name}${fin.reversed ? ' invertida' : ''}, habla de ${(fin.keywords || []).slice(0, 2).join(' y ')}. Quédate con eso.`);
    res.innerHTML = `<img src="${$('#completa .firma img').src}" alt=""><div><small>Lo que veo en tu tirada · Lía</small><p>${fr.map(esc).join(' ')}</p><span class="res-nota">En la web publicada esta tirada cuesta ${esc($('#tipos [aria-selected=true] i').textContent)}. Aquí la ves completa como vista previa.</span></div>`;
    res.hidden = false;
  } catch (e) { lec.innerHTML = `<p class="error">${esc(e.message)}</p>`; }
  $('#formCompleta button').disabled = false;
}
$('#tipos').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $$('#tipos button').forEach(x => x.setAttribute('aria-selected', x === b)); tipoTirada = b.dataset.tipo;
  echarCompleta($('#formCompleta').q.value.trim() || '¿Qué necesito saber?');
});
$('#formCompleta').addEventListener('submit', e => { e.preventDefault(); echarCompleta(e.target.q.value.trim() || '¿Qué necesito saber?'); });
const marcar = i => { $$('#lectura li').forEach(li => li.classList.toggle('activa', li.dataset.i === String(i))); $$('#tapete .naipe-c').forEach(c => c.classList.toggle('activa', c.dataset.i === String(i))); };
$('#tapete').addEventListener('click', e => { const c = e.target.closest('.naipe-c'); if (!c) return; marcar(c.dataset.i); const li = $(`#lectura li[data-i="${c.dataset.i}"]`); if (li) li.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); });
$('#lectura').addEventListener('mouseover', e => { const li = e.target.closest('li'); if (li) marcar(li.dataset.i); });
alVer($('#tapete').parentElement, () => echarCompleta($('#formCompleta').q.value), .2);

