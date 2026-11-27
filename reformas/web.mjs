// =====================================================================
//  WEB DE REFORMAS · lo que la hace distinta (textos, situaciones, solicitud,
//  lo que hay que preparar, fotos, letras y destinos). El resto sale de fabrica/plantilla/.
//  Después de cambiar algo:  node fabrica/construir.mjs reformas
//  Fuentes de textos y precios: estudio/estudio-marca-diseno.md y conocimiento/.
// =====================================================================
import { lista } from "./cerebro.mjs";
const may = t => t.charAt(0).toUpperCase() + t.slice(1);

export default function web(N) {
  const gratis = /gratis/i.test(N.visita.precio);
  return {
    id: "reformas",
    tituloPagina: `Reformas de baños, cocinas y pisos en ${N.provincia} · ${N.marca}`,
    descripcion: `Reforma tu baño, tu cocina o tu piso en ${N.provincia} con precio cerrado por partidas y fecha de entrega por escrito. Habla con ${N.tecnico}, nuestro asistente: te orienta ahora y te reserva la visita de medición ${gratis ? "gratis" : ""}.`,
    og: { titulo: `${N.marca} · Reformas en ${N.provincia}`, descripcion: "Baños, cocinas y reformas integrales con precio cerrado por partidas y fecha de entrega por escrito. Visita de medición gratis.", imagen: "media/compartir.jpg" },
    colorTema: "#F7F6F3",
    icono: "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%231A1C1F'/%3E%3Ccircle cx='16' cy='16' r='8.5' fill='none' stroke='%23F2B92E' stroke-width='3'/%3E%3Cpath d='M16 5v4M16 23v4' stroke='%23fff' stroke-width='2'/%3E%3C/svg%3E",
    // logotipo: un círculo cerrado (la obra «redonda») con las marcas de cota de un plano
    logo: '<circle cx="16" cy="16" r="8.5" stroke="#F2B92E" stroke-width="3"/><path d="M16 4.5v4M16 23.5v4M4.5 16h4M23.5 16h4" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>',
    fuentes: [
      { familia: "Bricolage Grotesque", archivo: "fuentes/bricolage.woff2", pesos: "200 800" },
      { familia: "Public Sans", archivo: "fuentes/public-sans.woff2", pesos: "100 900", primero: true }
    ],
    textos: {
      previa: "Vista previa · <b>marca, teléfono y condiciones provisionales</b>",
      subtituloLogo: `<span class="solo-ordenador">Reformas · </span><span data-n="provincia">${N.provincia}</span>`,
      sobretitulo: `Baños, cocinas y reformas integrales · <span data-n="provincia">${N.provincia}</span>`,
      urgencia: null,
      titularFijo: "Reforma", titularAria: `Reforma tu baño, tu cocina o tu piso en ${N.provincia}, con precio cerrado`,
      gira: ["tu baño", "tu cocina", "tu piso entero", "la bañera por ducha", "el piso que has comprado"],
      entrada: "Con precio cerrado por partidas y fecha de entrega por escrito. Sin sorpresas a mitad de obra.",
      precioLinea: `<span>Visita de medición: <b id="precioLinea">${gratis ? "gratis" : N.visita.precio}</b>.</span> <span>Presupuesto por partidas, por escrito.</span>`,
      asistenteQuien: "Asistente con IA, formado por jefes de obra.",
      asistenteSaludo: "Cuéntame qué quieres reformar: te doy una idea de precio y plazo y te reservo la visita para medir.",
      asistenteNota: `<span data-n="tecnico">${N.tecnico}</span> es un asistente con inteligencia artificial: orienta, pero el precio cerrado sale siempre de la visita de un técnico.`,
      llamame: "¿Prefieres que te llamemos? Déjanos tu teléfono ›",
      confianza: [
        ["regla", "<b>Precio cerrado por partidas</b>, por escrito antes de empezar"],
        ["calendario", "<b>Fecha de entrega</b> en el contrato"],
        ["persona", `<b data-n="experienciaCorta">${N.experienciaCorta}</b>`]
      ],
      situaciones: { antetitulo: "Cada casa es distinta", titulo: "¿Qué quieres <em>reformar</em>?", bajada: `Toca lo tuyo y <span data-n="tecnico">${N.tecnico}</span> te dice precio orientativo, plazo y qué hace falta.` },
      zona: { titulo: "Dónde trabajamos", texto: "En " + N.zona + "." },
      datos: { id: "precios-orientativos", antetitulo: "Precios orientativos en Granada", titulo: "¿Cuánto cuesta <em>más o menos</em>?" },
      como: {
        antetitulo: "Así trabajamos", titulo: "Tres pasos y tu reforma <em>con fecha</em>.",
        pasos: [
          [`Cuéntaselo a ${N.tecnico}`, "Qué quieres cambiar, metros aproximados y, si quieres, unas fotos. Te da una horquilla de precio en el momento."],
          [`Visita de medición${gratis ? ", gratis" : ""}`, `Un técnico va a tu casa, mide y mira instalaciones. Te explica opciones y materiales, ${N.visita.duracion}.`],
          ["Presupuesto por partidas y fecha", `Lo recibes por escrito ${N.plazoPresupuesto}. Si te convence, se firma con precio cerrado y calendario.`]
        ]
      },
      precios: {
        antetitulo: "Sin sorpresas", titulo: "Sabes lo que cuesta <em>antes</em> de empezar.",
        cifra: gratis ? "0<small>€</small>" : N.visita.precio.replace(/\s*€/, "") + "<small>€</small>",
        tarifa: "Visita de medición y presupuesto", detalle: may(N.visita.detalle) + ".",
        descuento: "Sin compromiso: decides con el presupuesto por escrito delante",
        lista: [
          "<b>Presupuesto por partidas</b>, con medidas y materiales.",
          "<b>Si aparece algo oculto</b> (una tubería rota), te lo enseñamos y no se hace nada sin tu firma.",
          "<b>Licencia o declaración responsable,</b> escombros y limpieza final incluidos en el presupuesto.",
          `<b>${may(N.garantia)}.</b>`
        ]
      },
      preguntas: { antetitulo: "Preguntas frecuentes", titulo: "Lo que más nos <em>preguntáis</em>." },
      contacto: {
        titulo: "¿Prefieres que <em>te llamemos</em>?",
        texto: `Déjanos tu teléfono y te llamamos en horario de oficina (<span id="horarioTxt">${N.horario}</span>). O llámanos tú:`,
        form: "Que me llamen", queNecesitas: "¿Qué quieres reformar? (opcional)", ejemplo: "El baño, quitar la bañera…",
        legal: "Usaremos tu teléfono solo para atender tu consulta.", ok: "Te llamamos en horario de oficina."
      },
      panel: { texto: `Las visitas que registra ${N.tecnico} y las peticiones de llamada aparecen aquí al momento.`, columnas: ["Obra", "Municipio y cuándo"] },
      pie: {
        descripcion: `Reformas de baños, cocinas, pisos y casas en <span data-n="provincia">${N.provincia}</span> y provincia.`,
        aviso: `${N.tecnico} es un sistema de inteligencia artificial; puede equivocarse. Los precios que da son orientativos: el precio cerrado sale de la visita y va por escrito.`,
        horario: "Atendemos " + N.horario + `. ${N.tecnico}, a cualquier hora.`
      },
      horarioFranja: may(N.horario),
      escenario: { pequeño: "Solicitud de visita de medición", aria: "Tu solicitud de visita" },
      fases: ["Tu obra", "Precio y plazo", "Visita", "Tus datos", "Listo"],
      botonEnviar: "Sí, está bien: pedir la visita",
      convNota: `<span data-n="tecnico">${N.tecnico}</span> es un asistente con inteligencia artificial. Orienta; el precio cerrado sale de la visita.`,
      fotoAria: "Enviar una foto de la estancia",
      chips: ["Quiero quitar la bañera y poner un plato de ducha", "¿Cuánto cuesta reformar un baño?", "He comprado un piso para reformar", "¿Necesito licencia?"],
      orientacion: "Lo que te conviene: ",
      escEstado: { rellenando: "Se rellena mientras hablas", lista: "Lista: confírmala y te llamamos", enviada: "Solicitud enviada" },
      waInicial: "Hola, quiero información para una reforma. ¿Podéis atenderme?",
      waAviso: { principal: "la visita de medición", llamada: "que me llaméis" },
      trasLlamada: "Tus datos siguen en «Tu solicitud»: si está todo bien, pulsa «pedir la visita»."
    },
    fotos: {
      portada: { src: "media/portada.jpg", alt: "Baño reformado con hornacinas en la pared, inodoro suspendido y lavabo sobre encimera", ancho: 1600, alto: 1068 },
      trabajo: [
        { src: "media/piso-viejo.jpg", alt: "Dos personas miran un plano en una habitación en obra", pie: "En la visita medimos y vemos contigo qué se puede hacer.", ancho: 1400, alto: 934 },
        { src: "media/oficio.jpg", alt: "Un operario alisa una pared", pie: "Cada partida, con su precio y su plazo en el presupuesto.", ancho: 1400, alto: 934 },
        { src: "media/cocina.jpg", alt: "Cocina en L reformada con frentes de madera y gris", pie: "Al terminar, limpieza final y entrega con fecha.", ancho: 1400, alto: 934 }
      ]
    },
    iconos: {
      banera: '<path d="M5 25h38v5a10 10 0 0 1-10 10H15A10 10 0 0 1 5 30z"/><path d="M11 25V11a4 4 0 0 1 8 0v2"/><path d="M14 40l-2 4M34 40l2 4"/>',
      bano: '<path d="M8 22h22v5a11 11 0 0 1-22 0z"/><path d="M13 37l-1 6h14l-1-6"/><path d="M11 22V8h16v14"/><path d="M35 6v38M35 18h8"/>',
      cocina: '<rect x="5" y="22" width="38" height="20" rx="2"/><path d="M5 30h38M18 30v12"/><path d="M13 6h22l5 10H8z"/><circle cx="27" cy="26" r="1.5"/><circle cx="33" cy="26" r="1.5"/>',
      integral: '<rect x="5" y="5" width="38" height="38"/><path d="M5 23h17v20M22 5v9M31 23h12M31 23v8"/>',
      pisoviejo: '<path d="M6 21 24 7l18 14"/><path d="M10 18v24h28V18"/><circle cx="24" cy="27" r="4"/><path d="M24 31v7M24 35h3"/>',
      mayores: '<path d="M8 6v36M8 14h14a4 4 0 0 1 4 4v24"/><circle cx="36" cy="10" r="4"/><path d="M36 16v14l-4 12M36 30l4 12M36 20l-6 6"/>',
      instalaciones: '<path d="M17 5v8M31 5v8"/><path d="M12 13h24v7a12 12 0 0 1-24 0z"/><path d="M24 32v10h14"/>',
      alquilar: '<path d="M5 24 23 6h17v17L22 41z"/><circle cx="32" cy="14" r="3"/>'
    },
    situaciones: [
      ["banera", "Cambiar la bañera por ducha", "Quiero quitar la bañera y poner un plato de ducha"],
      ["bano", "Reformar el baño entero", "Quiero reformar el baño completo: azulejos, sanitarios y todo"],
      ["cocina", "Reformar la cocina", "Quiero cambiar la cocina: muebles, encimera y lo que haga falta"],
      ["integral", "Reformar el piso entero", "Quiero hacer una reforma integral de mi piso"],
      ["pisoviejo", "He comprado un piso para reformar", "He comprado (o voy a comprar) un piso viejo y quiero saber cuánto costaría reformarlo"],
      ["mayores", "Adaptar el baño a una persona mayor", "Necesito adaptar el baño para una persona mayor o con movilidad reducida"],
      ["instalaciones", "Cambiar la instalación de luz o agua", "La instalación eléctrica o las tuberías son antiguas y quiero cambiarlas"],
      ["alquilar", "Reformar para alquilar o vender", "Quiero reformar un piso para alquilarlo o venderlo mejor"]
    ],

    campos: [
      { id: "obra", etiqueta: "Qué quieres reformar", corto: "Obra", visible: true, ancho: true, grupo: "caso", lista: ["Cambiar bañera por ducha", "Baño completo", "Cocina", "Reforma integral", "Instalación eléctrica o de agua", "Otra obra"] },
      { id: "vivienda", etiqueta: "Tipo de vivienda", corto: "Vivienda", visible: true, grupo: "caso", lista: ["Piso con ascensor", "Piso sin ascensor", "Casa", "Local"] },
      { id: "metros", etiqueta: "Metros aproximados", corto: "Metros", visible: true, grupo: "caso", placeholder: "Unos 5 m², 80 m²…" },
      { id: "antiguedad", etiqueta: "Año del edificio o última reforma", corto: "Antigüedad", placeholder: "Años 70, reformado en 2005…" },
      { id: "presupuesto", etiqueta: "Presupuesto que tienes en mente", corto: "Presupuesto", placeholder: "Opcional" },
      { id: "nombre", etiqueta: "Nombre", visible: true, autocomplete: "given-name" },
      { id: "telefono", etiqueta: "Teléfono", visible: true, tipo: "tel" },
      { id: "municipio", etiqueta: "Municipio y barrio", corto: "Municipio", visible: true, autocomplete: "address-level2" },
      { id: "direccion", etiqueta: "Calle y número", corto: "Dirección", visible: true, autocomplete: "street-address", ancho: true, placeholder: "Calle, número, piso…" },
      { id: "franja", etiqueta: "Cuándo te viene bien la visita", corto: "Visita", visible: true, placeholder: "Martes por la tarde…", ancho: true },
      { id: "inicio", oculto: true }
    ],
    obligatorios: [["telefono", "teléfono"], ["nombre", "nombre"], ["obra", "qué quieres reformar"], ["municipio", "municipio"]],
    campoResumen: "obra",
    tipoPrincipal: "visita",
    resumenAviso: [["obra", ""], ["vivienda", ""], ["metros", ""]],
    panelLugar: ["municipio", "direccion", "franja"],
    panelExtra: ["antiguedad", "presupuesto"],

    preparar: {
      titulo: "Ten a mano para la visita",
      nota: "Se ajusta a tu obra mientras hablas. Nada es obligatorio, pero ayuda a darte un precio exacto.",
      reglas: [
        { doc: ["Fotos de cada estancia", "De frente y desde la puerta. Si quieres, mándalas ya por aquí con el botón de la cámara."] },
        { doc: ["Medidas aproximadas", "Largo y ancho de la estancia, o el plano del piso si lo tienes."] },
        { grupo: "cuadro", campos: ["obra"], re: "integral|piso|casa|electric|luz|instalac", doc: ["Foto del cuadro eléctrico y de la llave de paso", "Para ver si hay que cambiar instalaciones."] },
        { grupo: "cuadro", campos: ["antiguedad"], re: "[4-8]0|antigu|viej", doc: ["Foto del cuadro eléctrico y de la llave de paso", "En edificios antiguos suele tocar cambiar tuberías o cables."] },
        { campos: ["vivienda"], re: "piso", doc: ["Normas de la comunidad para obras", "Horario, uso del ascensor, contenedor y contacto del administrador."] },
        { campos: ["obra"], re: "comprad|compra|nuevo piso|piso viejo", doc: ["Fecha de entrega de llaves", "Y si necesitas el presupuesto para la hipoteca o un préstamo."] },
        { doc: ["Ideas de lo que te gusta", "Fotos de revistas, de internet o de otras casas."] },
        { doc: ["Qué quieres conservar", "Muebles, sanitarios o electrodomésticos que se quedan."] },
        { doc: ["Que esté quien decide", "Si sois dos, mejor los dos en la visita."] }
      ]
    },

    destinos: {
      precios: { sel: ".tarifa", titulo: "Visita de medición", texto: `${N.visita.precio}: ${N.visita.detalle}.` },
      visita: "precios",
      orientativos: { sel: "#precios-orientativos .envol", titulo: "Precios orientativos en Granada", bloque: true, texto: "El precio cerrado sale de la visita." },
      cuanto: "orientativos",
      como: { sel: ".pasos", titulo: "Cómo trabajamos", texto: `Te orienta ${N.tecnico}, un técnico mide en tu casa y te damos el presupuesto por partidas con fecha de entrega, por escrito.` },
      plazo: { sel: ".pasos", titulo: "Plazos", texto: `La visita, ${N.plazoVisita}. El presupuesto, ${N.plazoPresupuesto}. La fecha de entrega va en el contrato.` },
      garantia: { sel: ".lista-ok", titulo: "Garantía y condiciones", texto: may(N.garantia) + ". Presupuesto por partidas y nada fuera de él sin tu firma." },
      permisos: { sel: ".lista-ok", titulo: "Licencia o declaración responsable", texto: "Te decimos qué trámite toca y lo presentamos nosotros; tasas e impuesto de obras van en el presupuesto." },
      zona: { sel: "#zonaCaja", titulo: "Dónde trabajamos", texto: "En " + N.zona + "." },
      situaciones: { sel: "#listaAparatos", titulo: "Hacemos", texto: may(lista(N.servicios.slice(0, 5))) + "." },
      contacto: { solicitud: true }, llamada: { solicitud: true }, formulario: { solicitud: true }, preparar: { solicitud: true }
    },

    final: {
      principal: { titulo: "¡Listo! Visita pedida", pasos: ["Te llamamos para confirmar el día y la hora de la visita.", "Un técnico mide en tu casa y te explica opciones y materiales.", `Te enviamos el presupuesto por partidas y la fecha de entrega, por escrito, ${N.plazoPresupuesto}.`] },
      llamada: { titulo: "¡Listo! Te llamamos", pasos: ["Te llamamos en horario de oficina (" + N.horario + ")."] }
    },
    revelar: [],
    legal: {
      emergencia: "Ante una emergencia (olor a gas, humo, riesgo eléctrico o peligro para alguien), llama al 112.",
      actividad: "es una empresa de reformas de viviendas y locales que trabaja en la provincia de " + N.provincia + ". Las mediciones, los presupuestos y las obras los hace siempre el equipo de la empresa.",
      orienta: "Te orienta de forma general sobre tu reforma (precios orientativos, plazos y trámites) y organiza la visita de medición.",
      decide: "el precio cerrado y lo que se puede hacer en tu casa los decide siempre un técnico después de la visita",
      precios: ["La visita de medición es " + N.visita.precio.toLowerCase() + " y sin compromiso.", "Los precios que figuran en la web son orientativos e indican si llevan IVA; el precio vinculante es el del presupuesto firmado.", "Las obras tienen la garantía que figure en el contrato, además de las que marque la ley."],
      datosCaso: "lo que quieres reformar, el tipo de vivienda, los metros y lo que nos cuentes de tu casa", cita: "la visita de medición",
      conserva: "Los datos de una obra contratada, mientras dure la garantía y los plazos legales de facturación (hasta seis años)."
    },
    schema: { tipo: "HomeAndConstructionBusiness", descripcion: "Reformas de baños, cocinas y reformas integrales en Granada y provincia, con precio cerrado por partidas y fecha de entrega por escrito.", area: "Provincia de Granada", precio: "€€", horas: ["Mo-Fr 08:00-14:00", "Mo-Fr 16:00-19:00"] }
  };
}
