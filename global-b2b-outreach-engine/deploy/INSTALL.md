# Instalación en un servidor (Ubuntu 24.04)

Pensado para un servidor virtual pequeño (1 CPU, 1 GB de RAM basta) con Ubuntu 24.04, que trae Python 3.12.
En Ubuntu 22.04 hay que instalar antes Python 3.11 o superior. Necesitas acceso por SSH con un usuario que pueda usar `sudo`
y un subdominio apuntando a la IP del servidor, por ejemplo `panel.tudominio.com`.

Todo lo que va entre `<…>` lo sustituyes por tu dato.

## 1. Preparar el servidor

```bash
sudo apt update && sudo apt install -y python3-venv python3-pip unzip caddy
sudo useradd --system --create-home --home-dir /opt/global-b2b-outreach-engine --shell /usr/sbin/nologin outreach
```

## 2. Subir el código

En GitHub, abre el repositorio `viajai`, elige la rama `claude/global-b2b-outreach-engine-usf73l` y pulsa **Code → Download ZIP**.
Desde tu ordenador:

```bash
scp viajai-*.zip <usuario>@<ip-del-servidor>:/tmp/motor.zip
```

En el servidor:

```bash
cd /tmp && unzip -q motor.zip
sudo cp -r /tmp/viajai-*/global-b2b-outreach-engine/. /opt/global-b2b-outreach-engine/
sudo chown -R outreach: /opt/global-b2b-outreach-engine
```

## 3. Instalar y comprobar

```bash
cd /opt/global-b2b-outreach-engine
sudo -u outreach python3 -m venv .venv
sudo -u outreach .venv/bin/pip install -r requirements.txt
sudo -u outreach .venv/bin/python -m pytest tests -q      # debe terminar en «35 passed»
```

## 4. Configurar

```bash
sudo -u outreach cp .env.example .env
sudo -u outreach cp accounts.example.json accounts.json
sudo chmod 600 .env accounts.json
sudo -u outreach nano .env
```

En `.env` rellena como mínimo:

| Variable | Qué poner |
|---|---|
| `APIFY_TOKEN` | Tu clave de Apify (Settings → API & Integrations) |
| `ANTHROPIC_API_KEY` | Tu clave de Anthropic (console.anthropic.com) |
| `COMPANY_NAME`, `TAX_ID`, `FISCAL_ADDRESS` | Razón social, CIF y domicilio fiscal: salen en el pie de cada correo |
| `PRIVACY_URL` | Dirección de tu política de privacidad |
| `SENDER_NAME` | Quién firma los correos |
| `PUBLIC_BASE_URL` | `https://panel.tudominio.com` (sin barra final) |
| `DASHBOARD_TOKEN` | Una clave larga para entrar al panel. Genérala con `openssl rand -hex 24` |
| `WEBHOOK_SECRET` | Otra clave larga, para el aviso de mensajes de WhatsApp |

Después edita `accounts.json` con los buzones desde los que se envía (`sudo -u outreach nano accounts.json`).
Empieza con `daily_limit` de 5 a 10 por buzón.

## 5. Arrancar el servicio

Con el panel solo hace falta un servicio. **No actives `outreach-sender`**: los envíos se inician y se paran desde el panel.

```bash
sudo cp deploy/systemd/outreach-webhook.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now outreach-webhook
curl -s http://127.0.0.1:8080/health          # debe responder {"status":"ok"}
```

## 6. Publicarlo con HTTPS

```bash
sudo tee /etc/caddy/Caddyfile >/dev/null <<'CADDY'
panel.tudominio.com {
    reverse_proxy 127.0.0.1:8080
}
CADDY
sudo systemctl reload caddy
```

Caddy pide y renueva solo el certificado. Abre los puertos 80 y 443 en el cortafuegos del proveedor.

## 7. Comprobar desde fuera

1. `https://panel.tudominio.com/health` responde `{"status":"ok"}`.
2. `https://panel.tudominio.com/panel` pide la clave; con `DASHBOARD_TOKEN` entras y ves los cuatro botones.
3. Pulsa **Buscar emails** con la base vacía: debe aparecer en el historial como «Terminado».
4. En el panel, «Para poder enviar» debe tener todo en «Hecho» antes de iniciar envíos.

## 8. Antes del primer envío real

- Dominio de envío con SPF, DKIM y DMARC (guía en el `README.md`).
- Lanza **Extraer**, **Buscar emails** y **Redactar** con un máximo de 5 negocios, y lee los correos en «Ejemplo de correo que sale».
- Solo entonces, **Iniciar envíos**.

## Mantenimiento

```bash
journalctl -u outreach-webhook -f                              # ver qué hace, en vivo
sudo systemctl restart outreach-webhook                        # reiniciar (los envíos en marcha se reanudan solos)
sudo -u outreach cp data/leads.db data/leads-$(date +%F).db    # copia de seguridad de la base de datos
```

Para actualizar: repite el paso 2 (no pisa `.env`, `accounts.json` ni `data/`, porque no vienen en el ZIP), después
`sudo -u outreach .venv/bin/pip install -r requirements.txt` y reinicia el servicio.
