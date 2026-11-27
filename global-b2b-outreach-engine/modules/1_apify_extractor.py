"""Módulo 1 — Extracción de negocios de Google Maps con la API oficial de Apify.

Actor: compass/crawler-google-places (una ubicación por ejecución, como exige el actor).
"""
from __future__ import annotations

import asyncio
import logging
import sqlite3
from dataclasses import dataclass, field
from typing import Any, Callable

import httpx

from core import db
from core.campaign import CampaignConfig
from core.logs import get_logger, log
from core.settings import get_settings
from core.textutils import normalize_website, root_domain, to_e164

logger = get_logger("extractor")

APIFY_BASE = "https://api.apify.com/v2"
ACTOR_ID = "compass~crawler-google-places"
TERMINAL_OK = "SUCCEEDED"
TERMINAL_FAIL = {"FAILED", "ABORTED", "TIMED-OUT"}
DATASET_PAGE = 500

# Idiomas de campaña → idioma de resultados que acepta el actor.
_ACTOR_LANGUAGE = {"es": "es", "en": "en", "fr": "fr", "de": "de", "it": "it", "pt": "pt-PT"}


class ApifyError(Exception):
    """Fallo irrecuperable hablando con Apify."""


@dataclass
class ExtractStats:
    fetched: int = 0
    inserted: int = 0
    duplicates_chain: int = 0
    refreshed: int = 0
    protected_untouched: int = 0
    skipped_invalid: int = 0
    out_of_niche: int = 0
    runs: list[dict[str, Any]] = field(default_factory=list)


def build_actor_input(campaign: CampaignConfig, location: str) -> dict[str, Any]:
    language = _ACTOR_LANGUAGE[campaign.language]
    if campaign.language == "pt" and campaign.country_code == "BR":
        language = "pt-BR"
    return {
        "searchStringsArray": campaign.search_terms,
        "locationQuery": location,
        "maxCrawledPlacesPerSearch": campaign.max_places_per_search,
        "language": language,
        "skipClosedPlaces": True,
        "scrapePlaceDetailPage": False,
        "scrapeContacts": False,
        "maxReviews": 0,
        "maxImages": 0,
        "maxQuestions": 0,
    }


class ApifyClient:
    """Cliente asíncrono mínimo de la API v2 de Apify."""

    def __init__(self, token: str, client: httpx.AsyncClient | None = None) -> None:
        if not token:
            raise ApifyError("Falta APIFY_TOKEN en el entorno o en .env")
        self._owns_client = client is None
        self._client = client or httpx.AsyncClient(timeout=httpx.Timeout(60.0, connect=15.0))
        self._headers = {"Authorization": f"Bearer {token}"}

    async def aclose(self) -> None:
        if self._owns_client:
            await self._client.aclose()

    async def _request(self, method: str, url: str, **kwargs: Any) -> httpx.Response:
        """Petición con reintentos y backoff exponencial ante errores de red, 429 y 5xx."""
        delay = 2.0
        last_error = "sin respuesta"
        for attempt in range(1, 6):
            try:
                response = await self._client.request(method, url, headers=self._headers, **kwargs)
            except httpx.HTTPError as exc:
                last_error = f"{type(exc).__name__}: {exc}"
            else:
                if response.status_code < 400:
                    return response
                last_error = f"HTTP {response.status_code}: {response.text[:300]}"
                if response.status_code in (401, 403):
                    raise ApifyError(f"Apify rechaza el token ({last_error})")
                if response.status_code not in (408, 429) and response.status_code < 500:
                    raise ApifyError(f"Apify devolvió un error: {last_error}")
            log(logger, logging.WARNING, "apify_retry", attempt=attempt, error=last_error, wait=delay)
            await asyncio.sleep(delay)
            delay = min(delay * 2, 30.0)
        raise ApifyError(f"Apify no responde tras 5 intentos: {last_error}")

    async def start_run(self, actor_input: dict[str, Any]) -> dict[str, Any]:
        response = await self._request("POST", f"{APIFY_BASE}/acts/{ACTOR_ID}/runs", json=actor_input)
        return dict(response.json()["data"])

    async def wait_for_run(
        self,
        run_id: str,
        on_poll: Callable[[str], None] | None = None,
        max_wait_seconds: float = 3600.0,
    ) -> dict[str, Any]:
        """Sondea el estado del run con backoff exponencial hasta que termina."""
        delay, waited = 3.0, 0.0
        while True:
            response = await self._request("GET", f"{APIFY_BASE}/actor-runs/{run_id}")
            run = dict(response.json()["data"])
            status = str(run.get("status", ""))
            if on_poll:
                on_poll(status)
            if status == TERMINAL_OK:
                return run
            if status in TERMINAL_FAIL:
                raise ApifyError(f"El run {run_id} terminó en estado {status}")
            if waited >= max_wait_seconds:
                raise ApifyError(f"El run {run_id} sigue en {status} tras {int(waited)} s; lo dejo de esperar")
            await asyncio.sleep(delay)
            waited += delay
            delay = min(delay * 1.6, 30.0)

    async def fetch_dataset(self, dataset_id: str) -> list[dict[str, Any]]:
        items: list[dict[str, Any]] = []
        offset = 0
        while True:
            response = await self._request(
                "GET",
                f"{APIFY_BASE}/datasets/{dataset_id}/items",
                params={"clean": "true", "format": "json", "offset": offset, "limit": DATASET_PAGE},
            )
            page = response.json()
            if not isinstance(page, list) or not page:
                break
            items.extend(item for item in page if isinstance(item, dict))
            if len(page) < DATASET_PAGE:
                break
            offset += DATASET_PAGE
        return items


def _find_chain_parent(
    conn: sqlite3.Connection, root: str | None, phone: str | None, exclude_id: int | None = None
) -> int | None:
    """Busca otro lead (no duplicado) del mismo grupo: mismo dominio raíz o mismo teléfono."""
    clauses, params = [], []
    if root:
        clauses.append("root_domain = ?")
        params.append(root)
    if phone:
        clauses.append("phone_e164 = ?")
        params.append(phone)
    if not clauses:
        return None
    sql = f"SELECT id FROM leads WHERE status != ? AND ({' OR '.join(clauses)})"
    args: list[Any] = [db.DUPLICATE, *params]
    if exclude_id is not None:
        sql += " AND id != ?"
        args.append(exclude_id)
    row = conn.execute(sql + " ORDER BY id LIMIT 1", args).fetchone()
    return int(row["id"]) if row else None


def persist_places(
    conn: sqlite3.Connection, campaign: CampaignConfig, items: list[dict[str, Any]], stats: ExtractStats
) -> None:
    """Guarda los negocios. Deduplica por place_id y por cadena; nunca pisa estados avanzados."""
    before = (stats.fetched, stats.inserted, stats.duplicates_chain, stats.out_of_niche)
    with db.transaction(conn):
        _persist(conn, campaign, items, stats)
        db.add_event(
            conn, None, "extraction", campaign=campaign.campaign_name, fetched=stats.fetched - before[0],
            inserted=stats.inserted - before[1], duplicates=stats.duplicates_chain - before[2],
            out_of_niche=stats.out_of_niche - before[3],
        )


def _persist(conn: sqlite3.Connection, campaign: CampaignConfig, items: list[dict[str, Any]], stats: ExtractStats) -> None:
    for item in items:
        stats.fetched += 1
        place_id = str(item.get("placeId") or "").strip()
        name = str(item.get("title") or "").strip()
        if not place_id or not name or item.get("permanentlyClosed") or item.get("temporarilyClosed"):
            stats.skipped_invalid += 1
            continue
        if not campaign.category_matches(str(item.get("categoryName") or "")):
            stats.out_of_niche += 1  # Google mezcla ferreterías, constructoras... con el nicho buscado
            continue
        country = str(item.get("countryCode") or campaign.country_code).upper()
        website = normalize_website(str(item.get("website") or ""))
        phone_raw = str(item.get("phoneUnformatted") or item.get("phone") or "").strip()
        phone = to_e164(phone_raw, country) or to_e164(phone_raw, campaign.country_code)
        root = root_domain(website)
        now = db.iso()
        descriptive = (
            name,
            str(item.get("categoryName") or "").strip(),
            str(item.get("address") or "").strip(),
            str(item.get("city") or "").strip(),
            country,
            phone_raw,
            phone,
            website,
            root,
            str(item.get("url") or "").strip(),
            item.get("totalScore") if isinstance(item.get("totalScore"), (int, float)) else None,
            item.get("reviewsCount") if isinstance(item.get("reviewsCount"), int) else None,
        )
        existing = conn.execute("SELECT id, status FROM leads WHERE place_id = ?", (place_id,)).fetchone()
        if existing is not None:
            if existing["status"] in db.PROTECTED_STATUSES or existing["status"] in (db.ENRICHED, db.READY):
                # Ya está trabajado: no se toca nada, ni datos ni estado.
                stats.protected_untouched += 1
                continue
            conn.execute(
                "UPDATE leads SET business_name=?, category=?, address=?, city=?, country_code=?, "
                "phone_raw=?, phone_e164=?, website=?, root_domain=?, maps_url=?, rating=?, "
                "reviews_count=?, updated_at=? WHERE id=?",
                (*descriptive, now, existing["id"]),
            )
            stats.refreshed += 1
            continue
        parent = _find_chain_parent(conn, root, phone)
        status = db.DUPLICATE if parent is not None else db.NEW
        cursor = conn.execute(
            "INSERT INTO leads (campaign_name, place_id, business_name, category, address, city, "
            "country_code, phone_raw, phone_e164, website, root_domain, maps_url, rating, reviews_count, "
            "status, duplicate_of, language, created_at, updated_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (campaign.campaign_name, place_id, *descriptive, status, parent, campaign.language, now, now),
        )
        if parent is not None:
            stats.duplicates_chain += 1
            db.add_event(conn, cursor.lastrowid, "duplicate_of_chain", parent=parent, root_domain=root, phone=phone)
        else:
            stats.inserted += 1


async def run_extraction(
    campaign: CampaignConfig,
    conn: sqlite3.Connection,
    on_status: Callable[[str, str], None] | None = None,
    client: ApifyClient | None = None,
) -> ExtractStats:
    """Lanza un run por ubicación, espera, descarga el dataset y lo persiste."""
    db.save_campaign(conn, campaign)
    stats = ExtractStats()
    apify = client or ApifyClient(get_settings().apify_token)
    try:
        for location in campaign.locations:
            run = await apify.start_run(build_actor_input(campaign, location))
            run_id = str(run["id"])
            log(logger, logging.INFO, "apify_run_started", campaign=campaign.campaign_name, location=location, run_id=run_id)
            if on_status:
                on_status(location, "READY")
            finished = await apify.wait_for_run(
                run_id, on_poll=(lambda status, loc=location: on_status(loc, status)) if on_status else None
            )
            items = await apify.fetch_dataset(str(finished["defaultDatasetId"]))
            before = stats.inserted
            persist_places(conn, campaign, items, stats)
            stats.runs.append({"location": location, "run_id": run_id, "items": len(items), "new": stats.inserted - before})
            log(
                logger, logging.INFO, "apify_run_persisted", campaign=campaign.campaign_name,
                location=location, run_id=run_id, items=len(items), new=stats.inserted - before,
            )
    finally:
        if client is None:
            await apify.aclose()
    return stats
