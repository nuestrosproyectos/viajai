#!/usr/bin/env node
// =====================================================================
//  PRUEBAS DE CONVERSACIONES COMPLETAS (varios turnos)
//  Un cliente simulado (con su historia y sus datos, que el asistente no ve) habla por turnos con el
//  asistente (Claude Haiku, con exactamente lo que recibiría en la web) hasta pedir la cita o irse.
//  Después se corrige la conversación entera a ciegas (fabrica/pruebas/hoja-conversaciones.md).
//
//    node fabrica/pruebas/conversar.mjs preparar <web> <ronda>   → <web>/pruebas/<ronda>/conv-XX/turno.txt
//    (responde el asistente: escribe respuesta.txt en cada conv-XX que tenga turno.txt)
//    node fabrica/pruebas/conversar.mjs asistente <web> <ronda>  → recoge respuesta.txt y escribe para-cliente.txt
//    (responde el cliente simulado: escribe cliente.txt, o FIN si se va o ya está todo)
//    node fabrica/pruebas/conversar.mjs cliente <web> <ronda>    → recoge cliente.txt y escribe el turno.txt siguiente
//    node fabrica/pruebas/conversar.mjs cerrar <web> <ronda>     → conversacion.txt de cada una, para corregir
//  Los escenarios están en <web>/pruebas/conversaciones.json.
// =====================================================================
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { construir, RAIZ } from "../construir.mjs";

const MAX_TURNOS = 6;   // respuestas del asistente como mucho
const [orden, web, ronda] = process.argv.slice(2);
const dir = join(RAIZ, web, "pruebas", ronda);
const { NEGOCIO, saludo } = await import(pathToFileURL(join(RAIZ, web, "cerebro.mjs")).href + "?v=" + Date.now());
const { instrucciones } = await import(pathToFileURL(join(RAIZ, web, "instrucciones.mjs")).href + "?v=" + Date.now());
const escenarios = JSON.parse(readFileSync(join(RAIZ, web, "pruebas", "conversaciones.json"), "utf8")).conversaciones;
const NOMBRE = NEGOCIO.tecnico.toUpperCase();
const carpeta = e => join(dir, "conv-" + String(e.id).padStart(2, "0"));
const leerH = e => JSON.parse(readFileSync(join(carpeta(e), "historial.json"), "utf8"));
const guardarH = (e, h) => writeFileSync(join(carpeta(e), "historial.json"), JSON.stringify(h, null, 1));
// lo que se dice en voz alta (sin etiquetas), como lo ve y lo oye el cliente
const visible = t => { const i = t.search(/<(ficha|aviso|mostrar)/); return (i >= 0 ? t.slice(0, i) : t).trim(); };

function escribirTurno(e, h) {
  const m = [{ role: "assistant", content: saludo(NEGOCIO) }, ...h.map(({ role, content }) => ({ role, content }))];
  writeFileSync(join(carpeta(e), "turno.txt"), `=== INSTRUCCIONES (sistema) ===\n${instrucciones(NEGOCIO)}\n\n` +
    m.map(x => `=== ${x.role === "user" ? "CLIENTE" : NOMBRE} ===\n${x.content}`).join("\n\n") + `\n\n=== ${NOMBRE} (tu respuesta) ===\n`);
}

if (orden === "preparar") {
  await construir(web, { silencioso: true });
  mkdirSync(dir, { recursive: true });
  for (const e of escenarios) {
    mkdirSync(carpeta(e), { recursive: true });
    const h = [{ role: "user", content: e.apertura }];
    guardarH(e, h); escribirTurno(e, h);
    writeFileSync(join(carpeta(e), "persona.txt"), e.persona);
  }
  writeFileSync(join(dir, "criterios.json"), JSON.stringify(escenarios.map(e => ({ id: e.id, nivel: e.nivel, persona: e.persona, criterio: e.criterio })), null, 1));
  console.log(`${escenarios.length} conversaciones preparadas en ${web}/pruebas/${ronda}/`);
}

if (orden === "asistente") {
  let n = 0;
  for (const e of escenarios) {
    const c = carpeta(e), r = join(c, "respuesta.txt");
    if (!existsSync(r)) continue;
    const t = readFileSync(r, "utf8").trim();
    const h = leerH(e);
    // como en la web: el aviso ya enviado queda marcado y no se repite
    h.push({ role: "assistant", content: t.replace(/<aviso>[\s\S]*?<\/aviso>/, "<aviso>(registrado)</aviso>"), original: t });
    guardarH(e, h); rmSync(r); rmSync(join(c, "turno.txt"), { force: true }); n++;
    const respuestas = h.filter(x => x.role === "assistant").length;
    if (respuestas >= MAX_TURNOS) { writeFileSync(join(c, "fin.txt"), "máximo de turnos"); continue; }
    const charla = h.map(x => `${x.role === "user" ? "TÚ (cliente)" : NEGOCIO.tecnico + " (asistente de la web)"}: ${x.role === "user" ? x.content : visible(x.content)}`).join("\n\n");
    const aviso = /<aviso>/.test(t) ? `\n\n[En la pantalla aparece ahora: «¡Listo! Solicitud enviada. Te llamamos para confirmar».]` : "";
    writeFileSync(join(c, "para-cliente.txt"), `=== QUIÉN ERES (solo lo sabes tú) ===\n${e.persona}\n\n=== LA CONVERSACIÓN HASTA AHORA (en la web de ${NEGOCIO.marca}) ===\n${charla}${aviso}\n\n=== TU SIGUIENTE MENSAJE ===\n`);
  }
  console.log(`${n} respuestas del asistente recogidas`);
}

if (orden === "cliente") {
  let n = 0, fin = 0;
  for (const e of escenarios) {
    const c = carpeta(e), r = join(c, "cliente.txt");
    if (!existsSync(r)) continue;
    const t = readFileSync(r, "utf8").trim();
    rmSync(r); rmSync(join(c, "para-cliente.txt"), { force: true });
    if (/^FIN\b/i.test(t)) { writeFileSync(join(c, "fin.txt"), "el cliente termina"); fin++; continue; }
    const h = leerH(e); h.push({ role: "user", content: t }); guardarH(e, h); escribirTurno(e, h); n++;
  }
  console.log(`${n} mensajes de cliente recogidos · ${fin} conversaciones terminadas`);
}

if (orden === "estado") {
  for (const e of escenarios) {
    const c = carpeta(e), h = existsSync(join(c, "historial.json")) ? leerH(e) : [];
    const est = existsSync(join(c, "fin.txt")) ? "terminada" : existsSync(join(c, "turno.txt")) ? "le toca al asistente" : existsSync(join(c, "para-cliente.txt")) ? "le toca al cliente" : "?";
    console.log(`conv-${String(e.id).padStart(2, "0")}: ${h.length} mensajes · ${est}`);
  }
}

if (orden === "cerrar") {
  for (const e of escenarios) {
    const c = carpeta(e), h = leerH(e);
    writeFileSync(join(c, "conversacion.txt"), [`${NEGOCIO.tecnico.toUpperCase()}: ${saludo(NEGOCIO)}`, ...h.map(x => `${x.role === "user" ? "CLIENTE" : NOMBRE}: ${x.original || x.content}`)].join("\n\n") + "\n");
  }
  console.log("conversacion.txt escritas");
}
