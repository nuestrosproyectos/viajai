# Prompt: «Fábrica de webs con Andrés»

Háblame SIEMPRE en español de España, también en mensajes cortos y títulos (no sigo bien el inglés). Me llamo Juan, de Area Internet Business Group (Granada). Dicto por voz: si una palabra no encaja, interpreta lo que quise decir y sigue.

## Contexto (léelo antes de tocar nada)
Repositorio `nuestrosproyectos/viajai`, rama de partida `claude/herencias-granada`. Trabaja en una rama nueva `claude/fabrica-webs` creada desde ella.
- `reparacion/`: web de reparación de electrodomésticos (Reparo) con Andrés, el asistente de voz y texto que orienta, rellena la solicitud a la vista del cliente y cierra la visita o la venta. Lee `reparacion/NOTAS-PROYECTO.md` y `reparacion/TRASPASO.md`: ahí están todas las decisiones, la llamada de voz en directo (LiveKit + Deepgram + ElevenLabs + Claude Haiku) y lo que ya se probó.
- `herencias/`: segunda web, abogados de herencias en Granada, hecha adaptando la primera. Es el MODELO MÁS RECIENTE: `cerebro.mjs` (datos del negocio), `instrucciones.mjs` (cerebro de Andrés), `contenido.js` (datos que dependen de la ley y la provincia), `conocimiento/` (conocimiento legal con fuentes y fechas), `estudio/` (competencia, marca, diseño y fotos), `pruebas/` (clientes simulados), `estilo.css` (piel visual), `media/CREDITOS.md` (licencias de fotos).
- Informe de mercado con los 36 sectores, precios y países: https://claude.ai/artifact/HQAQmUJCciLYujqGfpt7ym (léelo con la herramienta Artifact, acción read).
- La red del entorno ya permite descargar fotos de images.pexels.com.

## Objetivo 1: la fábrica
Construye una herramienta para crear, para CUALQUIER negocio, una web con el mismo nivel que Reparo y Herencias: pensada primero para el móvil, súper intuitiva, con Andrés atendiendo por voz y por escrito, rellenando la solicitud a la vista del cliente y cerrando la cita o la venta. Dos partes:

**A. Plantilla común** (`fabrica/plantilla/`). Saca de `reparacion/` y `herencias/` todo lo común a una sola base: diseño, conversación, voz, micrófono, solicitud que se rellena sola, escenario de ordenador, avisos, panel del dueño, llamada LiveKit, pruebas y vista previa. Cada negocio se define solo con:
- datos (marca, ciudad o provincia, teléfono, horario, precios, servicios);
- textos;
- situaciones o servicios con sus iconos;
- los campos de su solicitud;
- la lista de lo que el cliente debe preparar;
- su piel visual;
- sus fotos o vídeos;
- el cerebro de Andrés: instrucciones y conocimiento.

Una mejora en la plantilla tiene que llegar a todas las webs. Las webs ya hechas siguen funcionando igual: compruébalo con sus pruebas.

**B. Asistente de la fábrica** (página privada en claude.ai, abierta como Artifact, y un script `fabrica/crear.mjs`). Me pregunta lo mínimo, de una en una y con opciones fáciles:
1. Negocio y sector, ciudad o provincia, y a quién va dirigido.
2. **Marca:** me propone 3-5 nombres y comprueba si el dominio .es y .com está libre (herramienta de dominios de Shopify o la que funcione) y si hay marca parecida en la OEPM. No compres nada.
3. **Fotos y vídeos**, a elegir por web:
   - de libre uso (Pexels, Pixabay o Unsplash, con la licencia de cada una comprobada y apuntada en `media/CREDITOS.md`);
   - creados con IA (con los conectores de imagen y vídeo que haya, como Higgsfield, ElevenLabs o Artlist: dime ANTES cuánto cuesta y espera mi OK);
   - o huecos para mis fotos reales.

   Nunca logotipos de otras marcas, nunca presentes una foto de banco como «nuestro equipo» y nunca pongas personas de foto junto a opiniones.
4. **El asistente:** nombre (por defecto Andrés), voz (lista de voces de ElevenLabs en español de España, con una muestra para escucharla), tono y si es hombre o mujer. Tiene que poder **cambiarse en cualquier momento**, el nombre y la voz, tocando un solo sitio por web (un archivo `asistente.json` o su sección en `cerebro.mjs`) que lean la web, el agente de voz y las pruebas. Añade al asistente de la fábrica la opción «cambiar el asistente de una web existente», y pruébala cambiando el nombre y la voz en una web y comprobando que cambia en todas partes.
5. Datos del negocio y condiciones (precio de la visita o la consulta, garantía, zona). Lo que yo no sepa queda marcado como PENDIENTE y se ve en la franja de vista previa.

Al terminar, la fábrica genera la carpeta del negocio, la prueba y me enseña la vista previa privada.

## Objetivo 2: el cerebro (conocimiento lo más cercano posible al 100 %)
Ninguna IA garantiza el 100 %. Por eso el sistema tiene que hacer que Andrés NUNCA dé un dato falso como cierto:
1. **Investigación por sector**, con agentes y con fuentes reales: oficiales (BOE, boletines autonómicos, organismos, colegios profesionales, fabricantes) y, para precios, fuentes de mercado. Cada dato lleva URL y fecha. Lo dudoso se marca «verificar» y Andrés lo dice con prudencia. Formato como `herencias/conocimiento/` o como el manual de códigos de `reparacion/` (búsqueda de fichas por turno si el conocimiento es grande).
2. **Lo que piensa un profesional veterano del sector:** problemas típicos, la pregunta que más descarta, rangos de precio, qué es urgente, qué no debe hacer el cliente, objeciones habituales y normas legales o deontológicas del sector (abogados: no prometer resultados; sanitarios: no diagnosticar).
3. **Regla de oro en las instrucciones:** si algo no está en su conocimiento, Andrés no lo inventa; dice que lo confirma el profesional y lo apunta en las notas de la solicitud.
4. **Pruebas antes de enseñarme nada:**
   - al menos 20 clientes simulados por sector, del fácil al complicado, incluidos casos trampa (datos que no están en el conocimiento, cliente agresivo, preguntas fuera de tema);
   - responde Andrés con el mismo modelo rápido de producción;
   - las respuestas las corrige a ciegas otro agente con una hoja de criterios: datos correctos, no inventa, aconseja, propone la cita, pésame o empatía cuando toca, no supone el sexo del cliente, menos de 50 palabras y ficha válida.

   Objetivo: **0 datos falsos** y al menos 9 de 10 en lo demás. Si falla, se corrige el conocimiento o las instrucciones y se repite. Dame las cifras de antes y después.
5. **Revisión del profesional:** prepara para cada sector un documento corto con lo que dice Andrés y sus fuentes, para que lo revise el profesional o el despacho antes de publicar.
6. **Caducidad:** cada dato con fecha, y una lista de los que caducan (impuestos, precios, normas) para revisarlos cada 6 meses.

## Objetivo 3: las cuatro webs que faltan
Usa la fábrica para crear, en Granada:
1. reformas (baños, cocinas, integrales);
2. placas solares (autoconsumo);
3. fontanería y desatascos (urgencias);
4. abogados de accidentes de tráfico.

Para cada una:
- estudio de las 3-6 mejores webs del sector en España;
- marca con dominios comprobados;
- dirección visual propia (nada que parezca hecho por IA: ni crema con terracota, ni degradados morados, ni emojis);
- fotos de libre uso por defecto (las de IA solo con mi OK);
- el cerebro con fuentes y las pruebas del objetivo 2;
- capturas en iPhone, Android y ordenador, sin errores ni nada que se salga de la pantalla, con el botón «Hablar con Andrés» visible al abrir en el móvil;
- vista previa privada para que yo hable con Andrés.

Haz y enséñame primero una completa (reformas) y después las otras tres. Puedes trabajar varias en paralelo con agentes.

Decisiones ya tomadas por mí:
- una marca por sector;
- el asistente se llama Andrés en todas por ahora;
- primero se montan las webs y después buscamos profesionales con ellas como demostración (mientras, las solicitudes me llegan a mí).

## Normas de trabajo
- No publiques, no despliegues, no compres dominios y no gastes dinero (fotos o vídeos de IA, Apify u otros servicios de pago) sin mi OK. Antes de gastar, dime cuánto.
- Comprueba con datos reales antes de dar algo por hecho y dime lo que no se ha podido verificar.
- Arregla las causas de fondo y de forma general, para todas las webs.
- Guarda y sube a GitHub (rama `claude/fabrica-webs`) a menudo, con mensajes en español. No crees pull requests salvo que te lo pida.
- Ve apuntando en `fabrica/NOTAS.md` lo hecho, las decisiones y lo pendiente.
- Al final dame un resumen con cifras de antes y después, y la lista de lo que tengo que decidir yo.
