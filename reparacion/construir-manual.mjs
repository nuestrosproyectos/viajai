// Junta las fichas de conocimiento/*.json en conocimiento.mjs (el manual que usan la web,
// el servidor y, vía agente/exportar-instrucciones.mjs, el agente de voz).
// Valida cada ficha y descarta las que no tienen fuente o están incompletas.
// Uso: node construir-manual.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const APARATOS = new Set(["lavadora", "lavadora-secadora", "secadora", "lavavajillas", "horno", "placa", "frigorifico", "congelador", "campana", "microondas", "termo", "aire", "caldera"]);
const normal = t => String(t).toLowerCase().replace(/[^a-z0-9]+/g, "");
const dir = new URL("./conocimiento/", import.meta.url);
const familias = [], sintomas = [], peligro = [], avisos = [];
let compensa = "";

// Nombres que llegan de la investigación y se unifican con los del buscador
const APARATO_ALIAS = { calentador: "caldera", "calentador de gas": "caldera", congelador: "congelador" };
const MARCA_ALIAS = { "Baxi Roca": ["Baxi", "Roca"], "Corberó": ["Corbero"] };
const unificar = d => {
  if (d.marcas) d.marcas = [...new Set(d.marcas.flatMap(m => MARCA_ALIAS[m] || [m]))];
  for (const c of d.codigos || []) c.aparato = APARATO_ALIAS[c.aparato] || c.aparato;
  for (const x of d.sintomas || []) x.aparato = APARATO_ALIAS[x.aparato] || x.aparato;
  return d;
};

for (const nombre of readdirSync(dir).filter(f => f.endsWith(".json") && f !== "sinonimos.json").sort()) {
  const d = unificar(JSON.parse(readFileSync(new URL(nombre, dir), "utf8")));
  if (d.codigos) {
    const vistos = new Set();
    const codigos = d.codigos.filter(c => {
      const ok = APARATOS.has(c.aparato) && Array.isArray(c.codigos) && c.codigos.length && c.significado && /^https?:\/\//.test(c.fuente || "") && ["alta", "media"].includes(c.confianza);
      const k = c.aparato + "|" + c.codigos.map(x => x.toLowerCase()).sort().join(",") + "|" + normal(c.significado);
      if (!ok) { avisos.push(`${nombre}: descartada ${c.aparato} ${c.codigos} (incompleta o sin fuente)`); return false; }
      if (vistos.has(k)) { avisos.push(`${nombre}: repetida ${k}`); return false; }
      vistos.add(k); return true;
    }).map(({ aparato, codigos, significado, causas = [], que_puede_hacer_el_cliente = "", pieza_probable = "", fuente, confianza }) =>
      ({ aparato, codigos, significado, causas, que_puede_hacer_el_cliente, pieza_probable, fuente, confianza }));
    // Si la familia ya existe (otra ronda de investigación), se juntan sin repetir
    const previa = familias.find(f => f.familia === d.familia);
    if (previa) {
      const ya = new Set(previa.codigos.map(c => c.aparato + "|" + c.codigos.map(x => x.toLowerCase()).sort().join(",") + "|" + normal(c.significado)));
      const ya2 = new Set(previa.codigos.map(c => c.aparato + "|" + c.codigos.map(x => x.toLowerCase()).sort().join(",")));
      for (const c of codigos) {
        const k2 = c.aparato + "|" + c.codigos.map(x => x.toLowerCase()).sort().join(",");
        if (ya.has(k2 + "|" + normal(c.significado)) || ya2.has(k2)) { avisos.push(`${nombre}: ya estaba ${k2}`); continue; }
        previa.codigos.push(c);
      }
      previa.marcas = [...new Set([...previa.marcas, ...d.marcas])];
      if (d.notas) previa.notas = [previa.notas, d.notas].filter(Boolean).join(" ");
    } else familias.push({ familia: d.familia, marcas: d.marcas, notas: d.notas || "", codigos });
  }
  if (d.sintomas) {
    for (const s of d.sintomas) {
      if (!APARATOS.has(s.aparato) || !s.sintoma || !s.causas?.length || !s.fuentes?.length) { avisos.push(`${nombre}: síntoma descartado ${s.aparato} ${s.sintoma}`); continue; }
      sintomas.push({ aparato: s.aparato, sintoma: s.sintoma, palabras: s.palabras || [], causas: s.causas, que_puede_hacer_el_cliente: s.que_puede_hacer_el_cliente || "", pieza_probable: s.pieza_probable || "", urgencia: s.urgencia || "normal", fuentes: s.fuentes });
    }
    peligro.push(...(d.peligro || []));
    compensa = d.compensa_reparar || compensa;
  }
}

// Sinónimos coloquiales añadidos a mano (conocimiento/sinonimos.json)
const extra = JSON.parse(readFileSync(new URL("sinonimos.json", dir), "utf8")).sinonimos;
for (const x of extra) {
  const s = sintomas.find(s => s.aparato === x.aparato && s.sintoma === x.sintoma);
  if (s) s.palabras = [...new Set([...s.palabras, ...x.palabras])];
  else avisos.push(`sinonimos.json: no encuentro el síntoma «${x.sintoma}» (${x.aparato})`);
}

const base = { generado: new Date().toISOString().slice(0, 10), familias, sintomas, peligro, compensa_reparar: compensa };
writeFileSync(new URL("./conocimiento.mjs", import.meta.url),
  "// GENERADO por construir-manual.mjs a partir de conocimiento/*.json. No editar a mano.\n" +
  "export default " + JSON.stringify(base, null, 1) + ";\n");

const n = familias.reduce((a, f) => a + f.codigos.length, 0);
console.log(`Manual: ${familias.length} familias, ${n} fichas de código (${familias.reduce((a, f) => a + f.codigos.filter(c => c.confianza === "alta").length, 0)} de confianza alta), ${sintomas.length} síntomas.`);
for (const f of familias) console.log(`  ${f.familia} (${f.marcas.join(", ")}): ${f.codigos.length}`);
if (avisos.length) console.log("Avisos:\n  " + avisos.join("\n  "));
