# Hoja de criterios para corregir a ciegas CONVERSACIONES COMPLETAS del asistente

Corriges sin saber qué versión de las instrucciones se usó. Para cada conversación tienes: `conversacion.txt` (todo lo que se dijo; las respuestas del asistente llevan sus etiquetas <ficha>, <mostrar> y <aviso>), la historia del cliente simulado y el criterio de la conversación (en `criterios.json`), y el conocimiento con fuentes del sector más `cerebro.mjs` (lo único que vale como «dato correcto»).

Puntúa la conversación ENTERA con 1 (cumple), 0 (no cumple) o null (no aplica):

1. **dato_falso** (1 = HAY al menos un dato falso en algún turno): algo dado como cierto que contradice el conocimiento o no está en él (precio exacto, ayuda, norma, plazo, teléfono, «gratis» de algo que no consta).
2. **completa**: a lo largo de la conversación da lo esencial que pide el criterio (los datos del caso), aunque sea repartido en varios turnos.
3. **cita**: propone la cita con un verbo de oferta como muy tarde en su 2.ª respuesta (salvo que el caso no lo permita) y la lleva hasta el final si el cliente quiere.
4. **datos_bien**: pide los datos en dos preguntas como mucho (nombre y teléfono juntos; dónde y cuándo juntos: así se le ha indicado), no repregunta lo que el cliente ya dijo, repite el teléfono para confirmarlo y confirma una sola vez.
5. **aviso_valido**: si el cliente aceptó y dio sus datos, hay UN <aviso> con JSON válido, con los datos que dio (sin inventar ninguno) y emitido después de confirmar; null si el cliente no llegó a aceptar.
6. **coherente**: no se contradice entre turnos, no repite la misma explicación, recuerda lo dicho y mantiene el tú o el usted del cliente.
7. **empatia**: empatía breve cuando toca (susto, lesión, persona mayor, enfado); null si no toca.
8. **sin_genero**: no supone el sexo de la persona (ni en lo dicho ni en fichas y aviso), salvo que el cliente lo haya dejado claro.
9. **corta**: TODAS las respuestas, en lo que se dice en voz alta, tienen menos de 50 palabras.
10. **fichas_validas**: todas las <ficha> son JSON válido de una línea y no llevan datos que el cliente no haya dicho ni decisiones que no haya tomado.
11. **criterio_conversacion**: cumple lo específico del criterio de la conversación.

Además: **turnos** (número de respuestas del asistente), **acaba_en_cita** (1 si el cliente terminó con la solicitud enviada, 0 si no), **nota** de 0 a 10 como lo valoraría el dueño del negocio (¿le traería el cliente sin engañarle?) y **comentario** de una o dos frases con lo mejor y el fallo principal.

Formato de salida (JSON, una entrada por conversación):
{"web":"reformas","id":1,"turnos":4,"acaba_en_cita":1,"dato_falso":0,"completa":1,"cita":1,"datos_bien":1,"aviso_valido":1,"coherente":1,"empatia":null,"sin_genero":1,"corta":1,"fichas_validas":1,"criterio_conversacion":1,"nota":8,"comentario":"…"}
