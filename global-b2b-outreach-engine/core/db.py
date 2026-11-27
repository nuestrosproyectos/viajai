"""Capa SQLite: WAL, busy_timeout=5000 y transacciones explícitas."""
from __future__ import annotations

import hashlib
import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterator

from core.campaign import CampaignConfig, CampaignError, parse_campaign
from core.settings import get_settings

# Estados del lead
NEW = "NEW"
DUPLICATE = "DUPLICATE"
ENRICHED = "ENRICHED"
NO_CORPORATE_EMAIL = "NO_CORPORATE_EMAIL"
ERROR = "ERROR"
READY = "READY"
CONTACTED = "CONTACTED"
CONVERTED_TO_WA = "CONVERTED_TO_WA"
REPLIED = "REPLIED"
UNSUBSCRIBED = "UNSUBSCRIBED"
BOUNCED = "BOUNCED"

# Estados avanzados: ninguna re-extracción ni re-enriquecido puede pisarlos.
PROTECTED_STATUSES = frozenset({CONTACTED, CONVERTED_TO_WA, REPLIED, UNSUBSCRIBED, BOUNCED})

# Pasos de la secuencia y estados de la bandeja de salida
STEPS = ("email_1", "followup_1", "followup_2")
OUT_PENDING = "PENDING"
OUT_SENDING = "SENDING"
OUT_SENT = "SENT"
OUT_CANCELLED = "CANCELLED"
OUT_FAILED = "FAILED"

SCHEMA = """
CREATE TABLE IF NOT EXISTS campaigns (
    name TEXT PRIMARY KEY,
    config_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_name TEXT NOT NULL,
    place_id TEXT NOT NULL UNIQUE,
    business_name TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    city TEXT NOT NULL DEFAULT '',
    country_code TEXT NOT NULL DEFAULT '',
    phone_raw TEXT NOT NULL DEFAULT '',
    phone_e164 TEXT,
    website TEXT NOT NULL DEFAULT '',
    root_domain TEXT,
    maps_url TEXT NOT NULL DEFAULT '',
    rating REAL,
    reviews_count INTEGER,
    status TEXT NOT NULL DEFAULT 'NEW',
    duplicate_of INTEGER REFERENCES leads(id),
    email TEXT,
    email_domain TEXT,
    email_type TEXT,
    source_url TEXT,
    has_contact_form INTEGER NOT NULL DEFAULT 0,
    has_whatsapp_link INTEGER NOT NULL DEFAULT 0,
    services_summary TEXT,
    enrich_attempts INTEGER NOT NULL DEFAULT 0,
    retry_after TEXT,
    last_error TEXT,
    language TEXT,
    lead_ref TEXT UNIQUE,
    wa_link TEXT,
    unsubscribe_token TEXT UNIQUE,
    subject TEXT,
    body_email_1 TEXT,
    body_followup_1 TEXT,
    body_followup_2 TEXT,
    copy_attempts INTEGER NOT NULL DEFAULT 0,
    copy_error TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    contacted_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_leads_campaign_status ON leads(campaign_name, status);
CREATE INDEX IF NOT EXISTS idx_leads_root_domain ON leads(root_domain);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone_e164);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_email_domain ON leads(email_domain);

CREATE TABLE IF NOT EXISTS outbox (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER NOT NULL REFERENCES leads(id),
    campaign_name TEXT NOT NULL,
    step TEXT NOT NULL,
    idempotency_key TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'PENDING',
    scheduled_at TEXT,
    sent_at TEXT,
    account_email TEXT,
    message_id TEXT,
    attempts INTEGER NOT NULL DEFAULT 0,
    error TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_outbox_due ON outbox(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_outbox_lead ON outbox(lead_id);
CREATE INDEX IF NOT EXISTS idx_outbox_message ON outbox(message_id);

CREATE TABLE IF NOT EXISTS suppression_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL CHECK (kind IN ('email', 'domain')),
    value TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE (kind, value)
);

CREATE TABLE IF NOT EXISTS account_usage (
    account_email TEXT NOT NULL,
    day TEXT NOT NULL,
    sent_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (account_email, day)
);

CREATE TABLE IF NOT EXISTS account_state (
    account_email TEXT PRIMARY KEY,
    paused_at TEXT,
    pause_reason TEXT
);

CREATE TABLE IF NOT EXISTS imap_seen (
    account_email TEXT NOT NULL,
    message_key TEXT NOT NULL,
    seen_at TEXT NOT NULL,
    PRIMARY KEY (account_email, message_key)
);

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    type TEXT NOT NULL,
    payload TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_events_lead ON events(lead_id);

CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL,
    campaign_name TEXT,
    status TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    started_at TEXT NOT NULL,
    finished_at TEXT
);

CREATE TABLE IF NOT EXISTS control (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
"""


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def iso(moment: datetime | None = None) -> str:
    """Fecha UTC en ISO-8601 de ancho fijo: se puede comparar como texto en SQL."""
    return (moment or utcnow()).astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def parse_iso(value: str) -> datetime:
    return datetime.strptime(value, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)


def connect(db_path: Path | None = None) -> sqlite3.Connection:
    """Abre la base de datos en modo autocommit; las escrituras van en `transaction()`."""
    path = db_path or get_settings().db_path
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(path), timeout=5.0, isolation_level=None, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=5000")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.execute("PRAGMA synchronous=NORMAL")
    return conn


def init_db(conn: sqlite3.Connection) -> None:
    conn.executescript(SCHEMA)


@contextmanager
def open_db(db_path: Path | None = None) -> Iterator[sqlite3.Connection]:
    conn = connect(db_path)
    try:
        init_db(conn)
        yield conn
    finally:
        conn.close()


@contextmanager
def transaction(conn: sqlite3.Connection) -> Iterator[sqlite3.Connection]:
    """Transacción explícita. BEGIN IMMEDIATE toma el bloqueo de escritura desde el inicio."""
    conn.execute("BEGIN IMMEDIATE")
    try:
        yield conn
    except BaseException:
        conn.execute("ROLLBACK")
        raise
    else:
        conn.execute("COMMIT")


def idempotency_key(lead_id: int, step: str) -> str:
    return hashlib.sha256(f"lead:{lead_id}:step:{step}".encode()).hexdigest()


def add_event(conn: sqlite3.Connection, lead_id: int | None, event_type: str, **payload: Any) -> None:
    conn.execute(
        "INSERT INTO events (lead_id, type, payload, created_at) VALUES (?, ?, ?, ?)",
        (lead_id, event_type, json.dumps(payload, ensure_ascii=False, default=str), iso()),
    )


# ── Control y cerrojo del motor de envío ────────────────────────────────────

SENDER_LEASE = "sender_lease"
SENDER_LEASE_STALE_SECONDS = 20 * 60


def get_control(conn: sqlite3.Connection, key: str) -> str | None:
    row = conn.execute("SELECT value FROM control WHERE key = ?", (key,)).fetchone()
    return str(row["value"]) if row else None


def set_control(conn: sqlite3.Connection, key: str, value: str) -> None:
    with transaction(conn):
        conn.execute(
            "INSERT INTO control (key, value, updated_at) VALUES (?, ?, ?) "
            "ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
            (key, value, iso()),
        )


def acquire_sender_lease(conn: sqlite3.Connection, owner: str, now: datetime | None = None) -> bool:
    """Solo un motor de envío a la vez (daemon o panel). Un cerrojo sin latido en 20 min se considera muerto."""
    moment = now or utcnow()
    with transaction(conn):
        row = conn.execute("SELECT value, updated_at FROM control WHERE key = ?", (SENDER_LEASE,)).fetchone()
        if row and row["value"] and row["value"] != owner:
            age = (moment - parse_iso(row["updated_at"])).total_seconds()
            if age < SENDER_LEASE_STALE_SECONDS:
                return False
        conn.execute(
            "INSERT INTO control (key, value, updated_at) VALUES (?, ?, ?) "
            "ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at",
            (SENDER_LEASE, owner, iso(moment)),
        )
    return True


def release_sender_lease(conn: sqlite3.Connection, owner: str) -> None:
    with transaction(conn):
        conn.execute("UPDATE control SET value = '', updated_at = ? WHERE key = ? AND value = ?", (iso(), SENDER_LEASE, owner))


def sender_lease_active(conn: sqlite3.Connection) -> bool:
    row = conn.execute("SELECT value, updated_at FROM control WHERE key = ?", (SENDER_LEASE,)).fetchone()
    if not row or not row["value"]:
        return False
    return (utcnow() - parse_iso(row["updated_at"])).total_seconds() < SENDER_LEASE_STALE_SECONDS


# ── Campañas ────────────────────────────────────────────────────────────────


def save_campaign(conn: sqlite3.Connection, campaign: CampaignConfig) -> None:
    """Guarda la configuración para que el daemon de envío no dependa del fichero JSON."""
    with transaction(conn):
        conn.execute(
            "INSERT INTO campaigns (name, config_json, updated_at) VALUES (?, ?, ?) "
            "ON CONFLICT(name) DO UPDATE SET config_json=excluded.config_json, updated_at=excluded.updated_at",
            (campaign.campaign_name, campaign.model_dump_json(), iso()),
        )


def get_campaign(conn: sqlite3.Connection, name: str) -> CampaignConfig | None:
    row = conn.execute("SELECT config_json FROM campaigns WHERE name = ?", (name,)).fetchone()
    if row is None:
        return None
    try:
        return parse_campaign(row["config_json"], f"campaña {name} (base de datos)")
    except CampaignError:
        return None


# ── Supresión y cancelaciones ───────────────────────────────────────────────


def is_suppressed(conn: sqlite3.Connection, email: str) -> str | None:
    """Devuelve el motivo si el email o su dominio están en la lista de supresión."""
    email = email.strip().lower()
    domain = email.rsplit("@", 1)[-1]
    row = conn.execute(
        "SELECT kind, reason FROM suppression_list "
        "WHERE (kind = 'email' AND value = ?) OR (kind = 'domain' AND value = ?) LIMIT 1",
        (email, domain),
    ).fetchone()
    return f"{row['kind']}:{row['reason']}" if row else None


def add_suppression(conn: sqlite3.Connection, kind: str, value: str, reason: str) -> None:
    conn.execute(
        "INSERT OR IGNORE INTO suppression_list (kind, value, reason, created_at) VALUES (?, ?, ?, ?)",
        (kind, value.strip().lower(), reason, iso()),
    )


def cancel_pending_for_leads(conn: sqlite3.Connection, lead_ids: list[int], reason: str) -> int:
    """Cancela todos los envíos pendientes de esos leads. Debe llamarse dentro de una transacción."""
    if not lead_ids:
        return 0
    marks = ",".join("?" for _ in lead_ids)
    cursor = conn.execute(
        f"UPDATE outbox SET status = ?, error = ?, updated_at = ? "
        f"WHERE status = ? AND lead_id IN ({marks})",
        (OUT_CANCELLED, reason, iso(), OUT_PENDING, *lead_ids),
    )
    return cursor.rowcount


def lead_ids_for_recipient(conn: sqlite3.Connection, email: str, include_domain: bool) -> list[int]:
    email = email.strip().lower()
    if include_domain:
        rows = conn.execute(
            "SELECT id FROM leads WHERE email = ? OR email_domain = ?",
            (email, email.rsplit("@", 1)[-1]),
        ).fetchall()
    else:
        rows = conn.execute("SELECT id FROM leads WHERE email = ?", (email,)).fetchall()
    return [int(row["id"]) for row in rows]


def set_lead_status(conn: sqlite3.Connection, lead_id: int, status: str) -> None:
    conn.execute("UPDATE leads SET status = ?, updated_at = ? WHERE id = ?", (status, iso(), lead_id))
