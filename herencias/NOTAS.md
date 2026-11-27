# Herencias Granada (marca provisional «Herencial»)

**Idioma con Juan: SIEMPRE español de España.**

## Qué es
Web de abogados de herencias por provincia (empezando por Granada), hecha con la misma maquinaria que Reparo: Andrés orienta con conocimiento legal, rellena la solicitud de primera consulta a la vista del cliente y la registra. Una web por provincia (mismo dominio con rutas: /granada, /malaga…).

- Vista previa privada: https://claude.ai/artifact/Y6UYCcaroUy1GTbCjxxmAJ (se genera con `vista-previa.html`: cabeza y cuerpo de index.html sin doctype/html/head/body; archivos adjuntos estilo.css, cerebro.mjs, instrucciones.mjs, contenido.js, fuentes y media; capacidades sample con imágenes, dictation, tts, db, user).
- Rama: `claude/herencias-granada`.

## Archivos
- `cerebro.mjs`: datos del despacho y de la provincia (lo PENDIENTE, marcado).
- `instrucciones.mjs`: cerebro de Andrés (no se publica; .assetsignore).
- `contenido.js`: sección del impuesto y preguntas frecuentes (revisado 27-11-2026).
- `conocimiento/herencias-andalucia.md`: conocimiento con fuentes oficiales y fechas; lo marcado «verificar» se dice con prudencia.
- `estudio/estudio-marca-diseno.md`: competencia (8 webs), marcas con dominios, dirección visual, fotos.
- `media/CREDITOS.md`: fotos de Pexels (licencia comercial libre).
- `pruebas/`: 10 clientes simulados (`node pruebas/preparar.mjs vN`).

## Decisiones
- Juan: una marca por sector; Andrés en todas; Andrés aconseja de verdad con cifras orientativas («lo más probable», el abogado confirma), sin prometer resultados (normas de la abogacía).
- En lugar del mapa de la visita: lista de documentos que se ajusta al caso (testamento, bienes, parentesco).
- Paleta «despacho con luz de mañana»: verde ciprés (acciones del cliente) y azul Sierra (Andrés).

## Pruebas (27-11-2026, 10 clientes, mismo modelo rápido)
- v1: 0 datos falsos; pésame 1/10; propone consulta 3/10; «tranquilo» 1 vez.
- v2 (instrucciones corregidas): 0 datos falsos; pésame 9/9; consulta 9/10 (la 10.ª es la confirmación de datos); 0 suposiciones de sexo; todas < 50 palabras.
- Web: móvil, Android y ordenador sin errores ni desbordamiento; conversación de principio a fin (8 campos, documentos ajustados, aviso registrado).

## Pendiente
- Marca: «Herencial» está cogida (.es y .com). Recomendadas con .es y .com libres: Herencial, Herencia Serena, Hijuela. Falta la OEPM.
- Despacho colaborador: nombre, nº de colegiado del ICA Granada, dirección, teléfono, horario, si la primera consulta es gratis y precio cerrado orientativo.
- Que el abogado revise `contenido.js` y el conocimiento (sobre todo lo marcado «verificar»: tarifa andaluza, art. 27 vivienda habitual, coeficientes de plusvalía 2026).
- Voz en directo (LiveKit): el agente de Reparo tendría que cargar estas instrucciones (lo prepara la fábrica).
