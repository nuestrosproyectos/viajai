# ViajAI · Canal de WhatsApp de chollos de viaje en piloto automático

Sistema completo de **captación → contenido → monetización por afiliación**:

```
Reels / TikTok ──(comentario "VIAJE")──► ManyChat ──► DM con guía gratis ──► botón al Canal de WhatsApp
                                                                                     ▲
Travelpayouts ──► scraper (cada 6 h) ──► Airtable ──► n8n (10:00 · 14:30 · 19:30) ──┘
                  vuelos i/v < 60 €      Pendiente     publica chollo; si no hay, contenido evergreen
```

Cada chollo publicado lleva tu enlace de afiliado de Travelpayouts: cobras comisión por cada reserva que salga del Canal.

| Carpeta | Qué contiene |
|---|---|
| `database/` | Los 2 CSV para crear las tablas de Airtable |
| `n8n/` | El flujo que publica en el Canal 3 veces al día |
| `scraper/` | El script que busca vuelos baratos y los mete en Airtable |
| `docs/` | Los textos de ManyChat listos para pegar |
| `.env.example` | Plantilla con todas las claves que necesita el sistema |

---

## Puesta en marcha en 5 pasos

### 1. Importa los CSV en Airtable

1. Crea una base nueva en Airtable.
2. **Add or import → CSV file** → sube `database/chollos_flash.csv` y llama a la tabla **`Chollos_Flash`** (nombre exacto).
3. Repite con `database/contenido_evergreen.csv` → tabla **`Contenido_Evergreen`**.
4. Revisa los tipos de campo: `Precio` y `Veces_Publicado` → **Number**; `Estado` → **Single select** (`Pendiente`, `Publicado`); `Copy_Mensaje` → **Long text**.
5. En `Chollos_Flash`, sustituye `TU_MARKER` por tu ID de afiliado de Travelpayouts (Buscar y reemplazar) **o borra esas 5 filas**: son de ejemplo, con precios no comprobados. El scraper las rellenará con vuelos reales en el paso 5.

### 2. Consigue las claves y pégalas en `.env`

```bash
cp .env.example .env
```

| Variable | Dónde se saca |
|---|---|
| `WHAPI_TOKEN` | Whapi.Cloud → tu canal (escanea el QR con el WhatsApp que administra el Canal) → *API Token* |
| `WHAPI_CHANNEL_ID` | Llama a `GET https://gate.whapi.cloud/newsletters` con tu token; copia el `id` de tu Canal (`120363…@newsletter`) |
| `AIRTABLE_TOKEN` | airtable.com/create/tokens → permisos `data.records:read` y `data.records:write` sobre tu base |
| `AIRTABLE_BASE_ID` | La parte `appXXXXXXXXXXXXXX` de la URL de tu base |
| `TRAVELPAYOUTS_TOKEN` y `TRAVELPAYOUTS_MARKER` | Travelpayouts → Perfil → *API token* y tu *marker*. Únete antes al programa de Aviasales |

### 3. Sube el flujo a n8n

1. En n8n: **Workflows → Import from File** → `n8n/workflow_whatsapp_viajes.json`.
2. Define en tu instalación de n8n las variables de entorno `WHAPI_TOKEN`, `WHAPI_CHANNEL_ID` y `AIRTABLE_BASE_ID` (las mismas del `.env`) y añade `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` para que el flujo pueda leerlas. Reinicia n8n.
   - En **n8n Cloud** no hay variables de entorno: sustituye `$env.NOMBRE` por `$vars.NOMBRE` (Variables, planes de pago) o pega los valores directamente en los nodos.
3. Abre los **4 nodos de Airtable**, crea la credencial *Airtable Personal Access Token* con tu `AIRTABLE_TOKEN` y selecciónala en los cuatro. Si algún nodo marca aviso en *Table*, elige la tabla de la lista desplegable.

### 4. Prueba una publicación

1. Pulsa **Execute Workflow** en n8n. Debe publicar un mensaje en tu Canal y, en Airtable, pasar ese chollo a `Publicado` (o sumar 1 a `Veces_Publicado` si no había chollos).
2. Si sale bien, activa el flujo (**Active**). A partir de ahí publica solo a las 10:00, 14:30 y 19:30 (hora peninsular).

### 5. Arranca el scraper

```bash
cd scraper
npm install
npm run prueba   # enseña qué chollos insertaría, sin tocar Airtable
npm start        # los inserta en Airtable como "Pendiente"
```

Déjalo programado cada 6 horas en tu servidor (`crontab -e`):

```
0 */6 * * * cd /ruta/a/viajai/scraper && /usr/bin/node ingesta_chollos.js >> ingesta.log 2>&1
```

Por último, monta el embudo de captación con los textos de [`docs/MANYCHAT_SETUP.md`](docs/MANYCHAT_SETUP.md).

---

## Cómo funciona por dentro

- **Chollos primero, evergreen de relleno.** En cada franja, n8n busca 1 chollo `Pendiente`. Si lo hay, lo publica y lo marca `Publicado`. Si no, publica la píldora evergreen con menos publicaciones y le suma 1: así rotan las 15 sin repetirse hasta dar la vuelta completa.
- **Sin duplicados.** El scraper no vuelve a insertar un chollo con el mismo origen, destino y fechas, y limita a 2 chollos por destino en cada ejecución para que el Canal tenga variedad.
- **Ajustes sin tocar código** (en `.env`): `ORIGENES`, `PRECIO_MAXIMO`, `MESES_A_CONSULTAR`, `MAX_CHOLLOS_POR_EJECUCION`, `MIN_NOCHES`, `MAX_NOCHES`.

## A tener en cuenta

- Los precios de Travelpayouts salen de búsquedas recientes de otros usuarios (caché de hasta 48 h), por eso el mensaje dice «desde» y «puede variar».
- Whapi.Cloud es una API no oficial de WhatsApp y es de pago. Usa un número dedicado al Canal, no tu número personal.
- El mensaje de cada chollo ya avisa de que el enlace es de afiliado: es obligatorio identificar la publicidad.
