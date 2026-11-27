// =====================================================================
//  WEB DE ACCIDENTES DE TRÁFICO · lo que la hace distinta (textos, situaciones, solicitud,
//  lo que hay que preparar, fotos, letras y destinos). El resto sale de fabrica/plantilla/.
//  Después de cambiar algo:  node fabrica/construir.mjs accidentes-trafico
//  Fuentes de textos y cifras: estudio/estudio-marca-diseno.md y conocimiento/ (manda el conocimiento).
//  Normas: nada de prometer resultados ni cifras; honorarios siempre «por escrito antes de empezar».
// =====================================================================
import { lista } from "./cerebro.mjs";
const may = t => t.charAt(0).toUpperCase() + t.slice(1);

export default function web(N) {
  const gratis = /gratis/i.test(N.consulta.precio);
  const H = N.honorarios;
  const colegiado = `Abogado colegiado en el ${N.colegio}${N.numeroColegiado ? `, n.º ${N.numeroColegiado}` : ""}`;
  return {
    id: "accidentes-trafico",
    tituloPagina: `Abogados de accidentes de tráfico en ${N.provincia} · ${N.marca}`,
    descripcion: `¿Has tenido un accidente de tráfico en ${N.provincia}? Habla con ${N.tecnico}, nuestro asistente: te dice qué hacer ahora, qué papeles guardar y te reserva la primera consulta ${gratis ? "gratis " : ""}con un abogado.`,
    og: { titulo: `${N.marca} · Abogados de accidentes de tráfico en ${N.provincia}`, descripcion: "Qué hacer después del accidente, qué no firmar y cómo se reclama a la aseguradora. Primera consulta gratis con el abogado.", imagen: "media/compartir.jpg" },
    colorTema: "#FFFFFF",
    icono: "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%231C2027'/%3E%3Cpath d='M9 28 13.5 4M23 28 18.5 4' stroke='%23fff' stroke-width='2.2' fill='none'/%3E%3Cpath d='M16 27v-4M16 18v-4M16 9V6' stroke='%23F2B705' stroke-width='2.6'/%3E%3C/svg%3E",
    // logotipo: una carretera vista desde el conductor, con la línea discontinua del carril (orden, no choque)
    logo: '<path d="M8.5 27.5 13.5 4.5M23.5 27.5 18.5 4.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/><path d="M16 27v-4.5M16 18v-4M16 9.5V7" stroke="#F2B705" stroke-width="2.6" stroke-linecap="round"/>',
    fuentes: [
      { familia: "Barlow Semi Condensed", archivo: "fuentes/barlow-sc-700.woff2", pesos: "700" },
      { familia: "Barlow Semi Condensed", archivo: "fuentes/barlow-sc-600.woff2", pesos: "600", precargar: false },
      { familia: "Barlow Semi Condensed", archivo: "fuentes/barlow-sc-800.woff2", pesos: "800", precargar: false },
      { familia: "Public Sans", archivo: "fuentes/public-sans.woff2", pesos: "100 900", primero: true }
    ],
    textos: {
      previa: "Vista previa · <b>marca, teléfono y condiciones provisionales</b>",
      subtituloLogo: `<span class="solo-ordenador">Abogados de accidentes · </span><span data-n="provincia">${N.provincia}</span>`,
      sobretitulo: `Abogados de accidentes de tráfico · <span data-n="provincia">${N.provincia}</span>`,
      urgencia: { icono: "documento", texto: "¿La aseguradora te ofrece dinero? <b>No firmes el finiquito</b> sin que lo vea un abogado.", boton: "Llámanos" },
      titularFijo: "Reclama tu accidente", titularAria: `Reclama tu accidente de tráfico en ${N.provincia}, con un abogado`,
      gira: ["de coche", "de moto", "en bici o patinete", "como peatón", "de pasajero", "yendo al trabajo"],
      entrada: "Siento lo del accidente. Primero, tu salud; después te explicamos qué guardar, qué no firmar y cómo se reclama a la aseguradora.",
      precioLinea: `<span>Primera consulta con el abogado: <b id="precioLinea">${gratis ? "gratis" : N.consulta.precio}</b>.</span> <span>Honorarios por escrito antes de empezar.</span>`,
      asistenteQuien: "Asistente con IA. Orienta; no es abogado.",
      asistenteSaludo: "Cuéntame qué pasó: te digo qué conviene hacer ahora y te reservo la primera consulta gratis con el abogado.",
      asistenteNota: `<span data-n="tecnico">${N.tecnico}</span> es un asistente con inteligencia artificial: orienta, pero no asesora ni dice cuánto vas a cobrar. Tu caso lo estudia siempre un abogado.`,
      llamame: "¿Prefieres que te llame un abogado? Déjanos tu teléfono ›",
      confianza: [
        ["euro", `<b>Primera consulta ${gratis ? "gratis" : N.consulta.precio}</b> y sin compromiso`],
        ["documento", "<b>Honorarios por escrito</b> en la hoja de encargo, antes de firmar nada"],
        ["persona", `<b>${colegiado}</b>`]
      ],
      situaciones: { antetitulo: "Cada accidente es distinto", titulo: "¿Cómo <em>ibas</em>?", bajada: `Toca lo tuyo y <span data-n="tecnico">${N.tecnico}</span> te dice qué conviene hacer ahora y qué papeles guardar.` },
      zona: { titulo: "Dónde te atendemos", texto: `En ${N.zona}. La consulta puede ser ${lista(N.modalidades)}.` },
      datos: { id: "como-se-calcula", antetitulo: "Baremo de tráfico 2026", titulo: "¿Cómo se calcula <em>la indemnización</em>?" },
      como: {
        antetitulo: "Así trabajamos", titulo: "Tres pasos, <em>sin prisas</em> y por escrito.",
        pasos: [
          [`Cuéntaselo a ${N.tecnico}`, "Ahora, hablando o por escrito. Te dice qué hacer ya y qué papeles guardar, y apunta tu caso para que no lo repitas."],
          [`Primera consulta${gratis ? " gratis" : ""} con el abogado`, "Revisa tus informes y, si la hay, la oferta de la aseguradora. Te dice con franqueza qué ve y qué costaría."],
          ["Si sigues adelante, reclamamos", "Hoja de encargo por escrito, reclamación a la aseguradora y negociación; si no hay acuerdo, al juzgado. Tú te centras en recuperarte."]
        ]
      },
      precios: {
        antetitulo: "Sin sorpresas", titulo: "Sabes lo que cuesta <em>antes</em> de firmar nada.",
        cifra: gratis ? "0<small>€</small>" : N.consulta.precio.replace(/\s*€/, "") + "<small>€</small>",
        tarifa: "Primera consulta con el abogado", detalle: may(N.consulta.detalle) + ".",
        descuento: "Sin compromiso: decides después, con los honorarios por escrito delante",
        lista: [
          `<b>Si nos encargas el caso:</b> ${H.porcentaje ? `el ${H.porcentaje} de la indemnización que se consiga` : H.modelo}.`,
          `<b>${may(H.sinIndemnizacion)}.</b>`,
          `<b>Gastos a la vista:</b> ${H.gastos}.`,
          "<b>Si tu póliza tiene defensa jurídica,</b> puede cubrir parte de los honorarios: lo miramos en la consulta."
        ]
      },
      preguntas: { antetitulo: "Preguntas frecuentes", titulo: "Lo que más nos <em>preguntáis</em>." },
      contacto: {
        titulo: "¿Prefieres que te llame <em>un abogado</em>?",
        texto: `Déjanos tu teléfono y te llamamos en horario de despacho (<span id="horarioTxt">${N.horario}</span>). O llámanos tú:`,
        form: "Que me llame un abogado", queNecesitas: "¿Qué pasó? (opcional)", ejemplo: "Me dieron por detrás en un semáforo…",
        legal: "Usaremos tu teléfono solo para atender tu consulta. No escribas aquí datos de salud.", ok: "Te llama un abogado en horario de despacho."
      },
      panel: { texto: `Las consultas que registra ${N.tecnico} y las peticiones de llamada aparecen aquí al momento.`, columnas: ["Qué pasó", "Municipio y consulta"] },
      pie: {
        descripcion: `Abogados de accidentes de tráfico en <span data-n="provincia">${N.provincia}</span> y provincia. ${colegiado}.`,
        aviso: `${N.tecnico} es un sistema de inteligencia artificial; puede equivocarse. Orienta de forma general: no asesora ni promete resultados. Tu caso lo estudia siempre un abogado con tus informes.`,
        horario: "El despacho atiende " + N.horario + `. ${N.tecnico}, a cualquier hora.`
      },
      horarioFranja: may(N.horario),
      escenario: { pequeño: "Solicitud de primera consulta", aria: "Tu solicitud de consulta" },
      fases: ["Qué pasó", "Qué hacer", "Consulta", "Tus datos", "Listo"],
      botonEnviar: "Sí, está bien: pedir la consulta",
      convNota: `<span data-n="tecnico">${N.tecnico}</span> es un asistente con inteligencia artificial. Orienta; el abogado estudia tu caso.`,
      fotoAria: "Enviar una foto (del parte o de los daños del coche)",
      chips: ["Me dieron un golpe por detrás y me duele el cuello", "¿Cuánto tiempo tengo para reclamar?", "La aseguradora me ofrece dinero", "¿Cuánto cobráis?"],
      orientacion: "Lo que te conviene: ",
      escEstado: { rellenando: "Se rellena mientras hablas", lista: "Lista: confírmala y te llamamos", enviada: "Solicitud enviada" },
      waInicial: "Hola, he tenido un accidente de tráfico y quiero información. ¿Podéis atenderme?",
      waAviso: { principal: "la primera consulta", llamada: "que me llaméis" },
      trasLlamada: "Tus datos siguen en «Tu solicitud»: si está todo bien, pulsa «pedir la consulta»."
    },
    fotos: {
      portada: { src: "media/portada.jpg", alt: "Una mujer, de espaldas, se lleva la mano al cuello dolorido", ancho: 1600, alto: 1067 },
      trabajo: [
        { src: "media/rehabilitacion.jpg", alt: "Un fisioterapeuta corrige la postura de una paciente sentada en la camilla", pie: "Lo primero es recuperarte: los informes médicos son la base de la reclamación.", ancho: 1400, alto: 933 },
        { src: "media/consulta.jpg", alt: "Sobre una mesa, una mano ofrece un documento y un bolígrafo a otra persona", pie: "Los honorarios, por escrito en la hoja de encargo, antes de firmar nada.", ancho: 1400, alto: 933 },
        { src: "media/taller.jpg", alt: "Un mecánico revisa el motor de un coche con el capó abierto", pie: "Si el vehículo tiene daños, guarda el presupuesto o la factura del taller.", ancho: 1400, alto: 933 }
      ]
    },
    iconos: {
      coche: '<path d="M4 31v-6l5-2 5-9h17l7 9 6 2v6"/><path d="M4 31h5M17 31h14M39 31h5"/><circle cx="13" cy="31" r="4"/><circle cx="35" cy="31" r="4"/><path d="M12 23h26"/>',
      moto: '<circle cx="11" cy="31" r="7"/><circle cx="37" cy="31" r="7"/><path d="M11 31l8-11h10l8 11"/><path d="M27 20l3-7h5"/><path d="M17 24h11"/>',
      bici: '<circle cx="11" cy="31" r="7.5"/><circle cx="37" cy="31" r="7.5"/><path d="M11 31l6-13h14l6 13"/><path d="M17 18l7 13h-13M31 18l-3-6h-4"/><path d="M14 13h6"/>',
      peaton: '<circle cx="24" cy="7.5" r="3.5"/><path d="M24 13v11l-5 9M24 24l5 9M18 19l6-4 6 4"/><path d="M5 41h6M15 41h6M25 41h6M35 41h6"/>',
      pasajero: '<path d="M6 35V21a6 6 0 0 1 6-6h24a6 6 0 0 1 6 6v14"/><path d="M4 35h40"/><circle cx="17" cy="24" r="3.5"/><circle cx="31" cy="24" r="3.5"/><path d="M11 35c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5M25 35c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5"/>',
      oferta: '<path d="M10 4h19l9 9v31H10z"/><path d="M29 4v9h9"/><path d="M28 20.5a6 6 0 1 0 0 9"/><path d="M17 23.5h8M17 26.5h8"/><path d="M16 37h16"/>',
      sinseguro: '<path d="M24 4 8 10v11c0 10 7 17 16 19 9-2 16-9 16-19V10z"/><path d="M24 15v11"/><path d="M24 32v.5"/>',
      trabajo: '<rect x="6" y="15" width="36" height="24" rx="3"/><path d="M18 15v-5h12v5"/><path d="M6 25h36"/><path d="M21 25v4h6v-4"/>'
    },
    situaciones: [
      ["coche", "Me dieron un golpe con el coche", "Me dieron un golpe con el coche (por ejemplo, por detrás) y me duele el cuello"],
      ["moto", "Iba en moto", "Tuve un accidente con la moto y estoy de baja"],
      ["bici", "Iba en bici o en patinete", "Me tiró un coche cuando iba en bici o en patinete"],
      ["peaton", "Me atropellaron andando", "Me atropelló un coche cuando cruzaba la calle"],
      ["pasajero", "Iba de pasajero", "Iba de pasajero en un coche que tuvo un accidente: ¿puedo reclamar aunque conozca al conductor?"],
      ["oferta", "La aseguradora me ofrece dinero", "La aseguradora me ha hecho una oferta y no sé si firmarla"],
      ["sinseguro", "El otro no tenía seguro o se fue", "El otro conductor no tenía seguro o se dio a la fuga"],
      ["trabajo", "Fue yendo o volviendo del trabajo", "Tuve el accidente yendo al trabajo: ¿qué puedo reclamar?"]
    ],

    // ---- la solicitud que rellena Andrés (mismos nombres que la <ficha> de sus instrucciones) ----
    // Datos de salud: SOLO «medico» (si le ha visto un médico y si sigue de baja o tiene el alta), y solo
    // cuando la persona ha dicho que sí a apuntarlos (queda en «consentimientoSalud»). Nada de diagnósticos.
    campos: [
      { id: "caso", etiqueta: "Qué pasó", corto: "Qué pasó", visible: true, ancho: true, grupo: "caso", placeholder: "Me dieron por detrás en un semáforo…" },
      { id: "como", etiqueta: "Cómo ibas", corto: "Cómo ibas", visible: true, grupo: "caso", lista: ["Conduciendo un coche", "De pasajero", "En moto", "En bici o patinete", "Andando", "Otro"] },
      { id: "fecha", etiqueta: "Cuándo fue", corto: "Fecha", visible: true, grupo: "caso", placeholder: "Hace dos semanas, el 3 de noviembre…" },
      { id: "medico", etiqueta: "Médico y alta (solo si das permiso)", corto: "Médico", visible: true, ancho: true, placeholder: "Urgencias el mismo día; sigo en rehabilitación…" },
      { id: "culpa", etiqueta: "De quién fue la culpa", corto: "Culpa", lista: ["Del otro", "Compartida", "Mía", "No lo sé"] },
      { id: "atestado", etiqueta: "Parte amistoso o atestado", corto: "Parte", lista: ["Parte amistoso", "Atestado de la policía", "Ninguno", "No lo sé"] },
      { id: "oferta", etiqueta: "Oferta de la aseguradora", corto: "Oferta", lista: ["No", "Sí, sin firmar", "He firmado algo"] },
      { id: "defensa", etiqueta: "Defensa jurídica en tu póliza", corto: "Defensa jurídica", lista: ["Sí", "No", "No lo sé"] },
      { id: "nombre", etiqueta: "Nombre", visible: true, autocomplete: "given-name" },
      { id: "telefono", etiqueta: "Teléfono", visible: true, tipo: "tel" },
      { id: "municipio", etiqueta: "Municipio", visible: true, autocomplete: "address-level2" },
      { id: "franja", etiqueta: "Consulta y cuándo", corto: "Consulta", visible: true, ancho: true, placeholder: "Por teléfono, mañana por la tarde…" },
      { id: "consentimientoSalud", oculto: true }
    ],
    obligatorios: [["telefono", "teléfono"], ["nombre", "nombre"], ["caso", "qué pasó"]],
    campoResumen: "caso",
    tipoPrincipal: "consulta",
    resumenAviso: [["caso", ""], ["como", ""], ["fecha", "fecha: "]],
    panelLugar: ["municipio", "franja"],
    panelExtra: ["culpa", "atestado", "oferta", "defensa"],

    // ---- lo que el cliente debe preparar: se ajusta a lo que va contando ----
    preparar: {
      titulo: "Ten a mano para la consulta",
      nota: "Se ajusta a tu caso mientras hablas. No hace falta tenerlo todo: el abogado te dice qué falta.",
      reglas: [
        { doc: ["DNI", ""] },
        { grupo: "parte", campos: ["atestado", "caso"], re: "amistoso|declaracion", doc: ["Tu copia del parte amistoso", "Y si no estabas de acuerdo con algo, apúntalo ya."] },
        { grupo: "parte", campos: ["atestado", "caso"], re: "atestado|policia|guardia|agentes", doc: ["Número del atestado", "Y la comisaría o el cuartel que lo hizo."] },
        { grupo: "parte", doc: ["Parte amistoso o número del atestado", "Si los hay."] },
        { grupo: "otro", campos: ["caso"], re: "fuga|se fue|huy|sin seguro|no tenia seguro|robado", doc: ["La denuncia y lo que recuerdes del otro vehículo", "Responde el Consorcio de Compensación de Seguros: denunciar cuanto antes ayuda."] },
        { grupo: "otro", doc: ["Matrícula y aseguradora del otro vehículo", "Si las tienes."] },
        { doc: ["Informe de urgencias y los informes médicos posteriores", "Son la base de la reclamación. No los mandes por aquí: los ve el abogado en la consulta."] },
        { campos: ["medico"], re: "baja|rehabilit|fisio|tratamiento", doc: ["Partes de baja y justificantes de rehabilitación", "Y no dejes el tratamiento: los días que no constan no cuentan."] },
        { campos: ["medico"], re: "alta", doc: ["El informe de alta", "Con su fecha: importa para el plazo de un año."] },
        { doc: ["Tickets y facturas de gastos", "Farmacia, taxis, desplazamientos, muletas…"] },
        { doc: ["Fotos del lugar y de los vehículos, y nombre de testigos", "Las fotos, sin publicarlas en redes."] },
        { doc: ["Tu póliza de seguro", "Para ver si tiene defensa jurídica, que puede cubrir parte de los honorarios."] },
        { campos: ["oferta", "caso"], re: "^s|oferta|firm|finiquito|dinero", doc: ["La carta u oferta de la aseguradora", "No firmes nada todavía."] },
        { campos: ["caso", "como"], re: "trabajo|itinere|curro|empresa|mutua", doc: ["Parte de la mutua o de la empresa", "Es accidente laboral «in itinere»: el abogado mira las dos vías juntas."] },
        { campos: ["medico"], re: "baja", doc: ["Nóminas o declaración de autónomo", "Si has dejado de ganar dinero."] },
        { campos: ["caso", "como"], re: "coche|moto|taller|danos|chapa", doc: ["Presupuesto o factura del taller", "Si el vehículo tiene daños."] }
      ]
    },

    // ---- lo que Andrés puede «señalar» con <mostrar>destino</mostrar> ----
    destinos: {
      precios: { sel: ".tarifa", titulo: "Primera consulta", texto: `${N.consulta.precio}: ${N.consulta.detalle}.` },
      consulta: "precios",
      honorarios: { sel: ".lista-ok", titulo: "Honorarios", texto: `${may(H.modelo)}. ${may(H.sinIndemnizacion)}. ${may(H.gastos)}.` },
      baremo: { sel: "#como-se-calcula .envol", titulo: "Cómo se calcula (baremo 2026)", bloque: true, texto: "La cantidad depende de tus informes médicos: el abogado la calcula con ellos." },
      calculo: "baremo",
      indemnizacion: "baremo",
      como: { sel: ".pasos", titulo: "Cómo trabajamos", texto: `Te orienta ${N.tecnico}, el abogado estudia tu caso en la primera consulta y, si sigues adelante, reclamamos a la aseguradora con honorarios por escrito.` },
      plazo: { sel: "#faqLista", titulo: "Plazos", texto: "Hay un año para reclamar; en lesiones suele contar desde el alta médica y se interrumpe al reclamar por escrito. Cómo se cuenta en tu caso lo revisa el abogado." },
      oferta: { sel: ".urgencia", titulo: "Antes de firmar", texto: "No firmes un finiquito ni aceptes una oferta definitiva sin que la vea el abogado. Cobrar a cuenta no es lo mismo que firmar un finiquito." },
      zona: { sel: "#zonaCaja", titulo: "Dónde te atendemos", texto: `En ${N.zona}, ${lista(N.modalidades)}.` },
      situaciones: { sel: "#listaAparatos", titulo: "Te ayudamos con", texto: may(lista(N.servicios.slice(0, 5))) + "." },
      contacto: { solicitud: true }, llamada: { solicitud: true }, formulario: { solicitud: true }, preparar: { solicitud: true }, documentos: { solicitud: true }
    },

    // ---- tarjeta final al enviar la solicitud ----
    final: {
      principal: { titulo: "¡Listo! Consulta pedida", pasos: ["Te llamamos para confirmar el día y la hora de la consulta.", "El abogado revisa contigo lo que tengas y te dice con franqueza qué ve y qué costaría, por escrito.", "Mientras, sigue con el médico y no firmes nada de la aseguradora."] },
      llamada: { titulo: "¡Listo! Te llama un abogado", pasos: ["Te llama un abogado en horario de despacho (" + N.horario + ")."] }
    },
    revelar: [],
    legal: {
      actividad: "es un servicio de abogados que reclama indemnizaciones por accidentes de tráfico en la provincia de " + N.provincia + ". Los casos los estudia y los lleva siempre un abogado colegiado; la web no ofrece servicios a quien no los ha pedido.",
      colegio: N.colegio + " y número de colegiado del abogado responsable",
      orienta: "Te orienta de forma general (qué hacer después del accidente, qué guardar, cómo funciona la reclamación) y organiza la primera consulta, pero no es un abogado, no da asesoramiento jurídico y no dice cuánto vas a cobrar.",
      decide: "tu caso, las cantidades y los plazos los estudia siempre un abogado con tus informes",
      precios: [
        "La primera consulta es " + N.consulta.precio.toLowerCase() + " y sin compromiso.",
        "Los honorarios se pactan por escrito en una hoja de encargo antes de empezar: " + H.modelo + ".",
        "Nadie puede garantizar el resultado de una reclamación: no prometemos cantidades."
      ],
      datosCaso: "lo que pasó en el accidente, cómo ibas, la fecha, si hay parte o atestado, la oferta de la aseguradora y si tu póliza tiene defensa jurídica",
      datosSalud: "solo los imprescindibles para preparar la consulta: si te ha visto un médico y si sigues de baja, en rehabilitación o ya tienes el alta. El asistente te pide permiso antes de apuntarlos y puedes no darlos: la consulta se pide igual. No te pedimos informes médicos ni fotos de lesiones por la web; los ve el abogado en la consulta.",
      cita: "la primera consulta",
      conserva: "Los datos de un caso encargado, mientras dure y los plazos legales de conservación (hasta seis años para la facturación). Los datos de salud de una consulta que no sigue adelante se borran al terminarla."   // PENDIENTE: confirmar plazos de conservación con el despacho
    },
    schema: { tipo: "LegalService", descripcion: "Abogados de accidentes de tráfico en Granada y provincia: reclamación de lesiones a la aseguradora, revisión de ofertas, pasajeros, peatones, ciclistas y motoristas.", area: "Provincia de Granada", precio: "€€", horas: ["Mo-Fr 09:00-14:00", "Mo-Fr 16:30-19:30"] }
  };
}
