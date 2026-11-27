// =====================================================================
//  DATOS DEL NEGOCIO · ABOGADOS DE ACCIDENTES DE TRÁFICO (Granada y provincia)
//  Las instrucciones del asistente están en instrucciones.mjs (no se descargan en el móvil del cliente).
//  >>> Lo que hay que revisar antes de publicar está marcado con PENDIENTE (se ve en la vista previa).
//  Conocimiento: conocimiento/resumen-para-andres.md (fuentes en accidentes-trafico.md).
//  Normas: Estatuto General de la Abogacía (RD 135/2021) y Código Deontológico (2019):
//  nada de prometer resultados ni cifras, y la publicidad dice el Colegio del abogado.
// =====================================================================
import { ASISTENTE } from "./asistente.mjs";   // nombre y voz del asistente: se cambian en asistente.json

export const NEGOCIO = {
  marca: "Accidente Claro",              // PENDIENTE: marca (accidenteclaro.es y .com libres el 27-11-2026; falta mirar la OEPM y EUIPO, clases 45 y 35)
  tecnico: ASISTENTE.nombre,             // nombre del asistente: se cambia SOLO en asistente.json
  tono: ASISTENTE.tono,
  sector: "abogados de accidentes de tráfico",
  ciudad: "Granada",
  provincia: "Granada",
  comunidad: "Andalucía",
  zona: "Granada capital y toda la provincia",   // PENDIENTE: confirmar zona (costa, Baza, Guadix, Loja) y si se atienden accidentes de fuera de Granada
  telefono: "958 00 00 00",              // PENDIENTE: teléfono real del despacho
  telefonoEnlace: "+34958000000",        // PENDIENTE: mismo teléfono en formato internacional
  whatsapp: "34600000000",               // PENDIENTE: WhatsApp real (sin + ni espacios)
  horario: "de lunes a viernes de 9:00 a 14:00 y de 16:30 a 19:30",   // PENDIENTE: horario del despacho
  colegio: "Ilustre Colegio de la Abogacía de Granada",   // PENDIENTE: confirmar el Colegio del abogado responsable
  numeroColegiado: "",                   // PENDIENTE: número de colegiado (la publicidad debe indicar el Colegio; art. 6.3 del Código Deontológico)
  consulta: {
    precio: "Gratis",                    // PENDIENTE: confirmar que la primera consulta es gratuita (en Granada lo es en todos los despachos del sector)
    duracion: "unos 30 minutos",         // PENDIENTE: duración real de la primera consulta
    detalle: "el abogado revisa lo que tengas (informes médicos, parte o atestado y, si la hay, la oferta de la aseguradora) y te dice con franqueza qué ve y qué costaría, sin compromiso"
  },
  modalidades: ["por teléfono", "por videollamada", "en el despacho"],   // PENDIENTE: modalidades reales de la consulta y dirección del despacho
  plazoConsulta: "normalmente en uno o dos días laborables",            // PENDIENTE: en cuántos días se hace la primera consulta
  honorarios: {
    modelo: "un porcentaje de la indemnización que se consiga, pactado por escrito en la hoja de encargo antes de empezar",
    porcentaje: "",                      // PENDIENTE: porcentaje del despacho y si lleva IVA (mercado orientativo: 15-20 %, franja 10-30 %)
    sinIndemnizacion: "si no hay indemnización, no hay honorarios",   // PENDIENTE: confirmar que el despacho no cobra honorarios si no hay indemnización
    gastos: "si hiciera falta un perito médico o un procurador, te decimos antes quién lo paga"   // PENDIENTE: quién paga perito médico, procurador y costas si hay juicio
  },
  experiencia: "experiencia reclamando a aseguradoras por accidentes de tráfico en Granada",   // PENDIENTE: años reales del abogado o del despacho
  servicios: [
    "reclamación de lesiones a la aseguradora del culpable",
    "revisión de ofertas y finiquitos de la aseguradora",
    "pasajeros, peatones, ciclistas, motoristas y usuarios de patinete",
    "accidentes con vehículo sin seguro, desconocido o extranjero (Consorcio y OFESAUTO)",
    "accidentes yendo o volviendo del trabajo",
    "demanda en el juzgado si no hay acuerdo"
  ]                                      // PENDIENTE: casos que no lleva el despacho (vía penal, fallecimientos, grandes lesionados, defensa del culpable)
};

export const lista = xs => xs.length > 1 ? xs.slice(0, -1).join(", ") + " y " + xs.at(-1) : (xs[0] || "");

export function saludo(n = NEGOCIO) {
  return `Hola, soy ${n.tecnico}, el asistente de ${n.marca}. Siento lo del accidente. Cuéntame qué pasó y te digo qué conviene hacer ahora.`;
}
