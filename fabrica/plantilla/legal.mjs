// =====================================================================
//  PÁGINAS LEGALES de cada web (aviso legal y privacidad), con los datos de la web.
//  Antes se copiaban a mano y Herencias decía «Reparo» y hablaba de averías:
//  ahora salen de aquí para todas. Lo que falta va marcado [PENDIENTE] en naranja.
//  Datos propios de cada web en W.legal: {actividad, independiente, orienta, decide,
//  precios[], datosCaso, datosSalud, conserva}
// =====================================================================
const P = t => `<span class="pend">[PENDIENTE: ${t}]</span>`;
const estilo = `<style>
:root{--papel:#F4F5F7;--tinta:#16191D;--tinta-2:#3E454E;--tinta-3:#6A717A;--pend:#FBE3C8;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--papel:#111417;--tinta:#ECEDEF;--tinta-2:#BCC1C8;--tinta-3:#8E959E;--pend:#3D2A14;color-scheme:dark}}
*{box-sizing:border-box}
body{margin:0;background:var(--papel);color:var(--tinta-2);font:400 17px/1.7 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:760px;margin:0 auto;padding:32px 16px 64px}
a{color:var(--tinta)}
h1{font:800 clamp(32px,5vw,44px)/1.1 ui-sans-serif,system-ui,sans-serif;letter-spacing:-.02em;color:var(--tinta);margin:0 0 8px}
h2{font:700 22px/1.25 ui-sans-serif,system-ui,sans-serif;color:var(--tinta);margin:40px 0 10px}
ul{padding-left:20px}
.fecha{color:var(--tinta-3)}.pend{background:var(--pend);color:var(--tinta);padding:0 4px;border-radius:3px}
.volver{display:inline-block;margin-bottom:28px;color:var(--tinta-3);text-decoration:none}
</style>`;
const cabeza = (titulo, N) => `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${titulo} · ${N.marca}</title><meta name="robots" content="noindex">
${estilo}</head><body><main>
<a class="volver" href="./">← Volver a ${N.marca}</a>`;
const fecha = "27 de noviembre de 2026";

export function avisoLegal(N, W) {
  const L = W.legal;
  return `${cabeza("Aviso legal", N)}
<h1>Aviso legal</h1>
<p class="fecha">Última actualización: ${fecha}</p>

<h2>1. Titular de la web</h2>
<p>En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI), te informamos de que esta web pertenece a:</p>
<ul>
<li><b>Titular:</b> ${P("razón social")}</li>
<li><b>NIF:</b> ${P("NIF")}</li>
<li><b>Domicilio:</b> ${P("dirección completa")}, ${N.provincia || N.ciudad} (España)</li>
<li><b>Registro Mercantil:</b> ${P("datos registrales, si es sociedad")}</li>
${L.colegio ? `<li><b>Colegio profesional:</b> ${P(L.colegio)}</li>\n` : ""}<li><b>Contacto:</b> ${P("teléfono y correo")}</li>
</ul>

<h2>2. Qué hacemos</h2>
<p>${N.marca} ${L.actividad}${L.independiente ? " " + L.independiente : ""}</p>

<h2>3. ${N.tecnico} es una inteligencia artificial</h2>
<p>«${N.tecnico}», el asistente de la web, es un sistema de inteligencia artificial, no una persona. ${L.orienta} Puede equivocarse: <b>${L.decide}</b>. ${L.emergencia || "Si hay peligro para alguien, llama al 112."}</p>

<h2>4. Precios y condiciones</h2>
<ul>
${L.precios.map(p => `<li>${p}</li>`).join("\n")}
<li>Los precios, plazos y cifras que pueda darte el asistente son <b>orientativos</b>; lo que vale es el presupuesto o la hoja de encargo por escrito.</li>
<li>Tienes a tu disposición hojas de reclamaciones.</li>
</ul>

<h2>5. Responsabilidad</h2>
<p>Cuidamos que la información de la web sea correcta y que funcione bien, pero no podemos garantizar que esté siempre disponible ni libre de errores. La información de la web y del asistente es general y no sustituye el estudio de cada caso por un profesional.</p>

<h2>6. Fotos y propiedad intelectual</h2>
<p>Los textos, el diseño y el código de esta web son del titular o se usan con licencia. Algunas fotos son de bancos de imágenes con licencia de uso (Pexels): ilustran el servicio y las personas que aparecen no son clientes ni empleados.</p>

<h2>7. Ley aplicable</h2>
<p>Se aplica la legislación española. Como consumidor, puedes acudir a los juzgados de tu domicilio.</p>
</main></body></html>
`;
}

export function privacidad(N, W) {
  const L = W.legal;
  return `${cabeza("Política de privacidad", N)}
<h1>Política de privacidad</h1>
<p class="fecha">Última actualización: ${fecha}</p>

<h2>1. Quién trata tus datos</h2>
<p>${P("razón social")}, NIF ${P("NIF")}, con domicilio en ${P("dirección")}, ${N.provincia || N.ciudad}. Contacto para privacidad: ${P("correo")}.</p>

<h2>2. Qué datos tratamos</h2>
<ul>
<li><b>Lo que le cuentas a ${N.tecnico}</b>, por escrito o por voz: ${L.datosCaso}, y las fotos que decidas enviar.</li>
<li><b>Tus datos de contacto</b> cuando pides ${W.legal.cita || "una cita"} o que te llamemos: nombre, teléfono, municipio y cuándo te viene bien.</li>
<li>Si hablas por voz, tu voz se convierte en texto; <b>no guardamos grabaciones de audio</b>.</li>
${L.datosSalud ? `<li><b>Datos de salud:</b> ${L.datosSalud}</li>\n` : ""}</ul>

<h2>3. Para qué y con qué base legal</h2>
<ul>
<li><b>Atender tu consulta y organizar ${W.legal.cita || "la cita"}</b> que nos pides. Base legal: las medidas previas al contrato que solicitas (artículo 6.1.b del RGPD).</li>
<li><b>Cumplir obligaciones legales</b> (facturación, garantías). Base legal: obligación legal (artículo 6.1.c del RGPD).</li>
${L.datosSalud ? `<li><b>Datos de salud</b>, solo con tu consentimiento expreso (artículo 9.2.a del RGPD), que puedes retirar cuando quieras.</li>\n` : ""}</ul>
<p>No usamos tus datos para publicidad ni los vendemos o cedemos a otras empresas. No tomamos decisiones automatizadas con efectos jurídicos sobre ti: el asistente solo orienta y organiza la cita.</p>

<h2>4. Inteligencia artificial y proveedores</h2>
<p>El asistente funciona con un modelo de inteligencia artificial de <b>Anthropic</b>, que actúa como encargado del tratamiento: procesa el texto de la conversación para generar las respuestas y no lo usa para entrenar sus modelos. Para hablar por voz usamos ${P("proveedores de voz: p. ej. LiveKit, Deepgram y ElevenLabs")}, y un proveedor de alojamiento web (${P("p. ej. Cloudflare")}). Algunos pueden tratar datos fuera del Espacio Económico Europeo, siempre con las garantías del RGPD (cláusulas contractuales tipo o marco de privacidad UE-EE. UU.).</p>

<h2>5. Cuánto tiempo los guardamos</h2>
<p>Las conversaciones que no terminan en una cita, como máximo ${P("p. ej. 90 días")}. ${L.conserva}</p>

<h2>6. Tus derechos</h2>
<p>Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos escribiendo a ${P("correo")}. Si crees que no lo hemos hecho bien, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>

<h2>7. Cookies</h2>
<p>Esta web no usa cookies de publicidad ni de analítica. Si en el futuro las añadimos, te pediremos permiso antes.</p>
</main></body></html>
`;
}
