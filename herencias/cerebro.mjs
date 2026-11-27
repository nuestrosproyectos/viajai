// =====================================================================
//  CEREBRO DE ANDRÉS · HERENCIAS (una web por provincia)
//  Datos del despacho y saludo. Las instrucciones de Andrés están en
//  instrucciones.mjs (no se descargan en el móvil del cliente).
//
//  >>> Lo que hay que revisar antes de publicar está marcado con PENDIENTE.
//  Para otra provincia: copiar este archivo y cambiar el bloque PROVINCIA.
// =====================================================================

import { ASISTENTE } from "./asistente.mjs";   // nombre y voz del asistente: se cambian en asistente.json

export const NEGOCIO = {
  marca: "Herencia Clara",               // PENDIENTE: marca definitiva (comprobar dominio y OEPM)
  tecnico: ASISTENTE.nombre,             // nombre del asistente: se cambia SOLO en asistente.json
  sector: "herencias",

  // ---- PROVINCIA ----
  ciudad: "Granada",
  provincia: "Granada",
  comunidad: "Andalucía",
  zona: "toda la provincia de Granada: Granada capital y área metropolitana, Motril y la Costa Tropical, la Alpujarra, Loja, Guadix, Baza, Huéscar, Montefrío, Alhama y el resto de municipios",
  despacho: "Granada capital",           // PENDIENTE: dirección real del despacho colaborador

  telefono: "958 00 00 00",              // PENDIENTE: teléfono real
  telefonoEnlace: "+34958000000",        // PENDIENTE: mismo teléfono en formato internacional
  whatsapp: "34600000000",               // PENDIENTE: WhatsApp real (sin + ni espacios)
  horario: "de lunes a viernes de 9:00 a 14:00 y de 16:30 a 20:00",   // PENDIENTE: horario del despacho
  modalidades: ["en el despacho", "por videollamada", "por teléfono"],
  plazoConsulta: "normalmente en 24 a 48 horas laborables",          // PENDIENTE: confirmar con el despacho
  consulta: {                             // PENDIENTE: decidir con el despacho si la primera consulta es gratis
    precio: "Gratis",
    duracion: "30 minutos",
    detalle: "primera consulta con el abogado, de unos 30 minutos y sin compromiso: estudia tu caso, te dice qué pasos tocan, qué impuestos y gastos habrá y te da un presupuesto cerrado por escrito"
  },
  experiencia: "abogados especializados en herencias con más de 20 años de ejercicio",  // PENDIENTE: confirmar con el despacho
  experienciaCorta: "Abogados con más de 20 años en herencias",
  honorarios: "presupuesto cerrado por escrito antes de empezar, según el trabajo que tenga la herencia, y pago por fases",  // PENDIENTE: confirmar con el despacho
  servicios: [
    "tramitación completa de la herencia (con o sin testamento)",
    "declaración de herederos",
    "impuesto de sucesiones y plusvalía municipal",
    "escritura de aceptación y reparto, y registro",
    "cambio de titularidad de cuentas, vehículos e inmuebles",
    "herencias con conflicto entre herederos (acuerdo o división judicial)",
    "venta de la vivienda heredada y extinción de condominio",
    "herencias con deudas, aceptación a beneficio de inventario y renuncia",
    "herederos que viven fuera de España",
    "testamentos y planificación de la herencia"
  ]
};

// "a, b, c y d"
export const lista = xs => xs.length > 1 ? xs.slice(0, -1).join(", ") + " y " + xs.at(-1) : (xs[0] || "");

// Saludo inicial: lo dice la propia página al instante (corto: cada palabra dicha cuesta)
export function saludo(n = NEGOCIO) {
  return `Hola, soy ${n.tecnico}, el asistente de ${n.marca}. Siento la pérdida. Cuéntame tu situación y te digo qué te toca hacer.`;
}
