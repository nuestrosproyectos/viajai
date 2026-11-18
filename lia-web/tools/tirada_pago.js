const GRATIS = 3;
const RELLENO = 'Esta carta ya está echada y espera su turno para hablarte de lo que viene.';
function resumenLia(datos) {
  const n = datos.length, mayores = datos.filter(p => p.card.arcana === 'major').length, inv = datos.filter(p => p.card.reversed).length;
  const cuenta = {}; datos.forEach(p => p.card.suit && (cuenta[p.card.suit] = (cuenta[p.card.suit] || 0) + 1));
  const top = Object.entries(cuenta).sort((a, b) => b[1] - a[1])[0];
  const fin = datos[n - 1].card;
  const fr = [];
  fr.push(mayores >= n / 2 ? `Han salido ${mayores} Arcanos Mayores de ${n}: esto no es un asunto pequeño, es un momento que te va a marcar.` : mayores ? `Han salido ${mayores} Arcanos Mayores de ${n}: hay algo de fondo, pero casi todo depende de lo que hagas en el día a día.` : 'No ha salido ningún Arcano Mayor: todo está en tus manos y en las decisiones del día a día.');
  if (top && top[1] >= 2 && PALOS[top[0]]) fr.push(`Domina el palo de ${PALOS[top[0]][0]} (${top[1]} cartas): la clave está en ${PALOS[top[0]][1]}.`);
  fr.push(inv === 0 ? 'Ninguna carta ha salido invertida: el camino está bastante despejado.' : inv >= n / 2 ? `${inv} cartas han salido invertidas: hay energía bloqueada, toca soltar antes de avanzar.` : `${inv} ${inv === 1 ? 'carta ha salido invertida' : 'cartas han salido invertidas'}: hay algo que frena, pero no lo para todo.`);
  fr.push(`Y la última carta, ${fin.name}${fin.reversed ? ' invertida' : ''}, habla de ${(fin.keywords || []).slice(0, 2).join(' y ')}. Quédate con eso.`);
  $('#resumen').innerHTML = `<img src="${$('#completa .firma img').src}" alt=""><div><small>Lo que veo en tu tirada · Lía</small><p>${fr.map(esc).join(' ')}</p><span class="res-nota">Gracias por confiar en mí. Si quieres, mañana echamos otra.</span></div>`;
}
const itemLectura = (p, i, T) => {
  if (p.bloqueada) return `<li data-i="${i}"><span class="n">${i + 1}</span><div><small>${esc(T.pos[i][0])} · <em>${esc(T.pos[i][1])}</em></small><b>Carta oculta</b><p>${RELLENO}</p></div></li>`;
  const C = p.card; return `<li data-i="${i}"><span class="n">${i + 1}</span><div><small>${esc(T.pos[i][0])} · <em>${esc(T.pos[i][1])}</em></small><b>${esc(C.name)}${C.reversed ? ' <i>invertida</i>' : ''}</b><p>${esc(textoCarta(C, T.campo))}</p></div></li>`;
};
const naipe = (p, i, T) => `<button type="button" class="naipe-c carta3d${p.card && p.card.reversed ? ' invertida' : ''}" data-i="${i}" aria-label="Posición ${i + 1}: ${esc(T.pos[i][0])}"><div class="cara dorso"></div><div class="cara frente">${p.card ? `<img src="${imgCarta(p.card.id)}" alt="${esc(p.card.name)}">` : ''}</div><span class="num">${i + 1}</span></button>`;
// Destapa las cartas de pago con los datos que devuelve el servidor tras cobrar.
async function destapar(completo) {
  const T = TIRADAS[tipoTirada], cartas = $$('#tapete .naipe-c'), items = $$('#lectura li');
  tiradaDatos = completo.slice(0, T.pos.length);
  $('.muro')?.remove();
  for (let i = GRATIS; i < cartas.length; i++) {
    const p = tiradaDatos[i];
    cartas[i].classList.toggle('invertida', !!p.card.reversed);
    $('.frente', cartas[i]).innerHTML = `<img src="${imgCarta(p.card.id)}" alt="${esc(p.card.name)}">`;
    items[i].outerHTML = itemLectura(p, i, T);
  }
  const nuevos = $$('#lectura li');
  for (let i = GRATIS; i < cartas.length; i++) { cartas[i].classList.remove('bloqueada'); cartas[i].classList.add('girada'); nuevos[i].classList.add('vista'); await espera(260); }
  resumenLia(tiradaDatos); $('#resumen').hidden = false; $('#resumen').scrollIntoView({ behavior: 'smooth', block: 'center' });
}
async function pintarTirada(r, q) {
  const tap = $('#tapete'), lec = $('#lectura'), T = TIRADAS[tipoTirada];
  // Vista previa sin servidor (sin token): los datos llegan completos y el pago se simula.
  const datos = r.positions.slice(0, T.pos.length).map((p, i) => (!r.token && i >= GRATIS) ? { position: p.position, bloqueada: true } : p);
  tiradaDatos = datos;
  tap.innerHTML = datos.map((p, i) => naipe(p, i, T)).join('');
  colocar();
  const cartas = $$('.naipe-c', tap);
  const tw = parseFloat(tap.style.width), th = parseFloat(tap.style.height);
  cartas.forEach(c => { c.style.transform = `translate(${tw / 2 - parseFloat(c.style.width) / 2}px,${th + 40}px) rotate(-8deg)`; c.style.opacity = 0; });
  lec.innerHTML = `<ol>${datos.map((p, i) => itemLectura(p, i, T)).join('')}</ol>`;
  await pinta();
  for (const c of cartas) { c.classList.add('puesta'); c.style.opacity = 1; c.style.transform = `translate(${c.dataset.x}px,${c.dataset.y}px) rotate(${c.dataset.r}deg)`; await espera(170); }
  await espera(500);
  const items = $$('#lectura li');
  for (let i = 0; i < cartas.length; i++) {
    if (!datos[i].bloqueada) { cartas[i].classList.add('girada'); items[i].classList.add('vista'); await espera(260); }
    else { cartas[i].classList.add('bloqueada'); items[i].classList.add('vista', 'borrosa'); items[i].setAttribute('aria-hidden', 'true'); }
  }
  const btnTipo = $(`#tipos [data-tipo="${tipoTirada}"] i`), precio = btnTipo ? btnTipo.textContent : '', faltan = datos.filter(p => p.bloqueada).length;
  const ultima = T.pos[T.pos.length - 1][0];
  const muro = document.createElement('div'); muro.className = 'muro';
  muro.innerHTML = `<p class="muro-t">Te faltan ${faltan} cartas, incluida la de <em>«${esc(ultima)}»</em>.</p><p>Las cartas ya están echadas: son estas y no cambian. Desbloquéalas para ver qué dicen y lo que veo en tu tirada completa.</p><button type="button" class="btn btn-pri" id="desbloquear">Ver mi tirada completa · ${esc(precio)}</button><small>${r.token ? 'Pago seguro con Stripe: tarjeta, Apple Pay o Google Pay. No guardamos tus datos de pago.' : 'En esta vista previa el pago es simulado.'}</small><p class="error" id="errPago" hidden></p>`;
  lec.appendChild(muro);
  $('#desbloquear').addEventListener('click', async () => {
    const bt = $('#desbloquear'); bt.disabled = true; bt.textContent = r.token ? 'Abriendo el pago seguro…' : 'Procesando el pago…';
    try {
      if (!r.token) { await espera(900); return destapar(r.positions); }
      guardaPendiente({ token: r.token, tipo: tipoTirada, q, r });
      const p = await api('pagar', { token: r.token });
      if (p.url) { location.href = p.url; return; }
      if (p.demo) { const d = await api('desbloquear', { token: r.token, sesion: 'demo' }); guardaPendiente(null); return destapar(d.positions); }
    } catch (e) { const er = $('#errPago'); er.hidden = false; er.textContent = e.message; bt.disabled = false; bt.textContent = `Ver mi tirada completa · ${precio}`; }
  });
}
// La tirada pendiente de pago se guarda en el navegador para recuperarla al volver de Stripe.
function guardaPendiente(v) { try { localStorage.setItem('tiradaPendiente', v ? JSON.stringify(v) : ''); } catch {} }
function leePendiente() { try { return JSON.parse(localStorage.getItem('tiradaPendiente') || 'null'); } catch { return null; } }
async function echarCompleta(q) {
  const lec = $('#lectura');
  $('#tapete').innerHTML = ''; $('#resumen').hidden = true; lec.innerHTML = '<p class="lectura-vacia">Barajando las 78 cartas…</p>';
  $('#formCompleta button').disabled = true;
  try { await pintarTirada(await api('tirada', { tipo: tipoTirada, question: q }), q); }
  catch (e) { lec.innerHTML = `<p class="error">${esc(e.message)}</p>`; }
  $('#formCompleta button').disabled = false;
}
// Vuelta desde Stripe: ?pago=cs_... → se pinta la misma tirada y se destapan las cartas pagadas.
const PAGO = new URLSearchParams(location.search).get('pago');
async function volverDelPago() {
  const pend = leePendiente();
  history.replaceState(null, '', location.pathname + location.hash);
  if (!pend) return false;
  tipoTirada = pend.tipo; $$('#tipos button').forEach(x => x.setAttribute('aria-selected', x.dataset.tipo === pend.tipo));
  $('#formCompleta').q.value = pend.q || '';
  await pintarTirada(pend.r, pend.q);
  const aviso = t => { const er = $('#errPago'); if (er) { er.hidden = false; er.textContent = t; } };
  if (PAGO === 'cancelado') { aviso('Has cancelado el pago. Tus cartas siguen aquí, sin cambiar, por si quieres verlas.'); return true; }
  for (let intento = 0; intento < 4; intento++) {   // Stripe puede tardar unos segundos en marcarlo como pagado
    try { const d = await api('desbloquear', { token: pend.token, sesion: PAGO }); guardaPendiente(null); await destapar(d.positions); return true; }
    catch (e) { if (intento === 3) aviso(e.message); else await espera(2500); }
  }
  return true;
}
