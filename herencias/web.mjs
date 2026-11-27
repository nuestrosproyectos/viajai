// =====================================================================
//  WEB DE HERENCIAS · todo lo que la hace distinta de las demás webs de la fábrica:
//  textos, situaciones con sus iconos, campos de la solicitud, lista de lo que hay que
//  preparar, fotos, letras y lo que Andrés puede «señalar» en la página.
//  El diseño, la conversación, la voz y la llamada salen de fabrica/plantilla/.
//  Después de cambiar algo:  node fabrica/construir.mjs herencias
// =====================================================================
import { lista } from "./cerebro.mjs";

const may = t => t.charAt(0).toUpperCase() + t.slice(1);

export default function web(N) {
  const gratis = /gratis/i.test(N.consulta.precio);
  return {
    id: "herencias",
    tituloPagina: `Abogados de herencias en ${N.provincia} · ${N.marca}`,
    descripcion: `¿Ha fallecido un familiar y tienes que gestionar la herencia en ${N.provincia}? Habla con ${N.tecnico}, nuestro asistente: te explica qué te toca hacer, cuánto se paga de impuesto en ${N.comunidad} y te reserva la primera consulta gratis con un abogado especialista.`,
    og: { titulo: `${N.marca} · Abogados de herencias en ${N.provincia}`, descripcion: "Te explicamos qué te toca hacer con la herencia, cuánto se paga y en qué plazos. Primera consulta gratis." },
    colorTema: "#FFFFFF",
    icono: "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23234A43'/%3E%3Cpath d='M9 5h10l5 5v17H9z' fill='none' stroke='%23fff' stroke-width='2.2'/%3E%3Cpath d='M13 16h7M13 20h7' stroke='%23fff' stroke-width='2.2'/%3E%3C/svg%3E",
    logo: '<path d="M9 5h10l5 5v17H9z" stroke="#FFFFFF" stroke-width="2.2" stroke-linejoin="round"/><path d="M19 5v5h5M13 16h7M13 20h7" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>',
    fuentes: [
      { familia: "Archivo", archivo: "fuentes/archivo.min.woff2", pesos: "700 800", stretch: "112%" },
      { familia: "Atkinson Hyperlegible Next", archivo: "fuentes/atkinson.min.woff2", pesos: "400 700", precargar: true, primero: true }
    ],
    textos: {
      previa: "Vista previa · <b>marca, teléfono y condiciones provisionales</b>",
      subtituloLogo: `<span class="solo-ordenador">Abogados de herencias · </span><span data-n="provincia">${N.provincia}</span>`,
      sobretitulo: `Abogados especialistas en herencias · <span data-n="provincia">${N.provincia}</span>`,
      urgencia: { texto: "El impuesto de sucesiones tiene <b>6 meses</b> de plazo desde el fallecimiento.", boton: "Llámanos" },
      titularFijo: "Te ayudamos con", titularAria: `Te ayudamos con tu herencia en ${N.provincia}`,
      gira: ["tu herencia", "una herencia sin testamento", "el impuesto de sucesiones", "el reparto entre hermanos", "la casa de tus padres", "una herencia con deudas"],
      entrada: "Te explicamos qué te toca hacer, cuánto se paga y en qué plazos.",
      precioLinea: `<span>Primera consulta: <b id="precioLinea">${gratis ? "gratis" : N.consulta.precio}</b>.</span> <span>Presupuesto cerrado por escrito.</span>`,
      asistenteQuien: "Asistente con IA, formado por abogados de herencias.",
      asistenteSaludo: "Cuéntame tu situación: te explico qué te toca hacer en tu caso y te reservo la primera consulta con el abogado.",
      asistenteNota: `<span data-n="tecnico">${N.tecnico}</span> es un asistente con inteligencia artificial: orienta, pero no sustituye al abogado, que confirma cada caso con los documentos.`,
      llamame: "¿Prefieres que te llame un abogado? Déjanos tu teléfono ›",
      confianza: [
        ["persona", `<b data-n="experienciaCorta">${N.experienciaCorta}</b>`],
        ["documento", "<b>Presupuesto cerrado</b> por escrito antes de empezar"],
        ["video", "<b>En el despacho, por videollamada</b> o por teléfono"]
      ],
      situaciones: { antetitulo: "Cada herencia es distinta", titulo: "¿En qué <em>situación</em> estás?", bajada: `Toca la tuya y <span data-n="tecnico">${N.tecnico}</span> te explica qué toca hacer.` },
      zona: { titulo: "Dónde te atendemos", texto: "Atendemos " + N.zona + ". La consulta puede ser " + lista(N.modalidades) + ", así que no hace falta desplazarse." },
      datos: { id: "impuesto", antetitulo: `Impuesto de sucesiones en <span data-n="comunidad">${N.comunidad}</span>`, titulo: "¿Cuánto se paga <em>al heredar</em>?" },
      como: {
        antetitulo: "Así trabajamos", titulo: "Tres pasos y tu herencia <em>en marcha</em>.",
        pasos: [
          ["Cuéntanos tu caso", `Hablando o escribiendo con <span data-n="tecnico">${N.tecnico}</span>, a cualquier hora. Te dice qué te toca y qué documentos reunir.`],
          ["Primera consulta con el abogado", "En el despacho, por videollamada o por teléfono. Estudia tu caso y te da un presupuesto cerrado."],
          ["Nos encargamos de todo", "Notaría, impuestos, registro, bancos y Tráfico. Te tenemos al día de cada paso."]
        ]
      },
      precios: {
        antetitulo: "Sin sorpresas", titulo: "Sabes lo que cuesta <em>antes</em> de empezar.",
        cifra: gratis ? "0<small>€</small>" : N.consulta.precio.replace(/\s*€/, "") + "<small>€</small>",
        tarifa: "Primera consulta con el abogado", detalle: may(N.consulta.detalle) + ".",
        descuento: "Sin compromiso: decides después, con el presupuesto delante",
        lista: [
          "<b>Presupuesto cerrado por escrito</b> antes de empezar.",
          "<b>Todos los gastos a la vista:</b> impuestos, notaría y registro, desde la primera consulta.",
          "<b>Pago por fases,</b> según avanza la herencia.",
          "<b>Una sola persona de contacto</b> para toda la familia."
        ]
      },
      preguntas: { antetitulo: "Preguntas frecuentes", titulo: "Lo que más nos <em>preguntáis</em>." },
      contacto: {
        titulo: "¿Prefieres que te llame <em>un abogado</em>?",
        texto: `Déjanos tu teléfono y te llamamos en horario de despacho (<span id="horarioTxt">${N.horario}</span>). O llámanos tú:`,
        form: "Que me llame un abogado", queNecesitas: "¿Qué necesitas? (opcional)", ejemplo: "Herencia de mi madre, sin testamento…",
        legal: "Usaremos tu teléfono solo para atender tu consulta.", ok: "Te llama un abogado en horario de despacho."
      },
      panel: { texto: `Las consultas que registra ${N.tecnico} y las peticiones de llamada aparecen aquí al momento.`, columnas: ["Situación", "Municipio, modalidad y cuándo"] },
      pie: {
        descripcion: `Abogados especialistas en herencias en <span data-n="provincia">${N.provincia}</span> y toda la provincia.`,
        aviso: `${N.tecnico} es un sistema de inteligencia artificial; puede equivocarse. Lo que dice es orientativo: el abogado lo confirma con la documentación de cada caso.`,
        horario: "El despacho atiende " + N.horario + `. ${N.tecnico}, a cualquier hora.`
      },
      horarioFranja: may(N.horario),
      escenario: { pequeño: "Solicitud de primera consulta", aria: "Tu solicitud de consulta" },
      fases: ["Tu caso", "Qué te toca", "Consulta", "Tus datos", "Listo"],
      botonEnviar: "Sí, está bien: pedir la consulta",
      convNota: `<span data-n="tecnico">${N.tecnico}</span> es un asistente con inteligencia artificial. Orienta; el abogado confirma.`,
      fotoAria: "Enviar una foto de un documento",
      chips: ["Ha fallecido mi padre y no sé por dónde empezar", "No hay testamento", "¿Cuánto se paga de impuesto?", "Mis hermanos no se ponen de acuerdo"],
      orientacion: "Lo que te toca: ",
      escEstado: { rellenando: "Se rellena mientras hablas", lista: "Lista: confírmala y te llamamos", enviada: "Solicitud enviada" },
      waInicial: "Hola, necesito ayuda con una herencia. ¿Podéis atenderme?",
      waAviso: { principal: "la primera consulta", llamada: "que me llaméis" },
      trasLlamada: "Tus datos siguen en «Tu solicitud»: si está todo bien, pulsa «pedir la consulta»."
    },
    fotos: {
      portada: { src: "media/portada.jpg", alt: "Una mujer y su madre revisan papeles en la mesa de la cocina", ancho: 1200, alto: 900 },
      trabajo: [
        { src: "media/consulta.jpg", alt: "Abogada explicando un documento a un matrimonio en su despacho", pie: "Te explicamos tu caso con calma y sin tecnicismos." },
        { src: "media/documentos.jpg", alt: "Documentos y unas gafas sobre una mesa", pie: "Te decimos qué papeles hacen falta y los pedimos por ti." },
        { src: "media/firma.jpg", alt: "Manos firmando una escritura", pie: "Te acompañamos hasta la firma en la notaría." }
      ]
    },
    iconos: {
      fallecido: '<path d="M24 42V22"/><path d="M24 22c-7 0-11-4.5-11-11 7 0 11 4.5 11 11zM24 22c7 0 11-4.5 11-11-7 0-11 4.5-11 11z"/><path d="M15 42h18"/>',
      sintestamento: '<path d="M12 4h18l8 8v32H12z"/><path d="M30 4v8h8"/><path d="M19 23l10 10M29 23 19 33"/>',
      impuesto: '<circle cx="24" cy="24" r="18"/><path d="M17 31 31 17"/><circle cx="18" cy="18" r="2.6"/><circle cx="30" cy="30" r="2.6"/>',
      hermanos: '<circle cx="16" cy="15" r="6"/><circle cx="32" cy="15" r="6"/><path d="M5 41c0-7 4.5-12 11-12s11 5 11 12M21 41c0-7 4.5-12 11-12s11 5 11 12"/>',
      casa: '<path d="M6 22 24 7l18 15"/><path d="M11 19v22h26V19"/><path d="M20 41V29h8v12"/>',
      deudas: '<rect x="6" y="12" width="36" height="24" rx="3"/><path d="M6 19h36M13 29h9"/>',
      extranjero: '<circle cx="24" cy="24" r="18"/><path d="M6 24h36M24 6c5 5 7 11 7 18s-2 13-7 18c-5-5-7-11-7-18s2-13 7-18z"/>',
      renuncia: '<path d="M8 41h32"/><path d="M30 8l6 6-18 18-8 2 2-8z"/>'
    },
    situaciones: [
      ["fallecido", "Acaba de fallecer un familiar", "Ha fallecido un familiar y no sé por dónde empezar con la herencia"],
      ["sintestamento", "No hay testamento", "No hay testamento: ¿qué hay que hacer?"],
      ["impuesto", "Impuesto de sucesiones", "¿Cuánto tendría que pagar de impuesto de sucesiones?"],
      ["hermanos", "Los herederos no se ponen de acuerdo", "Los herederos no nos ponemos de acuerdo con el reparto"],
      ["casa", "Vender la casa heredada", "Queremos vender la casa que hemos heredado"],
      ["deudas", "Herencia con deudas", "Creo que la herencia tiene deudas: ¿qué hago?"],
      ["extranjero", "Herederos fuera de España", "Uno de los herederos vive fuera de España"],
      ["renuncia", "Renunciar a una herencia", "Estoy pensando en renunciar a la herencia"]
    ],

    // ---- la solicitud que rellena Andrés (mismos nombres que la <ficha> de sus instrucciones) ----
    campos: [
      { id: "situacion", etiqueta: "Tu situación", corto: "Situación", visible: true, ancho: true, grupo: "caso" },
      { id: "parentesco", etiqueta: "Parentesco con quien ha fallecido", corto: "Parentesco", visible: true, grupo: "caso", lista: ["Hijo o hija", "Cónyuge o viudo/a", "Hermano o hermana", "Sobrino o sobrina", "Nieto o nieta", "Padre o madre", "Pareja de hecho", "Otro"] },
      { id: "testamento", etiqueta: "¿Hay testamento?", corto: "Testamento", visible: true, grupo: "caso", lista: ["Sí", "No", "No lo sé"] },
      { id: "bienes", etiqueta: "Qué hay en la herencia", corto: "Bienes", placeholder: "Piso, cuentas, coche…", ancho: true },
      { id: "nombre", etiqueta: "Nombre", visible: true, autocomplete: "given-name" },
      { id: "telefono", etiqueta: "Teléfono", visible: true, tipo: "tel" },
      { id: "municipio", etiqueta: "Municipio", visible: true, autocomplete: "address-level2" },
      { id: "franja", etiqueta: "Consulta y cuándo", corto: "Consulta", visible: true, placeholder: "Videollamada, mañana por la tarde…", ancho: true },
      { id: "fallecimiento", oculto: true },
      { id: "modalidad", oculto: true }
    ],
    obligatorios: [["telefono", "teléfono"], ["nombre", "nombre"], ["situacion", "situación"]],
    campoResumen: "situacion",
    tipoPrincipal: "consulta",
    resumenAviso: [["situacion", ""], ["parentesco", ""], ["testamento", "testamento: "]],
    panelLugar: ["municipio", "modalidad", "franja"],
    panelExtra: ["bienes"],

    // ---- lo que el cliente debe preparar: se ajusta a lo que va contando ----
    preparar: {
      titulo: "Documentos que te harán falta",
      nota: "Se ajustan a tu caso mientras hablas. No hace falta tenerlos para la primera consulta.",
      reglas: [
        { doc: ["Certificado de defunción", "Lo da el Registro Civil; suele pedirse el literal."] },
        { doc: ["Certificado de últimas voluntades", "Dice si hay testamento y ante qué notario. Se pide pasados 15 días hábiles del fallecimiento."] },
        { doc: ["Certificado de seguros de vida", "Dice si tenía seguros de vida a su nombre."] },
        { grupo: "testamento", campos: ["testamento"], re: "^s", doc: ["Copia autorizada del último testamento", "La da la notaría que lo firmó."] },
        { grupo: "testamento", campos: ["testamento"], re: "^no$|^n[oó] ", doc: ["Declaración de herederos", "Sin testamento hay que hacerla ante notario (o el juzgado, en algunos casos). Nos encargamos nosotros."] },
        { grupo: "testamento", doc: ["Testamento o declaración de herederos", "El certificado de últimas voluntades dirá cuál toca."] },
        { doc: ["DNI de quien ha fallecido y de cada heredero", ""] },
        { campos: ["bienes", "situacion"], re: "casa|piso|vivienda|inmueble|finca|cortijo|local|terreno|solar|parcela|cochera|garaje", doc: ["Escrituras y último recibo del IBI", "De cada vivienda, local o finca."] },
        { campos: ["bienes", "situacion"], re: "cuenta|banco|ahorro|deposito|fondo|accion|plan de pension|dinero", doc: ["Certificados de saldo de los bancos", "A la fecha del fallecimiento. Los pedimos nosotros con la documentación."] },
        { campos: ["bienes", "situacion"], re: "coche|moto|vehiculo|furgoneta|tractor", doc: ["Permiso de circulación de cada vehículo", ""] },
        { campos: ["bienes", "situacion"], re: "deuda|hipoteca|prestamo|credito", doc: ["Últimos recibos o extractos de las deudas", "Hipotecas, préstamos o tarjetas, para valorar si conviene aceptar a beneficio de inventario."] },
        { campos: ["parentesco"], re: "pareja|conyuge|viud|espos|marido|mujer", doc: ["Libro de familia o certificado de matrimonio o de pareja de hecho", ""] }
      ]
    },

    // ---- lo que Andrés puede «señalar» con <mostrar>destino</mostrar> ----
    destinos: {
      precios: { sel: ".tarifa", titulo: "Primera consulta", texto: `${N.consulta.precio}: ${N.consulta.detalle}.` },
      consulta: "precios",
      honorarios: { sel: ".lista-ok", titulo: "Honorarios", texto: may(N.honorarios) + "." },
      como: { sel: ".pasos", titulo: "Cómo trabajamos", texto: "Primera consulta con el abogado, presupuesto cerrado por escrito y nos encargamos de notaría, impuestos, registro y bancos." },
      impuesto: { sel: "#impuesto .envol", titulo: "Impuesto de sucesiones en " + N.comunidad, bloque: true, texto: "El abogado te calcula lo que se paga en tu caso." },
      sucesiones: "impuesto",
      contacto: { solicitud: true }, llamada: { solicitud: true }, formulario: { solicitud: true }, documentos: { solicitud: true },
      zona: { sel: "#zonaCaja", titulo: "Dónde te atendemos", texto: "Atendemos " + N.zona + ", " + lista(N.modalidades) + "." },
      plazo: { sel: ".urgencia", titulo: "Plazos", texto: "El impuesto de sucesiones y la plusvalía municipal tienen 6 meses desde el fallecimiento. La primera consulta suele ser " + N.plazoConsulta + "." },
      situaciones: { sel: "#listaAparatos", titulo: "Te ayudamos con", texto: lista(N.servicios.slice(0, 6)) + "." },
      situacion: "situaciones"
    },

    // ---- tarjeta final al enviar la solicitud ----
    final: {
      principal: { titulo: "¡Listo! Consulta pedida", pasos: ["Te llamamos para confirmar el día y la hora de la consulta.", "El abogado estudia tu caso y te dice qué pasos tocan, qué se paga y cuánto cuesta, con presupuesto cerrado por escrito.", "Si quieres, empezamos: nos encargamos de notaría, impuestos, registro y bancos."] },
      llamada: { titulo: "¡Listo! Te llama un abogado", pasos: ["Te llama un abogado en horario de despacho (" + N.horario + ")."] }
    },

    legal: {
      emergencia: "Si hay peligro para alguien, llama al 112.",
      actividad: "es un servicio de abogados especialistas en herencias que atiende en la provincia de " + N.provincia + ". Los asuntos los estudia y los firma siempre un abogado colegiado.",
      colegio: "Ilustre Colegio de Abogados en el que está colegiado el abogado responsable y su número",
      orienta: "Te orienta de forma general sobre tu herencia y organiza la primera consulta, pero no es un abogado ni da asesoramiento jurídico.",
      decide: "tu caso lo estudia siempre un abogado con tus documentos",
      precios: ["La primera consulta es " + N.consulta.precio.toLowerCase() + ", sin compromiso.", "Los honorarios se dan por escrito en una hoja de encargo antes de empezar. Notaría, registro e impuestos van aparte."],
      datosCaso: "la situación de la herencia, el parentesco, si hay testamento y los bienes", cita: "la primera consulta",
      conserva: "Los datos de un asunto encargado, mientras dure y los plazos legales de conservación (hasta seis años para la facturación)."
    },
    schema: { tipo: "LegalService", descripcion: "Abogados especialistas en herencias en Granada y provincia: tramitación de herencias con y sin testamento, impuesto de sucesiones, declaración de herederos y conflictos entre herederos.", area: "Provincia de Granada", precio: "€€", horas: ["Mo-Fr 09:00-14:00", "Mo-Fr 16:30-20:00"] }
  };
}
