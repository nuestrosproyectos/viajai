// =====================================================================
//  WEB DE REPARO (reparación de electrodomésticos, Granada) · lo que la hace distinta:
//  textos, aparatos con su foto, campos de la solicitud, mapa de la visita, ruta de la
//  furgoneta, manual de códigos de error y venta de aparato nuevo.
//  El diseño, la conversación, la voz y la llamada salen de fabrica/plantilla/.
//  Después de cambiar algo:  node fabrica/construir.mjs reparacion
//  (Las páginas legales de Reparo son propias: aviso-legal.html y privacidad.html se editan a mano.)
// =====================================================================
import { lista } from "./cerebro.mjs";

const may = t => t.charAt(0).toUpperCase() + t.slice(1);

export default function web(N) {
  const precio = N.visita.precio.replace(/\s*€/, "");
  const garantia = (N.garantia.match(/^\d+\s+\w+/) || ["3 meses"])[0];
  return {
    id: "reparacion",
    tituloPagina: `Reparación de electrodomésticos en ${N.ciudad} · ${N.marca}`,
    descripcion: `¿Se te ha averiado la lavadora, el frigorífico o el horno? Cuéntaselo a ${N.tecnico} y te reserva la visita del técnico en ${N.ciudad} en 24-48 h. Todas las marcas. Visita y presupuesto: ${N.visita.precio}, que se descuentan si reparas.`,
    og: { titulo: `${N.marca} · Reparación de electrodomésticos en ${N.ciudad}`, descripcion: `Habla con ${N.tecnico}, nuestro asistente: te dice qué le pasa a tu aparato y te reserva la visita. Todas las marcas.` },
    // web publicada: servidor del técnico y llamada de voz (servidor/ y agente/ de Reparo)
    servidor: "/api", livekit: "/api/livekit-token",
    colorTema: "#FFFFFF",
    icono: "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%231F5FAD'/%3E%3Ccircle cx='16' cy='17' r='8' fill='none' stroke='%23fff' stroke-width='2.6'/%3E%3Ccircle cx='16' cy='17' r='3.6' fill='%23fff'/%3E%3C/svg%3E",
    logo: '<circle cx="16" cy="17" r="9" stroke="#FFFDF8" stroke-width="2.6"/><circle cx="16" cy="17" r="4.2" fill="#FFFDF8"/><rect x="7" y="4" width="7" height="2.6" rx="1.3" fill="#FFFDF8"/>',
    fuentes: [
      { familia: "Atkinson Hyperlegible Next", archivo: "fuentes/atkinson.min.woff2", pesos: "400 700", precargar: true, primero: true },
      { familia: "Archivo", archivo: "fuentes/archivo.min.woff2", pesos: "700 800", stretch: "112%" }
    ],
    textos: {
      previa: "Vista previa · <b>teléfono, precios y nombre son provisionales</b> hasta que los confirmes",
      subtituloLogo: `<span class="solo-ordenador">Electrodomésticos · </span><span data-n="ciudad">${N.ciudad}</span>`,
      sobretitulo: `Servicio técnico a domicilio · <span data-n="ciudad">${N.ciudad}</span>`,
      urgencia: { texto: "¿Sale agua o huele a quemado? <b>Corta la luz.</b>", boton: "Llámanos ya", icono: '<path d="M12 2.7 3 7v5c0 5 3.8 9.3 9 10 5.2-.7 9-5 9-10V7z"/><path d="M12 8v5M12 16.5v.5"/>' },
      titularFijo: "¿Se te ha averiado", titularAria: "¿Se te ha averiado un electrodoméstico?",
      gira: ["un electrodoméstico", "una lavadora", "un frigorífico", "un lavavajillas", "una secadora", "un horno", "un calentador", "la vitrocerámica", "el aire acondicionado"],
      entrada: `Técnico en tu casa en 24-48 h, en <span data-n="ciudad">${N.ciudad}</span> y alrededores. Todas las marcas.`,
      precioLinea: `<span>Visita y presupuesto: <b id="precioLinea">${N.visita.precio}</b>.</span> <span>Se descuentan si reparamos.</span>`,
      asistenteQuien: "Asistente con inteligencia artificial, formado con el oficio de técnicos con más de 35 años en todas las marcas.",
      asistenteSaludo: "Cuéntame qué le pasa a tu aparato: te digo qué puede ser y te reservo la visita del técnico.",
      asistenteNota: `<span data-n="tecnico">${N.tecnico}</span> es un asistente con inteligencia artificial. Los técnicos que van a tu casa son profesionales de nuestra red.`,
      llamame: "¿Prefieres que te llamemos? Déjanos tu teléfono ›",
      confianza: [
        ["persona", `<b data-n="experienciaCorta">${N.experienciaCorta}</b> de oficio`],
        ["documento", "<b>Presupuesto cerrado</b> antes de tocar nada"],
        ["escudo", `<b>Garantía por escrito</b> de ${garantia}`]
      ],
      situaciones: {
        antetitulo: "Toda la gama blanca, todas las marcas", titulo: "¿Qué aparato se ha <em>averiado</em>?",
        bajada: `Toca tu aparato y <span data-n="tecnico">${N.tecnico}</span> te pregunta qué le pasa.`,
        nota: `También reparamos ${lista(N.climaYCalefaccion.aparatos)} en las zonas con técnico habilitado. No reparamos ${lista(N.noReparamos)}.`,
        despues: `<div class="zona-caja" id="marcasCaja"><b>Marcas</b><p class="marcas-txt" id="marcasLista">Todas. Entre otras: ${N.marcas.join(", ")}.</p><p class="aviso-indep"><span data-n="marca">${N.marca}</span> es un servicio técnico independiente, no oficial. Los nombres de los fabricantes solo indican con qué aparatos trabajamos.</p></div>`
      },
      zona: { titulo: "Dónde vamos", texto: `${N.zona}. Si estás fuera, pregúntale a ${N.tecnico}: te confirmamos si llegamos.` },
      como: {
        antetitulo: "Así de fácil", titulo: "Tres pasos y el técnico <em>en tu puerta</em>.",
        pasos: [
          ["Cuéntale qué le pasa", "Hablando o escribiendo, con tus palabras. Si sale un código en la pantalla, díselo."],
          ["Te dice qué puede ser", "Te explica la causa más probable en tu marca y te reserva la visita."],
          ["Vamos a tu casa", "Te llamamos para confirmar la hora. El técnico va con la pieza que suele fallar."]
        ]
      },
      precios: {
        antetitulo: "Precios claros", titulo: "Sabes lo que pagas <em>antes</em> de pagarlo.",
        cifra: precio + "<small>€</small>",
        tarifa: "Visita y presupuesto a domicilio",
        detalle: "Son 50 € más IVA. Cubre el desplazamiento del técnico y la elaboración del presupuesto cerrado. Si no te convence, solo pagas la visita.",
        descuento: "Si decides reparar, se descuentan de la factura",
        lista: [
          "<b>Presupuesto cerrado</b> antes de tocar nada. Sin sorpresas.",
          `<b>Garantía por escrito</b> de ${garantia} en pieza y mano de obra.`,
          `<b>Pago al terminar</b> con ${N.pago.replace(/ al terminar$/, "")}.`,
          `<b>¿No compensa repararlo?</b> Te vendemos uno nuevo: <span data-n="ventaNuevo">${N.ventaNuevo}</span>.`
        ]
      },
      preguntas: { antetitulo: "Preguntas frecuentes", titulo: "Lo que nos preguntáis <em>siempre</em>." },
      contacto: {
        titulo: "¿Prefieres que <em>te llamemos</em>?",
        texto: `Déjanos tu teléfono y te llamamos en horario de atención (<span id="horarioTxt">${N.horario}</span>). O llámanos tú:`,
        form: "Que me llame un técnico", queNecesitas: "¿Qué le pasa? (opcional)", ejemplo: "La lavadora no centrifuga…",
        legal: "Usaremos tu teléfono solo para atender esta avería.", ok: "Te llamamos para confirmar la hora, dentro del horario de atención."
      },
      panel: { texto: `Los avisos que registra ${N.tecnico} y las peticiones de llamada aparecen aquí al momento.`, columnas: ["Aparato y avería", "Dirección y franja"] },
      pie: {
        descripcion: `Servicio técnico independiente de reparación de electrodomésticos a domicilio en <span data-n="ciudad">${N.ciudad}</span> y área metropolitana.`,
        aviso: `${N.tecnico} es un sistema de inteligencia artificial; puede equivocarse. El diagnóstico definitivo lo hace el técnico.`,
        horario: "El equipo te atiende " + N.horario + `. ${N.tecnico}, a cualquier hora.`
      },
      horarioFranja: "Lunes a viernes de 9:00 a 20:00 · Sábados de 9:00 a 14:00",
      escenario: { pequeño: "Aviso de reparación", aria: "Tu solicitud de visita" },
      fases: ["Avería", "Qué puede ser", "Visita", "Tus datos", "Listo"],
      botonEnviar: "Sí, está bien: pedir la visita",
      botonCita: "Quiero la visita del técnico",
      convNota: `<span data-n="tecnico">${N.tecnico}</span> es un asistente con inteligencia artificial. El diagnóstico definitivo lo hace el técnico.`,
      fotoAria: "Enviar una foto de la placa o del error",
      chips: ["La lavadora no centrifuga", "El frigorífico no enfría", "Me sale un código de error", "Quiero que venga un técnico"],
      orientacion: "Qué puede ser: ",
      escEstado: { rellenando: "Se rellena mientras hablas", lista: "Lista: confírmala y te llamamos", enviada: "Solicitud enviada" },
      waInicial: "Hola, tengo una avería en mi electrodoméstico. ¿Cuándo podéis venir?",
      waAviso: { principal: "una visita", llamada: "que me llaméis", venta: "información para comprar un aparato nuevo" },
      trasLlamada: "Tus datos siguen en «Tu solicitud»: si está todo bien, pulsa «pedir la visita»."
    },
    fotos: {
      portada: { src: "media/foto-lavadora.jpg", alt: "Técnico reparando una lavadora en una cocina", ancho: 1200, alto: 900 },
      trabajo: [
        { src: "media/foto-presupuesto.jpg", alt: "Técnico enseñando un presupuesto a una clienta", pie: "Antes de tocar nada, te damos el presupuesto cerrado." },
        { src: "media/foto-comprobacion.jpg", alt: "Técnico comprobando una bomba de desagüe con un polímetro", pie: "Comprobamos la pieza antes de cambiarla." },
        { src: "media/foto-frigorifico.jpg", alt: "Técnico revisando la parte de atrás de un frigorífico", pie: "Lavadoras, frigoríficos, lavavajillas, hornos y más." }
      ]
    },
    iconos: {
      lavadora: '<rect x="8" y="5" width="32" height="38" rx="4"/><path d="M8 14h32"/><circle cx="24" cy="29" r="9"/><path d="M18.5 30.5c2-1.6 4.2-1.6 6 0s4 1.6 6 0"/><circle cx="14" cy="9.5" r="1.2"/><path d="M28 9.5h7"/>',
      frigorifico: '<rect x="11" y="3" width="26" height="42" rx="4"/><path d="M11 18h26M16 9v5M16 23v8"/>',
      lavavajillas: '<rect x="8" y="5" width="32" height="38" rx="4"/><path d="M8 13h32M14 22h20M14 30h20M17 22v8M24 22v8M31 22v8"/><path d="M30 9h5"/>',
      horno: '<rect x="6" y="7" width="36" height="34" rx="4"/><path d="M6 15h36"/><rect x="12" y="20" width="24" height="15" rx="2"/><circle cx="13" cy="11" r="1.4"/><circle cx="19" cy="11" r="1.4"/><path d="M28 11h8"/>',
      placa: '<rect x="4" y="12" width="40" height="24" rx="4"/><circle cx="15" cy="21" r="4.5"/><circle cx="31" cy="21" r="3.5"/><circle cx="24" cy="29.5" r="3"/><path d="M36 32h3"/>',
      secadora: '<rect x="8" y="5" width="32" height="38" rx="4"/><path d="M8 14h32"/><circle cx="24" cy="29" r="9"/><path d="M20 27c1.5-2 3-2 4 0s2.5 2 4 0M20 31.5c1.5-2 3-2 4 0s2.5 2 4 0"/><circle cx="14" cy="9.5" r="1.2"/>',
      termo: '<rect x="13" y="4" width="22" height="34" rx="11"/><path d="M19 38v6M29 38v6M24 14v10"/><circle cx="24" cy="27" r="3"/>',
      campana: '<path d="M18 4h12v12H18zM8 30l10-14h12l10 14z"/><path d="M8 30h32v4H8zM16 38v4M24 38v4M32 38v4"/>'
    },
    // [icono, nombre, lo que se le pregunta a Andrés al tocarlo, foto]
    situaciones: [["lavadora", "Lavadora"], ["frigorifico", "Frigorífico"], ["lavavajillas", "Lavavajillas"], ["horno", "Horno y microondas"], ["placa", "Vitro e inducción"], ["secadora", "Secadora"], ["termo", "Termo eléctrico"], ["campana", "Campana"]]
      .map(([ic, nom]) => [ic, nom, `Tengo una avería en mi ${nom.toLowerCase()}`, `media/aparato-${ic}.jpg`]),

    // ---- la solicitud que rellena Andrés (mismos nombres que la <ficha> de sus instrucciones) ----
    campos: [
      { id: "aparato", etiqueta: "Aparato", visible: true, grupo: "caso", lista: ["Lavadora", "Lavadora-secadora", "Secadora", "Lavavajillas", "Frigorífico", "Congelador", "Horno", "Vitrocerámica", "Placa de inducción", "Campana", "Microondas", "Termo eléctrico", "Aire acondicionado", "Caldera"] },
      { id: "marca", etiqueta: "Marca", grupo: "caso", lista: N.marcas },
      { id: "averia", etiqueta: "¿Qué le pasa?", corto: "Avería", visible: true, grupo: "caso" },
      { id: "nombre", etiqueta: "Nombre", visible: true, autocomplete: "given-name" },
      { id: "telefono", etiqueta: "Teléfono", visible: true, tipo: "tel" },
      { id: "direccion", etiqueta: "Dirección", visible: true, autocomplete: "street-address" },
      { id: "municipio", etiqueta: "Pueblo o barrio", corto: "Municipio", visible: true, autocomplete: "address-level2" },
      { id: "franja", etiqueta: "Cuándo te viene bien", corto: "Cuándo", visible: true },
      { id: "codigo", oculto: true },
      { id: "modelo", oculto: true }
    ],
    obligatorios: [["telefono", "teléfono"], ["nombre", "nombre"], ["municipio", "municipio"], ["averia", "avería"]],
    obligatoriosTipo: { venta: [["telefono", "teléfono"], ["nombre", "nombre"], ["municipio", "municipio"], ["aparato", "aparato que busca"]] },
    campoResumen: "averia",
    fichaAlias: { sintoma: "averia" },   // en la <ficha> de Reparo la avería se llama «sintoma»
    campoOrientacion: "diagnostico",
    tipoPrincipal: "visita",
    tiposExtra: ["venta"],
    resumenAviso: [["aparato", ""], ["marca", ""], ["averia", ""]],
    panelLugar: ["direccion", "municipio", "franja"],
    panelExtra: ["codigo", "modelo"],

    // ---- piezas opcionales de la plantilla que usa Reparo ----
    manual: true,   // manual.mjs + conocimiento.mjs: fichas de averías y códigos de error por marca
    mapa: {
      provincia: "Granada",
      esperaTitulo: "Aquí verás dónde irá el técnico", esperaTexto: "En cuanto digas la dirección, aparece el mapa.",
      zonaTitulo: "Dónde vamos", zonaTexto: `${N.ciudad} y alrededores. Cuando digas tu dirección, el mapa te lleva a tu calle.`,
      visitaTitulo: "El técnico irá aquí"
    },

    // ---- lo que Andrés puede «señalar» con <mostrar>destino</mostrar> ----
    destinos: {
      precios: { sel: ".tarifa", titulo: "Precio de la visita", texto: `${N.visita.precio}: ${N.visita.detalle}. Antes de reparar, presupuesto cerrado.` },
      garantia: { sel: ".lista-ok", titulo: "Garantía", texto: `${may(N.garantia)}. Pago al terminar: ${N.pago}.` },
      como: { sel: ".pasos", titulo: "Cómo trabajamos", texto: "Te llamamos para confirmar la hora, el técnico revisa el aparato y te da un presupuesto cerrado antes de reparar." },
      marcas: { sel: "#marcasLista", titulo: "Marcas", texto: "Trabajamos con todas las marcas, entre otras " + N.marcas.slice(0, 12).join(", ") + "." },
      contacto: { solicitud: true }, llamada: { solicitud: true }, formulario: { solicitud: true },
      zona: { sel: "#zonaCaja", titulo: "Dónde vamos", texto: N.zona + "." },
      plazo: { sel: "#faqLista details", abrir: true, titulo: "Cuándo vamos", texto: may(N.plazo) + ". Te llamamos para confirmar la hora." },
      codigos: { titulo: "Códigos de error", tituloValor: "Código {VALOR}", texto: "El técnico lo confirma con el aparato delante y lleva la pieza que suele fallar." },
      codigo: "codigos",
      aparatos: { sel: "#listaAparatos", titulo: "Lo reparamos", texto: "Reparamos " + lista(N.aparatos) + "." },
      aparato: "aparatos"
    },

    // ---- tarjeta final al enviar la solicitud ----
    final: {
      principal: {
        titulo: "¡Listo! Visita pedida",
        pasos: ["Te llamamos para confirmar la hora exacta.", "El técnico revisa el aparato y te da un presupuesto cerrado.", "Si reparamos, la visita se descuenta de la factura."],
        ruta: { origen: "Taller", texto: "Tu técnico pasará", plazo: "en 24-48 h" }
      },
      llamada: { titulo: "¡Listo! Te llamamos", pasos: ["Te llamamos en horario de atención (" + N.horario + ")."] },
      venta: { titulo: "¡Listo! Te llamamos con opciones", pasos: ["Te llamamos con opciones y precio del aparato nuevo.", "Te lo llevamos, lo instalamos y nos llevamos el viejo."] }
    },

    schema: { tipo: "LocalBusiness", descripcion: `Servicio técnico independiente de reparación de electrodomésticos a domicilio en ${N.ciudad} y área metropolitana. Todas las marcas.`, area: N.ciudad, precio: "€€", horas: ["Mo-Fr 09:00-20:00", "Sa 09:00-14:00"] }
  };
}
