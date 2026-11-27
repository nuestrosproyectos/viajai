// Escribe, para cada cliente simulado, exactamente lo que recibiría Andrés (instrucciones + saludo + conversación).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { NEGOCIO, saludo } from "../cerebro.mjs";
import { instrucciones } from "../instrucciones.mjs";
const fase = process.argv[2] || "v1";
const aqui = new URL(`./${fase}/`, import.meta.url); mkdirSync(aqui, { recursive: true });
const { clientes } = JSON.parse(readFileSync(new URL("./clientes.json", import.meta.url), "utf8"));
for (const c of clientes) {
  const m = [{ role: "user", content: instrucciones(NEGOCIO) }, { role: "assistant", content: saludo(NEGOCIO) }, ...c.turnos];
  writeFileSync(new URL(`cliente-${String(c.id).padStart(2, "0")}.txt`, aqui), m.map(x => `=== ${x.role === "user" ? "USUARIO" : "ASISTENTE"} ===\n${x.content}`).join("\n\n") + "\n\n=== ASISTENTE (tu respuesta) ===\n");
}
console.log(`${clientes.length} conversaciones en pruebas/${fase}/`);
