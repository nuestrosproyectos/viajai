# Fábrica de webs con Andrés · notas (léelas antes de seguir)

Juan habla SIEMPRE en español de España. Encargo completo: `fabrica/PROMPT-FABRICA.md`. Rama `claude/fabrica-webs`.

## Qué es
Una herramienta para crear, para cualquier negocio, una web como Reparo y Herencias: móvil primero, Andrés atendiendo por voz y por escrito, la solicitud que se rellena a la vista y el cierre de la cita o la venta.

## Cómo está hecha
- **Plantilla común** (`fabrica/plantilla/`): `nucleo.css` + `piel.css` (diseño), `nucleo.js` (conversación, voz, micrófono, solicitud, escenario de ordenador, avisos, panel del dueño, llamada LiveKit), `pagina.mjs` (genera la página), `legal.mjs` (aviso legal y privacidad), `instrucciones-base.mjs` (cerebro común con la REGLA DE ORO), `agente/` (agente de voz LiveKit y apuntador comunes), `nueva/` (esqueleto de una web nueva).
- **Cada web** se define solo con: `asistente.json` (nombre, voz, tono: el ÚNICO sitio para cambiar el asistente), `cerebro.mjs` (datos y PENDIENTES), `web.mjs` (textos, situaciones e iconos, campos de la solicitud, lo que preparar, destinos, tarjeta final, legal), `instrucciones.mjs` (oficio del sector), `conocimiento/` (fuentes con fecha; `resumen-para-andres.md` → `saber.mjs`), `contenido.js` (bloque de datos y preguntas), `estilo.css`, `fuentes/`, `media/`.
- **Generado** (no editar a mano): `index.html`, `vista-previa.html`, `aviso-legal.html`, `privacidad.html`, `asistente.mjs`, `saber.mjs`, `base-instrucciones.mjs`, `agente/{instrucciones.txt,saludo.txt,web.json}`.

## Órdenes
- `node fabrica/construir.mjs --todas` (o una web): reconstruye. Una mejora en la plantilla llega a todas así.
- `node fabrica/probar-web.mjs <web> --guion=… --capturas=…`: iPhone, Android y ordenador; sin errores, nada fuera de pantalla, «Hablar con Andrés» visible al abrir y una conversación simulada hasta la tarjeta «¡Listo!».
- `node fabrica/crear.mjs nueva` (pregunta de una en una) · `asistente <web> --nombre= --voz=` (cambia y comprueba 7 sitios) · `voces` · `comprobar <web>` · `lista`.
- Pruebas del cerebro: `node fabrica/pruebas/preparar.mjs <web> <ronda>` → responde Claude Haiku (mismo modelo que producción) con `brief-responder` → corrige otro agente a ciegas con `fabrica/pruebas/hoja-criterios.md` → `node fabrica/pruebas/resumen.mjs <web>/pruebas/<ronda>/evaluacion.json`.
- Agente de voz de una web: `WEB_AGENTE=<web>/agente python fabrica/plantilla/agente/agente.py dev` (o la imagen `fabrica/plantilla/agente/Dockerfile --build-arg WEB=<web>`). Comprobado que carga con livekit-agents 1.8.13 y coge campos, nombre y voz de la web; NO probado en llamada real (faltan las claves de Juan).

## Páginas privadas (claude.ai)
- Asistente de la fábrica: https://claude.ai/artifact/GAeFwZbmHzgd3uhWjj3Mb9 (guarda los encargos en su base de datos, colección `encargos`; Claude los lee con ArtifactData y ejecuta `crear.mjs`).
- Vista previa de Reparo (con la plantilla): https://claude.ai/artifact/DYurfeiT5q3jRYcS5p8MBw (la antigua 9QGWbc2JTTN6J12d7L2Am4 es del diseño viejo; no se tocó).
- Vistas previas: reformas https://claude.ai/artifact/5fu2zhpaHtyvJnqHJLv3Lx · placas solares https://claude.ai/artifact/VQ4sYVKEaqDyNaYmLkoN8m · fontanería https://claude.ai/artifact/7GJGrr2KbFtU6VpAMwr4kQ · accidentes de tráfico https://claude.ai/artifact/6DKbh3RuJEES6Va6mdRo6g
- Resultados de las pruebas del cerebro: `fabrica/RESULTADOS-PRUEBAS.md`. Datos que caducan: `fabrica/CADUCIDAD.md` (`node fabrica/caducidad.mjs`).

## Decisiones
- Juan: una marca por sector; el asistente se llama Andrés en todas por ahora; primero las webs y luego buscar profesionales (mientras, las solicitudes le llegan a él).
- Voces: lista curada de 13 voces de ElevenLabs en español de España (`fabrica/voces-es.json`, muestras en `fabrica/voces/`). Por defecto, voz de hombre «Pablo» (para agentes de voz).
- Si cambia el nombre o la voz, el audio grabado del aviso del micrófono deja de usarse y lo dice la voz del navegador hasta regrabarlo (cuesta créditos: pedir OK).
- Las páginas legales salen de la plantilla (antes Herencias decía «Reparo» y hablaba de averías: corregido).
- Precios de la web = los del conocimiento con fuente (si el estudio y el conocimiento difieren, manda el conocimiento).
- Reparo YA está en la plantilla (27-11-2026): `reparacion/web.mjs`, `estilo.css` (piel «claro»), `contenido.js` (preguntas). Sus piezas propias son ahora opcionales de la plantilla y las puede usar cualquier web: `manual` (manual.mjs + conocimiento.mjs con fichas y códigos de error), `mapa` (mapa de la visita en la solicitud), `final.<tipo>.ruta` (dibujo de la furgoneta en la tarjeta final), `obligatoriosTipo` (p. ej. venta pide el aparato), `fichaAlias` y `campoOrientacion` (nombres propios en la <ficha>), destinos con valor (`tituloValor`) y que abren un desplegable (`abrir`), `servidor`/`livekit` (metas de la web publicada). Sus páginas legales siguen siendo propias (sin `legal` en web.mjs). Copia de la página hecha a mano: `reparacion/version-a-mano.html`. Comprobado: pruebas-manual (web y agente iguales), probar-web en 3 equipos, cambio de nombre llega a los 7 sitios, y comparación visual con la anterior (igual).
- Respuestas escritas de Andrés: 45 palabras (50 en Herencias y Reparo). Juan probó 60 el 27-11-2026: empeoró (7,05 frente a 7,24 y 2 datos falsos), así que se volvió a 45 con instrucciones por tipo de caso (`casos` en cada instrucciones.mjs): nota 7,43 y 0 datos falsos, también con 16 clientes nuevos. Por voz, menos de 25.

## Pruebas de conversaciones completas
- `fabrica/pruebas/conversar.mjs` + `hoja-conversaciones.md` (ver RESULTADOS-PRUEBAS.md). Vuelta 2: 16/16 en cita, nota 7,00, datos bien tomados 9,4, coherencia 8,8.
- La web lee el aviso aunque falte `</aviso>` (antes se perdían ~1 de cada 3 en la vuelta 2).
- Ojo al lanzar agentes Haiku por lotes: alguna vez escriben la respuesta en la carpeta de otra conversación; el encargo dice «de una en una» y conviene comprobarlo.

## Lo que no se pudo verificar (límites de esta sesión)
- La red solo deja salir a images.pexels.com: ninguna web oficial se abrió directamente; todo lo legal y los precios salen de resultados del buscador con su URL (marcado «verificar» donde hay dudas). El cupo de búsquedas se agotó en la investigación.
- OEPM y EUIPO: sin comprobar en las cuatro marcas (hacerlo a mano en el Localizador de marcas).
- Autores de varias fotos de Pexels: sin apuntar (pexels.com bloqueado).
- Llamada de voz real: sin probar.

## Pendiente (al cerrar el 27-11-2026)
- Juan: datos reales de cada negocio (teléfonos, horarios, precios propios, garantías, años), OEPM de las 4 marcas, revisión de cada `revision-profesional.md` por el profesional del sector.
- Probar una llamada de voz real con el agente común (claves de LiveKit, Deepgram, ElevenLabs y Anthropic).
- Casilla de consentimiento de datos de salud en la solicitud (accidentes) cuando `legal.datosSalud`.
- Grabar el audio del aviso del micrófono con la voz de cada web (cuesta créditos de ElevenLabs: pedir OK).
- Autores de las fotos de Pexels en `media/CREDITOS.md` (pexels.com bloqueado desde aquí).

## Vueltas de una en una (petición de Juan: «da solo vueltas con un tipo de negocio y ajústalo»)
- Accidentes (abogados): c5 6,38 → c6 7,38 → c7 8,00 (cita en 4 respuestas, 0 datos falsos). Clave: lista interna «porDecir» en la ficha.
- Herencias (abogados): Andrés pasado a la plantilla común (instrucciones.mjs con casos, conocimiento/resumen-para-andres.md, pruebas/conversaciones.json). c1 7,25 → c2 7,38 → c3 8,00.
- Ajustes de la base común en estas vueltas (llegan a todas las webs): porDecir, municipio siempre y repetido al confirmar, nunca decir cuándo será la cita, no repetir la misma frase si vuelve a preguntar, campos con opciones vacíos hasta que lo diga, usted desde la primera respuesta si es mayor o formal, la franja se pide con los datos (no al ofrecer la cita), sumar los datos de todos los tipos de caso que encajan.
- Siguiente: el resto de sectores de uno en uno (reformas, placas, fontanería, Reparo).
