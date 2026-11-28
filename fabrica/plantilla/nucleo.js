// =====================================================================
//  CONVERSACIÓN CON EL ASISTENTE · código común de todas las webs de la fábrica
//  (fabrica/plantilla/nucleo.js). Lo propio de cada web llega en W (web-datos):
//  campos de la solicitud, lo que hay que preparar, destinos, textos y tarjeta final.
//  No editar en index.html: se genera con  node fabrica/construir.mjs <web>
// =====================================================================
import { NEGOCIO as N, saludo, lista } from "./cerebro.mjs";
// Lo que sabe el asistente va en sus instrucciones (instrucciones.mjs), que solo se descargan
// en la vista previa; con servidor, el móvil del cliente no descarga nada.
const W = JSON.parse(document.getElementById("web-datos").textContent);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const SERVIDOR = ($('meta[name="servidor-tecnico"]')?.content || "").replace(/\/$/, "");
const LK_TOKEN = $('meta[name="livekit-token"]')?.content || "";
const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esMovil = () => matchMedia("(max-width: 899px)").matches;
const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch {} };
const leer = k => { try { return localStorage.getItem(k); } catch { return null; } };

/* ------------------------------------------------------------------
   1. Rellenar la página con los datos del negocio
------------------------------------------------------------------ */
$$("[data-n]").forEach(el => { const v = N[el.dataset.n]; if (v) el.textContent = v; });
$$("[data-tel]").forEach(a => a.href = "tel:" + N.telefonoEnlace);
$$("[data-wa]").forEach(a => a.href = `https://wa.me/${N.whatsapp}?text=${encodeURIComponent(W.textos.waInicial)}`);
// (título, precios, horario y zona ya vienen escritos en la página al construirla)
pintarBloque(); pintarPreguntas();
const plataforma = typeof window.claude?.use === "function";
if (plataforma) $("#previa").hidden = false;

/* Bloque de datos del sector (impuesto, precios orientativos…): llega de contenido.js, con fuente y fecha */
function pintarBloque() {
  const I = window.__BLOQUE || window.__IMPUESTO; const sec = $(".seccion-datos");
  if (!I || !sec) { if (sec) sec.hidden = true; return; }
  $("#impuestoBajada").textContent = I.bajada;
  $("#impuestoDatos").innerHTML = I.casos.map(() => `<div class="imp-caso bd-caso"><b></b><span class="imp-cifra bd-cifra"></span><p></p></div>`).join("");
  $$("#impuestoDatos .imp-caso").forEach((el, k) => { const c = I.casos[k]; el.querySelector("b").textContent = c.quien; el.querySelector(".imp-cifra").textContent = c.cifra; el.querySelector("p").textContent = c.texto; });
  $("#impuestoFuente").textContent = I.fuente;
}
function pintarPreguntas() {
  const F = window.__PREGUNTAS || [];
  $("#faqLista").innerHTML = F.map(() => "<details><summary></summary><p></p></details>").join("");
  $$("#faqLista details").forEach((d, k) => { const n = t => String(t).replaceAll("{asistente}", N.tecnico); d.querySelector("summary").textContent = n(F[k][0]); d.querySelector("p").textContent = n(F[k][1]); });
}

/* ------------------------------------------------------------------
   2. Piezas de la conversación
------------------------------------------------------------------ */
const conv = $("#conv"), chat = $("#chat"), txt = $("#txt"), btnMic = $("#btnMic"), btnVoz = $("#btnVoz"), estadoTxt = $("#estadoTxt");
const ESTADOS = { reposo: "En línea", escuchando: "Te escucho…", pensando: "Pensando…", hablando: "Hablando · puedes interrumpirle" };
const mini = $("#mini"), miniTxt = $("#miniTxt");
function estado(e) {
  conv.dataset.estado = e; mini.dataset.estado = e; $("#tarjetaAndres").dataset.estado = e;
  estadoTxt.textContent = ESTADOS[e]; $("#miniEstado").textContent = ESTADOS[e].split(" ·")[0].toLowerCase();
  if (!llamada) $("#micTxt").textContent = e === "escuchando" ? "Terminar" : "Hablar";
}
function textoMini(t) { miniTxt.textContent = t; }
function textoMiniSolicitud() { const sol = $("#miniEstado").dataset.sol; if (sol && !llamada) miniTxt.textContent = sol.charAt(0).toUpperCase() + sol.slice(1); }

function burbuja(quien, texto = "", extra) {
  const b = document.createElement("div");
  b.className = "burbuja " + quien;
  if (quien === "tec") b.dataset.quien = N.tecnico;
  if (quien === "parcial") b.setAttribute("aria-hidden", "true");
  if (extra?.img) { const i = document.createElement("img"); i.src = extra.img; i.alt = "Foto enviada"; b.append(i); }
  if (texto) b.append(document.createTextNode(texto));
  chat.append(b); bajar(); return b;
}
function bajar() { chat.scrollTop = chat.scrollHeight; }
function puntos(b) { b.innerHTML = '<span class="puntos" aria-label="Escribiendo"><i></i><i></i><i></i></span>'; }

/* abrir, minimizar y cerrar la conversación (pantalla completa en móvil) */
let conversacionIniciada = false, abierta = false;
function abrirConversacion({ modo = "voz" } = {}) {
  conv.hidden = false; abierta = true; conv.dataset.modo = modo;
  document.body.classList.add("en-conversacion"); document.body.classList.remove("con-mini");
  if (esMovil() && history.state?.conv !== 1) history.pushState({ conv: 1 }, "");
  if (modo === "texto") mostrarTeclado(true);
  abrirEscenario();  // pedido por Juan: la solicitud y el mapa están a la vista desde el primer momento, antes de empezar a hablar
}
/* Escenario (solo ordenador): la solicitud se muda a un panel grande al lado de la conversación */
const escenario = $("#escenario");
const enEscenario = () => document.body.classList.contains("escenario-on");
function abrirEscenario() {
  if (esMovil() || enEscenario() || !abierta) return;
  $("#escHueco").append($("#solicitud")); $("#solicitud").open = true;
  escenario.hidden = false; document.body.classList.add("escenario-on");
  $("#escAviso").textContent = "Nº de aviso " + numAviso;
  pintarDocumentos(datosFormulario());
}
function cerrarEscenario() {
  if (!enEscenario()) return;
  conv.insertBefore($("#solicitud"), $("#chat")); $("#solicitud").open = false;
  escenario.hidden = true; document.body.classList.remove("escenario-on");
}
$("#escCerrar").addEventListener("click", () => minimizar());
matchMedia("(max-width: 899px)").addEventListener("change", e => { if (e.matches) cerrarEscenario(); });
function minimizar() {
  if (!abierta) return;
  cerrarEscenario();
  conv.hidden = true; abierta = false;
  document.body.classList.remove("en-conversacion");
  document.body.classList.toggle("con-mini", conversacionIniciada);
  textoMiniSolicitud();
}
addEventListener("popstate", () => { if (abierta) minimizar(); });
$("#btnMinimizar").addEventListener("click", () => { if (history.state?.conv === 1) history.back(); else minimizar(); });
$("#miniVolver").addEventListener("click", () => abrirConversacion({ modo: conv.dataset.modo }));
$("#miniColgar").addEventListener("click", () => colgar());
function mostrarTeclado(si) {
  $("#formChat").hidden = !si; $("#btnTeclado").setAttribute("aria-pressed", String(si));
  if (si) setTimeout(() => txt.focus({ preventScroll: true }), 60);
}
$("#btnTeclado").addEventListener("click", () => mostrarTeclado($("#formChat").hidden));
$("#btnVolverVoz").addEventListener("click", () => { mostrarTeclado(false); empezarVoz(); });

/* ------------------------------------------------------------------
   3. Capacidades: cerebro (IA), oídos (micrófono) y boca (voz)
   - En la vista previa de claude.ai usa las capacidades del visor.
   - En la web publicada: llamada en directo con LiveKit, o servidor propio
     y el reconocimiento y la voz del navegador.
------------------------------------------------------------------ */
const usar = name => plataforma ? window.claude.use(name).catch(() => null) : Promise.resolve(null);
const pSample = usar("sample"), pDictado = usar("dictation"), pVoz = usar("tts"), pDb = usar("db"), pUser = usar("user");

let dictado = null, vozPlataforma = null, sinCerebro = false;
const RecWeb = window.SpeechRecognition || window.webkitSpeechRecognition;

// ---- oídos ----
let escuchando = false, bufferVoz = "", parcial = null, temporizador = null, recWeb = null;
pDictado.then(d => {
  dictado = d;
  if (d) {
    d.onPartial(({ text }) => { mostrarParcial(text); reprogramar(); });
    d.onFinal(({ text }) => { bufferVoz += text; mostrarParcial(""); reprogramar(); });
    d.onState(({ state, reason }) => {
      if (state === "listening" || state === "starting") { escuchando = true; estado("escuchando"); }
      if (state === "idle") {
        escuchando = false; clearTimeout(temporizador);
        if (["not_granted", "unavailable"].includes(reason)) sinMicro();
        cerrarEscucha();
      }
    });
  }
});
function hayMicro() { return !!(LK_TOKEN || dictado || RecWeb); }
function mostrarParcial(t) {
  const visible = (bufferVoz + " " + (t || "")).trim();
  if (!visible) { parcial?.remove(); parcial = null; return; }
  if (!parcial) parcial = burbuja("parcial");
  parcial.textContent = visible; bajar(); textoMini(visible);
}
function reprogramar() {
  clearTimeout(temporizador);
  temporizador = setTimeout(() => { if (escuchando) pararEscucha(); }, 1700);
}
function empezarEscucha() {
  callar();
  bufferVoz = "";
  if (dictado) {
    dictado.start().catch(e => {
      escuchando = false; estado("reposo");
      if (e?.code === "not_granted" || e?.code === "unavailable") sinMicro();
    });
    escuchando = true; estado("escuchando");
    return;
  }
  if (RecWeb) {
    recWeb = new RecWeb(); recWeb.lang = "es-ES"; recWeb.interimResults = true; recWeb.continuous = false;
    recWeb.onresult = ev => {
      let fin = "", tmp = "";
      for (const r of ev.results) (r.isFinal ? (fin += r[0].transcript) : (tmp += r[0].transcript));
      bufferVoz = fin; mostrarParcial(tmp);
    };
    recWeb.onerror = ev => { if (ev.error === "not-allowed") sinMicro(); };
    recWeb.onend = () => { escuchando = false; cerrarEscucha(); };
    try { recWeb.start(); escuchando = true; estado("escuchando"); } catch { estado("reposo"); }
    return;
  }
  mostrarTeclado(true);
}
function pararEscucha() {
  clearTimeout(temporizador);
  if (dictado) dictado.stop().catch(() => {});
  else if (recWeb) recWeb.stop();
}
function cerrarEscucha() {
  const dicho = (bufferVoz + " " + (parcial?.textContent && !bufferVoz ? parcial.textContent : "")).trim();
  parcial?.remove(); parcial = null; bufferVoz = "";
  if (conv.dataset.estado === "escuchando") estado("reposo");
  if (dicho) enviar(dicho, { porVoz: true });
}

/* Antes de que el móvil pida el micrófono, le explicamos qué va a salir */
function hoja(id) {
  ["#hojaMicro", "#hojaSinMicro", "#hojaAudio"].forEach(h => $(h).hidden = h !== id);
  $("#velo").hidden = !id;
}
async function estadoPermiso() {
  try { return (await navigator.permissions.query({ name: "microphone" })).state; } catch { return "prompt"; }
}
/* El navegador SIEMPRE pide permiso para el micrófono la primera vez: no se puede evitar.
   Lo que sí se puede es que lo explique el propio asistente de viva voz (para hablar él no hace falta
   permiso): al pulsar «Hablar», el asistente dice «tu navegador te va a pedir el micrófono, pulsa Permitir»
   y el aviso sale justo mientras lo dice. Pedido por Juan el 22-11-2026: sin botón intermedio. */
// El audio está grabado con la voz del asistente (asistente.json). Si se cambia el nombre o la voz y aún no
// se ha vuelto a grabar, la fábrica lo deja vacío y la frase la dice la voz del navegador.
const avisoMicro = new Audio(); avisoMicro.preload = "none"; if (W.audioMicro) avisoMicro.src = W.audioMicro;
else { avisoMicro.play = () => { decir(`Tu navegador te va a pedir permiso para el micrófono. Pulsa «Permitir» y hablamos.`); return Promise.resolve(); }; avisoMicro.pause = () => {}; }
let avisoCebado = Promise.resolve();
// Safari solo deja sonar un audio que se haya «tocado» dentro de la pulsación: se ceba en silencio en ese instante
function cebarAviso() {
  if (!W.audioMicro) return;
  avisoMicro.muted = true;
  avisoCebado = avisoMicro.play().then(() => { avisoMicro.pause(); avisoMicro.currentTime = 0; }).catch(() => {}).finally(() => { avisoMicro.muted = false; });
}
async function pedirMicro() {
  // En la vista previa de claude.ai el micrófono lo da el visor (dictation): pide el permiso él al empezar a
  // escuchar. Pedirlo aquí al navegador falla siempre dentro del visor y salía «No tengo permiso» (encontrado por Juan).
  if (dictado || (LK_TOKEN === "" && plataforma)) return true;
  const st = await estadoPermiso();
  if (st === "granted") return true;
  if (st === "denied") { sinMicro(); return false; }
  return new Promise(ok => {
    let resuelto = false, espera = 0;
    const terminar = (vale) => { if (resuelto) return; resuelto = true; clearTimeout(espera); avisoMicro.pause(); if (vale) hoja(null); ok(vale); };
    const pedir = async () => {
      $("#hmEmpezar").hidden = true; $("#hmPista").hidden = false;
      setTimeout(() => { if (!resuelto) $("#hmEmpezar").hidden = false; }, 9000);   // por si el aviso no llega a salir
      try {
        const flujo = await navigator.mediaDevices.getUserMedia({ audio: true });
        flujo.getTracks().forEach(p => p.stop());   // solo era para conseguir el permiso: el micro de verdad lo abre la llamada
        terminar(true);
      } catch { if (!resuelto) { resuelto = true; avisoMicro.pause(); sinMicro(); ok(false); } }
    };
    hoja("#hojaMicro");
    avisoCebado.then(() => { if (!resuelto && !reducirVoz()) avisoMicro.play().catch(() => {}); });
    espera = setTimeout(pedir, 1900);   // el aviso del navegador sale cuando el asistente está diciendo «te va a pedir el micrófono»
    $("#hmEmpezar").onclick = pedir;
    $("#hmEscribir").onclick = () => { terminar(false); hoja(null); mostrarTeclado(true); };
  });
}
function reducirVoz() { return $("#btnVoz")?.getAttribute("aria-pressed") === "false"; }   // si ha quitado la voz del asistente, no suena
function sinMicro() { estado("reposo"); hoja("#hojaSinMicro"); }
$("#hsEscribir").addEventListener("click", () => { hoja(null); mostrarTeclado(true); });
$("#hsReintentar").addEventListener("click", () => { hoja(null); empezarVoz(); });
$("#velo").addEventListener("click", () => hoja(null));

async function empezarVoz() {
  if (!hayMicro() || sinCerebro) { mostrarTeclado(true); return; }
  if (!(await pedirMicro())) return;
  if (LK_TOKEN) { if (!llamada) llamar(); }
  else if (!escuchando) empezarEscucha();
}
btnMic.addEventListener("click", () => {
  if (llamada) return colgar();
  if (escuchando) return pararEscucha();
  empezarVoz();
});

// ---- boca ----
let vozActiva = true, hablandoNavegador = 0;
pVoz.then(t => {
  vozPlataforma = t;
  t?.onState?.(({ state }) => {
    if (state === "speaking") estado("hablando");
    else if (state === "idle" && conv.dataset.estado === "hablando") estado("reposo");
  });
});
function vozEspanola() {
  const vs = speechSynthesis.getVoices().filter(v => /^es[-_]ES/i.test(v.lang));
  // voz del navegador acorde con el asistente (hombre o mujer, en asistente.json)
  const mujer = W.asistente.genero === "mujer";
  const suyo = mujer ? /m[óo]nica|elvira|lucia|luc[ií]a|paulina|helena|laura|elena|female|mujer/i : /jorge|alvaro|[áa]lvaro|pablo|dar[ií]o|enrique|male(?!.*female)|hombre/i;
  const pref = [v => suyo.test(v.name) && /natural|neural|online/i.test(v.name), v => suyo.test(v.name), v => /natural|neural|online/i.test(v.name), v => /google/i.test(v.name)];
  for (const r of pref) { const v = vs.find(r); if (v) return v; }
  return vs[0] || speechSynthesis.getVoices().find(v => /^es/i.test(v.lang));
}
function decir(frase) {
  frase = frase.trim();
  if (!vozActiva || !frase) return;
  if (vozPlataforma) { vozPlataforma.add([{ text: frase, language: "es" }]).catch(e => { if (e?.code === "not_granted") vozPlataforma = null; }); return; }
  if ("speechSynthesis" in window) {
    const u = new SpeechSynthesisUtterance(frase);
    u.lang = "es-ES"; u.rate = 1.03; const v = vozEspanola(); if (v) u.voice = v;
    u.onstart = () => estado("hablando");
    u.onend = u.onerror = () => { if (--hablandoNavegador <= 0) { hablandoNavegador = 0; if (conv.dataset.estado === "hablando") estado("reposo"); } };
    hablandoNavegador++; speechSynthesis.speak(u);
  }
}
function callar() {
  vozPlataforma?.stop?.().catch?.(() => {});
  if ("speechSynthesis" in window) { speechSynthesis.cancel(); hablandoNavegador = 0; }
  if (conv.dataset.estado === "hablando") estado("reposo");
}
btnVoz.addEventListener("click", () => {
  vozActiva = !vozActiva;
  btnVoz.setAttribute("aria-pressed", vozActiva);
  btnVoz.setAttribute("aria-label", vozActiva ? `Voz de ${N.tecnico} activada` : `Voz de ${N.tecnico} quitada`);
  if (!vozActiva) callar();
  audioAgente.forEach(a => a.muted = !vozActiva);
});

// ---- cerebro ----
const turnos = [];
// Manual técnico opcional de la web (W.manual: manual.mjs + conocimiento.mjs junto a la página). Solo se
// descarga cuando el asistente responde desde el navegador (vista previa); con servidor, lo consulta el servidor.
let manual = null;
const cargarManual = () => manual ||= Promise.all([import("./manual.mjs"), import("./conocimiento.mjs")])
  .then(([m, c]) => ({ buscar: m.buscar, datos: m.preparar(c.default) }));
let enCurso = null;

async function pensar(onText, signal, imagen) {
  const recientes = turnos.slice(-30);
  const sample = await pSample;
  if (sample) {
    const { instrucciones } = await import("./instrucciones.mjs");
    let ultimos = recientes;
    if (W.manual) {   // el asistente consulta su manual con lo último que ha dicho el cliente y recibe solo las fichas que tocan
      const m = await cargarManual(), consulta = m.buscar(m.datos, recientes).texto;
      if (consulta) ultimos = [...recientes.slice(0, -1), { ...recientes.at(-1), content: recientes.at(-1).content + "\n\n" + consulta }];
    }
    const conversacion = [{ role: "user", content: instrucciones(N) }, { role: "assistant", content: saludo(N) }, ...ultimos];
    const opciones = { modelTier: "quick", cache: false, onText, signal };
    if (imagen) opciones.images = imagen.blob;
    const r = await sample(conversacion, opciones);
    return r.text;
  }
  if (SERVIDOR) {
    const res = await fetch(SERVIDOR + "/tecnico", {
      method: "POST", signal, headers: { "content-type": "application/json" },
      body: JSON.stringify({ turnos: turnos.slice(-30), imagen: imagen?.dataUrl || null })
    });
    if (!res.ok || !res.body) throw { code: "upstream_error" };
    const lector = res.body.getReader(), dec = new TextDecoder();
    let total = "";
    for (;;) {
      const { value, done } = await lector.read(); if (done) break;
      const delta = dec.decode(value, { stream: true }); total += delta; onText({ text: total, delta });
    }
    return total;
  }
  throw { code: "sin_cerebro" };
}

// separa lo que se dice en voz alta de las etiquetas internas
function visible(t) { const i = t.search(/<(ficha|aviso|mostrar)/); return (i >= 0 ? t.slice(0, i) : t).replace(/<\/?[a-z]*$/i, "").trim(); }
function etiqueta(t, nombre, crudo = false) {
  const m = t.match(new RegExp(`<${nombre}>\\s*([\\s\\S]*?)\\s*</${nombre}>`));
  if (m) { if (crudo) return m[1].trim(); try { return JSON.parse(m[1]); } catch { /* sigue abajo */ } }
  if (crudo) return null;
  // Tolerante: a veces el modelo olvida la etiqueta de cierre. Se toma el primer objeto JSON completo tras la
  // etiqueta de apertura (contando llaves), para que una solicitud no se pierda por un «</aviso>» que falta.
  const i = t.indexOf(`<${nombre}>`); if (i < 0) return null;
  const ini = t.indexOf("{", i); if (ini < 0) return null;
  let prof = 0, enTexto = false, escape = false;
  for (let k = ini; k < t.length; k++) {
    const c = t[k];
    if (enTexto) { if (escape) escape = false; else if (c === "\\") escape = true; else if (c === '"') enTexto = false; continue; }
    if (c === '"') enTexto = true; else if (c === "{") prof++; else if (c === "}" && --prof === 0) { try { return JSON.parse(t.slice(ini, k + 1)); } catch { return null; } }
  }
  return null;
}

async function enviar(texto, { porVoz = false } = {}) {
  texto = (texto || "").trim();
  const imagen = fotoPendiente; quitarFoto();
  if (!texto && !imagen) return;
  if (!texto) texto = "Te envío una foto.";
  $("#chips").hidden = true;
  if (llamada) { burbuja("cli", texto); llamada.localParticipant.sendText(texto, { topic: "lk.chat" }).catch(() => {}); return; }
  if (enCurso) enCurso.abort();
  callar();
  burbuja("cli", texto, imagen ? { img: imagen.url } : null);
  turnos.push({ role: "user", content: imagen ? `[El cliente adjunta una foto] ${texto}` : texto });

  const b = burbuja("tec"); puntos(b); estado("pensando");
  const ctl = new AbortController(); enCurso = ctl;
  let dichoHasta = 0, mostrado = "", yaSenalado = false;
  conversacionIniciada = true;
  const trocear = (final) => {
    const v = mostrado;
    let corte = -1;
    const re = /[.!?…:](\s+|$)/g; let m;
    while ((m = re.exec(v))) if (m.index + 1 > dichoHasta && (m[1] || final)) corte = m.index + 1;
    if (final) corte = v.length;
    if (corte > dichoHasta) { decir(v.slice(dichoHasta, corte)); dichoHasta = corte; }
  };
  try {
    const respuesta = await pensar(({ text }) => {
      if (ctl.signal.aborted) return;
      const v = visible(text);
      if (v && v !== mostrado) { mostrado = v; b.textContent = v; bajar(); textoMini(v); if (porVoz || vozActiva) trocear(false); }
      if (!yaSenalado) { const d = etiqueta(text, "mostrar", true); if (d) { yaSenalado = true; senalar(d); } }
    }, ctl.signal, imagen);
    if (ctl.signal.aborted) return;
    if (!respuesta || !respuesta.trim()) throw { code: "upstream_error" };
    mostrado = visible(respuesta) || mostrado;
    b.textContent = mostrado || "Perdona, ¿me lo repites?"; textoMini(b.textContent);
    if (!yaSenalado) { const d = etiqueta(respuesta, "mostrar", true); if (d) senalar(d); }
    trocear(true);
    const f = etiqueta(respuesta, "ficha"); if (f) pintarFicha(f);
    // el aviso solo vale con los datos obligatorios y un teléfono válido (si el asistente se adelanta, se ignora y sigue la conversación)
    const a = etiqueta(respuesta, "aviso");
    let nota = "(registrado)";
    if (a && !avisoHecho) {
      const d = { ...datosFormulario(), ...Object.fromEntries(Object.entries(a).filter(([, v]) => v)) };
      const faltan = obligatorios(a.tipo || W.tipoPrincipal).filter(([c]) => !d[c]).map(([, t]) => t);
      if (!faltan.length && telefonoValido(d.telefono)) { CAMPOS_FORM.forEach(c => a[c] && !datosFormulario()[c] && ponerCampo(c, String(a[c]))); registrarAviso({ ...a, ...d, origen: "técnico virtual" }); }
      // si no se registra, el asistente lo sabe en el siguiente turno y vuelve a enviarlo cuando tenga los datos
      else nota = `(NO registrado: faltan ${faltan.length ? faltan.join(", ") : "un teléfono válido"}; envíalo otra vez cuando los tengas y el cliente los confirme)`;
    }
    turnos.push({ role: "assistant", content: respuesta.replace(/<aviso>[\s\S]*?(<\/aviso>|$)/, `<aviso>${nota}</aviso>`) });
    ofrecerCita(b);
    if (conv.dataset.estado === "pensando") estado("reposo");
  } catch (e) {
    if (e?.code === "cancelled") return;
    turnos.pop();
    estado("reposo");
    const sinIA = ["sin_cerebro", "not_granted", "sampling_disabled", "not_declared", "capability_disabled"].includes(e?.code);
    if (sinIA) sinCerebro = true;
    b.textContent = e?.code === "rate_limited" ? "Ahora mismo tengo muchas consultas. Dame un minuto y vuelve a intentarlo, o llámanos al " + N.telefono + "."
      : sinIA ? `Ahora mismo no puedo atenderte por aquí. Llámanos al ${N.telefono} o déjanos tu teléfono y te llamamos.`
      : "Se me ha cortado la conexión. ¿Me lo repites?";
  } finally { if (enCurso === ctl) enCurso = null; }
}

/* Botón «Quiero la cita» bajo la última respuesta: la venta no depende de que el asistente la proponga
   con las palabras justas. Solo uno a la vista, y se quita en cuanto se pide o se registra. */
function ofrecerCita(tras) {
  $$(".cta-cita").forEach(x => x.replaceWith());
  if (avisoHecho || llamada || FASES.indexOf(fichaActual.fase) >= 3 || turnos.filter(t => t.role === "user").length < 1) return;
  const t = W.textos.botonCita || ("Quiero " + W.textos.waAviso.principal);
  const btn = document.createElement("button"); btn.type = "button"; btn.className = "chip cta-cita"; btn.textContent = t;
  btn.addEventListener("click", () => { btn.replaceWith(); enviar(t + "."); });
  tras.after(btn); bajar();
}

/* El asistente enseña algo: en el móvil, como tarjeta dentro de la conversación (la página no se
   mueve sola, que marea); en el ordenador, desplazando la página que se ve al lado. */
const sinTildes = t => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
function destino(d) {
  const [tipo, extra] = sinTildes(d).trim().split(":").map(x => x.trim());
  const x = W.destinos[tipo]; if (!x) return null;
  if (x.solicitud) return { solicitud: true };
  const B = window.__BLOQUE || window.__IMPUESTO;
  const el = x.sel ? $(x.sel) : null;
  if (el && x.abrir && "open" in el) el.open = true;
  const titulo = extra && x.tituloValor ? x.tituloValor.replace("{VALOR}", extra.toUpperCase()) : x.titulo;
  return { el, titulo, texto: (x.bloque && B?.resumen) || x.texto, extra };
}
function senalar(d) {
  const x = destino(d); if (!x) return;
  if (x.solicitud) { $("#solicitud").open = true; abrirEscenario(); return; }
  if (esMovil() || enEscenario() || !x.el) {   // con el escenario abierto la web queda tapada: se enseña en una tarjeta
    const t = document.createElement("div");
    t.className = "tarjeta-info";
    t.innerHTML = `<small></small><p></p>`;
    t.querySelector("small").textContent = x.titulo; t.querySelector("p").textContent = x.texto;
    if (x.el) {
      const ver = document.createElement("button"); ver.type = "button"; ver.textContent = "Ver en la web";
      ver.addEventListener("click", () => { minimizar(); setTimeout(() => x.el.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "center" }), 80); });
      t.append(ver);
    }
    chat.append(t); bajar(); return;
  }
  x.el.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "center" });
  x.el.style.position ||= "relative";
  x.el.classList.remove("senalado"); void x.el.offsetWidth; x.el.classList.add("senalado");
  x.el.querySelector(":scope > .senal-etiqueta")?.remove();
  const et = document.createElement("span"); et.className = "senal-etiqueta"; et.textContent = N.tecnico + " te lo señala";
  x.el.append(et);
  setTimeout(() => { et.remove(); x.el.classList.remove("senalado"); }, 3800);
}

/* ------------------------------------------------------------------
   4. Tu solicitud (se rellena sola mientras hablan) y avisos
------------------------------------------------------------------ */
const FASES = ["entendiendo", "orientando", "proponiendo", "datos", "registrado"];
const VISIBLES = W.campos.filter(c => c.visible).map(c => c.id);
const NOMBRES = Object.fromEntries(W.campos.map(c => [c.id, c.corto]));
const DEL_CASO = W.campos.filter(c => c.grupo === "caso").map(c => c.id);
let fichaActual = {}, avisoHecho = false, ultimoCampo = "";
const numAviso = String(Date.now()).slice(-5);
const obligatorios = (tipo = W.tipoPrincipal) => (W.obligatoriosTipo && W.obligatoriosTipo[tipo]) || W.obligatorios;
function pintarFicha(f, alFormulario = true) {
  fichaActual = { ...fichaActual, ...Object.fromEntries(Object.entries(f).filter(([, v]) => v)) };
  const F = fichaActual;
  // la <ficha> puede llamar distinto a algún campo (W.fichaAlias, p. ej. «sintoma» → «averia»)
  const G = { ...F }; for (const [de, a] of Object.entries(W.fichaAlias || {})) if (F[de]) G[a] = F[de];
  if (alFormulario) CAMPOS_FORM.forEach(c => ponerCampo(c, G[c]));
  const orient = F[W.campoOrientacion || "orientacion"];
  if (orient) { $("#solDiag").hidden = false; $("#solDiag").textContent = W.textos.orientacion + orient; }
  faseModelo = Math.max(faseModelo, FASES.indexOf(avisoHecho ? "registrado" : F.fase) + 1);
  resumirSolicitud();
}
let faseModelo = 0;
function resumirSolicitud() {
  const d = datosFormulario();
  // avance: lo que diga el asistente o lo que ya hay escrito en la solicitud
  const porDatos = avisoHecho ? 5 : (d.telefono || d.nombre) ? 4 : fichaActual[W.campoOrientacion || "orientacion"] ? 2 : DEL_CASO.some(c => d[c]) ? 1 : 0;
  const n = Math.max(faseModelo, porDatos);
  $$("#fases span").forEach((x, i) => x.classList.toggle("hecha", i < n));
  $$(".fases-txt span").forEach((x, i) => x.classList.toggle("actual", i === Math.max(0, Math.min(n, 5) - 1) && n > 0));
  $("#miniEstado").dataset.sol = n ? `tu solicitud ${VISIBLES.filter(c => d[c]).length} de ${VISIBLES.length}` : "";
  const llenos = VISIBLES.filter(c => d[c]).length;
  $("#solCuenta").textContent = `${llenos} de ${VISIBLES.length}`;
  if (ultimoCampo && d[ultimoCampo]) $("#solUltimo").textContent = `${NOMBRES[ultimoCampo]}: ${d[ultimoCampo]}`;
  $$(".sol-campos .campo").forEach(c => c.classList.toggle("lleno", !!c.querySelector("input")?.value.trim()));
  const listo = obligatorios().every(([c]) => d[c]);
  $("#solEnviar").hidden = !listo || avisoHecho;
  if (llenos) abrirEscenario();
  escenario.dataset.estado = avisoHecho ? "enviada" : "rellenando";
  $("#escEstado").textContent = W.textos.escEstado[avisoHecho ? "enviada" : listo ? "lista" : "rellenando"];
  pintarDocumentos(d);
  if (W.mapa) pintarMapa(d);
}

/* Mapa de Google con la dirección de la visita (W.mapa). Sin clave usa el mapa incrustado normal de Google;
   con <meta name="google-maps-clave"> usa la versión oficial (Maps Embed API, gratuita).
   En el móvil solo se carga cuando el cliente ya ha dado una dirección o un municipio; en el escenario
   (ordenador) enseña ya la zona de servicio. */
const CLAVE_MAPA = $('meta[name="google-maps-clave"]')?.content || "";
let mapaActual = "", mapaEspera = 0;
function pintarMapa(d) {
  if (!$("#mapaMarco")) return;
  const M = W.mapa, sinDatos = !d.direccion && !d.municipio;
  if (sinDatos && !enEscenario()) return;
  const prov = new RegExp(sinTildes(M.provincia), "i");
  const lugar = sinDatos ? N.ciudad + ", España" : [d.direccion, d.municipio, prov.test(sinTildes(d.municipio)) ? "" : M.provincia, "España"].filter(Boolean).join(", ");
  if (lugar === mapaActual) return;
  mapaActual = lugar;
  clearTimeout(mapaEspera);
  mapaEspera = setTimeout(() => {   // espera a que el dato deje de cambiar para no recargar el mapa a cada letra
    const q = encodeURIComponent(lugar), zoom = d.direccion ? 17 : sinDatos ? 12 : 13;
    $("#mapaMarco").src = CLAVE_MAPA
      ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(CLAVE_MAPA)}&q=${q}&zoom=${zoom}&language=es`
      : `https://www.google.com/maps?q=${q}&z=${zoom}&hl=es&output=embed`;
    $("#mapaMarco").hidden = false; $("#mapaEspera").hidden = true;
    const pie = $("#mapaPie"); pie.hidden = false;
    pie.innerHTML = `<b>${sinDatos ? M.zonaTitulo : M.visitaTitulo}</b>`;
    pie.append(sinDatos ? M.zonaTexto : [d.direccion, d.municipio].filter(Boolean).join(", "));
  }, sinDatos ? 150 : 900);
}

/* Ruta de la visita (W.final.<tipo>.ruta): dibujo del trayecto de la base a casa del cliente, con la franja
   que ha pedido. Es ilustrativo (no hay seguimiento en directo) y el texto no promete otra cosa. */
function rutaVisita(aviso, R) {
  const id = "ruta" + numAviso + Math.random().toString(36).slice(2, 6);
  const sitio = (aviso.municipio || aviso.direccion || "Tu casa").split(",")[0].trim().slice(0, 22);
  const fr = (aviso.franja || "").trim();
  const cuando = !fr ? R.plazo : /^(hoy|mañana|pasado|el |este |esta |lunes|martes|miércoles|jueves|viernes|sábado|domingo|por la|a partir|entre|antes|después)/i.test(fr) ? fr : "· " + fr;
  const f = document.createElement("figure");
  f.className = "ruta";
  f.innerHTML = `<svg viewBox="0 0 320 150" role="img">
    <rect class="r-manzana" x="0" y="0" width="320" height="150"/>
    <path class="r-calle" d="M0 38H320M0 112H320M70 0V150M168 0V150M262 0V150"/>
    <path class="r-camino" id="${id}" d="M44 112 C110 112 120 74 168 74 S226 46 250 46"/>
    <g class="r-taller"><rect x="30" y="98" width="28" height="22" rx="3"/><path d="M27 100 44 87 61 100Z"/></g>
    <text class="r-texto" x="24" y="138"></text>
    <circle class="r-onda" cx="284" cy="30" r="12"/>
    <g class="r-casa" transform="translate(284 30)"><path d="M0 18C-10 6-12 0-12-5a12 12 0 0 1 24 0c0 5-2 11-12 23Z"/><path d="M-6-3 0-8 6-3V4H-6Z" fill="#fff"/></g>
    <text class="r-texto" x="290" y="74" text-anchor="middle"></text>
    <g class="furgo">
      <g transform="translate(-17 -13)">
        <path class="f-cuerpo" d="M2 6h21l7 6h3a2 2 0 0 1 2 2v6H2Z"/>
        <path class="f-cristal" d="M24 7.5h-2v5h7Z"/>
        <rect class="f-franja" x="2" y="13" width="31" height="3"/>
        <circle class="f-rueda" cx="9" cy="21" r="3.2"/><circle class="f-rueda" cx="27" cy="21" r="3.2"/>
      </g>
      <animateMotion dur="3.4s" begin="indefinite" fill="freeze" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .25 1"><mpath href="#${id}"/></animateMotion>
    </g>
  </svg><figcaption><b></b></figcaption>`;
  f.querySelector("svg").setAttribute("aria-label", `Dibujo de la ruta desde ${R.origen.toLowerCase()} hasta ${sitio}`);
  f.querySelectorAll(".r-texto")[0].textContent = R.origen;
  f.querySelectorAll(".r-texto")[1].textContent = sitio;
  f.querySelector("figcaption b").textContent = R.texto + " " + cuando;
  const furgo = f.querySelector(".furgo"), anim = f.querySelector("animateMotion");
  const llegar = () => { f.classList.add("llegado"); };
  if (reducir || !anim.beginElement) { furgo.setAttribute("transform", "translate(250 46)"); anim.remove(); llegar(); }
  else {
    anim.addEventListener("endEvent", llegar);
    // arranca cuando la tarjeta está a la vista
    new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { o.disconnect(); setTimeout(() => { try { anim.beginElement(); } catch { llegar(); } }, 350); } }, { threshold: .4 }).observe(f);
  }
  return f;
}

/* Lo que el cliente debe preparar: la lista se ajusta a lo que va contando (reglas de web.mjs).
   Cada regla añade un documento si alguno de sus campos encaja con su expresión; las de un mismo
   «grupo» se excluyen (vale la primera que encaje, y la que no tiene condición es la de por defecto).
   Es orientativa: el profesional confirma. */
let docsActual = "";
function pintarDocumentos(d) {
  if (!W.preparar || !$("#listaDocs")) return;
  const docs = [], grupos = new Set();
  for (const r of W.preparar.reglas) {
    if (r.grupo && grupos.has(r.grupo)) continue;
    const vale = !r.campos || r.campos.some(c => new RegExp(r.re, "i").test(sinTildes(d[c])));
    if (!vale) continue;
    if (r.grupo) grupos.add(r.grupo);
    docs.push(r.doc);
  }
  const clave = docs.map(x => x[0]).join("|");
  if (clave === docsActual) return;
  docsActual = clave;
  $("#listaDocs").innerHTML = docs.map(() => "<li><b></b><span></span></li>").join("");
  $$("#listaDocs li").forEach((li, k) => { li.querySelector("b").textContent = docs[k][0]; li.querySelector("span").textContent = docs[k][1]; if (!docs[k][1]) li.querySelector("span").remove(); });
}

async function registrarAviso(aviso) {
  avisoHecho = aviso.origen === "técnico virtual" || aviso.origen === "cliente" ? true : avisoHecho;
  const registro = { ...aviso, ficha: fichaActual, creado: new Date().toISOString(), pagina: location.href.slice(0, 200) };
  let guardado = false;
  try { const db = await pDb; if (db) { await db.collection("avisos").add(registro); guardado = true; } } catch {}
  if (SERVIDOR) { try { const r = await fetch(SERVIDOR + "/aviso", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(registro) }); guardado = guardado || r.ok; } catch {} }
  if (aviso.origen !== "formulario") {
    pintarFicha({ fase: "registrado" }); if (!enEscenario()) $("#solicitud").open = false; resumirSolicitud();
    const resumen = W.resumenAviso.map(([c, pre]) => aviso[c] && pre + aviso[c]).filter(Boolean).join(" · ");
    const queTipo = aviso.tipo === W.tipoPrincipal ? "principal" : aviso.tipo;
    const fin = W.final[queTipo] || W.final.principal;
    const wa = `Hola, soy ${aviso.nombre || ""}. Acabo de pedir ${W.textos.waAviso[queTipo] || W.textos.waAviso.principal} con ${N.tecnico} en la web (nº ${numAviso}): ${resumen}. ${aviso.direccion || aviso.municipio || ""} ${aviso.franja ? "· " + aviso.franja : ""}`.replace(/\s+/g, " ").trim();
    const t = document.createElement("div");
    t.className = "tarjeta-aviso"; t.setAttribute("role", "status");
    const titulo = !guardado ? W.textos.preparada : fin.titulo;
    const pasos = fin.pasos;
    t.innerHTML = `<h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg></h4><p class="final-cifra"></p><p class="final-txt"></p><ol></ol><a class="boton boton-principal boton-wa" target="_blank" rel="noopener">Guardarlo en WhatsApp</a>`;
    t.querySelector("h4").append(titulo);
    t.querySelector(".final-cifra").textContent = "Nº de aviso " + numAviso;
    t.querySelector(".final-txt").textContent = resumen + (guardado ? "" : ". No hemos podido enviarla: mándanosla por WhatsApp para asegurarte.");
    t.querySelector("ol").innerHTML = pasos.map(p => `<li>${p}</li>`).join("");
    if (fin.ruta) t.querySelector("ol").before(rutaVisita(aviso, fin.ruta));
    t.querySelector("a").href = `https://wa.me/${N.whatsapp}?text=${encodeURIComponent(wa)}`;
    chat.append(t); bajar();
  }
  return guardado;
}

/* ------------------------------------------------------------------
   5. Interacción
------------------------------------------------------------------ */
$("#formChat").addEventListener("submit", e => { e.preventDefault(); const v = txt.value; txt.value = ""; enviar(v); });
$$("#chips .chip").forEach(c => c.addEventListener("click", () => enviar(c.textContent)));

$$("[data-hablar]").forEach(b => b.addEventListener("click", () => {
  const voz = b.hasAttribute("data-voz");
  abrirConversacion({ modo: voz ? "voz" : "texto" });
  if (voz) empezarVoz(); else mostrarTeclado(true);
}));
document.addEventListener("click", e => {
  const p = e.target.closest("[data-preguntar]"); if (!p) return;
  abrirConversacion({ modo: "texto" }); enviar(p.dataset.preguntar);
});

// silenciar el micrófono (solo durante la llamada en directo)
$("#btnSilenciar").addEventListener("click", async () => {
  if (!llamada) { $("#archivo").click(); return; }
  const silenciado = $("#btnSilenciar").getAttribute("aria-pressed") === "true";
  await llamada.localParticipant.setMicrophoneEnabled(silenciado).catch(() => {});
  $("#btnSilenciar").setAttribute("aria-pressed", String(!silenciado));
  $("#silTxt").textContent = silenciado ? "Silenciar" : "Activar micro";
});
function modoMandos() {
  const enLlamada = !!llamada;
  $("#silTxt").textContent = enLlamada ? "Silenciar" : "Foto";
  $("#btnSilenciar").setAttribute("aria-pressed", "false");
  $("#micTxt").textContent = enLlamada ? "Colgar" : "Hablar";
  btnMic.setAttribute("aria-label", enLlamada ? "Colgar" : "Hablar");
}

// fotos
let fotoPendiente = null;
$("#btnFoto").addEventListener("click", () => $("#archivo").click());
$("#archivo").addEventListener("change", async e => {
  const f = e.target.files?.[0]; e.target.value = ""; if (!f || !f.type.startsWith("image/")) return;
  const reducida = await reducirFoto(f);
  fotoPendiente = { blob: reducida.blob, url: URL.createObjectURL(reducida.blob), dataUrl: reducida.dataUrl };
  $("#adjuntoImg").src = fotoPendiente.url; $("#adjunto").hidden = false; mostrarTeclado(true); txt.placeholder = "Añade un comentario o pulsa enviar";
});
function quitarFoto() { fotoPendiente = null; $("#adjunto").hidden = true; txt.placeholder = "Escribe aquí…"; }
$("#quitarFoto").addEventListener("click", quitarFoto);
async function reducirFoto(file) {
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, 1400 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise(r => c.toBlob(r, "image/jpeg", .85));
    return { blob, dataUrl: c.toDataURL("image/jpeg", .85) };
  } catch { return { blob: file, dataUrl: null }; }
}

// solicitud (la rellena el asistente mientras hablan; el cliente puede corregir cualquier dato)
const CAMPOS_FORM = W.campos.map(c => c.id);
function datosFormulario() { return Object.fromEntries(CAMPOS_FORM.map(c => { const el = $("#f-" + c); return [c, (el?.dataset.valor ?? el?.value ?? "").trim()]; })); }
function telefonoValido(t) { return /^(\+?34)?[6789]\d{8}$/.test(String(t).replace(/[^\d+]/g, "")); }
function ponerCampo(campo, valor, resaltar) {
  const el = $("#f-" + campo); if (!el || !valor || (el.dataset.valor ?? el.value) === valor) return;
  clearInterval(el._tecleo); delete el.dataset.valor;
  if (resaltar && enEscenario() && !reducir && el.type !== "hidden") {
    // en el escenario el dato se «teclea» a la vista (como mucho medio segundo)
    el.dataset.valor = valor; let i = 0; const paso = Math.max(1, Math.ceil(valor.length / 22));
    el._tecleo = setInterval(() => {
      i += paso; el.value = valor.slice(0, i);
      if (i >= valor.length) { clearInterval(el._tecleo); delete el.dataset.valor; resumirSolicitud(); }
    }, 22);
  } else el.value = valor;
  if (VISIBLES.includes(campo)) ultimoCampo = campo;
  if (resaltar) { const c = el.closest(".campo"); c?.classList.remove("relleno"); void c?.offsetWidth; c?.classList.add("relleno"); }
}
$$(".sol-campos input").forEach(i => i.addEventListener("input", () => { ultimoCampo = i.id.slice(2); resumirSolicitud(); }));
function rellenarCampo(campo, valor) {
  if (!CAMPOS_FORM.includes(campo)) return "error: campo desconocido";
  valor = String(valor || "").trim().slice(0, 200);
  ponerCampo(campo, valor, true);
  const d = datosFormulario();
  pintarFicha({ ...d, fase: "datos" }, false);
  return "ok: escrito en pantalla";
}
async function enviarSolicitud({ tipo = W.tipoPrincipal, urgente = false, notas = "", origen = "técnico virtual" } = {}) {
  if (avisoHecho && origen !== "formulario") return "ok: la solicitud ya estaba enviada";
  const d = datosFormulario();
  const faltan = obligatorios(tipo).filter(([c]) => origen === "formulario" ? c === "telefono" && !d[c] : !d[c]).map(([, t]) => t);
  if (faltan.length) return "error: falta " + faltan.join(", ");
  if (!telefonoValido(d.telefono)) return "error: el teléfono no parece un teléfono español de 9 cifras";
  const guardado = await registrarAviso({ ...d, tipo, urgente, notas, origen });
  return guardado ? "ok: solicitud registrada" : "ok: preparada, pero sin conexión con el servidor; que la mande también por WhatsApp";
}
// el cliente confirma desde la pantalla
$("#formSolicitud").addEventListener("submit", async e => {
  e.preventDefault();
  const tel = $("#f-telefono");
  if (!telefonoValido(tel.value)) { tel.setCustomValidity("Escribe un teléfono español de 9 cifras"); tel.reportValidity(); tel.setCustomValidity(""); return; }
  const r = await enviarSolicitud({ tipo: W.tipoPrincipal, origen: "cliente" });
  if (llamada && r.startsWith("ok")) llamada.localParticipant.sendText("He confirmado mis datos y he enviado la solicitud desde la pantalla.", { topic: "lk.chat" }).catch(() => {});
});
// formulario de "que me llamen" al final de la página
$("#formRapido").addEventListener("submit", async e => {
  e.preventDefault();
  if ($("#web").value) return;
  const inp = $("#r-telefono");
  if (!telefonoValido(inp.value)) { inp.setCustomValidity("Escribe un teléfono español de 9 cifras"); inp.reportValidity(); inp.setCustomValidity(""); return; }
  ponerCampo("telefono", inp.value.trim()); ponerCampo(W.campoResumen, $("#r-averia").value.trim());
  await enviarSolicitud({ tipo: "llamada", origen: "formulario" });
  $("#formLlamadaCaja").classList.add("enviado");
});

// panel del dueño (solo vista previa, solo el propietario)
pUser.then(async u => {
  if (!u || !(await u.isOwner?.().catch(() => false))) return;
  const db = await pDb; if (!db) return;
  $("#panelDueno").hidden = false;
  db.collection("avisos").orderBy("creado", "desc").limit(50).onSnapshot(snap => {
    const filas = snap.docs.map(d => d.data());
    const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    $("#tablaAvisos").innerHTML = filas.length ? filas.map(a => `<tr><td>${esc(new Date(a.creado).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }))}</td><td>${esc(a.tipo)}</td><td>${esc(a.nombre)}</td><td>${esc(a.telefono)}</td><td>${esc([...W.resumenAviso.map(([c, pre]) => a[c] && pre + a[c]), ...W.panelExtra.map(c => a[c])].filter(Boolean).join(" · "))}<br><small>${esc(a.notas)}</small></td><td>${esc(W.panelLugar.map(c => a[c]).filter(Boolean).join(" · "))}</td></tr>`).join("") : '<tr><td colspan="6">Todavía no hay solicitudes.</td></tr>';
  }, () => {});
});

/* ------------------------------------------------------------------
   7. Llamada de voz en directo (LiveKit): conversación continua, el
      técnico puede interrumpirse, enseña información y rellena la solicitud.
------------------------------------------------------------------ */
let llamada = null, audioAgente = [], bloqueoPantalla = null, cronoInt = null;
const ESTADO_AGENTE = { initializing: "pensando", listening: "escuchando", thinking: "pensando", speaking: "hablando", idle: "reposo" };
function cargarLiveKit() {
  if (window.LivekitClient) return Promise.resolve(window.LivekitClient);
  return new Promise((ok, ko) => {
    const sc = document.createElement("script");
    sc.src = "https://cdn.jsdelivr.net/npm/livekit-client@2.23.0/dist/livekit-client.umd.js";
    sc.onload = () => ok(window.LivekitClient); sc.onerror = ko; document.head.append(sc);
  });
}
// que la pantalla no se apague mientras hablan
async function mantenerPantalla() { try { bloqueoPantalla = await navigator.wakeLock?.request("screen"); } catch {} }
document.addEventListener("visibilitychange", () => { if (llamada && document.visibilityState === "visible") mantenerPantalla(); });
function empezarCrono() {
  const t0 = Date.now(); clearInterval(cronoInt);
  cronoInt = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); $("#crono").textContent = "· " + String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }, 1000);
}
async function llamar() {
  if (llamada) return;
  callar(); conversacionIniciada = true; $("#chips").hidden = true;
  estado("pensando"); conv.dataset.llamada = mini.dataset.llamada = "conectando"; estadoTxt.textContent = "Conectando…";
  mantenerPantalla();
  try {
    const LK = await cargarLiveKit();
    const res = await fetch(LK_TOKEN, { method: "POST" });
    if (!res.ok) throw new Error("pase");
    const { url, token } = await res.json();
    const sala = new LK.Room({ adaptiveStream: true, dynacast: true });
    llamada = sala; modoMandos();
    const segmentos = new Map();
    sala.registerTextStreamHandler("lk.transcription", async (lector, quien) => {
      const at = lector.info.attributes || {};
      const id = at["lk.segment_id"] || lector.info.id;
      const esCliente = quien.identity === sala.localParticipant.identity;
      let b = segmentos.get(id);
      if (!b) { b = burbuja(esCliente ? "cli" : "tec"); segmentos.set(id, b); }
      let texto = "";
      for await (const trozo of lector) { texto += trozo; b.textContent = texto; textoMini(texto); bajar(); }
    });
    sala.registerRpcMethod("senalar", async d => { senalar(JSON.parse(d.payload).destino); return "ok"; });
    sala.registerRpcMethod("rellenar", async d => { const { campo, valor } = JSON.parse(d.payload); return rellenarCampo(campo, valor); });
    sala.registerRpcMethod("enviar", async d => enviarSolicitud(JSON.parse(d.payload)));
    sala.on(LK.RoomEvent.TrackSubscribed, pista => {
      if (pista.kind !== "audio") return;
      const el = pista.attach(); el.muted = !vozActiva; audioAgente.push(el); document.body.append(el);
    });
    sala.on(LK.RoomEvent.AudioPlaybackStatusChanged, () => { if (!sala.canPlaybackAudio) hoja("#hojaAudio"); });
    sala.on(LK.RoomEvent.ParticipantAttributesChanged, (cambios) => {
      const st = cambios["lk.agent.state"]; if (st) estado(ESTADO_AGENTE[st] || "reposo");
    });
    sala.on(LK.RoomEvent.Reconnecting, () => { estadoTxt.textContent = "Reconectando…"; });
    sala.on(LK.RoomEvent.Reconnected, () => estado(conv.dataset.estado || "reposo"));
    sala.on(LK.RoomEvent.Disconnected, finLlamada);
    // Si el asistente cuelga por su lado, la web cuelga también: antes se quedaba la llamada «abierta» con el micro encendido
    sala.on(LK.RoomEvent.ParticipantDisconnected, () => {
      setTimeout(() => { if (llamada === sala && sala.remoteParticipants.size === 0) colgar(); }, 1500);
    });
    await sala.connect(url, token);
    // Micrófono con todos los filtros del propio móvil: eco, ruido, volumen automático y,
    // donde el navegador lo admite, aislamiento de voz (deja solo la voz de quien habla)
    await sala.localParticipant.setMicrophoneEnabled(true, { echoCancellation: true, noiseSuppression: true, autoGainControl: true, voiceIsolation: true, channelCount: 1 });
    await sala.startAudio().catch(() => {});
    if (!sala.canPlaybackAudio) hoja("#hojaAudio");
    conv.dataset.llamada = mini.dataset.llamada = "activa"; empezarCrono();
    estado("escuchando");
  } catch (e) {
    const permiso = /permission|notallowed/i.test(String(e?.name || e?.message || ""));
    llamada?.disconnect(); llamada = null; conv.dataset.llamada = mini.dataset.llamada = ""; estado("reposo"); modoMandos();
    try { bloqueoPantalla?.release(); } catch {}
    if (permiso) sinMicro();
    else burbuja("sistema", "No he podido conectar la llamada. Escríbeme aquí o llámanos al " + N.telefono + ".");
    mostrarTeclado(true);
  }
}
// Precarga: la librería de la llamada se descarga cuando el navegador está libre o en cuanto
// el dedo toca el botón, para que no haya segundos de silencio al pulsar "Hablar".
if (LK_TOKEN) {
  const precargar = () => cargarLiveKit().catch(() => {});
  (window.requestIdleCallback || (f => setTimeout(f, 2500)))(precargar);
  $$("[data-voz]").forEach(b => b.addEventListener("pointerdown", precargar, { once: true, passive: true }));
}
// En el iPhone el sonido solo se puede activar dentro de un toque: lo desbloqueamos en ese mismo toque
let audioDesbloqueado = false;
function desbloquearAudio() {
  if (audioDesbloqueado) return; audioDesbloqueado = true;
  try { const C = window.AudioContext || window.webkitAudioContext; const ac = new C(); ac.resume(); const o = ac.createOscillator(), g = ac.createGain(); g.gain.value = 0; o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.05); } catch {}
}
$$("[data-voz], #btnMic, #hmEmpezar").forEach(b => b.addEventListener("click", desbloquearAudio));
$$("[data-voz], #btnMic").forEach(b => b.addEventListener("click", cebarAviso));
$("#haActivar").addEventListener("click", async () => { await llamada?.startAudio().catch(() => {}); hoja(null); });
function colgar() { llamada?.disconnect(); }
function finLlamada() {
  if (!llamada) return;
  audioAgente.forEach(a => a.remove()); audioAgente = []; llamada = null;
  clearInterval(cronoInt); $("#crono").textContent = "";
  try { bloqueoPantalla?.release(); } catch {} bloqueoPantalla = null;
  conv.dataset.llamada = mini.dataset.llamada = ""; estado("reposo"); modoMandos();
  burbuja("sistema", "Llamada terminada.");
  if (!avisoHecho && datosFormulario().telefono) burbuja("sistema", W.textos.trasLlamada);
}

/* ------------------------------------------------------------------
   6. Detalles: saludo y cabecera
------------------------------------------------------------------ */
burbuja("tec", saludo(N));
const cab = $("#cab");
// la barra de abajo aparece cuando el botón grande del asistente sale de la pantalla
if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => document.body.classList.toggle("barra-visible", !e.isIntersecting)).observe($(".tarjeta-andres .boton-hablar"));
else document.body.classList.add("barra-visible");
addEventListener("scroll", () => cab.classList.toggle("con-borde", scrollY > 8), { passive: true });

/* ------------------------------------------------------------------
   Piel «cine»: titular que entra palabra a palabra, secciones que
   aparecen al bajar, vídeo de la portada y botón «magnético».
   Todo es adorno: si algo falla o el visitante pide menos movimiento,
   la web se ve entera igualmente.
------------------------------------------------------------------ */
(() => {
  const portada = $("#portada"), titular = $("#titular");
  if (titular && !reducir) {   // trocea el titular en palabras conservando la cursiva
    let i = 0;
    const trocear = nodo => [...nodo.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t.trim()) { f.append(t); return; }
          const p = document.createElement("span"); p.className = "palabra"; p.setAttribute("aria-hidden", "true");
          const d = document.createElement("span"); d.textContent = t; d.style.setProperty("--i", i++); p.append(d); f.append(p);
        });
        n.replaceWith(f);
      } else if (n.nodeType === 1 && !n.classList.contains("gira")) trocear(n);   // la línea que gira no se trocea
    });
    trocear(titular);
  }

  // Titular que gira: «¿Se te ha roto» se queda y debajo va rodando el aparato.
  // Empieza por «un electrodoméstico» (lo que busca Google y lo que lee un lector de pantalla).
  const pieza = $("#gira .gira-pieza");
  if (pieza && !reducir && W.gira.length > 1) {
    const APARATOS = W.gira;
    let n = 0;
    // si el aparato es largo («el aire acondicionado») se encoge lo justo para caber en la línea, sin mover nada más
    const caja = $("#gira");
    const encajar = () => { pieza.style.fontSize = ""; const sobra = caja.clientWidth / pieza.offsetWidth; if (sobra < 1) pieza.style.fontSize = Math.max(.6, sobra * .98) + "em"; };
    encajar(); addEventListener("resize", encajar); document.fonts?.ready.then(encajar);
    const girar = () => {
      if (document.hidden || document.body.classList.contains("en-conversacion")) return;   // no gira si no se está mirando
      pieza.classList.add("sale");
      setTimeout(() => {
        n = (n + 1) % APARATOS.length;
        pieza.querySelector("em").textContent = APARATOS[n];
        pieza.classList.add("espera"); pieza.classList.remove("sale"); encajar();
        void pieza.offsetWidth;   // aplica la posición de espera antes de soltarla
        pieza.classList.remove("espera");
      }, 460);
    };
    setTimeout(() => setInterval(girar, 2400), 1600);
  }
  setTimeout(() => portada?.classList.add("listo"), 80);
  // seguro: si el navegador no llega a animar (pestaña en segundo plano, móvil ahorrando batería), a los 2,5 s se muestra todo igualmente
  setTimeout(() => portada?.classList.add("hecho"), 2500);   // con temporizador y no con requestAnimationFrame: en una pestaña en segundo plano este no se dispara y la portada se quedaría vacía

  // secciones: aparecen al entrar en pantalla (una sola vez)
  if (!reducir && "IntersectionObserver" in window) {
    const grupos = [".cabecera-sec", ".aparato", ".bd-caso", ".paso", ".tarifa", ".lista-ok li", ".zona-caja", ".faq details", ".cierre", ...W.revelar];
    const ver = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("ver"); ver.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    const preparar = () => grupos.forEach(sel => $$(sel).forEach(el => {
      if (el.classList.contains("rev")) return;
      const hermanos = [...el.parentElement.children].filter(h => h.matches(sel));
      el.style.setProperty("--i", Math.min(hermanos.indexOf(el), 7)); el.classList.add("rev"); ver.observe(el);
    }));
    preparar(); setTimeout(preparar, 600);   // la lista de aparatos se pinta con JS: segunda pasada
  }

  // vídeo de la portada: se pide cuando el navegador está libre y solo se mueve mientras se ve
  const video = $("#cineVideo");
  if (video && !reducir) {
    const cargar = () => {
      fetch(video.dataset.src, { method: "HEAD" }).then(r => {
        if (!r.ok || !(r.headers.get("content-type") || "").startsWith("video")) return;   // aún no hay vídeo: se queda la luz animada
        video.src = video.dataset.src;
        video.addEventListener("canplay", () => { video.classList.add("visible"); video.play().catch(() => {}); }, { once: true });
        new IntersectionObserver(e => { e[0].isIntersecting && !document.body.classList.contains("escenario-on") ? video.play().catch(() => {}) : video.pause(); }).observe(portada);
      }).catch(() => {});
    };
    "requestIdleCallback" in window ? requestIdleCallback(cargar, { timeout: 2500 }) : setTimeout(cargar, 1200);
  }

  // botón grande de hablar: se acerca un poco al ratón (solo con ratón)
  if (!reducir && matchMedia("(pointer:fine)").matches) $$(".boton-hablar").forEach(b => {
    b.addEventListener("pointermove", e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${((e.clientX - r.left) / r.width - .5) * 10}px, ${((e.clientY - r.top) / r.height - .5) * 8}px)`;
    });
    b.addEventListener("pointerleave", () => { b.style.transition = "transform .5s var(--curva)"; b.style.transition = "transform .5s cubic-bezier(.23,1,.32,1)"; b.style.transform = ""; setTimeout(() => b.style.transition = "", 500); });
  });
})();
