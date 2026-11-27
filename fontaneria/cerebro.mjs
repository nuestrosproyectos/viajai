// =====================================================================
//  DATOS DEL NEGOCIO · FONTANERÍA Y DESATASCOS (Granada y área metropolitana)
//  Las instrucciones del asistente están en instrucciones.mjs (no se descargan en el móvil del cliente).
//  >>> Lo que hay que revisar antes de publicar está marcado con PENDIENTE (se ve en la vista previa).
//  Preguntas abiertas para el fontanero: revision-profesional.md
// =====================================================================
import { ASISTENTE } from "./asistente.mjs";   // nombre y voz del asistente: se cambian en asistente.json

export const NEGOCIO = {
  marca: "Llave de Paso",                // PENDIENTE: marca provisional (llavepaso.es y .com libres el 27-11-2026; falta mirar la OEPM y la EUIPO)
  tecnico: ASISTENTE.nombre,             // nombre del asistente: se cambia SOLO en asistente.json
  tono: ASISTENTE.tono,
  sector: "fontanería y desatascos",
  ciudad: "Granada",
  provincia: "Granada",
  comunidad: "Andalucía",
  zona: "Granada capital y su área metropolitana",   // PENDIENTE: lista de municipios que cubre el fontanero y tiempos de llegada de día y de noche
  telefono: "958 00 00 00",              // PENDIENTE: teléfono real (mejor 958 o móvil de Granada)
  telefonoEnlace: "+34958000000",        // PENDIENTE: mismo teléfono en formato internacional
  whatsapp: "34600000000",               // PENDIENTE: WhatsApp real (sin + ni espacios)
  urgencias: "24 horas, todos los días del año",
  horario: "de lunes a viernes de 8:00 a 20:00",     // PENDIENTE: horario de oficina (fuera de él, solo urgencias)
  // Tarifas propias del negocio. Mientras estén vacías, la web y Andrés usan las horquillas de mercado
  // de conocimiento/resumen-para-andres.md, siempre como orientativas.
  tarifas: {
    salida: "",                          // PENDIENTE: precio de salida o desplazamiento (¿con IVA? ¿incluye la primera media hora?)
    hora: "",                            // PENDIENTE: precio de la hora en horario normal y si hay mínimo de una hora
    recargo: "",                         // PENDIENTE: recargo de noche, fin de semana y festivos (horas y porcentaje)
    presupuesto: ""                      // PENDIENTE: si el presupuesto es gratis y si se cobra la salida cuando no se acepta
  },
  mercado: {                             // horquillas de mercado (resumen-para-andres.md, consultado el 27-11-2026)
    salida: "unos 20 a 40 €",
    hora: "unos 20 a 40 €",
    recargo: "suele subir entre un 50 % y el doble"
  },
  garantia: "garantía de la reparación por escrito en la factura",   // PENDIENTE: meses de garantía en mano de obra y en piezas
  gas: false,                            // PENDIENTE: ¿tiene habilitación de gas? Si es true, Andrés puede ofrecer calentadores de gas
  experiencia: "fontaneros de Granada que atienden averías y desatascos a diario",   // PENDIENTE: años de oficio reales de la empresa
  servicios: [
    "fugas de agua y tuberías rotas",
    "desatascos de fregaderos, lavabos, duchas y váteres",
    "bajantes y arquetas atascadas (también de comunidades)",
    "cisternas que pierden o no paran",
    "termos eléctricos: reparación y cambio",
    "localización de fugas ocultas y humedades",
    "poca presión de agua y grifos"
  ]                                      // PENDIENTE: confirmar si tiene cámara de inspección, detector de fugas y camión cuba propios
};

export const lista = xs => xs.length > 1 ? xs.slice(0, -1).join(", ") + " y " + xs.at(-1) : (xs[0] || "");

export function saludo(n = NEGOCIO) {
  return `Hola, soy ${n.tecnico}, el asistente de ${n.marca}. Si te está saliendo agua, cierra primero la llave de paso. Cuéntame qué te pasa y te mando al fontanero.`;
}
