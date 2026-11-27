// =====================================================================
//  PLANTILLA COMÚN DE LAS WEBS CON ANDRÉS (fábrica)
//  Genera index.html (web publicada) y vista-previa.html (vista privada en claude.ai)
//  a partir de los datos de cada web (web.mjs + cerebro.mjs + asistente.json).
//  El diseño (nucleo.css + piel.css) y la conversación (nucleo.js) son los mismos
//  para todas: una mejora aquí llega a todas las webs al volver a construirlas.
// =====================================================================

// Iconos pequeños (24 px) para la franja de confianza y la lista de ventajas
export const ICONOS_24 = {
  persona: '<circle cx="12" cy="8" r="4"/><path d="M5 21c1-4 4-6 7-6s6 2 7 6"/>',
  documento: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  video: '<rect x="3" y="5" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  escudo: '<path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  herramienta: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 6.3-6.3a4 4 0 0 0-1.6-5.4z"/><path d="M9 15l-6 6"/>',
  casa: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
  euro: '<path d="M18 6.5A7 7 0 1 0 18 17.5"/><path d="M4 10h9M4 14h9"/>',
  calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  rayo: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  gota: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  coche: '<path d="M5 17h14M3 17v-4l2-5h14l2 5v4"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/>',
  balanza: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/>',
  telefono: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  mapa: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  regla: '<path d="M3 17 17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
  garantia: '<circle cx="12" cy="9" r="6"/><path d="M9 14.5 8 22l4-2 4 2-1-7.5"/>'
};

const SVG_TEL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS_24.telefono}</svg>`;
const svg24 = (nombre, ancho = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${ancho}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS_24[nombre] || nombre}</svg>`;
const MIC = (g = 2.2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${g}" stroke-linecap="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4"/></svg>`;
const TECLADO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M7 15h10"/></svg>`;
const WA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 20.5l1.8-5.2A8.4 8.4 0 1 1 21 11.5z"/></svg>`;
const TEL2 = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS_24.telefono}</svg>`;
const OK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>`;
const FOTO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/></svg>`;

const attr = s => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Datos que necesita la conversación en el navegador (se incrustan como JSON) */
export function datosNavegador(W, A) {
  const resolver = d => { let x = W.destinos[d]; while (typeof x === "string") x = W.destinos[x]; return x; };
  return {
    asistente: { nombre: A.nombre, genero: A.genero || "hombre" },
    campos: W.campos.map(({ id, etiqueta, corto, visible, oculto, grupo }) => ({ id, etiqueta, corto: corto || etiqueta, visible: !!visible, oculto: !!oculto, grupo: grupo || "" })),
    obligatorios: W.obligatorios, obligatoriosTipo: W.obligatoriosTipo || null, campoResumen: W.campoResumen, tipoPrincipal: W.tipoPrincipal,
    tiposExtra: W.tiposExtra || [],
    resumenAviso: W.resumenAviso, panelLugar: W.panelLugar, panelExtra: W.panelExtra || [],
    preparar: W.preparar ? { reglas: W.preparar.reglas } : null,
    destinos: Object.fromEntries(Object.keys(W.destinos).map(k => [k, resolver(k)])),
    manual: !!W.manual, fichaAlias: W.fichaAlias || null, campoOrientacion: W.campoOrientacion || "", mapa: W.mapa ? { provincia: W.mapa.provincia, zonaTitulo: W.mapa.zonaTitulo, zonaTexto: W.mapa.zonaTexto, visitaTitulo: W.mapa.visitaTitulo } : null,
    final: W.final, textos: {
      fases: W.textos.fases, escEstado: W.textos.escEstado, waInicial: W.textos.waInicial, waAviso: W.textos.waAviso,
      trasLlamada: W.textos.trasLlamada, botonCita: W.textos.botonCita || "", orientacion: W.textos.orientacion, preparada: W.textos.preparada || "Solicitud preparada"
    },
    gira: W.textos.gira || [], revelar: W.revelar || [],
    audioMicro: A.audioMicro && A.audioMicro.voz === (A.voz && A.voz.id) && A.audioMicro.nombre === A.nombre ? A.audioMicro.archivo : ""
  };
}

/**
 * Página completa.
 * @param {object} p  { W, N, A, css, js, previa }  previa=true quita doctype/html/head/body (vista privada de claude.ai)
 */
export function pagina({ W, N, A, css, js, previa = false }) {
  const T = W.textos, tel = N.telefonoEnlace;
  const fuentesCss = (W.fuentes || []).map(f => `@font-face{font-family:"${f.familia}";src:url(${f.archivo}) format("woff2");font-weight:${f.pesos};${f.stretch ? `font-stretch:${f.stretch};` : ""}${f.estilo ? `font-style:${f.estilo};` : ""}font-display:swap}`).join("\n");
  const precargas = (W.fuentes || []).filter(f => f.precargar !== false).sort((a, b) => (b.primero ? 1 : 0) - (a.primero ? 1 : 0))
    .map(f => `<link rel="preload" href="${f.archivo}" as="font" type="font/woff2" crossorigin>`).join("\n");
  const campos = W.campos.filter(c => !c.oculto);
  const ocultos = W.campos.filter(c => c.oculto);
  const datalist = campos.filter(c => c.lista).map(c => `<datalist id="lista-${c.id}">${c.lista.map(o => `<option value="${attr(o)}">`).join("")}</datalist>`).join("\n        ");
  const campoHtml = c => `<label class="campo${c.ancho ? " campo-ancho" : ""}"><span>${c.etiqueta}</span><input id="f-${c.id}"${c.tipo === "tel" ? ' type="tel" inputmode="tel" autocomplete="tel"' : ""}${c.autocomplete ? ` autocomplete="${c.autocomplete}"` : ""}${c.lista ? ` list="lista-${c.id}"` : ""} placeholder="${attr(c.placeholder || `${A.nombre} te lo preguntará`)}"></label>`;
  const datos = T.datos;
  const ld = { "@context": "https://schema.org", "@type": W.schema.tipo, name: N.marca, description: W.schema.descripcion, areaServed: W.schema.area, telephone: tel, priceRange: W.schema.precio, openingHours: W.schema.horas };

  const cabeza = `<title>${esc(W.tituloPagina)}</title>
<meta name="description" content="${attr(W.descripcion)}">
<meta name="theme-color" content="${W.colorTema || "#FFFFFF"}">
<!-- Dirección del servidor del técnico en la web publicada (vacío en la vista previa). Ej.: /api -->
<meta name="servidor-tecnico" content="${attr(W.servidor || "")}">
<!-- Llamada de voz en directo con LiveKit: dirección que entrega el pase (vacío = desactivado). Ej.: /api/livekit-token -->
<meta name="livekit-token" content="${attr(W.livekit || "")}">${W.mapa ? `
<!-- Mapa de la visita: clave de Google Maps Embed API (gratuita). Vacío = mapa incrustado normal de Google -->
<meta name="google-maps-clave" content="">` : ""}
<meta property="og:title" content="${attr(W.og.titulo)}">
<meta property="og:description" content="${attr(W.og.descripcion)}">
<meta property="og:type" content="website">
${W.og.imagen ? `<meta property="og:image" content="${attr(W.og.imagen)}">\n` : ""}<link rel="icon" href="data:image/svg+xml,${W.icono}">
<!-- Fuentes propias (sin Google Fonts): servidas desde la propia web -->
${precargas}
<style>
${fuentesCss}
${css}
</style>
<!-- Piel propia de esta web: colores, letras y detalles -->
<link rel="stylesheet" href="estilo.css">`;

  const cuerpo = `<div class="previa" id="previa" hidden>${T.previa}</div>

<!-- Franja de arriba: horario y teléfono, como cualquier negocio de verdad -->
<div class="franja-info"><div class="envol"><span class="fi-horario" id="fiHorario">${T.horarioFranja}</span><a data-tel href="tel:${tel}">Llámanos: <span data-n="telefono">${N.telefono}</span></a></div></div>

<header class="cab" id="cab">
  <div class="envol">
    <a class="logo" href="#" aria-label="Inicio">
      <span class="logo-marca"><svg viewBox="0 0 32 32" fill="none" aria-hidden="true">${W.logo}</svg></span>
      <span class="logo-txt"><b data-n="marca">${N.marca}</b><small>${T.subtituloLogo}</small></span>
    </a>
    <div class="cab-acciones">
      <button class="boton boton-andres cab-hablar" type="button" data-hablar data-voz>${MIC()}<span>Hablar con <span data-n="tecnico">${A.nombre}</span></span></button>
      <a class="boton boton-borde cab-llamar" data-tel href="tel:${tel}">${SVG_TEL}Llamar</a>
    </div>
  </div>
</header>

<main>
<section class="portada cine" id="portada">
  <div class="envol">
    <div class="hero-a">
      <p class="sobretitulo entra">${T.sobretitulo}</p>
      ${T.urgencia ? `<p class="urgencia${T.urgencia.arriba ? " urgencia-arriba" : ""}">${svg24(T.urgencia.icono || "reloj", 2.2)}<span>${T.urgencia.texto}</span><a class="boton boton-principal" data-tel href="tel:${tel}">${T.urgencia.boton || "Llámanos"}</a></p>` : ""}
      <h1 id="titular" aria-label="${attr(T.titularAria)}"><span class="titular-fijo">${T.titularFijo}</span> <span class="gira" id="gira" aria-hidden="true"><span class="gira-pieza"><em>${esc(T.gira[0])}</em></span></span></h1>
      <p class="entrada entra" style="--i:1">${T.entrada}</p>
      <p class="precio-linea entra" style="--i:2">${T.precioLinea}</p>
    </div>
    <div class="hero-b">
      <figure class="hero-foto"><img src="${W.fotos.portada.src}" alt="${attr(W.fotos.portada.alt)}" width="${W.fotos.portada.ancho || 1200}" height="${W.fotos.portada.alto || 900}" fetchpriority="high" onerror="this.closest('figure').remove()"></figure>
      <div class="tarjeta-andres entra" style="--i:3" data-estado="reposo" id="tarjetaAndres">
        <div class="ta-cab">
          <div class="orbe" aria-hidden="true"><span class="onda"><i></i><i></i><i></i><i></i></span></div>
          <div class="ta-quien"><b><span data-n="tecnico">${A.nombre}</span> te atiende ahora</b><span>${T.asistenteQuien}</span></div>
        </div>
        <p class="ta-saludo">${T.asistenteSaludo}</p>
        <button class="boton boton-andres boton-hablar" type="button" data-hablar data-voz>${MIC()}<span>Hablar con <span data-n="tecnico">${A.nombre}</span></span></button>
        <div class="ta-otras">
          <button class="boton" type="button" data-hablar>${TECLADO}Escribir</button>
          <a class="boton" data-wa href="https://wa.me/${N.whatsapp}" target="_blank" rel="noopener">${WA}WhatsApp</a>
          <a class="boton" data-tel href="tel:${tel}">${TEL2}Llamar</a>
        </div>
        <p class="ta-nota">${T.asistenteNota}</p>
      </div>
      <a class="llamame-enlace" href="#contacto">${T.llamame}</a>
      <ul class="confianza">
        ${T.confianza.map(([ic, html]) => `<li>${svg24(ic)}<span>${html}</span></li>`).join("\n        ")}
      </ul>
    </div>
  </div>
</section>

<section class="seccion" id="situaciones">
  <div class="envol">
    <div class="cabecera-sec"><p class="antetitulo">${T.situaciones.antetitulo}</p><h2>${T.situaciones.titulo}</h2><p class="bajada">${T.situaciones.bajada}</p></div>
    <div class="aparatos" id="listaAparatos">${W.situaciones.map(([ic, nom, frase, foto]) => `
  <button type="button" class="aparato${foto ? " aparato-foto" : ""}" data-preguntar="${attr(frase)}">${foto ? `<img src="${foto}" alt="" loading="lazy">` : ""}
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${W.iconos[ic]}</svg><span class="aparato-nombre">${nom}</span></button>`).join("")}</div>
    ${T.situaciones.nota ? `<p class="nota-sec" id="notaSituaciones">${T.situaciones.nota}</p>` : ""}
    ${T.zona ? `<div class="zona-caja" id="zonaCaja"><b>${T.zona.titulo}</b><span id="faqZona">${T.zona.texto}</span></div>` : ""}
    ${T.situaciones.despues || ""}
  </div>
</section>
${datos ? `
<section class="seccion seccion-datos" id="${datos.id}">
  <div class="envol">
    <div class="cabecera-sec"><p class="antetitulo">${datos.antetitulo}</p><h2>${datos.titulo}</h2><p class="bajada" id="impuestoBajada"></p></div>
    <div class="impuesto bloque-datos" id="impuestoDatos"></div>
    <p class="aviso-indep" id="impuestoFuente"></p>
  </div>
</section>
` : ""}
<section class="seccion" id="como">
  <div class="envol">
    <div class="cabecera-sec"><p class="antetitulo">${T.como.antetitulo}</p><h2>${T.como.titulo}</h2></div>
    <ol class="pasos">
      ${T.como.pasos.map(([t, p]) => `<li class="paso"><h3>${t}</h3><p>${p}</p></li>`).join("\n      ")}
    </ol>
    <div class="trabajo">
      ${W.fotos.trabajo.map(f => `<figure><img src="${f.src}" alt="${attr(f.alt)}" loading="lazy" width="${f.ancho || 1200}" height="${f.alto || 900}" onerror="this.closest('figure').remove()"><figcaption>${f.pie}</figcaption></figure>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="seccion" id="precios">
  <div class="envol">
    <div class="cabecera-sec"><p class="antetitulo">${T.precios.antetitulo}</p><h2>${T.precios.titulo}</h2></div>
    <div class="precios">
      <div class="tarifa">
        <div class="cifra" id="precioVisita">${T.precios.cifra}</div>
        <h3>${T.precios.tarifa}</h3>
        <p id="consultaDetalle">${T.precios.detalle}</p>
        ${T.precios.descuento ? `<span class="descuento">${T.precios.descuento}</span>` : ""}
      </div>
      <ul class="lista-ok">
        ${T.precios.lista.map(l => `<li>${OK}<span>${l}</span></li>`).join("\n        ")}
      </ul>
    </div>
  </div>
</section>

<section class="seccion" id="preguntas">
  <div class="envol">
    <div class="cabecera-sec"><p class="antetitulo">${T.preguntas.antetitulo}</p><h2>${T.preguntas.titulo}</h2></div>
    <div class="faq" id="faqLista"></div>
  </div>
</section>

<section class="seccion" id="contacto">
  <div class="envol">
    <div class="cierre">
      <div>
        <h2>${T.contacto.titulo}</h2>
        <p>${T.contacto.texto}</p>
        <a class="tel-grande" data-tel href="tel:${tel}"><span data-n="telefono">${N.telefono}</span></a>
      </div>
      <div id="formLlamadaCaja">
        <form class="form-rapido" id="formRapido" novalidate>
          <h3>${T.contacto.form}</h3>
          <label class="campo"><span>Tu teléfono</span><input id="r-telefono" type="tel" inputmode="tel" autocomplete="tel" placeholder="Escribe tu móvil" required></label>
          <label class="campo"><span>${T.contacto.queNecesitas}</span><input id="r-averia" placeholder="${attr(T.contacto.ejemplo)}"></label>
          <input class="trampa" type="text" id="web" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button class="boton boton-principal ancho" type="submit">Que me llamen</button>
          <p class="legal">${T.contacto.legal} <a href="privacidad.html">Política de privacidad</a>.</p>
        </form>
        <div class="form-ok" role="status"><h3>¡Recibido!</h3><p>${T.contacto.ok}</p></div>
      </div>
    </div>
    <div class="panel-dueno" id="panelDueno" hidden>
      <h3>Solicitudes recibidas (solo lo ves tú)</h3>
      <p>${T.panel.texto}</p>
      <div class="envol-tabla"><table class="tabla-avisos"><thead><tr><th>Fecha</th><th>Tipo</th><th>Cliente</th><th>Teléfono</th><th>${T.panel.columnas[0]}</th><th>${T.panel.columnas[1]}</th></tr></thead><tbody id="tablaAvisos"><tr><td colspan="6">Todavía no hay solicitudes.</td></tr></tbody></table></div>
    </div>
  </div>
</section>
</main>

<footer class="pie">
  <div class="envol">
    <div><b data-n="marca">${N.marca}</b><p>${T.pie.descripcion}</p><p>${T.pie.aviso}</p></div>
    <div><b>Contacto</b><p><a data-tel href="tel:${tel}"><span data-n="telefono">${N.telefono}</span></a></p><p id="pieHorario">${T.pie.horario}</p></div>
    <div><b>Legal</b><p><a href="aviso-legal.html">Aviso legal</a></p><p><a href="privacidad.html">Política de privacidad</a></p></div>
  </div>
</footer>

<!-- barra fija del móvil: siempre a mano -->
<nav class="barra-movil" id="barraMovil" aria-label="Contactar">
  <button class="boton boton-andres" type="button" data-hablar data-voz>${MIC()}Hablar</button>
  <button class="boton boton-borde" type="button" data-hablar>${TECLADO}Escribir</button>
  <a class="boton boton-borde" data-tel href="tel:${tel}">${TEL2}Llamar</a>
  <a class="boton boton-borde" data-wa href="https://wa.me/${N.whatsapp}" target="_blank" rel="noopener">${WA}WhatsApp</a>
</nav>

<!-- conversación minimizada -->
<div class="mini" id="mini" data-estado="reposo" role="region" aria-label="Conversación con ${attr(A.nombre)} en curso">
  <div class="orbe" aria-hidden="true"><span class="onda"><i></i><i></i><i></i><i></i></span></div>
  <p class="mini-txt"><b><span data-n="tecnico">${A.nombre}</span> · <span id="miniEstado">en línea</span></b><span id="miniTxt"></span></p>
  <a class="boton boton-borde mini-tel" data-tel href="tel:${tel}" aria-label="Llamar">${SVG_TEL}</a>
  <button class="boton boton-andres" type="button" id="miniVolver">Seguir</button>
  <button class="boton colgar" type="button" id="miniColgar" aria-label="Colgar">Colgar</button>
</div>

<!-- ESCENARIO (solo en ordenador): la solicitud en grande al lado de la conversación, con lo que hay que
     preparar. Se abre al empezar la conversación; la solicitud (#solicitud) se muda aquí dentro. -->
<div class="escenario" id="escenario" data-estado="rellenando" hidden>
  <div class="esc-panel" role="region" aria-label="${attr(T.escenario.aria)}">
    <header class="esc-cab">
      <div>
        <small><span data-n="marca">${N.marca}</span> · ${T.escenario.pequeño}</small>
        <h2>Así queda tu solicitud</h2>
      </div>
      <span class="esc-estado" aria-live="polite"><i></i><span id="escEstado">${T.escEstado.rellenando}</span></span>
      <button class="boton boton-borde esc-cerrar" type="button" id="escCerrar">Ver la web</button>
    </header>
    <div class="esc-hueco" id="escHueco"></div>
    <footer class="esc-pie"><span>¿Algo no está bien? Tócalo y corrígelo, o díselo a <span data-n="tecnico">${A.nombre}</span>.</span><span id="escAviso"></span></footer>
  </div>
</div>

<!-- CONVERSACIÓN CON ${A.nombre.toUpperCase()} -->
<section class="conv" id="conv" data-estado="reposo" data-modo="voz" aria-label="Conversación con ${attr(A.nombre)}" hidden>
  <div class="conv-cab">
    <button class="icono" type="button" id="btnMinimizar" aria-label="Ver la web sin colgar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
    <div class="orbe" aria-hidden="true"><span class="onda"><i></i><i></i><i></i><i></i></span></div>
    <div class="conv-quien">
      <b><span data-n="tecnico">${A.nombre}</span> · asistente</b>
      <span class="conv-estado" aria-live="polite"><i></i><span id="estadoTxt">En línea</span><span class="conv-crono" id="crono"></span></span>
    </div>
    <button class="icono" id="btnVoz" type="button" aria-pressed="true" aria-label="Voz de ${attr(A.nombre)} activada" title="Activar o quitar la voz de ${attr(A.nombre)}">
      <svg class="voz-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>
      <svg class="voz-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6"/></svg>
    </button>
  </div>
  <div class="fases" id="fases" aria-hidden="true">${T.fases.map(() => "<span></span>").join("")}</div>
  <div class="fases-txt" aria-hidden="true">${T.fases.map(f => `<span>${f}</span>`).join("")}</div>

  <details class="solicitud" id="solicitud">
    <summary>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3M9 10h6M9 14h6M9 18h3"/></svg>
      <span class="sol-resumen"><b>Tu solicitud · <span id="solCuenta">0 de ${W.campos.filter(c => c.visible).length}</span></b><span id="solUltimo">Se rellena sola mientras hablas</span></span>
      <svg class="sol-flecha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </summary>
    <div class="sol-cuerpo">
      <p class="sol-diag" id="solDiag" hidden></p>
      <form id="formSolicitud" novalidate>
        <div class="sol-campos">
          ${campos.map(campoHtml).join("\n          ")}
          ${ocultos.map(c => `<input type="hidden" id="f-${c.id}">`).join("")}
        </div>
        ${datalist}
        <button class="boton boton-principal ancho sol-enviar" type="submit" id="solEnviar" hidden>${T.botonEnviar}</button>
      </form>
      ${W.mapa ? `<!-- Mapa de la dirección: aparece cuando el cliente dice dónde es la visita -->
      <figure class="sol-mapa" id="solMapa">
        <div class="mapa-espera" id="mapaEspera">
          ${svg24("mapa")}
          <b>${W.mapa.esperaTitulo}</b>
          <span>${W.mapa.esperaTexto}</span>
        </div>
        <iframe id="mapaMarco" title="Mapa con la dirección de la visita" loading="lazy" referrerpolicy="no-referrer-when-downgrade" hidden></iframe>
        <figcaption id="mapaPie" hidden></figcaption>
      </figure>` : ""}
      ${W.preparar ? `<!-- Lo que el cliente debe preparar: se adapta a lo que va contando -->
      <figure class="sol-mapa sol-docs" id="solDocs">
        <figcaption><b>${W.preparar.titulo}</b><span>${W.preparar.nota}</span></figcaption>
        <ul id="listaDocs"></ul>
      </figure>` : ""}
    </div>
  </details>

  <div class="conv-chat" id="chat" role="log" aria-live="polite"></div>
  <div class="chips" id="chips">
    ${T.chips.map(c => `<button class="chip" type="button">${esc(c)}</button>`).join("\n    ")}
  </div>
  <div class="adjunto" id="adjunto" hidden><img id="adjuntoImg" alt=""><span>Foto lista para enviar</span><button type="button" id="quitarFoto">Quitar</button></div>
  <form class="conv-escribir" id="formChat" autocomplete="off" hidden>
    <button class="icono" type="button" id="btnVolverVoz" aria-label="Volver a hablar">${MIC()}</button>
    <label class="oculto" for="txt">Escribe tu mensaje</label>
    <input id="txt" type="text" enterkeyhint="send" placeholder="Escribe aquí…">
    <button class="icono" type="button" id="btnFoto" aria-label="${attr(T.fotoAria)}">${FOTO}</button>
    <button class="icono enviar" type="submit" id="btnEnviar" aria-label="Enviar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
  </form>
  <input type="file" id="archivo" accept="image/*" capture="environment" hidden>
  <div class="conv-mandos">
    <button class="mando" type="button" id="btnTeclado" aria-pressed="false"><span class="circ">${TECLADO}</span>Escribir</button>
    <button class="mando mando-central" type="button" id="btnMic" aria-label="Hablar"><span class="circ"><svg class="i-mic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4"/></svg><svg class="i-colgar" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 9c-2.4 0-4.6.5-6.6 1.4-.6.3-1 .9-1 1.6v2.4c0 .8.8 1.4 1.6 1.2l2.6-.7c.6-.2 1-.7 1-1.4v-1.7a12 12 0 0 1 4.8 0v1.7c0 .7.4 1.2 1 1.4l2.6.7c.8.2 1.6-.4 1.6-1.2V12c0-.7-.4-1.3-1-1.6A15.6 15.6 0 0 0 12 9z"/></svg></span><span id="micTxt">Hablar</span></button>
    <button class="mando" type="button" id="btnSilenciar" aria-pressed="false"><span class="circ"><svg class="i-foto" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8a2 2 0 0 1 2-2h2l2-2h6l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/></svg><svg class="i-sil" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4M3 3l18 18"/></svg></span><span id="silTxt">Foto</span></button>
  </div>
  <p class="conv-nota">${T.convNota}</p>

  <div class="velo" id="velo" hidden></div>
  <div class="hoja" id="hojaMicro" role="dialog" aria-modal="true" aria-labelledby="hmTit" hidden>
    <h3 id="hmTit">Para hablar con <span data-n="tecnico">${A.nombre}</span></h3>
    <p>Tu navegador te pregunta ahora si dejas usar el micrófono. Pulsa <b>«Permitir»</b> en el aviso y empezamos. Solo te escuchamos mientras dura la conversación.</p>
    <p class="hm-pista" id="hmPista" aria-live="polite"><span class="hm-punto"></span>Esperando a que pulses «Permitir»…</p>
    <button class="boton boton-andres" type="button" id="hmEmpezar" hidden>No me sale el aviso: probar otra vez</button>
    <div class="pareja"><button class="boton boton-borde" type="button" id="hmEscribir">Prefiero escribir</button><a class="boton boton-borde" data-tel href="tel:${tel}">Prefiero llamar</a></div>
  </div>
  <div class="hoja" id="hojaSinMicro" role="dialog" aria-modal="true" aria-labelledby="hsTit" hidden>
    <h3 id="hsTit">No tengo permiso para el micrófono</h3>
    <p>No pasa nada: puedes escribirle a <span data-n="tecnico">${A.nombre}</span> o llamarnos.</p>
    <div class="pareja"><button class="boton boton-andres" type="button" id="hsEscribir">Escribir</button><a class="boton boton-borde" data-tel href="tel:${tel}">Llamar</a></div>
    <p style="margin-top:14px"><b>Para activarlo:</b></p>
    <ol><li>En iPhone: toca «aA» junto a la dirección → Ajustes del sitio web → Micrófono → Permitir.</li><li>En Android: toca el icono junto a la dirección → Permisos → Micrófono → Permitir.</li></ol>
    <button class="boton boton-borde" type="button" id="hsReintentar">Ya lo he activado, probar otra vez</button>
  </div>
  <div class="hoja" id="hojaAudio" role="dialog" aria-modal="true" hidden>
    <h3>Toca para oír a <span data-n="tecnico">${A.nombre}</span></h3>
    <p>Tu móvil necesita un toque para dejar sonar la voz.</p>
    <button class="boton boton-andres" type="button" id="haActivar">Activar el sonido</button>
  </div>
</section>

<script src="contenido.js"></script>
<script type="application/json" id="web-datos">${JSON.stringify(datosNavegador(W, A)).replace(/</g, "\\u003c")}</script>
<script type="module">
${js}
</script>
<script type="application/ld+json">
${JSON.stringify(ld)}
</script>`;

  if (previa) return `${cabeza}\n\n\n${cuerpo}\n`;
  return `<!doctype html>
<html lang="es" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${cabeza}
</head>
<body>
${cuerpo}
</body>
</html>
`;
}
