// =====================================================================
//  WEB DE PLACAS SOLARES · lo que la hace distinta (textos, situaciones, solicitud,
//  lo que hay que preparar, fotos, letras y destinos). El resto sale de fabrica/plantilla/.
//  Después de cambiar algo:  node fabrica/construir.mjs placas-solares
//  Fuentes de textos: estudio/estudio-marca-diseno.md. Precios, ayudas y normas: SOLO
//  conocimiento/resumen-para-andres.md (si el estudio dice otra cosa, manda el conocimiento).
// =====================================================================
import { lista } from "./cerebro.mjs";
const may = t => t.charAt(0).toUpperCase() + t.slice(1);

export default function web(N) {
  const gratis = /gratis/i.test(N.estudio.precio);
  return {
    id: "placas-solares",
    tituloPagina: `Placas solares en ${N.provincia}: estudio ${gratis ? "gratis " : ""}y precio claro · ${N.marca}`,
    descripcion: `Placas solares para casas, comunidades y negocios en ${N.provincia}. Habla con ${N.tecnico}, nuestro asistente: con lo que pagas de luz te dice cuántas placas harían falta y lo que costarían, y te reserva el estudio${gratis ? " gratuito" : ""} en tu tejado.`,
    og: { titulo: `${N.marca} · Placas solares en ${N.provincia}`, descripcion: "Cuántas placas, cuánto cuestan y cuánto ahorrarías, antes de firmar nada. Estudio y visita técnica gratis, presupuesto cerrado por escrito.", imagen: "media/compartir.jpg" },
    colorTema: "#F3F6F9",
    icono: "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%230E1A2B'/%3E%3Ccircle cx='21' cy='11' r='4.5' fill='%23F5C431'/%3E%3Cpath d='M5 25 16 14l11 11' fill='none' stroke='%23fff' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
    // logotipo: el sol (amarillo de Andrés) asomando por detrás de la línea de un tejado a dos aguas
    logo: '<circle cx="21" cy="11" r="4.5" fill="#F5C431"/><path d="M5 25 16 14l11 11" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 25h11" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity=".55"/>',
    fuentes: [
      { familia: "Red Hat Display", archivo: "fuentes/red-hat-display.woff2", pesos: "300 900" },
      { familia: "Red Hat Text", archivo: "fuentes/red-hat-text.woff2", pesos: "300 700", primero: true }
    ],
    textos: {
      previa: "Vista previa · <b>marca, teléfono y condiciones provisionales</b>",
      subtituloLogo: `<span class="solo-ordenador">Placas solares · </span><span data-n="provincia">${N.provincia}</span>`,
      sobretitulo: `Autoconsumo para casas, comunidades y negocios · <span data-n="provincia">${N.provincia}</span>`,
      urgencia: null,
      titularFijo: "Placas solares en", titularAria: `Placas solares en tu tejado, en ${N.provincia}, con las cuentas claras desde el principio`,
      gira: ["tu tejado", "tu azotea", "tu comunidad", "tu negocio", "tu cortijo"],
      entrada: "Con las cuentas claras desde el principio: cuántas placas, cuánto cuestan y lo que seguirás pagando, antes de firmar nada.",
      precioLinea: `<span>Estudio y visita técnica: <b id="precioLinea">${gratis ? "gratis" : N.estudio.precio}</b>.</span> <span>Presupuesto cerrado, por escrito.</span>`,
      asistenteQuien: "Asistente con IA, formado por instaladores.",
      asistenteSaludo: "Dime más o menos cuánto pagas de luz al mes: te digo cuántas placas harían falta, lo que costarían y te reservo el estudio en tu tejado.",
      asistenteNota: `<span data-n="tecnico">${N.tecnico}</span> es un asistente con inteligencia artificial: orienta con cifras de mercado; el tamaño y el precio cerrado salen del estudio de un técnico.`,
      llamame: "¿Prefieres que te llamemos? Déjanos tu teléfono ›",
      confianza: [
        ["sol", `<b>Estudio y visita técnica ${gratis ? "gratis" : ""}</b>, sin compromiso`],
        ["documento", "<b>Presupuesto cerrado por escrito</b> antes de firmar"],
        ["escudo", "<b>Te atiende una sola empresa:</b> tu teléfono no se reparte"]
      ],
      situaciones: { antetitulo: "Cada tejado es distinto", titulo: "¿Dónde quieres <em>las placas</em>?", bajada: `Toca lo tuyo y <span data-n="tecnico">${N.tecnico}</span> te dice tamaño, precio orientativo y qué hace falta en tu caso.` },
      zona: { titulo: "Dónde trabajamos", texto: "En " + N.zona + "." },
      datos: { id: "precios-orientativos", antetitulo: "Precios orientativos en Granada", titulo: "Lo que cuesta y lo que tarda <em>en pagarse</em>." },
      como: {
        antetitulo: "Así trabajamos", titulo: "Tres pasos y tus placas <em>legalizadas</em>.",
        pasos: [
          [`Hablas con ${N.tecnico}`, "Le dices cuánto pagas de luz y dónde irían las placas. Te da un tamaño y un precio orientativos al momento."],
          [`Estudio y visita técnica${gratis ? ", gratis" : ""}`, `Un técnico sube a tu tejado o azotea, mide y mira orientación, sombras y cuadro eléctrico. Con tus facturas calcula cuántas placas y dónde, ${N.estudio.duracion}.`],
          ["Presupuesto, montaje y papeles", `El presupuesto cerrado te llega por escrito ${N.plazoPresupuesto}. Si te convence, montamos y hacemos los trámites: boletín, legalización ante la Junta y permiso del ayuntamiento.`]
        ]
      },
      precios: {
        antetitulo: "Sin sorpresas", titulo: "Sabes lo que cuesta <em>antes</em> de firmar.",
        cifra: gratis ? "0<small>€</small>" : N.estudio.precio.replace(/\s*€/, "") + "<small>€</small>",
        tarifa: "Estudio y visita técnica", detalle: may(N.estudio.detalle) + ".",
        descuento: "Decides con el presupuesto por escrito delante",
        lista: [
          "<b>Presupuesto cerrado por escrito:</b> cuántas placas, dónde van, cuánto cuesta y el ahorro estimado con tus facturas.",
          "<b>Sin promesas de factura cero:</b> te enseñamos lo que seguirás pagando (potencia, contador, impuestos y la luz de la noche).",
          "<b>Los trámites los hacemos nosotros:</b> boletín, legalización ante la Junta y declaración responsable del ayuntamiento.",
          `<b>${may(N.garantia)}.</b>`
        ]
      },
      preguntas: { antetitulo: "Preguntas frecuentes", titulo: "Lo que más nos <em>preguntáis</em>." },
      contacto: {
        titulo: "¿Prefieres que <em>te llamemos</em>?",
        texto: `Déjanos tu teléfono y te llamamos en horario de oficina (<span id="horarioTxt">${N.horario}</span>). O llámanos tú:`,
        form: "Que me llamen", queNecesitas: "¿Qué te interesa? (opcional)", ejemplo: "Placas para mi casa, una batería…",
        legal: "Usaremos tu teléfono solo para atender tu consulta. No lo pasamos a otras empresas.", ok: "Te llamamos en horario de oficina."
      },
      panel: { texto: `Los estudios que registra ${N.tecnico} y las peticiones de llamada aparecen aquí al momento.`, columnas: ["Instalación", "Municipio y cuándo"] },
      pie: {
        descripcion: `Placas solares, baterías y autoconsumo para casas, comunidades y negocios en <span data-n="provincia">${N.provincia}</span> y provincia.`,
        aviso: `${N.tecnico} es un sistema de inteligencia artificial; puede equivocarse. Los precios y ahorros que da son orientativos: el tamaño y el precio cerrado salen del estudio y van por escrito.`,
        horario: "Atendemos " + N.horario + `. ${N.tecnico}, a cualquier hora.`
      },
      horarioFranja: may(N.horario),
      escenario: { pequeño: "Solicitud de estudio gratuito", aria: "Tu solicitud de estudio" },
      fases: ["Tu caso", "Tamaño y precio", "Estudio", "Tus datos", "Listo"],
      botonEnviar: "Sí, está bien: pedir el estudio",
      convNota: `<span data-n="tecnico">${N.tecnico}</span> es un asistente con inteligencia artificial. Orienta; el precio cerrado sale del estudio.`,
      fotoAria: "Enviar una foto del tejado o de la factura",
      chips: ["¿Cuántas placas me harían falta?", "¿Cuánto cuesta poner placas en una casa?", "¿Me compensa la batería?", "¿Qué ayudas hay ahora?"],
      orientacion: "Lo que te conviene: ",
      escEstado: { rellenando: "Se rellena mientras hablas", lista: "Lista: confírmala y te llamamos", enviada: "Solicitud enviada" },
      waInicial: "Hola, quiero información para poner placas solares. ¿Podéis atenderme?",
      waAviso: { principal: "el estudio gratuito", llamada: "que me llaméis" },
      trasLlamada: "Tus datos siguen en «Tu solicitud»: si está todo bien, pulsa «pedir el estudio»."
    },
    fotos: {
      portada: { src: "media/portada.jpg", alt: "Placa solar apoyada sobre un tejado de teja árabe a pleno sol, con un jardín detrás", ancho: 1440, alto: 1080 },
      trabajo: [
        { src: "media/instalacion.jpg", alt: "Instalador con casco, de espaldas, fijando las placas de una azotea", pie: "En la visita miramos orientación, sombras y por dónde va el cable hasta el cuadro.", ancho: 1400, alto: 935 },
        { src: "media/montaje.jpg", alt: "Manos con guantes de trabajo colocando una placa sobre teja árabe", pie: "Teja, chapa o azotea: cada tejado se monta y se sella de una forma.", ancho: 1400, alto: 1050 },
        { src: "media/cargador.jpg", alt: "Conector de carga enchufado a un coche eléctrico, en plano corto", pie: "Cargar el coche de día, con sol, es lo que más aprovecha las placas.", ancho: 1000, alto: 1250 }
      ]
    },
    iconos: {
      casa: '<path d="M4 25 22 9l18 16"/><path d="M9 21v21h26V21"/><path d="M18 42V32h8v10"/><path d="M33 9.5l5.5-5 6 5.2-5.5 5z"/><path d="M35.8 7l5.7 5"/>',
      factura: '<path d="M10 5h21l7 7v31H10z"/><path d="M31 5v7h7"/><path d="M16 15h9M16 21h6"/><path d="M27 23l-6 9h5l-2 7 7-10h-5z"/>',
      comunidad: '<rect x="11" y="18" width="26" height="25"/><path d="M17 25h4M27 25h4M17 32h4M27 32h4M21 43v-5h6v5"/><path d="M11 13l5-6h9l-5 6zM24 13l5-6h9l-5 6z"/>',
      negocio: '<path d="M4 42V24l10-6v6l10-6v6l10-6v6l10-6v24z"/><path d="M4 42h40M11 34h7M21 34h7M31 34h7"/><path d="M14 11l4-5h9l-4 5zM28 11l4-5h9l-4 5z"/>',
      bateria: '<rect x="6" y="14" width="32" height="20" rx="3"/><path d="M38 20h4v8h-4"/><path d="M24 17l-6 8h5l-2 6 7-9h-5z"/><path d="M6 40h32"/>',
      coche: '<path d="M5 33v-7l4-9h19l6 9h5a3 3 0 0 1 3 3v4"/><path d="M5 33h37"/><circle cx="13" cy="34" r="4"/><circle cx="33" cy="34" r="4"/><path d="M40 6v6M44 6v6M38 12h8v3a4 4 0 0 1-8 0zM42 19v4"/>',
      ayudas: '<path d="M9 5h22l8 8v30H9z"/><path d="M31 5v8h8"/><path d="M17 35l14-14"/><circle cx="18" cy="23" r="3"/><circle cx="30" cy="33" r="3"/>',
      revision: '<path d="M4 31 11 11h23l-7 20z"/><path d="M7.5 21h23M18 11l-4 20M26 11l-4 20"/><circle cx="35" cy="33" r="6"/><path d="M39.5 37.5 44 42"/>'
    },
    situaciones: [
      ["casa", "Placas para mi casa", "Quiero poner placas solares en mi casa: ¿cuántas me harían falta?"],
      ["factura", "Pago mucho de luz", "Pago mucho de luz al mes, ¿me compensan las placas?"],
      ["comunidad", "Comunidad de vecinos", "Somos una comunidad de vecinos y queremos poner placas en la azotea"],
      ["negocio", "Negocio o nave", "Tengo un negocio y quiero bajar la factura de la luz con placas"],
      ["bateria", "Añadir batería", "Ya tengo placas y quiero saber si me compensa añadir una batería"],
      ["coche", "Cargador de coche eléctrico", "Quiero un cargador para el coche eléctrico, y si puede ser con placas"],
      ["ayudas", "Ayudas y deducciones", "¿Qué ayudas o deducciones hay ahora para poner placas en Granada?"],
      ["revision", "Revisar mi instalación", "Tengo placas pero producen poco o el inversor da error"]
    ],

    campos: [
      { id: "que", etiqueta: "Qué te interesa", corto: "Quiero", visible: true, ancho: true, grupo: "caso", lista: ["Placas solares", "Placas con batería", "Añadir batería", "Cargador de coche eléctrico", "Revisar mi instalación"] },
      { id: "lugar", etiqueta: "Dónde irían", corto: "Para", visible: true, grupo: "caso", lista: ["Casa", "Comunidad de vecinos", "Negocio o nave"] },
      { id: "factura", etiqueta: "Lo que pagas de luz al mes", corto: "Factura", visible: true, grupo: "caso", placeholder: "Unos 90 €…" },
      { id: "tejado", etiqueta: "Tejado", corto: "Tejado", placeholder: "Teja, azotea, chapa… y si mira al sur", lista: ["Teja, mirando al sur", "Teja, este u oeste", "Azotea plana", "Chapa", "Suelo o pérgola"] },
      { id: "consumo", etiqueta: "Cuándo gastas más luz", corto: "Consumo", placeholder: "De día, de noche, aire acondicionado, coche…" },
      { id: "nombre", etiqueta: "Nombre", visible: true, autocomplete: "given-name" },
      { id: "telefono", etiqueta: "Teléfono", visible: true, tipo: "tel" },
      { id: "municipio", etiqueta: "Municipio y barrio", corto: "Municipio", visible: true, autocomplete: "address-level2" },
      { id: "direccion", etiqueta: "Calle y número", corto: "Dirección", visible: true, autocomplete: "street-address", ancho: true, placeholder: "Calle, número, piso…" },
      { id: "franja", etiqueta: "Cuándo te viene bien la visita", corto: "Visita", visible: true, placeholder: "Jueves por la mañana…", ancho: true },
      { id: "inicio", oculto: true }
    ],
    obligatorios: [["telefono", "teléfono"], ["nombre", "nombre"], ["que", "qué te interesa"], ["municipio", "municipio"]],
    campoResumen: "que",
    tipoPrincipal: "estudio",
    resumenAviso: [["que", ""], ["lugar", ""], ["factura", "paga "]],
    panelLugar: ["municipio", "direccion", "franja"],
    panelExtra: ["tejado", "consumo"],

    preparar: {
      titulo: "Ten a mano para el estudio",
      nota: "Se ajusta a tu caso mientras hablas. Nada es obligatorio, pero sin facturas no hay cálculo de ahorro.",
      reglas: [
        { doc: ["Una factura de la luz reciente", "Mejor si trae el gráfico de consumo de los últimos 12 meses. Con una foto basta."] },
        { doc: ["Fotos del tejado o la azotea", "Desde varios ángulos y una desde la calle. Puedes mandarlas ya por aquí con el botón de la cámara."] },
        { doc: ["Foto del cuadro eléctrico y del contador", "Con la tapa del cuadro abierta."] },
        { campos: ["lugar"], re: "comunidad|vecin|bloque|edificio", doc: ["Número de viviendas y contacto del administrador", "Y la fecha de la próxima junta, o el acta si ya se habló del tema."] },
        { campos: ["lugar"], re: "negocio|nave|empresa|local|tienda", doc: ["CIF y horario de actividad", "Y la factura con la tarifa (3.0TD o 6.1TD)."] },
        { campos: ["que"], re: "coche|cargador|recarga", doc: ["Foto del garaje", "Y del camino aproximado hasta el cuadro eléctrico."] },
        { campos: ["que"], re: "revis|error|produc|averi|no va", doc: ["Qué marca el inversor", "Una foto de sus luces o del código que sale en la pantalla."] },
        { campos: ["municipio"], re: "albaic|realejo|centro|sacromonte|hist", doc: ["Si el edificio está protegido", "En el Albaicín, el Realejo o el centro histórico el permiso es más exigente."] },
        { doc: ["Referencia catastral", "Sale en el recibo del IBI."] },
        { doc: ["Que esté quien decide", "Si sois dos, mejor los dos en la visita."] }
      ]
    },

    destinos: {
      precios: { sel: ".tarifa", titulo: "Estudio y visita técnica", texto: `${N.estudio.precio}: ${N.estudio.detalle}.` },
      estudio: "precios", visita: "precios",
      orientativos: { sel: "#precios-orientativos .envol", titulo: "Precios orientativos en Granada", bloque: true, texto: "El precio cerrado sale del estudio." },
      cuanto: "orientativos", ahorro: "orientativos",
      como: { sel: ".pasos", titulo: "Cómo trabajamos", texto: `Te orienta ${N.tecnico}, un técnico estudia tu tejado y tus facturas y te damos el presupuesto cerrado por escrito. Si sigues, montamos y legalizamos.` },
      plazo: { sel: ".pasos", titulo: "Plazos", texto: `La visita, ${N.plazoVisita}. El presupuesto, ${N.plazoPresupuesto}. El tiempo hasta ver la compensación en la factura varía: te lo explica el técnico.` },
      garantia: { sel: ".lista-ok", titulo: "Garantías", texto: may(N.garantia) + "." },
      permisos: { sel: ".lista-ok", titulo: "Permisos y legalización", texto: "La instaladora hace el boletín y legaliza ante la Junta. En Granada capital, si el edificio no está protegido, basta una declaración responsable, y la presentamos nosotros." },
      ayudas: { sel: "#faqLista", titulo: "Ayudas y bonificaciones", texto: "Hoy no nos consta ninguna subvención directa abierta para particulares en Andalucía. Hay deducciones en la Renta para instalaciones terminadas y pagadas en 2026 (va muy justo) y, en Granada capital, bonificación del ICIO y del IBI, a solicitud." },
      zona: { sel: "#zonaCaja", titulo: "Dónde trabajamos", texto: "En " + N.zona + "." },
      situaciones: { sel: "#listaAparatos", titulo: "Hacemos", texto: may(lista(N.servicios.slice(0, 5))) + "." },
      contacto: { solicitud: true }, llamada: { solicitud: true }, formulario: { solicitud: true }, preparar: { solicitud: true }
    },

    final: {
      principal: { titulo: "¡Listo! Estudio pedido", pasos: ["Te llamamos para confirmar el día y la hora de la visita.", "Un técnico mira tu tejado, tu cuadro y tus facturas, y te explica opciones.", `Te enviamos el presupuesto cerrado y el ahorro estimado, por escrito, ${N.plazoPresupuesto}.`] },
      llamada: { titulo: "¡Listo! Te llamamos", pasos: ["Te llamamos en horario de oficina (" + N.horario + ")."] }
    },
    revelar: [],
    legal: {
      emergencia: "Ante una emergencia (humo, olor a quemado, riesgo eléctrico o peligro para alguien), llama al 112.",
      actividad: "es una empresa instaladora de placas solares, baterías y autoconsumo que trabaja en la provincia de " + N.provincia + ". Los estudios, los presupuestos y las instalaciones los hace siempre el equipo de la empresa.",
      orienta: "Te orienta de forma general sobre tu instalación (tamaño, precios orientativos, ahorro estimado, trámites y ayudas) y organiza el estudio y la visita técnica.",
      decide: "el tamaño de la instalación, el precio cerrado y el ahorro estimado los decide siempre un técnico después del estudio",
      precios: ["El estudio y la visita técnica son " + N.estudio.precio.toLowerCase() + " y sin compromiso.", "Los precios y ahorros que figuran en la web son orientativos; el precio vinculante es el del presupuesto firmado.", "Las instalaciones tienen las garantías que figuren en el presupuesto y el contrato, además de las que marque la ley."],
      datosCaso: "lo que te interesa instalar, dónde, lo que pagas de luz, cómo es tu tejado y lo que nos cuentes de tu consumo", cita: "el estudio y la visita técnica",
      conserva: "Los datos de una instalación contratada, mientras duren las garantías y los plazos legales de facturación (hasta seis años)."
    },
    schema: { tipo: "HomeAndConstructionBusiness", descripcion: "Placas solares y autoconsumo para casas, comunidades de vecinos y negocios en Granada y provincia, con estudio gratuito y presupuesto cerrado por escrito.", area: "Provincia de Granada", precio: "€€", horas: ["Mo-Fr 08:30-14:00", "Mo-Fr 16:00-19:00"] }
  };
}
