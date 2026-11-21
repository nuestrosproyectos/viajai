// =====================================================================
//  SERVIDOR DEL TÉCNICO VIRTUAL (Cloudflare Workers)
//  Sirve la web y atiende dos direcciones:
//    POST /api/tecnico  -> conversa con Claude y devuelve la respuesta en directo
//    POST /api/aviso    -> recibe un aviso (visita o llamada) y lo reenvía
//  La clave de Anthropic vive en el servidor (secreto ANTHROPIC_API_KEY): nunca
//  llega al navegador del cliente.
// =====================================================================
import Anthropic from "@anthropic-ai/sdk";
import { NEGOCIO, saludo, instrucciones } from "../cerebro.mjs";

const MODELO = "claude-haiku-5-5";       // rápido y barato: ideal para voz. Alternativa: "claude-sonnet-5-5"
const MAX_TURNOS = 30;
const MAX_TEXTO = 2000;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === "/api/tecnico" && req.method === "POST") return tecnico(req, env);
    if (url.pathname === "/api/aviso" && req.method === "POST") return aviso(req, env);
    return env.ASSETS.fetch(req); // el resto: la web estática
  }
};

async function tecnico(req, env) {
  if (!mismoOrigen(req)) return new Response("No permitido", { status: 403 });
  const ip = req.headers.get("cf-connecting-ip") || "x";
  if (env.LIMITE && !(await env.LIMITE.limit({ key: ip })).success) return new Response("Demasiadas consultas", { status: 429 });

  let datos;
  try { datos = await req.json(); } catch { return new Response("JSON no válido", { status: 400 }); }
  const turnos = (Array.isArray(datos.turnos) ? datos.turnos : [])
    .slice(-MAX_TURNOS)
    .filter(t => (t.role === "user" || t.role === "assistant") && typeof t.content === "string" && t.content.trim())
    .map(t => ({ role: t.role, content: t.content.slice(0, MAX_TEXTO) }));
  if (!turnos.length || turnos.at(-1).role !== "user") return new Response("Conversación no válida", { status: 400 });

  // Foto opcional en el último mensaje del cliente
  const foto = typeof datos.imagen === "string" && datos.imagen.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (foto && foto[2].length < 6_000_000) {
    const ultimo = turnos.at(-1);
    ultimo.content = [
      { type: "image", source: { type: "base64", media_type: foto[1], data: foto[2] } },
      { type: "text", text: ultimo.content }
    ];
  }

  const mensajes = [
    { role: "user", content: "(El cliente acaba de abrir la conversación en la web.)" },
    { role: "assistant", content: saludo(NEGOCIO) },
    ...turnos
  ];

  const cliente = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const stream = cliente.messages.stream({
    model: MODELO,
    max_tokens: 1024,
    thinking: { type: "disabled" },          // sin pausa para pensar: la voz responde al momento
    system: [{ type: "text", text: instrucciones(NEGOCIO), cache_control: { type: "ephemeral" } }],
    messages: mensajes
  });

  const { readable, writable } = new TransformStream();
  const escritor = writable.getWriter(), enc = new TextEncoder();
  (async () => {
    try {
      for await (const ev of stream) {
        if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") await escritor.write(enc.encode(ev.delta.text));
      }
    } catch (e) {
      console.error("Error de Claude:", e?.status, e?.message);
    } finally { await escritor.close().catch(() => {}); }
  })();
  return new Response(readable, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}

async function aviso(req, env) {
  if (!mismoOrigen(req)) return new Response("No permitido", { status: 403 });
  let a;
  try { a = await req.json(); } catch { return new Response("JSON no válido", { status: 400 }); }
  const limpio = {};
  for (const k of ["tipo", "nombre", "telefono", "direccion", "municipio", "aparato", "marca", "modelo", "averia", "codigo", "franja", "urgente", "notas", "origen", "creado"])
    if (a[k] != null) limpio[k] = String(a[k]).slice(0, 500);
  if (!limpio.telefono) return new Response("Falta el teléfono", { status: 400 });

  // 1) Guardar en la base de datos de Cloudflare (D1), si está configurada
  if (env.DB) {
    await env.DB.prepare("INSERT INTO avisos (creado, datos) VALUES (?, ?)").bind(new Date().toISOString(), JSON.stringify(limpio)).run();
  }
  // 2) Avisar al móvil por Telegram, si está configurado (TELEGRAM_TOKEN y TELEGRAM_CHAT)
  if (env.TELEGRAM_TOKEN && env.TELEGRAM_CHAT) {
    const texto = `🔧 Nuevo aviso (${limpio.tipo || "visita"})\n${limpio.nombre || "—"} · ${limpio.telefono}\n${[limpio.aparato, limpio.marca, limpio.modelo].filter(Boolean).join(" ")}: ${limpio.averia || ""} ${limpio.codigo ? "(" + limpio.codigo + ")" : ""}\n${[limpio.direccion, limpio.municipio].filter(Boolean).join(", ")}\nFranja: ${limpio.franja || "—"}\nNotas: ${limpio.notas || "—"}`;
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT, text: texto })
    }).catch(() => {});
  }
  // 3) Reenviar a cualquier otra herramienta (hoja de Google, CRM...) si hay AVISOS_WEBHOOK
  if (env.AVISOS_WEBHOOK) {
    await fetch(env.AVISOS_WEBHOOK, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(limpio) }).catch(() => {});
  }
  return Response.json({ ok: true });
}

function mismoOrigen(req) {
  const origen = req.headers.get("origin");
  return !origen || origen === new URL(req.url).origin;
}
