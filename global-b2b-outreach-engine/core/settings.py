"""Configuración global leída de variables de entorno y del fichero `.env`."""
from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/126.0 Safari/537.36"
)


def load_env_file(path: Path) -> None:
    """Carga pares CLAVE=valor de un `.env` sin pisar variables ya definidas."""
    if not path.is_file():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key, value = key.strip(), value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        os.environ.setdefault(key, value)


def _bool(name: str, default: bool) -> bool:
    raw = os.environ.get(name)
    if raw is None or raw.strip() == "":
        return default
    return raw.strip().lower() in {"1", "true", "yes", "si", "sí", "on"}


def _int(name: str, default: int) -> int:
    raw = os.environ.get(name, "").strip()
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError as exc:
        raise ValueError(f"La variable {name} debe ser un número entero, no «{raw}»") from exc


def _path(name: str, default: str) -> Path:
    value = Path(os.environ.get(name, "").strip() or default)
    return value if value.is_absolute() else BASE_DIR / value


@dataclass(frozen=True)
class Settings:
    db_path: Path
    apify_token: str
    anthropic_api_key: str
    anthropic_model: str
    company_name: str
    tax_id: str
    fiscal_address: str
    privacy_url: str
    sender_name: str
    public_base_url: str
    strict_b2b_only: bool
    robinson_file: Path
    webhook_secret: str
    whatsapp_verify_token: str
    whatsapp_app_secret: str
    accounts_file: Path
    jitter_min: int
    jitter_max: int
    imap_check_interval: int
    max_account_errors: int
    max_account_bounces: int
    alert_webhook_url: str
    log_level: str
    user_agent: str

    def missing_legal_fields(self) -> list[str]:
        """Campos obligatorios para poder montar el pie legal de un correo."""
        required = {
            "COMPANY_NAME": self.company_name,
            "TAX_ID": self.tax_id,
            "FISCAL_ADDRESS": self.fiscal_address,
            "PRIVACY_URL": self.privacy_url,
            "PUBLIC_BASE_URL": self.public_base_url,
        }
        return [name for name, value in required.items() if not value]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    load_env_file(BASE_DIR / ".env")
    env = os.environ
    jitter_min = _int("SEND_JITTER_MIN_SECONDS", 90)
    jitter_max = _int("SEND_JITTER_MAX_SECONDS", 240)
    if jitter_min < 0 or jitter_max < jitter_min:
        raise ValueError("SEND_JITTER_MIN_SECONDS debe ser >= 0 y <= SEND_JITTER_MAX_SECONDS")
    return Settings(
        db_path=_path("DB_PATH", "data/leads.db"),
        apify_token=env.get("APIFY_TOKEN", "").strip(),
        anthropic_api_key=env.get("ANTHROPIC_API_KEY", "").strip(),
        anthropic_model=env.get("ANTHROPIC_MODEL", "").strip() or "claude-haiku-4-5-20251001",
        company_name=env.get("COMPANY_NAME", "").strip(),
        tax_id=env.get("TAX_ID", "").strip(),
        fiscal_address=env.get("FISCAL_ADDRESS", "").strip(),
        privacy_url=env.get("PRIVACY_URL", "").strip(),
        sender_name=env.get("SENDER_NAME", "").strip(),
        public_base_url=env.get("PUBLIC_BASE_URL", "").strip().rstrip("/"),
        strict_b2b_only=_bool("STRICT_B2B_ONLY", True),
        robinson_file=_path("ROBINSON_FILE", "external_robinson_blocklist.csv"),
        webhook_secret=env.get("WEBHOOK_SECRET", "").strip(),
        whatsapp_verify_token=env.get("WHATSAPP_VERIFY_TOKEN", "").strip(),
        whatsapp_app_secret=env.get("WHATSAPP_APP_SECRET", "").strip(),
        accounts_file=_path("ACCOUNTS_FILE", "accounts.json"),
        jitter_min=jitter_min,
        jitter_max=jitter_max,
        imap_check_interval=_int("IMAP_CHECK_INTERVAL_SECONDS", 600),
        max_account_errors=_int("MAX_ACCOUNT_ERRORS", 3),
        max_account_bounces=_int("MAX_ACCOUNT_BOUNCES", 3),
        alert_webhook_url=env.get("ALERT_WEBHOOK_URL", "").strip(),
        log_level=env.get("LOG_LEVEL", "").strip().upper() or "INFO",
        user_agent=env.get("ENRICH_USER_AGENT", "").strip() or DEFAULT_USER_AGENT,
    )
