#!/usr/bin/env node
// Resume una corrección a ciegas: node fabrica/pruebas/resumen.mjs <web>/pruebas/<ronda>/evaluacion.json [otra.json …]
import { readFileSync } from "node:fs";
const C = ["datos_correctos", "no_inventa", "aconseja", "propone_cita", "empatia", "sin_genero", "corta", "ficha_valida", "criterio_caso"];
for (const f of process.argv.slice(2)) {
  const E = JSON.parse(readFileSync(f, "utf8"));
  const falsos = E.filter(e => e.dato_falso === 1);
  const fila = C.map(c => { const v = E.filter(e => e[c] !== null && e[c] !== undefined); const ok = v.filter(e => e[c] === 1).length; return { c, ok, n: v.length, pct: v.length ? ok / v.length : 1 }; });
  const media = E.reduce((s, e) => s + (e.nota || 0), 0) / E.length;
  const pal = E.reduce((s, e) => s + (e.palabras || 0), 0) / E.length;
  console.log(`\n${f}\n  Datos falsos: ${falsos.length} de ${E.length}${falsos.length ? " → clientes " + falsos.map(e => e.id).join(", ") : ""}`);
  for (const r of fila) console.log(`  ${r.c.padEnd(16)} ${r.ok}/${r.n}  ${(r.pct * 10).toFixed(1)} de 10${r.pct < 0.9 ? "  ← por debajo de 9" : ""}`);
  console.log(`  Nota media del dueño: ${media.toFixed(2)} · palabras de media: ${pal.toFixed(1)}`);
  const fallos = E.filter(e => e.dato_falso === 1 || C.some(c => e[c] === 0));
  if (fallos.length) console.log("  Fallos:\n" + fallos.map(e => `   - ${e.id}: ${C.filter(c => e[c] === 0).concat(e.dato_falso === 1 ? ["DATO FALSO"] : []).join(", ")} · ${e.comentario || ""}`).join("\n"));
}
