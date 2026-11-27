"""Pruebas de punta a punta del motor, sin servicios externos (Apify, Anthropic, SMTP e IMAP simulados)."""
from __future__ import annotations

import asyncio
import hashlib
import hmac
import json
import threading
from datetime import datetime, timedelta, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit

import pytest

import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core import db  # noqa: E402
from core import settings as settings_module  # noqa: E402
from core.campaign import CampaignError, load_campaign, parse_campaign  # noqa: E402
from core.textutils import root_domain, to_e164  # noqa: E402
from modules import load  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
EXAMPLE = json.loads((ROOT / "campaigns" / "example_campaign.json").read_text(encoding="utf-8"))

# Un martes a las 10:00 en Madrid (dentro de horario) y un domingo (fuera).
TUESDAY_10 = datetime(2026, 11, 24, 9, 0, tzinfo=timezone.utc)
SUNDAY = datetime(2026, 11, 29, 10, 0, tzinfo=timezone.utc)


@pytest.fixture()
def env(tmp_path, monkeypatch):
    values = {
        "DB_PATH": str(tmp_path / "leads.db"),
        "COMPANY_NAME": "Reparalia Sur, S.L.",
        "TAX_ID": "B18000000",
        "FISCAL_ADDRESS": "Calle Real 1, 18001 Granada",
        "PRIVACY_URL": "https://reparaliasur.example/privacidad",
        "PUBLIC_BASE_URL": "https://bajas.reparaliasur.example",
        "SENDER_NAME": "Laura Martín",
        "STRICT_B2B_ONLY": "true",
        "WEBHOOK_SECRET": "s3creto",
        "WHATSAPP_APP_SECRET": "meta-secret",
        "WHATSAPP_VERIFY_TOKEN": "verifica",
        "SEND_JITTER_MIN_SECONDS": "0",
        "SEND_JITTER_MAX_SECONDS": "0",
        "MAX_ACCOUNT_ERRORS": "2",
        "MAX_ACCOUNT_BOUNCES": "2",
        "ROBINSON_FILE": str(tmp_path / "external_robinson_blocklist.csv"),
        "ACCOUNTS_FILE": str(tmp_path / "accounts.json"),
        "ALERT_WEBHOOK_URL": "",
        "ANTHROPIC_API_KEY": "",
        "APIFY_TOKEN": "",
    }
    for key, value in values.items():
        monkeypatch.setenv(key, value)
    settings_module.get_settings.cache_clear()
    load("enricher")._mx_cache.clear()
    yield settings_module.get_settings()
    settings_module.get_settings.cache_clear()


@pytest.fixture()
def conn(env):
    with db.open_db() as connection:
        yield connection


@pytest.fixture()
def campaign():
    return parse_campaign(json.dumps(EXAMPLE))


# ── Campaña ─────────────────────────────────────────────────────────────────


def test_example_campaign_is_valid_and_loadable():
    loaded = load_campaign("colaboradores_espana_test")
    assert loaded.country_code == "ES" and loaded.timezone == "Europe/Madrid"
    assert load_campaign(str(ROOT / "campaigns" / "example_campaign.json")).campaign_name == loaded.campaign_name


@pytest.mark.parametrize("field,value", [
    ("timezone", "Europe/Granada"), ("language", "xx"), ("business_hours_start", "25:00"),
    ("whatsapp_number", "+34 600 111 222"), ("whatsapp_prefill_template", "Hola {nombre} [Ref: {lead_ref}]"),
    ("whatsapp_prefill_template", "Hola, quiero info de {niche_label}"), ("business_hours_end", "08:00"),
    ("search_terms", []), ("campaign_name", "Con Espacios"),
])
def test_campaign_rejects_bad_values(field, value):
    with pytest.raises(CampaignError):
        parse_campaign(json.dumps({**EXAMPLE, field: value}))


def test_send_window_respects_local_timezone(campaign):
    assert campaign.in_send_window(TUESDAY_10)
    assert not campaign.in_send_window(SUNDAY)
    assert not campaign.in_send_window(datetime(2026, 11, 24, 18, 30, tzinfo=timezone.utc))  # 19:30 en Madrid
    assert not campaign.in_send_window(datetime(2026, 11, 24, 6, 30, tzinfo=timezone.utc))  # 07:30 en Madrid
    tokyo = parse_campaign(json.dumps({**EXAMPLE, "timezone": "Asia/Tokyo"}))
    assert not tokyo.in_send_window(datetime(2026, 11, 24, 11, 0, tzinfo=timezone.utc))  # 20:00 en Tokio


def test_normalizers():
    assert to_e164("958 12 34 56", "ES") == "+34958123456"
    assert to_e164("+44 20 7946 0958", "ES") == "+442079460958"
    assert to_e164("123", "ES") is None
    assert root_domain("https://www.fontaneria-perez.es/contacto") == "fontaneria-perez.es"
    assert root_domain("http://shop.plumbers.co.uk") == "plumbers.co.uk"
    assert root_domain("https://www.facebook.com/fontaneriaperez") is None


# ── Extracción ──────────────────────────────────────────────────────────────


def place(place_id, title, website="", phone="", **extra):
    return {"placeId": place_id, "title": title, "website": website, "phoneUnformatted": phone,
            "categoryName": "Fontanero", "city": "Granada", "countryCode": "ES", "address": "Granada", **extra}


class FakeApify:
    def __init__(self, items):
        self.items, self.inputs = items, []

    async def start_run(self, actor_input):
        self.inputs.append(actor_input)
        return {"id": "run1"}

    async def wait_for_run(self, run_id, on_poll=None, max_wait_seconds=0):
        return {"id": run_id, "status": "SUCCEEDED", "defaultDatasetId": "ds1"}

    async def fetch_dataset(self, dataset_id):
        return self.items


def test_extraction_dedup_and_protected_states(conn, campaign):
    extractor = load("extractor")
    items = [
        place("p1", "Fontanería Pérez", "https://www.fontaneriaperez.es", "+34958111111"),
        place("p2", "Fontanería Pérez Armilla", "https://fontaneriaperez.es/armilla", "+34958222222"),  # misma cadena por dominio
        place("p3", "Desatascos Sur", "", "958 11 11 11"),  # misma cadena por teléfono
        place("p4", "Fontaneros Genil", "https://fontanerosgenil.com", "+34958333333"),
        place("p5", "Cerrado SL", "https://cerrado.es", "+34958444444", permanentlyClosed=True),
        place("p6", "Perfil social", "https://www.facebook.com/alguien", "+34958555555"),
        place("p7", "Otro perfil social", "https://www.facebook.com/otro", "+34958666666"),
    ]
    fake = FakeApify(items)
    stats = asyncio.run(extractor.run_extraction(campaign, conn, client=fake))
    assert fake.inputs[0]["skipClosedPlaces"] is True and fake.inputs[0]["locationQuery"] == "Granada, Spain"
    assert (stats.inserted, stats.duplicates_chain, stats.skipped_invalid) == (4, 2, 1)
    statuses = {row["place_id"]: row["status"] for row in conn.execute("SELECT place_id, status FROM leads")}
    assert statuses == {"p1": "NEW", "p2": "DUPLICATE", "p3": "DUPLICATE", "p4": "NEW", "p6": "NEW", "p7": "NEW"}

    # Un lead ya contactado no se toca al re-extraer, ni en datos ni en estado.
    with db.transaction(conn):
        conn.execute("UPDATE leads SET status = 'CONTACTED', email = 'info@fontaneriaperez.es' WHERE place_id = 'p1'")
    items[0]["title"] = "NOMBRE CAMBIADO"
    again = asyncio.run(extractor.run_extraction(campaign, conn, client=FakeApify(items)))
    row = conn.execute("SELECT status, business_name, email FROM leads WHERE place_id = 'p1'").fetchone()
    assert (row["status"], row["business_name"], row["email"]) == ("CONTACTED", "Fontanería Pérez", "info@fontaneriaperez.es")
    assert again.inserted == 0 and again.protected_untouched == 1
    assert conn.execute("SELECT COUNT(*) FROM leads").fetchone()[0] == 6

    # Google mezcla negocios de otros sectores: el filtro de categoría los deja fuera.
    noise = [place("n1", "Ferretería Morales", "https://ferreteriamorales.es", "+34958972069", categoryName="Ferretería"),
             place("n2", "Calderas Sur", "https://calderassur.es", "+34958972070", categoryName="Empresa de calefacción")]
    filtered = asyncio.run(extractor.run_extraction(campaign, conn, client=FakeApify(noise)))
    assert (filtered.inserted, filtered.out_of_niche) == (1, 1) and campaign.category_matches("FONTANERÍA industrial")


# ── Enriquecido ─────────────────────────────────────────────────────────────

SITES = {
    "/corp/": '<html><head><title>Fontanería Pérez</title><meta name="description" content="Fontaneros en Granada desde 1998"></head>'
              '<body><nav>menu</nav><h1>Fontanería Pérez</h1><h2>Desatascos y calderas en Granada y el área metropolitana</h2>'
              '<p>Reparamos fugas de agua, instalamos calderas de condensación y hacemos desatascos urgentes las 24 horas.</p>'
              '<img src="logo@2x.png"><a href="/corp/contacto">Contacto</a><a href="https://wa.me/34600000000">WhatsApp</a>'
              '<p>noreply@fontaneriaperez.test sentry@sentry.io</p></body></html>',
    "/corp/contacto": '<html><body><form><textarea name="m"></textarea></form>'
                      '<a href="mailto:Info@Fontaneriaperez.test?subject=Hola">Escríbenos</a> juan.perez@fontaneriaperez.test</body></html>',
    "/free/": '<html><body><h1>Fontanero Paco</h1><a href="mailto:pacofontanero@gmail.com">mail</a> paco@hotmail.es</body></html>',
    "/nomx/": '<html><body><a href="mailto:info@sinmx.test">mail</a></body></html>',
    "/blocked/": None,
}


class SiteHandler(BaseHTTPRequestHandler):
    def do_GET(self):  # noqa: N802
        body = SITES.get(self.path)
        if self.path.startswith("/blocked"):
            self.send_response(503)
            self.end_headers()
            return
        if body is None:
            self.send_response(404)
            self.end_headers()
            return
        data = body.encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, *args):
        pass


@pytest.fixture()
def site():
    server = ThreadingHTTPServer(("127.0.0.1", 0), SiteHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{server.server_port}"
    server.shutdown()


def insert_lead(conn, place_id, website, name="Negocio", phone=None, status="NEW", campaign="colaboradores_espana_test"):
    now = db.iso()
    with db.transaction(conn):
        cursor = conn.execute(
            "INSERT INTO leads (campaign_name, place_id, business_name, category, city, country_code, phone_e164, website, "
            "status, language, created_at, updated_at) VALUES (?, ?, ?, 'Fontanero', 'Granada', 'ES', ?, ?, ?, 'es', ?, ?)",
            (campaign, place_id, name, phone, website, status, now, now),
        )
    return cursor.lastrowid


def test_email_filters():
    enricher = load("enricher")
    assert enricher.reject_reason("logo@2x.png", True) == "static_file"
    assert enricher.reject_reason("noreply@empresa.es", True) == "system_address"
    assert enricher.reject_reason("mailer-daemon@empresa.es", True) == "system_address"
    assert enricher.reject_reason("abc@sentry.io", True) == "placeholder_domain"
    for free in ("a@gmail.com", "a@hotmail.es", "a@yahoo.co.uk", "a@outlook.com", "a@icloud.com", "a@live.com", "a@aol.com", "a@proton.me", "a@gmx.de"):
        assert enricher.reject_reason(free, True) == "free_provider", free
        assert enricher.reject_reason(free, False) is None
    assert enricher.reject_reason("info@fontaneriaperez.es", True) is None
    assert enricher.email_type("info@fontaneriaperez.es") == "generic"
    assert enricher.email_type("juan.perez@fontaneriaperez.es") == "personal"
    protected = "5a" + "".join(f"{ord(char) ^ 0x5A:02x}" for char in "info@empresa.es")  # formato de Cloudflare
    assert enricher.decode_cfemail(protected) == "info@empresa.es"


def test_enrichment_classifies_leads(conn, site):
    enricher = load("enricher")
    ids = {
        "corp": insert_lead(conn, "e1", f"{site}/corp/", "Fontanería Pérez"),
        "free": insert_lead(conn, "e2", f"{site}/free/"),
        "nomx": insert_lead(conn, "e3", f"{site}/nomx/"),
        "blocked": insert_lead(conn, "e4", f"{site}/blocked/"),
        "noweb": insert_lead(conn, "e5", ""),
        "contacted": insert_lead(conn, "e6", f"{site}/corp/", status="CONTACTED"),
    }

    async def fake_mx(domain):
        return domain != "sinmx.test"

    stats = asyncio.run(enricher.run_enrichment(conn, mx_checker=fake_mx, allow_private_hosts=True))
    assert (stats.total, stats.enriched, stats.no_corporate_email, stats.errors) == (5, 1, 3, 1)
    rows = {row["id"]: row for row in conn.execute("SELECT * FROM leads")}
    corp = rows[ids["corp"]]
    assert corp["status"] == "ENRICHED" and corp["email"] == "info@fontaneriaperez.test" and corp["email_type"] == "generic"
    assert corp["source_url"] == f"{site}/corp/contacto"  # trazabilidad: la página exacta donde estaba el email
    assert corp["has_contact_form"] == 1 and corp["has_whatsapp_link"] == 1
    assert "calderas" in corp["services_summary"] and len(corp["services_summary"]) <= 1800 and "menu" not in corp["services_summary"]
    assert rows[ids["free"]]["status"] == "NO_CORPORATE_EMAIL" and rows[ids["free"]]["email"] is None
    assert rows[ids["nomx"]]["status"] == "NO_CORPORATE_EMAIL"
    assert rows[ids["noweb"]]["status"] == "NO_CORPORATE_EMAIL"
    blocked = rows[ids["blocked"]]
    assert blocked["status"] == "ERROR" and blocked["retry_after"] > db.iso() and blocked["enrich_attempts"] == 1
    assert rows[ids["contacted"]]["status"] == "CONTACTED" and rows[ids["contacted"]]["email"] is None

    # El error no se reintenta hasta que vence su plazo.
    assert asyncio.run(enricher.run_enrichment(conn, retry_errors=True, mx_checker=fake_mx, allow_private_hosts=True)).total == 0
    with db.transaction(conn):
        conn.execute("UPDATE leads SET retry_after = '2000-01-01T00:00:00Z' WHERE id = ?", (ids["blocked"],))
    retried = asyncio.run(enricher.run_enrichment(conn, retry_errors=True, mx_checker=fake_mx, allow_private_hosts=True))
    assert retried.total == 1 and conn.execute("SELECT enrich_attempts FROM leads WHERE id = ?", (ids["blocked"],)).fetchone()[0] == 2


def test_strict_mode_off_accepts_free_providers(conn, site, monkeypatch):
    monkeypatch.setenv("STRICT_B2B_ONLY", "false")
    settings_module.get_settings.cache_clear()
    lead_id = insert_lead(conn, "f1", f"{site}/free/")

    async def ok(_domain):
        return True

    asyncio.run(load("enricher").run_enrichment(conn, mx_checker=ok, allow_private_hosts=True))
    assert conn.execute("SELECT status FROM leads WHERE id = ?", (lead_id,)).fetchone()[0] == "ENRICHED"


# ── Redacción ───────────────────────────────────────────────────────────────

GOOD = {
    "subject": "Trabajos de fontanería en Granada",
    "email_1": "Hola,\n\nHe visto en vuestra web que hacéis desatascos urgentes y calderas en Granada. Nosotros recibimos cada semana "
               "avisos de particulares que necesitan un fontanero y no damos abasto, así que buscamos profesionales de la zona a los "
               "que pasarles esos trabajos. No hay cuotas de alta ni permanencia, solo una comisión acordada por trabajo cobrado.\n\n"
               "Si os encaja, escribidnos por WhatsApp y os cuento cómo funciona:\n[[WA_LINK]]\n\nLaura Martín\nReparalia Sur, S.L.",
    "followup_1": "Hola,\n\nOs escribí hace unos días por los avisos de fontanería. Por si ayuda: el aviso os llega por WhatsApp con la "
                  "dirección y la avería, y vosotros decidís si lo cogéis o no.\n\nLaura Martín\nReparalia Sur, S.L.",
    "followup_2": "Hola,\n\nNo insisto más. Si más adelante os interesa recibir avisos, aquí seguimos:\n[[WA_LINK]]\n\nLaura Martín\nReparalia Sur, S.L.",
}


class FakeLLM:
    def __init__(self, *drafts):
        self.drafts = list(drafts)
        self.usage = load("copywriter").Usage()
        self.prompts = []

    async def generate(self, system, user):
        self.prompts.append((system, user))
        self.usage.calls += 1
        self.usage.input_tokens += 1200
        self.usage.output_tokens += 400
        draft = self.drafts.pop(0) if len(self.drafts) > 1 else self.drafts[0]
        if isinstance(draft, Exception):
            raise draft
        return load("copywriter").CopyDraft(**draft)


def enriched_lead(conn, place_id="g1", name="Fontanería Pérez & Hijos", email="info@fontaneriaperez.es", phone="+34958111111"):
    lead_id = insert_lead(conn, place_id, "https://fontaneriaperez.es", name, phone)
    with db.transaction(conn):
        conn.execute(
            "UPDATE leads SET status = 'ENRICHED', email = ?, email_domain = ?, email_type = 'generic', source_url = ?, "
            "services_summary = 'Desatascos urgentes y calderas en Granada' WHERE id = ?",
            (email, email.split("@")[1], "https://fontaneriaperez.es/contacto", lead_id),
        )
    return lead_id


def test_wa_link_is_deterministic(conn, campaign):
    copywriter = load("copywriter")
    link = copywriter.build_wa_link(campaign, "Fontanería Pérez & Hijos", "GR-8F3A")
    parts = urlsplit(link)
    assert parts.netloc == "wa.me" and parts.path == "/34600111222"
    text = parse_qs(parts.query)["text"][0]
    assert text == "Hola, he visto vuestro correo sobre averías de fontanería en Granada (Fontanería Pérez & Hijos). ¿Me pasáis info de cómo funciona? [Ref: GR-8F3A]"
    assert " " not in link and "&" not in parts.query and unquote(parts.query[5:]) == text
    refs = {copywriter.new_lead_ref(conn, "Granada") for _ in range(50)}
    assert all(ref.startswith("GR-") and len(ref) == 7 for ref in refs)
    assert copywriter.new_lead_ref(conn, "Málaga").startswith("MA-")


def test_generation_end_to_end(conn, campaign, env):
    copywriter = load("copywriter")
    lead_id = enriched_lead(conn)
    plan = copywriter.estimate(conn, campaign, None, False)
    assert plan.leads == 1 and plan.calls >= 1 and plan.cost_usd is not None and 0 < plan.cost_usd < 0.05
    assert conn.execute("SELECT COUNT(*) FROM outbox").fetchone()[0] == 0  # la simulación no escribe nada

    llm = FakeLLM(GOOD)
    stats = asyncio.run(copywriter.run_generation(conn, campaign, llm=llm))
    assert (stats.generated, stats.failed) == (1, 0)
    system, user = llm.prompts[0]
    assert "[[WA_LINK]]" in system and "Fontanería Pérez & Hijos" in user and "Laura Martín" in user and "wa.me" not in user
    lead = conn.execute("SELECT * FROM leads WHERE id = ?", (lead_id,)).fetchone()
    assert lead["status"] == "READY" and lead["lead_ref"].startswith("GR-") and len(lead["unsubscribe_token"]) == 36
    assert lead["wa_link"] == copywriter.build_wa_link(campaign, "Fontanería Pérez & Hijos", lead["lead_ref"])
    for step in db.STEPS:
        body = lead[f"body_{step}"]
        assert "[[WA_LINK]]" not in body and body.count(lead["wa_link"]) == 1  # followup_1 no traía marcador: se añade
        assert "B18000000" in body and "https://fontaneriaperez.es/contacto" in body
        assert f"https://bajas.reparaliasur.example/unsubscribe/{lead['unsubscribe_token']}" in body
        assert "LSSI" in body and "art. 19 LOPDGDD" in body
    outbox = conn.execute("SELECT step, status, scheduled_at, idempotency_key FROM outbox ORDER BY id").fetchall()
    assert [row["step"] for row in outbox] == list(db.STEPS)
    assert outbox[0]["scheduled_at"] is not None and outbox[1]["scheduled_at"] is None and outbox[2]["scheduled_at"] is None
    assert len({row["idempotency_key"] for row in outbox}) == 3

    # Volver a generar no duplica nada.
    again = asyncio.run(copywriter.run_generation(conn, campaign, llm=FakeLLM(GOOD)))
    assert again.candidates == 0 and conn.execute("SELECT COUNT(*) FROM outbox").fetchone()[0] == 3


def test_generation_retries_and_records_errors(conn, campaign):
    copywriter = load("copywriter")
    first = enriched_lead(conn, "g1")
    second = enriched_lead(conn, "g2", "Fontaneros Genil", "hola@fontanerosgenil.com", "+34958333333")
    spam = {**GOOD, "subject": "¡Oferta gratis solo hoy para fontaneros de toda Granada!"}
    with_url = {**GOOD, "email_1": GOOD["email_1"].replace("[[WA_LINK]]", "https://wa.me/34600111222")}

    stats = asyncio.run(copywriter.run_generation(conn, campaign, limit=1, llm=FakeLLM(spam, GOOD)))
    assert stats.generated == 1 and stats.usage.calls == 2  # el segundo intento corrige el asunto
    assert conn.execute("SELECT status FROM leads WHERE id = ?", (first,)).fetchone()[0] == "READY"

    failed = asyncio.run(copywriter.run_generation(conn, campaign, llm=FakeLLM(with_url)))
    row = conn.execute("SELECT status, copy_error, copy_attempts FROM leads WHERE id = ?", (second,)).fetchone()
    assert failed.failed == 1 and row["status"] == "ENRICHED" and "URL" in row["copy_error"]
    assert asyncio.run(copywriter.run_generation(conn, campaign, llm=FakeLLM(GOOD))).candidates == 0  # no se reintenta solo
    ok = asyncio.run(copywriter.run_generation(conn, campaign, retry_errors=True, llm=FakeLLM(GOOD)))
    assert ok.generated == 1 and conn.execute("SELECT copy_error FROM leads WHERE id = ?", (second,)).fetchone()[0] is None


def test_generation_requires_legal_identity(conn, campaign, monkeypatch):
    monkeypatch.setenv("TAX_ID", "")
    settings_module.get_settings.cache_clear()
    enriched_lead(conn)
    with pytest.raises(load("copywriter").FatalCopyError, match="TAX_ID"):
        asyncio.run(load("copywriter").run_generation(conn, campaign, llm=FakeLLM(GOOD)))


def test_templates_cover_all_languages():
    templates = load("copywriter").load_templates()
    assert set(templates) >= {"es", "en", "fr", "de", "it", "pt"}
    for language, template in templates.items():
        footer = template["legal_footer"].format(company_name="A", tax_id="B", fiscal_address="C", source_url="D", privacy_url="E", unsubscribe_url="F")
        assert "{" not in footer and "[[WA_LINK]]" in template["system_prompt"], language
        assert "{email}" in template["unsubscribe_page"]["body"], language


# ── Envío ───────────────────────────────────────────────────────────────────


def make_accounts(*emails, limit=30):
    sender = load("sender")
    return [sender.Account(email=address, from_name="Laura Martín", smtp_host="smtp.test", password="x",
                           imap_host="imap.test", daily_limit=limit) for address in emails]


class Clock:
    def __init__(self, now):
        self.now = now

    def __call__(self):
        return self.now


class Outbox:
    def __init__(self):
        self.sent, self.failures, self.broken_account = [], [], None

    def __call__(self, account, message):
        if account.email == self.broken_account:
            raise load("sender").SendFailure("account", "535 autenticación rechazada")
        if self.failures:
            raise self.failures.pop(0)
        self.sent.append((account.email, message))


def ready_leads(conn, campaign, count):
    ids = []
    for index in range(count):
        ids.append(enriched_lead(conn, f"s{index}", f"Negocio {index}", f"info@negocio{index}.es", f"+3495811{index:04d}"))
    asyncio.run(load("copywriter").run_generation(conn, campaign, llm=FakeLLM(GOOD)))
    with db.transaction(conn):  # las pruebas usan un reloj simulado: el primer envío ya está vencido
        conn.execute("UPDATE outbox SET scheduled_at = '2026-01-01T00:00:00Z' WHERE step = 'email_1'")
    return ids


def engine_for(conn, accounts, clock, outbox, imap=None, alerts=None):
    return load("sender").SenderEngine(
        conn, accounts, send_func=outbox, imap_func=imap or (lambda account, seen: []), now_func=clock,
        on_alert=(lambda title, detail: alerts.append((title, detail))) if alerts is not None else None,
    )


def test_full_sequence_headers_rotation_and_idempotency(conn, campaign):
    ids = ready_leads(conn, campaign, 4)
    clock, outbox = Clock(TUESDAY_10), Outbox()
    engine = engine_for(conn, make_accounts("a@envios.test", "b@envios.test"), clock, outbox)

    dry = asyncio.run(engine.send_pass(live=False))
    assert [item.decision for item in dry.items] == ["send"] * 4 and not outbox.sent
    assert conn.execute("SELECT COUNT(*) FROM outbox WHERE status != 'PENDING'").fetchone()[0] == 0  # la simulación no toca nada

    report = asyncio.run(engine.send_pass(live=True))
    assert report.sent == 4 and [sender for sender, _ in outbox.sent] == ["a@envios.test", "b@envios.test"] * 2
    message = outbox.sent[0][1]
    lead = conn.execute("SELECT * FROM leads WHERE id = ?", (ids[0],)).fetchone()
    unsubscribe = f"https://bajas.reparaliasur.example/unsubscribe/{lead['unsubscribe_token']}"
    assert message["List-Unsubscribe"].replace("\n", "").replace(" ", "") == f"<{unsubscribe}>,<mailto:a@envios.test?subject=unsubscribe>"
    assert message["List-Unsubscribe-Post"] == "List-Unsubscribe=One-Click"
    assert message["Subject"] == "Trabajos de fontanería en Granada" and message["To"] == "info@negocio0.es"
    plain = message.get_body(("plain",)).get_content()
    html_part = message.get_body(("html",)).get_content()
    assert lead["wa_link"] in plain and unsubscribe in plain
    assert f'href="{lead["wa_link"].replace("&", "&amp;")}"' in html_part and "Escribirnos por WhatsApp" in html_part
    assert lead["status"] == "CONTACTED"

    # Segunda pasada inmediata: no hay nada que enviar (idempotencia) y los seguimientos esperan su día.
    assert asyncio.run(engine.send_pass(live=True)).sent == 0 and len(outbox.sent) == 4
    clock.now = TUESDAY_10 + timedelta(days=2)
    assert asyncio.run(engine.send_pass(live=True)).sent == 0

    clock.now = TUESDAY_10 + timedelta(days=3, minutes=5)  # viernes: toca followup_1
    assert asyncio.run(engine.send_pass(live=True)).sent == 4
    follow = outbox.sent[4][1]
    first_id = conn.execute("SELECT message_id FROM outbox WHERE lead_id = ? AND step = 'email_1'", (ids[0],)).fetchone()[0]
    assert follow["Subject"] == "Re: Trabajos de fontanería en Granada" and follow["In-Reply-To"] == first_id
    assert outbox.sent[4][0] == "a@envios.test"  # el seguimiento sale de la misma cuenta que abrió el hilo

    clock.now = TUESDAY_10 + timedelta(days=7, minutes=5)  # martes siguiente: followup_2
    assert asyncio.run(engine.send_pass(live=True)).sent == 4
    assert len(outbox.sent) == 12 and conn.execute("SELECT COUNT(*) FROM outbox WHERE status = 'SENT'").fetchone()[0] == 12
    clock.now += timedelta(days=30)
    assert asyncio.run(engine.send_pass(live=True)).sent == 0

    # Aunque alguien intente reclamar otra vez una fila enviada, la base de datos lo impide.
    assert engine._claim(conn.execute("SELECT id FROM outbox LIMIT 1").fetchone()[0], engine.accounts[0]) is False
    with pytest.raises(Exception):
        conn.execute("INSERT INTO outbox (lead_id, campaign_name, step, idempotency_key, created_at, updated_at) VALUES (?, 'x', 'email_1', ?, 'x', 'x')",
                     (ids[0], db.idempotency_key(ids[0], "email_1")))


def test_business_hours_and_daily_limit(conn, campaign):
    ready_leads(conn, campaign, 3)
    clock, outbox = Clock(SUNDAY), Outbox()
    engine = engine_for(conn, make_accounts("a@envios.test", limit=2), clock, outbox)
    report = asyncio.run(engine.send_pass(live=True))
    assert report.sent == 0 and all("fuera de horario" in item.reason for item in report.items)
    clock.now = TUESDAY_10
    report = asyncio.run(engine.send_pass(live=True))
    assert report.sent == 2 and report.waiting == 1 and "límite diario" in report.items[-1].reason
    clock.now = TUESDAY_10 + timedelta(days=1)
    assert asyncio.run(engine.send_pass(live=True)).sent == 1


def test_suppression_and_robinson_block_sends(conn, campaign, env):
    ids = ready_leads(conn, campaign, 3)
    with db.transaction(conn):
        db.add_suppression(conn, "domain", "negocio0.es", "manual")
    env.robinson_file.write_text("email\ninfo@negocio1.es\n", encoding="utf-8")
    outbox = Outbox()
    report = asyncio.run(engine_for(conn, make_accounts("a@envios.test"), Clock(TUESDAY_10), outbox).send_pass(live=True))
    assert report.sent == 1 and report.cancelled == 2 and outbox.sent[0][1]["To"] == "info@negocio2.es"
    reasons = [row["error"] for row in conn.execute("SELECT DISTINCT error FROM outbox WHERE status = 'CANCELLED' ORDER BY error")]
    assert reasons == ["robinson:email", "suppression:domain:manual"]
    assert conn.execute("SELECT COUNT(*) FROM outbox WHERE lead_id IN (?, ?) AND status = 'PENDING'", (ids[0], ids[1])).fetchone()[0] == 0


def test_firewall_pauses_account_and_alerts(conn, campaign):
    sender = load("sender")
    ready_leads(conn, campaign, 4)
    outbox, alerts = Outbox(), []
    outbox.broken_account = "a@envios.test"  # una cuenta con la contraseña caducada; umbral de la prueba: 2 errores
    engine = engine_for(conn, make_accounts("a@envios.test", "b@envios.test"), Clock(TUESDAY_10), outbox, alerts=alerts)
    report = asyncio.run(engine.send_pass(live=True))
    assert report.paused_accounts == ["a@envios.test"]
    assert len(alerts) == 1 and "Cuenta pausada: a@envios.test" in alerts[0][0] and "2 errores SMTP" in alerts[0][1]
    paused = report.paused_accounts[0]
    assert report.sent == 2 and all(account == "b@envios.test" for account, _ in outbox.sent)
    # Los envíos que fallaron por culpa de la cuenta vuelven a la cola: no se pierden ni se duplican.
    assert conn.execute("SELECT COUNT(*) FROM outbox WHERE step = 'email_1' AND status IN ('SENT', 'PENDING')").fetchone()[0] == 4
    assert sender.resume_account(conn, paused) is True and engine.paused() == {}


def test_ambiguous_failure_is_never_retried(conn, campaign):
    sender = load("sender")
    ready_leads(conn, campaign, 1)
    outbox = Outbox()
    outbox.failures = [sender.SendFailure("ambiguous", "conexión cortada tras DATA")]
    clock = Clock(TUESDAY_10)
    engine = engine_for(conn, make_accounts("a@envios.test"), clock, outbox)
    assert asyncio.run(engine.send_pass(live=True)).failed == 1
    clock.now += timedelta(days=1)
    assert asyncio.run(engine.send_pass(live=True)).sent == 0 and not outbox.sent
    assert conn.execute("SELECT status FROM outbox WHERE step = 'email_1'").fetchone()[0] == "FAILED"


def test_hard_bounce_at_smtp_marks_lead(conn, campaign):
    sender = load("sender")
    ids = ready_leads(conn, campaign, 1)
    outbox = Outbox()
    outbox.failures = [sender.SendFailure("recipient", "550 user unknown")]
    asyncio.run(engine_for(conn, make_accounts("a@envios.test"), Clock(TUESDAY_10), outbox).send_pass(live=True))
    assert conn.execute("SELECT status FROM leads WHERE id = ?", (ids[0],)).fetchone()[0] == "BOUNCED"
    assert db.is_suppressed(conn, "info@negocio0.es") == "email:hard_bounce"
    assert conn.execute("SELECT COUNT(*) FROM outbox WHERE status = 'PENDING'").fetchone()[0] == 0


BOUNCE_RAW = (
    b"From: Mail Delivery Subsystem <mailer-daemon@googlemail.com>\r\nTo: a@envios.test\r\nSubject: Delivery Status Notification (Failure)\r\n"
    b"Content-Type: multipart/report; report-type=delivery-status; boundary=\"b\"\r\n\r\n--b\r\nContent-Type: text/plain\r\n\r\nAddress not found\r\n"
    b"--b\r\nContent-Type: message/delivery-status\r\n\r\nReporting-MTA: dns; googlemail.com\r\n\r\nFinal-Recipient: rfc822; info@negocio0.es\r\n"
    b"Action: failed\r\nStatus: 5.1.1\r\n--b--\r\n"
)


def reply_raw(sender_address, body, extra=b""):
    return (f"From: Paco <{sender_address}>\r\nTo: a@envios.test\r\nSubject: Re: Trabajos\r\n".encode() + extra
            + b"Content-Type: text/plain; charset=utf-8\r\n\r\n" + body.encode())


def test_imap_replies_bounces_and_unsubscribe_replies(conn, campaign):
    sender = load("sender")
    assert sender.classify_inbound(BOUNCE_RAW, "1").kind == "bounce_hard"
    assert sender.classify_inbound(BOUNCE_RAW, "1").recipients == ["info@negocio0.es"]
    assert sender.classify_inbound(reply_raw("x@y.es", "Estoy fuera", b"Auto-Submitted: auto-replied\r\n"), "2").kind == "auto_reply"

    ids = ready_leads(conn, campaign, 4)
    clock, outbox = Clock(TUESDAY_10), Outbox()
    inbox = [
        sender.classify_inbound(BOUNCE_RAW, "v:1"),
        sender.classify_inbound(reply_raw("info@negocio1.es", "Hola, me interesa, llamadme."), "v:2"),
        sender.classify_inbound(reply_raw("gerente@negocio2.es", "Por favor, darme de baja de esta lista."), "v:3"),
        sender.classify_inbound(reply_raw("info@negocio3.es", "Vuelvo el lunes", b"Auto-Submitted: auto-replied\r\n"), "v:4"),
    ]
    calls, delivered = [], []

    def imap(account, seen):
        calls.append(set(seen))
        return [mail for mail in delivered if mail.key not in seen]

    engine = engine_for(conn, make_accounts("a@envios.test"), clock, outbox, imap=imap)
    asyncio.run(engine.send_pass(live=True))
    delivered.extend(inbox)  # las respuestas llegan después de haber enviado
    report = sender.PassReport()
    asyncio.run(engine.check_inboxes(report))
    statuses = [conn.execute("SELECT status FROM leads WHERE id = ?", (lead_id,)).fetchone()[0] for lead_id in ids]
    assert statuses == ["BOUNCED", "REPLIED", "UNSUBSCRIBED", "CONTACTED"]
    assert (report.bounces, report.replies) == (1, 2)
    assert db.is_suppressed(conn, "otro@negocio2.es") == "domain:unsubscribe_reply"
    pending = {row[0] for row in conn.execute("SELECT DISTINCT lead_id FROM outbox WHERE status = 'PENDING'")}
    assert pending == {ids[3]}  # solo sigue la secuencia de quien mandó una respuesta automática
    asyncio.run(engine.check_inboxes(sender.PassReport()))
    assert calls[-1] == {"v:1", "v:2", "v:3", "v:4"}  # no se reprocesa ningún mensaje


def test_message_built_with_real_smtplib_against_local_server(conn, campaign):
    """El envío real por smtplib contra un servidor SMTP local mínimo: comprueba el cable de verdad."""
    import socketserver

    received = {}

    class Handler(socketserver.StreamRequestHandler):
        def handle(self):
            self.wfile.write(b"220 test ESMTP\r\n")
            data_mode, lines = False, []
            while True:
                line = self.rfile.readline()
                if not line:
                    break
                if data_mode:
                    if line == b".\r\n":
                        received["data"] = b"".join(lines)
                        data_mode = False
                        self.wfile.write(b"250 queued\r\n")
                    else:
                        lines.append(line)
                    continue
                command = line.strip().upper()
                if command.startswith(b"EHLO"):
                    self.wfile.write(b"250-test\r\n250 AUTH PLAIN LOGIN\r\n")
                elif command.startswith(b"AUTH"):
                    self.wfile.write(b"235 ok\r\n")
                elif command.startswith(b"RCPT TO") and b"REBOTA" in command:
                    self.wfile.write(b"550 5.1.1 user unknown\r\n")
                elif command.startswith(b"DATA"):
                    data_mode = True
                    self.wfile.write(b"354 go\r\n")
                elif command.startswith(b"QUIT"):
                    self.wfile.write(b"221 bye\r\n")
                    break
                else:
                    self.wfile.write(b"250 ok\r\n")

    server = socketserver.ThreadingTCPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        sender = load("sender")
        ids = ready_leads(conn, campaign, 1)
        account = sender.Account(email="a@envios.test", from_name="Laura Martín", smtp_host="127.0.0.1",
                                 smtp_port=server.server_address[1], smtp_security="none", password="x")
        lead = conn.execute("SELECT * FROM leads WHERE id = ?", (ids[0],)).fetchone()
        message = sender.build_message(account, lead, "email_1", settings_module.get_settings(), None)
        sender.smtp_send(account, message)
        wire = received["data"].decode()
        assert "List-Unsubscribe-Post: List-Unsubscribe=One-Click" in wire and "List-Unsubscribe: <https://bajas.reparaliasur.example/unsubscribe/" in wire and "=?utf-8?q?=3Chttps" not in wire
        assert "To: info@negocio0.es" in wire and "multipart/alternative" in wire
        del message["To"]
        message["To"] = "rebota@negocio0.es"
        with pytest.raises(sender.SendFailure) as failure:
            sender.smtp_send(account, message)
        assert failure.value.kind == "recipient"
        closed = sender.Account(email="a@envios.test", from_name="L", smtp_host="127.0.0.1", smtp_port=1, smtp_security="none", password="x")
        with pytest.raises(sender.SendFailure) as failure:
            sender.smtp_send(closed, message)
        assert failure.value.kind == "account"
    finally:
        server.shutdown()


# ── Servidor de bajas y WhatsApp ────────────────────────────────────────────


@pytest.fixture()
def client(env):
    from fastapi.testclient import TestClient

    with TestClient(load("server").app) as test_client:
        yield test_client


def test_unsubscribe_flow(conn, campaign, client):
    ids = ready_leads(conn, campaign, 2)
    with db.transaction(conn):  # un segundo contacto de la misma empresa
        conn.execute("UPDATE leads SET email = 'admin@negocio0.es', email_domain = 'negocio0.es' WHERE id = ?", (ids[1],))
    token = conn.execute("SELECT unsubscribe_token FROM leads WHERE id = ?", (ids[0],)).fetchone()[0]

    response = client.get(f"/unsubscribe/{token}")
    assert response.status_code == 200 and "ya no recibirás más correos" in response.text and 'lang="es"' in response.text
    assert "info@negocio0.es" not in response.text and "in••@negocio0.es" in response.text
    assert conn.execute("SELECT status FROM leads WHERE id = ?", (ids[0],)).fetchone()[0] == "UNSUBSCRIBED"
    suppressed = {(row["kind"], row["value"]) for row in conn.execute("SELECT kind, value FROM suppression_list")}
    assert suppressed == {("email", "info@negocio0.es"), ("domain", "negocio0.es")}
    assert conn.execute("SELECT COUNT(*) FROM outbox WHERE status = 'PENDING'").fetchone()[0] == 0  # también el otro contacto del dominio
    assert conn.execute("SELECT COUNT(*) FROM outbox WHERE status = 'CANCELLED'").fetchone()[0] == 6

    assert client.post(f"/unsubscribe/{token}", data={"List-Unsubscribe": "One-Click"}).status_code == 200  # idempotente
    assert conn.execute("SELECT COUNT(*) FROM suppression_list").fetchone()[0] == 2
    missing = client.get("/unsubscribe/00000000-0000-4000-8000-000000000000", headers={"Accept-Language": "fr-FR,fr;q=0.9"})
    assert missing.status_code == 404 and "pas valide" in missing.text and 'lang="fr"' in missing.text
    assert client.get("/unsubscribe/x' OR 1=1 --").status_code == 404

    # Y el motor no envía nada a ese dominio.
    outbox = Outbox()
    asyncio.run(engine_for(conn, make_accounts("a@envios.test"), Clock(TUESDAY_10), outbox).send_pass(live=True))
    assert not outbox.sent


def test_whatsapp_webhook_all_providers(conn, campaign, client):
    ids = ready_leads(conn, campaign, 4)
    refs = [conn.execute("SELECT lead_ref FROM leads WHERE id = ?", (lead_id,)).fetchone()[0] for lead_id in ids]
    url = "/webhook/whatsapp-inbound"

    assert client.post(url, json={"phone": "34600000000", "message": "hola"}).status_code == 401
    assert client.post(url + "?secret=mal", json={}).status_code == 401

    # 1) WhatsApp Cloud API con firma HMAC de Meta, localizado por [Ref: ...]
    cloud = json.dumps({"entry": [{"changes": [{"value": {"messages": [
        {"from": "34611222333", "type": "text", "text": {"body": f"Hola, he visto vuestro correo [Ref: {refs[0]}]"}}]}}]}]}).encode()
    signature = "sha256=" + hmac.new(b"meta-secret", cloud, hashlib.sha256).hexdigest()
    response = client.post(url, content=cloud, headers={"X-Hub-Signature-256": signature, "Content-Type": "application/json"})
    assert response.status_code == 200 and response.json()["leads"][0] == {
        "matched": True, "lead_id": ids[0], "lead_ref": refs[0], "matched_by": "ref", "cancelled_sends": 3}
    assert client.post(url, content=cloud, headers={"X-Hub-Signature-256": "sha256=" + "0" * 64}).status_code == 401

    # 2) Evolution API, referencia en minúsculas; los mensajes propios (fromMe) se ignoran
    headers = {"X-Webhook-Secret": "s3creto"}
    evolution = {"event": "messages.upsert", "data": {"key": {"remoteJid": "34699888777@s.whatsapp.net", "fromMe": False},
                                                       "message": {"conversation": f"buenas [ref: {refs[1].lower()}]"}}}
    assert client.post(url, json=evolution, headers=headers).json()["matched"] == 1
    own = {"data": {"key": {"remoteJid": "34958110002@s.whatsapp.net", "fromMe": True}, "message": {"conversation": "respuesta nuestra"}}}
    assert client.post(url, json=own, headers=headers).json() == {"received": 0, "matched": 0, "leads": []}

    # 3) JSON plano (Make / n8n / GoHighLevel), sin referencia: se cruza por teléfono
    generic = {"contact": {"phone": "+34 958 11 00 02"}, "message": "Hola, me interesa"}
    result = client.post(url + "?secret=s3creto", json=generic).json()
    assert result["matched"] == 1 and result["leads"][0]["matched_by"] == "phone" and result["leads"][0]["lead_id"] == ids[2]

    # 4) Un desconocido no rompe nada y devuelve 200
    assert client.post(url, json={"phone": "34000000000", "message": "info"}, headers=headers).json()["matched"] == 0

    statuses = [conn.execute("SELECT status FROM leads WHERE id = ?", (lead_id,)).fetchone()[0] for lead_id in ids]
    assert statuses == ["CONVERTED_TO_WA", "CONVERTED_TO_WA", "CONVERTED_TO_WA", "READY"]
    assert {row[0] for row in conn.execute("SELECT DISTINCT lead_id FROM outbox WHERE status = 'PENDING'")} == {ids[3]}

    # Verificación del webhook que hace Meta al configurarlo
    ok = client.get(url, params={"hub.mode": "subscribe", "hub.verify_token": "verifica", "hub.challenge": "12345"})
    assert ok.status_code == 200 and ok.text == "12345"
    assert client.get(url, params={"hub.mode": "subscribe", "hub.verify_token": "otro", "hub.challenge": "1"}).status_code == 403
    assert client.get("/health").json() == {"status": "ok"}


def test_dashboard_reads_real_state_and_is_protected(conn, campaign, client, monkeypatch):
    dashboard = load("dashboard")
    ready_leads(conn, campaign, 2)
    asyncio.run(engine_for(conn, make_accounts("a@envios.test"), Clock(TUESDAY_10), Outbox()).send_pass(live=True))
    with db.transaction(conn):
        conn.execute("UPDATE leads SET business_name = '<script>alert(1)</script>' WHERE id = 1")
    data = dashboard.collect(conn)
    assert dict(data.funnel)["Primer correo enviado"] == 2 and dict(data.funnel)["Con email corporativo"] == 2
    page = dashboard.render(data)
    assert "<script>alert(1)</script>" not in page and "&lt;script&gt;" in page and "info@negocio1.es" in page
    assert page.startswith("<!doctype html>") and not dashboard.render(data, standalone=False).startswith("<!doctype")
    assert client.get("/panel").status_code == 404  # sin clave configurada, el panel no existe
    monkeypatch.setenv("DASHBOARD_TOKEN", "clave-panel")
    settings_module.get_settings.cache_clear()
    assert client.get("/panel?key=mala").status_code == 404
    ok = client.get("/panel?key=clave-panel")
    assert ok.status_code == 200 and "Captación B2B" in ok.text


def test_unsubscribed_lead_is_not_reopened_by_whatsapp(conn, campaign, client):
    ids = ready_leads(conn, campaign, 1)
    row = conn.execute("SELECT unsubscribe_token, lead_ref FROM leads WHERE id = ?", (ids[0],)).fetchone()
    client.get(f"/unsubscribe/{row['unsubscribe_token']}")
    client.post("/webhook/whatsapp-inbound", json={"phone": "34611", "message": f"[Ref: {row['lead_ref']}]"}, headers={"X-Webhook-Secret": "s3creto"})
    assert conn.execute("SELECT status FROM leads WHERE id = ?", (ids[0],)).fetchone()[0] == "UNSUBSCRIBED"
