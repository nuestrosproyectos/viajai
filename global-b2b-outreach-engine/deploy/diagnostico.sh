#!/usr/bin/env bash
# Diagnóstico de solo lectura del servidor antes de instalar el motor.
# No cambia nada. Uso:  ssh <usuario>@<ip> 'bash -s' < deploy/diagnostico.sh
set -u
titulo() { printf '\n===== %s =====\n' "$1"; }

titulo "Sistema"
grep PRETTY_NAME /etc/os-release; uname -r; uptime
python3 --version 2>&1

titulo "Disco (¿hay sitio?)"
df -h / | tail -1
echo "-- Lo que más ocupa en / (puede tardar):"
sudo du -xh --max-depth=1 / 2>/dev/null | sort -h | tail -8
command -v docker >/dev/null && { echo "-- Docker:"; sudo docker system df 2>/dev/null; }

titulo "Memoria"
free -h

titulo "Contenedores Docker"
command -v docker >/dev/null && sudo docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}' || echo "Docker no instalado"

titulo "Servicios propios en marcha"
systemctl list-units --type=service --state=running --no-pager --no-legend | grep -vE 'systemd|dbus|cron|ssh|getty|polkit|rsyslog|udisks|unattended|multipathd|networkd|resolved|snapd|serial|user@|qemu|containerd|docker|chrony|ModemManager|fwupd|packagekit|irqbalance|upower|thermald|accounts-daemon|apport|atd|cloud' || true

titulo "Puertos abiertos (80 y 443 los necesita Caddy)"
sudo ss -ltnp | awk 'NR==1 || /LISTEN/'

titulo "Cortafuegos"
sudo ufw status 2>/dev/null || echo "ufw no instalado"

titulo "Proxy web ya instalado"
for s in caddy nginx apache2 traefik; do systemctl is-active --quiet "$s" && echo "$s: ACTIVO"; done; echo "(si no sale nada, ninguno activo como servicio)"

titulo "Motor de envíos"
ls -la /opt/global-b2b-outreach-engine 2>/dev/null || echo "No instalado todavía"

titulo "Puerto 25 saliente (no lo necesitamos; enviamos por 587/465)"
timeout 5 bash -c '</dev/tcp/smtp.gmail.com/587' 2>/dev/null && echo "587 abierto" || echo "587 BLOQUEADO"
