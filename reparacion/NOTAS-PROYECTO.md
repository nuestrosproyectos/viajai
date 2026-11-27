# Notas del proyecto Reparo (léelas antes de seguir)

**Idioma: Juan habla SIEMPRE en español de España. Todo en español: respuestas, notas cortas, títulos, mensajes intermedios. Si se cuela algo en inglés, traducirlo. Dicta por voz: si una palabra no encaja, interpretar lo que quiso decir.**

## Qué es
Web de reparación de electrodomésticos (Granada y área metropolitana) atendida por un **técnico virtual por voz**, «Andrés», que conoce todas las marcas, resuelve dudas e intenta siempre que el cliente reserve la visita. Empresa: Area Internet Business Group, S.L.U. (Granada). Marca provisional: **Reparo**.

## Dónde está todo
- Repositorio `nuestrosproyectos/viajai`, carpeta `reparacion/` (no toca la web de viajes de la raíz ni `/lia/`).
- Rama con el trabajo: `claude/brave-pascal-azy07j`.
- Vista previa privada ACTUAL (plantilla de la fábrica, 27-11-2026): https://claude.ai/artifact/DYurfeiT5q3jRYcS5p8MBw · La antigua (diseño viejo): https://claude.ai/artifact/9QGWbc2JTTN6J12d7L2Am4 — se genera desde `reparacion/index.html` quitando doctype/html/head/body y con `cerebro.mjs` como archivo adjunto (capacidades: sample con imágenes, dictation, tts, db, user).

## Archivos
- `cerebro.mjs`: datos del negocio (NEGOCIO) + instrucciones del técnico. Fuente única para web, servidor y agente. `instrucciones(n, {herramientas:true})` = versión para el agente de voz en directo.
- `index.html`: web completa. Consola de voz, parte de trabajo que se rellena solo, el técnico señala secciones de la página (`<mostrar>`), mini consola flotante, formulario «Solicitud de técnico» (solo teléfono obligatorio), modo llamada LiveKit (meta `livekit-token`), panel de avisos para el dueño.
- `servidor/`: Cloudflare Worker. `/api/tecnico` (Claude Haiku 5.5 en streaming), `/api/aviso` (D1 + Telegram + webhook), `/api/livekit-token` (pase JWT HS256 con dispatch al agente "andres"; verificado con la librería oficial).
- `agente/`: agente LiveKit en Python (livekit-agents 1.8.13): Deepgram Nova-3 es, Claude Haiku 4.5 o Gemini 3.5 Flash, ElevenLabs Flash v2.5 o Cartesia sonic-3; detector de turnos; interrupciones; «¿Sigues ahí?» a los 10 s y cuelga a los 20 s; tope de 10 min. Herramientas por RPC: mostrar_en_pagina, rellenar_campo, enviar_solicitud, terminar_llamada. `node exportar-instrucciones.mjs` copia las instrucciones desde cerebro.mjs.
- `LEEME.md`: pasos para probar y publicar (comandos `lk` verificados en docs.livekit.io) y comparativa de costes.

## Hecho y verificado
- Web probada con Playwright en móvil (390 px) y escritorio: sin errores ni desbordes.
- Prueba del técnico con 5 clientes simulados (E18 Bosch, regateo de precio, inducción «U», olor a gas, «¿eres persona?/¿sois oficiales?»): bien; 13 mejoras aplicadas a las instrucciones.
- Llamada LiveKit simulada en el navegador: transcripción, señalar, rellenar formulario, enviar y colgar funcionan.
- NO verificado: llamada de voz real (faltan cuentas/claves de Juan; aquí no se puede ejecutar el servidor de LiveKit descargado).

## Costes (leídos el 21-11-2026, por cliente de 5 min, sin IVA)
Voz del navegador 0,01 $ · **LiveKit+Deepgram+Claude+ElevenLabs (montado) 0,17-0,25 $** · LiveKit Inference 0,20 $ · OpenAI Realtime mini 0,12 $ · Gemini Live 0,06-0,27 $ · Vapi/Retell 0,37-0,49 $ · ElevenLabs Agents 0,45-0,55 $. LiveKit regala 1.000 min/mes; Deepgram 200 $ de crédito.

## Pendiente (decide Juan)
- Crear cuentas: LiveKit Cloud, Deepgram, ElevenLabs (elegir voz de España), clave de Anthropic. Probar una llamada real.
- Nombre de marca y dominio; teléfono y WhatsApp reales; precio de visita (ahora 39 €); garantía 3 o 6 meses; rangos de precios; datos legales (NIF, dirección, correo).
- ¿El técnico puede mencionar la limpieza del filtro de desagüe si el cliente pregunta? (ahora sí, sin proponerla).
- Más adelante: número de teléfono español para que el mismo agente atienda llamadas (trunk SIP; coste sin mirar).

## Manual técnico de Andrés (21-11-2026)
- `conocimiento/*.json`: fichas investigadas con fuente y confianza (alta = oficial). `node construir-manual.mjs` las junta en `conocimiento.mjs` (junta rondas de una misma familia sin repetir). `conocimiento/sinonimos.json`: expresiones coloquiales añadidas a mano.
- `manual.mjs` (web y servidor) y `agente/manual.py` (voz): en cada turno detectan aparato, marca, código (también dictado: «e quince», «efe cero cinco», «ciento treinta y tres») y síntoma, y añaden al mensaje del cliente solo las fichas que tocan. Con marca conocida, solo fichas de esa marca. Sin aparato, no diagnostica por síntoma.
- `node agente/exportar-instrucciones.mjs` genera también `agente/conocimiento.json`. `node pruebas-manual.mjs` comprueba que web y agente dan lo mismo (26 frases, todas iguales).
- Protocolo de la marca (pedido por Juan): Andrés pide la marca antes de explicar un código o una avería; si no la sabe, dónde mirarla; pregunta una sola vez.
- Cifras (1.ª ronda): 441 fichas de código de 26 familias (208 de confianza alta), 115 síntomas. Frases nuevas de cliente entendidas: 23 de 25. Sin fichas falsas al tomar datos.
- Límites: cupo de 200 búsquedas por turno compartido entre agentes; la red de la sesión no deja abrir webs de fabricantes (todo sale de los extractos del buscador). Algunas fuentes son de webs de otros países.
- En marcha: 2.ª ronda (hornos y campanas, Smeg/Liebherr/Cata/Grundig/Corberó/Daewoo/Gorenje, frigoríficos y Fagor antigua, aires que faltan y termos) y calderas.
- Aire y calderas: Andrés orienta y toma datos y dice que confirmamos si hay técnico habilitado en la zona (carnet de gases solo en algunas ciudades). PENDIENTE (al final): qué ciudades tienen carnet de gases fluorados y habilitación de gas.
- Siguiente paso pedido por Juan: `PROMPT-TECNICO-VETERANO.md` (Andrés con el oficio de un técnico de más de 30 años, sin decir que esa experiencia es suya).

## Técnico veterano (21-11-2026, prompt de `PROMPT-TECNICO-VETERANO.md`)
- `conocimiento/oficio-<aparato>.json` (12 aparatos): funcionamiento, piezas con su prueba, diagnóstico guiado (preguntas clave + qué indica cada respuesta + pruebas del técnico + pieza a llevar), averías documentadas por marca, vida útil, cuándo compensa y mantenimiento. Todo con fuente. 101 diagnósticos, 100 piezas, 23 averías de marca.
- El buscador añade en cada turno: la pregunta de veterano para ese síntoma, la avería típica de la marca si encaja (2+ palabras en común; retiradas de seguridad solo si encajan o el cliente habla de la edad) y vida útil/compensa si habla de años o de cambiarlo.
- `cerebro.mjs`: Andrés razona por fases del ciclo y piezas, hace la pregunta que más descarta, da el porqué en media frase, criterio honesto, máximo 45 palabras, precio de la visita una sola vez. No se atribuye años propios; usa «lo que vemos en el taller» y los 20 años mínimos del equipo (`NEGOCIO.experiencia`).
- `conocimiento.mjs` aligerado (sin fuentes ni notas: 468 KB, 99 KB comprimido); la web solo lo descarga en la vista previa.
- Prueba: `pruebas/clientes.json` (20 clientes), `node pruebas/preparar.mjs antes|despues`, respuestas simuladas con Claude Haiku (mismo modelo que producción), evaluación a ciegas en `pruebas/evaluacion-resultado.json`.
- Calderas: 119 códigos de 13 marcas. OJO: el agente de calderas usó Apify (servicio de pago) sin OK de Juan; no volver a usarlo sin permiso.
- Resultado (evaluación a ciegas, Claude Haiku, 20 clientes): pregunta de veterano 6/16 → 12/16; 45 palabras o menos 7/20 → 18/20 (media 47,5 → 40,1); nota del dueño 7,05 → 7,65; causa, seguridad, marca y nada inventado se mantienen; visita 12/12 → 9/12 en la 2.ª versión. Corregido después (criterio de pieza barata/cara para si compensa, diferencial sin dejar la casa sin luz, visita mencionada junto a la pregunta): los 6 casos que fallaban salen bien en la 3.ª prueba. Pendiente: repetir la medición completa de 20 cuando haya cambios grandes.
- Manual total: 671 fichas de código de 46 familias (339 alta), 138 síntomas.

## Andrés gran comercial y venta de aparatos (22-11-2026)
- Pedido por Juan: quien llama quiere que se lo reparen; nada de debates ni de empujarle a arreglarlo él. Andrés da la visita por hecha, va directo a la cita si el cliente ya la pide, cierra con dos opciones, pide el teléfono pronto ("por si se corta"), argumentos de confianza de uno en uno (20 años, presupuesto cerrado, garantía, descuento, 24-48 h) y urgencia natural. No propone limpiezas ni pruebas caseras salvo que lo pregunten, sea de seguridad o no sea avería (bloqueo, demo, cazo). "¿Compensa?" solo si lo preguntan, en una frase, y remite al presupuesto cerrado.
- Venta: si el cliente prefiere un aparato nuevo, se lo vendemos (confirmado por Juan). Andrés pide teléfono, qué busca, medidas y presupuesto, y envía la solicitud con tipo "venta" (web, Telegram con 🛒, agente de voz). No da precios ni modelos. Incluye entrega, instalación y retirada del viejo (confirmado por Juan el 22-11): Andrés lo usa como argumento y la web lo dice en la lista de ventajas.
- Causas siempre como "lo más probable"; no descartar piezas ni inventar causas sin ficha.
- Medición a ciegas (Haiku, 20 clientes): sin debates ni tareas 10/18 → 18/18; 45 palabras o menos 7/20 → 17/20; pregunta de veterano 5/16 → 9/16; nota 6,9 → 7,35; avanza a cita 13/13 → 12/13. Casos nuevos de venta (21) y "que venga ya" (22): 8 y 9. Los fallos de causa (aire, frigorífico) y de teléfono en la venta, corregidos y comprobados después.

## Agente de voz al mínimo coste (22-11-2026, petición de Juan: 500-600 llamadas/día)
- Cerebro: Claude Haiku 5.5 (0,10/0,50 $ por millón; Haiku 4.5 costaba 1/5 $) sin "pensamiento" interno (clase ClaudeRapido), sin temperatura (Haiku 5.5 la rechaza), máx. 300 tokens, instrucciones en caché. Comprobado capturando la petición.
- Voz: Inworld TTS-2 Flash (~15 $/millón de caracteres; ElevenLabs Flash ~50 $), idioma es-ES, voz por defecto "Ignacio" (castellana, masculina). PENDIENTE: Juan pidió voz femenina, pero el técnico se llama Andrés; decidir nombre + voz escuchándola en el Playground de Inworld. Cartesia y ElevenLabs siguen como opción (TTS_PROVEEDOR).
- Oído: Deepgram Nova-3 sin palabras clave (se cobraban aparte, ~0,0013 $/min); el manual ya entiende marcas mal transcritas. DEEPGRAM_PALABRAS_CLAVE=1 para activarlas.
- Detector de fin de turno fijado en local "v1-mini" (gratis); el "v1" de la nube se cobra.
- Silencio: "¿Sigues ahí?" a los 7,5 s y cuelga a los 15 s. ARREGLADO un fallo: antes nunca colgaba por silencio (LiveKit solo avisa una vez de "ausente") y la llamada seguía hasta el tope de 10 min.
- Duración: 3 min con aviso amable 30 s antes; si el cliente ya está dando sus datos (teléfono rellenado), prórroga de 1,5 min sin avisos para no perder la venta. Probado con llamadas simuladas aceleradas.
- Voz: regla estricta de 2 frases y menos de 25 palabras por turno (solo en la llamada; la web escrita sigue en 45). Prueba con Haiku: media 22 palabras, máx. 24, sigue cerrando cita y venta.
- Coste estimado por llamada de 3 min (ver LEEME): antes ~0,20 $; ahora ~0,04 $ con el agente en servidor propio (~0,07 $ si se aloja en LiveKit Cloud, que cobra 0,01 $/min de agente).

## Revisión sincera (22-11-2026): ahorrar sin perder clientes
- Criterio de Juan: si se pierden 2 clientes al día no compensa. Perder ~1 cliente/día ya se come los ~2.800 $/mes de ahorro.
- Deshecho de la propuesta de Gemini: cuelgue a 15 s (el cliente puede estar buscando la marca o la pegatina) -> 30 s con "¿Sigues ahí?" a los 15; tope de 3 min (corta ventas a medias) -> 8 min solo como seguridad; palabras clave de Deepgram reactivadas (~0,004 $/llamada).
- Se mantiene (ahorra sin riesgo): Haiku 5.5 sin pensamiento, servidor propio, 25 palabras por turno (en voz es mejor corto).
- Pendiente de prueba real antes de decidir: voz Inworld frente a ElevenLabs (escucha a ciegas con frases reales) y detector de turnos local frente al de la nube (que no interrumpa al cliente).

## Decisión de voz (22-11-2026)
- Juan elige ElevenLabs ("el rey absoluto"): voz por defecto ElevenLabs Flash v2.5 (TTS_PROVEEDOR=elevenlabs). ~0,09 $ por conversación de 3 min, ~1.650 $/mes a 600 al día. Inworld queda como opción barata.
- Concepto de Juan: no es una llamada telefónica, es el asistente de voz dentro de la web (se habla con él desde la página, se ve escrito lo que se dice y se ve cómo se rellena la solicitud). Es lo que ya hace la web (modo llamada con LiveKit + transcripción + formulario + señalar secciones). Sin coste de telefonía.

## Cómo trabajar con Juan
Soluciones, no excusas; verificar antes de decir que algo está hecho; pedir OK antes de publicar, desplegar, gastar dinero o enviar nada; tenerle al día con cifras; directo y sin tecnicismos.

## Web rediseñada para móvil (22-11-2026)
- Hecha con 7 agentes de diseño (flujo, voz, conversión, accesibilidad, confianza, rendimiento, estilo visual) y un 8.º revisor sobre capturas; informes en el scratchpad de la sesión (diseno/01…07).
- Estilo «taller con cal y almagra»: fondo cal, almagra = acciones del cliente, cobalto = Andrés; letra mínima 14 px, cuerpo 18 px, botones de 48-76 px; modo oscuro; respeta «reducir movimiento».
- Móvil, primera pantalla: aviso de urgencia con «Llámanos ya», titular, precio de la visita (39 €) y botón grande «Hablar con Andrés». Barra fija inferior (Hablar · Escribir · Llamar · WhatsApp) que aparece cuando el botón grande sale de pantalla.
- Orden: portada → «¿Qué aparato se ha roto?» (toca y Andrés pregunta) → cómo funciona → precios → preguntas → «Que me llamen» → pie. Sin animaciones de aparición. Altura en móvil ~5.900 px (antes ~10.000).
- Conversación: pantalla completa en el móvil (el gesto de «atrás» la minimiza sin colgar), panel lateral en ordenador. Pasos que se iluminan, «Tu solicitud · 3 de 7» que se rellena sola y se puede corregir, subtítulos grandes, un solo juego de mandos (Escribir · Hablar/Colgar · Foto/Silenciar).
- Antes de pedir el micro, hoja que explica «pulsa Permitir»; si lo deniega, pasos para iPhone y Android y alternativas. Tarjeta final «¡Listo! Visita pedida» con nº de aviso y WhatsApp.
- En el móvil, cuando Andrés «señala» algo, sale una tarjeta en la conversación (la página no se mueve sola, que marea). En ordenador desplaza la página.
- Pastilla minimizada: «Andrés · tu solicitud 3 de 7» + Llamar + Seguir (o Colgar en llamada).
- Llamada: precarga de LiveKit cuando el navegador está libre o al rozar el botón; audio desbloqueado en el mismo toque (iPhone); pantalla siempre encendida; «Reconectando…»; botón «Toca para oír a Andrés» si el móvil bloquea el sonido.
- Ruido (calle, bar): micro con cancelación de eco, supresión de ruido, aislamiento de voz y volumen automático en el navegador + filtro BVC de LiveKit en el agente + interrupción solo con 2 palabras y 0,6 s.
- Velocidad (hecho): fuentes propias en fuentes/ (recortadas a la anchura, pesos y letras que usamos: 124 KB → 39 KB) en vez de Google Fonts; de paso ya no se envía la IP del visitante a Google. Medido en 4G lento simulado: primera pintura ~1,65 s → ~1,0 s; letras definitivas ~2,5 s → ~1,1 s.
- Instrucciones de Andrés separadas en instrucciones.mjs: el móvil solo descarga cerebro.mjs (datos del negocio y saludo: 11,9 KB → 2,6 KB comprimido). En la web publicada, .assetsignore deja fuera instrucciones, manual, base de conocimiento, notas y pruebas: no se pueden copiar escribiendo la dirección. El servidor los lleva incorporados (comprobado con wrangler deploy --dry-run).
- Si se cambian textos con letras raras (fuera del latín), volver a recortar las fuentes con el script recortar_fuentes.py (fonttools) o servir las fuentes completas.
- Pendiente del informe de rendimiento: navegadores de Instagram/Facebook, pausa si entra una llamada. Probar en móviles reales antes de publicar.

## Primera llamada real y web nueva (22-11-2026)
- Este ordenador es Windows ARM64: el filtro de ruido de LiveKit no tiene versión, así que el agente se instala y arranca en el Ubuntu de WSL (`~/venv-reparo/bin/python agente.py start`). La web local: `npx wrangler dev --port 8787` en `servidor/`.
- Voz: «Javi - Relaxed and Natural (ES)» con estabilidad 0,35, parecido 0,8 y velocidad 0,95 (con los ajustes de fábrica sonaba robótica).
- `agente/decir.py`: antes de la voz, cifras, euros y teléfonos se pasan a palabras; el teléfono dictado cifra a cifra se junta antes de que lo lea el cerebro.
- El manual ya no se guarda en la conversación (se intercala en `llm_node`): antes se leía a sí mismo y cambiaba de aparato a media llamada.
- `agente/apuntador.py`: Haiku sin pensamiento NO da órdenes a la web (0 en 6 turnos, medido). Una consulta aparte por turno rellena la solicitud, enseña la página, envía cuando el cliente confirma y cuelga cuando el cliente se despide. El teléfono solo se acepta si lo ha dicho el cliente.
- Andrés no se despide ni cuelga hasta que se despide el cliente; al colgar se cierra la sala y la web cuelga también.
- Diario de cada llamada en la salida del agente (TIEMPO, APUNTADO, SEÑALA). Medido: fin de turno 0,58 s + cerebro 1,1-1,6 s + voz 0,15 s. `agente/ensayo.py` ensaya una llamada por escrito.
- Web: piel nueva en `cine.css` (gris acero, un solo acento naranja, titulares en Archivo; la primera versión, dorada y con serifa, «se notaba hecha con IA»). Vídeo de portada en `media/portada.mp4`. Titular que gira: «¿Se te ha averiado» + aparato. La web anterior está en `version-anterior.html`.
- En ordenador, al apuntarse el primer dato se abre el «escenario»: conversación a la izquierda y solicitud grande con mapa de Google a la derecha (sin clave; con `<meta name="google-maps-clave">` usa la versión oficial).
- Datos confirmados: visita 60,50 € (50 € más IVA; cubre desplazamiento y presupuesto; se descuentan si repara) y técnicos con más de 35 años de experiencia. Andrés se presenta como asistente con IA formado con ese oficio, sin atribuirse años propios.
- Pendiente: probar la voz sobre el diseño nuevo, tono menos «compadre», teléfono y WhatsApp reales, garantía 3 o 6 meses, cuenta de Cloudflare y publicar (con OK).
