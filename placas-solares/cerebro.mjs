// =====================================================================
//  DATOS DEL NEGOCIO · PLACAS SOLARES / AUTOCONSUMO (Granada y provincia)
//  Las instrucciones del asistente están en instrucciones.mjs (no se descargan en el móvil del cliente).
//  >>> Lo que hay que revisar antes de publicar está marcado con PENDIENTE (se ve en la vista previa).
//  Lo que dice Andrés sale de conocimiento/resumen-para-andres.md (fuentes en autoconsumo-granada.md).
// =====================================================================
import { ASISTENTE } from "./asistente.mjs";   // nombre y voz del asistente: se cambian en asistente.json

export const NEGOCIO = {
  marca: "Tejaluz",                      // PENDIENTE: marca (tejaluz.es y .com libres el 27-11-2026; falta mirar la OEPM, clases 37, 40, 42 y 19)
  tecnico: ASISTENTE.nombre,             // nombre del asistente: se cambia SOLO en asistente.json
  tono: ASISTENTE.tono,
  sector: "placas solares",
  ciudad: "Granada",
  provincia: "Granada",
  comunidad: "Andalucía",
  zona: "Granada capital, el área metropolitana y el resto de la provincia: la Vega, la Costa, la Alpujarra, el Poniente, Guadix, Baza y el Altiplano (en pueblos lejanos te decimos antes si hay coste de desplazamiento)",   // PENDIENTE: zona real que cubre la empresa y si cobra desplazamiento
  telefono: "958 00 00 00",              // PENDIENTE: teléfono real
  telefonoEnlace: "+34958000000",        // PENDIENTE: mismo teléfono en formato internacional
  whatsapp: "34600000000",               // PENDIENTE: WhatsApp real (sin + ni espacios)
  horario: "de lunes a viernes de 8:30 a 14:00 y de 16:00 a 19:00",   // PENDIENTE: horario de la empresa
  registroInstalador: "",                // PENDIENTE: n.º de empresa instaladora habilitada en la Junta de Andalucía (cuando esté, se enseña en la web)
  estudio: {
    precio: "Gratis",                    // PENDIENTE: confirmar con la empresa que el estudio y la visita técnica no se cobran
    duracion: "alrededor de una hora",   // PENDIENTE: confirmar duración de la visita técnica
    detalle: "un técnico sube a tu tejado o azotea, mide, mira orientación, sombras y cuadro eléctrico, y con tus facturas calcula cuántas placas te hacen falta, sin compromiso"
  },
  plazoPresupuesto: "en unos 5 días laborables después de la visita",   // PENDIENTE: plazo del presupuesto que asume la empresa
  plazoVisita: "normalmente en la misma semana",                         // PENDIENTE: en cuántos días se hace la visita
  experiencia: "experiencia instalando autoconsumo en la provincia de Granada",   // PENDIENTE: años reales de la empresa (no se dice ninguna cifra hasta tenerla)
  garantia: "garantías de placas, inversor, batería y mano de obra por escrito en el presupuesto, con marca y años",   // PENDIENTE: marcas y años de garantía que da la empresa
  servicios: [
    "placas solares para casas y chalés",
    "autoconsumo para comunidades de vecinos",
    "placas para negocios y naves",
    "baterías para placas nuevas o ya instaladas",
    "cargadores de coche eléctrico",             // PENDIENTE: confirmar que la empresa instala puntos de recarga
    "legalización completa: boletín, registro en la Junta y trámite del ayuntamiento",
    "revisión de instalaciones que producen poco o dan error"   // PENDIENTE: confirmar si atiende instalaciones de otras empresas
  ]
};

export const lista = xs => xs.length > 1 ? xs.slice(0, -1).join(", ") + " y " + xs.at(-1) : (xs[0] || "");

export function saludo(n = NEGOCIO) {
  return `Hola, soy ${n.tecnico}, el asistente de ${n.marca}. Dime más o menos cuánto pagas de luz al mes y te digo cuántas placas te harían falta y lo que costarían.`;
}
