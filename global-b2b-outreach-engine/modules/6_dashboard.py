"""Módulo 6 — Panel web de solo lectura: el embudo, la cola de envío y el estado de las cuentas.

Se sirve en `GET /panel?key=<DASHBOARD_TOKEN>` (servidor del módulo 4) o se exporta a un fichero
con `python cli.py dashboard --out panel.html`. Todo sale de la base de datos; no modifica nada.
"""
from __future__ import annotations

import html
import json
import sqlite3
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
from zoneinfo import ZoneInfo

from core import db
from core.logs import get_logger
from core.settings import get_settings
from modules import load

logger = get_logger("dashboard")

STATUS_LABELS: dict[str, tuple[str, str]] = {
    db.NEW: ("Pendiente de rastrear", "neutral"),
    db.DUPLICATE: ("Duplicado", "neutral"),
    db.ENRICHED: ("Pendiente de redactar", "info"),
    db.NO_CORPORATE_EMAIL: ("Sin email corporativo", "neutral"),
    db.ERROR: ("Error de rastreo", "warn"),
    db.READY: ("Listo para enviar", "info"),
    db.CONTACTED: ("Contactado", "good"),
    db.CONVERTED_TO_WA: ("Escribió por WhatsApp", "good"),
    db.REPLIED: ("Respondió", "good"),
    db.UNSUBSCRIBED: ("Baja", "bad"),
    db.BOUNCED: ("Rebotado", "bad"),
}
STEP_LABELS = {"email_1": "Primer correo", "followup_1": "Seguimiento 1", "followup_2": "Cierre"}
EVENT_LABELS = {
    "extraction": "Extracción de Google Maps",
    "duplicate_of_chain": "Duplicado de cadena detectado",
    "copy_generated": "Correos redactados",
    "email_sent": "Correo enviado",
    "send_failed": "Envío fallido",
    "send_cancelled": "Envío cancelado",
    "unsubscribed": "Baja",
    "whatsapp_inbound": "Mensaje de WhatsApp recibido",
    "reply": "Respuesta por correo",
    "bounce": "Rebote",
    "account_paused": "Cuenta pausada",
    "account_resumed": "Cuenta reactivada",
}


@dataclass
class DashboardData:
    generated_at: str
    funnel: list[tuple[str, int]]
    kpis: list[tuple[str, str, str]]
    campaigns: list[dict[str, Any]]
    queue: list[dict[str, Any]]
    leads: list[dict[str, Any]]
    accounts: list[dict[str, Any]]
    accounts_note: str
    events: list[dict[str, Any]]
    sample: dict[str, str] | None
    checklist: list[tuple[bool, str]]
    last_extraction: dict[str, Any] = field(default_factory=dict)


def _count(conn: sqlite3.Connection, sql: str, params: tuple[Any, ...] = ()) -> int:
    return int(conn.execute(sql, params).fetchone()[0])


def _local(value: str | None, tz: ZoneInfo) -> str:
    if not value:
        return "-"
    return db.parse_iso(value).astimezone(tz).strftime("%d-%m %H:%M")


def collect(conn: sqlite3.Connection) -> DashboardData:
    """Lee de la base de datos todo lo que muestra el panel."""
    settings = get_settings()
    tz = ZoneInfo("Europe/Madrid")
    statuses = {row["status"]: int(row["n"]) for row in conn.execute("SELECT status, COUNT(*) AS n FROM leads GROUP BY status")}
    total = sum(statuses.values())
    duplicates = statuses.get(db.DUPLICATE, 0)
    with_email = _count(conn, "SELECT COUNT(*) FROM leads WHERE email IS NOT NULL")
    drafted = _count(conn, "SELECT COUNT(*) FROM leads WHERE subject IS NOT NULL")
    sent = {
        step: _count(conn, "SELECT COUNT(*) FROM outbox WHERE step = ? AND status = ?", (step, db.OUT_SENT))
        for step in db.STEPS
    }
    pending = _count(conn, "SELECT COUNT(*) FROM outbox WHERE status = ? AND scheduled_at IS NOT NULL", (db.OUT_PENDING,))
    replies = _count(conn, "SELECT COUNT(DISTINCT lead_id) FROM events WHERE type = 'reply'")
    whatsapp = _count(conn, "SELECT COUNT(DISTINCT lead_id) FROM events WHERE type = 'whatsapp_inbound'")
    unsubscribed = statuses.get(db.UNSUBSCRIBED, 0)
    bounced = statuses.get(db.BOUNCED, 0)
    suppressed = _count(conn, "SELECT COUNT(*) FROM suppression_list")

    last_extraction: dict[str, Any] = {}
    row = conn.execute("SELECT payload, created_at FROM events WHERE type = 'extraction' ORDER BY id DESC LIMIT 1").fetchone()
    if row:
        last_extraction = {**json.loads(row["payload"]), "when": _local(row["created_at"], tz)}

    extraction_note = (
        f"última extracción: {last_extraction.get('fetched', 0)} recibidos, {last_extraction.get('out_of_niche', 0)} fuera de nicho"
        if last_extraction else "sin extracciones registradas"
    )
    kpis = [
        ("Negocios guardados", str(total), f"{duplicates} {'duplicado' if duplicates == 1 else 'duplicados'} de cadena · {extraction_note}"),
        ("Con email corporativo", str(with_email), f"{statuses.get(db.NO_CORPORATE_EMAIL, 0)} sin email · {statuses.get(db.ERROR, 0)} con error de rastreo"),
        ("Correos redactados", str(drafted), f"{statuses.get(db.ENRICHED, 0)} pendientes de redactar"),
        ("Primeros correos enviados", str(sent["email_1"]), f"{pending} envíos programados en cola"),
        ("Bajas y rebotes", str(unsubscribed + bounced), f"{suppressed} entradas en la lista de supresión"),
        ("Conversaciones por WhatsApp", str(whatsapp), (f"{whatsapp / sent['email_1'] * 100:.1f} % de los contactados" if sent["email_1"] else "aún no se ha enviado nada")),
    ]
    funnel = [
        ("Negocios guardados", total),
        ("Válidos, sin duplicados", total - duplicates),
        ("Con email corporativo", with_email),
        ("Correos redactados", drafted),
        ("Primer correo enviado", sent["email_1"]),
        ("Seguimiento 1 enviado", sent["followup_1"]),
        ("Cierre enviado", sent["followup_2"]),
        ("Responden por correo", replies),
        ("Escriben por WhatsApp", whatsapp),
    ]

    campaigns = []
    for row in conn.execute("SELECT campaign_name, COUNT(*) AS n, SUM(email IS NOT NULL) AS emails, SUM(subject IS NOT NULL) AS drafted FROM leads GROUP BY campaign_name ORDER BY 1"):
        name = str(row["campaign_name"])
        config = db.get_campaign(conn, name)
        campaigns.append({
            "name": name,
            "where": f"{config.niche_label} · {config.city_label}" if config else "-",
            "window": f"{config.business_hours_start}–{config.business_hours_end} ({config.timezone})" if config else "-",
            "leads": int(row["n"]),
            "emails": int(row["emails"] or 0),
            "drafted": int(row["drafted"] or 0),
            "sent": _count(conn, "SELECT COUNT(*) FROM outbox WHERE campaign_name = ? AND status = ?", (name, db.OUT_SENT)),
            "whatsapp": _count(conn, "SELECT COUNT(DISTINCT e.lead_id) FROM events e JOIN leads l ON l.id = e.lead_id WHERE e.type = 'whatsapp_inbound' AND l.campaign_name = ?", (name,)),
        })

    queue = [
        {"business": row["business_name"], "email": row["email"], "step": STEP_LABELS.get(row["step"], row["step"]), "when": _local(row["scheduled_at"], tz)}
        for row in conn.execute(
            "SELECT l.business_name, l.email, o.step, o.scheduled_at FROM outbox o JOIN leads l ON l.id = o.lead_id "
            "WHERE o.status = ? AND o.scheduled_at IS NOT NULL ORDER BY o.scheduled_at, o.id LIMIT 12", (db.OUT_PENDING,),
        )
    ]
    leads = [
        {
            "business": row["business_name"], "email": row["email"], "type": "Genérico" if row["email_type"] == "generic" else "Con nombre",
            "source": row["source_url"] or "", "status": row["status"], "form": bool(row["has_contact_form"]), "wa": bool(row["has_whatsapp_link"]),
        }
        for row in conn.execute("SELECT * FROM leads WHERE email IS NOT NULL ORDER BY updated_at DESC, id LIMIT 60")
    ]
    events = [
        {"when": _local(row["created_at"], tz), "what": EVENT_LABELS.get(row["type"], row["type"]), "who": row["business_name"] or ""}
        for row in conn.execute(
            "SELECT e.type, e.created_at, l.business_name FROM events e LEFT JOIN leads l ON l.id = e.lead_id ORDER BY e.id DESC LIMIT 10"
        )
    ]

    sender = load("sender")
    accounts: list[dict[str, Any]] = []
    accounts_note = ""
    try:
        accounts = sender.account_overview(conn, sender.load_accounts(settings.accounts_file))
    except sender.AccountsError:
        accounts_note = "Todavía no hay buzones configurados (falta accounts.json)."

    sample = None
    row = conn.execute("SELECT business_name, email, subject, body_email_1 FROM leads WHERE body_email_1 IS NOT NULL ORDER BY id LIMIT 1").fetchone()
    if row:
        sample = {"business": row["business_name"], "email": row["email"], "subject": row["subject"], "body": row["body_email_1"]}

    checklist = [
        (total > 0, "Extracción de Google Maps hecha"),
        (with_email > 0, "Emails corporativos encontrados"),
        (not settings.missing_legal_fields(), "Datos legales de la empresa en la configuración"),
        (bool(settings.anthropic_api_key), "Clave de la IA para redactar"),
        (bool(accounts), "Buzones de envío configurados"),
        (bool(settings.public_base_url), "Servidor de bajas publicado"),
    ]
    return DashboardData(
        generated_at=datetime.now(tz).strftime("%d-%m-%Y %H:%M"), funnel=funnel, kpis=kpis, campaigns=campaigns, queue=queue,
        leads=leads, accounts=accounts, accounts_note=accounts_note, events=events, sample=sample, checklist=checklist,
        last_extraction=last_extraction,
    )


_CSS = """
/* Panel de operación: resumen arriba, embudo y cola a la vista, detalle en tablas. */
:root{--bg:#F5F6F4;--surface:#FFFFFF;--fg:#191C1B;--muted:#59605D;--line:#DFE2DE;--accent:#0B5C4F;--accent-soft:#E1F0EB;
--warn:#7A4A12;--warn-soft:#F4E9DA;--bad:#8C2B22;--bad-soft:#F6E3E0;--info:#1F4E79;--info-soft:#E2ECF5;--track:#E9ECE8;
--display:'Space Grotesk',Inter,system-ui,sans-serif;--body:Inter,system-ui,-apple-system,'Segoe UI',sans-serif}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#121514;--surface:#1B1F1E;--fg:#ECEFED;--muted:#A3ABA7;--line:#2E3432;--accent:#5CC4AE;--accent-soft:#17332D;
--warn:#E8B872;--warn-soft:#3A2C17;--bad:#F0998F;--bad-soft:#3B1F1C;--info:#8FBDE8;--info-soft:#1B2D3F;--track:#2A302E;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#121514;--surface:#1B1F1E;--fg:#ECEFED;--muted:#A3ABA7;--line:#2E3432;--accent:#5CC4AE;--accent-soft:#17332D;
--warn:#E8B872;--warn-soft:#3A2C17;--bad:#F0998F;--bad-soft:#3B1F1C;--info:#8FBDE8;--info-soft:#1B2D3F;--track:#2A302E;color-scheme:dark}
body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--body);font-size:15px;line-height:1.5}
.wrap{max-width:1240px;margin:0 auto;padding-block:28px 56px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:22px}
h1,h2{font-family:var(--display);font-weight:600;margin:0;text-wrap:balance}
h1{font-size:26px;letter-spacing:-0.01em}h2{font-size:18px}
.top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:12px}
.muted{color:var(--muted)}.small{font-size:13px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(185px,1fr));gap:12px}
.kpi{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:16px 18px;display:flex;flex-direction:column;gap:4px;min-width:0}
.kpi b{font-family:var(--display);font-size:32px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.15}
.cols{display:flex;flex-wrap:wrap;gap:18px;align-items:flex-start}
.main{flex:999 1 560px;min-width:0;display:flex;flex-direction:column;gap:18px}
.side{flex:1 1 320px;min-width:0;display:flex;flex-direction:column;gap:18px}
.panel{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:20px 22px;display:flex;flex-direction:column;gap:14px;min-width:0}
.bar{display:flex;flex-direction:column;gap:5px}.bar div:first-child{display:flex;justify-content:space-between;gap:12px;font-size:14px}
.bar b{font-variant-numeric:tabular-nums}.track{height:8px;border-radius:4px;background:var(--track)}.fill{height:8px;border-radius:4px;background:var(--accent)}
.scroll{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:14px}
th{text-align:left;font-weight:500;color:var(--muted);padding:8px 12px 8px 0;border-bottom:1px solid var(--line);white-space:nowrap}
td{padding:11px 12px 11px 0;border-bottom:1px solid var(--line);vertical-align:top}td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
.pill{display:inline-block;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap}
.good{background:var(--accent-soft);color:var(--accent)}.warn{background:var(--warn-soft);color:var(--warn)}.bad{background:var(--bad-soft);color:var(--bad)}
.info{background:var(--info-soft);color:var(--info)}.neutral{background:var(--track);color:var(--muted)}
.check{display:flex;gap:10px;align-items:flex-start;font-size:14px}
.mail{border:1px solid var(--line);border-radius:8px;overflow:hidden}.mail header{background:var(--bg);padding:12px 16px;font-size:14px;border-bottom:1px solid var(--line)}
.mail pre{margin:0;padding:16px;white-space:pre-wrap;overflow-wrap:anywhere;font-family:var(--body);font-size:14px;line-height:1.6}
a{color:var(--accent)}a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.empty{color:var(--muted);font-size:14px;margin:0}
"""


def _e(value: Any) -> str:
    return html.escape(str(value if value is not None else ""))


def _link(url: str) -> str:
    if not url.startswith(("http://", "https://")):
        return _e(url) or "-"
    label = url.split("://", 1)[1].split("?", 1)[0].rstrip("/")
    return f'<a href="{_e(url)}" rel="noopener noreferrer">{_e(label[:30])}</a>'


def render(data: DashboardData, standalone: bool = True, refresh_seconds: int = 0) -> str:
    """Devuelve el HTML del panel. `standalone=False` omite doctype/head/body (para incrustarlo)."""
    top = max((value for _, value in data.funnel), default=0) or 1
    parts: list[str] = []
    add = parts.append
    add('<div class="wrap">')
    add(f'<div class="top"><div><h1>Captación B2B</h1><div class="muted">Embudo de Google Maps a WhatsApp · todas las campañas</div></div>'
        f'<div class="muted small">Datos de la base de datos a las {_e(data.generated_at)} (hora de Madrid)</div></div>')

    add('<section class="kpis" aria-label="Resumen">')
    for label, value, note in data.kpis:
        add(f'<div class="kpi"><span class="muted small">{_e(label)}</span><b>{_e(value)}</b><span class="muted small">{_e(note)}</span></div>')
    add("</section>")

    add('<div class="cols"><div class="main">')

    add('<section class="panel"><h2>Cola de envío</h2>')
    if data.queue:
        add('<div class="scroll"><table><thead><tr><th>Negocio</th><th>Email</th><th>Paso</th><th>Programado</th></tr></thead><tbody>')
        for item in data.queue:
            add(f"<tr><td><strong>{_e(item['business'])}</strong></td><td>{_e(item['email'])}</td><td>{_e(item['step'])}</td><td>{_e(item['when'])}</td></tr>")
        add("</tbody></table></div>")
    else:
        add('<p class="empty">No hay envíos programados. Aparecerán aquí en cuanto se redacten los correos (comando <code>generate</code>).</p>')
    add("</section>")

    add('<section class="panel"><h2>Leads con email corporativo</h2>')
    if data.leads:
        add('<div class="scroll"><table><thead><tr><th>Negocio</th><th>Email</th><th>Buzón</th><th>Encontrado en</th><th>Su web tiene</th><th>Estado</th></tr></thead><tbody>')
        for lead in data.leads:
            label, tone = STATUS_LABELS.get(lead["status"], (lead["status"], "neutral"))
            extras = " · ".join(name for flag, name in ((lead["form"], "formulario"), (lead["wa"], "WhatsApp")) if flag) or "-"
            add(f"<tr><td><strong>{_e(lead['business'])}</strong></td><td style=\"overflow-wrap:anywhere\">{_e(lead['email'])}</td><td>{_e(lead['type'])}</td>"
                f"<td>{_link(lead['source'])}</td><td>{_e(extras)}</td><td><span class=\"pill {tone}\">{_e(label)}</span></td></tr>")
        add("</tbody></table></div>")
    else:
        add('<p class="empty">Todavía no hay leads con email. Ejecuta <code>extract</code> y <code>enrich</code>.</p>')
    add("</section>")

    add('<section class="panel"><h2>Ejemplo de correo que sale</h2>')
    if data.sample:
        add(f'<div class="mail"><header><div><span class="muted">Para:</span> {_e(data.sample["email"])} ({_e(data.sample["business"])})</div>'
            f'<div><span class="muted">Asunto:</span> <strong>{_e(data.sample["subject"])}</strong></div></header><pre>{_e(data.sample["body"])}</pre></div>')
    else:
        add('<p class="empty">Aún no se ha redactado ningún correo. Cuando la IA redacte el primero, aquí se verá tal cual le llegará al negocio, con el enlace de WhatsApp y el pie legal.</p>')
    add("</section>")

    add('<section class="panel"><h2>Campañas</h2>')
    if data.campaigns:
        add('<div class="scroll"><table><thead><tr><th>Campaña</th><th>Nicho y zona</th><th>Horario de envío</th><th class="num">Leads</th><th class="num">Con email</th><th class="num">Redactados</th><th class="num">Enviados</th><th class="num">WhatsApp</th></tr></thead><tbody>')
        for c in data.campaigns:
            add(f"<tr><td><strong>{_e(c['name'])}</strong></td><td>{_e(c['where'])}</td><td>{_e(c['window'])}</td><td class=\"num\">{c['leads']}</td>"
                f"<td class=\"num\">{c['emails']}</td><td class=\"num\">{c['drafted']}</td><td class=\"num\">{c['sent']}</td><td class=\"num\">{c['whatsapp']}</td></tr>")
        add("</tbody></table></div>")
    else:
        add('<p class="empty">No hay campañas con datos.</p>')
    add("</section>")

    add('</div><aside class="side">')

    add('<section class="panel"><h2>Embudo</h2>')
    for label, value in data.funnel:
        width = max(value / top * 100, 2.5) if value else 0
        add(f'<div class="bar"><div><span>{_e(label)}</span><b>{value}</b></div><div class="track"><div class="fill" style="width:{width:.1f}%"></div></div></div>')
    add("</section>")

    add('<section class="panel"><h2>Para poder enviar</h2>')
    for done, label in data.checklist:
        add(f'<div class="check"><span class="pill {"good" if done else "warn"}">{"Hecho" if done else "Falta"}</span><span>{_e(label)}</span></div>')
    add("</section>")

    add('<section class="panel"><h2>Cuentas de envío</h2>')
    if data.accounts:
        add('<div class="scroll"><table><thead><tr><th>Buzón</th><th class="num">Hoy</th><th>Estado</th></tr></thead><tbody>')
        for account in data.accounts:
            state = f'<span class="pill bad">Pausada</span> <span class="small muted">{_e(account["pause_reason"])}</span>' if account["paused"] else '<span class="pill good">Activa</span>'
            add(f"<tr><td>{_e(account['email'])}</td><td class=\"num\">{account['sent_today']} / {account['daily_limit']}</td><td>{state}</td></tr>")
        add("</tbody></table></div>")
    else:
        add(f'<p class="empty">{_e(data.accounts_note)} Aquí se verán los enviados de hoy frente al límite de cada buzón y si el cortafuegos lo ha pausado.</p>')
    add("</section>")

    add('<section class="panel"><h2>Última actividad</h2>')
    if data.events:
        add('<div class="scroll"><table><tbody>')
        for event in data.events:
            add(f"<tr><td class=\"muted\" style=\"white-space:nowrap\">{_e(event['when'])}</td><td>{_e(event['what'])}<div class=\"small muted\">{_e(event['who'])}</div></td></tr>")
        add("</tbody></table></div>")
    else:
        add('<p class="empty">Sin actividad registrada.</p>')
    add("</section>")

    add("</aside></div></div>")
    body = "\n".join(parts)
    head = (
        '<meta name="claude:viewport-fit-sides" content="cover">\n<title>Panel de captación B2B</title>\n'
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap">\n'
        f"<style>{_CSS}</style>"
    )
    if not standalone:
        return f"{head}\n{body}\n"
    refresh = f'<meta http-equiv="refresh" content="{int(refresh_seconds)}">' if refresh_seconds > 0 else ""
    return (
        '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f'<meta name="robots" content="noindex, nofollow">\n{refresh}\n{head}\n</head>\n<body>\n{body}\n</body>\n</html>\n'
    )
