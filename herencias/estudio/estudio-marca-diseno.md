# Estudio de competencia, marca, diseño y fotos: web de herencias (Granada)

Fecha: 27 de noviembre de 2026. Ámbito: primera web provincial (Granada), pensada para repetirse por provincias.

## 0. Cómo se ha hecho y límites (léelo antes de nada)

- **Red de esta sesión.** Desde Bash no hay salida a internet. `curl` a unsplash.com, images.unsplash.com, pexels.com, images.pexels.com, consultas2.oepm.es, dominios.es, dns.google y rdap.verisign.com devuelve `403 (agent proxy: no rule or network setting allows this host)`. `dig`, `whois`, `host` y `nslookup` **no están instalados**, y Python no resuelve DNS (`socket.gaierror`). WebFetch también está bloqueado (por ejemplo, `getaddrinfo ENOTFOUND www.legalitas.com`).
- **Lo que sí ha funcionado:**
  - **WebSearch.** Da títulos, URL y extractos de lo que el buscador tiene indexado de cada web. Por eso la «primera pantalla» de cada competidor se ha reconstruido a partir de ese contenido indexado: **no he visto las webs renderizadas**. Además, WebSearch no reproduce exactamente el orden de Google España.
  - **Comprobación real de dominios con la herramienta de dominios de Shopify** (`generate-domain-names`). Consulta el registro y responde `available: true/false`. Es más fiable que el truco DNS que se pedía, que aquí no se podía hacer.
- **Herramienta que no he usado.** Hay un conector de Apify (web-fetch y búsqueda de Google) que permitiría abrir las páginas, ver la SERP real de Google.es y probar las URL de las fotos. No lo he usado porque cobra por petición y no tengo autorización para gastar.
- **OEPM.** No se ha podido consultar: consultas2.oepm.es está bloqueado por el proxy. La OEPM ofrece un «Localizador de marcas» gratuito ([folleto de marcas de la OEPM](https://www.oepm.es/export/sites/oepm/comun/documentos_relacionados/Publicaciones/Folletos/Marcas.pdf)). Hay que hacer esa comprobación a mano antes de decidir.

---

## 1. Competencia

Resultados obtenidos con las búsquedas «abogado herencias Granada», «abogado herencias» y «tramitar herencia». El primer bloque de resultados para Granada lo copan directorios como [asesor.legal](https://asesor.legal/?p=9591), [Páginas Amarillas](https://www.paginasamarillas.es/a/abogado-herencia/granada/) y [Trustlocal](https://trustlocal.es/granada/granada/abogado/). Si se excluyen, aparecen estos despachos ([búsqueda](https://pozoabogadosasociados.com/abogado-familia-granada/abogado-herencia-granada/)): Pozo Abogados, Gallardo & Valderas, David Donaire, Galán de Mora, Abadys, Oya Abogados, Recover Abogados, Zayas Fernández de Córdoba, Paumard y Jurand.

### 1.1 Pozo Abogados & Asociados (Granada, local)
- **URL:** https://pozoabogadosasociados.com/abogado-familia-granada/abogado-herencia-granada/
- **Primera pantalla (según lo indexado):** «Abogado de Herencias y Testamentos Granada». Herencias aparece como una subpágina de familia, dentro de un despacho generalista que también lleva divorcio, extranjería y segunda oportunidad ([web](https://pozoabogadosasociados.com/)).
- **Precios publicados (los más transparentes del mercado local):**
  - Consulta por WhatsApp o correo: **25 € + IVA**.
  - Por teléfono: **30 € + IVA**.
  - Por videollamada: **45 € + IVA**.
  - Presencial: **60 € + IVA**.
  - La consulta se descuenta si se contrata el asunto.
  - Tabla orientativa: «tramitación de herencia **800 – 3.000 €** con honorario fijo».
- **Confianza:** dice estar colegiado en el ICA de Granada y da dirección física (C. Tórtola, 17).
- **Llamadas a la acción:** reservar consulta por canal (WhatsApp, teléfono, vídeo, presencial).
- **Bien:** precio de entrada claro y escalonado por canal; la consulta se descuenta.
- **Mal:** no es especialista, porque las herencias se mezclan con extranjería o divorcios; cobrar la primera consulta frena a quien está de luto y solo quiere orientarse.

### 1.2 David Rodríguez Donaire, abogadoherenciasgranada.com (Granada, local y especialista)
- **URL:** https://abogadoherenciasgranada.com/ (y páginas por municipio: [Motril](https://abogadoherenciasgranada.com/motril/), [Armilla](https://abogadoherenciasgranada.com/armilla/), [Almuñécar](https://abogadoherenciasgranada.com/almunecar/), [Maracena](https://abogadoherenciasgranada.com/maracena/), [Las Gabias](https://abogadoherenciasgranada.com/las-gabias/)).
- **Primera pantalla:** «Abogado de herencias y testamentos en Granada y Provincia… Primera consulta GRATIS», con teléfono visible (662 60 17 80).
- **Precios:** ninguna tarifa; primera consulta gratis.
- **Confianza:** colegiado n.º 5687 y miembro de la junta del grupo de Sucesiones del ICA Granada ([sobre mí](https://abogadoherenciasgranada.com/sobre-mi/)); «más de 20 años» y «más de 800 familias granadinas»; «una herencia sencilla se resuelve en 2-3 meses». Dice expresamente que solo lleva herencias, ni divorcios, ni tráfico, ni multas.
- **Llamadas a la acción:** llamar por teléfono para la consulta gratuita.
- **Bien:** es el competidor más parecido a lo que queremos. Tiene dominio exacto, especialización pura, cifras humanas («800 familias»), un plazo orientativo y páginas por municipio que captan búsquedas locales.
- **Mal:** depende de una sola persona y un solo teléfono, sin atención fuera de horario ni precio orientativo. Las páginas tienen entre 283 y 542 días según el buscador, así que parecen poco actualizadas.

### 1.3 Gallardo & Valderas (Granada y Málaga)
- **URL:** https://www.gallardoyvalderas.com/
- **Primera pantalla:** «Abogados Herencias y Sucesiones en Granada», con más de 20 años en Derecho Sucesorio, dirección (Plaza del Campillo 2) y teléfono 958 073 721.
- **Precios:** no publica cifras. Tiene una página de [honorarios](https://www.gallardoyvalderas.com/honorarios/) que dice que se ajustan a los criterios del Colegio y que da presupuesto por escrito.
- **Confianza:** años de experiencia, dos sedes, [FAQ](https://www.gallardoyvalderas.com/faqs/) y blog.
- **Bien:** es un modelo multiprovincia (Granada y Málaga) como el nuestro, y tiene una página dedicada a honorarios.
- **Mal:** el blog está anticuado (impuesto de sucesiones [de 2017](https://www.gallardoyvalderas.com/novedades-impuesto-sucesiones-2017/)), lo que resta credibilidad fiscal; y no hay precio orientativo.

### 1.4 Galán de Mora Abogados (red nacional con páginas por ciudad)
- **URL:** https://www.galandemora.es/Granada/Herencias
- **Primera pantalla:** «Abogados herencias Granada ⭐️🥇️⭐️»: usa emojis en el título SEO y una puntuación muy visible.
- **Precios:** no publica.
- **Confianza:** «4,93 sobre 5 (1.733 votos)», con reseñas alojadas en su propia web, no en Google.
- **Bien:** pone las reseñas en primer plano, y los textos de clientes hablan de «trato cercano» y «franqueza», que es justo lo que busca este público.
- **Mal:** la misma plantilla en cientos de ciudades ([Grado](https://www.galandemora.es/Grado/Herencias), [Los Llanos de Aridane](https://www.galandemora.es/Los-Llanos-de-Aridane/Herencias)) huele a página puerta; los emojis restan seriedad; las reseñas propias son poco verificables.

### 1.5 Jurand Abogados (sede en Granada, firma multidisciplinar)
- **URL:** https://jurand.es/sedes/despacho-de-abogados-en-granada/herencias/
- **Primera pantalla:** «Abogado de Herencias en Granada». Se presentan como uno de los equipos «más especializados» de la comunidad.
- **Servicio descrito:**
  - certificados;
  - inventario;
  - escritura de partición;
  - impuesto;
  - inscripción en el Registro;
  - demandas por legítima o nulidad de testamento.
- **Plazo fiscal:** seis meses, ampliables otros seis si se pide en los cinco primeros meses.
- **Precios:** no publica.
- **Bien:** explica el proceso completo paso a paso, que es lo que más tranquiliza.
- **Mal:** los datos de contacto cambian según la página, hay artículos fiscales con cifras de 2020 ([ejemplo](https://jurand.es/impuesto-sucesiones-donaciones-diferencias/)) y el tono es genérico de firma grande.

### 1.6 Heritae (plataforma nacional especializada, Madrid y online)
- **URL:** https://heritae.es/
- **Primera pantalla:** «Abogados de Herencias en Madrid». Servicios separados por situación: [herencia sin testamento](https://heritae.es/herencia-sin-testamento/), [herencias sin acuerdo](https://heritae.es/herencias-sin-acuerdo/), [herencias judiciales](https://heritae.es/herencias-judiciales/), [gestoría](https://heritae.es/gestoria/), [planificación](https://heritae.es/planificacion-de-herencias/) y [herencia a medida](https://heritae.es/herencia-a-medida/).
- **Precios:**
  - La web anuncia honorarios cerrados y primera consulta gratuita; la notaría y los demás costes van aparte ([servicios](https://heritae.es/servicios-heritae/)).
  - En prensa: 5.500 € con IVA por gestión integral, 2.999 € para caudales de hasta 200.000 €, y planificación desde 99 € + IVA ([El Referente](https://elreferente.es/inversiones/nace-heritae-startup-espanola-gestiona-manera-integral-herencias/), [El Referente directorio](https://elreferente.es/directorio/heritae)).
  - Idealista habla de «tarifa plana», que puede subir mucho si hay litigio ([idealista](https://www.idealista.com/news/node/787708)).
  - Son cifras de 2021 o antes, así que pueden estar desfasadas.
- **Confianza:** página de [fundadores](https://heritae.es/quienes-somos/) y presencia en prensa.
- **Bien:** organiza la web por la situación de la familia (con o sin testamento, con o sin acuerdo). Es la mejor arquitectura de información del grupo.
- **Mal:** es madrileña y sin presencia local en Granada; sus precios de entrada son altos para herencias pequeñas.

### 1.7 Legálitas (plataforma nacional generalista)
- **URL:** https://www.legalitas.com/servicios/abogados-herencias y https://abogado.legalitas.com/herencias
- **Primera pantalla:** «Abogados especialistas en herencias y sucesiones»; un formulario de consulta y teléfono gratuito (900 370 842).
- **Precios:** suscripción, no precio por herencia. Según la página, «desde 19,90 €/mes»; también aparecen 21,90 €/mes y 29,90 €/mes, que es incoherente. El plan Contigo Plus figura a 358,80 €/año ([promo](https://www.legalitas.com/promo/empresa/pmax)).
- **Confianza:** marca conocida y equipo de abogados ([equipo](https://www.legalitas.com/nuestros-abogados)).
- **Bien:** recoge dudas reales (aceptar a beneficio de inventario, desheredación, aplazamiento del impuesto).
- **Mal:** quien acaba de perder a un familiar no quiere suscribirse a nada; hay precios contradictorios entre páginas; no es local.

### 1.8 Billeo (gestoría online nacional, «tramitar herencia»)
- **URL:** https://www.billeo.es/servicios/juridico/herencias-sucesiones y [guía de precios](https://www.billeo.es/blog/gestorias-herencias-opiniones)
- **Primera pantalla:** «Precio cerrado. Sin sorpresas. Todo incluido.», con [calculadora del impuesto](https://www.billeo.es/recursos/calculadora-herencias).
- **Precios:** sitúa el mercado de gestoría en **300 € – 1.500 €** según herederos e inmuebles, y da presupuesto cerrado tras revisar el caso, separando aranceles, impuestos y suplidos.
- **Bien:** tiene precio cerrado, una calculadora como imán y criterios honestos para elegir gestoría ([guía](https://www.billeo.es/blog/como-elegir-gestoria-herencias-sucesiones)).
- **Mal:** reconoce que una gestoría no puede defender en juicio si un heredero impugna. **Ese es nuestro hueco: abogado = papeleo + conflicto.**

### 1.9 Referencias de precio de mercado (para calibrar)
- Despachos de sucesiones: 1.000 € – 10.000 € según complejidad, o 100-300 €/hora ([Life5](https://life5.es/blog/educacion-financiera/abogados-especialistas-herenicas-sucesiones/)).
- Abogado en Granada: coste medio 300 € – 3.000 € por trabajo, según el directorio Trustlocal ([Trustlocal](https://trustlocal.es/granada/granada/abogado/)).
- Bancos: Bankinter cobra 85 € por su testamentaría online, solo para clientes ([Bankinter](https://www.bankinter.com/banca/ayuda/tramite-testamento-heredero-cuentas)), y CaixaBank tramita la parte bancaria online ([CaixaBank](https://www.caixabank.es/particular/general/testamentaria.html)). Sirven de referencia de «lo mínimo» que la gente conoce.

### 1.10 Diez conclusiones concretas para nuestra web
1. **Nadie en Granada atiende al momento.** Todos dependen de «llame en horario» o de un formulario. Andrés, que responde a las 23:00 de un domingo, es la diferencia principal y debe estar en el titular, no escondido.
2. **Primera orientación gratuita, y que se note.** Donaire y Zayas la ofrecen gratis y Pozo la cobra (25-60 €). Para un público de luto, la gratuidad baja la barrera: «Hablar con Andrés es gratis. La primera consulta con el abogado, también».
3. **Publicar un precio orientativo cerrado.** Solo Pozo (800-3.000 €) y Billeo (300-1.500 €) dan cifras. Propuesta: «Herencia sin conflicto: precio cerrado desde X €, por escrito antes de empezar». Se aclara que notaría, registro e impuesto van aparte, como hace Heritae.
4. **Organizar por situación de la familia, no por términos jurídicos,** como Heritae: «Hay testamento», «No hay testamento», «Mis hermanos y yo no nos ponemos de acuerdo», «Hay deudas o no sé si aceptar», «Hay una casa o un piso».
5. **Ocupar el hueco gestoría–abogado.** La propia Billeo admite que no defiende en juicio. Mensaje: «Lo tramitamos todo, y si hay un conflicto, seguimos contigo».
6. **Credenciales verificables arriba:** número de colegiado del ICA Granada, nombre y foto real del abogado, dirección física. Donaire lo hace bien; Galán de Mora usa reseñas propias poco creíbles. Lo nuestro: reseñas de Google enlazadas, sin estrellas inventadas.
7. **Un plazo humano y el plazo fiscal visibles.** Donaire da «2-3 meses para una herencia sencilla»; Jurand recuerda los seis meses del impuesto con prórroga. Un bloque «Qué pasa y cuándo» con una línea de tiempo reduce la ansiedad y crea urgencia sin presión.
8. **Contenido fiscal vigente y fechado.** Gallardo & Valderas y Jurand pierden credibilidad con artículos de 2017 y 2020. Cada FAQ debe llevar «Revisado en [mes, año]».
9. **Páginas por municipio sin texto copiado.** Donaire capta Motril, Armilla y Almuñécar; Galán de Mora repite una plantilla en cientos de ciudades. Plan: una página por provincia con datos locales reales (dirección, notarías, oficina liquidadora, partidos judiciales). Duplicar texto con solo el topónimo cambiado es contraproducente.
10. **Sobriedad visual como ventaja.** Las webs locales tienen títulos con emojis («⭐️🥇️», «✅», «✔️») y un aspecto genérico. Una web serena, legible y rápida en móvil, sin emojis ni balanzas, ya destaca por contraste.

---

## 2. Marca

**Criterios:**
- corta;
- sin ambigüedad al dictarla por teléfono («con hache», «todo junto»);
- que funcione con «[Marca] Granada» o «[Marca] Málaga»;
- relacionada con herencias pero no genérica (una marca puramente descriptiva es más difícil de registrar).

**Método de comprobación de dominios:** herramienta de dominios de Shopify, que consulta el registro y devuelve `available: true/false` en el momento de la llamada. No es una reserva: hay que registrarlo pronto. Para .com, si la variante no aparecía como disponible, la he consultado de forma exacta.

**Descartadas por dominio ocupado** (en uso según el buscador o `available: false`):
- hereda.es: despacho de sucesiones en uso ([hereda.es](https://hereda.es/)).
- herenciaclara.com: web de herencias ([herenciaclara.com](http://herenciaclara.com/mi-herencia/)); herenciaclara.es también ocupado.
- legadia.es: herencias yacentes, Madrid ([legadia.es](https://www.legadia.es/)).
- sucesia.com: [sucesia.com](https://www.sucesia.com/post/qu%C3%A9-pasa-cuando-una-persona-fallece-sin-testamento).
- caudal.es: [caudal.es](https://caudal.es/cultivo/).
- Ocupados sin más detalle: heredo.es, albacea.es, heredas.es, heredamos.es, lindero.es, tuparte.es, sucesor.es, sucesa.es, partidor.es, testamentaria.es, herenciasencilla.es, herenciatranquila.es y herenciaenorden.es.
- Aviso aparte: «Grupo Hereda» tiene reseñas negativas publicadas ([gowork](https://es.gowork.com/grupo-hereda-madrid)), así que conviene alejarse de «Hereda».

### 2.1 Los 8 nombres propuestos

| # | Marca | Uso con provincia | .es | .com | Marca idéntica (búsqueda web) | Comentario |
|---|---|---|---|---|---|---|
| 1 | **Herencial** | Herencial Granada | **Disponible** | **Disponible** | No encontrada ([búsqueda](https://www.crunchbase.com/organization/herencia)) | Una palabra, suena a «herencia» pero es propia. Se dicta sin dudas («herencial, como herencia con ele»). |
| 2 | **Hijuela** | Hijuela Granada | **Disponible** | **Disponible** | No encontrada ([búsqueda](https://fc-abogados.com/diccionario-juridico/hijuela/)) | Término jurídico real: el lote que corresponde a cada heredero ([definición](https://fc-abogados.com/diccionario-juridico/hijuela/)). Distintiva y castiza, pero muchos no la conocen y, por descriptiva, la OEPM podría poner pegas en clase 45. |
| 3 | **Herencia Serena** | Herencia Serena Granada | **Disponible** | **Disponible** | No encontrada | Transmite exactamente el tono. Dos palabras, algo larga para dominio con provincia. |
| 4 | **Herenza** | Herenza Granada | **Disponible** | Ocupado | No encontrada | Corta, pero hay que deletrearla al teléfono («con zeta») y suena italiana. |
| 5 | **Herencia en Paz** | Herencia en Paz Granada | **Disponible** | Ocupado | No comprobado | Promesa emocional fuerte (paz entre hermanos); .com ocupado. |
| 6 | **Caudal Claro** | Caudal Claro Granada | **Disponible** | Ocupado | No comprobado | «Caudal hereditario» y «claro»; bonito, pero «caudal» suena a agua o banca. |
| 7 | **Legaro** | Legaro Granada | **Disponible** | Ocupado | No comprobado | Inventada a partir de «legar». Corta, pero no dice nada a quien la oye por primera vez. |
| 8 | **Reparto Justo** | Reparto Justo Granada | **Disponible** | No figura como disponible | No comprobado | Muy clara para conflictos entre hermanos; puede sonar a mensajería o a reclamación. |

**OEPM:** no accesible desde esta sesión (proxy 403 en consultas2.oepm.es). Las búsquedas web no muestran marcas idénticas para Herencial, Herencia Serena ni Herenza ([resultado](https://trademarks.justia.com/owners/herencia-wine-company-inc-2916129)); aparecen marcas con «Herencia» en vinos y moda. **Pendiente:** buscar cada nombre en el Localizador de marcas de la OEPM y en el EUIPO (eSearch plus), clases 45 (servicios jurídicos) y 35, antes de registrar dominio o marca.

### 2.2 Recomendación (las 3 mejores)
1. **Herencial**: .es y .com disponibles. Es la más registrable (inventada pero comprensible), la más corta al teléfono y escala igual en todas las provincias («Herencial Málaga», «Herencial Sevilla»). Dominio único `herencial.es` con rutas `/granada`, `/malaga`, y el .com para proteger la marca.
2. **Herencia Serena**: .es y .com disponibles. Es la que mejor expresa el tono; ideal si se prefiere una promesa a un nombre propio. Riesgo: es más descriptiva y, por tanto, más débil como marca registrada.
3. **Hijuela**: .es y .com disponibles. Es la más distintiva y con raíz jurídica española. Funciona como nombre con historia («la hijuela es lo que te toca; nosotros te ayudamos a que llegue bien»), pero conviene probarla antes con 5-10 personas del público objetivo.

---

## 3. Dirección visual

**Idea:** «despacho con luz de mañana». Es sereno y ordenado, con la calma de un sitio donde alguien te explica las cosas despacio. Nada de crema ni terracota; nada de lujo; nada de tribunales. Se inspira en el verde de los cipreses del Generalife y en el azul de Sierra Nevada en invierno, con fondos casi blancos y algo fríos.

Lo que se conserva de la web de reparación (`/home/user/viajai/reparacion/`):
- la estructura móvil primero (portada, cómo funciona, precios, preguntas, contacto y la capa de conversación con Andrés);
- la regla de color «un color = Andrés, otro = acciones de la persona»;
- las fuentes alojadas en la propia web.

Lo que cambia: la paleta, que allí es almagra, cobalto y fondo crema `#F5F1E8`.

### 3.1 Paleta (contrastes WCAG calculados con Python en esta sesión)

| Token | Uso | Claro | Oscuro |
|---|---|---|---|
| `--fondo` | fondo general | `#F6F7F5` (blanco gris verdoso) | `#0F1513` |
| `--tarjeta` | tarjetas y capas | `#FFFFFF` | `#17201D` |
| `--tinta` | texto principal | `#1B2321` (14,9:1 sobre fondo) | `#E6ECEA` (15,4:1) |
| `--tinta-2` | texto secundario | `#4A5652` (7,1:1) | `#A7B4B0` (8,6:1) |
| `--cipres` | **acciones de la persona** (botón principal, enlaces) | `#1F4A42`; texto blanco encima: 9,9:1 | `#86C5B3`; texto `#0F1513` encima: 9,4:1 |
| `--sierra` | **todo lo que es Andrés** (burbuja, micrófono, estado) | `#2F5D86`; blanco encima: 6,9:1 | `#93B9DE` (8,1:1 sobre tarjeta) |
| `--plazo` | avisos de plazo (seis meses, etc.), solo en detalles | `#8A5A00` (5,5:1) | `#E0B45C` (8,6:1) |
| `--linea` | bordes y separadores | `#D5DBD8` | `#2A3532` |
| `--cipres-suave` | fondo de bloques destacados | `#E3ECE8` (tinta encima: 13,3:1) | `#1C2B27` |

Reglas:
- Sin degradados. Sombras mínimas (1 px de borde más una sombra muy difusa).
- Esquinas de 10-12 px.
- El ocre `--plazo` nunca va en botones: solo marca plazos.

### 3.2 Tipografía (ambas en Google Fonts y libres, OFL)
- **Titulares: Schibsted Grotesk** (600-700). Grotesca editorial de periódico nórdico: seria sin ser fría, y escapa del cliché del serif de bufete.
- **Texto e interfaz: Atkinson Hyperlegible Next** (400/700). Pensada para baja visión, adecuada para personas de 60-75 años. Ya se usa en la web de reparación, así que se reaprovecha el subconjunto en español.
- **Tamaños en móvil:**
  - cuerpo de 18 px con interlineado 1,6;
  - titular de 30-34 px;
  - botones de 18 px, con altura mínima de 52 px.
- Alojar las dos fuentes en la propia web (woff2 recortado al español), igual que en la web de reparación, sin llamadas a Google.

### 3.3 Tono de las fotos
- **Luz:** natural y lateral, de mañana; nada de flash ni tonos dorados de atardecer.
- **Color:** ligeramente desaturado y algo frío; se admite blanco y negro en una sola foto emocional.
- **Contenido:**
  - manos, papeles, mesas, llaves;
  - personas reales de 45-75 años, de espaldas o de perfil más que mirando a cámara;
  - alguna vista de Granada en plano general.
- **Prohibido:** mazos, balanzas, columnas, libros de derecho apilados, gente sonriendo a cámara con traje, apretones de manos de negocios.
- **Tratamiento uniforme:** saturación −15 %, una capa muy leve de `--fondo` al 6 %, y siempre recorte horizontal 3:2 o vertical 4:5 en móvil.

### 3.4 Tono de los textos
- **Persona:** de tú por defecto, como en la web de reparación, con frases cortas. Valorar el usted si las pruebas con el público lo piden.
- **Dar el pésame una vez y pasar a la acción,** sin repetirlo en cada bloque: «Sentimos tu pérdida. Ahora, vamos paso a paso».
- **Explicar cada término la primera vez que aparece:** «declaración de herederos (el documento que dice quién hereda cuando no hay testamento)».
- **Prometer claridad, no milagros.** Nada de «ahorra miles en impuestos» ni «el mejor abogado de Granada».
- **Prohibido:** emojis, signos de exclamación en serie, «¡Contacta ya!», anglicismos («lead», «checklist»).

### 3.5 Estructura de la página (móvil, en este orden)
1. **Barra superior fina:** marca y botón de llamar (icono más «958 …»).
2. **Portada:** titular, subtítulo, botón principal «Hablar con Andrés ahora» y botón secundario «Prefiero que me llamen». Debajo, tres datos de confianza en una línea: «Abogado colegiado ICA Granada n.º ____ · Primera consulta gratis · Precio cerrado por escrito».
3. **«¿Cuál es tu situación?»:** cinco tarjetas que abren a Andrés con el contexto ya cargado: Hay testamento · No hay testamento · No nos ponemos de acuerdo · Hay deudas o no sé si aceptar · Hay una casa o un piso.
4. **«Qué pasa y cuándo»:** línea de tiempo con días de referencia.
   - Certificado de últimas voluntades.
   - Declaración de herederos o copia del testamento.
   - Inventario.
   - Escritura en notaría.
   - Impuesto (seis meses).
   - Registro.
5. **«Qué hacemos nosotros»:** papeleo completo y, si hay conflicto, seguimos (el hueco que deja la gestoría).
6. **Precios:** primera consulta gratis; precio cerrado orientativo para herencia sin conflicto; lo que va aparte (notaría, registro, impuesto); presupuesto por escrito.
7. **Quién te atiende:** foto real del abogado, número de colegiado, años, dirección del despacho en Granada. Andrés se presenta como asistente, no como abogado.
8. **Opiniones:** reseñas de Google, con enlace a la ficha, sin estrellas inventadas.
9. **Preguntas frecuentes**, con la fecha de revisión.
10. **Contacto:** dirección, mapa estático, horario, teléfono, WhatsApp y Andrés las 24 horas.
11. **Pie:** aviso legal, privacidad y aviso de que Andrés orienta pero no sustituye al abogado.
12. **Capa de conversación con Andrés** (como `#conv` en la web de reparación).

### 3.6 Textos propuestos
- **Titular:** «Te ayudamos con la herencia, paso a paso y sin prisas.»
  - Alternativa: «La herencia de tu familia, en orden y sin discusiones.»
- **Subtítulo:** «Cuéntaselo a Andrés, nuestro asistente: te atiende ahora mismo, te explica qué hay que hacer y te reserva una primera consulta gratuita con un abogado de herencias en Granada.»
- **Botón principal:** «Hablar con Andrés ahora»
- **Botón secundario:** «Prefiero que me llamen»

### 3.7 Seis preguntas frecuentes (borrador: el abogado debe revisarlas y fecharlas)
1. **¿Cuánto tiempo tengo para hacer los trámites de la herencia?**
   El impuesto de sucesiones se presenta en seis meses desde el fallecimiento. Se puede pedir una prórroga de otros seis si se solicita en los cinco primeros meses ([Jurand](https://jurand.es/sedes/despacho-de-abogados-en-granada/herencias/)). Lo mejor es empezar cuanto antes: algunos certificados tardan semanas.
2. **¿Tengo que pagar para hablar con vosotros?**
   No. Hablar con Andrés es gratis y la primera consulta con el abogado también. Si después nos encargas la herencia, te damos un precio cerrado por escrito antes de empezar.
3. **Mis hermanos y yo no nos ponemos de acuerdo. ¿Podéis ayudarnos?**
   Sí. Primero intentamos un acuerdo hablando con todos; si no es posible, te defendemos en la partición judicial. Una gestoría no puede hacer esto último ([Billeo](https://www.billeo.es/blog/gestorias-herencias-opiniones)).
4. **Si acepto la herencia, ¿heredo también las deudas?**
   Al aceptar se acepta todo, bienes y deudas. Pero se puede aceptar «a beneficio de inventario», y entonces solo respondes de las deudas con lo que hay en la herencia, no con tu dinero ([Legálitas](https://www.legalitas.com/servicios/abogados-herencias)). Te ayudamos a decidir antes de firmar nada.
5. **No sé si había testamento. ¿Cómo lo averiguo?**
   Se pide el certificado de últimas voluntades. A partir de ahí sabremos si hay testamento y en qué notaría está. Si no lo hay, hace falta una declaración de herederos. Andrés te dice qué documentos necesitas.
6. **¿Andrés es un abogado?**
   No. Andrés es un asistente con inteligencia artificial que te orienta y recoge tu caso para que no tengas que contarlo dos veces. Las decisiones y los documentos los revisa y firma siempre un abogado colegiado en Granada.

---

## 4. Fotos (Pexels)

**Licencia:**
- Pexels permite el uso comercial gratuito sin atribución obligatoria ([licencia Pexels](https://www.pexels.com/license/), [ayuda Pexels](https://help.pexels.com/hc/en-us/articles/360042295174-What-is-the-license-of-the-photos-and-videos-on-Pexels)).
- Restricciones relevantes ([términos](https://www.pexels.com/terms-of-service/)):
  - **no dar a entender que las personas de la foto respaldan el servicio**: nunca ponerlas junto a una reseña o testimonio;
  - no usar fotos con logotipos o marcas;
  - no revender copias sin modificar.
- He elegido Pexels porque sus URL de descarga siguen un patrón construible a partir del identificador. En Unsplash la URL directa depende de un identificador interno que no he podido leer al no poder abrir sus páginas.

**Comprobación de descarga:** **no se ha podido hacer.** `curl -sI` a images.pexels.com e images.unsplash.com devuelve `403 Forbidden (agent proxy: no rule or network setting allows this host)`. Hay que probarlas desde otra máquina o pedir que se permitan esos dominios en la red de la sesión.

**Patrón de las URL:** `https://images.pexels.com/photos/ID/pexels-photo-ID.jpeg?auto=compress&cs=tinysrgb&w=1600`. Es el patrón habitual de Pexels, pero en fotos recientes el nombre de archivo puede ser distinto, así que hay que verificarlo.

**Autor:** sale de los metadatos de la página indexada (citada en cada fila).

| # | Página de la foto | Descarga (1600 px, sin verificar) | Autor | Uso propuesto |
|---|---|---|---|---|
| 1 | https://www.pexels.com/photo/a-person-signing-a-document-in-close-up-shot-8730987/ | https://images.pexels.com/photos/8730987/pexels-photo-8730987.jpeg?auto=compress&cs=tinysrgb&w=1600 | Mikhail Nilov | Bloque «Qué hacemos»: la escritura en notaría (vertical 4:5) |
| 2 | https://www.pexels.com/photo/selective-focus-photography-of-person-signing-on-paper-261621/ | https://images.pexels.com/photos/261621/pexels-photo-261621.jpeg?auto=compress&cs=tinysrgb&w=1600 | Pixabay | Alternativa a la 1; cabecera de la página de precios |
| 3 | https://www.pexels.com/photo/senior-mother-and-mature-daughter-in-cafe-3733929/ | https://images.pexels.com/photos/3733929/pexels-photo-3733929.jpeg?auto=compress&cs=tinysrgb&w=1600 | Brett Sayles | **Portada** (persona mayor con hija conversando; cuadrada, recortar a 4:5) |
| 4 | https://www.pexels.com/photo/mother-and-daughter-sitting-at-the-table-and-holding-hands-17066496/ | https://images.pexels.com/photos/17066496/pexels-photo-17066496.jpeg?auto=compress&cs=tinysrgb&w=1600 | Danik Prihodko | La única foto en blanco y negro: bloque «Sentimos tu pérdida» o «Quién te atiende» |
| 5 | https://www.pexels.com/photo/a-big-family-having-conversation-in-the-kitchen-5082872/ | https://images.pexels.com/photos/5082872/pexels-photo-5082872.jpeg?auto=compress&cs=tinysrgb&w=1600 | Vanessa Loring | Tarjeta «No nos ponemos de acuerdo» / mediación familiar |
| 6 | https://www.pexels.com/photo/man-couple-love-woman-7979404/ | https://images.pexels.com/photos/7979404/pexels-photo-7979404.jpeg?auto=compress&cs=tinysrgb&w=1600 | Kindel Media | «Primera consulta»: despacho luminoso con pareja y profesional |
| 7 | https://www.pexels.com/photo/hand-holding-house-keys-in-modern-interior-31651009/ | https://images.pexels.com/photos/31651009/pexels-photo-31651009.jpeg?auto=compress&cs=tinysrgb&w=1600 | Jakub Zerdzicki | Tarjeta «Hay una casa o un piso» |
| 8 | https://www.pexels.com/photo/person-holding-a-silver-keychain-with-a-key-7578977/ | https://images.pexels.com/photos/7578977/pexels-photo-7578977.jpeg?auto=compress&cs=tinysrgb&w=1600 | Kindel Media | Alternativa a la 7; paso «Registro de la Propiedad» de la línea de tiempo |
| 9 | https://www.pexels.com/photo/glasses-on-paperwork-and-laptop-on-table-8036339/ | https://images.pexels.com/photos/8036339/pexels-photo-8036339.jpeg?auto=compress&cs=tinysrgb&w=1600 | Ron Lach | Bloque «Qué pasa y cuándo» (papeles y gafas sobre la mesa) |
| 10 | https://www.pexels.com/photo/an-elderly-woman-wearing-eyeglasses-while-reading-documents-7545336/ | https://images.pexels.com/photos/7545336/pexels-photo-7545336.jpeg?auto=compress&cs=tinysrgb&w=1600 | SHVETS production | Tarjeta «Hay deudas o no sé si aceptar» / FAQ |
| 11 | https://www.pexels.com/photo/aerial-view-of-historic-granada-neighborhoods-30359825/ | https://images.pexels.com/photos/30359825/pexels-photo-30359825.jpeg?auto=compress&cs=tinysrgb&w=1600 | Sebastiaan Been | Bloque «Contacto / despacho en Granada» (tejados del Albaicín) |
| 12 | https://www.pexels.com/photo/panorama-of-granada-during-sunset-21294775/ | https://images.pexels.com/photos/21294775/pexels-photo-21294775.jpeg?auto=compress&cs=tinysrgb&w=1600 | Victor de Dompablo | Pie de página o imagen para compartir; corregir a tono frío porque es de atardecer |

Fuentes de autoría: metadatos de cada página según el buscador. Para la n.º 2 (Pixabay) y la n.º 9 (Ron Lach), el crédito viene de los resultados agrupados ([búsqueda de firmas](https://www.pexels.com/photo/selective-focus-photography-of-person-signing-on-paper-261621/), [gafas](https://www.pexels.com/photo/glasses-on-paperwork-and-laptop-on-table-8036339/)).

**Descartada:** https://www.pexels.com/photo/mother-and-daughter-having-a-conversation-8841609/ (Julia M Cameron). El título no coincide con la descripción de la página, que habla de una cena familiar al aire libre.

**Siguiente paso recomendado:** desde una máquina con red, ejecutar este bucle. Si alguna no da 200, abrir su página y copiar el enlace de «Descarga gratuita».

```sh
for id in 8730987 261621 3733929 17066496 5082872 7979404 31651009 7578977 8036339 7545336 30359825 21294775; do
  echo "$id $(curl -s -o /dev/null -w '%{http_code}' "https://images.pexels.com/photos/$id/pexels-photo-$id.jpeg?auto=compress&cs=tinysrgb&w=1600")"
done
```

Después hay que descargarlas, recortarlas y convertirlas a AVIF/WebP en la carpeta `media/` de la web. No se deben enlazar en caliente a Pexels.
