"""Módulos del pipeline. Sus nombres empiezan por dígito, así que se cargan con `load()`."""
from __future__ import annotations

import importlib
from types import ModuleType

_NAMES = {
    "extractor": "modules.1_apify_extractor",
    "enricher": "modules.2_web_enricher",
    "copywriter": "modules.3_ai_copywriter",
    "server": "modules.4_compliance_webhook_server",
    "sender": "modules.5_sender_daemon",
    "dashboard": "modules.6_dashboard",
}


def load(name: str) -> ModuleType:
    """Devuelve el módulo del pipeline por su alias (extractor, enricher, ...)."""
    if name not in _NAMES:
        raise KeyError(f"Módulo desconocido: {name}. Válidos: {', '.join(_NAMES)}")
    return importlib.import_module(_NAMES[name])
