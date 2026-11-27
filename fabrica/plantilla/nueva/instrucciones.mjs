// Instrucciones del asistente para una web nueva (esqueleto): completar el oficio del sector tras investigarlo.
import { NEGOCIO } from "./cerebro.mjs";
import web from "./web.mjs";
import { SABER } from "./saber.mjs";
import { componer } from "./base-instrucciones.mjs";
export function instrucciones(n = NEGOCIO, opciones = {}) {
  return componer(n, web(n), {
    quien: `un negocio de ${n.sector} en ${n.ciudad}`,
    oficio: `Razonas como un profesional de ${n.sector} con muchos años de oficio.`,
    objetivo: `Que la persona se vaya orientada y con ${n.cita.nombre} reservada.`,
    profesional: "el profesional", cita: { nombre: n.cita.nombre, corto: n.cita.nombre },
    comoAconsejas: ["Todavía no tienes conocimiento del sector con fuentes: no des datos concretos (precios, normas, plazos); di que lo confirma el profesional y propón la cita."],
    primera: "Empieza por lo que te cuenta, sin saludos largos.", ejemplo: `Te ayudo. Para orientarte bien, lo confirma el profesional en ${n.cita.nombre}. ¿Qué te pasa exactamente?`,
    pasosDatos: "nombre, teléfono, municipio y cuándo le viene bien", saber: SABER,
    precios: `- ${n.cita.nombre}: ${n.cita.precio}.`, urgente: "hay riesgo para las personas", notas: "su caso en pocas palabras"
  }, opciones);
}
