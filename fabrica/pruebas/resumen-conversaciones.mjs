#!/usr/bin/env node
// Resume la corrección de conversaciones completas: node fabrica/pruebas/resumen-conversaciones.mjs <ronda> [web …]
import { existsSync, readFileSync } from "node:fs";
const [ronda, ...webs] = process.argv.slice(2);
const W = webs.length ? webs : ["reformas", "placas-solares", "fontaneria", "accidentes-trafico"];
const C = ["completa", "cita", "datos_bien", "aviso_valido", "coherente", "empatia", "sin_genero", "corta", "fichas_validas", "criterio_conversacion"];
const todo = [];
for (const w of W) { const f = `${w}/pruebas/${ronda}/evaluacion.json`; if (existsSync(f)) todo.push(...JSON.parse(readFileSync(f, "utf8")).map(e => ({ ...e, web: w }))); }
const media = k => todo.reduce((s, e) => s + (e[k] || 0), 0) / todo.length;
console.log(`${ronda}: ${todo.length} conversaciones · acaban en cita ${todo.filter(e => e.acaba_en_cita === 1).length} · datos falsos ${todo.filter(e => e.dato_falso === 1).length} · nota media ${media("nota").toFixed(2)} · respuestas de media ${media("turnos").toFixed(1)}`);
for (const c of C) { const v = todo.filter(e => e[c] !== null && e[c] !== undefined); const ok = v.filter(e => e[c] === 1).length; console.log(`  ${c.padEnd(22)} ${ok}/${v.length}  ${(v.length ? ok / v.length * 10 : 10).toFixed(1)} de 10`); }
for (const w of W) { const E = todo.filter(e => e.web === w); if (E.length) console.log(`  ${w}: nota ${(E.reduce((s, e) => s + e.nota, 0) / E.length).toFixed(2)}`); }
