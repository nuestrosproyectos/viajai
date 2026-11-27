#!/usr/bin/env node
// =====================================================================
//  FÁBRICA DE WEBS CON ANDRÉS · asistente de línea de órdenes
//
//    node fabrica/crear.mjs nueva                     → pregunta lo mínimo, de una en una, y crea la web
//    node fabrica/crear.mjs nueva --respuestas=x.json → igual, con las respuestas de la página de la fábrica
//    node fabrica/crear.mjs asistente <web> [--nombre=Lucía] [--voz=<id>] [--genero=mujer] [--tono="…"]
//                                                     → cambia el asistente de una web existente y comprueba
//                                                       que el cambio llega a todas partes
//    node fabrica/crear.mjs voces [hombre|mujer]      → voces de ElevenLabs en español de España
//    node fabrica/crear.mjs comprobar <web>           → construye y prueba en iPhone, Android y ordenador
//    node fabrica/crear.mjs lista                     → webs de la fábrica y lo que tienen pendiente
//
//  Lo que este script NO hace solo (lo hace Claude con sus herramientas y te pide OK si cuesta dinero):
//  comprobar dominios y la OEPM, buscar fotos, investigar el sector con fuentes y pasar las pruebas del cerebro.
//  Nunca compra ni publica nada.
// =====================================================================
import { createInterface } from "node:readline/promises";
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { construir, websDisponibles, pendientes, RAIZ } from "./construir.mjs";

const args = process.argv.slice(2);
const orden = args[0];
const op = Object.fromEntries(args.filter(a => a.startsWith("--")).map(a => { const [k, ...v] = a.slice(2).split("="); return [k, v.join("=") || true]; }));
const libres = args.slice(1).filter(a => !a.startsWith("--"));
const VOCES = JSON.parse(readFileSync(new URL("./voces-es.json", import.meta.url), "utf8")).voces;
const slug = t => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// ---------------------------------------------------------------- preguntas
async function preguntar(rl, texto, opciones, defecto) {
  if (opciones) {
    console.log(`\n${texto}`);
    opciones.forEach((o, i) => console.log(`  ${i + 1}. ${o}`));
    const r = (await rl.question(`Elige 1-${opciones.length}${defecto ? ` (Intro = ${defecto})` : ""} o escribe otra cosa: `)).trim();
    if (!r && defecto) return defecto;
    const n = Number(r); return n >= 1 && n <= opciones.length ? opciones[n - 1] : r;
  }
  const r = (await rl.question(`\n${texto}${defecto ? ` (Intro = ${defecto})` : ""}: `)).trim();
  return r || defecto || "";
}

async function respuestasNueva() {
  if (op.respuestas) return JSON.parse(readFileSync(op.respuestas, "utf8"));
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  console.log("Fábrica de webs con Andrés. Lo que no sepas, déjalo en blanco: queda como PENDIENTE y se ve en la vista previa.");
  const R = {};
  R.negocio = await preguntar(rl, "1. ¿Qué negocio es? (por ejemplo «clínica dental», «cerrajería», «gestoría»)");
  R.ciudad = await preguntar(rl, "   ¿En qué ciudad o provincia?", null, "Granada");
  R.publico = await preguntar(rl, "   ¿A quién va dirigido?", ["Particulares (hogares)", "Empresas y autónomos", "Los dos"], "Particulares (hogares)");
  R.cita = await preguntar(rl, "   ¿Qué cierra Andrés?", ["Visita a domicilio", "Primera consulta", "Cita en el local", "Presupuesto o estudio", "Venta"], "Visita a domicilio");
  R.marca = await preguntar(rl, "2. Marca: ¿tienes nombre? (si no, Claude te propone 3-5 con dominios comprobados)", null, "PENDIENTE");
  R.fotos = await preguntar(rl, "3. Fotos y vídeos", ["De libre uso (Pexels, gratis)", "Creados con IA (te digo antes cuánto cuesta)", "Huecos para mis fotos reales"], "De libre uso (Pexels, gratis)");
  R.asistente = await preguntar(rl, "4. Nombre del asistente", null, "Andrés");
  R.genero = await preguntar(rl, "   ¿Hombre o mujer?", ["hombre", "mujer"], "hombre");
  const voces = VOCES.filter(v => v.genero === R.genero);
  const v = await preguntar(rl, "   Voz (las muestras están en fabrica/voces/<id>.mp3 y en la página de la fábrica)", voces.map(v => `${v.nombre} · ${v.descripcion}`), `${voces[0].nombre} · ${voces[0].descripcion}`);
  R.voz = (voces.find(x => v.startsWith(x.nombre)) || voces[0]).id;
  R.tono = await preguntar(rl, "   Tono", ["cercano, tranquilo y seguro", "profesional y sereno", "directo y resolutivo (urgencias)"], "cercano, tranquilo y seguro");
  R.precio = await preguntar(rl, "5. Precio de la visita o consulta (por ejemplo «Gratis», «39 €»)", null, "PENDIENTE");
  R.garantia = await preguntar(rl, "   Garantía", null, "PENDIENTE");
  R.zona = await preguntar(rl, "   Zona que cubrís", null, `${R.ciudad} y su área metropolitana`);
  R.telefono = await preguntar(rl, "   Teléfono", null, "PENDIENTE");
  R.horario = await preguntar(rl, "   Horario", null, "PENDIENTE");
  rl.close();
  return R;
}

// ---------------------------------------------------------------- web nueva (esqueleto que funciona desde el minuto uno)
const P = (v, nota) => (!v || v === "PENDIENTE") ? { v: "", c: `// PENDIENTE: ${nota}` } : { v, c: "" };
function crearWeb(R) {
  const id = op.id || slug(R.negocio + "-" + R.ciudad.split(/[ ,]/)[0]);
  const dir = join(RAIZ, id);
  if (existsSync(join(dir, "web.mjs")) && !op.forzar) throw new Error(`Ya existe la web «${id}». Usa --id=otro o --forzar.`);
  for (const d of ["", "media", "fuentes", "conocimiento", "estudio", "pruebas"]) mkdirSync(join(dir, d), { recursive: true });
  const cita = { "Visita a domicilio": ["visita", "la visita"], "Primera consulta": ["consulta", "la primera consulta"], "Cita en el local": ["cita", "la cita"], "Presupuesto o estudio": ["estudio", "el estudio"], "Venta": ["pedido", "el pedido"] }[R.cita] || ["visita", "la visita"];
  const voz = VOCES.find(v => v.id === R.voz) || VOCES[0];
  const marca = P(R.marca, "marca (proponer 3-5 nombres, comprobar dominios .es/.com y OEPM)");
  const precio = P(R.precio, "precio de " + cita[1]);
  const tel = P(R.telefono, "teléfono real");
  writeFileSync(join(dir, "asistente.json"), JSON.stringify({
    _leeme: `ÚNICO sitio donde se cambia el asistente de esta web. Para cambiarlo: node fabrica/crear.mjs asistente ${id}`,
    nombre: R.asistente || "Andrés", genero: R.genero || "hombre", tono: R.tono || "cercano, tranquilo y seguro",
    voz: { proveedor: "elevenlabs", id: voz.id, nombre: voz.nombre, modelo: "eleven_flash_v2_5", estabilidad: 0.35, parecido: 0.8, velocidad: 0.95 }
  }, null, 2) + "\n");
  writeFileSync(join(dir, "cerebro.mjs"), `// DATOS DEL NEGOCIO · ${R.negocio} (${R.ciudad}). Creado por la fábrica: lo marcado PENDIENTE se ve en la vista previa.
import { ASISTENTE } from "./asistente.mjs";   // nombre y voz del asistente: se cambian en asistente.json

export const NEGOCIO = {
  marca: ${JSON.stringify(marca.v || "Nombre provisional")},  ${marca.c}
  tecnico: ASISTENTE.nombre,
  tono: ASISTENTE.tono,
  sector: ${JSON.stringify(R.negocio)},
  publico: ${JSON.stringify(R.publico || "Particulares")},
  ciudad: ${JSON.stringify(R.ciudad)},
  provincia: ${JSON.stringify(R.ciudad)},
  comunidad: "Andalucía",                // PENDIENTE: comunidad autónoma si no es Andalucía
  zona: ${JSON.stringify(R.zona || R.ciudad)},
  telefono: ${JSON.stringify(tel.v || "958 00 00 00")},  ${tel.c}
  telefonoEnlace: ${JSON.stringify("+34" + (tel.v || "958000000").replace(/\D/g, ""))},
  whatsapp: "34600000000",               // PENDIENTE: WhatsApp real (sin + ni espacios)
  horario: ${JSON.stringify(R.horario && R.horario !== "PENDIENTE" ? R.horario : "de lunes a viernes de 9:00 a 14:00 y de 16:00 a 19:00")},  ${R.horario && R.horario !== "PENDIENTE" ? "" : "// PENDIENTE: horario"}
  cita: { tipo: ${JSON.stringify(cita[0])}, nombre: ${JSON.stringify(cita[1])}, precio: ${JSON.stringify(precio.v || "Gratis")}, detalle: "PENDIENTE: qué incluye" },  ${precio.c}
  garantia: ${JSON.stringify(R.garantia && R.garantia !== "PENDIENTE" ? R.garantia : "garantía por escrito")},  ${R.garantia && R.garantia !== "PENDIENTE" ? "" : "// PENDIENTE: garantía"}
  experiencia: "profesionales con experiencia en el sector",    // PENDIENTE: años reales
  experienciaCorta: "Profesionales del sector",                  // PENDIENTE: confirmar
  servicios: ["PENDIENTE: servicios"],   // PENDIENTE: lista de servicios
  fotos: ${JSON.stringify(R.fotos || "De libre uso")}
};
export const lista = xs => xs.length > 1 ? xs.slice(0, -1).join(", ") + " y " + xs.at(-1) : (xs[0] || "");
export function saludo(n = NEGOCIO) { return \`Hola, soy \${n.tecnico}, el asistente de \${n.marca}. Cuéntame qué necesitas y te ayudo.\`; }
`);
  // web.mjs y el resto: copia del esqueleto genérico de la fábrica (textos neutros con PENDIENTE)
  const esq = join(RAIZ, "fabrica", "plantilla", "nueva");
  for (const f of ["web.mjs", "instrucciones.mjs", "contenido.js", "estilo.css"]) writeFileSync(join(dir, f), readFileSync(join(esq, f), "utf8"));
  for (const f of ["public-sans.woff2"]) copyFileSync(join(esq, f), join(dir, "fuentes", f));
  writeFileSync(join(dir, "conocimiento", "resumen-para-andres.md"), "# Lo que sabes\n\nPENDIENTE: investigación del sector con fuentes (ver fabrica/NOTAS.md, «Cómo se hace una web»). Mientras tanto, no das ningún dato concreto: todo lo confirma el profesional.\n");
  writeFileSync(join(dir, "media", "CREDITOS.md"), `# Fotos\nElección: ${R.fotos}. PENDIENTE: fotos (Pexels con licencia comprobada, IA solo con OK de Juan, o huecos para las fotos reales).\n`);
  writeFileSync(join(dir, "encargo.json"), JSON.stringify({ ...R, id, creada: new Date().toISOString() }, null, 2));
  return id;
}

// ---------------------------------------------------------------- cambiar el asistente de una web existente
async function cambiarAsistente(web) {
  const dir = join(RAIZ, web), f = join(dir, "asistente.json");
  if (!existsSync(f)) throw new Error(`${web} no tiene asistente.json`);
  const A = JSON.parse(readFileSync(f, "utf8"));
  const antes = { nombre: A.nombre, voz: A.voz?.id };
  if (op.nombre) A.nombre = op.nombre;
  if (op.genero) A.genero = op.genero;
  if (op.tono) A.tono = op.tono;
  if (op.voz) {
    const v = VOCES.find(x => x.id === op.voz || x.nombre.toLowerCase() === String(op.voz).toLowerCase());
    if (!v) throw new Error(`No conozco la voz «${op.voz}». Mira: node fabrica/crear.mjs voces`);
    A.voz = { ...(A.voz || {}), proveedor: "elevenlabs", id: v.id, nombre: v.nombre };
    if (!op.genero) A.genero = v.genero;
  }
  writeFileSync(f, JSON.stringify(A, null, 2) + "\n");
  const { N } = await construir(web);
  // comprobación: el nombre y la voz nuevos tienen que estar en todas partes, y el viejo en ninguna
  const mirar = {
    "web publicada (index.html)": readFileSync(join(dir, "index.html"), "utf8"),
    "vista previa": readFileSync(join(dir, "vista-previa.html"), "utf8"),
    "agente de voz: instrucciones": existsSync(join(dir, "agente", "instrucciones.txt")) ? readFileSync(join(dir, "agente", "instrucciones.txt"), "utf8") : "",
    "agente de voz: saludo": existsSync(join(dir, "agente", "saludo.txt")) ? readFileSync(join(dir, "agente", "saludo.txt"), "utf8") : "",
    "agente de voz: voz (web.json)": existsSync(join(dir, "agente", "web.json")) ? readFileSync(join(dir, "agente", "web.json"), "utf8") : "",
    "cerebro (NEGOCIO.tecnico)": N.tecnico
  };
  if (existsSync(join(dir, "pruebas", "clientes.json"))) {
    execFileSync("node", [join(RAIZ, "fabrica", "pruebas", "preparar.mjs"), web, "_cambio"], { stdio: "ignore" });
    mirar["pruebas (lo que recibe el asistente)"] = readFileSync(join(dir, "pruebas", "_cambio", "cliente-01.txt"), "utf8");
  }
  const viejo = antes.nombre !== A.nombre ? new RegExp(`\\b${antes.nombre}\\b`) : null;
  let ok = true;
  console.log(`\nAsistente de ${web}: ${antes.nombre} → ${A.nombre} · voz ${antes.voz} → ${A.voz?.id} (${A.voz?.nombre})`);
  for (const [donde, t] of Object.entries(mirar)) {
    if (!t) continue;
    const tieneNuevo = t.includes(A.nombre), sigueViejo = viejo ? viejo.test(t.replace(/"_leeme"[^\n]*/g, "")) : false;
    const vozOk = donde.includes("web.json") ? t.includes(A.voz?.id) : true;
    const bien = tieneNuevo && !sigueViejo && vozOk;
    ok &&= bien;
    console.log(`  ${bien ? "✔" : "✘"} ${donde}${sigueViejo ? `: sigue apareciendo «${antes.nombre}»` : ""}${!tieneNuevo ? `: no aparece «${A.nombre}»` : ""}${!vozOk ? ": la voz no ha cambiado" : ""}`);
  }
  console.log(ok ? "Cambio aplicado en todas partes." : "Hay sitios sin cambiar: revisa los ✘.");
  if (A.audioMicro) console.log("Nota: el audio del aviso del micrófono estaba grabado con la voz anterior; hasta regrabarlo (con tu OK, cuesta créditos) lo dice la voz del navegador.");
  return ok;
}

// ---------------------------------------------------------------- órdenes
if (orden === "nueva") {
  const R = await respuestasNueva();
  const id = crearWeb(R);
  await construir(id);
  console.log(`\nWeb «${id}» creada en ${id}/ y construida. Siguiente (lo hace Claude):\n  1. Marca: 3-5 nombres con dominios .es/.com comprobados y OEPM.\n  2. Estudio de las 3-6 mejores webs del sector y dirección visual propia (web.mjs, estilo.css, fuentes/).\n  3. Fotos según lo elegido (${R.fotos}).\n  4. Cerebro con fuentes (conocimiento/), 20+ clientes simulados y prueba a ciegas.\n  5. node fabrica/crear.mjs comprobar ${id}  y vista previa privada.`);
} else if (orden === "asistente") {
  const web = libres[0]; if (!web) throw new Error("Uso: node fabrica/crear.mjs asistente <web> --nombre=… --voz=…");
  process.exitCode = (await cambiarAsistente(web)) ? 0 : 1;
} else if (orden === "voces") {
  for (const v of VOCES.filter(v => !libres[0] || v.genero === libres[0])) console.log(`${v.genero.padEnd(7)} ${v.nombre.padEnd(16)} ${v.id}  ${v.descripcion}\n${" ".repeat(25)}muestra: fabrica/voces/${v.id}.mp3`);
} else if (orden === "comprobar") {
  const web = libres[0]; await construir(web);
  execFileSync("node", [join(RAIZ, "fabrica", "probar-web.mjs"), web, ...(op.capturas ? [`--capturas=${op.capturas}`] : [])], { stdio: "inherit" });
} else if (orden === "lista") {
  for (const w of websDisponibles()) {
    const A = JSON.parse(readFileSync(join(RAIZ, w, "asistente.json"), "utf8"));
    console.log(`${w.padEnd(20)} asistente: ${A.nombre} (${A.voz?.nombre || "sin voz"}) · ${pendientes(join(RAIZ, w), A).length} pendientes`);
  }
} else {
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 19).map(l => l.replace(/^\/\/ ?/, "")).join("\n"));
}
