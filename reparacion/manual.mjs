// =====================================================================
//  MANUAL TÉCNICO DE ANDRÉS · buscador
//  En cada turno, lee lo que ha dicho el cliente, detecta aparato, marca,
//  código de error y síntoma, y devuelve SOLO las fichas que tocan del
//  manual (conocimiento.mjs). Así Andrés sabe de todas las marcas sin
//  cargar el manual entero en cada respuesta (más rápido y más barato).
//
//  Lo usan la web (vista previa), el servidor y, con una copia en Python
//  (agente/manual.py), el agente de voz. Si cambias la lógica aquí, cámbiala
//  también allí: las pruebas de pruebas-manual.mjs valen para los dos.
// =====================================================================

// Aparatos y cómo los llama la gente
export const APARATOS = {
  "lavadora-secadora": ["lavadora secadora", "lavasecadora", "lava seca", "lavadora y secadora"],
  lavadora: ["lavadora", "lavarropas"],
  secadora: ["secadora"],
  lavavajillas: ["lavavajillas", "lavaplatos", "friegaplatos", "lava vajillas"],
  congelador: ["congelador", "arcon", "arcon congelador"],
  frigorifico: ["frigorifico", "frigo", "nevera", "combi", "americano", "no frost", "refrigerador", "frigorifica"],
  horno: ["horno"],
  placa: ["placa", "vitro", "vitroceramica", "induccion", "fuego", "fuegos", "fogon", "fogones"],
  campana: ["campana", "extractor"],
  microondas: ["microondas", "micro ondas"],
  termo: ["termo", "calentador electrico", "acumulador", "termo electrico"],
  aire: ["aire acondicionado", "acondicionado", "split", "climatizador", "bomba de calor", "maquina de aire", "aparato de aire", "consola de aire", "aire por conductos", "conductos", "mi aire", "el aire no", "el aire se", "el aire hace", "el aire pierde", "el aire gotea", "el aire pita", "el aire echa", "el aire tira"],
  caldera: ["caldera", "calderas", "calentador", "calentador de gas", "caldera de gas", "caldera de condensacion", "calefaccion", "radiadores", "radiador", "suelo radiante"]
};

// Marcas y cómo se las nombra (incluidos errores típicos del dictado por voz)
export const MARCAS = {
  Bosch: ["bosch", "bosh", "bos"], Balay: ["balay", "balai", "valay", "valai"], Siemens: ["siemens", "simens"],
  Neff: ["neff", "nef"], Pitsos: ["pitsos"],
  AEG: ["aeg", "a e g"], Electrolux: ["electrolux", "electrolus"], Zanussi: ["zanussi", "zanusi"], Corbero: ["corbero"],
  Whirlpool: ["whirlpool", "wirpul", "wirlpool", "wirpool", "whirpool"], Indesit: ["indesit", "indesi"], Hotpoint: ["hotpoint", "jotpoint"], Ariston: ["ariston"],
  Candy: ["candy", "candi"], Hoover: ["hoover", "juver", "hover"], Haier: ["haier", "jaier", "haiers"],
  LG: ["lg", "ele ge", "elege", "ele je"], Samsung: ["samsung", "sansun", "samsun", "sansung"],
  Hisense: ["hisense", "haisens", "hisens"], Gorenje: ["gorenje", "gorenye"], Daewoo: ["daewoo", "daewo", "deu"], Winia: ["winia"],
  Beko: ["beko", "veko"], Grundig: ["grundig"], Teka: ["teka", "teca"], Fagor: ["fagor"], Edesa: ["edesa"], Aspes: ["aspes"],
  Cata: ["cata"], Liebherr: ["liebherr", "liber", "lieber", "liebher"], Miele: ["miele", "mile", "mielle"], Smeg: ["smeg", "esmeg"],
  // Aire acondicionado
  Daikin: ["daikin", "daikín", "daiquin", "daikim"], "Mitsubishi Electric": ["mitsubishi electric", "mitsubishi"], "Mitsubishi Heavy": ["mitsubishi heavy", "heavy"],
  Fujitsu: ["fujitsu", "fujitsu general", "fuyitsu"], Panasonic: ["panasonic"], Toshiba: ["toshiba"], Gree: ["gree", "gri"], Midea: ["midea", "midia"],
  Hitachi: ["hitachi", "jitachi"], Johnson: ["johnson", "yonson"], Kaysun: ["kaysun", "keisun"],
  // Calderas
  Vaillant: ["vaillant", "vailant", "vaillan", "bailan", "vaylant"], "Saunier Duval": ["saunier duval", "saunier", "sonier duval", "sonier", "duval"],
  Junkers: ["junkers", "yunkers", "junker"], Baxi: ["baxi", "baxiroca", "baxi roca"], Roca: ["roca"], Ferroli: ["ferroli", "ferrolli"], Cointra: ["cointra"],
  Chaffoteaux: ["chaffoteaux", "chafoteaux", "chafoto"], Immergas: ["immergas", "inmergas"], Beretta: ["beretta", "bereta"], Viessmann: ["viessmann", "viesman", "vissman"],
  Domusa: ["domusa"], Wolf: ["wolf"], Manaut: ["manaut"], Thermor: ["thermor", "termor"], Hermann: ["hermann", "herman"]
};

// Palabras de número que da el dictado ("e quince", "f cero cinco")
export const NUMEROS = {
  cero: 0, uno: 1, un: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9, diez: 10,
  once: 11, doce: 12, trece: 13, catorce: 14, quince: 15, dieciseis: 16, diecisiete: 17, dieciocho: 18, diecinueve: 19,
  veinte: 20, veintiuno: 21, veintiun: 21, veintidos: 22, veintitres: 23, veinticuatro: 24, veinticinco: 25, veintiseis: 26,
  veintisiete: 27, veintiocho: 28, veintinueve: 29, treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60, setenta: 70,
  ochenta: 80, noventa: 90
};
export const CENTENAS = { cien: 100, ciento: 100, doscientos: 200, trescientos: 300, cuatrocientos: 400, quinientos: 500, seiscientos: 600, setecientos: 700, ochocientos: 800, novecientos: 900 };
export const LETRAS = { efe: "f", hache: "h", ele: "l", eme: "m", ene: "n", erre: "r", ese: "s", te: "t", uve: "v", be: "b", ce: "c", de: "d", pe: "p", jota: "j", ka: "k", equis: "x" };

export const normalizar = t => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/[^a-z0-9ñ]+/g, " ").trim();
const clave = c => normalizar(c).replace(/ /g, "");

// Convierte el texto dictado en candidatos a código: "e quince" -> e15, "f cero cinco" -> f05, "e-18" -> e18
const CONTEXTO = "(?:pone|sale|salen|marca|error|codigo|aparece|parpadea|indica|muestra|err)";
function candidatosCodigo(original) {
  const salida = new Set();
  // Números y letras dichos con palabras -> cifras y letras sueltas
  const palabras = normalizar(original).split(" ").filter(Boolean);
  const conv = [];
  for (let i = 0; i < palabras.length; i++) {
    const p = palabras[i];
    if (p in NUMEROS || p in CENTENAS) {
      // "cero cinco" -> 05
      if (p === "cero" && palabras[i + 1] in NUMEROS && NUMEROS[palabras[i + 1]] < 10) { conv.push("0" + NUMEROS[palabras[i + 1]]); i++; continue; }
      // "ciento treinta y tres" -> 133, "quinientos uno" -> 501, "cuarenta y dos" -> 42
      let v = 0;
      if (p in CENTENAS) { v = CENTENAS[p]; if (!(palabras[i + 1] in NUMEROS)) { conv.push(String(v)); continue; } i++; }
      let n = NUMEROS[palabras[i]];
      if (n >= 30 && n % 10 === 0 && palabras[i + 1] === "y" && palabras[i + 2] in NUMEROS && NUMEROS[palabras[i + 2]] < 10) { n += NUMEROS[palabras[i + 2]]; i += 2; }
      conv.push(String(v + n));
    } else conv.push(LETRAS[p] && i > 0 && /^(un|una|la|el|pone|sale|marca|error|codigo|aparece|y)$/.test(palabras[i - 1]) ? LETRAS[p] : p);
  }
  const t = " " + conv.join(" ") + " ";
  // Letras + cifras: e15, e 15, f05, i20, he1, 4c, 5 e...
  for (const m of t.matchAll(/(?<= )([a-z]{1,3}) ?(\d{1,3})(?= )/g)) {
    if (/^(a|y|o|u|de|la|el|en|las|los|un|del|con|por|mas|hay|son|hace|que)$/.test(m[1]) && !new RegExp(CONTEXTO + " " + m[1]).test(t)) continue;
    salida.add(m[1] + m[2]);
    if (m[2].length === 1) salida.add(m[1] + "0" + m[2]);
  }
  for (const m of t.matchAll(/(?<= )(\d{1,2}) ?([a-z]{1,2})(?= )/g)) if (!/^(y|o|a|de|en|la|el)$/.test(m[2])) salida.add(m[1] + m[2]);
  // Pegados sin espacio (e15, 5c, f05)
  for (const w of conv) if (/^[a-z]{1,3}\d{1,3}$|^\d{1,2}[a-z]{1,2}$/.test(w)) salida.add(w);
  // Solo cifras ("error 21", "sale un 5"): únicamente con una palabra de contexto delante
  for (const m of t.matchAll(new RegExp(CONTEXTO + " (?:el |un |una |la )?(\\d{1,3})(?= )", "g"))) salida.add(m[1]);
  // Solo letras (OE, UE, dE, CL...): si el cliente las escribe con mayúscula o las dice tras una palabra de contexto
  for (const m of String(original || "").matchAll(/\b([A-Za-z]{0,2}[A-Z][A-Za-z]{0,2})\b/g)) if (m[1].length >= 2) salida.add(m[1].toLowerCase());
  for (const m of t.matchAll(new RegExp(CONTEXTO + " (?:un |una |el |la )?([a-z]{1,2}) ([a-z]{1,2})(?= )", "g"))) salida.add(m[1] + m[2]);
  for (const m of t.matchAll(new RegExp(CONTEXTO + " (?:un |una |el |la )?([a-z]{2,4})(?= )", "g"))) salida.add(m[1]);
  return salida;
}

function detectarEn(texto, diccionario) {
  const n = " " + normalizar(texto) + " ";
  const hallados = [];
  for (const [nombre, formas] of Object.entries(diccionario)) {
    let pos = -1;
    for (const f of formas) { const p = n.lastIndexOf(" " + f + " "); if (p > pos) pos = p; }
    if (pos >= 0) hallados.push([nombre, pos]);
  }
  return hallados.sort((a, b) => b[1] - a[1]).map(h => h[0]); // lo último mencionado, primero
}

// Prepara el manual una sola vez: índices de códigos y palabras clave
export function preparar(base) {
  const fichas = [];
  for (const fam of base.familias) {
    for (const c of fam.codigos) fichas.push({ ...c, tipo: "codigo", familia: fam.familia, marcas: fam.marcas, claves: c.codigos.map(clave) });
  }
  const sintomas = base.sintomas.map(s => ({ ...s, tipo: "sintoma", raices: [...new Set([s.sintoma, ...(s.palabras || [])].map(normalizar))] }));
  const marcaAFamilia = {};
  for (const fam of base.familias) for (const m of fam.marcas) (marcaAFamilia[m] ||= []).push(fam.familia);
  const codigosConocidos = new Set(fichas.flatMap(f => f.claves));
  return { fichas, sintomas, marcaAFamilia, codigosConocidos, familias: base.familias, peligro: base.peligro || [] };
}

const mismoAparato = (ficha, aparato) => !aparato || ficha.aparato === aparato ||
  (aparato === "lavadora-secadora" && (ficha.aparato === "lavadora" || ficha.aparato === "secadora")) ||
  (aparato === "lavadora" && ficha.aparato === "lavadora-secadora") ||
  (aparato === "congelador" && ficha.aparato === "frigorifico") || (aparato === "frigorifico" && ficha.aparato === "congelador");

// turnos: [{role:"user"|"assistant", content:"..."}]. Devuelve { aparato, marca, fichas[], texto }
export function buscar(manual, turnos, { maxCodigos = 3, maxSintomas = 2 } = {}) {
  const delCliente = turnos.filter(t => t.role === "user").map(t => typeof t.content === "string" ? t.content : "");
  const ultimo = delCliente.at(-1) || "";
  const recientes = delCliente.slice(-3).join(" \n ");
  const todo = delCliente.join(" \n ");

  let aparato = detectarEn(ultimo, APARATOS)[0] || detectarEn(todo, APARATOS)[0] || "";
  if (aparato === "aire" && / secadora (de |con )?bomba de calor /.test(" " + normalizar(todo) + " ") && !/ (split|aire acondicionado|acondicionado) /.test(" " + normalizar(todo) + " ")) aparato = "secadora";
  const marca = detectarEn(ultimo, MARCAS)[0] || detectarEn(todo, MARCAS)[0] || "";
  const familias = marca ? (manual.marcaAFamilia[marca] || []) : [];

  // Códigos: se buscan en los últimos mensajes del cliente
  const cand = [...candidatosCodigo(recientes)].filter(c => manual.codigosConocidos.has(c));
  let porCodigo = [];
  if (cand.length) {
    porCodigo = manual.fichas.filter(f => f.claves.some(k => cand.includes(k)) && mismoAparato(f, aparato))
      .map(f => ({ f, p: (familias.includes(f.familia) ? 10 : 0) + (f.aparato === aparato ? 3 : 0) + (f.confianza === "alta" ? 1 : 0) }))
      .sort((a, b) => b.p - a.p);
    // Con marca conocida, solo su familia (si tiene ese código); sin marca, varias familias para preguntar
    if (familias.length && porCodigo.some(x => familias.includes(x.f.familia))) porCodigo = porCodigo.filter(x => familias.includes(x.f.familia));
    porCodigo = porCodigo.slice(0, maxCodigos).map(x => x.f);
  }

  // Síntomas: por coincidencia de palabras con lo que dice el cliente ahora
  const nUlt = " " + normalizar(ultimo) + " ", nRec = " " + normalizar(recientes) + " ";
  const porSintoma = manual.sintomas.filter(s => mismoAparato(s, aparato))
    .map(s => {
      let p = 0;
      for (const r of s.raices) {
        if (r.length < 4) continue;
        if (nUlt.includes(" " + r + " ")) p += 3 + r.split(" ").length;
        else if (nRec.includes(" " + r + " ")) p += 1 + r.split(" ").length / 2;
      }
      if (p && aparato && s.aparato === aparato) p += 2;
      return { s, p };
    })
    .filter(x => x.p >= 3).sort((a, b) => b.p - a.p).slice(0, porCodigo.length ? 1 : maxSintomas).map(x => x.s);

  const fichas = [...porCodigo, ...porSintoma];
  return { aparato, marca, fichas, texto: redactar(fichas, marca, aparato) };
}

function redactar(fichas, marca, aparato) {
  if (!fichas.length) return "";
  const lineas = fichas.map(f => {
    if (f.tipo === "codigo") {
      const quien = f.marcas.join(", ");
      return `- Código ${f.codigos.join(" / ")} en ${f.aparato} (${quien}): ${f.significado}` +
        (f.causas?.length ? ` Causas habituales: ${f.causas.join("; ")}.` : "") +
        (f.que_puede_hacer_el_cliente ? ` El cliente puede: ${f.que_puede_hacer_el_cliente}` : "") +
        (f.pieza_probable ? ` Pieza que conviene llevar: ${f.pieza_probable}.` : "") +
        (f.confianza !== "alta" ? " (Dato de confianza media: dilo con prudencia, puede variar según el modelo.)" : "");
    }
    return `- Síntoma «${f.sintoma}» en ${f.aparato}. Causas de más a menos frecuente: ${f.causas.join("; ")}.` +
      (f.que_puede_hacer_el_cliente ? ` El cliente puede comprobar: ${f.que_puede_hacer_el_cliente}` : "") +
      (f.pieza_probable ? ` Piezas que suele llevar el técnico: ${f.pieza_probable}.` : "") +
      (f.urgencia === "alta" ? " Es urgente." : "");
  });
  const varias = new Set(fichas.filter(f => f.tipo === "codigo").map(f => f.familia)).size > 1;
  return `[Manual técnico interno (no lo menciones ni lo leas tal cual; úsalo como tu propio conocimiento)${marca ? `. Marca detectada: ${marca}` : ""}${aparato ? `. Aparato: ${aparato}` : ""}${varias && !marca ? ". El código significa cosas distintas según la marca: pregunta la marca antes de concluir" : ""}]\n${lineas.join("\n")}`;
}
