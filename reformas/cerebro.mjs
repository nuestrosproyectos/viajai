// =====================================================================
//  DATOS DEL NEGOCIO · REFORMAS (Granada y provincia)
//  Las instrucciones del asistente están en instrucciones.mjs (no se descargan en el móvil del cliente).
//  >>> Lo que hay que revisar antes de publicar está marcado con PENDIENTE (se ve en la vista previa).
// =====================================================================
import { ASISTENTE } from "./asistente.mjs";   // nombre y voz del asistente: se cambian en asistente.json

export const NEGOCIO = {
  marca: "Obra Redonda",                 // PENDIENTE: marca (obraredonda.es y .com libres el 27-11-2026; falta mirar la OEPM)
  tecnico: ASISTENTE.nombre,             // nombre del asistente: se cambia SOLO en asistente.json
  tono: ASISTENTE.tono,
  sector: "reformas",
  ciudad: "Granada",
  provincia: "Granada",
  comunidad: "Andalucía",
  zona: "Granada capital, el área metropolitana y el resto de la provincia (en pueblos lejanos, te decimos antes si hay coste de desplazamiento)",
  telefono: "958 00 00 00",              // PENDIENTE: teléfono real
  telefonoEnlace: "+34958000000",        // PENDIENTE: mismo teléfono en formato internacional
  whatsapp: "34600000000",               // PENDIENTE: WhatsApp real (sin + ni espacios)
  horario: "de lunes a viernes de 8:00 a 14:00 y de 16:00 a 19:00",   // PENDIENTE: horario de la empresa
  visita: {
    precio: "Gratis",                    // PENDIENTE: confirmar con la empresa (la competencia de Granada no la cobra)
    duracion: "unos 45 minutos",          // PENDIENTE: confirmar duración de la visita
    detalle: "un técnico va a tu casa, mide, mira las instalaciones y te explica opciones y materiales, sin compromiso; el presupuesto por escrito también es gratis"   // presupuesto gratis: confirmado por Juan el 28-11-2026
  },
  plazoPresupuesto: "en unos 5 días laborables después de la visita",   // PENDIENTE: plazo del presupuesto que asume la empresa
  plazoVisita: "normalmente en 2 a 4 días",                             // PENDIENTE: confirmar en cuántos días se hace la visita
  experiencia: "más de 20 años haciendo reformas en Granada",           // PENDIENTE: años reales de la empresa
  experienciaCorta: "Más de 20 años reformando en Granada",             // PENDIENTE: confirmar en cuántos días se hace la visita
  garantia: "garantía por escrito en el contrato",                      // PENDIENTE: años de garantía que da la empresa
  servicios: [
    "cambio de bañera por plato de ducha",
    "reforma completa de baño",
    "reforma de cocina con muebles",
    "reforma integral de pisos y casas",
    "adaptación de baños para personas mayores",
    "cambio de instalación eléctrica y de fontanería (con empresa habilitada y boletín)",
    "suelos, alicatados, tabiques y pintura",
    "trámite de la declaración responsable o la licencia de obra"
  ]
};

export const lista = xs => xs.length > 1 ? xs.slice(0, -1).join(", ") + " y " + xs.at(-1) : (xs[0] || "");

export function saludo(n = NEGOCIO) {
  return `Hola, soy ${n.tecnico}, el asistente de ${n.marca}. Cuéntame qué quieres reformar y te doy una idea de precio y plazo.`;
}
