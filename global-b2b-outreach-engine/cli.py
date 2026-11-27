"""global-b2b-outreach-engine — interfaz de línea de comandos.

    python cli.py extract  --campaign campaigns/example_campaign.json
    python cli.py enrich   --concurrency 15 [--retry-errors]
    python cli.py generate --campaign colaboradores_espana_test --limit 20 [--dry-run]
    python cli.py send     --dry-run | --live
    python cli.py stats
"""
from __future__ import annotations

import asyncio
import contextlib
import signal
import sqlite3
import sys
from pathlib import Path
from typing import Any, Optional

sys.path.insert(0, str(Path(__file__).resolve().parent))

import typer
from rich.console import Console
from rich.panel import Panel
from rich.progress import BarColumn, MofNCompleteColumn, Progress, SpinnerColumn, TextColumn, TimeElapsedColumn
from rich.table import Table

from core import db
from core.campaign import CampaignConfig, CampaignError, load_campaign
from core.logs import configure_logging
from core.settings import get_settings
from modules import load

app = typer.Typer(add_completion=False, no_args_is_help=True, help="Captación B2B desde Google Maps con opt-in por WhatsApp.")
console = Console()


def _fail(message: str) -> typer.Exit:
    console.print(Panel(message, title="No se puede continuar", border_style="red"))
    return typer.Exit(code=1)


def _campaign(reference: str) -> CampaignConfig:
    try:
        return load_campaign(reference)
    except CampaignError as exc:
        raise _fail(str(exc)) from exc


def _setup() -> None:
    try:
        configure_logging(get_settings().log_level)
    except ValueError as exc:
        raise _fail(str(exc)) from exc


def _progress() -> Progress:
    return Progress(
        SpinnerColumn(), TextColumn("[bold]{task.description}"), BarColumn(), MofNCompleteColumn(),
        TimeElapsedColumn(), console=console,
    )


@app.command()
def extract(
    campaign: str = typer.Option(..., "--campaign", "-c", help="Ruta al JSON de la campaña o su campaign_name."),
) -> None:
    """Extrae negocios de Google Maps (Apify) y los guarda sin duplicados."""
    _setup()
    config = _campaign(campaign)
    extractor = load("extractor")
    places = len(config.search_terms) * len(config.locations) * config.max_places_per_search
    console.print(Panel(
        f"Campaña [bold]{config.campaign_name}[/bold] · {len(config.search_terms)} búsquedas × {len(config.locations)} ubicaciones\n"
        f"Máximo teórico: {places} negocios · coste Apify aprox. {places * 0.004:.2f} $ (0,003 $/negocio + 0,001 $ por filtrar cerrados)",
        title="Extracción", border_style="cyan",
    ))
    with db.open_db() as conn, console.status("Lanzando Apify…") as status:
        try:
            stats = asyncio.run(extractor.run_extraction(
                config, conn, on_status=lambda location, state: status.update(f"{location}: {state}")
            ))
        except extractor.ApifyError as exc:
            raise _fail(str(exc)) from exc
    table = Table(title="Resultado de la extracción")
    table.add_column("Concepto")
    table.add_column("Cantidad", justify="right")
    for label, value in (
        ("Negocios recibidos de Apify", stats.fetched),
        ("Leads nuevos", stats.inserted),
        ("Duplicados de cadena (mismo dominio o teléfono)", stats.duplicates_chain),
        ("Ya existían: datos refrescados", stats.refreshed),
        ("Ya existían en estado avanzado: intactos", stats.protected_untouched),
        ("Descartados (cerrados o sin datos)", stats.skipped_invalid),
    ):
        table.add_row(label, str(value))
    console.print(table)


@app.command()
def enrich(
    concurrency: int = typer.Option(15, "--concurrency", min=1, max=50, help="Webs rastreadas en paralelo."),
    retry_errors: bool = typer.Option(False, "--retry-errors", help="Reintenta los leads en ERROR cuyo plazo de espera ha vencido."),
    campaign: Optional[str] = typer.Option(None, "--campaign", "-c", help="Limita el enriquecido a una campaña."),
    limit: Optional[int] = typer.Option(None, "--limit", min=1, help="Número máximo de leads a procesar."),
) -> None:
    """Rastrea las webs y busca un email corporativo válido con su URL de origen."""
    _setup()
    enricher = load("enricher")
    name = _campaign(campaign).campaign_name if campaign else None
    strict = get_settings().strict_b2b_only
    with db.open_db() as conn, _progress() as progress:
        task = progress.add_task("Enriqueciendo webs", total=None)

        def advance(_status: str) -> None:
            progress.advance(task)

        pending = conn.execute(
            "SELECT COUNT(*) FROM leads WHERE status = ?" + (" AND campaign_name = ?" if name else ""),
            (db.NEW, name) if name else (db.NEW,),
        ).fetchone()[0]
        progress.update(task, total=min(pending, limit) if limit else pending or None)
        try:
            stats = asyncio.run(enricher.run_enrichment(
                conn, concurrency=concurrency, retry_errors=retry_errors, campaign_name=name, limit=limit, on_progress=advance,
            ))
        except enricher.DnsUnavailable as exc:
            progress.stop()
            raise _fail(str(exc)) from exc
        progress.update(task, total=stats.total, completed=stats.total)
    table = Table(title=f"Enriquecido ({'solo emails corporativos' if strict else 'se admiten emails gratuitos'})")
    table.add_column("Estado")
    table.add_column("Leads", justify="right")
    table.add_row("Procesados", str(stats.total))
    table.add_row("[green]ENRICHED[/green] (email corporativo válido)", str(stats.enriched))
    table.add_row("NO_CORPORATE_EMAIL", str(stats.no_corporate_email))
    table.add_row("[red]ERROR[/red] (se reintentará con --retry-errors)", str(stats.errors))
    console.print(table)


@app.command()
def generate(
    campaign: str = typer.Option(..., "--campaign", "-c", help="Ruta al JSON de la campaña o su campaign_name."),
    limit: Optional[int] = typer.Option(None, "--limit", min=1, help="Número máximo de leads a redactar."),
    retry_errors: bool = typer.Option(False, "--retry-errors", help="Incluye los leads cuya redacción falló antes."),
    dry_run: bool = typer.Option(False, "--dry-run", help="Solo estima llamadas y coste; no llama a la API."),
) -> None:
    """Redacta la secuencia de cada lead (asunto, primer correo y dos seguimientos)."""
    _setup()
    config = _campaign(campaign)
    copywriter = load("copywriter")
    settings = get_settings()
    with db.open_db() as conn:
        try:
            if dry_run:
                plan = copywriter.estimate(conn, config, limit, retry_errors)
                cost = f"{plan.cost_usd:.4f} $" if plan.cost_usd is not None else "desconocido (modelo sin precio en la tabla)"
                missing = settings.missing_legal_fields()
                console.print(Panel(
                    f"Leads a redactar: [bold]{plan.leads}[/bold]\n"
                    f"Modelo: {plan.model}\n"
                    f"Llamadas estimadas: {plan.calls} (incluye ~15 % de reintentos)\n"
                    f"Tokens estimados: {plan.input_tokens:,} de entrada · {plan.output_tokens:,} de salida\n"
                    f"Coste aproximado: [bold]{cost}[/bold]"
                    + (f"\n[red]Faltan en .env: {', '.join(missing)}[/red]" if missing else "")
                    + ("" if settings.anthropic_api_key else "\n[red]Falta ANTHROPIC_API_KEY en .env[/red]"),
                    title="Simulación: no se ha llamado a la API", border_style="yellow",
                ))
                return
            with _progress() as progress:
                total = len(copywriter.select_candidates(conn, config, limit, retry_errors))
                task = progress.add_task("Redactando correos", total=total or None)
                stats = asyncio.run(copywriter.run_generation(
                    conn, config, limit=limit, retry_errors=retry_errors, on_progress=lambda _ok: progress.advance(task),
                ))
        except copywriter.FatalCopyError as exc:
            raise _fail(str(exc)) from exc
    table = Table(title=f"Redacción · {config.campaign_name}")
    table.add_column("Concepto")
    table.add_column("Valor", justify="right")
    table.add_row("Leads candidatos", str(stats.candidates))
    table.add_row("[green]Listos para enviar[/green]", str(stats.generated))
    table.add_row("[red]Fallidos[/red] (reintenta con --retry-errors)", str(stats.failed))
    table.add_row("Omitidos por lista de supresión", str(stats.skipped_suppressed))
    table.add_row("Llamadas a la API", str(stats.usage.calls))
    table.add_row("Tokens entrada / salida", f"{stats.usage.input_tokens:,} / {stats.usage.output_tokens:,}")
    table.add_row("Coste real aproximado", f"{stats.cost_usd:.4f} $" if stats.cost_usd is not None else "-")
    console.print(table)
    for error in stats.errors[:10]:
        console.print(f"[red]·[/red] {error}")


def _print_pass(report: Any, live: bool) -> None:
    labels = {"send": "[green]se enviaría[/green]", "sent": "[green]enviado[/green]", "wait": "[yellow]en espera[/yellow]",
              "cancelled": "[red]cancelado[/red]", "failed": "[red]fallido[/red]"}
    if report.items:
        table = Table(title="Envíos de esta pasada" if live else "Simulación: qué se enviaría ahora mismo")
        for column in ("Lead", "Negocio", "Email", "Paso", "Cuenta", "Decisión", "Motivo"):
            table.add_column(column, overflow="fold")
        for item in report.items[:200]:
            table.add_row(str(item.lead_id), item.business_name, item.email, item.step, item.account, labels.get(item.decision, item.decision), item.reason)
        console.print(table)
    would_send = sum(1 for item in report.items if item.decision == "send")
    summary = (
        f"Enviados: {report.sent} · en espera: {report.waiting} · cancelados: {report.cancelled} · fallidos: {report.failed} · "
        f"respuestas: {report.replies} · rebotes: {report.bounces}"
        if live else
        f"Se enviarían ahora: {would_send} · en espera: {report.waiting} · se cancelarían por cumplimiento: {report.cancelled}"
    )
    if report.paused_accounts:
        summary += f"\n[red]Cuentas pausadas: {', '.join(report.paused_accounts)}[/red] (reactívalas con: python cli.py accounts --resume EMAIL)"
    console.print(Panel(summary, border_style="green" if live else "yellow"))


@app.command()
def send(
    dry_run: bool = typer.Option(False, "--dry-run", help="Muestra qué se enviaría ahora, sin enviar ni modificar nada."),
    live: bool = typer.Option(False, "--live", help="Envía de verdad. Se queda en marcha como servicio."),
    once: bool = typer.Option(False, "--once", help="Con --live: hace una sola pasada y termina."),
) -> None:
    """Motor de envío: rotación de cuentas, horario local, supresión, IMAP y cortafuegos."""
    _setup()
    if dry_run and live:
        raise _fail("Elige una sola opción: --dry-run o --live.")
    if not live:
        dry_run = True
    sender = load("sender")
    settings = get_settings()
    try:
        accounts = sender.load_accounts(settings.accounts_file)
    except sender.AccountsError as exc:
        raise _fail(str(exc)) from exc
    if live and settings.missing_legal_fields():
        raise _fail("Faltan datos legales en .env: " + ", ".join(settings.missing_legal_fields()))

    with db.open_db() as conn:
        engine = sender.SenderEngine(
            conn, accounts, settings,
            on_alert=lambda title, detail: console.print(Panel(detail, title=f"ALERTA · {title}", border_style="red")),
        )

        async def main() -> None:
            loop = asyncio.get_running_loop()
            for signum in (signal.SIGINT, signal.SIGTERM):
                with contextlib.suppress(NotImplementedError):  # Windows no admite señales en asyncio
                    loop.add_signal_handler(signum, engine.stop.set)
            await engine.run(live=live, once=once or dry_run, on_pass=lambda report: _print_pass(report, live) if (report.items or dry_run or once) else None)

        if live:
            console.print(Panel(
                f"{len(accounts)} cuenta(s) · pausa aleatoria de {settings.jitter_min}-{settings.jitter_max} s entre envíos · "
                f"revisión IMAP cada {settings.imap_check_interval} s\nCtrl+C para detener.",
                title="Envío REAL en marcha", border_style="green",
            ))
        asyncio.run(main())


def _stats_rows(conn: sqlite3.Connection, campaign: str | None) -> dict[str, int]:
    where, params = ("WHERE campaign_name = ?", (campaign,)) if campaign else ("", ())
    lead_counts = {row["status"]: row["n"] for row in conn.execute(f"SELECT status, COUNT(*) AS n FROM leads {where} GROUP BY status", params)}
    one = lambda sql: int(conn.execute(sql, params).fetchone()[0])  # noqa: E731
    and_or_where = "AND" if campaign else "WHERE"
    result = {
        "extraidos": sum(lead_counts.values()),
        "duplicados": lead_counts.get(db.DUPLICATE, 0),
        "emails_validos": one(f"SELECT COUNT(*) FROM leads {where} {and_or_where} email IS NOT NULL"),
        "sin_email": lead_counts.get(db.NO_CORPORATE_EMAIL, 0),
        "errores": lead_counts.get(db.ERROR, 0),
        "preparados": one(f"SELECT COUNT(*) FROM leads {where} {and_or_where} subject IS NOT NULL"),
        "bajas": lead_counts.get(db.UNSUBSCRIBED, 0),
        "rebotes": lead_counts.get(db.BOUNCED, 0),
    }
    # Bajas, rebotes, respuestas y conversiones se cuentan por lo que ocurrió (tabla de eventos), no por el
    # estado final: un lead que escribió por WhatsApp y luego se dio de baja cuenta en las dos métricas.
    join = "JOIN leads l ON l.id = e.lead_id" + (" AND l.campaign_name = ?" if campaign else "")
    for key, event_types in (("whatsapp", ("whatsapp_inbound",)), ("respuestas", ("reply",))):
        marks = ",".join("?" for _ in event_types)
        result[key] = int(conn.execute(
            f"SELECT COUNT(DISTINCT e.lead_id) FROM events e {join} WHERE e.type IN ({marks})", (*params, *event_types)
        ).fetchone()[0])
    for step in db.STEPS:
        result[step] = int(conn.execute(
            f"SELECT COUNT(*) FROM outbox {where} {and_or_where} step = ? AND status = ?", (*params, step, db.OUT_SENT)
        ).fetchone()[0])
    result["pendientes"] = int(conn.execute(
        f"SELECT COUNT(*) FROM outbox {where} {and_or_where} status = ? AND scheduled_at IS NOT NULL", (*params, db.OUT_PENDING)
    ).fetchone()[0])
    result["fallidos"] = int(conn.execute(
        f"SELECT COUNT(*) FROM outbox {where} {and_or_where} status IN (?, ?)", (*params, db.OUT_FAILED, db.OUT_SENDING)
    ).fetchone()[0])
    return result


@app.command()
def stats(
    campaign: Optional[str] = typer.Option(None, "--campaign", "-c", help="Muestra solo esta campaña."),
) -> None:
    """Métricas globales y por campaña de todo el embudo."""
    _setup()
    with db.open_db() as conn:
        names = [row["campaign_name"] for row in conn.execute("SELECT DISTINCT campaign_name FROM leads ORDER BY 1")]
        if campaign:
            wanted = _campaign(campaign).campaign_name
            names = [name for name in names if name == wanted]
        columns: list[tuple[str, dict[str, int]]] = []
        if not campaign:
            columns.append(("GLOBAL", _stats_rows(conn, None)))
        columns += [(name, _stats_rows(conn, name)) for name in names]
        suppressed = conn.execute("SELECT COUNT(*) FROM suppression_list").fetchone()[0]
    if not columns or columns[0][1]["extraidos"] == 0:
        console.print(Panel("Todavía no hay leads. Empieza con: python cli.py extract --campaign campaigns/example_campaign.json", border_style="yellow"))
        return
    table = Table(title="Embudo de captación")
    table.add_column("Métrica")
    for name, _ in columns:
        table.add_column(name, justify="right")
    rows = (
        ("Extraídos de Google Maps", "extraidos"), ("  de ellos, duplicados de cadena", "duplicados"),
        ("Emails corporativos válidos", "emails_validos"), ("Sin email corporativo", "sin_email"),
        ("Errores de rastreo pendientes", "errores"), ("Preparados (correos redactados)", "preparados"),
        ("Enviados · email_1", "email_1"), ("Enviados · followup_1", "followup_1"), ("Enviados · followup_2", "followup_2"),
        ("Envíos programados pendientes", "pendientes"), ("Envíos fallidos o interrumpidos", "fallidos"),
        ("Respuestas por email", "respuestas"), ("Bajas", "bajas"), ("Rebotes", "rebotes"),
        ("[bold green]Conversiones a WhatsApp[/bold green]", "whatsapp"),
    )
    for label, key in rows:
        table.add_row(label, *(str(data[key]) for _, data in columns))
    table.add_row(
        "Conversión a WhatsApp sobre contactados",
        *(f"{data['whatsapp'] / data['email_1'] * 100:.1f} %" if data["email_1"] else "-" for _, data in columns),
    )
    console.print(table)
    console.print(f"Lista de supresión: {suppressed} entradas (emails y dominios que no se volverán a contactar).")


@app.command()
def accounts(
    resume: Optional[str] = typer.Option(None, "--resume", help="Reactiva una cuenta pausada por el cortafuegos."),
) -> None:
    """Estado de las cuentas de envío: uso de hoy, límite y pausas."""
    _setup()
    sender = load("sender")
    try:
        loaded = sender.load_accounts(get_settings().accounts_file)
    except sender.AccountsError as exc:
        raise _fail(str(exc)) from exc
    with db.open_db() as conn:
        if resume:
            done = sender.resume_account(conn, resume)
            console.print(f"[green]Cuenta {resume} reactivada.[/green]" if done else f"[yellow]{resume} no estaba pausada.[/yellow]")
        overview = sender.account_overview(conn, loaded)
    table = Table(title="Cuentas de envío")
    for column in ("Cuenta", "Enviados hoy", "Límite diario", "IMAP", "Estado"):
        table.add_column(column)
    for row in overview:
        state = f"[red]PAUSADA[/red] · {row['pause_reason']}" if row["paused"] else "[green]activa[/green]"
        table.add_row(row["email"], str(row["sent_today"]), str(row["daily_limit"]), "sí" if row["imap"] else "no", state)
    console.print(table)


@app.command()
def serve(
    host: str = typer.Option("127.0.0.1", "--host"),
    port: int = typer.Option(8080, "--port", min=1, max=65535),
) -> None:
    """Arranca el servidor de bajas y del webhook de WhatsApp."""
    import uvicorn

    uvicorn.run(load("server").app, host=host, port=port, log_level="warning", proxy_headers=True)


if __name__ == "__main__":
    app()
