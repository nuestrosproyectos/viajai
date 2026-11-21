// Genera instrucciones.txt y saludo.txt para el agente de voz a partir de ../cerebro.mjs
// (así la web y el agente usan siempre las mismas instrucciones).
// Uso: node exportar-instrucciones.mjs
import { writeFileSync } from "node:fs";
import { NEGOCIO, instrucciones, saludo } from "../cerebro.mjs";

const aqui = new URL(".", import.meta.url);
writeFileSync(new URL("instrucciones.txt", aqui), instrucciones(NEGOCIO, { herramientas: true }));
writeFileSync(new URL("saludo.txt", aqui), saludo(NEGOCIO) + "\n");
console.log("instrucciones.txt y saludo.txt actualizados");
