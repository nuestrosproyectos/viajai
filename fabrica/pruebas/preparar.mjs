#!/usr/bin/env node
// Escribe, para cada cliente simulado de una web, exactamente lo que recibiría el asistente en producción
// (instrucciones + saludo + conversación). Uso: node fabrica/pruebas/preparar.mjs <web> <ronda>
//   → <web>/pruebas/<ronda>/cliente-XX.txt   (y criterios aparte, que NO ve quien responde)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { construir, RAIZ } from "../construir.mjs";

const [web, ronda = "r1"] = process.argv.slice(2);
await construir(web, { silencioso: true });   // siempre con lo último (asistente.json incluido)
const dir = join(RAIZ, web);
const { NEGOCIO, saludo } = await import(pathToFileURL(join(dir, "cerebro.mjs")).href + "?v=" + Date.now());
const { instrucciones } = await import(pathToFileURL(join(dir, "instrucciones.mjs")).href + "?v=" + Date.now());
const { clientes } = JSON.parse(readFileSync(join(dir, "pruebas", "clientes.json"), "utf8"));
const sal = join(dir, "pruebas", ronda); mkdirSync(sal, { recursive: true });
const sistema = instrucciones(NEGOCIO);
for (const c of clientes) {
  const m = [{ role: "assistant", content: saludo(NEGOCIO) }, ...c.turnos];
  const id = String(c.id).padStart(2, "0");
  writeFileSync(join(sal, `cliente-${id}.txt`), `=== INSTRUCCIONES (sistema) ===\n${sistema}\n\n` + m.map(x => `=== ${x.role === "user" ? "CLIENTE" : NEGOCIO.tecnico.toUpperCase()} ===\n${x.content}`).join("\n\n") + `\n\n=== ${NEGOCIO.tecnico.toUpperCase()} (tu respuesta) ===\n`);
}
writeFileSync(join(sal, "criterios.json"), JSON.stringify(clientes.map(c => ({ id: c.id, nivel: c.nivel, ultimo: c.turnos.at(-1).content, criterio: c.criterio })), null, 1));
console.log(`${clientes.length} conversaciones en ${web}/pruebas/${ronda}/ (asistente: ${NEGOCIO.tecnico})`);
