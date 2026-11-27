# global-b2b-outreach-engine

Sistema para captar colaboradores y clientes B2B en cualquier país a partir de Google Maps. Hace cinco cosas, en este orden:

1. **Extrae** negocios de Google Maps con la API oficial de Apify.
2. **Enriquece**: visita la web de cada negocio y busca un email corporativo válido, guardando la página exacta donde lo encontró.
3. **Redacta** con IA un primer correo y dos seguimientos, personalizados con un dato real de su web.
4. **Envía** desde varias cuentas, despacio, en horario laboral del destinatario y con baja en un clic.
5. **Atribuye**: cada correo lleva un enlace `wa.me` con un mensaje ya escrito y una referencia (`[Ref: GR-8F3A]`). Cuando el profesional escribe por WhatsApp, el sistema sabe quién es, lo marca como convertido y deja de escribirle por email.

La idea de fondo: el correo no vende nada ni pide una llamada. Solo invita a que sea **el propio profesional quien abra la conversación por WhatsApp**. Eso da un consentimiento claro y una conversación que ya empieza con interés.

## Puesta en marcha

Requiere Python 3.11 o superior.

```bash
cd global-b2b-outreach-engine
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env                       # claves y datos legales de tu empresa
cp accounts.example.json accounts.json     # cuentas de correo desde las que se envía
python -m pytest tests -q                  # 32 pruebas; no llaman a ningún servicio externo
```

En `.env` son obligatorios `APIFY_TOKEN`, `ANTHROPIC_API_KEY`, los datos legales (`COMPANY_NAME`, `TAX_ID`, `FISCAL_ADDRESS`, `PRIVACY_URL`) y `PUBLIC_BASE_URL`, que es la dirección pública del servidor de bajas. Sin los datos legales el sistema se niega a redactar o enviar.

## Uso diario

```bash
python cli.py extract  --campaign campaigns/example_campaign.json   # 1. Google Maps → base de datos
python cli.py enrich   --concurrency 15                             # 2. webs → email corporativo
python cli.py enrich   --retry-errors                               #    reintenta webs que fallaron
python cli.py generate --campaign colaboradores_espana_test --dry-run   # 3. cuánto costará
python cli.py generate --campaign colaboradores_espana_test --limit 20  #    redacta 20 leads
python cli.py send     --dry-run                                    # 4. qué se enviaría ahora mismo
python cli.py send     --live                                       #    envía de verdad (se queda en marcha)
python cli.py stats                                                 # 5. embudo completo
python cli.py accounts                                              #    uso y pausas de cada cuenta
python cli.py serve    --port 8080                                  #    servidor de bajas y WhatsApp
python cli.py dashboard --out panel.html                            #    panel web con el estado actual
```

`send` sin opciones equivale a `--dry-run`: nunca envía por accidente. `send --live --once` hace una pasada y termina.

### Estados de un lead

`NEW` → `ENRICHED` → `READY` → `CONTACTED` → `CONVERTED_TO_WA` / `REPLIED` / `UNSUBSCRIBED` / `BOUNCED`

Otros: `DUPLICATE` (misma cadena: comparte dominio o teléfono con otro lead), `NO_CORPORATE_EMAIL`, `ERROR` (web caída; se reintenta con espera creciente). Volver a extraer o enriquecer **nunca** pisa un lead que ya está en `CONTACTED` o más allá.

## Cómo configurar una campaña

Una campaña es un JSON en `campaigns/`. Cambiar de nicho o de país es copiar el fichero y cambiar valores; no se toca código. Si algo está mal (zona horaria inventada, plantilla sin `{lead_ref}`, hora de fin anterior a la de inicio…) el sistema lo dice antes de gastar un céntimo.

| Campo | Qué es | Ejemplo |
|---|---|---|
| `campaign_name` | Identificador único, en minúsculas y sin espacios | `"colaboradores_espana_test"` |
| `niche_label` | El sector tal como se dice hablando, en plural | `"averías de fontanería"` |
| `city_label` | Ciudad o provincia; sus dos primeras letras son el prefijo de la referencia | `"Granada"` → `GR-8F3A` |
| `search_terms` | Lo que escribirías en el buscador de Google Maps | `["empresa de fontanería", "fontanero urgente"]` |
| `locations` | Ubicaciones para Apify (se lanza una búsqueda por cada una) | `["Granada, Spain"]` |
| `country_code` | País en ISO-2; se usa para normalizar teléfonos | `"ES"` |
| `language` | Idioma de los correos: `es`, `en`, `fr`, `de`, `it`, `pt` | `"es"` |
| `timezone` | Zona horaria IANA del destinatario | `"Europe/Madrid"` |
| `business_hours_start` / `_end` | Ventana de envío en hora local | `"09:00"` / `"19:00"` |
| `max_places_per_search` | Tope de negocios por búsqueda (controla el coste de Apify) | `50` |
| `whatsapp_number` | Tu WhatsApp, formato internacional sin `+` ni espacios | `"34600111222"` |
| `whatsapp_prefill_template` | Mensaje que el lead verá ya escrito. Admite `{business_name}`, `{city_label}`, `{niche_label}` y `{lead_ref}` (obligatoria) | ver ejemplo |
| `offer_context` *(opcional)* | Qué ofreces, con tus palabras. Es lo que más mejora los correos | «Recibimos avisos… sin cuotas ni permanencia» |
| `category_filter` *(opcional)* | Solo guarda negocios cuya categoría de Google contenga alguna de estas palabras (sin distinguir acentos). Vacío = todos | `["fontaner", "calefacci"]` |
| `sender_name` *(opcional)* | Quién firma; por defecto `SENDER_NAME` del `.env` | `"Laura Martín"` |
| `send_weekdays` *(opcional)* | Días de envío, 1 = lunes | `[1,2,3,4,5]` |
| `followup_1_days` / `followup_2_days` *(opcional)* | Días tras el primer correo | `3` / `7` |

Para abrir Málaga en reformas: copia el ejemplo, cambia `campaign_name`, `niche_label` a `"reformas"`, `city_label` a `"Málaga"`, los `search_terms`, `locations` a `["Málaga, Spain"]` y adapta `offer_context`. Para Francia, además `country_code: "FR"`, `language: "fr"`, `timezone: "Europe/Paris"`.

## Lo que cuesta

- **Apify** (plan Bronze, precios consultados el 27-11-2026): 0,003 $ por negocio + 0,001 $ por el filtro de cerrados = **unos 4 $ por cada 1.000 negocios**. `extract` muestra el tope antes de lanzar.
- **IA** (Claude Haiku 4.5, 1 $ / 5 $ por millón de tokens): alrededor de **0,005 $ por lead**, es decir unos 5 $ por cada 1.000 leads redactados. `generate --dry-run` da la cifra para tu lote sin llamar a la API.

## DNS: guía rápida de entregabilidad

Envía siempre desde un **dominio aparte** del principal (por ejemplo `colabora-tudominio.com`) para no arriesgar la reputación del correo del negocio. En ese dominio hacen falta tres registros TXT:

**SPF** — qué servidores pueden enviar en nombre del dominio. Uno solo por dominio.

```
Tipo: TXT   Nombre: @   Valor: v=spf1 include:_spf.tuproveedor.com -all
```

**DKIM** — firma cada correo. La clave la genera tu proveedor de correo (Google Workspace, Microsoft 365, Zoho…) en su panel; tú solo copias el registro.

```
Tipo: TXT   Nombre: selector1._domainkey   Valor: v=DKIM1; k=rsa; p=MIIBIjANBgkq…
```

**DMARC** — qué hacer con lo que no pase SPF/DKIM y dónde recibir informes. Empieza en `none`, mira los informes dos semanas y sube a `quarantine`.

```
Tipo: TXT   Nombre: _dmarc   Valor: v=DMARC1; p=none; rua=mailto:dmarc@colabora-tudominio.com; adkim=s; aspf=s
```

Comprobación desde la terminal:

```bash
dig +short TXT colabora-tudominio.com
dig +short TXT selector1._domainkey.colabora-tudominio.com
dig +short TXT _dmarc.colabora-tudominio.com
```

Además:

- **Calentamiento**: una cuenta nueva empieza con `daily_limit` de 5-10 y sube poco a poco hasta 30-40 en tres o cuatro semanas. Más de eso por buzón acaba en spam.
- **Baja en un clic**: el servidor de bajas debe estar publicado en HTTPS en `PUBLIC_BASE_URL` antes del primer envío. Gmail y Outlook llaman a esa dirección cuando el destinatario pulsa «Cancelar suscripción».
- El motor ya pone por ti las cabeceras `List-Unsubscribe` y `List-Unsubscribe-Post`, espera entre 90 y 240 segundos entre envíos y manda texto con una versión HTML mínima, sin imágenes ni píxeles de seguimiento.

## Cuentas de envío (`accounts.json`)

Una entrada por buzón, con sus datos SMTP e IMAP y su `daily_limit`. El motor rota entre ellas por turnos. Los seguimientos salen siempre del mismo buzón que abrió el hilo, como respuesta al primer correo.

**Cortafuegos de reputación**: si un buzón acumula `MAX_ACCOUNT_ERRORS` errores SMTP o `MAX_ACCOUNT_BOUNCES` rebotes en una sesión, se pausa solo, lo deja escrito en la base de datos y avisa (en el log, en pantalla y, si rellenas `ALERT_WEBHOOK_URL`, por POST a Slack, n8n o Make). Sigue pausado aunque reinicies, hasta que lo reactives:

```bash
python cli.py accounts --resume laura@colabora-tudominio.com
```

## Servidor de bajas y WhatsApp

| Ruta | Para qué |
|---|---|
| `GET /unsubscribe/{token}` | Enlace del pie del correo. Da de baja el email **y su dominio**, cancela todo lo pendiente y muestra una página de confirmación en el idioma del lead |
| `POST /unsubscribe/{token}` | El botón de baja nativo de Gmail/Outlook (RFC 8058) |
| `POST /webhook/whatsapp-inbound` | Mensajes entrantes de WhatsApp. Localiza el lead por `[Ref: XXXX]` o por teléfono, lo marca `CONVERTED_TO_WA` y cancela los correos pendientes |
| `GET /webhook/whatsapp-inbound` | Verificación que exige Meta al dar de alta el webhook |
| `GET /panel` | Panel de control: embudo, cola de envío, leads, cuentas, actividad y **botones para extraer, buscar emails, redactar e iniciar o parar los envíos**. Solo existe si defines `DASHBOARD_TOKEN`; se entra con esa clave |
| `GET /health` | Comprobación de vida |

El webhook entiende tres formatos sin configurar nada:

- **WhatsApp Cloud API (Meta)**: pon `WHATSAPP_APP_SECRET` (valida la firma `X-Hub-Signature-256`) y `WHATSAPP_VERIFY_TOKEN`.
- **Evolution API**: evento `messages.upsert`. Añade la cabecera `X-Webhook-Secret: <WEBHOOK_SECRET>`.
- **Make, n8n, GoHighLevel**: un JSON plano como `{"phone": "34611222333", "message": "Hola… [Ref: GR-8F3A]"}` con la cabecera `X-Webhook-Secret` o `?secret=` en la URL.

Sin `WEBHOOK_SECRET` ni `WHATSAPP_APP_SECRET` el webhook rechaza todas las peticiones.

## Panel de control

Con `DASHBOARD_TOKEN` definido, abre `https://tu-servidor/panel` e introduce la clave. Desde ahí se lanza todo sin terminal:

1. **Extraer de Google Maps** y 3. **Redactar correos** cuestan dinero: el panel muestra el coste aproximado y exige marcar una casilla.
2. **Buscar emails** es gratis.
4. **Iniciar envíos** exige confirmar que son correos reales; el botón pasa a ser **Parar envíos**. Si el servidor se reinicia con los envíos en marcha, se reanudan solos.

Solo puede haber un motor de envío a la vez: si usas el panel para enviar, no actives además el servicio `outreach-sender` (el segundo se negaría a arrancar). El panel no se puede usar con varios procesos de uvicorn (`--workers`): déjalo en uno, como viene.

## Servicios systemd

Los ficheros están en `deploy/systemd/`. Suponen el proyecto en `/opt/global-b2b-outreach-engine` con su `.venv` y un usuario `outreach`.

```bash
sudo useradd --system --home /opt/global-b2b-outreach-engine outreach
sudo chown -R outreach: /opt/global-b2b-outreach-engine
sudo cp deploy/systemd/outreach-*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now outreach-webhook outreach-sender
journalctl -u outreach-sender -f        # logs en JSON, una línea por evento
```

El servidor escucha en `127.0.0.1:8080`; publícalo con tu proxy HTTPS. Con Caddy basta esto:

```
bajas.tudominio.com {
    reverse_proxy 127.0.0.1:8080
}
```

`extract`, `enrich` y `generate` se lanzan a mano o con cron cuando quieras alimentar el embudo; el daemon de envío recoge solo lo que vaya quedando listo.

## Garantías que da el motor

- **Nunca dos veces el mismo correo.** Cada paso de cada lead tiene una clave de idempotencia única en la base de datos y se reserva de forma atómica antes de conectar al SMTP. Si el proceso se corta a mitad de un envío, ese envío queda marcado como fallido y **no se repite**: preferimos perder un correo a duplicarlo.
- **Nunca fuera de horario.** Cada envío se comprueba contra la zona horaria y la ventana de su campaña en el momento de salir.
- **Nunca a quien dijo que no.** Antes de cada envío se consulta la lista de supresión y, si existe, `external_robinson_blocklist.csv` (una columna con emails, dominios como `@empresa.com` o teléfonos).
- **Respuestas y rebotes paran la secuencia.** El daemon lee las bandejas por IMAP sin marcar nada como leído: una respuesta humana detiene los seguimientos, una respuesta pidiendo la baja suprime el dominio, un rebote definitivo suprime el email. Las respuestas automáticas («estoy de vacaciones») se ignoran.
- **El enlace de WhatsApp no pasa por la IA.** El modelo escribe el texto con un marcador y Python lo sustituye por la URL calculada con `urllib.parse.quote`. La IA tampoco escribe el pie legal.
- **Trazabilidad.** La tabla `events` guarda qué pasó con cada lead y cuándo: de dónde salió su email, qué se le envió, cuándo se dio de baja.

## Cumplimiento legal: léelo antes de enviar

El sistema está construido para el contacto B2B más prudente posible: solo emails corporativos (con `STRICT_B2B_ONLY=true` se descartan Gmail, Hotmail y similares), prioridad a buzones genéricos (`info@`, `contacto@`) frente a los de personas, origen del dato citado en cada correo (art. 14 RGPD), identidad completa del remitente, baja en un clic y un máximo de tres mensajes por destinatario.

Dicho esto, con franqueza:

- **España: el correo en frío NO es seguro, ni siquiera entre empresas.** Comprobado en las fuentes oficiales (27-11-2026):
  - El art. 21.1 LSSI prohíbe los correos publicitarios o promocionales «que previamente no hubieran sido solicitadas o expresamente autorizadas por los destinatarios», y el anexo de la ley define destinatario como «persona física o jurídica». La única excepción es el cliente previo (art. 21.2).
  - La AEPD ya ha multado un caso idéntico al nuestro: correos a la dirección genérica `info@` de una S.L. El remitente alegó que una persona jurídica queda fuera del RGPD; la AEPD contestó que el envío «es sancionable tanto si el destinatario es una persona física cuanto si es una persona jurídica» (PS/00559/2021: 2.000 €, 1.200 € con reducciones).
  - Infracción leve: hasta 30.000 €. Si el envío es **masivo**, o insistente a un mismo destinatario, es grave: de 30.001 a 150.000 € (arts. 38.3.c, 38.4.d y 39).
  - **Vía legal en España: primero el teléfono.** Las llamadas comerciales hechas por una persona a empresas, autónomos y profesionales se presumen lícitas (art. 5 de la Circular 1/2023 de la AEPD, en relación con el art. 19 LOPDGDD). En la llamada se pide permiso para enviar la información por correo o WhatsApp; con ese permiso, el envío ya está «expresamente autorizado» y este motor puede hacerlo. Las llamadas automáticas sin intervención humana (robots de voz) exigen consentimiento previo y no valen para esto.
- **Francia, Portugal y Reino Unido** admiten prospección B2B por email con derecho de oposición, bajo condiciones (relación con la actividad del destinatario; en Reino Unido, no a autónomos).
- **Alemania e Italia** exigen consentimiento previo también en B2B. No lances campañas allí sin asesoramiento local.
- Antes de enviar en España conviene cruzar con la Lista Robinson de Adigital y volcar el resultado en `external_robinson_blocklist.csv`.
- Los textos legales de `config/compliance_templates.json` son una base sólida, no asesoramiento jurídico. Tu página de privacidad (`PRIVACY_URL`) debe describir este tratamiento.

Esto es orientación práctica, no un dictamen legal.

## Estructura

```
cli.py                               comandos
campaigns/example_campaign.json      campaña de ejemplo
config/compliance_templates.json     pies legales y prompts en 6 idiomas
core/                                configuración, base de datos, esquema de campaña, utilidades
modules/1_apify_extractor.py         Google Maps (Apify) → leads
modules/2_web_enricher.py            web → email corporativo + resumen
modules/3_ai_copywriter.py           redacción con IA + enlace wa.me + pie legal
modules/4_compliance_webhook_server.py   bajas y webhook de WhatsApp (FastAPI)
modules/5_sender_daemon.py           envío SMTP, IMAP, cortafuegos
deploy/systemd/                      servicios
tests/test_engine.py                 pruebas de punta a punta
```

La base de datos es un único fichero SQLite (`data/leads.db`) en modo WAL, con `busy_timeout=5000` y transacciones explícitas, para que el daemon, el servidor y los comandos puedan trabajar a la vez.
