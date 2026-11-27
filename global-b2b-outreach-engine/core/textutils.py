"""Normalización de teléfonos, dominios y emails compartida por todos los módulos."""
from __future__ import annotations

import re
import unicodedata
from urllib.parse import urlsplit

import phonenumbers

# Sufijos públicos de dos niveles más habituales (para sacar el dominio raíz sin dependencias).
_SECOND_LEVEL = {"co", "com", "net", "org", "gov", "gob", "edu", "ac", "or", "ne", "nom", "ltd", "plc"}

# Dominios que no identifican a una empresa: redes sociales, constructores de webs, agregadores.
SHARED_HOST_DOMAINS = frozenset({
    "facebook.com", "instagram.com", "twitter.com", "x.com", "linkedin.com", "youtube.com",
    "tiktok.com", "pinterest.com", "wa.me", "whatsapp.com", "t.me", "linktr.ee", "google.com",
    "business.site", "goo.gl", "bit.ly", "wixsite.com", "wix.com", "wordpress.com", "blogspot.com",
    "weebly.com", "webnode.es", "webnode.com", "jimdofree.com", "jimdosite.com", "godaddysites.com",
    "site123.me", "squarespace.com", "shopify.com", "myshopify.com", "webador.es", "ueniweb.com",
    "negocio.site", "paginasamarillas.es", "habitissimo.es", "cronoshare.com", "yelp.com",
    "tripadvisor.com", "tripadvisor.es", "booking.com", "doctoralia.es", "milanuncios.com",
    "pagesjaunes.fr", "gelbeseiten.de", "paginegialle.it", "yell.com", "carrd.co", "canva.site",
})

FREE_EMAIL_DOMAINS = frozenset({
    "gmail.com", "googlemail.com", "icloud.com", "me.com", "mac.com", "aol.com", "proton.me",
    "protonmail.com", "pm.me", "yandex.com", "yandex.ru", "mail.com", "mail.ru", "zoho.com",
    "telefonica.net", "movistar.es", "terra.es", "orange.fr", "wanadoo.fr", "wanadoo.es", "free.fr",
    "laposte.net", "sfr.fr", "t-online.de", "web.de", "freenet.de", "libero.it", "virgilio.it",
    "tiscali.it", "alice.it", "sapo.pt", "ono.com", "ya.com", "msn.com", "btinternet.com",
    "tutanota.com", "tuta.io", "hey.com", "fastmail.com", "qq.com", "163.com", "uol.com.br",
    "bol.com.br", "ymail.com", "rocketmail.com",
})
# Proveedores gratuitos con muchas variantes por país: hotmail.es, yahoo.co.uk, gmx.de...
FREE_EMAIL_PREFIXES = ("hotmail.", "yahoo.", "outlook.", "live.", "gmx.")

EMAIL_RE = re.compile(r"[A-Za-z0-9][A-Za-z0-9._%+\-]{0,63}@[A-Za-z0-9](?:[A-Za-z0-9\-]{0,62}\.)+[A-Za-z]{2,24}")


def host_of(url: str) -> str:
    """Host en minúsculas de una URL (acepta URLs sin esquema)."""
    url = (url or "").strip()
    if not url:
        return ""
    if "://" not in url:
        url = "http://" + url
    try:
        host = urlsplit(url).hostname or ""
    except ValueError:
        return ""
    return host.lower().rstrip(".")


def root_domain_of_host(host: str) -> str:
    host = host.lower().strip(".")
    if host.startswith("www."):
        host = host[4:]
    parts = host.split(".")
    if len(parts) < 2 or re.fullmatch(r"[\d.]+", host):
        return ""
    if len(parts) >= 3 and len(parts[-1]) == 2 and parts[-2] in _SECOND_LEVEL:
        return ".".join(parts[-3:])
    return ".".join(parts[-2:])


def root_domain(url: str) -> str | None:
    """Dominio raíz propio de la empresa, o None si la web vive en una plataforma compartida."""
    host = host_of(url)
    if not host:
        return None
    root = root_domain_of_host(host)
    if not root:
        return None
    if root in SHARED_HOST_DOMAINS or host in SHARED_HOST_DOMAINS:
        return None
    return root


def normalize_website(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""
    if "://" not in url:
        url = "https://" + url
    return url


def to_e164(raw: str | None, country_code: str) -> str | None:
    """Teléfono en formato E.164 (+34958123456) o None si no es un número válido."""
    if not raw or not str(raw).strip():
        return None
    try:
        parsed = phonenumbers.parse(str(raw), country_code.upper() or None)
    except phonenumbers.NumberParseException:
        return None
    if not phonenumbers.is_possible_number(parsed) or not phonenumbers.is_valid_number(parsed):
        return None
    return phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)


def phone_candidates(raw: str | None) -> list[str]:
    """Posibles E.164 de un número que llega por WhatsApp (dígitos con prefijo de país, sin '+')."""
    if not raw:
        return []
    digits = re.sub(r"\D", "", str(raw).split("@", 1)[0].split(":", 1)[0])
    if len(digits) < 8 or len(digits) > 15:
        return []
    return ["+" + digits.lstrip("0")]


def is_free_email_domain(domain: str) -> bool:
    domain = domain.lower()
    return domain in FREE_EMAIL_DOMAINS or domain.startswith(FREE_EMAIL_PREFIXES)


def ascii_slug(text: str) -> str:
    """Solo letras A-Z y dígitos, en mayúsculas y sin acentos."""
    normalized = unicodedata.normalize("NFKD", text)
    return re.sub(r"[^A-Z0-9]", "", normalized.encode("ascii", "ignore").decode().upper())
