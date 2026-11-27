# Contexto para continuar (traspaso del 27-11-2026)

Este fichero resume todo lo hablado y hecho en la sesión en la nube para poder seguir desde el PC de Juan sin perder el hilo.
Léelo entero antes de tocar nada. Háblale a Juan siempre en español de España, directo y sin tecnicismos.

## Quién y para qué

- Juan, Area Internet Business Group, S.L.U. (Granada). Emprendedor; prioridad: convertir esto en ingresos cuanto antes.
- Objetivo del proyecto: captar colaboradores B2B (empezando por fontaneros de Granada) desde Google Maps. Se les escribe un
  correo que invita a abrir conversación por WhatsApp (`wa.me` con mensaje precargado y referencia `[Ref: GR-XXXX]`).
- Pide OK antes de: publicar o desplegar, reiniciar servidores, enviar correos y gastar dinero. Lo demás, hazlo.

## Dónde está el código

- Repositorio `nuestrosproyectos/viajai`, rama `claude/global-b2b-outreach-engine-usf73l`, carpeta `global-b2b-outreach-engine/`.
- No hay pull request abierto (Juan no lo ha pedido).
- `README.md` explica el uso; `deploy/INSTALL.md` es la guía de instalación en un servidor Ubuntu 24.04.
- Pruebas: `python -m pytest tests -q` → 35 pasan. No llaman a ningún servicio externo.

## Qué hay construido

1. `modules/1_apify_extractor.py` — Google Maps vía Apify (`compass/crawler-google-places`), sin duplicados, con filtro de categoría por campaña (`category_filter`).
2. `modules/2_web_enricher.py` — rastrea webs: email corporativo, página de origen, formulario, WhatsApp, resumen de servicios y **redes sociales**. Detecta protecciones anti-robots y comprueba que el DNS de la máquina funciona antes de validar MX.
3. `modules/3_ai_copywriter.py` — redacta asunto, primer correo y dos seguimientos con Anthropic (`claude-haiku-4-5-20251001`). El enlace de WhatsApp y el pie legal se montan en Python.
4. `modules/4_compliance_webhook_server.py` — FastAPI: bajas con un clic, webhook de WhatsApp (Meta, Evolution, JSON plano) y el panel.
5. `modules/5_sender_daemon.py` — envío SMTP multi-cuenta, horario local, idempotencia, lista de supresión, Robinson, IMAP y cortafuegos. Solo puede haber un motor de envío a la vez (cerrojo en base de datos).
6. `modules/6_dashboard.py` — panel web (`/panel`, protegido con `DASHBOARD_TOKEN`).
7. `modules/7_job_runner.py` — el panel lanza extraer, buscar emails, redactar e iniciar o parar envíos, con casilla de confirmación en lo que cuesta dinero o envía correos reales.
8. `cli.py` — `extract`, `enrich`, `generate`, `send`, `stats`, `accounts`, `dashboard`, `serve`.

## Qué está probado de verdad y qué no

- **Hecho en real:** una extracción de Apify en Granada (38 negocios, unos 0,15 $; conjunto de datos `g7Ykpf0pNj2RQkk72` en la cuenta de Apify de Juan) y el rastreo de las webs.
- **Resultado real:** 38 recibidos → 12 fuera de nicho, 1 duplicado → 25 leads. 17 con web propia. 9 con email corporativo en la última pasada (8 en la anterior). 11 de 25 con redes sociales (Instagram 10, Facebook 7); 4 sin email pero con redes.
- **No probado:** validación MX real (el DNS de la sesión en la nube estaba capado), redacción real con Anthropic (no había clave), envío por un proveedor SMTP real, lectura IMAP real, el panel lanzando trabajos reales, la guía de instalación en un servidor real (systemd y Caddy).
- Los datos de la prueba estaban en una base de datos temporal de la sesión en la nube; **no están en el repositorio**. Hay que repetir `extract` + `enrich` (o reutilizar el conjunto de datos de Apify).

## Decisiones de Juan

- **Quiere enviar el correo directamente**, sin llamar antes, asumiendo el riesgo legal. No hay que volver a discutirlo.
- Quiere lanzarlo todo desde el panel, con botones.
- Quiere instalarlo en un servidor: tiene un **VPS de Hostinger** que iba a dar de baja, o contrataría uno de **OVH** (más barato).
  Desde la nube no se pudo entrar al VPS. Pendiente: ver qué hay en él (por SSH desde el PC) y decidir.

## Lo legal, tal como quedó (verificado en BOE y AEPD el 27-11-2026)

- Art. 21.1 LSSI: prohíbe correos comerciales no solicitados; el anexo define destinatario como «persona física o jurídica». Única excepción: cliente previo (21.2).
- AEPD PS/00559/2021: multa por correos a `info@` de una S.L. que además había pedido la baja (2.000 € → 1.200 €). «Sancionable tanto si el destinatario es una persona física cuanto si es una persona jurídica».
- Leve: hasta 30.000 €. Grave (envío masivo o insistente al mismo destinatario): 30.001–150.000 €.
- Llamadas hechas por una persona a empresas y autónomos: se presumen lícitas (Circular 1/2023 AEPD, art. 5). Juan descartó esta vía.
- Redes sociales: no se encontró ninguna resolución de la AEPD que decida si un mensaje directo es «medio electrónico equivalente». Sin confirmar.
- Recomendaciones aceptables dentro de su decisión: volumen bajo (10–20 al día por buzón), bajas al instante, servidor de bajas publicado antes del primer envío. Se le ofreció dejar la secuencia en dos correos en vez de tres; no ha contestado.

## Pendiente, por orden

1. ~~Ver el VPS de Hostinger~~ HECHO (27-11-2026, sesión en la nube, vía API oficial de Hostinger):
   - KVM 1 (1 núcleo, 4 GB RAM, 50 GB), Ubuntu 24.04 con Docker, IP 69.62.120.115, hostname srv1991531.hstgr.cloud, encendido.
   - Pagado (155,88 €/año). **Renovación automática QUITADA a petición de Juan: caduca el 18-09-2027.** En agosto de 2027 decidir: renovar a mano u OVH.
   - Uso última semana: CPU <1 % (pico 5 %), RAM ~650 MB de 4 GB. El gestor Docker de Hostinger está vacío. Hay una clave SSH «licitaciones-vps» (PC de Juan): probablemente lo usó para lo de licitaciones.
   - Sin verificar: qué corre dentro y el disco (la métrica marca 49 GB de 50; puede estar casi lleno). **Antes de instalar, ejecutar `deploy/diagnostico.sh`** (solo lee).
   - Decisión de Juan: quedarse con Hostinger e instalar **desde su PC por SSH** (opción 1). No contratar OVH ahora.
   - Visto de paso: paga dos alojamientos web de 203,88 €/año (Business, mayo; Unlimited, 21-11-2026). Se le avisó; no se ha tocado.
   - El token de la API de Hostinger quedó guardado en el entorno en la nube `viajai` (secreto de red para developers.hostinger.com).
2. Instalar siguiendo `deploy/INSTALL.md` (con OK de Juan antes de desplegar).
3. Reunir lo que falta: clave de Apify, clave de Anthropic, datos legales (razón social, CIF, domicilio, URL de privacidad), dominio de envío con SPF/DKIM/DMARC y dos buzones, subdominio para el panel.
4. Redactar los correos reales de los leads con email y enseñárselos a Juan **antes** de enviar ninguno.
5. Primer envío real pequeño, con su OK.
6. Fallos conocidos sin arreglar: ninguno abierto. Mejoras posibles: que el panel deje elegir campaña al buscar emails; contar bajas y rebotes por eventos.

## Entorno en la nube

En el entorno `viajai` se añadieron a la red permitida 23 dominios para las pruebas (17 webs de fontaneros, dos variantes con y sin `www`, `www.boe.es` y `www.aepd.es`). Se le ofreció quitarlos; no ha contestado.
