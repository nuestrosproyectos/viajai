# Pruebas del cerebro (objetivo 2) · 27-11-2026

Cómo: 24-26 clientes simulados por sector (fáciles, medios, difíciles y trampa), en `<web>/pruebas/clientes.json`. Responde **Claude Haiku** (el modelo rápido de producción) con exactamente lo que recibiría en la web (`node fabrica/pruebas/preparar.mjs <web> <ronda>`). Corrige **a ciegas** otro agente con `fabrica/pruebas/hoja-criterios.md` y el conocimiento con fuentes del sector. Resumen: `node fabrica/pruebas/resumen.mjs <web>/pruebas/<ronda>/evaluacion.json`.

Notas de 0 a 10 (proporción de casos que cumplen). «Datos falsos» = número de respuestas con un dato falso dado como cierto.

| Web | Ronda | Clientes | Datos falsos | Datos correctos | No inventa | Aconseja | Propone cita | Empatía | Sin suponer sexo | <50 palabras | Ficha válida | Criterio del caso | Nota del dueño |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Reformas | 1 (antes) | 24 | 0 | 10 | 10 | 7,4 | 8,6 | 6,0 | 10 | 8,8 | 10 | 5,0 | 7,04 |
| Reformas | 2 | 24 | **2** | 8,7 | 10 | 9,1 | 8,2 | 8,3 | 10 | 9,6 | 9,6 | 7,1 | 7,29 |
| Reformas | 3 | 24 | 0 | 10 | 10 | 9,1 | 8,6 | 7,5 | 10 | 8,8 | 10 | 5,4 | 7,38 |
| Reformas | 4 (después) | 24 | **0** | 10 | 10 | 8,3 | **10** | **10** | 9,6 | **10** | 9,6 | 3,3 | 7,21 |
| Reformas | 5 (60 palabras) | 24 | 0 | 10 | 10 | 9,1 | 10 | 5,0 | 10 | 8,8 (≤60) | 9,2 | 3,8 | 7,17 |
| Placas solares | 1 (antes) | 26 | 0 | 10 | 10 | 7,6 | 8,4 | 5,0 | 10 | 10 | 10 | 6,5 | 7,08 |
| Placas solares | 2 | 26 | **1** | 9,6 | 9,6 | 8,4 | 7,2 | 6,7 | 10 | 10 | 10 | 4,2 | 6,85 |
| Placas solares | 3 (después) | 26 | **0** | 10 | 10 | 8,4 | **10** | 5,0 | 10 | 10 | 9,6 | 6,5 | 7,31 |
| Placas solares | 4 (60 palabras) | 26 | **2** | 9,2 | 9,2 | 8,8 | 8,1 | 10 | 10 | 9,6 (≤60) | 10 | 5,4 | 6,96 |
| Fontanería | 1 (antes) | 25 | 0 | 10 | 10 | 9,2 | 8,2 | 8,0 | 10 | 10 | 10 | 5,2 | 7,08 |
| Fontanería | 2 | 25 | 0 | 10 | 10 | 9,6 | 5,9 | 6,7 | 10 | 10 | 10 | 4,8 | 6,84 |
| Fontanería | 3 (después) | 25 | **0** | 10 | 10 | 9,6 | **9,5** | 5,7 | 10 | 10 | 9,6 | 4,8 | 7,40 |
| Fontanería | 4 (60 palabras) | 25 | 0 | 10 | 10 | 8,8 | 10 | 6,0 | 10 | 10 (≤60) | 8,0 | 4,0 | 7,28 |
| Accidentes | 1 (antes) | 26 | 0 | 9,5 | 9,6 | 8,8 | 8,1 | 5,0 | 10 | 9,2 | 10 | 5,0 | 7,00 |
| Accidentes | 2 (después) | 26 | **0** | 10 | 10 | 8,8 | 8,4 | 8,5 | 10 | 10 | 8,8 | 5,4 | 7,04 |
| Accidentes | 3 (60 palabras) | 26 | 0 | 10 | 10 | 9,2 | 7,3 | 8,5 | 9,6 | 9,6 (≤60) | 9,6 | 4,2 | 6,77 |

## Ronda con 60 palabras (pedida por Juan, 27-11-2026)
Mismos clientes, mismo modelo (Haiku), corrección a ciegas. Las respuestas se alargan (de ~40 a ~51 palabras de media) pero **no mejoran**: nota media de las cuatro webs 7,05 frente a 7,24 con 45 palabras. El «criterio del caso» no sube (3,8-5,4) porque las palabras de más se van en explicar, no en lo que pedía el caso; en placas y accidentes baja la propuesta de cita (8,1 y 7,3) y en placas vuelven **2 datos falsos** (cliente 12: «estudio gratuito» para revisar una instalación ajena, el mismo fallo que se corrigió en la ronda 3; cliente 19: promete que el presupuesto «recoge el ahorro estimado»). Ojo: es una sola pasada por cliente, hay ruido de ±0,2.

## Qué se corrigió entre rondas (en el cerebro común, para todas las webs, salvo lo marcado)
- R1→R2: dar siempre el rango de precio si lo pide; empatía con miedo, susto o personas mayores; usted en toda la conversación; una sola pregunta; rellenar en la ficha lo que el cliente ya dijo.
- R2→R3 (2 datos falsos en reformas): no repartir ni reasignar cifras; revisar excepciones (edificios protegidos, otro municipio); proponer la cita de forma explícita como muy tarde en la 2.ª respuesta; reformas: Albaicín/centro → licencia y técnico.
- R3→R4: estructura fija de respuesta (empatía + dato útil + cierre con la cita); 45 palabras como máximo; respeto a quien ya tiene profesional; chuletas por sector; **botón «Quiero la cita» en la web bajo cada respuesta** (la venta ya no depende de que el modelo lo diga).
- Placas R2→R3 (1 dato dudoso: «visita gratis» para revisar una instalación ajena): solo es gratis lo que las condiciones dicen que es gratis.
- Fontanería R2→R3: tras la seguridad, cerrar siempre con la visita (salvo gas); olor a desagüe no es gas.
- Fallo de fondo encontrado por las pruebas: la web aceptaba un aviso sin nombre ni teléfono. Ahora solo registra avisos con los datos obligatorios y teléfono válido (todas las webs).

## Lo que queda por debajo de 9 y por qué
- **Criterio del caso (3-6,5):** cada caso pide 3-5 cosas concretas y la respuesta tiene que caber en 45 palabras (se lee en voz alta). Es un equilibrio entre brevedad y completitud: decisión de Juan (ver «Lo que tienes que decidir»).
- **Empatía:** pocos casos la piden (4-13 por web) y Haiku a veces la omite; mejoró en reformas (10) y accidentes (8,5).
- **Aconseja (8,3-9,6):** en algunos casos deriva al profesional en vez de dar el dato que sí tiene.
