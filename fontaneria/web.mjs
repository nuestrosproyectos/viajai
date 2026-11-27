// =====================================================================
//  WEB DE FONTANERÍA Y DESATASCOS · lo que la hace distinta (textos, situaciones, aviso,
//  lo que hay que preparar, fotos, letras y destinos). El resto sale de fabrica/plantilla/.
//  Después de cambiar algo:  node fabrica/construir.mjs fontaneria
//  Fuentes de textos y precios: estudio/estudio-marca-diseno.md y conocimiento/ (manda el conocimiento).
//  La urgencia manda: aviso «¿Sale agua ahora?» arriba del todo con «Llámanos», y Andrés
//  da primero el consejo de seguridad (llave de paso, luz, sosa, gas) y luego cierra la visita.
// =====================================================================
import { lista } from "./cerebro.mjs";
const may = t => t.charAt(0).toUpperCase() + t.slice(1);
const euros = t => t.replace(/^unos\s+/, "").replace(/\s*a\s*/, "–").replace(/\s*€$/, "");

export default function web(N) {
  const T0 = N.tarifas, M = N.mercado;
  const salida = T0.salida || M.salida;                       // tarifa propia o, mientras no la haya, la de mercado
  const propia = !!T0.salida;
  const recargo = T0.recargo || M.recargo;
  return {
    id: "fontaneria",
    tituloPagina: `Fontanero urgente y desatascos 24 h en ${N.ciudad} · ${N.marca}`,
    descripcion: `Fugas, atascos, cisternas y termos en ${N.ciudad} y su área metropolitana, ${N.urgencias}. ${N.tecnico}, nuestro asistente, te dice qué hacer mientras llegamos y te manda al fontanero, con el precio de salida antes de ir.`,
    og: { titulo: `${N.marca} · Fontanería y desatascos 24 h en ${N.ciudad}`, descripcion: "¿Sale agua? Cierra la llave de paso y llámanos. Precio de salida antes de ir y presupuesto por escrito antes de empezar.", imagen: "media/compartir.jpg" },
    colorTema: "#FFFFFF",
    icono: "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%230E1A24'/%3E%3Cpath d='M4 22h24' stroke='%235FC9DC' stroke-width='4'/%3E%3Cpath d='M16 21V10' stroke='%23fff' stroke-width='3'/%3E%3Cpath d='M9 8h14' stroke='%23FF5A5F' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E",
    // logotipo: la llave de paso vista de frente (maneta en T roja sobre la tubería de agua)
    logo: '<path d="M3.5 22.5h25" stroke="#5FC9DC" stroke-width="4" stroke-linecap="round"/><rect x="12" y="17.5" width="8" height="10" rx="2" fill="#FFFFFF"/><path d="M16 18V9.5" stroke="#FFFFFF" stroke-width="3"/><path d="M8.5 7.5h15" stroke="#FF5A5F" stroke-width="4.5" stroke-linecap="round"/>',
    fuentes: [
      { familia: "Archivo", archivo: "fuentes/archivo.woff2", pesos: "100 900", stretch: "62% 125%" },
      { familia: "Public Sans", archivo: "fuentes/public-sans.woff2", pesos: "100 900", primero: true }
    ],
    textos: {
      previa: "Vista previa · <b>marca, teléfono y tarifas provisionales</b>",
      subtituloLogo: `<span class="solo-ordenador">Fontanería y desatascos · </span><span data-n="ciudad">${N.ciudad}</span> · 24 h`,
      sobretitulo: `Fontanería y desatascos 24 h · <span data-n="ciudad">${N.ciudad}</span> y área`,
      urgencia: { icono: "gota", texto: "<b>¿Sale agua ahora?</b> Cierra la llave de paso y llámanos, a cualquier hora.", boton: "Llámanos" },
      titularFijo: "Te ayudamos ya con", titularAria: `Fontanero urgente en ${N.ciudad}: te ayudamos ya con tu fuga, tu atasco o tu avería`,
      gira: ["esa fuga", "el atasco", "el váter", "la cisterna", "el termo", "la bajante"],
      entrada: `${N.tecnico} te dice qué hacer mientras llegamos y avisa al fontanero, de día o de noche.`,
      precioLinea: `<span>Salida ${propia ? "" : "orientativa "}en horario normal: <b id="precioLinea">${euros(salida)} €</b>.</span> <span>Te la decimos antes de ir.</span>`,
      asistenteQuien: "Asistente con IA, formado por fontaneros.",
      asistenteSaludo: "Dime qué pasa: primero te digo qué cerrar y luego te mando al fontanero, ahora o el día que te venga bien.",
      asistenteNota: `<span data-n="tecnico">${N.tecnico}</span> es un asistente con inteligencia artificial: orienta y toma nota; el diagnóstico y el precio los da el fontanero.`,
      llamame: "¿Prefieres que te llamemos? Déjanos tu teléfono ›",
      confianza: [
        ["reloj", "<b>Urgencias 24 h</b>, todos los días del año"],
        ["euro", "<b>Salida antes de ir</b> y presupuesto por escrito antes de empezar"],
        ["garantia", "<b>Factura y garantía</b> de la reparación, por escrito"]
      ],
      situaciones: { antetitulo: "Dinos qué pasa", titulo: "¿Qué te <em>pasa</em>?", bajada: `Toca lo tuyo y <span data-n="tecnico">${N.tecnico}</span> te dice qué hacer ya, qué suele costar y cuándo podemos ir.` },
      zona: { titulo: "Dónde vamos", texto: `A ${N.zona}. Urgencias ${N.urgencias}.` },
      datos: { id: "precios-orientativos", antetitulo: "Precios orientativos", titulo: "¿Cuánto <em>suele costar</em>?" },
      como: {
        antetitulo: "Mientras llegamos", titulo: "Tres cosas que <em>hacer ya</em>.",
        pasos: [
          ["Cierra la llave de paso", "La de tu casa suele estar en la cocina, el baño o junto al contador; si no cierra, la del contador. Recoge el agua y haz fotos para el seguro."],
          ["Aparta el agua de la luz", "Si llega a enchufes o al cuadro, baja el general solo si llegas sin pisar agua. Si no, no lo toques y llama al 112."],
          ["Atasco: nada de sosa", "La sosa cáustica quema la piel, daña las tuberías de plástico y puede empeorar el atasco. Si ya la has echado, díselo al fontanero."]
        ]
      },
      precios: {
        antetitulo: "Sin sorpresas", titulo: "El precio, <em>antes</em> de empezar.",
        cifra: euros(salida) + "<small>€</small>",
        tarifa: propia ? "Salida del fontanero en horario normal" : "Salida del fontanero · referencia de mercado en Granada",
        detalle: `Te decimos la salida antes de ir. De noche, en fin de semana o festivo ${recargo}, y también te lo decimos antes de salir.`,
        descuento: "Presupuesto por escrito antes de empezar, también en urgencias",
        lista: [
          "<b>No pagas lo que no has aceptado:</b> el presupuesto va por escrito antes de tocar nada.",
          "<b>La salida se cobra una vez</b> por servicio.",
          "<b>Factura detallada</b> con mano de obra, materiales e IVA.",
          `<b>${may(N.garantia)}.</b>`,
          "<b>Hojas de reclamaciones</b> en papel y electrónicas, como toda empresa en Andalucía."
        ]
      },
      preguntas: { antetitulo: "Preguntas frecuentes", titulo: "Lo que más nos <em>preguntáis</em>." },
      contacto: {
        titulo: "¿Prefieres que <em>te llamemos</em>?",
        texto: `Déjanos tu teléfono y te llamamos lo antes posible. Si es urgente, llámanos tú, a cualquier hora:`,
        form: "Que me llamen", queNecesitas: "¿Qué te pasa? (opcional)", ejemplo: "Fuga bajo el fregadero, váter atascado…",
        legal: "Usaremos tu teléfono solo para atender tu aviso.", ok: "Te llamamos lo antes posible. Si sale agua, cierra la llave de paso."
      },
      panel: { texto: `Los avisos que registra ${N.tecnico} y las peticiones de llamada aparecen aquí al momento. Los urgentes, marcados.`, columnas: ["Avería", "Municipio y cuándo"] },
      pie: {
        descripcion: `Fontanería, desatascos y urgencias 24 h en <span data-n="ciudad">${N.ciudad}</span> y su área metropolitana.`,
        aviso: `${N.tecnico} es un sistema de inteligencia artificial; puede equivocarse. Los precios que da son orientativos: el precio sale del presupuesto escrito del fontanero. Si huele a gas o hay peligro, llama al 112.`,
        horario: `Urgencias ${N.urgencias}. Oficina ${N.horario}.`
      },
      horarioFranja: `Urgencias 24 h, todos los días · Oficina ${N.horario}`,
      escenario: { pequeño: "Aviso al fontanero", aria: "Tu aviso al fontanero" },
      fases: ["Qué pasa", "Seguridad", "Cuándo", "Tus datos", "Listo"],
      botonEnviar: "Sí, está bien: avisar al fontanero",
      convNota: `<span data-n="tecnico">${N.tecnico}</span> es un asistente con inteligencia artificial. Si huele a gas o hay peligro, llama al 112.`,
      fotoAria: "Enviar una foto de la avería",
      chips: ["Me sale agua y no para", "Tengo el fregadero atascado", "¿Cuánto cobráis por venir?", "La cisterna no para de cargar"],
      orientacion: "Lo que te conviene: ",
      escEstado: { rellenando: "Se rellena mientras hablas", lista: "Listo: confírmalo y avisamos al fontanero", enviada: "Aviso enviado" },
      waInicial: "Hola, tengo una avería de fontanería. ¿Podéis atenderme?",
      waAviso: { principal: "un fontanero", llamada: "que me llaméis" },
      trasLlamada: "Tus datos siguen en «Tu solicitud»: si está todo bien, pulsa «avisar al fontanero»."
    },
    fotos: {
      portada: { src: "media/portada.jpg", alt: "Manos de un fontanero ajustando una válvula de latón bajo un fregadero", ancho: 1600, alto: 1067 },
      trabajo: [
        { src: "media/tuberias.jpg", alt: "Tuberías y codos cromados", pie: "<b>Fuga.</b> La llave de paso corta el agua de toda la casa: búscala hoy, antes de necesitarla.", ancho: 960, alto: 1200 },
        { src: "media/desague.jpg", alt: "Mano con guante junto al desagüe de un lavabo", pie: "<b>Atasco.</b> Si solo atasca un desagüe, suele ser el sifón; si atascan varios, está más abajo.", ancho: 1200, alto: 800 },
        { src: "media/calentador.jpg", alt: "Panel de un calentador con pantalla y manómetro", pie: "<b>¿Huele a gas?</b> No es fontanería: no toques interruptores, sal de casa y llama al 112 o a Nedgia (900 750 750).", ancho: 1000, alto: 420 }
      ]
    },
    iconos: {
      fuga: '<rect x="4" y="10" width="40" height="11" rx="2"/><path d="M16 10v11M32 10v11"/><path d="M24 26s-5 5.6-5 9.2a5 5 0 0 0 10 0c0-3.6-5-9.2-5-9.2z"/><path d="M10 44h28"/>',
      atasco: '<path d="M5 18h38v5a15 15 0 0 1-15 15h-8A15 15 0 0 1 5 23z"/><path d="M31 18V8h-9"/><path d="M20 27a4 4 0 1 0 8 0 4 4 0 0 0-8 0"/><path d="M24 38v6"/>',
      wc: '<path d="M8 23h32v1a16 16 0 0 1-32 0z"/><path d="M13 23V6h14v17"/><path d="M18 39.5 16 44h16l-2-4.5"/><path d="M31 10h3"/>',
      cisterna: '<rect x="9" y="5" width="30" height="25" rx="2"/><path d="M9 17h30"/><circle cx="19" cy="17" r="3.5"/><path d="M22.5 17H31V10"/><path d="M24 30v8M17 43h14"/>',
      termo: '<rect x="13" y="3" width="22" height="34" rx="11"/><circle cx="24" cy="16" r="4.5"/><path d="M24 16l2.5-2.5"/><path d="M19 37v8M29 37v8"/>',
      oculta: '<rect x="4" y="5" width="28" height="38" rx="1"/><path d="M11 15c3-3 9-1 8 3.5s-7 5-9 2 .2-4.5 1-5.5z"/><circle cx="33" cy="29" r="7"/><path d="M38 34l6 6"/>',
      tuberia: '<path d="M3 18h14v12H3M45 18H31v12h14"/><path d="M24 9v5M18 11l2.5 4M30 11l-2.5 4M24 39v-5M18 37l2.5-4M30 37l-2.5-4"/>',
      bajante: '<path d="M17 3v42M27 3v42"/><path d="M4 15h13M4 31h13"/><path d="M34 13c3 2-3 4 0 6s-3 4 0 6M41 17c3 2-3 4 0 6s-3 4 0 6"/>'
    },
    situaciones: [
      ["fuga", "Fuga de agua", "Tengo una fuga de agua y no para: ¿qué hago?"],
      ["atasco", "Fregadero o lavabo atascado", "El fregadero está atascado y no traga el agua"],
      ["wc", "Váter atascado", "El váter está atascado y se sale el agua"],
      ["cisterna", "Cisterna que no para", "La cisterna no para de cargar agua o pierde"],
      ["termo", "Sin agua caliente", "Me he quedado sin agua caliente: el termo o el calentador no va"],
      ["oculta", "Humedad o fuga que no se ve", "Tengo una mancha de humedad o una factura de agua muy alta y creo que hay una fuga escondida"],
      ["tuberia", "Tubería rota", "Se ha roto una tubería y sale mucha agua"],
      ["bajante", "Malos olores o bajante", "Huele mal en el baño y creo que es la bajante o la arqueta"]
    ],

    campos: [
      { id: "averia", etiqueta: "Qué pasa", corto: "Avería", visible: true, ancho: true, grupo: "caso", lista: ["Fuga de agua", "Tubería rota", "Fregadero o lavabo atascado", "Váter atascado", "Cisterna que no para", "Sin agua caliente (termo)", "Humedad o fuga oculta", "Bajante o malos olores", "Poca presión", "Otra avería"] },
      { id: "cuando", etiqueta: "¿Urgente o programada?", corto: "Cuándo", visible: true, grupo: "caso", lista: ["Urgente, ahora", "Hoy, en cuanto podáis", "Visita programada"] },
      { id: "llave", etiqueta: "¿Llave de paso cerrada?", corto: "Llave de paso", visible: true, grupo: "caso", placeholder: "Sí, ya no sale agua…" },
      { id: "vivienda", etiqueta: "Piso o casa", corto: "Vivienda", grupo: "caso", lista: ["Piso", "Casa", "Local", "Zonas comunes de la comunidad"] },
      { id: "seguro", etiqueta: "Seguro de hogar", corto: "Seguro", placeholder: "Compañía, si quieres dar parte" },
      { id: "nombre", etiqueta: "Nombre", visible: true, autocomplete: "given-name" },
      { id: "telefono", etiqueta: "Teléfono", visible: true, tipo: "tel" },
      { id: "municipio", etiqueta: "Municipio y barrio", corto: "Municipio", visible: true, autocomplete: "address-level2" },
      { id: "direccion", etiqueta: "Calle y número", corto: "Dirección", visible: true, autocomplete: "street-address", placeholder: "Calle, número, piso…" },
      { id: "franja", etiqueta: "Cuándo te viene bien", corto: "Visita", visible: true, placeholder: "Ahora mismo, mañana por la tarde…", ancho: true },
      { id: "inicio", oculto: true }
    ],
    obligatorios: [["telefono", "teléfono"], ["nombre", "nombre"], ["averia", "qué pasa"], ["municipio", "municipio"]],
    campoResumen: "averia",
    tipoPrincipal: "visita",
    resumenAviso: [["averia", ""], ["cuando", ""], ["llave", "Llave de paso: "]],
    panelLugar: ["municipio", "franja"],
    panelExtra: ["cuando", "direccion", "llave", "seguro"],

    preparar: {
      titulo: "Mientras llega el fontanero",
      nota: "Se ajusta a tu avería mientras hablas. Lo primero, siempre, la seguridad.",
      reglas: [
        { campos: ["averia", "llave"], re: "fuga|tuber|rot|sale|agua|inund|gotea", doc: ["Llave de paso cerrada", "La de la vivienda; si no cierra, la que está junto al contador."] },
        { doc: ["Fotos o un vídeo corto de la avería", "Y de las manchas o daños, para el seguro. Puedes mandarlas ya con el botón de la cámara."] },
        { campos: ["averia"], re: "atasc|v[áa]ter|inodoro|fregadero|lavabo|ducha|bajante|arqueta|olor", doc: ["Ni sosa ni desatascadores", "Si ya has echado algo, dile al fontanero qué y cuánto."] },
        { campos: ["averia"], re: "fregadero|lavabo", doc: ["El mueble de debajo, vacío", "Para llegar al sifón sin perder tiempo."] },
        { campos: ["averia"], re: "termo|calentador|caliente", doc: ["Foto de la placa del termo o calentador", "Marca, litros y si es eléctrico o de gas. Si es de gas, no lo abras."] },
        { grupo: "comunidad", campos: ["averia"], re: "bajante|arqueta|olor|comunidad", doc: ["Teléfono del administrador o del presidente", "Si es de la comunidad, conviene avisarles; y acceso a zonas comunes o a la arqueta."] },
        { grupo: "comunidad", campos: ["vivienda"], re: "comun", doc: ["Teléfono del administrador o del presidente", "Si es de la comunidad, conviene avisarles; y acceso a zonas comunes o a la arqueta."] },
        { campos: ["averia"], re: "humedad|oculta|factura|contador|presi", doc: ["Mira el contador con todo cerrado", "Si se mueve sin gastar agua, lo más probable es una fuga."] },
        { campos: ["seguro"], re: "\\w", doc: ["Compañía y número de póliza", "Llama antes a tu aseguradora: muchas mandan su propio fontanero."] },
        { doc: ["Alguien en casa y el paso libre", "Y dónde aparcar si hay que subir la máquina."] }
      ]
    },

    destinos: {
      precios: { sel: ".tarifa", titulo: "Salida y presupuesto", texto: `Salida en horario normal: ${salida}${propia ? "" : " (referencia de mercado)"}. De noche y festivos ${recargo}. Presupuesto por escrito antes de empezar.` },
      salida: "precios",
      visita: "precios",
      orientativos: { sel: "#precios-orientativos .envol", titulo: "Precios orientativos", bloque: true, texto: "El precio sale del presupuesto escrito del fontanero." },
      cuanto: "orientativos",
      seguridad: { sel: ".pasos", titulo: "Mientras llegamos", texto: "Cierra la llave de paso, aparta el agua de la luz y, en un atasco, nada de sosa cáustica." },
      llave: "seguridad",
      como: "seguridad",
      gas: { sel: ".trabajo", titulo: "Si huele a gas", texto: "No toques interruptores ni enchufes, abre ventanas, sal de casa y llama desde fuera al 112 o a Nedgia (900 750 750)." },
      garantia: { sel: ".lista-ok", titulo: "Presupuesto, factura y garantía", texto: `Presupuesto por escrito antes de empezar, factura detallada y ${N.garantia}.` },
      zona: { sel: "#zonaCaja", titulo: "Dónde vamos", texto: `A ${N.zona}. Urgencias ${N.urgencias}.` },
      situaciones: { sel: "#listaAparatos", titulo: "Atendemos", texto: may(lista(N.servicios.slice(0, 5))) + "." },
      preguntas: { sel: "#faqLista", titulo: "Preguntas frecuentes", texto: "Seguro de hogar, comunidad de vecinos, Emasagra y lo que más nos preguntáis." },
      contacto: { solicitud: true }, llamada: { solicitud: true }, formulario: { solicitud: true }, preparar: { solicitud: true }
    },

    final: {
      principal: { titulo: "¡Listo! Aviso enviado al fontanero", pasos: [
        "Te llamamos para confirmar la hora: si es urgente, en cuanto lo recibimos; si no, para cerrar el día.",
        "Antes de ir te decimos la salida, y en tu casa el presupuesto por escrito antes de empezar.",
        "Mientras tanto, deja la llave de paso cerrada y no eches productos por el desagüe."
      ] },
      llamada: { titulo: "¡Listo! Te llamamos", pasos: [`Te llamamos lo antes posible. Si sale agua, cierra la llave de paso y, si es urgente, llámanos tú al ${N.telefono}.`] }
    },
    revelar: [".trabajo figure"],
    legal: {
      actividad: `es una empresa de fontanería y desatascos que trabaja en ${N.zona}. Los diagnósticos, los presupuestos y las reparaciones los hace siempre un fontanero de la empresa.`,
      orienta: "Te orienta de forma general sobre tu avería (qué hacer mientras tanto, precios orientativos, seguro y comunidad) y organiza la visita del fontanero, urgente o programada.",
      decide: "el diagnóstico, el precio y la reparación los decide siempre el fontanero al ver la avería",
      precios: ["Los precios de la web son orientativos e indican si llevan IVA; el precio vinculante es el del presupuesto por escrito que aceptas antes de empezar.", "Antes de ir te decimos el precio de la salida y, si es de noche, en fin de semana o festivo, el recargo.", "Las reparaciones tienen la garantía que figure por escrito en la factura, además de la que marque la ley."],
      datosCaso: "la avería que nos cuentas, la dirección donde está, si tienes seguro de hogar", cita: "la visita del fontanero",
      conserva: "Los datos de una reparación hecha, mientras dure la garantía y los plazos legales de facturación (hasta seis años)."
    },
    schema: { tipo: "Plumber", descripcion: "Fontanería, desatascos y urgencias 24 horas en Granada y su área metropolitana, con precio de salida antes de ir y presupuesto por escrito.", area: "Granada y área metropolitana", precio: "€€", horas: ["Mo-Su 00:00-23:59"] }
  };
}
