// =====================================================================
//  CEREBRO DEL TÉCNICO VIRTUAL
//  Datos del negocio y saludo (las instrucciones del técnico están en
//  instrucciones.mjs). Lo usan la web, el servidor y el agente de voz,
//  así que cualquier cambio aquí se aplica en los dos sitios a la vez.
//
//  >>> Lo que hay que revisar antes de publicar está marcado con PENDIENTE.
// =====================================================================

export const NEGOCIO = {
  marca: "Reparo",                       // PENDIENTE: nombre definitivo (y comprobar dominio)
  tecnico: "Andrés",                     // nombre del técnico virtual
  ciudad: "Granada",
  zona: "Granada capital y área metropolitana: Armilla, Maracena, Albolote, Atarfe, Peligros, Pulianas, Jun, Huétor Vega, Cájar, La Zubia, Monachil, Ogíjares, Gójar, Alhendín, Churriana de la Vega, Las Gabias, Cúllar Vega, Santa Fe, Vegas del Genil y alrededores",
  telefono: "958 00 00 00",              // PENDIENTE: teléfono real
  telefonoEnlace: "+34958000000",        // PENDIENTE: mismo teléfono en formato internacional
  whatsapp: "34600000000",               // PENDIENTE: WhatsApp real (sin + ni espacios)
  experiencia: "más de 35 años de experiencia",  // dicho por Juan el 22-11-2026 (antes: mínimo 20)
  experienciaCorta: "Técnicos con 35+ años",
  horario: "de lunes a viernes de 9:00 a 20:00 y los sábados de 9:00 a 14:00",
  plazo: "normalmente en 24 a 48 horas, y el mismo día si es urgente y hay hueco en la ruta",
  visita: { precio: "60,50 €", detalle: "desplazamiento del técnico y elaboración del presupuesto (son 50 € más IVA, 60,50 € en total); si decides reparar con nosotros, esos 60,50 € se descuentan de la factura" }, // confirmado por Juan el 22-11-2026: 50 € más IVA
  garantia: "3 meses por escrito en la reparación (pieza y mano de obra)", // PENDIENTE: ¿3 o 6 meses?
  // Qué ofrecer si el cliente prefiere comprar un aparato nuevo. PENDIENTE: completar con lo que diga Juan.
  // Si el cliente prefiere un aparato nuevo, también se lo vendemos, con entrega, instalación
  // y retirada del viejo incluidas (confirmado por Juan).
  ventaNuevo: "lo entregamos, lo instalamos y nos llevamos el viejo",
  aparatoNuevo: "Si prefiere comprar uno nuevo, no discutas: ofrécele que se lo vendamos nosotros, y dile que lo entregamos, lo instalamos y nos llevamos el viejo (eso le quita todo el lío). En esa misma respuesta pídele un teléfono para que le llame el equipo, y después qué tipo de aparato busca y, si lo sabe, medidas o hueco y presupuesto aproximado; toma también nombre y municipio, y envía la solicitud como venta para que el equipo le llame con opciones y precio. No des precios ni modelos concretos ni fechas de entrega: eso se lo cuenta el equipo al llamarle.",
  pago: "tarjeta, Bizum o efectivo al terminar",
  recambios: "recambios originales o de calidad equivalente según el caso", // PENDIENTE: confirmar con el taller
  aparatos: [
    "lavadoras", "lavadoras-secadoras", "secadoras", "lavavajillas",
    "frigoríficos y combis", "congeladores", "hornos", "vitrocerámicas y placas de inducción",
    "campanas extractoras", "microondas", "termos eléctricos"
  ],
  noReparamos: ["pequeño electrodoméstico (cafeteras, aspiradoras, planchas)", "televisores", "electrónica"],
  // Aire acondicionado y calderas: solo con técnicos con carnet de gases fluorados / habilitación de gas,
  // que no hay en todas las zonas. Andrés orienta, toma los datos y el equipo confirma si llega.
  // PENDIENTE: lista de municipios donde sí hay técnico habilitado (para que Andrés lo confirme al momento).
  climaYCalefaccion: {
    aparatos: ["aire acondicionado", "bombas de calor", "calderas", "calentadores de gas"],
    zonasConfirmadas: [],
    condicion: "con técnicos que tienen el carnet de gases fluorados (aire acondicionado) o la habilitación de gas (calderas), que no están en todas las zonas"
  },
  marcas: [
    "Bosch", "Balay", "Siemens", "Neff", "LG", "Samsung", "Whirlpool", "Indesit", "Hotpoint",
    "Beko", "Teka", "Fagor", "Edesa", "AEG", "Electrolux", "Zanussi", "Candy", "Hoover",
    "Haier", "Miele", "Smeg", "Cata", "Hisense", "Corberó", "Aspes", "Liebherr", "Gorenje", "Daewoo"
  ],
  // PENDIENTE: revisar con los precios reales del taller. Son orientativos, con pieza,
  // mano de obra e IVA, y NUNCA se dan como precio cerrado.
  rangos: [
    ["Lavadora: bomba de desagüe", "80 y 130 €"],
    ["Lavadora: escobillas del motor", "70 y 110 €"],
    ["Lavadora: resistencia", "90 y 140 €"],
    ["Lavadora: cierre de puerta", "70 y 100 €"],
    ["Lavadora: rodamientos", "160 y 260 € (en lavadoras de más de diez años no suele compensar)"],
    ["Cualquier aparato: placa electrónica", "150 y 300 €, según marca y si se repara o se cambia"],
    ["Frigorífico No Frost: avería de desescarche (resistencia, sonda o bimetal)", "90 y 150 €"],
    ["Frigorífico: ventilador", "90 y 150 €"],
    ["Frigorífico: fuga y carga de gas", "180 y 300 €"],
    ["Lavavajillas: bomba de desagüe o de lavado", "90 y 170 €"],
    ["Horno: resistencia o ventilador", "80 y 140 €"],
    ["Termo eléctrico: resistencia o termostato", "80 y 130 €"]
  ]
};

// "a, b, c y d"
export const lista = xs => xs.length > 1 ? xs.slice(0, -1).join(", ") + " y " + xs.at(-1) : (xs[0] || "");

// Saludo inicial: lo dice la propia página (sin esperar a la IA) para que
// la conversación arranque al instante.
export function saludo(n = NEGOCIO) {
  return `Hola, soy ${n.tecnico}, el asistente de ${n.marca}. ¿Qué aparato se te ha averiado?`;   // corto y sin «dando guerra» (22-11-2026): cada letra dicha cuesta
}
