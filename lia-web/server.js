// Servidor de Lía: sirve la web y hace de puente con RoxyAPI.
// La clave NUNCA llega al navegador: vive en la variable ROXY_API_KEY del servidor.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8787;
const KEY = process.env.ROXY_API_KEY || 'proxy-injected';
const ROXY = 'https://roxyapi.com/api/v2';
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
  'POST /api/natal': async (_, b) => roxy('/astrology/natal-chart?lang=es', persona(b), 24 * HORA),
  'POST /api/compat': async (_, b) => roxy('/astrology/compatibility-score?lang=es', { person1: persona(b.p1), person2: persona(b.p2) }, 24 * HORA),
  'POST /api/bio': async (_, b) => {
    if (!fecha(b.birthDate)) throw Object.assign(new Error('Fecha no válida'), { status: 400 });
    return roxy('/biorhythm/reading?lang=es', { birthDate: b.birthDate, targetDate: hoyMadrid() }, 6 * HORA);
  },
  'POST /api/chino': async (_, b) => {
    if (!fecha(b.date)) throw Object.assign(new Error('Fecha no válida'), { status: 400 });
    const s = await roxy('/chinese-astrology/zodiac/sign?lang=es', { date: b.date }, 24 * HORA);
    const comp = await roxy(`/chinese-astrology/zodiac/compatibility/${s.animal.id}/goat?lang=es`, null, 24 * HORA);
    return { signo: s, comp };
  },
  'POST /api/numero': async (_, b) => {
    const [y, m, d] = String(b.date || '').split('-').map(Number);
    if (!y || !m || !d) throw Object.assign(new Error('Fecha no válida'), { status: 400 });
    return roxy('/numerology/life-path?lang=es', { year: y, month: m, day: d }, 24 * HORA);
  },
};

function leer(req) {
  return new Promise((ok, ko) => { let s = ''; req.on('data', c => { s += c; if (s.length > 1e4) req.destroy(); }); req.on('end', () => { try { ok(s ? JSON.parse(s) : {}); } catch { ko(Object.assign(new Error('JSON no válido'), { status: 400 })); } }); });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const h = API[req.method + ' ' + url.pathname];
  if (h) {
    try {
      const cuerpo = req.method === 'POST' ? await leer(req) : null;
      const v = await h(url.searchParams, cuerpo || {});
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
