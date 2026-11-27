"""Módulo 2 — Enriquecido web: email corporativo, trazabilidad (source_url) y resumen de servicios."""
from __future__ import annotations

import asyncio
import contextlib
import ipaddress
import json
import logging
import re
import sqlite3
from dataclasses import dataclass, field
from datetime import timedelta
from typing import Awaitable, Callable
from urllib.parse import unquote, urljoin, urlsplit

import dns.asyncresolver
import dns.exception
import dns.resolver
import httpx
from bs4 import BeautifulSoup

from core import db
from core.logs import get_logger, log
from core.settings import get_settings
from core.textutils import EMAIL_RE, host_of, is_free_email_domain, root_domain_of_host

logger = get_logger("enricher")

DEFAULT_CONCURRENCY = 15
DOMAIN_TIMEOUT_SECONDS = 45.0
REQUEST_TIMEOUT = httpx.Timeout(12.0, connect=7.0)
MAX_PAGES_PER_DOMAIN = 7
MAX_BODY_BYTES = 1_500_000
SUMMARY_MAX_CHARS = 1800

# Pistas (en URL o texto del enlace) de páginas donde suele estar el contacto, por prioridad.
LINK_HINTS = (
    "contact", "kontakt", "contatt", "contato", "aviso-legal", "aviso_legal", "avisolegal", "legal",
    "impressum", "mentions-legales", "mentions", "privacy", "privacidad", "datenschutz", "about",
    "quienes-somos", "quienessomos", "sobre-nosotros", "nosotros", "chi-siamo", "ueber-uns",
    "uber-uns", "a-propos", "quem-somos", "empresa",
)
FALLBACK_PATHS = (
    "/contacto", "/contact", "/aviso-legal", "/legal", "/impressum", "/mentions-legales",
    "/privacy", "/about", "/quienes-somos",
)

STATIC_EXTENSIONS = frozenset({
    "png", "jpg", "jpeg", "gif", "webp", "svg", "avif", "bmp", "ico", "css", "js", "mjs", "json",
    "xml", "map", "woff", "woff2", "ttf", "eot", "otf", "pdf", "mp4", "webm", "mp3", "zip", "php",
    "html", "htm",
})
SYSTEM_LOCAL_PARTS = frozenset({
    "noreply", "no-reply", "no_reply", "no.reply", "donotreply", "do-not-reply", "do_not_reply",
    "mailer-daemon", "mailerdaemon", "postmaster", "hostmaster", "webmaster", "abuse", "bounce",
    "bounces", "sentry", "root", "daemon", "nobody", "notifications", "notification", "alerts",
    "wordpress", "unsubscribe", "privacy", "dpo", "dpd", "lopd", "rgpd", "gdpr", "example",
    "ejemplo", "test", "email", "user", "usuario", "nombre", "name", "tu", "your", "you",
})
SYSTEM_LOCAL_PREFIXES = ("noreply", "no-reply", "no_reply", "donotreply", "do-not-reply", "bounce", "sentry")
PLACEHOLDER_DOMAINS = frozenset({
    "example.com", "example.org", "example.net", "domain.com", "dominio.com", "dominio.es",
    "email.com", "tuemail.com", "correo.com", "yourdomain.com", "tudominio.com", "tudominio.es",
    "mysite.com", "website.com", "sentry.io", "wixpress.com", "wix.com", "godaddy.com",
    "wordpress.org", "wordpress.com", "w3.org", "schema.org", "googleapis.com", "gstatic.com",
    "google.com", "cloudflare.com", "jquery.com", "gravatar.com", "squarespace.com", "shopify.com",
    "mailchimp.com", "sendgrid.net", "amazonaws.com", "facebook.com", "instagram.com",
})
GENERIC_LOCAL_PARTS = frozenset({
    "info", "informacion", "contacto", "contact", "contacta", "hola", "hello", "hi", "admin",
    "administracion", "oficina", "office", "ventas", "sales", "comercial", "atencion",
    "atencionalcliente", "clientes", "reservas", "presupuestos", "presupuesto", "kontakt",
    "bonjour", "mail", "correo", "general", "direccion", "gerencia", "recepcion", "secretaria",
    "soporte", "support", "servicio", "servicios", "service", "sat", "taller", "tienda", "shop",
    "pedidos", "citas", "urgencias", "averias", "team", "equipo", "empresa", "consultas",
    "contabilidad", "facturacion", "marketing", "comunicacion", "buero", "anfrage", "accueil",
    "devis", "contatti", "contato", "geral", "enquiries", "enquiry", "bookings", "booking",
})
SOCIAL_HOSTS = ("facebook.com", "instagram.com", "linkedin.com", "twitter.com", "x.com", "tiktok.com", "youtube.com", "wa.me", "linktr.ee")

_OBFUSCATED_AT = re.compile(r"\s*[\[\(\{]\s*(?:at|arroba|@)\s*[\]\)\}]\s*", re.IGNORECASE)
_OBFUSCATED_DOT = re.compile(r"\s*[\[\(\{]\s*(?:dot|punto|punkt|point)\s*[\]\)\}]\s*", re.IGNORECASE)
_WHATSAPP_RE = re.compile(r"(?:wa\.me/|api\.whatsapp\.com/|web\.whatsapp\.com/|whatsapp://)", re.IGNORECASE)
_WS = re.compile(r"\s+")

_CHALLENGE_RE = re.compile(r"<title>\s*(Just a moment|Un momento|Attention Required|Access denied)[^<]*</title>|cf-browser-verification|challenge-platform", re.IGNORECASE)

MxChecker = Callable[[str], Awaitable[bool]]


class EnrichError(Exception):
    """Fallo temporal (red, DNS, bloqueo): el lead se reintenta más tarde."""


class DnsUnavailable(Exception):
    """El DNS local no funciona: no se puede validar ningún email y el lote se detiene."""


@dataclass
class EmailCandidate:
    email: str
    source_url: str
    via_mailto: bool
    page_rank: int


@dataclass
class EnrichResult:
    status: str
    email: str | None = None
    email_type: str | None = None
    source_url: str | None = None
    has_contact_form: bool = False
    has_whatsapp_link: bool = False
    services_summary: str = ""
    social_links: dict[str, str] = field(default_factory=dict)
    note: str = ""
    discarded: dict[str, int] = field(default_factory=dict)


# ── Redes sociales ──────────────────────────────────────────────────────────

SOCIAL_NETWORKS = {
    "facebook.com": "Facebook", "fb.com": "Facebook", "instagram.com": "Instagram", "linkedin.com": "LinkedIn",
    "twitter.com": "X", "x.com": "X", "tiktok.com": "TikTok", "youtube.com": "YouTube",
}
# Rutas que no son el perfil del negocio: botones de compartir, políticas, plugins...
_SOCIAL_NOISE = re.compile(
    r"/(sharer|share|intent|dialog|plugins|policies|policy|privacy|legal|help|hashtag|explore|login|signup|"
    r"watch|embed|shorts|results|home|tr|p)(/|\.php|\?|$)|/(tos|terms)\b|shareArticle",
    re.IGNORECASE,
)


def social_profile(url: str) -> tuple[str, str] | None:
    """(red, url limpia) si el enlace es un perfil de red social; None si es un botón de compartir o similar."""
    url = url.strip()
    if url.startswith("//"):
        url = "https:" + url
    parts = urlsplit(url if "://" in url else "https://" + url)
    host = (parts.hostname or "").lower()
    network = next((name for domain, name in SOCIAL_NETWORKS.items() if host == domain or host.endswith("." + domain)), None)
    path = parts.path.rstrip("/")
    if path.lower() in ("/http", "/https", "/www"):  # enlace mal escrito en la web del negocio
        return None
    if network is None or not path or _SOCIAL_NOISE.search(parts.path + ("?" + parts.query if parts.query else "")):
        return None
    if network == "Facebook" and path.lower() == "/profile.php":
        return (network, f"https://www.facebook.com/profile.php?{parts.query}") if "id=" in parts.query else None
    return network, f"https://{host}{path}"


def extract_social_links(soup: BeautifulSoup) -> dict[str, str]:
    found: dict[str, str] = {}
    for anchor in soup.find_all("a", href=True):
        profile = social_profile(str(anchor["href"]))
        if profile and profile[0] not in found:
            found[profile[0]] = profile[1]
    return found


# ── Emails ──────────────────────────────────────────────────────────────────


def reject_reason(email: str, strict_b2b_only: bool) -> str | None:
    """Motivo por el que un email no sirve para contacto B2B, o None si es válido."""
    email = email.strip().lower().strip(".")
    if email.count("@") != 1 or len(email) > 254:
        return "malformed"
    local, domain = email.split("@")
    if not local or ".." in email or "." not in domain:
        return "malformed"
    tld = domain.rsplit(".", 1)[-1]
    if tld in STATIC_EXTENSIONS or re.search(r"@\dx\.", email):
        return "static_file"
    if local in SYSTEM_LOCAL_PARTS or local.startswith(SYSTEM_LOCAL_PREFIXES):
        return "system_address"
    if re.fullmatch(r"[0-9a-f]{16,}", local) or len(local) > 40:
        return "system_address"
    if domain in PLACEHOLDER_DOMAINS or any(domain.endswith("." + bad) for bad in PLACEHOLDER_DOMAINS):
        return "placeholder_domain"
    if strict_b2b_only and is_free_email_domain(domain):
        return "free_provider"
    return None


def email_type(email: str) -> str:
    """'generic' para buzones de empresa (info@, contacto@...), 'personal' si parece de una persona."""
    local, domain = email.lower().split("@")
    base = re.sub(r"[^a-z]", "", local)
    label = domain.split(".")[0]
    if local in GENERIC_LOCAL_PARTS or base in GENERIC_LOCAL_PARTS or base == re.sub(r"[^a-z]", "", label):
        return "generic"
    return "personal"


def decode_cfemail(encoded: str) -> str:
    """Decodifica los emails protegidos por Cloudflare (atributo data-cfemail)."""
    try:
        key = int(encoded[:2], 16)
        return "".join(chr(int(encoded[i:i + 2], 16) ^ key) for i in range(2, len(encoded), 2))
    except ValueError:
        return ""


def extract_emails(html: str, soup: BeautifulSoup) -> list[tuple[str, bool]]:
    """Devuelve (email, via_mailto) encontrados en la página, sin duplicados y en orden."""
    found: dict[str, bool] = {}
    for anchor in soup.find_all("a", href=True):
        href = str(anchor["href"]).strip()
        if href.lower().startswith("mailto:"):
            address = unquote(href[7:].split("?", 1)[0]).strip()
            for part in re.split(r"[,;]", address):
                match = EMAIL_RE.fullmatch(part.strip())
                if match:
                    found[match.group(0).lower()] = True
    for node in soup.find_all(attrs={"data-cfemail": True}):
        decoded = decode_cfemail(str(node["data-cfemail"]))
        if EMAIL_RE.fullmatch(decoded):
            found.setdefault(decoded.lower(), True)
    text = soup.get_text(" ", strip=True)
    text = _OBFUSCATED_DOT.sub(".", _OBFUSCATED_AT.sub("@", text))
    for source in (text, html):
        for match in EMAIL_RE.finditer(source):
            found.setdefault(match.group(0).lower().strip("."), False)
    return list(found.items())


def choose_email(candidates: list[EmailCandidate], site_root: str) -> EmailCandidate | None:
    """El mejor candidato: mismo dominio que la web > buzón genérico > mailto > página más relevante."""

    def score(candidate: EmailCandidate) -> tuple[int, int, int, int]:
        domain = candidate.email.split("@")[1]
        same_domain = 1 if site_root and root_domain_of_host(domain) == site_root else 0
        generic = 1 if email_type(candidate.email) == "generic" else 0
        return (same_domain, generic, 1 if candidate.via_mailto else 0, -candidate.page_rank)

    return max(candidates, key=score) if candidates else None


_mx_cache: dict[str, bool] = {}


async def has_mx(domain: str) -> bool:
    """True si el dominio publica registros MX utilizables. Lanza EnrichError si el DNS no contesta."""
    domain = domain.lower()
    if domain in _mx_cache:
        return _mx_cache[domain]
    resolver = dns.asyncresolver.Resolver()
    resolver.lifetime = 6.0
    try:
        answer = await resolver.resolve(domain, "MX")
        valid = any(str(record.exchange).rstrip(".") for record in answer)
    except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer):
        valid = False
    except dns.exception.DNSException as exc:
        raise EnrichError(f"DNS sin respuesta para {domain}: {type(exc).__name__}") from exc
    _mx_cache[domain] = valid
    return valid


async def dns_self_check() -> None:
    """Comprueba que el DNS de esta máquina resuelve MX de verdad antes de fiarse de él.

    Sin esto, un servidor o red con el DNS capado descartaría todos los emails por «sin MX».
    """
    for domain in ("gmail.com", "outlook.com"):
        with contextlib.suppress(EnrichError):
            if await has_mx(domain):
                return
        _mx_cache.pop(domain, None)
    raise DnsUnavailable(
        "El DNS de esta máquina no resuelve registros MX (ni siquiera los de gmail.com), así que no se "
        "pueden validar emails. Revisa /etc/resolv.conf o el cortafuegos (puerto 53) y vuelve a lanzar enrich."
    )


# ── Páginas ─────────────────────────────────────────────────────────────────


def summarize_services(soup: BeautifulSoup) -> str:
    """Resumen limpio de lo que ofrece la empresa, a partir de la home (máx. 1800 caracteres)."""
    title = _WS.sub(" ", soup.title.get_text(" ", strip=True)) if soup.title else ""
    meta = soup.find("meta", attrs={"name": re.compile("^description$", re.IGNORECASE)})
    description = _WS.sub(" ", str(meta.get("content", ""))).strip() if meta else ""
    for tag in soup(["script", "style", "noscript", "svg", "nav", "footer", "header", "form", "iframe", "aside", "template"]):
        tag.decompose()
    seen: set[str] = set()

    def collect(tags: list[str], minimum: int, limit: int) -> list[str]:
        out: list[str] = []
        for node in soup.find_all(tags):
            text = _WS.sub(" ", node.get_text(" ", strip=True))
            key = text.lower()
            if len(text) < minimum or len(text) > 400 or key in seen or "cookie" in key:
                continue
            seen.add(key)
            out.append(text)
            if len(out) >= limit:
                break
        return out

    headings = collect(["h1", "h2", "h3"], 4, 14)
    paragraphs = collect(["p", "li"], 35, 14)
    parts = []
    if title:
        parts.append(f"Título: {title}")
    if description:
        parts.append(f"Descripción: {description}")
    if headings:
        parts.append("Secciones: " + " | ".join(headings))
    if paragraphs:
        parts.append("Texto: " + " ".join(paragraphs))
    summary = "\n".join(parts).strip()
    if len(summary) > SUMMARY_MAX_CHARS:
        summary = summary[:SUMMARY_MAX_CHARS].rsplit(" ", 1)[0].rstrip(" |,.;:") + "…"
    return summary


def detect_contact_form(soup: BeautifulSoup) -> bool:
    for form in soup.find_all("form"):
        if form.find("textarea"):
            return True
        inputs = form.find_all("input", attrs={"type": re.compile("^(text|tel|email)$", re.IGNORECASE)})
        if form.find("input", attrs={"type": re.compile("^email$", re.IGNORECASE)}) and len(inputs) >= 3:
            return True
    return False


def detect_whatsapp(html: str) -> bool:
    return bool(_WHATSAPP_RE.search(html))


def relevant_links(soup: BeautifulSoup, base_url: str, site_root: str) -> list[str]:
    """Enlaces internos a contacto / aviso legal / quiénes somos, ordenados por relevancia."""
    ranked: dict[str, int] = {}
    base_host = host_of(base_url)
    for anchor in soup.find_all("a", href=True):
        href = str(anchor["href"]).strip()
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript:", "whatsapp:")):
            continue
        absolute = urljoin(base_url, href).split("#", 1)[0]
        parts = urlsplit(absolute)
        if parts.scheme not in ("http", "https"):
            continue
        host = (parts.hostname or "").lower()
        if host != base_host and root_domain_of_host(host) != site_root:
            continue
        if parts.path.rsplit(".", 1)[-1].lower() in STATIC_EXTENSIONS - {"php", "html", "htm"}:
            continue
        haystack = (parts.path + " " + anchor.get_text(" ", strip=True)).lower().replace(" ", "-")
        for rank, hint in enumerate(LINK_HINTS):
            if hint in haystack:
                if absolute not in ranked or rank < ranked[absolute]:
                    ranked[absolute] = rank
                break
    return [url for url, _ in sorted(ranked.items(), key=lambda pair: pair[1])]


def _is_public_host(host: str) -> bool:
    if not host or host == "localhost" or host.endswith((".local", ".internal", ".lan")):
        return False
    try:
        address = ipaddress.ip_address(host)
    except ValueError:
        return True
    return address.is_global


async def fetch_html(client: httpx.AsyncClient, url: str) -> tuple[str, str] | None:
    """Descarga una página. Devuelve (url_final, html) o None si no es HTML o no existe."""
    async with client.stream("GET", url) as response:
        if response.status_code in (403, 429) or response.status_code >= 500:
            raise EnrichError(f"HTTP {response.status_code} en {url}")
        if response.status_code >= 400:
            return None
        if "html" not in response.headers.get("content-type", "text/html").lower():
            return None
        chunks, size = [], 0
        async for chunk in response.aiter_bytes():
            chunks.append(chunk)
            size += len(chunk)
            if size >= MAX_BODY_BYTES:
                break
        encoding = response.encoding or "utf-8"
        try:
            html = b"".join(chunks).decode(encoding, errors="replace")
        except LookupError:
            html = b"".join(chunks).decode("utf-8", errors="replace")
        return str(response.url), html


async def crawl_site(
    client: httpx.AsyncClient,
    website: str,
    strict_b2b_only: bool,
    mx_checker: MxChecker = has_mx,
    allow_private_hosts: bool = False,
) -> EnrichResult:
    """Rastrea la home y las páginas de contacto/legales de un dominio y clasifica el resultado."""
    host = host_of(website)
    if not host or (not allow_private_hosts and not _is_public_host(host)):
        return EnrichResult(status=db.NO_CORPORATE_EMAIL, note="web no válida")
    if any(host == social or host.endswith("." + social) for social in SOCIAL_HOSTS):
        profile = social_profile(website)
        return EnrichResult(
            status=db.NO_CORPORATE_EMAIL, note="la web es un perfil social",
            social_links={profile[0]: profile[1]} if profile else {},
        )

    home: tuple[str, str] | None = None
    last_error = ""
    errors: list[str] = []
    # Siempre se prueba primero por HTTPS, aunque Google Maps tenga guardada la web como http://
    without_scheme = website.split("://", 1)[1] if "://" in website else website
    attempts = ["https://" + without_scheme, "http://" + without_scheme]
    for attempt_url in attempts:
        try:
            home = await fetch_html(client, attempt_url)
            last_error = ""
            break
        except httpx.HTTPError as exc:
            last_error = f"{type(exc).__name__}: {exc}"
            errors.append(f"{attempt_url.split('://', 1)[0]}: {last_error[:140]}")
    if last_error:
        raise EnrichError(f"no se pudo abrir la home ({' | '.join(errors)})")
    if home is None:
        return EnrichResult(status=db.NO_CORPORATE_EMAIL, note="la home no existe o no es HTML")

    home_url, home_html = home
    if _CHALLENGE_RE.search(home_html[:6000]):
        # Página de «comprobando tu navegador»: no es la web real, así que no vale como «sin email».
        raise EnrichError("la web está tras una protección anti-robots (Cloudflare o similar)")
    site_root = root_domain_of_host(host_of(home_url)) or root_domain_of_host(host)
    result = EnrichResult(status=db.NO_CORPORATE_EMAIL)
    candidates: list[EmailCandidate] = []

    def absorb(url: str, html: str, rank: int) -> BeautifulSoup:
        soup = BeautifulSoup(html, "html.parser")
        result.has_contact_form = result.has_contact_form or detect_contact_form(soup)
        result.has_whatsapp_link = result.has_whatsapp_link or detect_whatsapp(html)
        for network, link in extract_social_links(soup).items():
            result.social_links.setdefault(network, link)
        for email, via_mailto in extract_emails(html, soup):
            reason = reject_reason(email, strict_b2b_only)
            if reason:
                result.discarded[reason] = result.discarded.get(reason, 0) + 1
            elif not any(existing.email == email for existing in candidates):
                candidates.append(EmailCandidate(email, url, via_mailto, rank))
        return soup

    home_soup = absorb(home_url, home_html, 0)
    queue = relevant_links(home_soup, home_url, site_root)
    base = f"{urlsplit(home_url).scheme}://{urlsplit(home_url).netloc}"
    known_paths = {urlsplit(url).path.rstrip("/").lower() for url in queue}
    queue += [base + path for path in FALLBACK_PATHS if path not in known_paths]
    result.services_summary = summarize_services(home_soup)

    visited = {home_url.rstrip("/")}
    rank = 0
    for url in queue:
        if len(visited) >= MAX_PAGES_PER_DOMAIN:
            break
        if url.rstrip("/") in visited:
            continue
        visited.add(url.rstrip("/"))
        rank += 1
        try:
            page = await fetch_html(client, url)
        except (httpx.HTTPError, EnrichError):
            continue
        if page is not None:
            absorb(page[0], page[1], rank)
        if any(root_domain_of_host(c.email.split("@")[1]) == site_root and c.via_mailto for c in candidates):
            break  # ya hay un email propio y explícito: no hace falta seguir rastreando

    remaining = list(candidates)
    while remaining:
        best = choose_email(remaining, site_root)
        if best is None:
            break
        remaining.remove(best)
        if await mx_checker(best.email.split("@")[1]):
            result.status = db.ENRICHED
            result.email = best.email
            result.email_type = email_type(best.email)
            result.source_url = best.source_url
            return result
        result.discarded["no_mx"] = result.discarded.get("no_mx", 0) + 1
    result.note = "sin email corporativo válido" + (f" (descartados: {result.discarded})" if result.discarded else "")
    return result


# ── Orquestación ────────────────────────────────────────────────────────────


@dataclass
class EnrichStats:
    total: int = 0
    enriched: int = 0
    no_corporate_email: int = 0
    errors: int = 0


def retry_delay(attempts: int) -> timedelta:
    """Espera exponencial antes de reintentar: 30 min, 1 h, 2 h... hasta 48 h."""
    return timedelta(minutes=min(30 * (2 ** max(attempts - 1, 0)), 48 * 60))


def _save(conn: sqlite3.Connection, lead_id: int, attempts: int, result: EnrichResult | None, error: str) -> str:
    now = db.utcnow()
    with db.transaction(conn):
        if result is None:
            conn.execute(
                "UPDATE leads SET status=?, enrich_attempts=?, retry_after=?, last_error=?, updated_at=? "
                "WHERE id=? AND status IN (?, ?)",
                (db.ERROR, attempts, db.iso(now + retry_delay(attempts)), error[:500], db.iso(now), lead_id, db.NEW, db.ERROR),
            )
            return db.ERROR
        conn.execute(
            "UPDATE leads SET status=?, email=?, email_domain=?, email_type=?, source_url=?, has_contact_form=?, "
            "has_whatsapp_link=?, services_summary=?, social_links=?, enrich_attempts=?, retry_after=NULL, last_error=?, updated_at=? "
            "WHERE id=? AND status IN (?, ?)",
            (
                result.status, result.email, result.email.split("@")[1] if result.email else None,
                result.email_type, result.source_url, int(result.has_contact_form),
                int(result.has_whatsapp_link), result.services_summary,
                json.dumps(result.social_links, ensure_ascii=False) if result.social_links else None, attempts,
                result.note or None, db.iso(now), lead_id, db.NEW, db.ERROR,
            ),
        )
        return result.status


async def run_enrichment(
    conn: sqlite3.Connection,
    concurrency: int = DEFAULT_CONCURRENCY,
    retry_errors: bool = False,
    campaign_name: str | None = None,
    limit: int | None = None,
    on_progress: Callable[[str], None] | None = None,
    mx_checker: MxChecker = has_mx,
    allow_private_hosts: bool = False,
) -> EnrichStats:
    settings = get_settings()
    statuses = [db.NEW]
    sql = "SELECT id, website, enrich_attempts FROM leads WHERE (status = ?"
    params: list[object] = [db.NEW]
    if retry_errors:
        sql += " OR (status = ? AND (retry_after IS NULL OR retry_after <= ?))"
        params += [db.ERROR, db.iso()]
        statuses.append(db.ERROR)
    sql += ")"
    if campaign_name:
        sql += " AND campaign_name = ?"
        params.append(campaign_name)
    sql += " ORDER BY id"
    if limit:
        sql += " LIMIT ?"
        params.append(limit)
    leads = conn.execute(sql, params).fetchall()
    stats = EnrichStats(total=len(leads))
    if mx_checker is has_mx and any(lead["website"] for lead in leads):
        await dns_self_check()
    semaphore = asyncio.Semaphore(max(1, concurrency))

    async with httpx.AsyncClient(
        timeout=REQUEST_TIMEOUT,
        follow_redirects=True,
        max_redirects=5,
        headers={"User-Agent": settings.user_agent, "Accept": "text/html,application/xhtml+xml", "Accept-Language": "es,en;q=0.8"},
        limits=httpx.Limits(max_connections=max(20, concurrency * 2)),
    ) as client:

        async def worker(lead: sqlite3.Row) -> None:
            attempts = int(lead["enrich_attempts"]) + 1
            result: EnrichResult | None = None
            error = ""
            if not lead["website"]:
                result = EnrichResult(status=db.NO_CORPORATE_EMAIL, note="sin web en Google Maps")
            else:
                async with semaphore:
                    try:
                        async with asyncio.timeout(DOMAIN_TIMEOUT_SECONDS):
                            result = await crawl_site(
                                client, str(lead["website"]), settings.strict_b2b_only, mx_checker, allow_private_hosts
                            )
                    except TimeoutError:
                        error = f"timeout: el dominio tardó más de {int(DOMAIN_TIMEOUT_SECONDS)} s"
                    except EnrichError as exc:
                        error = str(exc)
                    except Exception as exc:  # una web rota no puede tumbar el lote entero
                        error = f"{type(exc).__name__}: {exc}"
            status = _save(conn, int(lead["id"]), attempts, result, error)
            if status == db.ENRICHED:
                stats.enriched += 1
            elif status == db.ERROR:
                stats.errors += 1
            else:
                stats.no_corporate_email += 1
            log(
                logger, logging.INFO if status != db.ERROR else logging.WARNING, "lead_enriched",
                lead_id=int(lead["id"]), status=status, email=result.email if result else None,
                source_url=result.source_url if result else None, error=error or None,
            )
            if on_progress:
                on_progress(status)

        await asyncio.gather(*(worker(lead) for lead in leads))
    return stats
