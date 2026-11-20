# Lía y compañía · estado y pendientes (15-11-2026, noche)

## Hecho hoy
- Web con 4 especialistas IA (Lía tarot, Mateo astrología, Mei horóscopo chino, Inés luna y rituales; numerología y biorritmo retirados de la web el 19-11).
- Tarot sí/no con baraja visible y aviso «Toca una carta»; tirada de 3 cartas; tirada completa (Cruz Celta 10, Amor 5, Trabajo 7) con 3 cartas gratis y resto bloqueado (pago simulado).
- Sección «Por qué una IA»: cifras verificables, comparativa objetiva, método y preguntas frecuentes.
- Caras fijas entrenadas de Mateo, Mei e Inés (ver EQUIPO.md).
- Web pública: https://nuestrosproyectos.github.io/viajai/lia/

## Datos que usamos y su fuente (no poner nada que no esté aquí)
- Planetas: efeméride DE440 de NASA JPL. 231/231 posiciones a <0,32" de JPL Horizons (mediana 0,05"); ascendente, MC y casas a <1,5". Fuente: roxyapi.com/methodology y benchmark abierto github.com/RoxyAPI/astrology-api-benchmark.
- 13.957 pruebas automáticas por actualización del motor (RoxyAPI).
- 5.180.000+ localidades con zona horaria IANA histórica (RoxyAPI).
- Tarot: SOLO baraja Rider-Waite-Smith (78 cartas). 936 significados = 78 x 2 posiciones x 6 temas. No decir «todas las barajas».
- Moneda de 1 € (23,25 mm) a 0,32" = 15 km.

## Pendiente de decisión de Juan
1. Marca y dominio: propuesta «La casa de Lía» con lacasadelia.es + .com (+ tarotconlia.es para redirigir).
2. Alta en Stripe (tarjeta y Bizum) a nombre de Area Internet Business Group.
3. ~~Voces~~ HECHO: Mateo = Álvaro, Mei = Mary Velvet, Inés = Sophie.

## Pendiente técnico
- Publicar con servidor (Vercel o Cloudflare) para carta astral y compatibilidad con cualquier dato.
- Con el cobro real, el servidor solo debe enviar las cartas bloqueadas tras confirmar el pago.
- Pasar el proyecto a un repositorio propio (lia-tarot).

## 17-11-2026
- Dominio: marca general propuesta cieloycartas.com (libre a 17 $ el 17-11). Compra pendiente del cliente. Una sola web con secciones /tarot (Lía), /carta-astral (Mateo), /horoscopo-chino (Mei), /luna (Inés).
- Activar cobros (Stripe) antes de publicar vídeos.
- Cambiar detector de caras de LatentSync (InsightFace, no comercial) por uno libre antes de publicar.
- Vast.ai: alquilar SOLO A100 de 80 GB (las «baratas» son de 40 GB y no sirven).

## REGLA FIJA (17-11-2026)
- NUNCA borrar/apagar una máquina o archivo con trabajo del cliente hasta que él lo haya VISTO y dado el OK. Primero entregar (archivo enviado y comprobado), luego borrar.
- Entregar los vídeos como archivo dentro de la conversación (SendUserFile), no con enlaces de servicios anónimos (tmpfiles/litterbox dan aviso de VPN y caducan).
- Vídeo 01 «Elige un montón»: el render completo se perdió (instancia 61105086 borrada antes de entregar). Rehacer Lía a cámara (lia_camara_01.mp3, 151 s) y montar con lia-web/videos/montar_video01.py.

## Estado 18-11-2026 (para retomar en una sesión nueva)
- Prueba de avatar de Lía hecha por el cliente en ARTLIST (artlist.io, toolkit de IA con Kling/Veo/Seedance/ElevenLabs): resultado «de puta madre». Falta: saber cuántos créditos gastó la prueba de 46 s y con qué modelo, para elegir plan (AI Starter 19,99 €/16.500 créditos · Núcleo 39,99 €/40.000 · AI Pro 99,99 €/120.000; mensual, no anual).
- Conector MCP de Artlist: https://mcp.artlist.io/mcp — añadir en claude.ai/customize/connectors y abrir sesión nueva para que cargue.
- Guion listo del vídeo 02 «¿Qué siente esa persona por ti?»: lia-web/videos/guion-02-que-siente-por-ti.md (Lía a cámara ~2,3 min + 3 montones de 5 cartas, ~14 min).
- Voz de Lía: Carolina (BkOojM1ZhtSAHgsAkMx2). Montaje: lia-web/videos/montar_video01.py (adaptar a 5 cartas por montón). Cartas en español: lia-web/videos/cartas_es.py.
- Vast: se pidió por correo (17-11) la devolución del saldo no gastado (~11,47 $) y desactivar la recarga automática. Pendiente de respuesta.

## Estado 18-11-2026 (tarde)
- Vídeo 02 horizontal entregado (v2, cartas en español). Montaje: videos/montar_video02.py con ESCENAS=videos/escenas; tapa solo los gestos de HeyGen sobre las cartas (tramos_manos).
- Cartas: cartas_es.py traduce mayores + 16 figuras de la corte. Web (public/cartas) actualizada con las 38 en español.
- Cobro real con Stripe hecho y probado en local con un Stripe simulado (server.js: /api/tirada cifra las cartas de pago, /api/pagar crea el Checkout, /api/desbloquear verifica el pago). Variables: STRIPE_SECRET_KEY, SECRETO_TIRADAS, URL_PUBLICA. Precios en el servidor: Cruz Celta 4,90 €, Amor 3,90 €, Trabajo 3,90 €.
- Falta del cliente: cuenta de Stripe a nombre de la empresa; comprar dominio (cieloycartas.com libre el 18-11); elegir hosting con servidor (recomendado Cloudflare: dominio + alojamiento).
- Mateo: estudio de YouTube hecho (18-11). Primer vídeo recomendado: «2027 no va a ser igual para tu signo… mira tu ASCENDENTE» (25-30 min, 12 ascendentes, CTA a calcular la carta gratis). Luego Sol/Luna/Ascendente (10-14 min, Mateo). «La Luna en los 12 signos» pasa a INÉS (decisión 20-11).

## Precios de cartas astrales en el mercado (estudio 18-11-2026, de extractos de buscador; sin abrir cada web)
- Astrólogo humano en España: 60–180 € por sesión (lo normal 85–125 €). Revolución solar con astrólogo: 60–225 €.
- Informes automáticos: Bindi (ES) carta PDF 24,95 € · revolución solar 19,95 € · sinastría 39,95 €; Astrodienst 26,90 € (Liz Greene 61,90 €); Astrosofa anual 29,95 €; Café Astrology 4,95 $; Etsy 10–50 $.
- Propuesta para nosotros (IA): carta básica GRATIS · informe natal completo 9,90–14,90 € · compatibilidad 14,90–19,90 € · revolución solar/año 14,90–19,90 € · pack año 29–34 € · suscripción 4,99–6,99 €/mes. Pendiente de decisión de Juan.
- RoxyAPI cubre 18 temas (astrología occidental y védica, previsiones, Diseño Humano, chino/BaZi, feng shui, maya/azteca, vastu, numerología, cábala, tarot, biorritmo, ayurveda, I Ching, cristales, sueños, números de ángel, localidades).
- Mateo: 13 Shorts a cámara con audio listo (videos/audio-m01-alvaro/shorts); falta que Juan lo genere en HeyGen (~5 min) y montarlos.

## Rituales (19-11-2026)
- Proceso guardado como skill del proyecto: .claude/skills/ritual-personalizado/SKILL.md (datos, reglas, audio, PDF, precios).
- Muestras: luna llena 24-11 y Año Nuevo 2027 (PDF + audio de Inés). Pendiente: OK de Juan a tono, precios y biblioteca.
- Año Nuevo es la venta grande: la web tiene que cobrar antes de mediados de diciembre (dominio + Stripe).
