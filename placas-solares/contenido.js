// Contenido de la web que depende de precios y normas (cambia con el tiempo): precios orientativos y
// preguntas frecuentes. Todo sale de conocimiento/resumen-para-andres.md (fuentes y fechas en
// conocimiento/autoconsumo-granada.md, consultadas el 27-11-2026). Es lo mismo que dice Andrés.
// PENDIENTE: que la empresa valide los rangos de precio, diga si se muestran con IVA y qué incluyen (legalización, estructura)
// PENDIENTE: quitar la pregunta de la deducción de la Renta en cuanto acabe 2026 (caduca el 31-12-2026 salvo prórroga)
window.__BLOQUE = {
  bajada: "Rangos de mercado en la provincia. El precio cerrado y el ahorro con tu consumo te los damos por escrito después del estudio.",
  resumen: "Orientativo: de 1.000 a 1.500 € por kWp instalado. Una casa típica de unos 5 kWp, de 4.500 a 7.500 € sin batería y de 7.000 a 9.500 € o más con batería. En Granada cada kWp produce de 1.400 a 1.700 kWh al año y lo más probable es que se pague sola en 6 a 10 años. El precio cerrado sale del estudio.",
  casos: [
    { quien: "Precio por potencia instalada", cifra: "1.000 – 1.500 €/kWp", texto: "El kWp es la potencia de las placas. Una casa normal suele rondar los 5 kWp." },
    { quien: "Casa típica, sin batería", cifra: "4.500 – 7.500 €", texto: "Unos 5 kWp. Lo que gastas de día lo pagas a las placas; lo que sobra se descuenta de la factura." },
    { quien: "Casa típica, con batería", cifra: "7.000 – 9.500 €", texto: "O más, según la capacidad. La batería compensa si gastas mucha luz por la noche." },
    { quien: "Batería", cifra: "450 – 800 €/kWh", texto: "Por cada kWh de capacidad. En muchas casas alarga lo que se tarda en recuperar el dinero." },
    { quien: "Lo que produce en Granada", cifra: "1.400 – 1.700 kWh", texto: "Al año por cada kWp, según orientación, inclinación y sombras. Mejor al sur." },
    { quien: "Se paga sola en", cifra: "6 – 10 años", texto: "Lo más probable. Antes si gastas mucho de día; más tarde con batería. Es una estimación." }
  ],
  fuente: "Orientativo: rangos de mercado y producción para Granada revisados en noviembre de 2026. La factura nunca baja a cero: siempre quedan la potencia, el contador, los impuestos y la luz de la noche. Sin tus facturas no hay cálculo de ahorro."
};

window.__PREGUNTAS = [
  ["¿Cuánto cuesta el estudio?", "Nada. El estudio, la visita técnica y el presupuesto por escrito son gratis y sin compromiso. En pueblos lejanos te decimos antes de ir si hay coste de desplazamiento."],
  ["¿Se me queda la factura de la luz a cero?", "No, y desconfía de quien lo prometa. Lo que te sobra y vuelve a la red se descuenta de la parte de energía de tu factura, pero no se cobra en dinero, y siempre quedan la potencia contratada, el contador, los impuestos y lo que gastas de noche. Con tus facturas te calculamos cuánto baja de verdad."],
  ["¿Hay ayudas o subvenciones ahora mismo?", "A día de hoy no nos consta ninguna subvención directa abierta para particulares en Andalucía. Hay deducciones en la Renta para instalaciones terminadas y pagadas en 2026, pero va muy justo y el porcentaje te lo confirma un asesor fiscal. En Granada capital se puede pedir una bonificación del 95 % del ICIO (el impuesto de la obra) y del 50 % del IBI; en otros municipios depende de su ordenanza."],
  ["¿Hace falta permiso del ayuntamiento?", "En Granada capital, en suelo urbano y si el edificio no está protegido ni en el Conjunto Histórico, basta con una declaración responsable, y la gestionamos nosotros. En el Albaicín, el Realejo o el centro histórico el trámite es más exigente. La legalización ante la Junta (el boletín y el registro de autoconsumo) también la hace la instaladora."],
  ["¿Me hace falta batería?", "No siempre. Sin batería aprovechas la luz mientras hay sol y lo que sobra se descuenta de la factura. La batería compensa cuanto más gastas por la noche: cuesta del orden de 450 a 800 € por kWh de capacidad y en muchas casas alarga lo que se tarda en recuperar el dinero. {asistente} te pregunta tus horarios y te dice si te sale a cuenta."],
  ["Vivo en un piso. ¿Podemos poner placas en la comunidad?", "Sí, pero la cubierta es de todos y hace falta un acuerdo de la junta de propietarios; para instalaciones renovables de uso común la ley pide una mayoría reducida, que te confirma el administrador. También se puede compartir la luz entre vecinos (autoconsumo compartido). El estudio os sirve para llevarlo a la junta."],
  ["¿{asistente} es una persona?", "No. {asistente} es un asistente con inteligencia artificial que te orienta con cifras de mercado y apunta tus datos para que no tengas que repetirlos. El tamaño, el precio y el ahorro definitivos los calcula un técnico de la empresa después de ver tu tejado y tus facturas."]
];
