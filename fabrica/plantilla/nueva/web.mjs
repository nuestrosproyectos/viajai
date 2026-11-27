// WEB NUEVA creada por la fábrica (esqueleto neutro). Sustituir textos, situaciones, campos, fotos y
// piel tras el estudio del sector (ver reformas/web.mjs como ejemplo completo). Construir: node fabrica/construir.mjs <web>
import { lista } from "./cerebro.mjs";
const may = t => t.charAt(0).toUpperCase() + t.slice(1);
export default function web(N) {
  const C = N.cita, gratis = /gratis/i.test(C.precio);
  return {
    id: N.sector,
    tituloPagina: `${may(N.sector)} en ${N.ciudad} · ${N.marca}`,
    descripcion: `${may(N.sector)} en ${N.ciudad}. Habla con ${N.tecnico}, nuestro asistente: te orienta y te reserva ${C.nombre}.`,
    og: { titulo: `${N.marca} · ${may(N.sector)} en ${N.ciudad}`, descripcion: `Te orientamos al momento y te reservamos ${C.nombre}.` },
    colorTema: "#FFFFFF",
    icono: "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23203040'/%3E%3C/svg%3E",
    logo: '<circle cx="16" cy="16" r="8" stroke="#FFFFFF" stroke-width="2.4"/>',
    fuentes: [{ familia: "Public Sans", archivo: "fuentes/public-sans.woff2", pesos: "100 900", primero: true }],
    textos: {
      previa: "Vista previa · <b>web en construcción</b>",
      subtituloLogo: `<span class="solo-ordenador">${may(N.sector)} · </span>${N.ciudad}`,
      sobretitulo: `${may(N.sector)} · ${N.ciudad}`, urgencia: null,
      titularFijo: "Te ayudamos con", titularAria: `Te ayudamos con ${N.sector} en ${N.ciudad}`, gira: [N.sector],
      entrada: "PENDIENTE: frase de valor del negocio tras el estudio de la competencia.",
      precioLinea: `<span>${may(C.nombre)}: <b id="precioLinea">${gratis ? "gratis" : C.precio}</b>.</span>`,
      asistenteQuien: "Asistente con inteligencia artificial.",
      asistenteSaludo: `Cuéntame qué necesitas y te reservo ${C.nombre}.`,
      asistenteNota: `${N.tecnico} es un asistente con inteligencia artificial: orienta; el profesional confirma.`,
      llamame: "¿Prefieres que te llamemos? Déjanos tu teléfono ›",
      confianza: [["persona", `<b>${N.experienciaCorta}</b>`], ["documento", "<b>Presupuesto por escrito</b>"], ["reloj", `<b>${may(C.nombre)}</b> cuando te venga bien`]],
      situaciones: { antetitulo: "Cada caso es distinto", titulo: "¿Qué <em>necesitas</em>?", bajada: `Toca lo tuyo y ${N.tecnico} te orienta.` },
      zona: { titulo: "Dónde trabajamos", texto: N.zona + "." },
      datos: null,
      como: { antetitulo: "Así trabajamos", titulo: "Tres pasos <em>y listo</em>.", pasos: [[`Cuéntaselo a ${N.tecnico}`, "Por voz o por escrito, a cualquier hora."], [may(C.nombre), "Con el profesional, cuando te venga bien."], ["Presupuesto por escrito", "Sin sorpresas: decides con él delante."]] },
      precios: { antetitulo: "Sin sorpresas", titulo: "Sabes lo que cuesta <em>antes</em>.", cifra: gratis ? "0<small>€</small>" : C.precio.replace(/\s*€/, "") + "<small>€</small>", tarifa: may(C.nombre), detalle: "PENDIENTE: qué incluye.", descuento: "", lista: ["<b>Presupuesto por escrito</b> antes de empezar.", `<b>${may(N.garantia)}.</b>`] },
      preguntas: { antetitulo: "Preguntas frecuentes", titulo: "Lo que más nos <em>preguntáis</em>." },
      contacto: { titulo: "¿Prefieres que <em>te llamemos</em>?", texto: `Déjanos tu teléfono y te llamamos (<span id="horarioTxt">${N.horario}</span>). O llámanos tú:`, form: "Que me llamen", queNecesitas: "¿Qué necesitas? (opcional)", ejemplo: "Cuéntanos en pocas palabras…", legal: "Usaremos tu teléfono solo para atender tu consulta.", ok: "Te llamamos en horario de atención." },
      panel: { texto: "Las solicitudes aparecen aquí al momento.", columnas: ["Caso", "Municipio y cuándo"] },
      pie: { descripcion: `${may(N.sector)} en ${N.ciudad}.`, aviso: `${N.tecnico} es un sistema de inteligencia artificial; puede equivocarse. Lo que dice es orientativo.`, horario: "Atendemos " + N.horario + "." },
      horarioFranja: may(N.horario),
      escenario: { pequeño: "Solicitud", aria: "Tu solicitud" },
      fases: ["Tu caso", "Orientación", may(C.tipo), "Tus datos", "Listo"],
      botonEnviar: `Sí, está bien: pedir ${C.nombre}`,
      convNota: `${N.tecnico} es un asistente con inteligencia artificial. Orienta; el profesional confirma.`,
      fotoAria: "Enviar una foto", chips: ["Quiero información", "¿Cuánto cuesta?"], orientacion: "Lo que te conviene: ",
      escEstado: { rellenando: "Se rellena mientras hablas", lista: "Lista: confírmala y te llamamos", enviada: "Solicitud enviada" },
      waInicial: "Hola, quiero información. ¿Podéis atenderme?", waAviso: { principal: C.nombre, llamada: "que me llaméis" },
      trasLlamada: "Tus datos siguen en «Tu solicitud»: si está todo bien, pulsa el botón para enviarla."
    },
    fotos: { portada: { src: "media/portada.jpg", alt: "PENDIENTE: foto de portada" }, trabajo: [] },
    iconos: { caso: '<circle cx="24" cy="24" r="16"/><path d="M24 16v10l6 4"/>' },
    situaciones: [["caso", "PENDIENTE: situaciones del sector", "Quiero información"]],
    campos: [
      { id: "caso", etiqueta: "Qué necesitas", corto: "Caso", visible: true, ancho: true, grupo: "caso" },
      { id: "nombre", etiqueta: "Nombre", visible: true, autocomplete: "given-name" },
      { id: "telefono", etiqueta: "Teléfono", visible: true, tipo: "tel" },
      { id: "municipio", etiqueta: "Municipio", visible: true, autocomplete: "address-level2" },
      { id: "franja", etiqueta: "Cuándo te viene bien", corto: "Cuándo", visible: true, ancho: true }
    ],
    obligatorios: [["telefono", "teléfono"], ["nombre", "nombre"], ["caso", "qué necesita"]],
    campoResumen: "caso", tipoPrincipal: C.tipo, resumenAviso: [["caso", ""]], panelLugar: ["municipio", "franja"],
    preparar: { titulo: "Ten a mano", nota: "Se ajusta a tu caso mientras hablas.", reglas: [{ doc: ["PENDIENTE: lo que el cliente debe preparar", ""] }] },
    destinos: { precios: { sel: ".tarifa", titulo: may(C.nombre), texto: `${C.precio}.` }, como: { sel: ".pasos", titulo: "Cómo trabajamos", texto: "Te orientamos, cita con el profesional y presupuesto por escrito." }, zona: { sel: "#zonaCaja", titulo: "Dónde trabajamos", texto: N.zona + "." }, formulario: { solicitud: true } },
    final: { principal: { titulo: `¡Listo! ${may(C.tipo)} pedida`, pasos: ["Te llamamos para confirmar el día y la hora."] }, llamada: { titulo: "¡Listo! Te llamamos", pasos: ["Te llamamos en horario de atención."] } },
    legal: { actividad: `presta servicios de ${N.sector} en ${N.ciudad}.`, orienta: "Te orienta de forma general y organiza la cita.", decide: "lo confirma siempre el profesional", precios: [`${may(C.nombre)}: ${C.precio}.`], datosCaso: "lo que nos cuentes de tu caso", cita: C.nombre, conserva: "Los datos de un servicio contratado, los plazos legales." },
    schema: { tipo: "LocalBusiness", descripcion: `${may(N.sector)} en ${N.ciudad}.`, area: N.zona, precio: "€€", horas: [] }
  };
}
