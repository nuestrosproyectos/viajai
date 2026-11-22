// Prepara la prueba de los 20 clientes: para cada uno escribe exactamente lo que recibiría
// Andrés en la web (instrucciones + saludo + conversación con las fichas del manual).
// Uso: node pruebas/preparar.mjs <fase>   (fase = antes | despues)
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { NEGOCIO, saludo } from "../cerebro.mjs";
import { instrucciones } from "../instrucciones.mjs";
import { preparar, buscar } from "../manual.mjs";
import CONOCIMIENTO from "../conocimiento.mjs";

const fase = process.argv[2] || "antes";
const voz = fase.startsWith("voz"); // instrucciones de la llamada de voz (con herramientas y la regla de 25 palabras)
const aqui = new URL(`./${fase}/`, import.meta.url);
mkdirSync(aqui, { recursive: true });
const { clientes } = JSON.parse(readFileSync(new URL("./clientes.json", import.meta.url), "utf8"));
const manual = preparar(CONOCIMIENTO);

for (const c of clientes) {
  const consulta = buscar(manual, c.turnos).texto;
  const turnos = c.turnos.map((t, i) => i === c.turnos.length - 1 && consulta ? { ...t, content: t.content + "\n\n" + consulta } : t);
  const mensajes = [{ role: "user", content: instrucciones(NEGOCIO, { herramientas: voz }) }, { role: "assistant", content: saludo(NEGOCIO) }, ...turnos];
  const texto = mensajes.map(m => `=== ${m.role === "user" ? "USUARIO" : "ASISTENTE"} ===\n${m.content}`).join("\n\n");
  writeFileSync(new URL(`cliente-${String(c.id).padStart(2, "0")}.txt`, aqui), texto + "\n\n=== ASISTENTE (tu respuesta) ===\n");
}
console.log(`${clientes.length} conversaciones preparadas en pruebas/${fase}/`);
