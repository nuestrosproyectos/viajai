// Genera instrucciones.txt, saludo.txt y conocimiento.json para el agente de voz a partir de
// ../cerebro.mjs, ../conocimiento.mjs y ../manual.mjs (así la web y el agente usan siempre lo mismo).
// Uso: node exportar-instrucciones.mjs
import { writeFileSync } from "node:fs";
import { NEGOCIO, instrucciones, saludo } from "../cerebro.mjs";
import { APARATOS, MARCAS, NUMEROS, LETRAS, CENTENAS, MARCA_APARATO } from "../manual.mjs";
import CONOCIMIENTO from "../conocimiento.mjs";

const aqui = new URL(".", import.meta.url);
writeFileSync(new URL("instrucciones.txt", aqui), instrucciones(NEGOCIO, { herramientas: true }));
writeFileSync(new URL("saludo.txt", aqui), saludo(NEGOCIO) + "\n");
writeFileSync(new URL("conocimiento.json", aqui), JSON.stringify({ diccionarios: { APARATOS, MARCAS, NUMEROS, LETRAS, CENTENAS, MARCA_APARATO }, conocimiento: CONOCIMIENTO }));
console.log("instrucciones.txt, saludo.txt y conocimiento.json actualizados");
