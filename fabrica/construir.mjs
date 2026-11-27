#!/usr/bin/env node
// =====================================================================
//  CONSTRUIR una o todas las webs de la fábrica a partir de la plantilla común.
//    node fabrica/construir.mjs herencias          → una web
//    node fabrica/construir.mjs --todas            → todas las que tienen web.mjs
//  Genera en la carpeta de la web:
//    asistente.mjs         (desde asistente.json: nombre y voz del asistente)
//    index.html            (web publicada)
//    vista-previa.html     (vista privada en claude.ai: sin doctype/html/head/body)
//    agente/instrucciones.txt, agente/saludo.txt, agente/web.json  (para el agente de voz)
//  Y avisa de lo que sigue PENDIENTE (se ve también en la franja de la vista previa).
// =====================================================================
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { pagina } from "./plantilla/pagina.mjs";
import { avisoLegal, privacidad } from "./plantilla/legal.mjs";

const FABRICA = dirname(fileURLToPath(import.meta.url));
export const RAIZ = resolve(FABRICA, "..");
const PL = join(FABRICA, "plantilla");

export function websDisponibles() {
  return readdirSync(RAIZ, { withFileTypes: true }).filter(d => d.isDirectory() && existsSync(join(RAIZ, d.name, "web.mjs"))).map(d => d.name);
}

/** asistente.json → asistente.mjs (lo importa cerebro.mjs; el navegador no puede importar JSON en móviles antiguos) */
export function escribirAsistente(dir) {
  const A = JSON.parse(readFileSync(join(dir, "asistente.json"), "utf8"));
  if (!A.nombre) throw new Error("asistente.json sin nombre");
  const publico = { nombre: A.nombre, genero: A.genero || "hombre", tono: A.tono || "", voz: A.voz || {} };
  writeFileSync(join(dir, "asistente.mjs"), `// GENERADO desde asistente.json por fabrica/construir.mjs: no editar aquí.\nexport const ASISTENTE = ${JSON.stringify(publico, null, 2)};\n`);
  return A;
}

/** Lo que sigue pendiente en cerebro.mjs (comentarios «PENDIENTE: …») y en asistente.json */
export function pendientes(dir, A) {
  const lista = [];
  for (const f of ["cerebro.mjs", "web.mjs", "contenido.js"]) {
    if (!existsSync(join(dir, f))) continue;
    for (const l of readFileSync(join(dir, f), "utf8").split("\n")) {
      const m = l.match(/PENDIENTE:?\s*(.+?)\s*(\*\/)?$/);
      if (m && !/^\s*\/\/\s*>>>/.test(l) && !/marcado con PENDIENTE/.test(l)) lista.push(m[1].replace(/^[-–:]\s*/, ""));
    }
  }
  if (!A.voz?.id || A.voz.id === "PENDIENTE") lista.push(`voz de ${A.nombre}: elegir y copiar su identificador en asistente.json`);
  if (A.audioMicro && (A.audioMicro.voz !== A.voz?.id || A.audioMicro.nombre !== A.nombre)) lista.push(`audio del aviso del micrófono: volver a grabarlo con la voz nueva (mientras, lo dice la voz del navegador)`);
  return [...new Set(lista)];
}

export async function construir(nombre, { silencioso = false } = {}) {
  const dir = join(RAIZ, nombre);
  if (!existsSync(join(dir, "web.mjs"))) throw new Error(`${nombre}: no tiene web.mjs`);
  const A = escribirAsistente(dir);
  // copia del cerebro común junto a la web (la vista previa y el servidor no pueden subir de carpeta)
  writeFileSync(join(dir, "base-instrucciones.mjs"), "// GENERADO: copia de fabrica/plantilla/instrucciones-base.mjs (no editar aquí).\n" + readFileSync(join(PL, "instrucciones-base.mjs"), "utf8"));
  // conocimiento compacto del asistente (conocimiento/resumen-para-andres.md) → saber.mjs, para que lo lean
  // igual la vista previa (navegador), el servidor y el agente de voz. Las fuentes siguen en el archivo grande.
  const resumen = join(dir, "conocimiento", "resumen-para-andres.md");
  if (existsSync(resumen)) {
    const texto = readFileSync(resumen, "utf8").replace(/^# .*\n+/, "").replace(/^## /gm, "## ").trim();
    writeFileSync(join(dir, "saber.mjs"), `// GENERADO desde conocimiento/resumen-para-andres.md por fabrica/construir.mjs: no editar aquí.\nexport const SABER = ${JSON.stringify(texto)};\n`);
  }
  const v = "?v=" + Date.now();   // para que Node vuelva a leer los módulos si se construye dos veces
  const { NEGOCIO: N, saludo } = await import(pathToFileURL(join(dir, "cerebro.mjs")).href + v);
  const W = (await import(pathToFileURL(join(dir, "web.mjs")).href + v)).default(N);
  const css = readFileSync(join(PL, "nucleo.css"), "utf8") + "\n" + readFileSync(join(PL, "piel.css"), "utf8");
  const js = readFileSync(join(PL, "nucleo.js"), "utf8");
  const pend = pendientes(dir, A);
  if (pend.length) {
    const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    // en la misma línea de la franja (no empuja la portada): al tocarla se despliega la lista encima
    W.textos.previa = `<details class="previa-pend"><summary>Vista previa · <u>${pend.length} datos pendientes</u> <small>(toca para verlos)</small></summary><ul>${pend.map(p => `<li>${esc(p)}</li>`).join("")}</ul></details>`;
  }
  const comun = { W, N, A, css, js };
  writeFileSync(join(dir, "index.html"), pagina(comun));
  writeFileSync(join(dir, "vista-previa.html"), pagina({ ...comun, previa: true }));
  if (W.legal) { writeFileSync(join(dir, "aviso-legal.html"), avisoLegal(N, W)); writeFileSync(join(dir, "privacidad.html"), privacidad(N, W)); }

  // agente de voz: instrucciones con herramientas, saludo y datos de la web (campos, voz, destinos)
  if (existsSync(join(dir, "instrucciones.mjs"))) {
    const { instrucciones } = await import(pathToFileURL(join(dir, "instrucciones.mjs")).href + v);
    mkdirSync(join(dir, "agente"), { recursive: true });
    writeFileSync(join(dir, "agente", "instrucciones.txt"), instrucciones(N, { herramientas: true }));
    writeFileSync(join(dir, "agente", "saludo.txt"), saludo(N) + "\n");
    writeFileSync(join(dir, "agente", "web.json"), JSON.stringify({
      web: nombre, marca: N.marca, sector: W.sectorAgente || N.sector, asistente: A,
      campos: W.campos.map(c => ({ id: c.id, etiqueta: c.etiqueta, pista: c.pista || "" })),
      tipos: [W.tipoPrincipal, "llamada", ...(W.tiposExtra || [])], urgente: W.urgenteAgente || "",
      destinos: Object.keys(W.destinos)
    }, null, 2));
  }
  if (!silencioso) {
    console.log(`✔ ${nombre}: index.html, vista-previa.html${existsSync(join(dir, "instrucciones.mjs")) ? " y agente/" : ""} generados (asistente: ${A.nombre}).`);
    if (pend.length) console.log(`  Pendiente (${pend.length}):\n   - ` + pend.join("\n   - "));
  }
  return { dir, N, W, A, pend };
}

// Uso desde la línea de órdenes
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const webs = args.includes("--todas") || !args.length ? websDisponibles() : args;
  for (const w of webs) await construir(w);
}
