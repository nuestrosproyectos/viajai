// Servidor de Lía: sirve la web y hace de puente con RoxyAPI.
// La clave NUNCA llega al navegador: vive en la variable ROXY_API_KEY del servidor.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8787;
const KEY = process.env.ROXY_API_KEY || 'proxy-injected';
const ROXY = process.env.ROXY_API || 'https://roxyapi.com/api/v2';
const PUB = path.join(__dirname, 'public');
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.webp': 'image/webp' };

// Caché en memoria: lo que no cambia en el día no se vuelve a pedir.
const cache = new Map();
async function roxy(ruta, cuerpo, ttl = 0) {
  const k = ruta + JSON.stringify(cuerpo || '');
  const c = cache.get(k);
  if (ttl && c && c.t > Date.now()) return c.v;
  const r = await fetch(ROXY + ruta, {
    method: cuerpo ? 'POST' : 'GET',
    headers: { 'X-API-Key': KEY, 'Content-Type': 'application/json' },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const v = await r.json();
  if (!r.ok) throw Object.assign(new Error(v.error || 'Error de RoxyAPI'), { status: r.status });
  if (ttl) cache.set(k, { v, t: Date.now() + ttl });
  return v;
}

const fecha = s => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
const hora = s => /^\d{2}:\d{2}(:\d{2})?$/.test(s || '');
const num = x => typeof x === 'number' && isFinite(x);
function persona(p) {
  if (!p || !fecha(p.date) || !hora(p.time) || !num(p.latitude) || !num(p.longitude) || typeof p.timezone !== 'string') throw Object.assign(new Error('Faltan datos de nacimiento'), { status: 400 });
  return { date: p.date, time: p.time.length === 5 ? p.time + ':00' : p.time, latitude: p.latitude, longitude: p.longitude, timezone: p.timezone };
}
const HORA = 3600e3;

// ---------- Cobro con Stripe ----------
// Las cartas de pago viajan al navegador CIFRADAS (AES-GCM) dentro de un «token». Solo se descifran cuando Stripe
// confirma que esa sesión de pago está pagada y que es la de ese token. Así no hace falta base de datos.
const STRIPE = process.env.STRIPE_API || 'https://api.stripe.com';
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || '';
const SECRETO = process.env.SECRETO_TIRADAS || require('crypto').randomBytes(32).toString('hex');
if (!process.env.SECRETO_TIRADAS) console.warn('Aviso: sin SECRETO_TIRADAS los pagos pendientes no sobreviven a un reinicio.');
const GRATIS = 3;
const TIRADAS = {   // precio en céntimos, decidido SOLO en el servidor
  celtic: { ruta: 'celtic-cross', cartas: 10, precio: 490, nombre: 'Tirada Cruz Celta completa (10 cartas)' },
  love: { ruta: 'love', cartas: 5, precio: 390, nombre: 'Tirada del Amor completa (5 cartas)' },
  career: { ruta: 'career', cartas: 7, precio: 390, nombre: 'Tirada del Trabajo completa (7 cartas)' },
};
const cr = require('crypto');
const clave = cr.createHash('sha256').update(SECRETO).digest();
const b64u = b => Buffer.from(b).toString('base64url');
function cifra(obj) {
  const iv = cr.randomBytes(12), c = cr.createCipheriv('aes-256-gcm', clave, iv);
  const d = Buffer.concat([c.update(JSON.stringify(obj)), c.final()]);
  return b64u(Buffer.concat([iv, c.getAuthTag(), d]));
}
function descifra(tok) {
  try {
    const b = Buffer.from(String(tok || ''), 'base64url'), c = cr.createDecipheriv('aes-256-gcm', clave, b.subarray(0, 12));
    c.setAuthTag(b.subarray(12, 28)); return JSON.parse(Buffer.concat([c.update(b.subarray(28)), c.final()]).toString());
  } catch { throw Object.assign(new Error('Esta tirada ya no es válida. Echa una nueva.'), { status: 400 }); }
}
const huella = tok => cr.createHash('sha256').update(String(tok)).digest('hex').slice(0, 40);
async function stripe(metodo, ruta, campos) {
  const r = await fetch(STRIPE + ruta, {
    method: metodo,
    headers: { Authorization: 'Bearer ' + STRIPE_KEY, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: campos ? new URLSearchParams(campos).toString() : undefined,
  });
  const v = await r.json();
  if (!r.ok) { console.error('Stripe', r.status, v.error && v.error.message); throw Object.assign(new Error('No he podido abrir el pago. Prueba otra vez.'), { status: 502 }); }
  return v;
}
const hoyMadrid = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' });

// Solo estas rutas existen: el navegador no puede pedir a RoxyAPI lo que quiera.
const API = {
  'GET /api/hoy': async () => {
    const d = hoyMadrid(); const [y, m] = d.split('-');
    const [luna, mes, carta, prox] = await Promise.all([
      roxy(`/astrology/moon-phase/current?lang=es&timezone=Europe/Madrid&date=${d}`, null, HORA),
      roxy(`/astrology/moon-phase/calendar/${y}/${+m}?lang=es&timezone=Europe/Madrid`, null, 12 * HORA),
      roxy('/tarot/daily?lang=es', { date: d }, 12 * HORA),
      roxy('/astrology/moon-phase/upcoming?lang=es&timezone=Europe/Madrid', null, 6 * HORA),
    ]);
    return { fecha: d, luna, mes, carta, prox };
  },
  'GET /api/lugares': async q => {
    const t = String(q.get('q') || '').slice(0, 60);
    if (t.length < 2) return { cities: [] };
    return roxy(`/location/search?q=${encodeURIComponent(t)}&limit=6`, null, 24 * HORA);
  },
  'POST /api/sino': async (_, b) => roxy('/tarot/yes-no?lang=es', { question: String(b.question || '').slice(0, 160) }),
  'POST /api/tres': async (_, b) => roxy('/tarot/spreads/three-card?lang=es', { question: String(b.question || '').slice(0, 160) }),
  'POST /api/tirada': async (_, b) => {
    const T = TIRADAS[b.tipo];
    if (!T) throw Object.assign(new Error('Tirada no válida'), { status: 400 });
    const r = await roxy(`/tarot/spreads/${T.ruta}?lang=es`, { question: String(b.question || '').slice(0, 160) });
    const pos = r.positions.slice(0, T.cartas);
    // Al navegador solo van las 3 gratis; el resto, cifrado y sin pistas (ni carta, ni imagen).
    return { positions: pos.map((p, i) => i < GRATIS ? p : { position: p.position, bloqueada: true }), token: cifra({ tipo: b.tipo, pos }), precio: T.precio };
  },
  'POST /api/pagar': async (_, b, req) => {
    const t = descifra(b.token), T = TIRADAS[t.tipo];
    if (!STRIPE_KEY) {
      if (process.env.PAGO_DEMO === '1') return { demo: true };
      throw Object.assign(new Error('El pago aún no está activado.'), { status: 503 });
    }
    const origen = process.env.URL_PUBLICA || ('http://' + req.headers.host);
    const s = await stripe('POST', '/v1/checkout/sessions', {
      mode: 'payment', locale: 'es',
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': 'eur',
      'line_items[0][price_data][unit_amount]': String(T.precio),
      'line_items[0][price_data][product_data][name]': T.nombre,
      'metadata[huella]': huella(b.token), 'metadata[tipo]': t.tipo,
      success_url: origen + '/?pago={CHECKOUT_SESSION_ID}#completa',
      cancel_url: origen + '/?pago=cancelado#completa',
    });
    return { url: s.url };
  },
  'POST /api/desbloquear': async (_, b) => {
    const t = descifra(b.token);
    if (!STRIPE_KEY) {
      if (process.env.PAGO_DEMO === '1' && b.sesion === 'demo') return { positions: t.pos };
      throw Object.assign(new Error('El pago aún no está activado.'), { status: 503 });
    }
    if (!/^cs_[A-Za-z0-9_]+$/.test(String(b.sesion || ''))) throw Object.assign(new Error('Pago no encontrado.'), { status: 400 });
    const s = await stripe('GET', '/v1/checkout/sessions/' + b.sesion);
    if (s.payment_status !== 'paid' || !s.metadata || s.metadata.huella !== huella(b.token))
      throw Object.assign(new Error('Todavía no me consta el pago de esta tirada. Si te han cobrado, escríbenos y lo arreglamos.'), { status: 402 });
    return { positions: t.pos };
  },
  'POST /api/perfil': async (_, b) => {
    // Guarda el correo de quien pide su carta (con su consentimiento) para enviarle la carta y los rituales.
    // Va a data/perfiles.jsonl, fuera de public/ y excluido de git (son datos personales).
    const email = String(b.email || '').trim().toLowerCase().slice(0, 160);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw Object.assign(new Error('Revisa el correo: parece que falta algo.'), { status: 400 });
    if (b.consiento !== true) throw Object.assign(new Error('Para enviártela necesitamos tu consentimiento.'), { status: 400 });
    const n = b.nacimiento && typeof b.nacimiento === 'object' ? { date: String(b.nacimiento.date || '').slice(0, 10), time: String(b.nacimiento.time || '').slice(0, 8), latitude: +b.nacimiento.latitude || null, longitude: +b.nacimiento.longitude || null } : null;
    fs.appendFileSync(path.join(__dirname, 'data', 'perfiles.jsonl'), JSON.stringify({ email, consiento: true, nacimiento: n, fecha: new Date().toISOString() }) + '\n');
    return { ok: true };
  },
  'POST /api/natal': async (_, b) => roxy('/astrology/natal-chart?lang=es', persona(b), 24 * HORA),
  'POST /api/compat': async (_, b) => roxy('/astrology/compatibility-score?lang=es', { person1: persona(b.p1), person2: persona(b.p2) }, 24 * HORA),
  'POST /api/chino': async (_, b) => {
    if (!fecha(b.date)) throw Object.assign(new Error('Fecha no válida'), { status: 400 });
    const s = await roxy('/chinese-astrology/zodiac/sign?lang=es', { date: b.date }, 24 * HORA);
    const comp = await roxy(`/chinese-astrology/zodiac/compatibility/${s.animal.id}/goat?lang=es`, null, 24 * HORA);
    return { signo: s, comp };
  },
};

function leer(req) {
  return new Promise((ok, ko) => { let s = ''; req.on('data', c => { s += c; if (s.length > 2e5) req.destroy(); }); req.on('end', () => { try { ok(s ? JSON.parse(s) : {}); } catch { ko(Object.assign(new Error('JSON no válido'), { status: 400 })); } }); });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const h = API[req.method + ' ' + url.pathname];
  if (h) {
    try {
      const cuerpo = req.method === 'POST' ? await leer(req) : null;
      const v = await h(url.searchParams, cuerpo || {}, req);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify(v));
    } catch (e) {
      res.writeHead(e.status || 500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: e.status && e.status < 500 ? e.message : 'Ahora mismo no puedo leer las estrellas. Prueba en un momento.' }));
    }
    return;
  }
  let f = path.normalize(path.join(PUB, url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname)));
  if (!f.startsWith(PUB)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404); return res.end('No encontrado'); }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream', 'Cache-Control': f.includes('/cartas/') ? 'public, max-age=604800' : 'no-cache' });
    res.end(data);
  });
}).listen(PORT, () => console.log('Lía en http://localhost:' + PORT));
