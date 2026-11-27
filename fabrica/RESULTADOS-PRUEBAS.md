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
| Reformas | 6 (45 + casos) | 24 | **0** | 10 | 10 | **10** | 9,1 | 8,0 | 10 | 10 | 9,6 | **6,3** | **7,54** |
| Placas solares | 1 (antes) | 26 | 0 | 10 | 10 | 7,6 | 8,4 | 5,0 | 10 | 10 | 10 | 6,5 | 7,08 |
| Placas solares | 2 | 26 | **1** | 9,6 | 9,6 | 8,4 | 7,2 | 6,7 | 10 | 10 | 10 | 4,2 | 6,85 |
| Placas solares | 3 (después) | 26 | **0** | 10 | 10 | 8,4 | **10** | 5,0 | 10 | 10 | 9,6 | 6,5 | 7,31 |
| Placas solares | 4 (60 palabras) | 26 | **2** | 9,2 | 9,2 | 8,8 | 8,1 | 10 | 10 | 9,6 (≤60) | 10 | 5,4 | 6,96 |
| Placas solares | 5 (45 + casos) | 26 | **0** | 10 | 10 | 9,6 | 8,3 | 7,5 | 10 | 10 | 10 | **6,9** | **7,42** |
| Fontanería | 1 (antes) | 25 | 0 | 10 | 10 | 9,2 | 8,2 | 8,0 | 10 | 10 | 10 | 5,2 | 7,08 |
| Fontanería | 2 | 25 | 0 | 10 | 10 | 9,6 | 5,9 | 6,7 | 10 | 10 | 10 | 4,8 | 6,84 |
| Fontanería | 3 (después) | 25 | **0** | 10 | 10 | 9,6 | **9,5** | 5,7 | 10 | 10 | 9,6 | 4,8 | 7,40 |
| Fontanería | 4 (60 palabras) | 25 | 0 | 10 | 10 | 8,8 | 10 | 6,0 | 10 | 10 (≤60) | 8,0 | 4,0 | 7,28 |
| Fontanería | 5 (45 + casos) | 25 | **0** | 10 | 10 | 9,6 | 9,5 | 8,0 | 10 | 10 | 10 | **6,0** | **7,44** |
| Accidentes | 1 (antes) | 26 | 0 | 9,5 | 9,6 | 8,8 | 8,1 | 5,0 | 10 | 9,2 | 10 | 5,0 | 7,00 |
| Accidentes | 2 (después) | 26 | **0** | 10 | 10 | 8,8 | 8,4 | 8,5 | 10 | 10 | 8,8 | 5,4 | 7,04 |
| Accidentes | 3 (60 palabras) | 26 | 0 | 10 | 10 | 9,2 | 7,3 | 8,5 | 9,6 | 9,6 (≤60) | 9,6 | 4,2 | 6,77 |
| Accidentes | 4 (45 + casos) | 26 | **0** | 9,6 | 9,6 | 9,2 | 9,6 | 9,2 | 10 | 10 | 9,6 | **6,2** | **7,31** |

## Ronda con 60 palabras (pedida por Juan, 27-11-2026)
Mismos clientes, mismo modelo (Haiku), corrección a ciegas. Las respuestas se alargan (de ~40 a ~51 palabras de media) pero **no mejoran**: nota media de las cuatro webs 7,05 frente a 7,24 con 45 palabras. El «criterio del caso» no sube (3,8-5,4) porque las palabras de más se van en explicar, no en lo que pedía el caso; en placas y accidentes baja la propuesta de cita (8,1 y 7,3) y en placas vuelven **2 datos falsos** (cliente 12: «estudio gratuito» para revisar una instalación ajena, el mismo fallo que se corrigió en la ronda 3; cliente 19: promete que el presupuesto «recoge el ahorro estimado»). Ojo: es una sola pasada por cliente, hay ruido de ±0,2.

## Ronda con 45 palabras + instrucciones por tipo de caso (27-11-2026)
Vuelta a 45 palabras y, en cada sector, 18 tipos de caso con el dato concreto que hay que dar (todo sacado del conocimiento con fuentes), más reglas firmes en la base: «gratis» solo para lo que dicen las condiciones, no prometer qué lleva el presupuesto, comprobar el verbo de oferta de la cita, ficha sin decisiones ni género.
- Clientes de siempre (101): nota media **7,43** (antes 7,24 con 45 palabras y 7,05 con 60); **criterio del caso de 5,0 a 6,4** de media; **0 datos falsos**; 42 palabras de media.
- **16 clientes nuevos** que las instrucciones nunca habían visto (4 por sector, `<web>/pruebas/clientes-nuevos.json`, `preparar.mjs … --nuevos`): nota 7,06, **0 datos falsos**, criterio del caso 5,6. Mejora algo menos que con los de siempre (era de esperar: los casos se escribieron mirando sus fallos), pero no rompe nada.
- Sigue por debajo de 9: el criterio del caso (6-7). Cada caso pide 3-5 cosas y en 45 palabras caben 1-2: el resto se da en el siguiente turno, que estas pruebas (de una sola respuesta) no ven.
- Fallo a vigilar: en placas, al comparar un presupuesto con batería, usó el rango de «casa con batería» en vez del precio por kWh (cliente 16).

## Conversaciones completas (varios turnos) · 27-11-2026
Cómo: 16 escenarios (4 por sector, `<web>/pruebas/conversaciones.json`): un cliente simulado con su historia y sus datos (que Andrés no ve) habla por turnos con Andrés (Claude Haiku, con exactamente lo que recibe en la web) hasta pedir la cita o irse; se corrige la conversación entera a ciegas con `fabrica/pruebas/hoja-conversaciones.md`. Órdenes: `node fabrica/pruebas/conversar.mjs preparar|asistente|cliente|estado|cerrar <web> <ronda>` y `node fabrica/pruebas/resumen-conversaciones.mjs <ronda>`.

| Vuelta | Acaban en cita | Datos falsos | Datos bien tomados | No repite / coherente | Empatía | Lo que pedía el caso | Aviso válido | Nota | Respuestas por conversación |
|---|---|---|---|---|---|---|---|---|---|
| 1 (antes) | 16/16 | 0 | 6,3 | 3,1 | 7,5 | 2,5 | 6,3 | 6,75 | 5,0 |
| 2 (después) | 16/16 | 1 | **9,4** | **8,8** | **10** | **5,0** | 6,9 | **7,00** | 7,6 |
| 3 (datos en dos preguntas) | 16/16 | 2 (1 real*) | — ** | 6,9 | 6,7 | 2,5 | **10** | 6,94 | **6,2** |

\* Vuelta 3: uno de los dos «datos falsos» es una condición nuestra de reformas («el presupuesto incluye escombros y limpieza final», está en sus condiciones pero sin confirmar por Juan: queda como PENDIENTE); el otro, placas prometiendo «el ahorro por escrito», ya corregido. \*\* «Datos bien tomados» no se puede comparar: los correctores usaron la hoja antigua («de uno en uno») y penalizaron justo el cambio pedido; según sus propios comentarios, las 16 repiten el teléfono y confirman una sola vez (hoja ya corregida).
Vuelta 3 en resumen: la solicitud llega antes (6,2 respuestas frente a 7,6) y todos los avisos son válidos (10), pero bajan la empatía y lo que pedía el caso, en parte por ruido (una sola pasada por conversación). Nota igual (6,94 frente a 7,00).

Cambios entre vueltas (en la base común): confirmar nombre, teléfono, dirección y hora ANTES de enviar aunque el cliente lo dé todo de golpe; ir dando el resto de datos del caso mientras se toman los datos; no repetir explicaciones; empatía en la primera respuesta; en el aviso solo lo que dijo el cliente; reformas y placas piden calle y número.

**Fallo grave encontrado y arreglado:** en la 2.ª vuelta, 6 de 16 avisos salieron sin la etiqueta de cierre `</aviso>` y la web los habría perdido (el cliente veía «enviada» y no se guardaba nada). La web ahora los lee igual (comprobado: 32 de 32 avisos reales de las pruebas, antes 26) y las instrucciones piden cerrarlo siempre.
Pendiente: las conversaciones se alargan (7,6 respuestas): conviene pedir nombre y teléfono juntos y la dirección completa de una vez. Dato falso de la vuelta 2: fontanería dijo que una fuga cortada «puede esperar a mañana» (el conocimiento dice «unas horas»); corregido en sus casos.

## Abogados de accidentes, vueltas de una en una (8 conversaciones completas cada vez)
| | c5 | c6 | c7 |
|---|---|---|---|
| Acaban en cita | 8/8 | 8/8 | 8/8 |
| Datos falsos | 1 | 0 | 0 |
| Cuenta lo que pide su caso (criterio) | 1,3 | **8,8** | 6,3 |
| Da lo esencial (completa) | 5,0 | **8,8** | **10** |
| Datos bien tomados | 7,5 | 8,8 | **10** |
| Coherente | 8,8 | 6,3 | 8,8 |
| Empatía | 10 | 10 | 10 |
| Respuestas hasta la cita | 5,6 | 5,6 | **4,0** |
| Nota media | 6,38 | 7,38 | **8,00** |

Cambio c5→c6: Andrés lleva en la ficha una lista interna «porDecir» con lo que le falta contar de su caso y cada respuesta dice el primero; pide siempre el municipio y lo repite al confirmar; nunca dice cuándo será la cita; con un familiar en la UCI, primero la salud y sin cifras en la primera respuesta.
Lo que bajó (coherente): a veces suelta el punto pendiente sin venir a cuento («si aún no has ido al médico…» a quien tiene el alta). Cambio c6→c7: primero contesta lo que pregunta, el pendiente va enlazado y explicado, y se descarta si ya no le sirve; en el aviso, nada de lesiones sin permiso.
c7: nota 8,00, cita en 4 respuestas de media (antes 5,6), sin datos falsos. Lo que queda (criterio 6,3 en 3 de 8): al ser más corta, a veces no llega a decir un punto (pasajeros en la UCI, culpa compartida). Ajustado tras c7: con un familiar grave, primero salud y «los pasajeros casi siempre cobran», el baremo después; urgente si la aseguradora mete prisa; si pregunta «¿para cuándo?», el plazo habitual.

## Abogados de herencias (Andrés pasado a la plantilla común; 8 conversaciones)
| | c1 | c2 |
|---|---|---|
| Acaban en cita | 8/8 | 8/8 |
| Datos falsos | 0 | 0 |
| Criterio del caso | 5,0 | 3,8 |
| Completa | 7,5 | **10** |
| Coherente | 5,0 | **8,8** |
| Datos bien tomados | 10 | 7,5 |
| Fichas / aviso válidos | 7,5 / 7,5 | 8,8 / 7,5 |
| Empatía, corta | 10 | 10 |
| Nota media | 7,25 | **7,38** |

Fallos c1: repite la misma frase si el cliente vuelve a preguntar; rellena «No lo sé» o un parentesco por defecto en la ficha; tutea a una señora de 81 años en la primera respuesta; se deja plusvalía, prórroga, parte libre de la pareja y usufructo de la viuda. Cambios c1→c2: si repite la pregunta, explicarlo de otra forma con lo concreto; campos con opciones vacíos hasta que lo diga; usted desde la primera respuesta si es mayor o saluda formal (base común); casos de herencias completados (viudo, banco con los tres papeles, plazo para sobrinos, plusvalía para hijos, parte libre).
c2: ya no repite frases (coherente 8,8) ni tutea a la mayor; sigue dejándose un punto del criterio en 5 de 8 y en 2 pide la franja antes del nombre (tres preguntas). Cambios c2→c3: sumar los datos de TODOS los tipos de caso que encajan; la franja ya no se pregunta al ofrecer la cita sino con los datos (base común); si no sabe si hay testamento (o si la pareja estaba inscrita), esa es la pregunta de cierre; parentesco solo con quien falleció.

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
