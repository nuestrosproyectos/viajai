"""Módulo 3 — Redacción con IA de la secuencia (asunto, primer correo y dos seguimientos).

El enlace de WhatsApp, la referencia del lead y el pie legal se construyen siempre en Python.
El modelo solo escribe el texto y coloca el marcador [[WA_LINK]]; nunca escribe una URL.
"""
from __future__ import annotations

import asyncio
import json
import logging
import re
import secrets
import sqlite3
import uuid
from dataclasses import dataclass, field
from functools import lru_cache
from typing import Any, Callable, Protocol
from urllib.parse import quote

import anthropic
from pydantic import BaseModel, ValidationError, ValidationInfo, field_validator

from core import db
from core.campaign import CampaignConfig, SUPPORTED_LANGUAGES
from core.logs import get_logger, log
from core.settings import BASE_DIR, Settings, get_settings
from core.textutils import ascii_slug

logger = get_logger("copywriter")

TEMPLATES_PATH = BASE_DIR / "config" / "compliance_templates.json"
WA_PLACEHOLDER = "[[WA_LINK]]"
REF_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"  # sin 0/O/1/I para que no se confundan al teclear
SUBJECT_MAX_CHARS = 45
LLM_CONCURRENCY = 4
MAX_OUTPUT_TOKENS = 2000
ESTIMATED_OUTPUT_TOKENS = 480
CHARS_PER_TOKEN = 3.2

# Precio por millón de tokens (entrada, salida) en USD, por prefijo de modelo.
MODEL_PRICES_USD: dict[str, tuple[float, float]] = {
    "claude-haiku-4-5": (1.00, 5.00),
    "claude-haiku-5-5": (0.10, 0.50),
    "claude-sonnet-5-5": (2.00, 10.00),
    "claude-opus-5-5": (4.00, 20.00),
}

_URL_RE = re.compile(r"(https?://|www\.|wa\.me)", re.IGNORECASE)
_REQUIRED_TEMPLATE_KEYS = {
    "legal_footer", "system_prompt", "wa_cta_line", "wa_anchor_text", "unsubscribe_anchor_text",
    "reply_prefix", "spam_words", "unsubscribe_page", "labels", "default_offer",
}


class CopyError(Exception):
    """No se pudo generar un texto válido para un lead (se puede reintentar)."""


class FatalCopyError(Exception):
    """Error que obliga a parar todo el lote (clave inválida, configuración incompleta)."""


# ── Plantillas ──────────────────────────────────────────────────────────────


@lru_cache(maxsize=1)
def load_templates() -> dict[str, dict[str, Any]]:
    try:
        data = json.loads(TEMPLATES_PATH.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise FatalCopyError(f"No puedo leer {TEMPLATES_PATH}: {exc}") from exc
    languages = data.get("languages", {})
    for language in SUPPORTED_LANGUAGES:
        missing = _REQUIRED_TEMPLATE_KEYS - set(languages.get(language, {}))
        if missing:
            raise FatalCopyError(f"compliance_templates.json: al idioma «{language}» le faltan {sorted(missing)}")
    return languages


def template_for(language: str) -> dict[str, Any]:
    templates = load_templates()
    return templates.get(language) or templates["en"]


# ── Piezas deterministas ────────────────────────────────────────────────────


def new_lead_ref(conn: sqlite3.Connection, city_label: str) -> str:
    """Referencia corta y única, p. ej. GR-8F3A (prefijo = dos primeras letras de la ciudad)."""
    prefix = (ascii_slug(city_label) + "XX")[:2]
    for _ in range(50):
        ref = f"{prefix}-{''.join(secrets.choice(REF_ALPHABET) for _ in range(4))}"
        if conn.execute("SELECT 1 FROM leads WHERE lead_ref = ?", (ref,)).fetchone() is None:
            return ref
    # Prefijo saturado (casi un millón de combinaciones): se alarga la parte aleatoria.
    while True:
        ref = f"{prefix}-{''.join(secrets.choice(REF_ALPHABET) for _ in range(7))}"
        if conn.execute("SELECT 1 FROM leads WHERE lead_ref = ?", (ref,)).fetchone() is None:
            return ref


def build_wa_link(campaign: CampaignConfig, business_name: str, lead_ref: str) -> str:
    """URL wa.me con el mensaje precargado. 100 % determinista: jamás pasa por el modelo."""
    prefill = campaign.whatsapp_prefill_template.format(
        business_name=business_name.strip(),
        city_label=campaign.city_label,
        niche_label=campaign.niche_label,
        lead_ref=lead_ref,
    )
    return f"https://wa.me/{campaign.whatsapp_number}?text={quote(prefill, safe='')}"


def unsubscribe_url(settings: Settings, token: str) -> str:
    return f"{settings.public_base_url}/unsubscribe/{token}"


def render_legal_footer(settings: Settings, language: str, source_url: str, token: str) -> str:
    return str(template_for(language)["legal_footer"]).format(
        company_name=settings.company_name,
        tax_id=settings.tax_id,
        fiscal_address=settings.fiscal_address,
        source_url=source_url,
        privacy_url=settings.privacy_url,
        unsubscribe_url=unsubscribe_url(settings, token),
    )


def inject_wa_link(body: str, wa_link: str, cta_line: str, required: bool) -> str:
    """Sustituye el marcador por el enlace real; si el modelo lo olvidó, lo añade antes de la firma."""
    body = body.strip()
    if WA_PLACEHOLDER in body:
        return body.replace(WA_PLACEHOLDER, wa_link)
    if not required:
        return body
    paragraphs = re.split(r"\n\s*\n", body)
    block = f"{cta_line}\n{wa_link}"
    if len(paragraphs) >= 2:
        paragraphs.insert(len(paragraphs) - 1, block)
    else:
        paragraphs.append(block)
    return "\n\n".join(paragraphs)


def assemble_body(text: str, footer: str) -> str:
    return f"{text.strip()}\n\n--\n{footer}"


# ── Salida del modelo y validación ──────────────────────────────────────────


class CopyDraft(BaseModel):
    """Esquema que se le exige al modelo (salida estructurada)."""

    subject: str
    email_1: str
    followup_1: str
    followup_2: str


class ValidatedCopy(BaseModel):
    """Reglas de calidad que debe cumplir el borrador antes de guardarse."""

    subject: str
    email_1: str
    followup_1: str
    followup_2: str

    @field_validator("subject")
    @classmethod
    def _subject(cls, value: str, info: ValidationInfo) -> str:
        value = " ".join(value.split()).strip(" \"'«»“”")
        if not value:
            raise ValueError("el asunto está vacío")
        if len(value) > SUBJECT_MAX_CHARS:
            raise ValueError(f"el asunto tiene {len(value)} caracteres; el máximo es {SUBJECT_MAX_CHARS}")
        if "!" in value or "¡" in value:
            raise ValueError("el asunto no puede llevar exclamaciones")
        if sum(1 for char in value if char.isupper()) > max(4, len(value) // 3):
            raise ValueError("el asunto tiene demasiadas mayúsculas")
        lowered = value.lower()
        for raw in (info.context or {}).get("spam_words", []):
            word = str(raw).lower().strip()
            if not word:
                continue
            # Palabra completa: «free» no debe saltar con «freelance», ni «gana» con «Granada».
            whole = word[0].isalnum() and word[-1].isalnum()
            pattern = rf"(?<!\w){re.escape(word)}(?!\w)" if whole else re.escape(word)
            if re.search(pattern, lowered):
                raise ValueError(f"el asunto contiene una palabra gancho de spam: «{word}»")
        return value

    @field_validator("email_1", "followup_1", "followup_2")
    @classmethod
    def _body(cls, value: str, info: ValidationInfo) -> str:
        value = re.sub(r"\n{3,}", "\n\n", value.replace("\r\n", "\n")).strip()
        minimum, maximum = {"email_1": (45, 190), "followup_1": (20, 110), "followup_2": (12, 80)}[str(info.field_name)]
        words = len(value.split())
        if words < minimum or words > maximum:
            raise ValueError(f"{info.field_name} tiene {words} palabras; debe tener entre {minimum} y {maximum}")
        if _URL_RE.search(value.replace(WA_PLACEHOLDER, "")):
            raise ValueError(f"{info.field_name} contiene una URL; solo se admite el marcador {WA_PLACEHOLDER}")
        if value.count(WA_PLACEHOLDER) > 1:
            raise ValueError(f"{info.field_name} repite el marcador {WA_PLACEHOLDER}")
        if re.search(r"\[\[(?!WA_LINK\]\])|\{\{|\*\*", value):
            raise ValueError(f"{info.field_name} contiene marcadores o formato sin resolver")
        return value


def validate_draft(draft: CopyDraft, language: str) -> ValidatedCopy:
    try:
        return ValidatedCopy.model_validate(
            draft.model_dump(), context={"spam_words": template_for(language)["spam_words"]}
        )
    except ValidationError as exc:
        raise CopyError("; ".join(str(err["msg"]).removeprefix("Value error, ") for err in exc.errors())) from exc


# ── Cliente del modelo ──────────────────────────────────────────────────────


@dataclass
class Usage:
    calls: int = 0
    input_tokens: int = 0
    output_tokens: int = 0


class CopyLLM(Protocol):
    usage: Usage

    async def generate(self, system: str, user: str) -> CopyDraft: ...


class AnthropicCopyLLM:
    """Genera el borrador con Anthropic y salida JSON validada contra `CopyDraft`."""

    def __init__(self, api_key: str, model: str) -> None:
        if not api_key:
            raise FatalCopyError("Falta ANTHROPIC_API_KEY en el entorno o en .env")
        self._client = anthropic.AsyncAnthropic(api_key=api_key, max_retries=3, timeout=90.0)
        self._model = model
        self.usage = Usage()

    async def generate(self, system: str, user: str) -> CopyDraft:
        try:
            response = await self._client.messages.parse(
                model=self._model,
                max_tokens=MAX_OUTPUT_TOKENS,
                system=system,
                messages=[{"role": "user", "content": user}],
                output_format=CopyDraft,
            )
        except (anthropic.AuthenticationError, anthropic.PermissionDeniedError) as exc:
            raise FatalCopyError(f"Anthropic rechaza la clave de API: {exc.message}") from exc
        except anthropic.NotFoundError as exc:
            raise FatalCopyError(f"El modelo «{self._model}» no existe o no está disponible: {exc.message}") from exc
        except anthropic.RateLimitError as exc:
            raise CopyError(f"límite de peticiones de Anthropic alcanzado: {exc.message}") from exc
        except anthropic.APIStatusError as exc:
            raise CopyError(f"error {exc.status_code} de Anthropic: {exc.message}") from exc
        except anthropic.APIConnectionError as exc:
            raise CopyError(f"sin conexión con Anthropic: {exc}") from exc
        except ValidationError as exc:
            raise CopyError(f"el modelo no devolvió el JSON esperado: {exc.error_count()} errores") from exc
        self.usage.calls += 1
        self.usage.input_tokens += int(response.usage.input_tokens)
        self.usage.output_tokens += int(response.usage.output_tokens)
        if response.stop_reason in ("refusal", "max_tokens"):
            raise CopyError(f"respuesta incompleta del modelo (stop_reason={response.stop_reason})")
        if response.parsed_output is None:
            raise CopyError("el modelo no devolvió contenido estructurado")
        return response.parsed_output


# ── Prompt ──────────────────────────────────────────────────────────────────


def build_user_prompt(campaign: CampaignConfig, lead: sqlite3.Row, settings: Settings, feedback: str = "") -> str:
    template = template_for(campaign.language)
    labels = template["labels"]
    offer = campaign.offer_context or str(template["default_offer"]).format(
        niche_label=campaign.niche_label, city_label=campaign.city_label
    )
    summary = (lead["services_summary"] or "").strip() or labels["no_summary"]
    lines = [
        f"{labels['business']}: {lead['business_name']}",
        f"{labels['category']}: {lead['category'] or '-'}",
        f"{labels['city']}: {campaign.city_label}",
        f"{labels['niche']}: {campaign.niche_label}",
        f"{labels['offer']}: {offer}",
        f"{labels['sender']}: {campaign.sender_name or settings.sender_name or settings.company_name}",
        f"{labels['company']}: {settings.company_name}",
        "",
        f"{labels['summary']}:",
        "<<<",
        summary,
        ">>>",
    ]
    if feedback:
        lines += ["", labels["fix"], feedback]
    return "\n".join(lines)


# ── Orquestación ────────────────────────────────────────────────────────────


@dataclass
class GenerateStats:
    candidates: int = 0
    generated: int = 0
    failed: int = 0
    skipped_suppressed: int = 0
    usage: Usage = field(default_factory=Usage)
    cost_usd: float | None = None
    errors: list[str] = field(default_factory=list)


@dataclass
class DryRunEstimate:
    leads: int
    model: str
    calls: int
    input_tokens: int
    output_tokens: int
    cost_usd: float | None


def price_for(model: str) -> tuple[float, float] | None:
    for prefix, price in MODEL_PRICES_USD.items():
        if model.startswith(prefix):
            return price
    return None


def cost_usd(model: str, input_tokens: int, output_tokens: int) -> float | None:
    price = price_for(model)
    if price is None:
        return None
    return round(input_tokens / 1_000_000 * price[0] + output_tokens / 1_000_000 * price[1], 4)


def select_candidates(
    conn: sqlite3.Connection, campaign: CampaignConfig, limit: int | None, retry_errors: bool
) -> list[sqlite3.Row]:
    sql = "SELECT * FROM leads WHERE campaign_name = ? AND status = ? AND email IS NOT NULL"
    if not retry_errors:
        sql += " AND copy_error IS NULL"
    sql += " ORDER BY (copy_error IS NOT NULL), id"
    params: list[Any] = [campaign.campaign_name, db.ENRICHED]
    if limit:
        sql += " LIMIT ?"
        params.append(limit)
    return conn.execute(sql, params).fetchall()


def estimate(conn: sqlite3.Connection, campaign: CampaignConfig, limit: int | None, retry_errors: bool) -> DryRunEstimate:
    """Estimación de llamadas y coste sin tocar la API ni la base de datos."""
    settings = get_settings()
    leads = select_candidates(conn, campaign, limit, retry_errors)
    system = str(template_for(campaign.language)["system_prompt"])
    input_chars = sum(len(system) + len(build_user_prompt(campaign, lead, settings)) + 600 for lead in leads)
    calls = round(len(leads) * 1.15 + 0.49) if leads else 0  # ~15 % de reintentos por validación
    input_tokens = int(input_chars / CHARS_PER_TOKEN * 1.15)
    output_tokens = calls * ESTIMATED_OUTPUT_TOKENS
    return DryRunEstimate(
        leads=len(leads), model=settings.anthropic_model, calls=calls, input_tokens=input_tokens,
        output_tokens=output_tokens, cost_usd=cost_usd(settings.anthropic_model, input_tokens, output_tokens),
    )


async def _write_copy(llm: CopyLLM, campaign: CampaignConfig, lead: sqlite3.Row, settings: Settings) -> ValidatedCopy:
    system = str(template_for(campaign.language)["system_prompt"])
    draft = await llm.generate(system, build_user_prompt(campaign, lead, settings))
    try:
        return validate_draft(draft, campaign.language)
    except CopyError as first_error:
        # Un segundo intento diciéndole al modelo exactamente qué regla ha incumplido.
        retry = await llm.generate(system, build_user_prompt(campaign, lead, settings, feedback=str(first_error)))
        return validate_draft(retry, campaign.language)


def _store_success(
    conn: sqlite3.Connection, campaign: CampaignConfig, lead: sqlite3.Row, settings: Settings,
    copy: ValidatedCopy, lead_ref: str, wa_link: str, token: str,
) -> bool:
    template = template_for(campaign.language)
    footer = render_legal_footer(settings, campaign.language, str(lead["source_url"]), token)
    cta = str(template["wa_cta_line"])
    bodies = {
        "email_1": assemble_body(inject_wa_link(copy.email_1, wa_link, cta, required=True), footer),
        "followup_1": assemble_body(inject_wa_link(copy.followup_1, wa_link, cta, required=True), footer),
        "followup_2": assemble_body(inject_wa_link(copy.followup_2, wa_link, cta, required=False), footer),
    }
    now = db.iso()
    with db.transaction(conn):
        cursor = conn.execute(
            "UPDATE leads SET status=?, language=?, lead_ref=?, wa_link=?, unsubscribe_token=?, subject=?, "
            "body_email_1=?, body_followup_1=?, body_followup_2=?, copy_attempts=copy_attempts+1, "
            "copy_error=NULL, updated_at=? WHERE id=? AND status=?",
            (
                db.READY, campaign.language, lead_ref, wa_link, token, copy.subject, bodies["email_1"],
                bodies["followup_1"], bodies["followup_2"], now, lead["id"], db.ENRICHED,
            ),
        )
        if cursor.rowcount != 1:
            return False  # el lead cambió de estado mientras se redactaba (baja, conversión...)
        for step in db.STEPS:
            conn.execute(
                "INSERT OR IGNORE INTO outbox (lead_id, campaign_name, step, idempotency_key, status, "
                "scheduled_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    lead["id"], campaign.campaign_name, step, db.idempotency_key(int(lead["id"]), step),
                    db.OUT_PENDING, now if step == "email_1" else None, now, now,
                ),
            )
        db.add_event(conn, int(lead["id"]), "copy_generated", lead_ref=lead_ref, subject=copy.subject)
    return True


def _store_failure(conn: sqlite3.Connection, lead_id: int, error: str) -> None:
    with db.transaction(conn):
        conn.execute(
            "UPDATE leads SET copy_attempts=copy_attempts+1, copy_error=?, updated_at=? WHERE id=? AND status=?",
            (error[:500], db.iso(), lead_id, db.ENRICHED),
        )


async def run_generation(
    conn: sqlite3.Connection,
    campaign: CampaignConfig,
    limit: int | None = None,
    retry_errors: bool = False,
    llm: CopyLLM | None = None,
    on_progress: Callable[[bool], None] | None = None,
) -> GenerateStats:
    settings = get_settings()
    missing = settings.missing_legal_fields()
    if missing:
        raise FatalCopyError(
            "Faltan datos legales obligatorios en .env para montar el pie de los correos: " + ", ".join(missing)
        )
    load_templates()
    db.save_campaign(conn, campaign)
    leads = select_candidates(conn, campaign, limit, retry_errors)
    stats = GenerateStats(candidates=len(leads))
    if not leads:
        return stats
    client = llm or AnthropicCopyLLM(settings.anthropic_api_key, settings.anthropic_model)
    stats.usage = client.usage
    semaphore = asyncio.Semaphore(LLM_CONCURRENCY)
    fatal: list[FatalCopyError] = []

    async def worker(lead: sqlite3.Row) -> None:
        lead_id = int(lead["id"])
        if fatal:
            return
        if db.is_suppressed(conn, str(lead["email"])):
            stats.skipped_suppressed += 1
            if on_progress:
                on_progress(False)
            return
        lead_ref = lead["lead_ref"] or new_lead_ref(conn, campaign.city_label)
        token = lead["unsubscribe_token"] or str(uuid.uuid4())
        wa_link = build_wa_link(campaign, str(lead["business_name"]), lead_ref)
        ok = False
        try:
            async with semaphore:
                if fatal:
                    return
                copy = await _write_copy(client, campaign, lead, settings)
            ok = _store_success(conn, campaign, lead, settings, copy, lead_ref, wa_link, token)
            if ok:
                stats.generated += 1
                log(logger, logging.INFO, "copy_generated", lead_id=lead_id, lead_ref=lead_ref, subject=copy.subject)
        except FatalCopyError as exc:
            fatal.append(exc)
            return
        except CopyError as exc:
            stats.failed += 1
            stats.errors.append(f"lead {lead_id}: {exc}")
            _store_failure(conn, lead_id, str(exc))
            log(logger, logging.WARNING, "copy_failed", lead_id=lead_id, error=str(exc))
        if on_progress:
            on_progress(ok)

    await asyncio.gather(*(worker(lead) for lead in leads))
    stats.cost_usd = cost_usd(settings.anthropic_model, stats.usage.input_tokens, stats.usage.output_tokens)
    if fatal:
        raise fatal[0]
    return stats
