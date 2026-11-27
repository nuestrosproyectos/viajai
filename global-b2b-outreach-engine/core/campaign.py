"""Esquema Pydantic de una campaña y utilidades de carga."""
from __future__ import annotations

import json
import re
import string
import unicodedata
from datetime import datetime, time
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from pydantic import BaseModel, ConfigDict, Field, ValidationError, field_validator, model_validator

from core.settings import BASE_DIR

SUPPORTED_LANGUAGES = ("es", "en", "fr", "de", "it", "pt")
PREFILL_PLACEHOLDERS = {"business_name", "city_label", "niche_label", "lead_ref"}
CAMPAIGNS_DIR = BASE_DIR / "campaigns"

_HHMM = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")


def _plain(text: str) -> str:
    """Minúsculas y sin acentos, para comparar categorías."""
    return "".join(c for c in unicodedata.normalize("NFKD", text.lower()) if not unicodedata.combining(c))


class CampaignError(Exception):
    """La campaña no existe o su JSON no es válido."""


class CampaignConfig(BaseModel):
    """Todos los parámetros de una campaña. Cambiar de nicho o país = cambiar este JSON."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    campaign_name: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]{2,63}$")
    niche_label: str = Field(min_length=2, max_length=80)
    city_label: str = Field(min_length=2, max_length=80)
    search_terms: list[str] = Field(min_length=1, max_length=50)
    locations: list[str] = Field(min_length=1, max_length=50)
    country_code: str = Field(pattern=r"^[A-Za-z]{2}$")
    language: str
    timezone: str
    business_hours_start: str
    business_hours_end: str
    max_places_per_search: int = Field(ge=1, le=5000)
    whatsapp_number: str = Field(pattern=r"^[1-9]\d{7,14}$")
    whatsapp_prefill_template: str = Field(min_length=10, max_length=600)

    # Opcionales
    offer_context: str = Field(default="", max_length=1200)
    category_filter: list[str] = Field(default_factory=list, max_length=40)
    sender_name: str = Field(default="", max_length=80)
    send_weekdays: list[int] = Field(default_factory=lambda: [1, 2, 3, 4, 5], min_length=1)
    followup_1_days: int = Field(default=3, ge=1, le=30)
    followup_2_days: int = Field(default=7, ge=2, le=60)

    @field_validator("country_code")
    @classmethod
    def _upper_country(cls, value: str) -> str:
        return value.upper()

    @field_validator("language")
    @classmethod
    def _language(cls, value: str) -> str:
        value = value.lower()
        if value not in SUPPORTED_LANGUAGES:
            raise ValueError(f"idioma no soportado: {value}. Válidos: {', '.join(SUPPORTED_LANGUAGES)}")
        return value

    @field_validator("timezone")
    @classmethod
    def _timezone(cls, value: str) -> str:
        try:
            ZoneInfo(value)
        except (ZoneInfoNotFoundError, ValueError) as exc:
            raise ValueError(f"zona horaria IANA desconocida: {value}") from exc
        return value

    @field_validator("business_hours_start", "business_hours_end")
    @classmethod
    def _hhmm(cls, value: str) -> str:
        if not _HHMM.match(value):
            raise ValueError("formato de hora inválido, usa HH:MM (24 h)")
        return value

    @field_validator("search_terms", "locations")
    @classmethod
    def _non_empty_items(cls, value: list[str]) -> list[str]:
        cleaned = [item.strip() for item in value if item and item.strip()]
        if not cleaned:
            raise ValueError("la lista no puede estar vacía")
        return list(dict.fromkeys(cleaned))

    @field_validator("send_weekdays")
    @classmethod
    def _weekdays(cls, value: list[int]) -> list[int]:
        if any(day < 1 or day > 7 for day in value):
            raise ValueError("los días van de 1 (lunes) a 7 (domingo)")
        return sorted(set(value))

    @field_validator("whatsapp_prefill_template")
    @classmethod
    def _prefill(cls, value: str) -> str:
        try:
            fields = {name for _, name, _, _ in string.Formatter().parse(value) if name is not None}
        except ValueError as exc:
            raise ValueError(f"llaves mal cerradas en la plantilla: {exc}") from exc
        unknown = fields - PREFILL_PLACEHOLDERS
        if unknown:
            raise ValueError(
                f"variables no admitidas: {', '.join(sorted(unknown))}. "
                f"Admitidas: {', '.join(sorted(PREFILL_PLACEHOLDERS))}"
            )
        if "lead_ref" not in fields:
            raise ValueError("la plantilla debe incluir {lead_ref} para poder atribuir la conversión")
        return value

    @model_validator(mode="after")
    def _coherence(self) -> "CampaignConfig":
        if self.window_start >= self.window_end:
            raise ValueError("business_hours_start debe ser anterior a business_hours_end")
        if self.followup_2_days <= self.followup_1_days:
            raise ValueError("followup_2_days debe ser mayor que followup_1_days")
        return self

    @property
    def window_start(self) -> time:
        hour, minute = self.business_hours_start.split(":")
        return time(int(hour), int(minute))

    @property
    def window_end(self) -> time:
        hour, minute = self.business_hours_end.split(":")
        return time(int(hour), int(minute))

    def category_matches(self, category: str) -> bool:
        """True si la categoría de Google Maps encaja con el nicho (o si no hay filtro)."""
        if not self.category_filter:
            return True
        normalized = _plain(category)
        return any(_plain(keyword) in normalized for keyword in self.category_filter if keyword.strip())

    def local_now(self, now_utc: datetime) -> datetime:
        return now_utc.astimezone(ZoneInfo(self.timezone))

    def in_send_window(self, now_utc: datetime) -> bool:
        """True si ahora mismo es día y hora hábil en la zona horaria de la campaña."""
        local = self.local_now(now_utc)
        if local.isoweekday() not in self.send_weekdays:
            return False
        return self.window_start <= local.time().replace(tzinfo=None) < self.window_end


def format_validation_error(exc: ValidationError) -> str:
    lines = []
    for err in exc.errors():
        location = ".".join(str(part) for part in err["loc"]) or "(campaña)"
        lines.append(f"  - {location}: {err['msg']}")
    return "\n".join(lines)


def parse_campaign(raw: str, origin: str = "campaña") -> CampaignConfig:
    try:
        return CampaignConfig.model_validate(json.loads(raw))
    except json.JSONDecodeError as exc:
        raise CampaignError(f"{origin}: JSON mal formado ({exc})") from exc
    except ValidationError as exc:
        raise CampaignError(f"{origin}: configuración no válida\n{format_validation_error(exc)}") from exc


def load_campaign(reference: str, campaigns_dir: Path | None = None) -> CampaignConfig:
    """Carga una campaña por ruta de fichero o por su `campaign_name`."""
    directory = campaigns_dir or CAMPAIGNS_DIR
    candidate = Path(reference)
    if candidate.suffix == ".json" and candidate.is_file():
        return parse_campaign(candidate.read_text(encoding="utf-8"), str(candidate))
    direct = directory / f"{reference}.json"
    if direct.is_file():
        return parse_campaign(direct.read_text(encoding="utf-8"), str(direct))
    for path in sorted(directory.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue
        if isinstance(data, dict) and data.get("campaign_name") == reference:
            return parse_campaign(json.dumps(data), str(path))
    raise CampaignError(
        f"No encuentro la campaña «{reference}». Pasa la ruta al JSON o su campaign_name "
        f"(busco en {directory})."
    )
