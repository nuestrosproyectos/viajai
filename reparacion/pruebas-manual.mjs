// Pruebas del manual técnico: comprueba que la web (manual.mjs) y el agente de voz
// (agente/manual.py) encuentran las mismas fichas para las mismas frases.
// Uso: node pruebas-manual.mjs   (antes: node construir-manual.mjs y node agente/exportar-instrucciones.mjs)
import { execFileSync } from "node:child_process";
import { preparar, buscar } from "./manual.mjs";
import CONOCIMIENTO from "./conocimiento.mjs";

const FRASES = [
  "Mi lavavajillas Balay pone E quince", "tengo una lavadora bosch y sale e-18", "la lavadora LG marca OE",
  "la lavadora lg pone o e", "lavadora samsung sale un cuatro c", "indesit lavadora parpadea f cero cinco",
  "indesit lavadora error efe cinco", "lavavajillas aeg i veinte", "lavadora de 5 años que no escurre, la tengo a las 10",
  "tiene 10 años la lavadora", "el frigo no enfría abajo", "mi lavadora pone E15", "lavadora pone F05",
  "la caldera vaillant marca F veintiocho", "caldera baxi error E ciento treinta y tres", "el calentador ariston pone quinientos uno",
  "el aire daikin parpadea U cuatro", "el split no enfría y gotea agua", "la secadora de bomba de calor no seca",
  "la placa teka pone E 4", "mi nevera samsung hace mucho ruido", "el horno no calienta", "la vitro no enciende",
  "el lavavajillas no desagua", "el termo no calienta el agua", "la campana no tira",
  "mi lavadora Bosch no centrifuga, deja la ropa empapada", "tengo una lavadora Indesit de 13 años que no abre la puerta, ¿compensa arreglarla?",
  "el frigorífico Samsung no enfría abajo y el congelador sí", "la caldera Baxi pierde presión cada semana", "el aire LG no enfría y la máquina de fuera no arranca",
  "el horno Balay no calienta pero tiene luz", "la secadora Hisense de bomba de calor hace ruido", "el lavavajillas Siemens deja los vasos blancos"
];

const m = preparar(CONOCIMIENTO);
const js = FRASES.map(f => { const r = buscar(m, [{ role: "user", content: f }]); return { marca: r.marca, aparato: r.aparato, fichas: r.fichas.map(x => x.tipo === "codigo" ? x.familia + ":" + x.codigos.join("/") : x.tipo === "oficio" ? "Oficio:" + x.sintoma : x.tipo === "marca" ? "Marca:" + x.averia.slice(0, 30) : x.tipo === "vida" ? "Vida:" + x.aparato : "S:" + x.sintoma) }; });

const py = JSON.parse(execFileSync("python3", ["-c", `
import json, sys
sys.path.insert(0, "agente")
from manual import Manual
m = Manual("agente/conocimiento.json")
out = []
for f in json.loads(sys.argv[1]):
    r = m.buscar([{"role": "user", "content": f}])
    out.append({"marca": r["marca"], "aparato": r["aparato"], "fichas": [x["familia"] + ":" + "/".join(x["codigos"]) if x["tipo"] == "codigo" else "Oficio:" + x["sintoma"] if x["tipo"] == "oficio" else "Marca:" + x["averia"][:30] if x["tipo"] == "marca" else "Vida:" + x["aparato"] if x["tipo"] == "vida" else "S:" + x["sintoma"] for x in r["fichas"]]})
print(json.dumps(out, ensure_ascii=False))
`, JSON.stringify(FRASES)], { cwd: new URL(".", import.meta.url), encoding: "utf8" }));

let fallos = 0;
FRASES.forEach((f, i) => {
  const igual = JSON.stringify(js[i]) === JSON.stringify(py[i]);
  if (!igual) fallos++;
  console.log(`${igual ? "✓" : "✗ DISTINTO"} «${f}» → ${js[i].marca || "-"} · ${js[i].aparato || "-"} · ${js[i].fichas.join(" | ") || "(sin ficha)"}`);
  if (!igual) console.log("    Python:", JSON.stringify(py[i]));
});
console.log(fallos ? `\n${fallos} frases dan resultados distintos entre web y agente.` : "\nWeb y agente de voz dan exactamente lo mismo en todas las frases.");
process.exit(fallos ? 1 : 0);
