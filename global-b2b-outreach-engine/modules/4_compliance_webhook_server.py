"""Módulo 4 — Servidor FastAPI de cumplimiento: bajas con un clic y conversiones por WhatsApp.

Arranque: uvicorn modules.4_compliance_webhook_server:app --host 127.0.0.1 --port 8080
"""
from __future__ import annotations

import hashlib
import hmac
import html
import json
import logging
import re
import sqlite3
from contextlib import asynccontextmanager, contextmanager
from typing import Any, AsyncIterator, Iterator

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import HTMLResponse, JSONResponse, PlainTextResponse

from core import db
from core.logs import configure_logging, get_logger, log
from core.settings import get_settings
from core.textutils import is_free_email_domain, phone_candidates

logger = get_logger("server")

REF_RE = re.compile(r"\[\s*Ref\s*[:：]\s*([A-Za-z0-9]{2}-[A-Za-z0-9]{4,7})\s*\]", re.IGNORECASE)
TOKEN_RE = re.compile(r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$")

_PAGE = """<!doctype html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>{title}</title>
<style>
  body {{ margin: 0; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: #f6f5f2; color: #1d1d1b; }}
  main {{ max-width: 34rem; margin: 12vh auto 0; padding: 0 1.5rem; }}
  h1 {{ font-size: 1.5rem; line-height: 1.3; font-weight: 600; margin: 0 0 0.9rem; }}
  p {{ font-size: 1.05rem; line-height: 1.6; margin: 0 0 1rem; color: #45443f; }}
  small {{ display: block; margin-top: 2.5rem; font-size: 0.85rem; color: #8a8982; }}
  @media (prefers-color-scheme: dark) {{ body {{ background: #171715; color: #ecebe6; }} p {{ color: #b9b8b0; }} }}
</style>
</head>
<body><main><h1>{heading}</h1><p>{body}</p><small>{company}</small></main></body>
</html>"""


def _templates(language: str) -> dict[str, Any]:
    from modules import load

    return dict(load("copywriter").template_for(language)["unsubscribe_page"])


def _render(language: str, title: str, heading: str, body: str, status_code: int = 200) -> HTMLResponse:
    page = _PAGE.format(
        lang=html.escape(language), title=html.escape(title), heading=html.escape(heading),
        body=html.escape(body), company=html.escape(get_settings().company_name),
    )
    return HTMLResponse(page, status_code=status_code, headers={"Cache-Control": "no-store"})


def _mask(email: str) -> str:
    local, _, domain = email.partition("@")
    return f"{local[:2]}{'•' * max(len(local) - 2, 1)}@{domain}"


def _language_from_header(request: Request) -> str:
    header = request.headers.get("accept-language", "")
    for part in header.split(","):
        code = part.split(";")[0].strip().lower()[:2]
        if code in ("es", "en", "fr", "de", "it", "pt"):
            return code
    return "en"


# ── Bajas ───────────────────────────────────────────────────────────────────


def process_unsubscribe(conn: sqlite3.Connection, token: str, channel: str) -> sqlite3.Row | None:
    """Registra la baja: suprime email y dominio y cancela todo lo pendiente. Idempotente."""
    if not TOKEN_RE.match(token):
        return None
    lead = conn.execute("SELECT * FROM leads WHERE unsubscribe_token = ?", (token.lower(),)).fetchone()
    if lead is None or not lead["email"]:
        return None
    email = str(lead["email"]).lower()
    domain = email.rsplit("@", 1)[-1]
    suppress_domain = not is_free_email_domain(domain)
    with db.transaction(conn):
        db.add_suppression(conn, "email", email, "unsubscribe")
        if suppress_domain:
            db.add_suppression(conn, "domain", domain, "unsubscribe")
        affected = db.lead_ids_for_recipient(conn, email, include_domain=suppress_domain)
        if int(lead["id"]) not in affected:
            affected.append(int(lead["id"]))
        cancelled = db.cancel_pending_for_leads(conn, affected, "unsubscribed")
        db.set_lead_status(conn, int(lead["id"]), db.UNSUBSCRIBED)
        db.add_event(conn, int(lead["id"]), "unsubscribed", channel=channel, cancelled_sends=cancelled)
    log(logger, logging.INFO, "unsubscribed", lead_id=int(lead["id"]), channel=channel, cancelled_sends=cancelled)
    return lead


# ── WhatsApp entrante ───────────────────────────────────────────────────────


def _text_of(value: Any) -> str:
    if isinstance(value, str):
        return value
    if isinstance(value, dict):
        for key in ("body", "text", "conversation", "caption", "message", "content"):
            found = _text_of(value.get(key))
            if found:
                return found
    return ""


def extract_inbound_messages(payload: Any) -> list[tuple[str, str]]:
    """Normaliza el evento a [(teléfono, texto)] sea cual sea el proveedor que lo envía."""
    messages: list[tuple[str, str]] = []
    if isinstance(payload, list):
        for item in payload:
            messages.extend(extract_inbound_messages(item))
        return messages
    if not isinstance(payload, dict):
        return messages

    # WhatsApp Cloud API (Meta)
    for entry in payload.get("entry", []) if isinstance(payload.get("entry"), list) else []:
        for change in entry.get("changes", []) if isinstance(entry, dict) else []:
            value = change.get("value", {}) if isinstance(change, dict) else {}
            for message in value.get("messages", []) or []:
                if isinstance(message, dict):
                    text = _text_of(message.get("text")) or _text_of(message.get("button")) or _text_of(message.get("interactive"))
                    messages.append((str(message.get("from", "")), text))
    if messages:
        return messages

    # Evolution API (Baileys): {"event": "messages.upsert", "data": {"key": {...}, "message": {...}}}
    data = payload.get("data")
    if isinstance(data, dict) and isinstance(data.get("key"), dict):
        key = data["key"]
        if not key.get("fromMe"):
            body = data.get("message") if isinstance(data.get("message"), dict) else {}
            text = _text_of(body.get("conversation")) or _text_of(body.get("extendedTextMessage")) or _text_of(body)
            sender = str(key.get("remoteJidAlt") or key.get("remoteJid") or key.get("participant") or "")
            messages.append((sender, text))
        return messages

    # Genérico: Make, n8n, GoHighLevel o cualquier JSON plano
    contact = payload.get("contact") if isinstance(payload.get("contact"), dict) else {}
    phone = ""
    for source in (payload, contact):
        for key in ("phone", "from", "number", "wa_id", "waId", "sender", "phone_number", "phoneNumber", "contact_phone"):
            if isinstance(source.get(key), (str, int)) and str(source.get(key)).strip():
                phone = str(source[key])
                break
        if phone:
            break
    text = ""
    for key in ("message", "text", "body", "content", "last_message", "messageBody"):
        text = _text_of(payload.get(key))
        if text:
            break
    if phone or text:
        messages.append((phone, text))
    return messages


def process_inbound_message(conn: sqlite3.Connection, phone: str, text: str) -> dict[str, Any]:
    """Localiza el lead por [Ref: XXXX] o por teléfono y lo marca como convertido a WhatsApp."""
    lead: sqlite3.Row | None = None
    matched_by = ""
    match = REF_RE.search(text or "")
    if match:
        lead = conn.execute("SELECT * FROM leads WHERE lead_ref = ?", (match.group(1).upper(),)).fetchone()
        matched_by = "ref"
    if lead is None:
        for candidate in phone_candidates(phone):
            lead = conn.execute(
                "SELECT * FROM leads WHERE phone_e164 = ? ORDER BY (status = ?) DESC, (lead_ref IS NOT NULL) DESC, id LIMIT 1",
                (candidate, db.CONTACTED),
            ).fetchone()
            if lead is not None:
                matched_by = "phone"
                break
    if lead is None:
        log(logger, logging.INFO, "whatsapp_unmatched", has_ref=bool(match))
        return {"matched": False}
    lead_id = int(lead["id"])
    with db.transaction(conn):
        cancelled = db.cancel_pending_for_leads(conn, [lead_id], "converted_to_whatsapp")
        # Una baja manda sobre todo lo demás: no se reabre el lead aunque escriba por WhatsApp.
        if lead["status"] != db.UNSUBSCRIBED:
            db.set_lead_status(conn, lead_id, db.CONVERTED_TO_WA)
        db.add_event(conn, lead_id, "whatsapp_inbound", matched_by=matched_by, cancelled_sends=cancelled)
    log(logger, logging.INFO, "converted_to_whatsapp", lead_id=lead_id, matched_by=matched_by, cancelled_sends=cancelled)
    return {"matched": True, "lead_id": lead_id, "lead_ref": lead["lead_ref"], "matched_by": matched_by, "cancelled_sends": cancelled}


def _authorized(request: Request, raw_body: bytes) -> bool:
    """Secreto propio (cabecera o query) o firma HMAC de Meta. Sin secretos configurados, no se acepta nada."""
    settings = get_settings()
    signature = request.headers.get("x-hub-signature-256", "")
    if settings.whatsapp_app_secret and signature.startswith("sha256="):
        expected = hmac.new(settings.whatsapp_app_secret.encode(), raw_body, hashlib.sha256).hexdigest()
        if hmac.compare_digest(signature[7:], expected):
            return True
    if settings.webhook_secret:
        provided = request.headers.get("x-webhook-secret") or request.query_params.get("secret") or ""
        if not provided:
            bearer = request.headers.get("authorization", "")
            provided = bearer[7:] if bearer.lower().startswith("bearer ") else ""
        if provided and hmac.compare_digest(provided.encode(), settings.webhook_secret.encode()):
            return True
    return False


# ── Aplicación ──────────────────────────────────────────────────────────────


@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncIterator[None]:
    configure_logging(get_settings().log_level)
    conn = db.connect()
    db.init_db(conn)  # crea el esquema si aún no existe
    conn.close()
    yield


@contextmanager
def _connection() -> Iterator[sqlite3.Connection]:
    """Una conexión por petición: cada hilo del servidor lleva su propia transacción."""
    conn = db.connect()
    try:
        yield conn
    finally:
        conn.close()


app = FastAPI(title="global-b2b-outreach-engine · cumplimiento", docs_url=None, redoc_url=None, openapi_url=None, lifespan=lifespan)


@app.get("/health")
def health() -> dict[str, str]:
    with _connection() as conn:
        conn.execute("SELECT 1").fetchone()
    return {"status": "ok"}


def _unsubscribe_response(request: Request, token: str, channel: str) -> HTMLResponse:
    with _connection() as conn:
        lead = process_unsubscribe(conn, token, channel)
    if lead is None:
        language = _language_from_header(request)
        texts = _templates(language)
        return _render(language, texts["not_found_heading"], texts["not_found_heading"], texts["not_found_body"], 404)
    language = str(lead["language"] or "en")
    texts = _templates(language)
    return _render(language, texts["title"], texts["heading"], str(texts["body"]).format(email=_mask(str(lead["email"]))))


@app.get("/unsubscribe/{token}", response_class=HTMLResponse)
def unsubscribe_get(request: Request, token: str) -> HTMLResponse:
    return _unsubscribe_response(request, token, "link")


@app.post("/unsubscribe/{token}", response_class=HTMLResponse)
def unsubscribe_one_click(request: Request, token: str) -> HTMLResponse:
    """RFC 8058: el botón «Cancelar suscripción» de Gmail, Outlook o Apple Mail llama aquí por POST."""
    return _unsubscribe_response(request, token, "one_click")


@app.get("/webhook/whatsapp-inbound", response_class=PlainTextResponse)
def whatsapp_verify(
    mode: str = Query(default="", alias="hub.mode"),
    verify_token: str = Query(default="", alias="hub.verify_token"),
    challenge: str = Query(default="", alias="hub.challenge"),
) -> PlainTextResponse:
    """Verificación inicial del webhook que exige WhatsApp Cloud API."""
    expected = get_settings().whatsapp_verify_token
    if mode == "subscribe" and expected and hmac.compare_digest(verify_token.encode(), expected.encode()):
        return PlainTextResponse(challenge)
    raise HTTPException(status_code=403, detail="verify token incorrecto")


@app.post("/webhook/whatsapp-inbound")
async def whatsapp_inbound(request: Request) -> JSONResponse:
    raw = await request.body()
    if not _authorized(request, raw):
        raise HTTPException(status_code=401, detail="no autorizado")
    try:
        payload = json.loads(raw.decode("utf-8") or "{}")
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=400, detail="JSON no válido") from exc
    messages = extract_inbound_messages(payload)

    def handle() -> list[dict[str, Any]]:
        with _connection() as conn:
            return [process_inbound_message(conn, phone, text) for phone, text in messages]

    results = await run_in_threadpool(handle)
    matched = [result for result in results if result.get("matched")]
    # Siempre 200: un mensaje que no es de un lead no es un error y el proveedor no debe reintentar.
    return JSONResponse({"received": len(messages), "matched": len(matched), "leads": matched})
