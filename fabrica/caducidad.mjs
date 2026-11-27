#!/usr/bin/env node
// Junta los datos que caducan de todas las webs (conocimiento/caducidad.md) en una lista por fecha de revisión.
//   node fabrica/caducidad.mjs            → escribe fabrica/CADUCIDAD.md y avisa de lo que vence en 45 días
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { RAIZ } from "./construir.mjs";
const hoy = new Date(process.argv[2] || Date.now());
const filas = [];
for (const w of readdirSync(RAIZ)) {
  const f = join(RAIZ, w, "conocimiento", "caducidad.md"); if (!existsSync(f)) continue;
  for (const l of readFileSync(f, "utf8").split("\n")) {
    if (!l.startsWith("|") || /^\|\s*-|^\|\s*Dato/.test(l)) continue;
    const c = l.split("|").slice(1, -1).map(x => x.trim());
    const rev = c.at(-1); const m = rev.match(/(\d{2})-(\d{2})-(\d{4})/);
    const fecha = m ? new Date(`${m[3]}-${m[2]}-${m[1]}`) : null;
    filas.push({ web: w, dato: c[0].replace(/\*\*/g, ""), valor: c[1], revision: rev.replace(/\*\*/g, ""), fecha });
  }
}
filas.sort((a, b) => (a.fecha || Infinity) - (b.fecha || Infinity));
const pronto = filas.filter(f => f.fecha && (f.fecha - hoy) / 864e5 <= 45);
const md = `# Datos que caducan en todas las webs\n\nGenerado con \`node fabrica/caducidad.mjs\` el ${hoy.toLocaleDateString("es-ES")}. ${filas.length} datos; ${pronto.length} vencen en los próximos 45 días. Fuentes y detalle en \`<web>/conocimiento/caducidad.md\`.\n\n| Revisar | Web | Dato | Valor que usa el asistente |\n|---|---|---|---|\n` +
  filas.map(f => `| ${f.revision} | ${f.web} | ${f.dato} | ${f.valor} |`).join("\n") + "\n";
writeFileSync(join(RAIZ, "fabrica", "CADUCIDAD.md"), md);
console.log(`${filas.length} datos con fecha de revisión en ${new Set(filas.map(f => f.web)).size} webs; vencen en 45 días: ${pronto.length}`);
for (const f of pronto) console.log(`  ${f.revision.slice(0, 10)}  ${f.web}: ${f.dato}`);
