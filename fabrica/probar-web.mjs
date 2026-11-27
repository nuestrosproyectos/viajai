#!/usr/bin/env node
// =====================================================================
//  PRUEBA DE UNA WEB DE LA FÁBRICA EN NAVEGADOR (Playwright, sin gastar nada)
//    node fabrica/probar-web.mjs herencias [--carpeta=otra/ruta] [--capturas=dir]
//  Comprueba en iPhone, Android y ordenador:
//   - sin errores en la consola ni nada que se salga de la pantalla
//   - el botón «Hablar con <asistente>» se ve al abrir en el móvil
//   - una conversación simulada: el asistente responde (respuesta de prueba, no la IA),
//     la solicitud se rellena sola, la lista de lo que hay que preparar se ajusta
//     y al confirmar sale la tarjeta «¡Listo!» con su número de aviso.
//  Guarda capturas en la carpeta indicada.
// =====================================================================
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, devices } = require("playwright");

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith("--")).map(a => { const [k, v] = a.slice(2).split("="); return [k, v ?? true]; }));
const web = process.argv.slice(2).find(a => !a.startsWith("--"));
const carpeta = resolve(args.carpeta || join(RAIZ, web));
const capturas = args.capturas ? resolve(args.capturas) : null;
if (capturas) mkdirSync(capturas, { recursive: true });

const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".json": "application/json", ".svg": "image/svg+xml" };
const servidor = createServer((req, res) => {
  let ruta = decodeURIComponent(req.url.split("?")[0]); if (ruta === "/") ruta = "/index.html";
  const f = join(carpeta, ruta);
  if (!f.startsWith(carpeta) || !existsSync(f) || statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TIPOS[extname(f)] || "application/octet-stream" }); res.end(readFileSync(f));
}).listen(0);
const URL0 = `http://127.0.0.1:${servidor.address().port}/`;

// Respuestas de prueba (no es la IA: comprueban que la web pinta lo que el asistente devuelve)
const guion = JSON.parse(args.guion ? readFileSync(args.guion, "utf8") : "null");

const fallos = [], avisos = [];
const navegador = await chromium.launch();
const equipos = [
  ["iphone", devices["iPhone 13"]],
  ["android", devices["Pixel 7"]],
  ["ordenador", { viewport: { width: 1366, height: 820 }, deviceScaleFactor: 1 }]
];
for (const [nombre, eq] of equipos) {
  const ctx = await navegador.newContext({ ...eq, locale: "es-ES" });
  const pag = await ctx.newPage();
  const errores = [];
  pag.on("pageerror", e => errores.push(e.message));
  pag.on("console", m => { if (m.type() === "error" && !/favicon|404|net::ERR/.test(m.text())) errores.push(m.text()); });
  // simula la plataforma de la vista previa: IA con respuestas de prueba, base de datos y dueño
  await pag.addInitScript((guion) => {
    let n = 0; const guardado = [];
    window.__guardado = guardado;
    window.claude = { use: async (cap) => {
      if (cap === "sample") return async (conv, op) => {
        const r = (window.__guion || guion || [])[n++] || 'Vale. <ficha>{"fase":"entendiendo"}</ficha>';
        op?.onText?.({ text: r, delta: r }); return { text: r };
      };
      if (cap === "db") return { collection: () => ({ add: async d => { guardado.push(d); return { id: "x" }; }, orderBy: () => ({ limit: () => ({ onSnapshot: () => () => {} }) }) }) };
      if (cap === "user") return { isOwner: async () => true };
      if (cap === "tts") return { add: async () => {}, stop: async () => {}, onState: () => {} };
      throw { code: "not_declared" };
    } };
  }, guion);
  await pag.goto(URL0, { waitUntil: "networkidle" });
  await pag.waitForTimeout(2800);   // animaciones de entrada

  // 1. nada se sale de la pantalla
  const ancho = await pag.evaluate(() => ({ doc: document.documentElement.scrollWidth, vista: innerWidth,
    culpables: [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width && r.right > innerWidth + 1 && getComputedStyle(e).position !== "fixed" && !e.closest(".gira,.conv,.escenario,[hidden]"); }).slice(0, 5).map(e => e.tagName + "." + e.className) }));
  if (ancho.doc > ancho.vista + 1) fallos.push(`${nombre}: la página es más ancha que la pantalla (${ancho.doc} > ${ancho.vista}): ${ancho.culpables.join(", ")}`);
  // 2. «Hablar con …» visible al abrir (móvil)
  const hablar = await pag.evaluate(() => {
    const b = [...document.querySelectorAll("[data-hablar][data-voz]")].find(b => { const r = b.getBoundingClientRect(); return r.width > 0 && r.top >= 0 && r.bottom <= innerHeight && getComputedStyle(b).visibility !== "hidden"; });
    return b ? b.textContent.trim().replace(/\s+/g, " ") : null;
  });
  if (!hablar) fallos.push(`${nombre}: el botón de hablar con el asistente no se ve al abrir la página`);
  if (capturas) await pag.screenshot({ path: join(capturas, `${web}-${nombre}-portada.png`) });
  if (capturas) {   // recorre la página para que carguen las fotos diferidas y las secciones que aparecen al bajar
    await pag.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
    await pag.waitForTimeout(900);
    await pag.screenshot({ path: join(capturas, `${web}-${nombre}-entera.png`), fullPage: true });
  }

  // 3. conversación simulada (si hay guion): escribe, recibe, se rellena la solicitud y se envía
  if (guion) {
    await pag.evaluate(() => document.querySelector(".tarjeta-andres [data-hablar]:not([data-voz])").click());
    await pag.waitForTimeout(300);
    for (const frase of args.frases ? JSON.parse(readFileSync(args.frases, "utf8")) : ["Hola", "Vale", "Sí, perfecto"]) {
      await pag.fill("#txt", frase); await pag.press("#txt", "Enter"); await pag.waitForTimeout(500);
    }
    const r = await pag.evaluate(() => ({
      burbujas: document.querySelectorAll(".burbuja.tec").length,
      campos: [...document.querySelectorAll(".sol-campos input")].filter(i => i.value).map(i => i.id + "=" + i.value),
      docs: [...document.querySelectorAll("#listaDocs li b")].map(b => b.textContent),
      tarjeta: document.querySelector(".tarjeta-aviso")?.textContent.replace(/\s+/g, " ").trim() || "",
      guardados: window.__guardado.length,
      chatAncho: document.querySelector("#conv").scrollWidth - document.querySelector("#conv").clientWidth
    }));
    if (!r.tarjeta) fallos.push(`${nombre}: no ha salido la tarjeta final al registrar la solicitud`);
    if (!r.guardados) fallos.push(`${nombre}: la solicitud no se ha guardado`);
    if (r.chatAncho > 1) fallos.push(`${nombre}: la conversación se sale de lado (${r.chatAncho}px)`);
    avisos.push(`${nombre}: ${r.campos.length} campos rellenos (${r.campos.join("; ")}) · ${r.docs.length} cosas que preparar · tarjeta: «${r.tarjeta.slice(0, 90)}…»`);
    if (capturas) await pag.screenshot({ path: join(capturas, `${web}-${nombre}-conversacion.png`) });
  }
  if (errores.length) fallos.push(`${nombre}: errores en la consola: ${[...new Set(errores)].join(" | ")}`);
  avisos.push(`${nombre}: botón visible al abrir: «${hablar}» · ancho ${ancho.doc}/${ancho.vista}`);
  await ctx.close();
}
await navegador.close(); servidor.close();
console.log(avisos.map(a => "  · " + a).join("\n"));
if (fallos.length) { console.log(`✘ ${web}: ${fallos.length} fallos\n` + fallos.map(f => "  - " + f).join("\n")); process.exit(1); }
console.log(`✔ ${web}: sin fallos en iPhone, Android y ordenador`);
