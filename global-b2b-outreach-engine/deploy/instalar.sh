#!/usr/bin/env bash
# Instala o actualiza el motor en un servidor Ubuntu 24.04. Ejecutar como root.
#   curl -fsSL https://raw.githubusercontent.com/nuestrosproyectos/viajai/<rama>/global-b2b-outreach-engine/deploy/instalar.sh | bash
# Es seguro repetirlo: no pisa .env, accounts.json ni data/ (la base de datos).
# No instala el proxy HTTPS (Caddy): eso va aparte, cuando el subdominio ya apunte al servidor.
set -euo pipefail

RAMA="${RAMA:-claude/kind-maxwell-uq5vsh}"
DESTINO="${DESTINO:-/opt/global-b2b-outreach-engine}"
USUARIO=outreach
ZIP_URL="https://codeload.github.com/nuestrosproyectos/viajai/zip/refs/heads/${RAMA}"

paso() { printf '\n>>> %s\n' "$1"; }
[ "$(id -u)" = 0 ] || { echo "Ejecútalo como root (o con sudo)."; exit 1; }

paso "1/6 Paquetes del sistema"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq python3-venv python3-pip unzip curl >/dev/null
python3 -c 'import sys; assert sys.version_info >= (3, 11), "Hace falta Python 3.11 o superior"'

paso "2/6 Usuario del servicio"
id "$USUARIO" >/dev/null 2>&1 || useradd --system --create-home --home-dir "$DESTINO" --shell /usr/sbin/nologin "$USUARIO"
mkdir -p "$DESTINO"

paso "3/6 Código (rama $RAMA)"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
curl -fsSL "$ZIP_URL" -o "$TMP/motor.zip"
unzip -q "$TMP/motor.zip" -d "$TMP"
ORIGEN="$(find "$TMP" -maxdepth 2 -type d -name global-b2b-outreach-engine | head -1)"
[ -n "$ORIGEN" ] || { echo "No encuentro el motor dentro del ZIP"; exit 1; }
cp -r "$ORIGEN"/. "$DESTINO"/
chown -R "$USUARIO": "$DESTINO"

paso "4/6 Dependencias y pruebas"
cd "$DESTINO"
[ -x .venv/bin/python ] || sudo -u "$USUARIO" python3 -m venv .venv
sudo -u "$USUARIO" .venv/bin/pip install -q --upgrade pip
sudo -u "$USUARIO" .venv/bin/pip install -q -r requirements.txt
sudo -u "$USUARIO" .venv/bin/python -m pytest tests -q -p no:cacheprovider | tail -1

paso "5/6 Configuración"
if [ ! -f .env ]; then
  cp .env.example .env
  sed -i "s|^DASHBOARD_TOKEN=.*|DASHBOARD_TOKEN=$(openssl rand -hex 24)|" .env
  sed -i "s|^WEBHOOK_SECRET=.*|WEBHOOK_SECRET=$(openssl rand -hex 24)|" .env
  echo "Creado .env con claves del panel y del webhook generadas. Faltan Apify, Anthropic y datos legales."
else
  echo ".env ya existía: no se toca."
fi
[ -f accounts.json ] || cp accounts.example.json accounts.json
mkdir -p data
chown -R "$USUARIO": "$DESTINO"
chmod 600 .env accounts.json

paso "6/6 Servicio (panel, bajas y WhatsApp en 127.0.0.1:8080)"
cp deploy/systemd/outreach-webhook.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable outreach-webhook >/dev/null 2>&1
systemctl restart outreach-webhook
for _ in $(seq 1 15); do curl -fs http://127.0.0.1:8080/health >/dev/null 2>&1 && break; sleep 1; done
if curl -fs http://127.0.0.1:8080/health; then
  echo; echo "OK: el motor está en marcha."
else
  echo "El servicio no responde. Últimas líneas del registro:"; journalctl -u outreach-webhook -n 30 --no-pager; exit 1
fi
echo "La clave del panel está en $DESTINO/.env (DASHBOARD_TOKEN). No la pegues en capturas."
