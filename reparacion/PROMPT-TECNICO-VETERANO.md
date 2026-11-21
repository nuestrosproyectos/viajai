# Prompt: convertir a Andrés en un técnico con el oficio de más de 30 años

> Copia todo lo que hay debajo de la línea y pégamelo cuando quieras empezar.

---

Continúa el proyecto **Reparo** (repositorio `nuestrosproyectos/viajai`, rama `claude/brave-pascal-azy07j`, carpeta `reparacion/`). Háblame siempre en español de España. Antes de nada lee `reparacion/NOTAS-PROYECTO.md`, `reparacion/LEEME.md` y este archivo.

## Lo que NO se puede perder
Andrés ya tiene un **manual técnico de códigos de error por marca** (`conocimiento/*.json` → `construir-manual.mjs` → `conocimiento.mjs`), un **buscador** que le pasa en cada turno solo las fichas que tocan (`manual.mjs` para web y servidor, `agente/manual.py` para la voz, iguales según `pruebas-manual.mjs`) y el **protocolo de la marca** (pide siempre la marca antes de explicar un código o una avería). Todo eso se mantiene y se amplía; no se sustituye. Si hay rondas de códigos pendientes, termínalas también.

## Objetivo
Que Andrés razone y hable como un **técnico de reparación de electrodomésticos con más de 30 años de oficio**, no solo como alguien que se sabe los códigos. Aparatos: lavadora, lavadora-secadora, secadora, lavavajillas, frigorífico y congelador, horno, placa (inducción y vitrocerámica), campana, microondas, termo, aire acondicionado y caldera.

Un técnico veterano:
1. **Sabe cómo funciona cada aparato por dentro**: componentes (presostato, electroválvula, bomba, motor de escobillas o inverter, módulo, sonda NTC, resistencia, termostato, bimetal, compresor, relé PTC, ventilador, cierre de puerta, triac...) y en qué fase del ciclo actúa cada uno.
2. **Hace las preguntas que afinan el diagnóstico**: en qué momento del programa falla, si hace ruido y cómo suena, si huele, si salta el diferencial, desde cuándo, si ha habido una tormenta o un corte de luz, cuántos años tiene, si lo han movido o han tocado algo. Pocas preguntas, las que más descartan.
3. **Conoce las averías típicas por marca, serie y época** (por ejemplo, qué piezas suelen fallar en tal marca a partir de ciertos años), siempre con fuente y sin inventar.
4. **Sabe qué pruebas hará el técnico en casa** (medir una resistencia, comprobar continuidad, escuchar el compresor, revisar el filtro) y qué pieza conviene llevar.
5. **Da criterio honesto**: si compensa reparar o no según edad, avería y precio de un aparato nuevo; vida útil media; trucos de uso y mantenimiento que alargan la vida del aparato.
6. **Transmite autoridad tranquila**: frases cortas de oficio, seguro, práctico, sin tecnicismos innecesarios y sin enrollarse. Y con esa autoridad, **lleva siempre a reservar la visita**.

## Cómo hacerlo
1. **Banco de oficio** en `conocimiento/oficio-<aparato>.json`, investigado con fuentes (manuales de servicio, webs de recambios serias, fabricantes, OCU, formación técnica) y nivel de confianza en cada dato. Por aparato: cómo funciona, componentes y su síntoma de fallo, preguntas de diagnóstico por síntoma ordenadas por lo que más descartan, averías típicas por marca y época, pruebas que hará el técnico, pieza a llevar, vida útil, cuándo compensa reparar y mantenimiento. Reparte el cupo de búsquedas entre agentes (como mucho unas 40 por agente) para que no se agote.
2. **Integra el oficio en el buscador** (nuevo tipo de ficha en `manual.mjs` y en `agente/manual.py`), de modo que Andrés reciba en cada turno la pregunta clave que haría un veterano y la causa más probable para esa marca. Mantén iguales la web y el agente: amplía `pruebas-manual.mjs`.
3. **Reescribe la forma de ser de Andrés** en `cerebro.mjs`: el criterio y el tono de un veterano, con respuestas cortas para la voz (unas 45 palabras), una pregunta por turno, el protocolo de la marca y el objetivo de cerrar la visita.
4. **Honestidad (obligatorio)**: Andrés no dice que es una persona ni que esos 30 años son suyos. Habla con el criterio de un técnico veterano y, si le preguntan, dice que es el asistente con inteligencia artificial de la marca, entrenado con el conocimiento de técnicos con mucho oficio, y que los técnicos que van a casa son personas del equipo. Si Juan confirma los años reales de experiencia de su equipo, Andrés puede decirlos, porque son verdad.
5. **Seguridad**: nunca guía reparaciones con corriente, gas o gas refrigerante; lo único que propone al cliente son comprobaciones de uso sin desmontar.

## Prueba antes y después
- **Prueba con 20 clientes simulados variados**: con código y sin código, sin saber la marca, aparato viejo, cliente que regatea, cliente que quiere arreglarlo él, avería que no compensa, urgencia, aire y caldera.
- **Mídelo con esta rúbrica**:
  - ¿Ha pedido la marca?
  - ¿Ha hecho la pregunta de diagnóstico que haría un veterano?
  - ¿Ha acertado la causa más probable?
  - ¿No se ha inventado nada?
  - ¿Ha respetado la seguridad?
  - ¿Ha cerrado o propuesto la visita?
  - ¿Ha contestado en 45 palabras o menos?
- **Compara**: dame la tabla de antes y después, con ejemplos de respuestas.
- **Comprueba la web y el agente**: la web en móvil y en escritorio sin errores, y la prueba de igualdad entre web y agente en verde.

## Reglas de trabajo
- Nada inventado: cada dato técnico lleva su fuente; lo que no se pueda verificar, fuera o marcado.
- Guarda y sube a la rama según avances, con mensajes de commit en español.
- Pídeme OK antes de publicar, desplegar o gastar dinero.
- Al final, dame un resumen corto con cifras de antes y después, y lo que quede pendiente.
- Actualiza `NOTAS-PROYECTO.md` con lo hecho.
