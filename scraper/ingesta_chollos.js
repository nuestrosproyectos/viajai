#!/usr/bin/env node
/**
 * ingesta_chollos.js
 * ------------------------------------------------------------------
 * 1. Consulta la API de precios de Travelpayouts (Aviasales Data API)
 *    para cada aeropuerto de origen en España y los próximos meses.
 * 2. Se queda con los vuelos de ida y vuelta por debajo del precio máximo.
 * 3. Genera el enlace de afiliado con tu marker.
 * 4. Inserta en Airtable (tabla Chollos_Flash) los que no existan ya,
 *    en estado "Pendiente", listos para que n8n los publique.
 *
 * Uso:        node ingesta_chollos.js
 * Prueba:     DRY_RUN=true node ingesta_chollos.js   (no escribe en Airtable)
 * Cron: ver el paso 5 del README (ejecución cada 6 horas).
 */

const path = require('path');
const dotenv = require('dotenv');

// Carga primero el .env de la raíz del proyecto y después, si existe, el de /scraper.
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const CONFIG = {
  tpToken: process.env.TRAVELPAYOUTS_TOKEN,
  tpMarker: process.env.TRAVELPAYOUTS_MARKER,
  airtableToken: process.env.AIRTABLE_TOKEN,
  airtableBase: process.env.AIRTABLE_BASE_ID,
  airtableTabla: process.env.AIRTABLE_TABLE_CHOLLOS || 'Chollos_Flash',
  origenes: (process.env.ORIGENES || 'MAD,BCN,AGP')
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean),
  precioMaximo: Number(process.env.PRECIO_MAXIMO || 60),
  meses: Number(process.env.MESES_A_CONSULTAR || 3),
  maxPorEjecucion: Number(process.env.MAX_CHOLLOS_POR_EJECUCION || 6),
  minNoches: Number(process.env.MIN_NOCHES || 2),
  maxNoches: Number(process.env.MAX_NOCHES || 10),
  dryRun: String(process.env.DRY_RUN || 'false').toLowerCase() === 'true',
};

const TP_API = 'https://api.travelpayouts.com';
const AIRTABLE_API = 'https://api.airtable.com/v0';
const MESES_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// Nombres de respaldo por si falla la descarga del listado de ciudades.
const CIUDADES_RESPALDO = {
  MAD: 'Madrid', BCN: 'Barcelona', AGP: 'Málaga', VLC: 'Valencia', SVQ: 'Sevilla',
  ALC: 'Alicante', BIO: 'Bilbao', PMI: 'Palma de Mallorca', IBZ: 'Ibiza', MAH: 'Menorca',
  TFS: 'Tenerife', TFN: 'Tenerife', TCI: 'Tenerife', LPA: 'Gran Canaria', ACE: 'Lanzarote',
  FUE: 'Fuerteventura', SCQ: 'Santiago de Compostela', OPO: 'Oporto', LIS: 'Lisboa',
  FAO: 'Faro', LON: 'Londres', STN: 'Londres', LGW: 'Londres', LTN: 'Londres',
  PAR: 'París', BVA: 'París', ORY: 'París', CDG: 'París', ROM: 'Roma', FCO: 'Roma',
  CIA: 'Roma', MIL: 'Milán', BGY: 'Milán', MXP: 'Milán', BLQ: 'Bolonia', VCE: 'Venecia',
  TSF: 'Venecia', NAP: 'Nápoles', PSA: 'Pisa', TRN: 'Turín', BRU: 'Bruselas', CRL: 'Bruselas',
  AMS: 'Ámsterdam', EIN: 'Eindhoven', BER: 'Berlín', FRA: 'Fráncfort', MUC: 'Múnich',
  CGN: 'Colonia', DUB: 'Dublín', EDI: 'Edimburgo', MAN: 'Mánchester', RAK: 'Marrakech',
  FEZ: 'Fez', TNG: 'Tánger', RBA: 'Rabat', NDR: 'Nador', MRS: 'Marsella', TLS: 'Toulouse',
  NTE: 'Nantes', BOD: 'Burdeos', LYS: 'Lyon', GVA: 'Ginebra', ZRH: 'Zúrich', BSL: 'Basilea',
  VIE: 'Viena', PRG: 'Praga', BUD: 'Budapest', KRK: 'Cracovia', WAW: 'Varsovia',
  CPH: 'Copenhague', MLA: 'Malta', ATH: 'Atenas', SOF: 'Sofía', OTP: 'Bucarest',
};

const log = (...args) => console.log(`[${new Date().toISOString()}]`, ...args);
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

function validarConfig() {
  const obligatorias = { TRAVELPAYOUTS_TOKEN: CONFIG.tpToken, TRAVELPAYOUTS_MARKER: CONFIG.tpMarker };
  if (!CONFIG.dryRun) {
    obligatorias.AIRTABLE_TOKEN = CONFIG.airtableToken;
    obligatorias.AIRTABLE_BASE_ID = CONFIG.airtableBase;
  }
  const faltan = Object.entries(obligatorias)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (faltan.length) {
    throw new Error(`Faltan variables en el archivo .env: ${faltan.join(', ')}`);
  }
}

/** fetch con reintentos ante errores de red, 429 y 5xx. */
async function pedirJSON(url, opciones = {}, intentos = 4) {
  let ultimoError;
  for (let i = 1; i <= intentos; i++) {
    try {
      const res = await fetch(url, opciones);
      if (res.ok) return await res.json();
      const cuerpo = await res.text();
      const error = new Error(`HTTP ${res.status} en ${url.split('?')[0]} → ${cuerpo.slice(0, 300)}`);
      // Los errores 4xx (salvo 429) no se arreglan reintentando.
      if (res.status < 500 && res.status !== 429) throw Object.assign(error, { definitivo: true });
      ultimoError = error;
    } catch (err) {
      if (err.definitivo) throw err;
      ultimoError = err;
    }
    if (i < intentos) await esperar(1000 * 2 ** (i - 1));
  }
  throw ultimoError;
}

/** Devuelve ['2027-01', '2027-02', ...] empezando por el mes actual. */
function proximosMeses(n, desde = new Date()) {
  const meses = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(Date.UTC(desde.getUTCFullYear(), desde.getUTCMonth() + i, 1));
    meses.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`);
  }
  return meses;
}

/** Diccionario IATA → nombre de ciudad en español. */
async function cargarCiudades() {
  try {
    const lista = await pedirJSON(`${TP_API}/data/es/cities.json`, {}, 2);
    const mapa = { ...CIUDADES_RESPALDO };
    for (const c of lista) {
      if (c.code && c.name) mapa[c.code] = c.name;
    }
    return mapa;
  } catch (err) {
    log('Aviso: no se pudo descargar el listado de ciudades, uso el de respaldo.', err.message);
    return { ...CIUDADES_RESPALDO };
  }
}

/** Vuelos ida y vuelta más baratos desde un origen en un mes concreto. */
async function buscarVuelos(origen, mes) {
  const params = new URLSearchParams({
    origin: origen,
    departure_at: mes,
    one_way: 'false',
    currency: 'eur',
    market: 'es',
    sorting: 'price',
    unique: 'true', // un resultado por destino: el más barato
    direct: 'false',
    limit: '100',
    page: '1',
  });
  const datos = await pedirJSON(`${TP_API}/aviasales/v3/prices_for_dates?${params}`, {
    headers: { 'X-Access-Token': CONFIG.tpToken, Accept: 'application/json' },
  });
  if (datos.success === false) {
    throw new Error(`Travelpayouts devolvió error para ${origen} ${mes}: ${JSON.stringify(datos.error)}`);
  }
  return Array.isArray(datos.data) ? datos.data : [];
}

const soloFecha = (iso) => String(iso).slice(0, 10); // '2027-01-19'

function noches(ida, vuelta) {
  return Math.round((Date.parse(soloFecha(vuelta)) - Date.parse(soloFecha(ida))) / 86400000);
}

/** '2027-01-19', '2027-01-23' → '19 ene – 23 ene 2027' */
function formatearFechas(ida, vuelta) {
  const [, m1, d1] = soloFecha(ida).split('-').map(Number);
  const [a2, m2, d2] = soloFecha(vuelta).split('-').map(Number);
  return `${d1} ${MESES_ES[m1 - 1]} – ${d2} ${MESES_ES[m2 - 1]} ${a2}`;
}

/** Enlace de búsqueda de Aviasales con el marker de afiliado. */
function enlaceAfiliado(origen, destino, ida, vuelta) {
  const ddmm = (iso) => {
    const [, m, d] = soloFecha(iso).split('-');
    return `${d}${m}`;
  };
  const ruta = `${origen}${ddmm(ida)}${destino}${ddmm(vuelta)}1`; // 1 = un adulto
  return `https://www.aviasales.com/search/${ruta}?marker=${encodeURIComponent(CONFIG.tpMarker)}`;
}

/** Convierte un resultado de la API en una fila de Airtable. Devuelve null si no vale. */
function aChollo(vuelo, ciudades) {
  const precio = Number(vuelo.price);
  if (!vuelo.origin || !vuelo.destination || !vuelo.departure_at || !vuelo.return_at) return null;
  if (!Number.isFinite(precio) || precio <= 0 || precio >= CONFIG.precioMaximo) return null;
  if (Date.parse(vuelo.departure_at) <= Date.now()) return null;
  const n = noches(vuelo.departure_at, vuelo.return_at);
  if (n < CONFIG.minNoches || n > CONFIG.maxNoches) return null;

  return {
    Origen: ciudades[vuelo.origin] || vuelo.origin,
    Destino: ciudades[vuelo.destination] || vuelo.destination,
    Precio: Math.round(precio),
    Fechas: formatearFechas(vuelo.departure_at, vuelo.return_at),
    URL_Afiliado: enlaceAfiliado(vuelo.origin, vuelo.destination, vuelo.departure_at, vuelo.return_at),
    Imagen_URL: `https://photo.hotellook.com/static/cities/960x720/${vuelo.destination}.jpg`,
    Estado: 'Pendiente',
  };
}

const clave = (c) => `${c.Origen}|${c.Destino}|${c.Fechas}`.toLowerCase();

/** Claves de los chollos que ya están en Airtable, para no duplicar. */
async function chollosExistentes() {
  const claves = new Set();
  const base = `${AIRTABLE_API}/${CONFIG.airtableBase}/${encodeURIComponent(CONFIG.airtableTabla)}`;
  let offset;
  do {
    const params = new URLSearchParams({ pageSize: '100' });
    ['Origen', 'Destino', 'Fechas'].forEach((f) => params.append('fields[]', f));
    if (offset) params.set('offset', offset);
    const datos = await pedirJSON(`${base}?${params}`, {
      headers: { Authorization: `Bearer ${CONFIG.airtableToken}` },
    });
    for (const r of datos.records || []) claves.add(clave(r.fields));
    offset = datos.offset;
    if (offset) await esperar(250); // límite de Airtable: 5 peticiones/segundo
  } while (offset);
  return claves;
}

/** Inserta en Airtable en lotes de 10 (máximo que admite la API). */
async function insertarEnAirtable(chollos) {
  const url = `${AIRTABLE_API}/${CONFIG.airtableBase}/${encodeURIComponent(CONFIG.airtableTabla)}`;
  let insertados = 0;
  for (let i = 0; i < chollos.length; i += 10) {
    const lote = chollos.slice(i, i + 10);
    const datos = await pedirJSON(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CONFIG.airtableToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ records: lote.map((fields) => ({ fields })), typecast: true }),
    });
    insertados += (datos.records || []).length;
    await esperar(250);
  }
  return insertados;
}

/** Ordena por precio y limita a 2 chollos por destino para dar variedad al canal. */
function seleccionar(candidatos, existentes) {
  const vistos = new Set(existentes);
  const porDestino = {};
  const elegidos = [];
  for (const c of [...candidatos].sort((a, b) => a.Precio - b.Precio)) {
    const k = clave(c);
    if (vistos.has(k)) continue;
    if ((porDestino[c.Destino] || 0) >= 2) continue;
    vistos.add(k);
    porDestino[c.Destino] = (porDestino[c.Destino] || 0) + 1;
    elegidos.push(c);
    if (elegidos.length >= CONFIG.maxPorEjecucion) break;
  }
  return elegidos;
}

async function main() {
  validarConfig();
  log(
    `Inicio. Orígenes: ${CONFIG.origenes.join(', ')} · precio máximo: ${CONFIG.precioMaximo} € · ` +
      `meses: ${CONFIG.meses}${CONFIG.dryRun ? ' · MODO PRUEBA (no se escribe en Airtable)' : ''}`
  );

  const ciudades = await cargarCiudades();
  const candidatos = [];
  let consultasOk = 0;
  let consultasKo = 0;
  let vuelosRecibidos = 0;

  for (const origen of CONFIG.origenes) {
    for (const mes of proximosMeses(CONFIG.meses)) {
      try {
        const vuelos = await buscarVuelos(origen, mes);
        consultasOk++;
        vuelosRecibidos += vuelos.length;
        for (const v of vuelos) {
          const chollo = aChollo(v, ciudades);
          if (chollo) candidatos.push(chollo);
        }
      } catch (err) {
        consultasKo++;
        log(`Error consultando ${origen} ${mes}:`, err.message);
      }
      await esperar(300);
    }
  }

  if (consultasOk === 0) {
    throw new Error('Todas las consultas a Travelpayouts han fallado. Revisa TRAVELPAYOUTS_TOKEN.');
  }

  const existentes = CONFIG.dryRun ? new Set() : await chollosExistentes();
  const nuevos = seleccionar(candidatos, existentes);

  log(
    `Vuelos recibidos: ${vuelosRecibidos} · por debajo de ${CONFIG.precioMaximo} €: ${candidatos.length} · ` +
      `nuevos a insertar: ${nuevos.length} · consultas fallidas: ${consultasKo}`
  );
  for (const c of nuevos) log(`  ✈ ${c.Origen} → ${c.Destino} · ${c.Precio} € · ${c.Fechas} · ${c.URL_Afiliado}`);

  let insertados = 0;
  if (!CONFIG.dryRun && nuevos.length) {
    insertados = await insertarEnAirtable(nuevos);
    log(`Insertados en Airtable (${CONFIG.airtableTabla}): ${insertados}`);
  }
  return { vuelosRecibidos, candidatos: candidatos.length, nuevos, insertados };
}

if (require.main === module) {
  main().catch((err) => {
    console.error(`[${new Date().toISOString()}] ERROR:`, err.message);
    process.exit(1);
  });
}

module.exports = { main, aChollo, seleccionar, formatearFechas, enlaceAfiliado, proximosMeses, CONFIG };
