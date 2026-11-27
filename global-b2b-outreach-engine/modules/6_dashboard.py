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
    socials: list[dict[str, Any]] = field(default_factory=list)
    last_extraction: dict[str, Any] = field(default_factory=dict)


@dataclass
class PanelState:
    """Lo que necesitan los botones del panel: campañas, costes estimados y trabajos en marcha."""

    campaigns: list[dict[str, Any]]
    running: dict[str, str]
    jobs: list[dict[str, Any]]
    sender_elsewhere: bool
    pending_enrich: int
    due_now: int
    message: str = ""
    preview: bool = False
    invalid_campaigns: list[str] = field(default_factory=list)


JOB_STATUS = {"RUNNING": ("En marcha", "info"), "DONE": ("Terminado", "good"), "FAILED": ("Falló", "bad"), "INTERRUPTED": ("Interrumpido", "warn")}


def panel_state(conn: sqlite3.Connection, runner: Any = None, message: str = "", preview: bool = False) -> PanelState:
    from core.campaign import CAMPAIGNS_DIR, CampaignError, parse_campaign

    jobs_module = load("jobs")
    copywriter = load("copywriter")
    tz = ZoneInfo("Europe/Madrid")
    campaigns, invalid = [], []
    for path in sorted(CAMPAIGNS_DIR.glob("*.json")):
        try:
            config = parse_campaign(path.read_text(encoding="utf-8"), path.name)
        except (CampaignError, OSError):
            invalid.append(path.name)
            continue
        places = len(config.search_terms) * len(config.locations) * config.max_places_per_search
        plan = copywriter.estimate(conn, config, None, True)
        campaigns.append({
            "name": config.campaign_name, "label": f"{config.campaign_name} · {config.niche_label} · {config.city_label}",
            "extract_places": places, "extract_cost": places * 0.004, "to_write": plan.leads, "write_cost": plan.cost_usd,
        })
    running = {}
    for row in conn.execute("SELECT kind, started_at FROM jobs WHERE status = 'RUNNING' ORDER BY id"):
        if runner is None or runner.is_running(row["kind"]):
            running[str(row["kind"])] = _local(row["started_at"], tz)
    jobs = [
        {"what": jobs_module.KIND_LABELS.get(row["kind"], row["kind"]), "campaign": row["campaign_name"] or "", "status": row["status"],
         "summary": row["summary"], "when": _local(row["started_at"], tz)}
        for row in conn.execute("SELECT * FROM jobs ORDER BY id DESC LIMIT 8")
    ]
    return PanelState(
        campaigns=campaigns, running=running, jobs=jobs,
        sender_elsewhere=db.sender_lease_active(conn) and "send" not in running,
        pending_enrich=_count(conn, "SELECT COUNT(*) FROM leads WHERE status = ? OR (status = ? AND (retry_after IS NULL OR retry_after <= ?))", (db.NEW, db.ERROR, db.iso())),
        due_now=_count(conn, "SELECT COUNT(*) FROM outbox WHERE status = ? AND scheduled_at IS NOT NULL AND scheduled_at <= ?", (db.OUT_PENDING, db.iso())),
        message=message, preview=preview, invalid_campaigns=invalid,
    )


def _actions_html(state: PanelState) -> str:
    """Los cuatro pasos del embudo como tarjetas con su botón."""
    options = "".join(f'<option value="{_e(c["name"])}">{_e(c["label"])}</option>' for c in state.campaigns)
    first = state.campaigns[0] if state.campaigns else None
    out: list[str] = ['<section class="panel" aria-label="Acciones"><h2>Lanzar</h2>']
    if state.preview:
        out.append('<p class="banner info">Vista previa: aquí los botones no hacen nada. En tu servidor lanzan cada paso de verdad.</p>')
    if state.message:
        out.append(f'<p class="banner good" role="status">{_e(state.message)}</p>')
    if state.invalid_campaigns:
        out.append(f'<p class="banner warn">Campañas con errores, no se pueden usar: {_e(", ".join(state.invalid_campaigns))}</p>')
    out.append('<div class="steps">')

    def card(number: int, kind: str, title: str, text: str, fields: str, button: str, disabled_reason: str = "") -> None:
        started = state.running.get(kind)
        out.append(f'<form class="step" method="post" action="/panel/action"><input type="hidden" name="action" value="{kind}">')
        out.append(f'<div class="stephead"><span class="num">{number}</span><h3>{_e(title)}</h3></div><p class="small muted">{text}</p>')
        if started:
            out.append(f'<p class="banner info" role="status">En marcha desde las {_e(started[-5:])}. El panel se actualiza solo.</p>')
        elif disabled_reason:
            out.append(f'<p class="small muted">{_e(disabled_reason)}</p><button type="submit" disabled>{_e(button)}</button>')
        else:
            out.append(f"{fields}<button type=\"submit\">{_e(button)}</button>")
        out.append("</form>")

    select = f'<label class="small" for="{{id}}">Campaña</label><select id="{{id}}" name="campaign" required>{options}</select>'
    no_campaign = "" if state.campaigns else "No hay campañas válidas en la carpeta campaigns/."

    cost = f"{first['extract_cost']:.2f}" if first else "0"
    card(1, "extract", "Extraer de Google Maps",
         "Busca negocios con Apify y los guarda sin duplicados." + (f" Con la primera campaña: hasta {first['extract_places']} negocios." if first else ""),
         select.format(id="c-extract") + f'<label class="tick"><input type="checkbox" name="confirm" value="1" required> Acepto el gasto en Apify (aprox. {cost} $ como máximo con la primera campaña)</label>',
         "Extraer", no_campaign)
    card(2, "enrich", "Buscar emails",
         f"Visita las webs y busca un email corporativo. No cuesta nada. Pendientes ahora: <strong>{state.pending_enrich}</strong>.",
         '<input type="hidden" name="confirm" value="1">', "Buscar emails",
         "" if state.pending_enrich else "No hay webs pendientes de rastrear.")
    write_cost = f"{first['write_cost']:.3f} $" if first and first["write_cost"] is not None else "desconocido"
    to_write = first["to_write"] if first else 0
    card(3, "generate", "Redactar correos",
         f"La IA escribe el primer correo y dos seguimientos por negocio. Pendientes en la primera campaña: <strong>{to_write}</strong> (aprox. {write_cost}).",
         select.format(id="c-generate") + '<label class="small" for="limit">Máximo de negocios</label><input id="limit" name="limit" type="number" min="1" max="500" value="20" inputmode="numeric">'
         '<label class="tick"><input type="checkbox" name="confirm" value="1" required> Acepto el gasto en la IA</label>',
         "Redactar", no_campaign)
    if "send" in state.running:
        out.append('<form class="step" method="post" action="/panel/action"><input type="hidden" name="action" value="stop_send">'
                   '<div class="stephead"><span class="num">4</span><h3>Enviar correos</h3></div>'
                   f'<p class="banner good" role="status">Enviando desde las {_e(state.running["send"][-5:])}, despacio y solo en horario laboral.</p>'
                   '<button type="submit" class="danger">Parar envíos</button></form>')
    else:
        card(4, "send", "Enviar correos",
             f"Envía de verdad, con pausas de 90 a 240 segundos y solo en el horario de cada campaña. Listos para salir ahora: <strong>{state.due_now}</strong>.",
             '<label class="tick"><input type="checkbox" name="confirm" value="1" required> Sí, enviar correos reales</label>',
             "Iniciar envíos", "Ya hay un motor de envío en marcha fuera del panel (el servicio)." if state.sender_elsewhere else "")
    out.append("</div>")
    if state.jobs:
        out.append('<div class="scroll"><table><thead><tr><th>Cuándo</th><th>Acción</th><th>Campaña</th><th>Estado</th><th>Resultado</th></tr></thead><tbody>')
        for job in state.jobs:
            label, tone = JOB_STATUS.get(job["status"], (job["status"], "neutral"))
            out.append(f"<tr><td class=\"muted\" style=\"white-space:nowrap\">{_e(job['when'])}</td><td>{_e(job['what'])}</td><td>{_e(job['campaign'])}</td>"
                       f"<td><span class=\"pill {tone}\">{_e(label)}</span></td><td>{_e(job['summary'])}</td></tr>")
        out.append("</tbody></table></div>")
    out.append("</section>")
    return "\n".join(out)


def login_page(error: bool = False) -> str:
    message = '<p class="banner bad" role="alert">Clave incorrecta.</p>' if error else ""
    return (
        '<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f'<meta name="robots" content="noindex, nofollow">\n<title>Panel de captación B2B</title>\n<style>{_CSS}</style>\n</head>\n<body>\n'
        '<div class="wrap" style="max-width:420px"><h1>Captación B2B</h1>'
        f'<form class="panel" method="post" action="/panel/login">{message}<label for="key">Clave del panel</label>'
        '<input id="key" name="key" type="password" autocomplete="current-password" required autofocus>'
        "<button type=\"submit\">Entrar</button></form></div>\n</body>\n</html>\n"
    )


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

    socials = []
    for row in conn.execute("SELECT business_name, email, phone_e164, social_links FROM leads WHERE social_links IS NOT NULL AND status != ? ORDER BY (email IS NULL) DESC, id", (db.DUPLICATE,)):
        try:
            links = json.loads(row["social_links"])
        except (TypeError, ValueError):
            continue
        if isinstance(links, dict) and links:
            socials.append({"business": row["business_name"], "email": row["email"] or "", "phone": row["phone_e164"] or "", "links": links})

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
        last_extraction=last_extraction, socials=socials,
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
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}
.step{border:1px solid var(--line);border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:10px;min-width:0;background:var(--bg)}
.step p{margin:0}.stephead{display:flex;align-items:center;gap:10px}
h3{font-family:var(--display);font-weight:600;font-size:16px;margin:0}
.num{flex:0 0 auto;width:26px;height:26px;border-radius:50%;background:var(--accent);color:var(--surface);display:inline-flex;align-items:center;justify-content:center;font-weight:600;font-size:13px}
label{font-size:14px}.tick{display:flex;gap:8px;align-items:flex-start;font-size:13px;line-height:1.4}.tick input{margin-top:2px;width:18px;height:18px;flex:0 0 auto}
select,input[type=number],input[type=password]{min-height:44px;padding:0 10px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--fg);font:inherit;width:100%;box-sizing:border-box}
button{min-height:44px;padding:0 18px;border-radius:8px;border:1px solid var(--accent);background:var(--accent);color:var(--surface);font:inherit;font-weight:600;cursor:pointer;margin-top:auto}
button:hover{filter:brightness(1.08)}button:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
button[disabled]{background:var(--track);border-color:var(--line);color:var(--muted);cursor:not-allowed;filter:none}
button.danger{background:var(--bad);border-color:var(--bad)}
.banner{margin:0;padding:10px 12px;border-radius:8px;font-size:14px}
"""


def _e(value: Any) -> str:
    return html.escape(str(value if value is not None else ""))


def _link(url: str) -> str:
    if not url.startswith(("http://", "https://")):
        return _e(url) or "-"
    label = url.split("://", 1)[1].split("?", 1)[0].rstrip("/")
    return f'<a href="{_e(url)}" rel="noopener noreferrer">{_e(label[:30])}</a>'


def render(data: DashboardData, standalone: bool = True, refresh_seconds: int = 0, panel: PanelState | None = None) -> str:
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

    if panel is not None:
        add(_actions_html(panel))

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

    add('<section class="panel"><h2>Redes sociales encontradas</h2>')
    if data.socials:
        add(f'<p class="empty">{len(data.socials)} negocios enlazan sus perfiles desde su web. Primero los que no tienen email corporativo.</p>')
        add('<div class="scroll"><table><thead><tr><th>Negocio</th><th>Perfiles</th><th>Teléfono</th><th>Email</th></tr></thead><tbody>')
        for item in data.socials:
            links = " · ".join(f'<a href="{_e(url)}" rel="noopener noreferrer">{_e(network)}</a>' for network, url in item["links"].items() if str(url).startswith("https://"))
            email = _e(item["email"]) if item["email"] else '<span class="pill neutral">Sin email</span>'
            add(f"<tr><td><strong>{_e(item['business'])}</strong></td><td>{links}</td><td style=\"white-space:nowrap\">{_e(item['phone'])}</td><td>{email}</td></tr>")
        add("</tbody></table></div>")
    else:
        add('<p class="empty">Todavía no se han buscado. Aparecen al ejecutar «Buscar emails».</p>')
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
