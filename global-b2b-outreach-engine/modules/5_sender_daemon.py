"""Módulo 5 — Motor de envío SMTP multi-cuenta con revisión IMAP de respuestas y rebotes.

Garantías:
- Un paso (email_1, followup_1, followup_2) de un lead se envía como mucho una vez: la fila de
  `outbox` tiene clave de idempotencia única y se «reclama» de forma atómica antes de tocar SMTP.
- Nunca se envía fuera del horario local de la campaña, ni a nadie de la lista de supresión o
  de la lista Robinson externa.
- Si una cuenta acumula errores o rebotes, se pausa sola y avisa.
"""
from __future__ import annotations

import asyncio
import contextlib
import csv
import email
import email.policy
import html
import imaplib
import json
import logging
import random
import re
import smtplib
import socket
import sqlite3
import ssl
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage, Message
from email.utils import formataddr, formatdate, getaddresses, make_msgid, parseaddr
from pathlib import Path
from typing import Any, Callable, Literal

import httpx
from pydantic import BaseModel, ConfigDict, Field, ValidationError

from core import db
from core.campaign import CampaignConfig
from core.logs import get_logger, log
from core.settings import Settings, get_settings
from core.textutils import EMAIL_RE, is_free_email_domain
from modules import load

logger = get_logger("sender")

IDLE_SLEEP_SECONDS = 60
SMTP_TIMEOUT_SECONDS = 30
IMAP_TIMEOUT_SECONDS = 30
IMAP_LOOKBACK_DAYS = 5
MAX_SEND_ATTEMPTS = 3
TEMPORARY_RETRY_MINUTES = 45
MIN_GAP_BEFORE_LAST_FOLLOWUP = timedelta(hours=48)

_UNSUBSCRIBE_WORDS = re.compile(
    r"\b(baja|darme de baja|unsubscribe|remove me|stop|d[ée]sinscri\w*|abmelden|austragen|disiscri\w*|cancelar|"
    r"no me escrib\w+|no quiero recibir|do not contact|nicht mehr)\b",
    re.IGNORECASE,
)
_URL_IN_TEXT = re.compile(r"https?://[^\s<>\"]+")


# ── Cuentas ─────────────────────────────────────────────────────────────────


class Account(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    email: str = Field(pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    from_name: str = Field(min_length=1, max_length=80)
    smtp_host: str = Field(min_length=3)
    smtp_port: int = Field(default=587, ge=1, le=65535)
    smtp_security: Literal["starttls", "ssl", "none"] = "starttls"
    username: str = ""
    password: str = Field(min_length=1)
    imap_host: str | None = None
    imap_port: int = Field(default=993, ge=1, le=65535)
    imap_username: str | None = None
    imap_password: str | None = None
    daily_limit: int = Field(default=30, ge=1, le=500)
    reply_to: str | None = None

    @property
    def login(self) -> str:
        return self.username or self.email

    @property
    def domain(self) -> str:
        return self.email.rsplit("@", 1)[-1].lower()


class AccountsError(Exception):
    """accounts.json no existe o no es válido."""


def load_accounts(path: Path) -> list[Account]:
    if not path.is_file():
        raise AccountsError(f"No existe {path}. Copia accounts.example.json a accounts.json y rellénalo.")
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(raw, list) or not raw:
            raise AccountsError(f"{path} debe ser una lista con al menos una cuenta")
        accounts = [Account.model_validate(item) for item in raw]
    except json.JSONDecodeError as exc:
        raise AccountsError(f"{path}: JSON mal formado ({exc})") from exc
    except ValidationError as exc:
        details = "; ".join(f"{'.'.join(map(str, err['loc']))}: {err['msg']}" for err in exc.errors())
        raise AccountsError(f"{path}: cuenta no válida ({details})") from exc
    emails = [account.email.lower() for account in accounts]
    if len(set(emails)) != len(emails):
        raise AccountsError(f"{path}: hay cuentas repetidas")
    return accounts


# ── Lista Robinson externa ──────────────────────────────────────────────────


@dataclass
class RobinsonList:
    emails: set[str] = field(default_factory=set)
    domains: set[str] = field(default_factory=set)
    phones: set[str] = field(default_factory=set)
    mtime: float = 0.0

    def match(self, email_address: str, phone_e164: str | None) -> str | None:
        email_address = email_address.lower()
        if email_address in self.emails:
            return "robinson:email"
        if email_address.rsplit("@", 1)[-1] in self.domains:
            return "robinson:domain"
        if phone_e164 and re.sub(r"\D", "", phone_e164) in self.phones:
            return "robinson:phone"
        return None


def load_robinson(path: Path, previous: RobinsonList | None = None) -> RobinsonList:
    """Carga external_robinson_blocklist.csv si existe: admite emails, dominios (@dominio.com) y teléfonos."""
    if not path.is_file():
        return RobinsonList()
    mtime = path.stat().st_mtime
    if previous is not None and previous.mtime == mtime:
        return previous
    result = RobinsonList(mtime=mtime)
    with path.open(encoding="utf-8-sig", newline="") as handle:
        for row in csv.reader(handle):
            for cell in row:
                value = cell.strip().lower()
                if not value or value.startswith("#"):
                    continue
                if EMAIL_RE.fullmatch(value):
                    result.emails.add(value)
                elif value.startswith("@") and "." in value:
                    result.domains.add(value[1:])
                elif re.fullmatch(r"(?:[a-z0-9-]+\.)+[a-z]{2,24}", value):
                    result.domains.add(value)
                else:
                    digits = re.sub(r"\D", "", value)
                    if 8 <= len(digits) <= 15 and re.fullmatch(r"[\d\s+().-]+", value):
                        result.phones.add(digits)
    return result


# ── Construcción del mensaje ────────────────────────────────────────────────


def body_to_html(body: str, wa_link: str, wa_anchor: str, unsubscribe_link: str, unsubscribe_anchor: str) -> str:
    """Versión HTML mínima (sin diseño): mismos párrafos, con los enlaces largos convertidos en texto."""

    def linkify(text: str) -> str:
        out, position = [], 0
        for match in _URL_IN_TEXT.finditer(text):
            url = match.group(0).rstrip(".,;:)")
            out.append(html.escape(text[position:match.start()]))
            if url == wa_link:
                label = html.escape(wa_anchor)
            elif url == unsubscribe_link:
                label = html.escape(unsubscribe_anchor)
            else:
                label = html.escape(url)
            out.append(f'<a href="{html.escape(url, quote=True)}">{label}</a>')
            position = match.start() + len(url)
        out.append(html.escape(text[position:]))
        return "".join(out)

    main, separator, footer = body.partition("\n--\n")
    paragraphs = [
        f"<p>{linkify(paragraph).replace(chr(10), '<br>')}</p>"
        for paragraph in re.split(r"\n\s*\n", main.strip()) if paragraph.strip()
    ]
    if separator:
        footer_html = linkify(footer.strip()).replace("\n", "<br>")
        paragraphs.append(f'<p style="color:#777;font-size:12px;line-height:1.5">{footer_html}</p>')
    return '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#222">' + "".join(paragraphs) + "</div>"


def build_message(
    account: Account, lead: sqlite3.Row, step: str, settings: Settings, parent_message_id: str | None
) -> EmailMessage:
    copywriter = load("copywriter")
    template = copywriter.template_for(str(lead["language"] or "en"))
    body = str(lead[f"body_{step}"])
    subject = str(lead["subject"])
    if step != "email_1":
        subject = f"{template['reply_prefix']}{subject}"
    unsubscribe_link = copywriter.unsubscribe_url(settings, str(lead["unsubscribe_token"]))

    # Sin plegado de cabeceras: por defecto Python parte las URL largas en «encoded-words» y eso
    # rompe el botón de baja con un clic de Gmail/Outlook. El RFC 5322 admite líneas de hasta 998.
    message = EmailMessage(policy=email.policy.SMTP.clone(max_line_length=998))
    message["From"] = formataddr((account.from_name, account.email))
    message["To"] = str(lead["email"])
    message["Subject"] = subject
    message["Date"] = formatdate(localtime=False)
    message["Message-ID"] = make_msgid(domain=account.domain)
    if account.reply_to:
        message["Reply-To"] = account.reply_to
    if parent_message_id:
        message["In-Reply-To"] = parent_message_id
        message["References"] = parent_message_id
    message["List-Unsubscribe"] = f"<{unsubscribe_link}>, <mailto:{account.email}?subject=unsubscribe>"
    message["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"
    message.set_content(body, cte="quoted-printable")
    message.add_alternative(
        body_to_html(
            body, str(lead["wa_link"]), str(template["wa_anchor_text"]),
            unsubscribe_link, str(template["unsubscribe_anchor_text"]),
        ),
        subtype="html", cte="quoted-printable",
    )
    return message


# ── SMTP ────────────────────────────────────────────────────────────────────


class SenderBusy(Exception):
    """Ya hay otro motor de envío en marcha (el daemon o el panel)."""


class SendFailure(Exception):
    """kind: 'account' (no salió, culpa de la cuenta), 'recipient' (rechazo definitivo del destinatario),
    'temporary' (rechazo temporal del destinatario) o 'ambiguous' (no se sabe si salió)."""

    def __init__(self, kind: str, detail: str) -> None:
        super().__init__(detail)
        self.kind = kind
        self.detail = detail


def smtp_send(account: Account, message: EmailMessage) -> None:
    """Envía por SMTP distinguiendo en qué fase falla, para no reenviar nunca algo que quizá salió."""
    context = ssl.create_default_context()
    server: smtplib.SMTP | None = None
    try:
        if account.smtp_security == "ssl":
            server = smtplib.SMTP_SSL(account.smtp_host, account.smtp_port, timeout=SMTP_TIMEOUT_SECONDS, context=context)
        else:
            server = smtplib.SMTP(account.smtp_host, account.smtp_port, timeout=SMTP_TIMEOUT_SECONDS)
            server.ehlo()
            if account.smtp_security == "starttls":
                server.starttls(context=context)
                server.ehlo()
        server.login(account.login, account.password)
    except (smtplib.SMTPException, OSError, ssl.SSLError, socket.timeout) as exc:
        _quit(server)
        raise SendFailure("account", f"conexión/login SMTP: {type(exc).__name__}: {exc}") from exc
    try:
        refused = server.send_message(message)
        if refused:
            raise smtplib.SMTPRecipientsRefused(refused)
    except smtplib.SMTPRecipientsRefused as exc:
        code, text = next(iter(exc.recipients.values()), (550, b"recipient refused"))
        detail = f"{code} {text.decode(errors='replace') if isinstance(text, bytes) else text}"
        raise SendFailure("recipient" if int(code) >= 500 else "temporary", detail) from exc
    except (smtplib.SMTPSenderRefused, smtplib.SMTPDataError) as exc:
        raise SendFailure("account", f"el servidor rechazó el mensaje: {exc.smtp_code} {exc.smtp_error!r}") from exc
    except (smtplib.SMTPException, OSError, socket.timeout) as exc:
        raise SendFailure("ambiguous", f"corte durante el envío: {type(exc).__name__}: {exc}") from exc
    finally:
        _quit(server)


def _quit(server: smtplib.SMTP | None) -> None:
    if server is None:
        return
    try:
        server.quit()
    except (smtplib.SMTPException, OSError):
        with contextlib.suppress(OSError):
            server.close()


# ── IMAP: respuestas y rebotes ──────────────────────────────────────────────


@dataclass
class InboundMail:
    key: str
    kind: str  # 'bounce_hard', 'bounce_soft', 'auto_reply', 'reply'
    from_address: str
    recipients: list[str]
    references: list[str]
    wants_unsubscribe: bool
    subject: str


def _plain_text(message: Message, limit: int = 20000) -> str:
    chunks: list[str] = []
    for part in message.walk():
        if part.get_content_maintype() == "multipart":
            continue
        if part.get_content_type() in ("text/plain", "text/html", "message/delivery-status", "text/rfc822-headers"):
            payload = part.get_payload(decode=True)
            if isinstance(payload, bytes):
                chunks.append(payload.decode(part.get_content_charset() or "utf-8", errors="replace"))
            elif isinstance(part.get_payload(), list):
                chunks.append("\n".join(str(sub) for sub in part.get_payload()))
    return "\n".join(chunks)[:limit]


def classify_inbound(raw: bytes, key: str) -> InboundMail:
    message = email.message_from_bytes(raw, policy=email.policy.compat32)
    from_address = parseaddr(str(message.get("From", "")))[1].lower()
    subject = str(message.get("Subject", ""))
    text = _plain_text(message)
    references = re.findall(r"<[^<>\s]+>", f"{message.get('In-Reply-To', '')} {message.get('References', '')}")
    local = from_address.split("@")[0]
    report_type = str(message.get_param("report-type") or "").lower()
    is_bounce = (
        local in ("mailer-daemon", "postmaster")
        or (message.get_content_type() == "multipart/report" and report_type == "delivery-status")
        or message.get("X-Failed-Recipients") is not None
    )
    if is_bounce:
        recipients = [addr.lower() for _, addr in getaddresses([str(message.get("X-Failed-Recipients", ""))]) if addr]
        recipients += [m.lower() for m in re.findall(r"(?im)^(?:Final|Original)-Recipient:\s*[^;]+;\s*<?([^\s<>]+@[^\s<>]+)>?", text)]
        if not recipients:
            recipients = [m.lower() for m in EMAIL_RE.findall(text)]
        statuses = re.findall(r"(?im)^Status:\s*([245])\.\d+\.\d+", text)
        hard = "5" in statuses or (not statuses and bool(re.search(r"\b5[0-5]\d\b|user unknown|no such user|does not exist|mailbox unavailable", text, re.IGNORECASE)))
        return InboundMail(key, "bounce_hard" if hard else "bounce_soft", from_address, list(dict.fromkeys(recipients)), references, False, subject)
    auto_submitted = str(message.get("Auto-Submitted", "no")).lower()
    precedence = str(message.get("Precedence", "")).lower()
    if auto_submitted not in ("", "no") or precedence in ("auto_reply", "bulk", "junk", "list") or message.get("X-Autoreply"):
        return InboundMail(key, "auto_reply", from_address, [], references, False, subject)
    visible = text.split("\n>")[0][:600]  # solo lo que escribe la persona, no nuestro correo citado
    wants_unsubscribe = bool(_UNSUBSCRIBE_WORDS.search(subject) or _UNSUBSCRIBE_WORDS.search(visible))
    return InboundMail(key, "reply", from_address, [], references, wants_unsubscribe, subject)


def imap_fetch_new(account: Account, already_seen: set[str]) -> list[InboundMail]:
    """Lee (sin marcar como leídos) los mensajes recientes de la bandeja que aún no se han procesado."""
    if not account.imap_host:
        return []
    client = imaplib.IMAP4_SSL(account.imap_host, account.imap_port, timeout=IMAP_TIMEOUT_SECONDS)
    try:
        client.login(account.imap_username or account.login, account.imap_password or account.password)
        status, data = client.select("INBOX", readonly=True)
        if status != "OK":
            raise imaplib.IMAP4.error(f"no se puede abrir INBOX: {data!r}")
        validity_response = client.response("UIDVALIDITY")[1]
        validity = (validity_response[0] or b"0").decode() if validity_response else "0"
        since = (db.utcnow() - timedelta(days=IMAP_LOOKBACK_DAYS)).strftime("%d-%b-%Y")
        status, data = client.uid("SEARCH", None, f"(SINCE {since})")
        if status != "OK":
            raise imaplib.IMAP4.error(f"búsqueda IMAP fallida: {data!r}")
        mails: list[InboundMail] = []
        for uid in (data[0] or b"").split():
            key = f"{validity}:{uid.decode()}"
            if key in already_seen:
                continue
            status, fetched = client.uid("FETCH", uid, "(BODY.PEEK[])")
            if status != "OK" or not fetched or not isinstance(fetched[0], tuple):
                continue
            mails.append(classify_inbound(bytes(fetched[0][1]), key))
        return mails
    finally:
        with contextlib.suppress(imaplib.IMAP4.error, OSError):
            client.logout()


# ── Motor ───────────────────────────────────────────────────────────────────


@dataclass
class PlanItem:
    outbox_id: int
    lead_id: int
    business_name: str
    email: str
    campaign: str
    step: str
    account: str
    decision: str  # 'send', 'sent', 'wait', 'cancelled', 'failed'
    reason: str = ""


@dataclass
class PassReport:
    items: list[PlanItem] = field(default_factory=list)
    sent: int = 0
    cancelled: int = 0
    failed: int = 0
    waiting: int = 0
    replies: int = 0
    bounces: int = 0
    paused_accounts: list[str] = field(default_factory=list)


class SenderEngine:
    """Estado de una sesión del daemon: cuentas, rotación, contadores del cortafuegos."""

    def __init__(
        self,
        conn: sqlite3.Connection,
        accounts: list[Account],
        settings: Settings | None = None,
        send_func: Callable[[Account, EmailMessage], None] = smtp_send,
        imap_func: Callable[[Account, set[str]], list[InboundMail]] = imap_fetch_new,
        now_func: Callable[[], datetime] = db.utcnow,
        on_alert: Callable[[str, str], None] | None = None,
    ) -> None:
        self.conn = conn
        self.accounts = accounts
        self.settings = settings or get_settings()
        self._send = send_func
        self._imap = imap_func
        self._now = now_func
        self._on_alert = on_alert
        self._rr = 0
        self._errors: dict[str, int] = {}
        self._bounces: dict[str, int] = {}
        self._robinson = RobinsonList()
        self._last_imap: datetime | None = None
        self._lease_owner = uuid.uuid4().hex
        self.stop = asyncio.Event()

    # — cuentas —

    def _account(self, address: str | None) -> Account | None:
        return next((a for a in self.accounts if address and a.email.lower() == address.lower()), None)

    def paused(self) -> dict[str, str]:
        rows = self.conn.execute("SELECT account_email, pause_reason FROM account_state WHERE paused_at IS NOT NULL").fetchall()
        return {str(row["account_email"]).lower(): str(row["pause_reason"] or "") for row in rows}

    def sent_today(self, account: Account) -> int:
        row = self.conn.execute(
            "SELECT sent_count FROM account_usage WHERE account_email = ? AND day = ?",
            (account.email.lower(), self._now().strftime("%Y-%m-%d")),
        ).fetchone()
        return int(row["sent_count"]) if row else 0

    def _available(self, account: Account, paused: dict[str, str], planned: dict[str, int]) -> bool:
        if account.email.lower() in paused:
            return False
        return self.sent_today(account) + planned.get(account.email.lower(), 0) < account.daily_limit

    def _next_account(self, paused: dict[str, str], planned: dict[str, int]) -> Account | None:
        """Rotación round-robin entre las cuentas activas que no han agotado su límite diario."""
        for offset in range(len(self.accounts)):
            account = self.accounts[(self._rr + offset) % len(self.accounts)]
            if self._available(account, paused, planned):
                self._rr = (self._rr + offset + 1) % len(self.accounts)
                return account
        return None

    def pause_account(self, account_email: str, reason: str) -> None:
        with db.transaction(self.conn):
            self.conn.execute(
                "INSERT INTO account_state (account_email, paused_at, pause_reason) VALUES (?, ?, ?) "
                "ON CONFLICT(account_email) DO UPDATE SET paused_at=excluded.paused_at, pause_reason=excluded.pause_reason",
                (account_email.lower(), db.iso(self._now()), reason),
            )
            db.add_event(self.conn, None, "account_paused", account=account_email, reason=reason)
        self.alert(f"Cuenta pausada: {account_email}", reason)

    def alert(self, title: str, detail: str) -> None:
        log(logger, logging.CRITICAL, "ALERT", title=title, detail=detail)
        if self._on_alert:
            self._on_alert(title, detail)
        if self.settings.alert_webhook_url:
            try:
                httpx.post(self.settings.alert_webhook_url, json={"title": title, "detail": detail, "text": f"{title} — {detail}"}, timeout=10.0)
            except httpx.HTTPError as exc:
                log(logger, logging.ERROR, "alert_webhook_failed", error=str(exc))

    def _register_error(self, account: Account, detail: str) -> None:
        key = account.email.lower()
        self._errors[key] = self._errors.get(key, 0) + 1
        if self._errors[key] >= self.settings.max_account_errors and key not in self.paused():
            self.pause_account(account.email, f"{self._errors[key]} errores SMTP en esta sesión. Último: {detail[:200]}")

    def _register_bounce(self, account_email: str, detail: str) -> None:
        key = account_email.lower()
        self._bounces[key] = self._bounces.get(key, 0) + 1
        if self._bounces[key] >= self.settings.max_account_bounces and key not in self.paused():
            self.pause_account(account_email, f"{self._bounces[key]} rebotes en esta sesión. Último: {detail[:200]}")

    # — selección —

    def due_rows(self) -> list[sqlite3.Row]:
        now = self._now()
        return self.conn.execute(
            "SELECT o.id AS outbox_id, o.step, o.attempts, o.campaign_name AS outbox_campaign, l.* "
            "FROM outbox o JOIN leads l ON l.id = o.lead_id "
            "WHERE o.status = ? AND o.scheduled_at IS NOT NULL AND o.scheduled_at <= ? "
            "AND ((o.step = 'email_1' AND l.status = ?) OR (o.step != 'email_1' AND l.status = ?)) "
            "AND (o.step != 'followup_2' OR EXISTS (SELECT 1 FROM outbox p WHERE p.lead_id = o.lead_id "
            "     AND p.step = 'followup_1' AND p.status = ? AND p.sent_at <= ?)) "
            "ORDER BY o.scheduled_at, o.id LIMIT 500",
            (db.OUT_PENDING, db.iso(now), db.READY, db.CONTACTED, db.OUT_SENT, db.iso(now - MIN_GAP_BEFORE_LAST_FOLLOWUP)),
        ).fetchall()

    def _compliance_block(self, row: sqlite3.Row) -> str | None:
        """Comprobación previa obligatoria: lista de supresión y lista Robinson externa."""
        suppressed = db.is_suppressed(self.conn, str(row["email"]))
        if suppressed:
            return f"suppression:{suppressed}"
        self._robinson = load_robinson(self.settings.robinson_file, self._robinson)
        return self._robinson.match(str(row["email"]), row["phone_e164"])

    def _cancel(self, row: sqlite3.Row, reason: str) -> None:
        with db.transaction(self.conn):
            cancelled = db.cancel_pending_for_leads(self.conn, [int(row["id"])], reason)
            db.add_event(self.conn, int(row["id"]), "send_cancelled", reason=reason, cancelled_sends=cancelled)
        log(logger, logging.INFO, "send_cancelled", lead_id=int(row["id"]), reason=reason)

    def _decide(self, row: sqlite3.Row, paused: dict[str, str], planned: dict[str, int]) -> tuple[str, str, Account | None, CampaignConfig | None]:
        campaign = db.get_campaign(self.conn, str(row["outbox_campaign"]))
        if campaign is None:
            return "wait", "campaña sin configuración guardada (vuelve a ejecutar generate)", None, None
        block = self._compliance_block(row)
        if block:
            return "cancelled", block, None, campaign
        if not campaign.in_send_window(self._now()):
            local = campaign.local_now(self._now())
            return "wait", f"fuera de horario ({local:%a %H:%M} {campaign.timezone}; ventana {campaign.business_hours_start}-{campaign.business_hours_end})", None, campaign
        account: Account | None
        if row["step"] == "email_1":
            account = self._next_account(paused, planned)
            if account is None:
                return "wait", "ninguna cuenta disponible (pausadas o límite diario alcanzado)", None, campaign
        else:
            first = self.conn.execute(
                "SELECT account_email FROM outbox WHERE lead_id = ? AND step = 'email_1'", (row["id"],)
            ).fetchone()
            account = self._account(first["account_email"] if first else None)
            if account is None:
                account = self._next_account(paused, planned)  # la cuenta original ya no existe en accounts.json
            elif not self._available(account, paused, planned):
                return "wait", f"la cuenta del hilo ({account.email}) está pausada o en su límite diario", None, campaign
            if account is None:
                return "wait", "ninguna cuenta disponible (pausadas o límite diario alcanzado)", None, campaign
        return "send", "", account, campaign

    # — envío —

    def _claim(self, outbox_id: int, account: Account) -> bool:
        """Reclamo atómico: solo un proceso puede pasar la fila de PENDING a SENDING."""
        with db.transaction(self.conn):
            cursor = self.conn.execute(
                "UPDATE outbox SET status = ?, account_email = ?, attempts = attempts + 1, updated_at = ? "
                "WHERE id = ? AND status = ?",
                (db.OUT_SENDING, account.email.lower(), db.iso(self._now()), outbox_id, db.OUT_PENDING),
            )
            return cursor.rowcount == 1

    def _finish_sent(self, row: sqlite3.Row, account: Account, campaign: CampaignConfig, message_id: str) -> None:
        now = self._now()
        lead_id = int(row["id"])
        with db.transaction(self.conn):
            self.conn.execute(
                "UPDATE outbox SET status = ?, sent_at = ?, message_id = ?, error = NULL, updated_at = ? WHERE id = ?",
                (db.OUT_SENT, db.iso(now), message_id, db.iso(now), row["outbox_id"]),
            )
            self.conn.execute(
                "INSERT INTO account_usage (account_email, day, sent_count) VALUES (?, ?, 1) "
                "ON CONFLICT(account_email, day) DO UPDATE SET sent_count = sent_count + 1",
                (account.email.lower(), now.strftime("%Y-%m-%d")),
            )
            if row["step"] == "email_1":
                self.conn.execute(
                    "UPDATE leads SET status = ?, contacted_at = ?, updated_at = ? WHERE id = ? AND status = ?",
                    (db.CONTACTED, db.iso(now), db.iso(now), lead_id, db.READY),
                )
                for step, days in (("followup_1", campaign.followup_1_days), ("followup_2", campaign.followup_2_days)):
                    self.conn.execute(
                        "UPDATE outbox SET scheduled_at = ?, updated_at = ? WHERE lead_id = ? AND step = ? AND status = ?",
                        (db.iso(now + timedelta(days=days)), db.iso(now), lead_id, step, db.OUT_PENDING),
                    )
            db.add_event(self.conn, lead_id, "email_sent", step=row["step"], account=account.email, message_id=message_id)
        log(logger, logging.INFO, "email_sent", lead_id=lead_id, step=row["step"], account=account.email, to=row["email"])

    def _finish_failed(self, row: sqlite3.Row, account: Account, failure: SendFailure) -> str:
        now = self._now()
        lead_id = int(row["id"])
        attempts = int(row["attempts"]) + 1
        with db.transaction(self.conn):
            if failure.kind == "recipient":
                self.conn.execute(
                    "UPDATE outbox SET status = ?, error = ?, updated_at = ? WHERE id = ?",
                    (db.OUT_FAILED, failure.detail[:500], db.iso(now), row["outbox_id"]),
                )
                db.add_suppression(self.conn, "email", str(row["email"]), "hard_bounce")
                db.cancel_pending_for_leads(self.conn, [lead_id], "bounced")
                db.set_lead_status(self.conn, lead_id, db.BOUNCED)
                outcome = "failed"
            elif failure.kind == "ambiguous" or (failure.kind == "account" and attempts >= MAX_SEND_ATTEMPTS):
                # No se reintenta: o no se sabe si salió, o ya se intentó demasiadas veces.
                self.conn.execute(
                    "UPDATE outbox SET status = ?, error = ?, updated_at = ? WHERE id = ?",
                    (db.OUT_FAILED, failure.detail[:500], db.iso(now), row["outbox_id"]),
                )
                outcome = "failed"
            else:
                retry_at = now + timedelta(minutes=TEMPORARY_RETRY_MINUTES if failure.kind == "temporary" else 5)
                self.conn.execute(
                    "UPDATE outbox SET status = ?, scheduled_at = ?, error = ?, updated_at = ? WHERE id = ?",
                    (db.OUT_PENDING, db.iso(retry_at), failure.detail[:500], db.iso(now), row["outbox_id"]),
                )
                outcome = "wait"
            db.add_event(self.conn, lead_id, "send_failed", step=row["step"], kind=failure.kind, detail=failure.detail[:300], account=account.email)
        log(logger, logging.ERROR, "send_failed", lead_id=lead_id, step=row["step"], kind=failure.kind, detail=failure.detail, account=account.email)
        if failure.kind == "recipient":
            self._register_bounce(account.email, failure.detail)
        elif failure.kind in ("account", "ambiguous"):
            self._register_error(account, failure.detail)
        return outcome

    async def _send_one(self, row: sqlite3.Row, account: Account, campaign: CampaignConfig) -> tuple[str, str]:
        if not self._claim(int(row["outbox_id"]), account):
            return "wait", "otro proceso ya ha reclamado este envío"
        parent = None
        if row["step"] != "email_1":
            first = self.conn.execute(
                "SELECT message_id FROM outbox WHERE lead_id = ? AND step = 'email_1'", (row["id"],)
            ).fetchone()
            parent = first["message_id"] if first else None
        try:
            message = build_message(account, row, str(row["step"]), self.settings, parent)
            await asyncio.to_thread(self._send, account, message)
        except SendFailure as failure:
            return self._finish_failed(row, account, failure), failure.detail
        except Exception as exc:  # un fallo inesperado tras reclamar se trata como envío dudoso: no se repite
            failure = SendFailure("ambiguous", f"{type(exc).__name__}: {exc}")
            return self._finish_failed(row, account, failure), failure.detail
        self._finish_sent(row, account, campaign, str(message["Message-ID"]))
        return "sent", ""

    async def _jitter(self) -> None:
        self._heartbeat()
        delay = random.uniform(self.settings.jitter_min, self.settings.jitter_max)
        if delay <= 0:
            return
        log(logger, logging.INFO, "jitter_wait", seconds=round(delay))
        with contextlib.suppress(asyncio.TimeoutError):
            await asyncio.wait_for(self.stop.wait(), timeout=delay)

    async def send_pass(self, live: bool) -> PassReport:
        """Recorre los envíos que tocan ahora. En modo simulación no envía ni cambia nada."""
        report = PassReport()
        planned: dict[str, int] = {}
        handled: set[int] = set()
        while not self.stop.is_set():
            paused = self.paused()
            row = next((r for r in self.due_rows() if int(r["outbox_id"]) not in handled), None)
            if row is None:
                break
            handled.add(int(row["outbox_id"]))
            decision, reason, account, campaign = self._decide(row, paused, planned)
            item = PlanItem(
                int(row["outbox_id"]), int(row["id"]), str(row["business_name"]), str(row["email"]),
                str(row["outbox_campaign"]), str(row["step"]), account.email if account else "-", decision, reason,
            )
            report.items.append(item)
            if decision == "cancelled":
                report.cancelled += 1
                if live:
                    self._cancel(row, reason)
                continue
            if decision == "wait" or account is None or campaign is None:
                report.waiting += 1
                continue
            if not live:
                planned[account.email.lower()] = planned.get(account.email.lower(), 0) + 1
                continue
            item.decision, item.reason = await self._send_one(row, account, campaign)
            if item.decision == "sent":
                report.sent += 1
                await self.maybe_check_inboxes(report)
                await self._jitter()
            elif item.decision == "failed":
                report.failed += 1
            else:
                report.waiting += 1
        report.paused_accounts = sorted(self.paused())
        return report

    # — bandeja de entrada —

    def _apply_inbound(self, account: Account, mail: InboundMail, report: PassReport) -> None:
        if mail.kind == "bounce_hard":
            for recipient in mail.recipients:
                lead = self.conn.execute(
                    "SELECT id, status FROM leads WHERE email = ? AND contacted_at IS NOT NULL", (recipient,)
                ).fetchone()
                if lead is None:
                    continue
                with db.transaction(self.conn):
                    db.add_suppression(self.conn, "email", recipient, "hard_bounce")
                    db.cancel_pending_for_leads(self.conn, [int(lead["id"])], "bounced")
                    if lead["status"] not in (db.UNSUBSCRIBED, db.CONVERTED_TO_WA, db.REPLIED):
                        db.set_lead_status(self.conn, int(lead["id"]), db.BOUNCED)
                    db.add_event(self.conn, int(lead["id"]), "bounce", account=account.email, subject=mail.subject[:200])
                report.bounces += 1
                log(logger, logging.WARNING, "bounce", lead_id=int(lead["id"]), account=account.email)
                self._register_bounce(account.email, f"rebote de {recipient}")
            return
        if mail.kind != "reply":
            return
        lead = None
        for reference in mail.references:
            lead = self.conn.execute(
                "SELECT l.* FROM outbox o JOIN leads l ON l.id = o.lead_id WHERE o.message_id = ?", (reference,)
            ).fetchone()
            if lead is not None:
                break
        if lead is None and mail.from_address:
            lead = self.conn.execute(
                "SELECT * FROM leads WHERE email = ? AND contacted_at IS NOT NULL ORDER BY contacted_at DESC LIMIT 1",
                (mail.from_address,),
            ).fetchone()
        if lead is None and mail.from_address and not is_free_email_domain(mail.from_address.rsplit("@", 1)[-1]):
            lead = self.conn.execute(
                "SELECT * FROM leads WHERE email_domain = ? AND contacted_at IS NOT NULL ORDER BY contacted_at DESC LIMIT 1",
                (mail.from_address.rsplit("@", 1)[-1],),
            ).fetchone()
        if lead is None:
            return
        lead_id = int(lead["id"])
        with db.transaction(self.conn):
            cancelled = db.cancel_pending_for_leads(self.conn, [lead_id], "replied")
            if mail.wants_unsubscribe:
                address = str(lead["email"]).lower()
                db.add_suppression(self.conn, "email", address, "unsubscribe_reply")
                if not is_free_email_domain(address.rsplit("@", 1)[-1]):
                    db.add_suppression(self.conn, "domain", address.rsplit("@", 1)[-1], "unsubscribe_reply")
                db.set_lead_status(self.conn, lead_id, db.UNSUBSCRIBED)
            elif lead["status"] not in (db.UNSUBSCRIBED, db.CONVERTED_TO_WA):
                db.set_lead_status(self.conn, lead_id, db.REPLIED)
            db.add_event(
                self.conn, lead_id, "reply", account=account.email, unsubscribe=mail.wants_unsubscribe,
                cancelled_sends=cancelled, subject=mail.subject[:200],
            )
        report.replies += 1
        log(logger, logging.INFO, "reply", lead_id=lead_id, account=account.email, unsubscribe=mail.wants_unsubscribe)

    async def check_inboxes(self, report: PassReport) -> None:
        """Revisa por IMAP las bandejas de todas las cuentas: respuestas, bajas por respuesta y rebotes."""
        self._last_imap = self._now()
        for account in self.accounts:
            if not account.imap_host:
                continue
            seen = {
                str(row["message_key"])
                for row in self.conn.execute("SELECT message_key FROM imap_seen WHERE account_email = ?", (account.email.lower(),))
            }
            try:
                mails = await asyncio.to_thread(self._imap, account, seen)
            except (imaplib.IMAP4.error, OSError, ssl.SSLError) as exc:
                log(logger, logging.ERROR, "imap_failed", account=account.email, error=f"{type(exc).__name__}: {exc}")
                continue
            for mail in mails:
                self._apply_inbound(account, mail, report)
                with db.transaction(self.conn):
                    self.conn.execute(
                        "INSERT OR IGNORE INTO imap_seen (account_email, message_key, seen_at) VALUES (?, ?, ?)",
                        (account.email.lower(), mail.key, db.iso(self._now())),
                    )

    async def maybe_check_inboxes(self, report: PassReport) -> None:
        interval = timedelta(seconds=self.settings.imap_check_interval)
        if self._last_imap is None or self._now() - self._last_imap >= interval:
            await self.check_inboxes(report)

    def recover_interrupted(self) -> int:
        """Envíos que quedaron a medias en un arranque anterior: se marcan como fallidos, nunca se repiten."""
        with db.transaction(self.conn):
            cursor = self.conn.execute(
                "UPDATE outbox SET status = ?, error = ?, updated_at = ? WHERE status = ?",
                (db.OUT_FAILED, "interrumpido: el proceso se detuvo durante el envío", db.iso(self._now()), db.OUT_SENDING),
            )
        if cursor.rowcount:
            self.alert(
                "Envíos interrumpidos", f"{cursor.rowcount} envío(s) quedaron a medias y no se repetirán. Revísalos con stats.",
            )
        return cursor.rowcount

    def _heartbeat(self) -> None:
        if self._has_lease:
            db.acquire_sender_lease(self.conn, self._lease_owner)

    _has_lease = False

    async def run(self, live: bool, once: bool, on_pass: Callable[[PassReport], None] | None = None) -> PassReport:
        if not live:
            return await self._run(live, once, on_pass)
        if not db.acquire_sender_lease(self.conn, self._lease_owner):
            raise SenderBusy("Ya hay un motor de envío en marcha (el servicio o el panel). No se arranca un segundo.")
        self._has_lease = True
        try:
            return await self._run(live, once, on_pass)
        finally:
            self._has_lease = False
            db.release_sender_lease(self.conn, self._lease_owner)

    async def _run(self, live: bool, once: bool, on_pass: Callable[[PassReport], None] | None = None) -> PassReport:
        last = PassReport()
        if live:
            self.recover_interrupted()
        while not self.stop.is_set():
            report = PassReport()
            self._heartbeat()
            if live:
                await self.maybe_check_inboxes(report)
            sent_report = await self.send_pass(live)
            sent_report.replies += report.replies
            sent_report.bounces += report.bounces
            last = sent_report
            if on_pass:
                on_pass(sent_report)
            if once or not live:
                break
            with contextlib.suppress(asyncio.TimeoutError):
                await asyncio.wait_for(self.stop.wait(), timeout=IDLE_SLEEP_SECONDS)
        return last


def resume_account(conn: sqlite3.Connection, account_email: str) -> bool:
    with db.transaction(conn):
        cursor = conn.execute(
            "UPDATE account_state SET paused_at = NULL, pause_reason = NULL WHERE account_email = ? AND paused_at IS NOT NULL",
            (account_email.lower(),),
        )
        if cursor.rowcount:
            db.add_event(conn, None, "account_resumed", account=account_email)
    return cursor.rowcount == 1


def account_overview(conn: sqlite3.Connection, accounts: list[Account]) -> list[dict[str, Any]]:
    today = db.utcnow().strftime("%Y-%m-%d")
    paused = {
        str(row["account_email"]): row
        for row in conn.execute("SELECT * FROM account_state WHERE paused_at IS NOT NULL")
    }
    overview = []
    for account in accounts:
        usage = conn.execute(
            "SELECT sent_count FROM account_usage WHERE account_email = ? AND day = ?", (account.email.lower(), today)
        ).fetchone()
        state = paused.get(account.email.lower())
        overview.append({
            "email": account.email,
            "sent_today": int(usage["sent_count"]) if usage else 0,
            "daily_limit": account.daily_limit,
            "paused": state is not None,
            "pause_reason": str(state["pause_reason"]) if state else "",
            "imap": bool(account.imap_host),
        })
    return overview
