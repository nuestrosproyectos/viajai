"""Módulo 7 — Lanzador de trabajos desde el panel web.

Ejecuta en segundo plano, dentro del servidor, los mismos pasos que la línea de comandos:
extraer, buscar emails, redactar y enviar. Cada trabajo queda registrado en la tabla `jobs`.
"""
from __future__ import annotations

import asyncio
import logging
import sqlite3
from typing import Any

from core import db
from core.campaign import CampaignConfig
from core.logs import get_logger, log
from core.settings import get_settings
from modules import load

logger = get_logger("jobs")

KINDS = ("extract", "enrich", "generate", "send")
KIND_LABELS = {"extract": "Extraer de Google Maps", "enrich": "Buscar emails", "generate": "Redactar correos", "send": "Enviar correos"}
SENDING_WANTED = "sending_wanted"


class JobError(Exception):
    """El trabajo no se puede lanzar (ya hay uno igual en marcha, faltan datos...)."""


class JobRunner:
    """Un trabajo de cada tipo como máximo a la vez. Vive mientras vive el servidor."""

    def __init__(self) -> None:
        self._tasks: dict[str, asyncio.Task[None]] = {}
        self._engine: Any = None

    def is_running(self, kind: str) -> bool:
        task = self._tasks.get(kind)
        return task is not None and not task.done()

    def start(self, kind: str, campaign: CampaignConfig | None = None, limit: int | None = None) -> str:
        """Lanza el trabajo en segundo plano. Debe llamarse desde el bucle de eventos del servidor."""
        if kind not in KINDS:
            raise JobError(f"Acción desconocida: {kind}")
        if self.is_running(kind):
            raise JobError(f"«{KIND_LABELS[kind]}» ya está en marcha. Espera a que termine.")
        if kind in ("extract", "generate") and campaign is None:
            raise JobError("Elige una campaña.")
        settings = get_settings()
        if kind == "extract" and not settings.apify_token:
            raise JobError("Falta APIFY_TOKEN en la configuración.")
        if kind == "generate" and not settings.anthropic_api_key:
            raise JobError("Falta ANTHROPIC_API_KEY en la configuración.")
        if kind in ("generate", "send") and settings.missing_legal_fields():
            raise JobError("Faltan datos legales en la configuración: " + ", ".join(settings.missing_legal_fields()))
        if kind == "send":
            try:
                load("sender").load_accounts(settings.accounts_file)
            except load("sender").AccountsError as exc:
                raise JobError(str(exc)) from exc
        self._tasks[kind] = asyncio.create_task(self._run(kind, campaign, limit), name=f"job-{kind}")
        return f"«{KIND_LABELS[kind]}» en marcha."

    def stop_sender(self) -> str:
        """Para los envíos: termina el correo en curso y no manda ninguno más."""
        conn = db.connect()
        try:
            db.set_control(conn, SENDING_WANTED, "0")
        finally:
            conn.close()
        if self._engine is not None and self.is_running("send"):
            self._engine.stop.set()
            return "Envíos detenidos. Si había un correo saliendo, termina ese y para."
        return "Los envíos ya estaban parados."

    async def shutdown(self) -> None:
        if self._engine is not None:
            self._engine.stop.set()
        for task in self._tasks.values():
            if not task.done():
                task.cancel()
        await asyncio.gather(*self._tasks.values(), return_exceptions=True)

    async def _run(self, kind: str, campaign: CampaignConfig | None, limit: int | None) -> None:
        conn = db.connect()
        now = db.iso()
        with db.transaction(conn):
            cursor = conn.execute(
                "INSERT INTO jobs (kind, campaign_name, status, started_at) VALUES (?, ?, 'RUNNING', ?)",
                (kind, campaign.campaign_name if campaign else None, now),
            )
        job_id = int(cursor.lastrowid or 0)
        status, summary = "DONE", ""
        try:
            summary = await self._execute(kind, conn, campaign, limit)
        except asyncio.CancelledError:
            status, summary = "INTERRUPTED", "el servidor se detuvo"
            raise
        except Exception as exc:  # cualquier fallo queda registrado y visible en el panel
            status, summary = "FAILED", f"{exc}"[:500] or type(exc).__name__
            log(logger, logging.ERROR, "job_failed", job_id=job_id, kind=kind, error=summary)
        finally:
            with db.transaction(conn):
                conn.execute(
                    "UPDATE jobs SET status = ?, summary = ?, finished_at = ? WHERE id = ?", (status, summary, db.iso(), job_id)
                )
            conn.close()
            log(logger, logging.INFO, "job_finished", job_id=job_id, kind=kind, status=status, summary=summary)

    async def _execute(self, kind: str, conn: sqlite3.Connection, campaign: CampaignConfig | None, limit: int | None) -> str:
        if kind == "extract":
            assert campaign is not None
            stats = await load("extractor").run_extraction(campaign, conn)
            return (
                f"{stats.fetched} recibidos · {stats.inserted} nuevos · {stats.duplicates_chain} duplicados · "
                f"{stats.out_of_niche} fuera de nicho"
            )
        if kind == "enrich":
            stats = await load("enricher").run_enrichment(
                conn, retry_errors=True, campaign_name=campaign.campaign_name if campaign else None
            )
            return f"{stats.total} webs · {stats.enriched} con email · {stats.no_corporate_email} sin email · {stats.errors} con error"
        if kind == "generate":
            assert campaign is not None
            stats = await load("copywriter").run_generation(conn, campaign, limit=limit, retry_errors=True)
            cost = f" · {stats.cost_usd:.3f} $" if stats.cost_usd is not None else ""
            return f"{stats.generated} redactados · {stats.failed} fallidos · {stats.skipped_suppressed} omitidos por supresión{cost}"
        sender = load("sender")
        engine = sender.SenderEngine(conn, sender.load_accounts(get_settings().accounts_file))
        self._engine = engine
        db.set_control(conn, SENDING_WANTED, "1")
        totals = {"sent": 0, "failed": 0, "replies": 0, "bounces": 0}

        def on_pass(report: Any) -> None:
            for key in totals:
                totals[key] += int(getattr(report, key))

        await engine.run(live=True, once=False, on_pass=on_pass)
        return f"{totals['sent']} enviados · {totals['failed']} fallidos · {totals['replies']} respuestas · {totals['bounces']} rebotes"


def mark_interrupted_jobs(conn: sqlite3.Connection) -> None:
    """Al arrancar el servidor: lo que constaba «en marcha» se interrumpió con el reinicio."""
    with db.transaction(conn):
        conn.execute(
            "UPDATE jobs SET status = 'INTERRUPTED', summary = 'el servidor se reinició', finished_at = ? WHERE status = 'RUNNING'",
            (db.iso(),),
        )
