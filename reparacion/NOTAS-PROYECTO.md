# Notas del proyecto Reparo (léelas antes de seguir)

**Idioma: Juan habla SIEMPRE en español de España. Todo en español: respuestas, notas cortas, títulos, mensajes intermedios. Si se cuela algo en inglés, traducirlo. Dicta por voz: si una palabra no encaja, interpretar lo que quiso decir.**

## Qué es
Web de reparación de electrodomésticos (Granada y área metropolitana) atendida por un **técnico virtual por voz**, «Andrés», que conoce todas las marcas, resuelve dudas e intenta siempre que el cliente reserve la visita. Empresa: Area Internet Business Group, S.L.U. (Granada). Marca provisional: **Reparo**.

## Dónde está todo
- Repositorio `nuestrosproyectos/viajai`, carpeta `reparacion/` (no toca la web de viajes de la raíz ni `/lia/`).
- Rama con el trabajo: `claude/brave-pascal-azy07j`.
- Vista previa privada (solo la ve Juan): https://claude.ai/artifact/9QGWbc2JTTN6J12d7L2Am4 — se genera desde `reparacion/index.html` quitando doctype/html/head/body y con `cerebro.mjs` como archivo adjunto (capacidades: sample con imágenes, dictation, tts, db, user).

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

## Cómo trabajar con Juan
Soluciones, no excusas; verificar antes de decir que algo está hecho; pedir OK antes de publicar, desplegar, gastar dinero o enviar nada; tenerle al día con cifras; directo y sin tecnicismos.
