# Prompt: ¿en qué países podemos usar el motor sin riesgo legal?

Copia todo lo que hay debajo de la línea en una sesión de investigación (Claude con búsqueda web).

---

Eres un analista de cumplimiento normativo y de mercado. Responde en español de España, claro y sin tecnicismos,
porque el lector es un empresario, no un abogado.

## El negocio

Somos una empresa española (Area Internet Business Group, S.L.U., Granada). Recibimos avisos de particulares que
necesitan **reparar electrodomésticos** (lavadoras, frigoríficos, hornos, lavavajillas…) y buscamos **técnicos
reparadores autónomos o pequeñas empresas** a quienes pasarles esos trabajos a cambio de una comisión por trabajo
cobrado. No les vendemos nada ni les cobramos cuotas.

Para encontrarlos usamos una herramienta propia que:
1. Saca negocios de Google Maps (nombre, web, teléfono, categoría) con Apify.
2. Busca en su web un email corporativo (info@, contacto@…).
3. Les manda **un primer mensaje** y como mucho dos recordatorios, con identificación completa de la empresa,
   origen del dato y baja en un clic, invitándoles a escribirnos por WhatsApp si les interesa.
4. Volumen bajo: 10–40 mensajes al día por buzón.

Queremos saber **en qué países podemos hacer ese primer contacto sin consentimiento previo y sin riesgo legal**,
y por qué canal: **email**, **WhatsApp** o **SMS**. El destinatario es siempre un negocio o un autónomo que se
anuncia públicamente en Google Maps.

## Lo que necesito

### 1. Ranking de países
Analiza como mínimo: Portugal, Francia, Italia, Alemania, Reino Unido, Irlanda, Países Bajos, Bélgica, Estados Unidos,
Canadá, Australia, México, Colombia, Argentina, Chile, Perú, Brasil y España (como referencia). Añade cualquier otro
país que destaque por ser especialmente favorable.

Para cada país y para cada canal (email, WhatsApp, SMS) indica:
- **¿Se permite el primer contacto comercial sin consentimiento a empresas? ¿Y a autónomos o empresarios
  individuales?** Responde «Sí», «Sí con condiciones», «No» o «Sin claridad».
- Las condiciones exactas: oposición u opt-out, relación con su actividad, identificación, registro previo,
  listas de exclusión (tipo Robinson, Bloctel o TPS), horarios.
- La ley y el artículo concretos, y la autoridad que sanciona.
- Multas reales impuestas por este tipo de envíos en los últimos años, si las hay, con la cuantía.
- Una **nota de 0 a 10** de lo seguro que es usar la herramienta tal como está, y otra de 0 a 10 de lo fácil
  que es el mercado para nosotros: idioma (la herramienta escribe en es, en, fr, de, it, pt), uso de WhatsApp en
  el país, cobertura de Google Maps y si hay técnicos de electrodomésticos anunciados.

Ordena la tabla final de más a menos recomendable.

### 2. WhatsApp y SMS: lo que dice la plataforma, no solo la ley
- Las **políticas de Meta para WhatsApp Business** (Cloud API y app): ¿permiten escribir a alguien que no ha dado
  su consentimiento? ¿Qué pasa con las cuentas que lo hacen: bloqueo, calidad, límites? Cita la política vigente.
- Los SMS comerciales: requisitos de remitente, registro (por ejemplo 10DLC en EE. UU. o el registro de alfanuméricos)
  y opt-out en los países mejor puntuados.

### 3. Recomendación final
- Los 3 mejores países para empezar, con el canal recomendado y por qué.
- Qué tendríamos que cambiar en la herramienta para cada uno (idioma, horarios, pie legal, lista de exclusión,
  canal).
- Los riesgos que siguen existiendo aunque el país lo permita.

## Reglas
- Usa **fuentes oficiales primero**: el texto de la ley en el boletín oficial y la web de la autoridad de protección
  de datos o de telecomunicaciones (CNIL, Garante, CNPD, ICO, FTC, CRTC, ACMA, ANPD…). Pon el enlace de cada afirmación.
- Si solo encuentras fuentes secundarias (despachos, blogs), dilo y baja la confianza.
- No inventes. Si algo no está claro o no lo has podido verificar, escribe «sin verificar».
- Indica la fecha de cada fuente cuando la tenga; la normativa cambia.
- Esto es orientación práctica, no un dictamen legal. Señala los países donde convendría consultar a un abogado local.
