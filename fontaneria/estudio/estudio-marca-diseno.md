# Estudio de competencia, marca, diseño y fotos: web de fontanería y desatascos (Granada)

Fecha: 27 de noviembre de 2026. Ámbito: primera web en Granada y área metropolitana, con una marca pensada para toda España. Servicio: fontanería, desatascos y urgencias 24 h (fugas, atascos, cisternas, calentadores y termos, detección de fugas, reparación de tuberías).

## 0. Cómo se ha hecho y límites (léelo antes de nada)

- **Red de esta sesión.** Desde Bash solo sale tráfico a images.pexels.com. WebFetch está bloqueado: `www.cronoshare.com` y `www.pexels.com` responden `getaddrinfo ENOTFOUND`. **No he visto ninguna web renderizada:** la «primera pantalla» de cada competidor se reconstruye con los extractos que da el buscador.
- **WebSearch** funcionó hasta que se agotó el cupo compartido de la sesión (200 búsquedas entre todos los agentes). A partir de ahí **no he podido buscar** ni fotos de Pexels por tema, ni la OEPM, ni precios concretos de detección de fugas con geófono, ni información de Emasagra. Todo lo que falta por ese motivo está marcado como (verificar).
- **Dominios:** comprobados con la herramienta de dominios de Shopify (`generate-domain-names`), que consulta el registro y responde `available: true/false` en el momento. No se ha comprado nada.
- **No usado:** el conector de Apify (de pago).
- **Fotos:** al no poder buscar en Pexels, las he localizado probando identificadores directamente en images.pexels.com y revisando hojas de miniaturas. Las cinco elegidas las he abierto y revisado una a una, pero **no he podido leer el autor** de ninguna (ver `media/CREDITOS.md`).

---

## 1. Competencia

Al buscar «fontanero urgente 24 horas Granada» o «desatascos Granada 24h», el primer bloque de resultados lo copan directorios: [Cronoshare](https://www.cronoshare.com/cuanto-cuesta/fontanero/granada), [Páginas Amarillas](https://www.paginasamarillas.es/a/desatascos/granada/), [Trustlocal](https://trustlocal.es/granada/albolote/fontanero/) y [Habitissimo](https://www.habitissimo.es/empresas/fontaneros/granada). Si se excluyen, aparecen estas webs propias ([búsqueda](https://fontanerosnevada.es/)): Fontaneros Nevada, Alcántara Fernández, Servicio Xpress, Fontanero Barato, AquaGas Granada, HomeServe y fontanerogranada.org.

### 1.1 Fontaneros Nevada (Granada, local)
- **URL:** https://fontanerosnevada.es/ y páginas por barrio y municipio ([zonas](https://fontanerosnevada.es/zonas/): [Centro](https://fontanerosnevada.es/zonas/fontanero-centro/), [Realejo](https://fontanerosnevada.es/zonas/fontanero-realejo/), [Atarfe](https://fontanerosnevada.es/zonas/fontanero-atarfe/), [Gójar](https://fontanerosnevada.es/zonas/fontanero-gojar/), [Peligros](https://fontanerosnevada.es/zonas/fontanero-peligros/), [Otura](https://fontanerosnevada.es/zonas/fontanero-otura/)…).
- **Primera pantalla (según lo indexado):** «Fontanero en Granada», 24 horas los 365 días, tiempo medio de llegada de 30 a 45 minutos en la capital y el área; teléfono de urgencias 637 512 907.
- **Precios:** no publica tarifas. Dice que no cobra desplazamiento en la mayor parte del área metropolitana, **pero solo si se acepta el presupuesto** y se hace el trabajo.
- **Confianza:** «4,9/5 con 280 reseñas» de Google mostradas en su web (no he podido comprobarlas en Google).
- **Llamadas a la acción:** llamar.
- **Bien:** es el mejor ejemplo local de SEO por barrio, con tiempos por zona (Centro 15-25 min, Realejo 20-30 min, área 45-60 min). Un tiempo de llegada concreto tranquiliza más que «rápido».
- **Mal:** el «desplazamiento gratis» lleva letra pequeña; no da ningún precio, ni siquiera orientativo.

### 1.2 Alcántara Fernández Fontaneros (Granada, local)
- **URL:** https://www.fontanerosgranadaalcantara.com/ y [guía 2026](https://www.fontanerosgranadaalcantara.com/blog/fontanero-granada)
- **Primera pantalla:** «Fontaneros Granada 24h», urgencias en menos de 30 minutos, «presupuesto cerrado sin sorpresas», teléfono 625 567 612.
- **Precios:** recargo del **35 % de 23:00 a 8:00 y festivos**, avisado antes de empezar; visita y presupuesto gratis si se acepta el trabajo. Su guía habla de **60-180 €** por una reparación habitual en horario laboral y de un recargo del **30-50 %** en urgencias nocturnas y festivos (las dos cifras no casan entre sí).
- **Confianza:** «5,0 en Google con 20 reseñas», en Granada desde 2011 (según su blog), garantía por escrito.
- **Bien:** es el único local que **publica la regla del recargo nocturno**, y su guía enseña a desconfiar de quien no da ni un rango por teléfono.
- **Mal:** pocas reseñas; datos contradictorios (35 % frente a 30-50 %); sin precio de salida.

### 1.3 Servicio Xpress (red nacional con página para Granada)
- **URL:** https://servicioxpress.com/fontanero-urgente-granada/ y [precios Granada](https://servicioxpress.com/fontanero-granada-precios/); páginas casi iguales para Madrid, Fuengirola, Utrera, Tres Cantos, Nervión…
- **Primera pantalla:** «Desde 60 €», llegada en unos 30 minutos, teléfono 601 895 629.
- **Precios publicados para Granada (tabla):** fuga 35-70 €; cisterna o mecanismo del WC 25-60 €; fontanero urgente 24 h 60-120 €; detección de fugas con cámara 70-140 €. Para Madrid publica el doble: fuga 60-150 €, cisterna 40-100 €, urgencia 100-250 €, detección 120-250 € ([Madrid](https://servicioxpress.com/fontaneros-madrid-precios/)).
- **Bien:** **la tabla de precios por avería** es exactamente lo que busca quien tiene el agua corriendo. Es el formato a copiar.
- **Mal:** plantilla repetida por ciudades (huele a intermediario); el «desde 60 €» no cuadra con todas las tablas; no se sabe quién va a casa.

### 1.4 HomeServe (nacional, aseguradoras)
- **URL:** https://www.homeserve.es/fontaneros/granada/granada, [provincia](https://www.homeserve.es/fontaneros/granada), [preguntas frecuentes](https://www.homeserve.es/faqs)
- **Primera pantalla:** fontaneros 24 h los 365 días; teléfono 911 774 593 (aparece con dos formatos distintos).
- **Precios:** sin desplazamiento; según sus FAQ, la urgencia lleva un suplemento **máximo de 24,20 € más impuestos**, y en día laborable acuden en menos de 3 horas. Presupuesto en casa.
- **Confianza:** marca grande, «más de 4.000 profesionales», **1 año de garantía**.
- **Bien:** suplemento de urgencia acotado y por escrito; garantía clara.
- **Mal:** teléfono de Madrid (91…) para Granada; «3 horas» no es urgencia de verdad; páginas antiguas (algunas de hace más de 2.000 días según el buscador).

### 1.5 Fontanero Barato (red nacional de páginas por municipio)
- **URL:** https://fontanerobarato.com/granada/ (y cientos de municipios: [Carcer](https://fontanerobarato.com/carcer/), [La Calahorra](https://fontanerobarato.com/la-calahorra/)…)
- **Primera pantalla:** «Fontanero Urgente Granada», «llegamos en 45 min».
- **Precios:** solo en algunas páginas: reparación sencilla 50-80 €, desatascos o calderas 80-200 €.
- **Confianza:** **garantía de 2 años** en mano de obra y materiales.
- **Bien:** la garantía larga como argumento.
- **Mal:** páginas puerta casi idénticas; el nombre «barato» resta confianza en una urgencia.

### 1.6 Desabeco 24H y otros desatascos (Atarfe y área, solo en directorios)
- **Dónde:** [Páginas Amarillas](https://www.paginasamarillas.es/f/atarfe/desabeco_202820734_000000001.html?gm=consultar), [Cronoshare](https://www.cronoshare.com/croner-1091008-desabeco), [proveedores.com](https://www.proveedores.com/proveedores/desabeco-24h/).
- **Lo que dicen:** especialistas en desatascos con cobertura urgente 24 h en Granada, también fontanería; trabajan desde 2007. El teléfono aparece distinto en dos directorios (655 862 010 y 655 862 009).
- **Precios:** no publicados. Otros del área (Urgeclick, Yavoi, Midagra) anuncian «24H/365D», cámara de inspección y fosas sépticas ([Páginas Amarillas](https://www.paginasamarillas.es/a/desatascos/granada/)).
- **Lección:** los desatascos de Granada **no tienen web propia potente**; el hueco para «desatascos Granada» está libre de webs buenas.

### 1.7 Lo que no he podido ver
- Ninguna web renderizada (ni móvil ni escritorio): no sé si el teléfono es un botón fijo, cuánto tarda en cargar ni cómo es el formulario.
- AquaGas Granada (https://www.aquagasgranada.es/) y fontanerogranada.org solo aparecen por el título; de AquaGas los directorios dicen que es empresa autorizada de fontanería y gas, con camión de desatascos y localización de fugas ([Habitissimo](https://www.habitissimo.es/pro/aquagas-granada-s-l), [Cronoshare](https://www.cronoshare.com/croner-1408427-aquagas-granada-sl)).
- Reseñas reales en Google Maps de ninguno.
- El orden real de Google España (WebSearch no lo reproduce).

### 1.8 Diez conclusiones concretas para nuestra web
1. **El miedo nº 1 es la factura sorpresa.** La OCU recoge reclamaciones de 180 € + IVA solo por desplazamiento y de 506 € por «nocturnidad» y «desplazamiento urgente» ([OCU 1](https://www.ocu.org/reclamar/lista-reclamaciones-publicas/precios-abusivos-poca-inform/78588b177759a8b57b), [OCU 2](https://www.ocu.org/reclamar/empresas/repara-home-express/0a3980f7ccbcafe878)). Nuestro titular de confianza no es «rápidos», es **«precio de salida claro antes de ir»**.
2. **Publicar la tabla de precios orientativos por avería**, como Servicio Xpress, pero con cifras propias y coherentes, IVA incluido y con lo que incluye cada una.
3. **Publicar la regla del recargo** (horas y porcentaje) en una línea visible, como Alcántara. Nadie más lo hace.
4. **Nada de «desplazamiento gratis» con letra pequeña.** Si la salida se cobra cuando no se hace el trabajo, decirlo con la cifra.
5. **Tiempo de llegada por zona, con números**, como Fontaneros Nevada (capital, cinturón, área). Andrés puede dar el tiempo estimado según el municipio.
6. **Andrés atiende al momento y dice qué hacer ya** (cerrar la llave de paso, cortar la luz del termo, no tirar de la cisterna). Ningún competidor da esa ayuda antes de la visita; es la diferencia principal.
7. **Teléfono con prefijo 958 o móvil local**, no un 91. HomeServe pierde cercanía con su número de Madrid.
8. **Garantía escrita y visible** (1 año HomeServe, 2 años Fontanero Barato): hay que fijar la nuestra y ponerla en la primera pantalla.
9. **Páginas por municipio con datos reales, no copiadas.** Nevada lo hace con tiempos por zona; Servicio Xpress y Fontanero Barato repiten plantilla. Plan: una página por municipio del área con tiempo de llegada, zonas atendidas y casos reales.
10. **Desatascos como segunda puerta de entrada.** En Granada los desatascos solo están en directorios: una sección propia «Desatascos 24 h» (fregadero, WC, bajante, arqueta, comunidad) tiene poca competencia.

---

## 2. Precios de mercado (Granada y España)

Consultados el 27 de noviembre de 2026 mediante los extractos del buscador. Son cifras de portales y de webs comerciales, **no tarifas oficiales**: en España los precios de estos servicios son libres ([OCU](https://www.ocu.org/reclamar/lista-reclamaciones-publicas/precios-abusivos-poca-inform/78588b177759a8b57b)). IVA: casi ninguna fuente aclara si va incluido (verificar).

| Concepto | Granada | España / otras ciudades | Fuente |
|---|---|---|---|
| Visita urgente 24 h | 60-120 € | Madrid 100-250 €; Madrid de noche puede pasar de 300 € | [Servicio Xpress Granada](https://servicioxpress.com/fontanero-granada-precios/), [SX Madrid](https://servicioxpress.com/fontaneros-madrid-precios/), [Cronoshare Madrid](https://www.cronoshare.com/blog/cuanto-cuesta-fontanero-madrid/) |
| Reparación habitual en horario laboral | 60-180 € | 55-200 € (Madrid) | [Alcántara](https://www.fontanerosgranadaalcantara.com/blog/fontanero-granada), [Cronoshare Madrid](https://www.cronoshare.com/blog/cuanto-cuesta-fontanero-madrid/) |
| Recargo noche, fin de semana o festivo | 35 % de 23:00 a 8:00 y festivos (un fontanero); 30-50 % (guía local) | 50-100 % (Habitissimo, Cronoshare Fuenlabrada); 20-40 % (Cronoshare Alcobendas) | [Alcántara](https://www.fontanerosgranadaalcantara.com/), [Habitissimo](https://www.habitissimo.es/presupuestos/fontanero), [Cronoshare Fuenlabrada](https://www.cronoshare.com/cuanto-cuesta/servicio-fontaneria/fuenlabrada) |
| Suplemento de urgencia de una aseguradora | máx. 24,20 € + impuestos, sin desplazamiento | — | [HomeServe FAQ](https://www.homeserve.es/faqs) |
| Desplazamiento | a menudo «incluido si se hace el trabajo» | 20-40 € (Trustlocal); 49-69 € con diagnóstico (Alcobendas); 20-70 € (Barcelona) | [Trustlocal](https://trustlocal.es/coste/fontanero-coste/), [Cronoshare Alcobendas](https://www.cronoshare.com/cuanto-cuesta/servicio-fontaneria/alcobendas) |
| Mano de obra por hora | 12-15 €/h según Cronoshare (parece muy bajo, verificar) | 20-80 €/h normal; 60-150 €/h urgente | [Cronoshare Granada](https://www.cronoshare.com/cuanto-cuesta/fontanero/granada), [Cronoshare](https://www.cronoshare.com/cuanto-cuesta/servicio-fontaneria) |
| Reparar fuga | 35-70 € | 60-150 € (Madrid) | [SX Granada](https://servicioxpress.com/fontanero-granada-precios/), [SX Madrid](https://servicioxpress.com/fontaneros-madrid-precios/) |
| Cisterna o mecanismo del WC | 25-60 € (SX); 30-50 € (Cronoshare) | 40-100 € (Madrid) | [SX Granada](https://servicioxpress.com/reparacion-cisternas-granada/), [Cronoshare Granada](https://www.cronoshare.com/cuanto-cuesta/fontanero/granada) |
| Desatasco sencillo (fregadero, lavabo) | 30-50 € (Cronoshare); 75-150 € en Albolote (Trustlocal) | 70-150 €; sifón 70-130 € | [Cronoshare Granada](https://www.cronoshare.com/cuanto-cuesta/fontanero/granada), [Trustlocal Albolote](https://trustlocal.es/granada/albolote/fontanero/), [Habitissimo](https://www.habitissimo.es/presupuestos/desatascar-tuberias) |
| Desatasco de WC | — | desde 100 €; más de 300 € si hay que abrir; tubería muy obstruida desde 150 € (hasta 500 €) | [Habitissimo](https://www.habitissimo.es/presupuestos/desatascar-tuberias) |
| Camión cuba | — | 100-200 €/h; ejemplo publicado: 90 € la 1.ª hora y 45 € la 2.ª (fregaderos 70 € + 30 €) | [Cronoshare camión cuba](https://www.cronoshare.com/cuanto-cuesta/contratar-camion-cuba), [Zb Desatascos](https://www.cronoshare.com/croner-3808150-zb-desatascos) |
| Detección de fugas con cámara | 70-140 € | 120-250 € (Madrid) | [SX Granada](https://servicioxpress.com/fontanero-granada-precios/), [SX Madrid](https://servicioxpress.com/fontaneros-madrid-precios/) |
| Cambiar termo eléctrico (instalación) | — | 180-600 € (media 430 €, Habitissimo); 80-250 € solo sustitución (Cronoshare) | [Habitissimo](https://www.habitissimo.es/presupuestos/instalar-o-cambiar-termo-electrico), [Cronoshare](https://www.cronoshare.com/cuanto-cuesta/instalar-termo-electrico) |
| Reparar termo eléctrico | — | 80-120 € de media; resistencia unos 250 € (cifras incoherentes en la misma fuente) | [Habitissimo](https://www.habitissimo.es/presupuestos/reparar-termo-electrico) |
| Cambiar calentador de gas por eléctrico | — | 300-800 €, inspección previa 60-100 € | [Habitissimo](https://www.habitissimo.es/presupuestos/cambiar-calentador) |
| Sustituir tuberías sin obra | unos 400 € | — | [Cronoshare Granada](https://www.cronoshare.com/cuanto-cuesta/fontanero/granada) |

No he podido conseguir (verificar): reparar un calentador de gas (piezas habituales), detección de fugas con geófono o termografía en Granada, y la tarifa de agua de Emasagra (existe el [expediente de tarifas 2026 del Ayuntamiento](https://www.granada.org/pdf_trans/DOC_1_ExpedienteTarifas2026_GRANADA_AGUA_DEF_IPC_12092025_NuevasBonificaciones.pdf), no leído).

---

## 3. Marca

**Criterios:** corta; sin dudas al dictarla por teléfono; que funcione en cualquier ciudad («[Marca] Granada», «[Marca] Málaga»); que diga «agua y urgencia» sin ser un genérico puro como «Fontanero 24h»; que no se parezca a Fontaneros Nevada, Servicio Xpress, HomeServe, Reparalia ni Fontanero Barato.

**Comprobación de dominios:** herramienta de dominios de Shopify, 27/11/2026. Precio = primer año según el registro, en dólares (la renovación suele ser más cara). Disponible hoy no es una reserva.

| # | Marca | Cómo se dice | .es | .com | Comentario |
|---|---|---|---|---|---|
| 1 | **Llave de Paso** (llavepaso) | «llave paso, todo junto» | **Disponible**, 22 USD | **Disponible**, 17 USD | Es lo primero que hay que hacer en una fuga y lo que Andrés enseña: la marca **es** el consejo. Muy fácil de recordar. Riesgo: término común del oficio, más débil como marca registrada (necesita logotipo propio). Ojo: `llavedepaso.es` también libre, pero `llavedepaso.com` ocupado. |
| 2 | **Gota Cero** (gotacero) | «gota cero» | **Disponible**, 22 USD | Ocupado | Promesa clara (ni una gota más). Corta y con buen sonido. Falta el .com. |
| 3 | **Arqueta** | «arqueta, como la de la calle» | **Disponible**, 22 USD | Ocupado | Palabra del oficio (registro de desagüe), muy española y distintiva. Mejor para desatascos que para termos. |
| 4 | **Corta el Agua** (cortaelagua) | «corta el agua, todo junto» | **Disponible**, 22 USD | **Disponible**, 17 USD | Instrucción de urgencia como nombre; muy memorable. Riesgo: puede confundirse con un corte de suministro. |
| 5 | **Sifonía** | «sifonía, con efe» | **Disponible**, 22 USD | Ocupado | Inventada a partir de «sifón». Registrable, pero hay que deletrearla y no dice «urgencia». |
| 6 | **Agua en Calma** (aguaencalma) | «agua en calma» | **Disponible**, 22 USD | **Disponible**, 17 USD | Tono tranquilizador; algo larga y suena a balneario. |
| 7 | **Manguito** | «manguito» | **Disponible**, 22 USD | Ocupado | Simpática y del oficio, pero poco seria para una urgencia de 200 €. |
| 8 | **Agua Quieta** (aguaquieta) | «agua quieta» | **Disponible**, 22 USD | No figura como disponible | Parecida a la 6, más corta. |

**Descartadas por dominio:** fluyo.es (ocupado), aguaya.es (ocupado), y los .com de gotacero, arqueta, manguito, sifonia y llavedepaso (ocupados). Tubolimpio (.es y .com libres) se descartó por limitarse a desatascos.

**OEPM y EUIPO: no comprobado.** No quedaban búsquedas web y la consulta de la OEPM estaba bloqueada en sesiones anteriores. **Tarea a mano:** buscar cada nombre en el Localizador de marcas de la OEPM (clases 37, reparación e instalación, y 35) y en EUIPO eSearch plus antes de registrar dominio o marca. Especial atención a «Llave de Paso» y «Gota Cero», que pueden existir como marcas de grifería o de productos.

### 3.1 Recomendación (las 3 mejores)
1. **Llave de Paso** (`llavepaso.es` + `llavepaso.com`). Dice lo que hay que hacer, se recuerda al momento y se dicta sin dudas. Rutas `/granada`, `/malaga`… Reforzar con logotipo propio (la llave en forma de T) para que sea registrable.
2. **Gota Cero** (`gotacero.es`). La mejor como promesa; corta. Sin .com, comprar `gotacero.net` (19 USD) para proteger.
3. **Arqueta** (`arqueta.es`). La más distintiva y castiza; ideal si el negocio va a pesar más en desatascos.

---

## 4. Dirección visual

**Idea: «el grifo de casa: rojo caliente, azul frío».** Los colores salen del propio oficio: el rojo y el azul de los mandos de los grifos y las llaves de paso, el latón de los racores y el blanco del sanitario. Es de taller y de casa, no de agencia. Fondo blanco frío, tinta casi negra azulada, un rojo para **llamar y lo urgente**, un azul agua (petróleo) para **todo lo que es Andrés**.

Diferencias con las otras webs de la fábrica:
- Herencias usa verde pino `#1F4A42` y azul sierra; Reparo usa gris acero con naranja `#F2601E` (oscuro) y cobalto `#1F5FAD` (claro). Aquí no hay verde ni naranja, y el azul es un petróleo `#006A7D`, no cobalto.
- Sin crema ni terracota, sin degradados, sin morados, sin emojis.

### 4.1 Paleta (contrastes WCAG calculados con Python en esta sesión)

| Token | Uso | Claro | Oscuro |
|---|---|---|---|
| `--fondo` | fondo general | `#F1F5F8` | `#0B1218` |
| `--tarjeta` | tarjetas, barra, capas | `#FFFFFF` | `#131D25` |
| `--tinta` | texto principal | `#0E1A24` (16,1:1 sobre fondo) | `#E8EEF2` (16,1:1) |
| `--tinta-2` | texto secundario | `#475663` (6,9:1) | `#A3B1BC` (8,6:1) |
| `--rojo` | **llamar, urgencia, botón principal** | `#B4131F`; blanco encima 6,9:1; sobre fondo 6,3:1 | `#FF7A7A`; texto `#0B1218` encima 7,5:1 |
| `--agua` | **todo lo que es Andrés** (burbuja, micrófono, estado, botón «Hablar con Andrés») | `#006A7D`; blanco encima 6,3:1; sobre fondo 5,7:1 | `#5FC9DC`; texto `#0B1218` encima 9,8:1 |
| `--aviso` | «mientras llega el fontanero» y recargos, solo en detalles | `#8F5E00` (5,1:1 sobre fondo) | `#F0BF55` (11,0:1) |
| `--linea` | bordes | `#CFD9E0` | `#25323C` |
| `--rojo-suave` | fondo del bloque de urgencia | `#FBE9EA` (tinta 15,1:1; rojo 5,9:1) | `#2A1416` (tinta 14,8:1; rojo 6,9:1) |
| `--agua-suave` | fondo de la tarjeta de Andrés | `#E2F0F3` (tinta 15,1:1) | `#0F2A30` |

Todas las combinaciones de texto pasan AA (≥ 4,5:1); tinta y tinta-2 pasan AAA. Reglas:
- Rojo **solo** para llamar y para «urgente»; nunca para errores decorativos.
- Sin degradados; esquinas de 8 px (más «herramienta» que «app»); bordes de 1 px.
- Botones de acción de 56 px de alto mínimo: se pulsan con prisa y a veces con las manos mojadas.

### 4.2 Tipografía (Google Fonts, licencia SIL Open Font License)
- **Titulares y cifras: Archivo** (Omnibus-Type, OFL), pesos 700-800, usando su eje de anchura en semicondensado (`font-stretch: 87.5%`) para titulares y precios. Tiene cifras tabulares (`font-variant-numeric: tabular-nums`) para la tabla de precios y el teléfono. Recuerda a la rotulación de furgoneta y de albarán.
- **Texto e interfaz: Public Sans** (USWDS, OFL), 400/600. Neutra, muy legible en móvil, con buen juego de acentos y la ñ.
- **Tamaños en móvil:** cuerpo de 17-18 px con interlineado 1,55; titular de 30-34 px; precio de salida de 40 px; botones de 18 px.
- Alojar las dos fuentes en la propia web (woff2 recortado al español), como en Reparo y Herencias.

### 4.3 Tono de las fotos
- **Luz y color:** luz natural o de linterna de trabajo, sin filtros cálidos; ligeramente fría y con contraste. Tratamiento uniforme: saturación −10 %, sin viñetas.
- **Contenido:** manos trabajando (latón, llaves, tubos, desagües), detalles de agua y de aparatos. **Sin caras** a cámara, sin operarios sonriendo con el pulgar arriba, sin tazas de váter en primer plano.
- **Prohibido:** marcas de fabricantes visibles (la foto de la caldera se ha recortado por eso), textos en inglés, enchufes o grifería claramente extranjeros, inundaciones dramatizadas.
- **Fotos reales en cuanto se pueda:** la furgoneta, el técnico de espaldas en un portal de Granada, un trabajo terminado. Nunca presentar las fotos de banco como «nuestro equipo».

### 4.4 Tono de los textos
- De tú, frases cortas, **verbos de acción primero**: «Cierra la llave de paso», «Llama», «Te decimos el precio antes de ir».
- Calma: la persona tiene el agua corriendo; nada de alarmismo («¡Desastre!») ni de presión.
- Cifras siempre con lo que incluyen: «59 € la salida, con desplazamiento y primera media hora».
- Prohibido: emojis, «¡¡Llama ya!!», «los más baratos», «el mejor fontanero de Granada», anglicismos.

### 4.5 Estructura de la página (móvil, en este orden)
1. **Barra fija superior (siempre visible):** marca a la izquierda; a la derecha el botón rojo «Llamar» con el número. Es lo primero que se ve y no desaparece al bajar.
2. **Primera pantalla (sin desplazar):**
   - titular corto y subtítulo de una línea;
   - **dos botones grandes:** «Llamar ahora» (rojo) y «Hablar con Andrés» (agua, voz o texto);
   - **precio de salida** en una línea («Urgencias desde 59 € · precio antes de ir»);
   - tres datos: «24 h todos los días · Llegada media 30-45 min en Granada · Garantía de X meses».
3. **«Mientras llegamos»** (fondo `--rojo-suave`): 3-4 pasos según el problema (fuga, atasco, termo), con un selector. Andrés los explica en voz.
4. **«¿Qué te pasa?»:** las 8 situaciones (tarjetas que abren a Andrés con el caso cargado).
5. **Precios orientativos** (tabla por avería, IVA incluido, regla de recargo y lo que incluye la salida).
6. **Cómo funciona** (3 pasos).
7. **Zonas y tiempos de llegada** (capital y área metropolitana).
8. **Quién va a tu casa:** nombre, foto real, años, empresa con CIF, seguro de responsabilidad civil y garantía por escrito.
9. **Opiniones:** reseñas de Google enlazadas a la ficha, sin estrellas inventadas.
10. **Preguntas frecuentes.**
11. **Solicitud de visita** (programada) con los campos de la sección 5.6.
12. **Pie:** dirección, horario, aviso legal, privacidad, «Andrés es un asistente: orienta y toma nota; el diagnóstico lo hace el fontanero».
13. **Capa de conversación con Andrés** (como `#conv` en Reparo y Herencias), con botón de llamar siempre a mano dentro de la capa.

---

## 5. Textos propuestos

Los precios de esta sección son **propuesta para que el negocio los fije**, calibrados con la tabla de la sección 2. No publicar sin confirmarlos.

### 5.1 Portada
- **Titular:** «¿Fuga o atasco? Te ayudamos ahora.»
  - Alternativa: «Fontanero en Granada, a cualquier hora y con precio antes de ir.»
- **Subtítulo:** «Andrés te dice qué hacer mientras llegamos y te da el precio de salida. Fontanería y desatascos en Granada y su área, 24 horas.»
- **Botón principal:** «Llamar ahora» · **Botón 2:** «Hablar con Andrés»
- **Línea de precio:** «Urgencias desde 59 € (salida, desplazamiento y primera media hora). De 22:00 a 8:00 y festivos, +35 %.» (propuesta)

### 5.2 Situaciones (formato de la lista SITUACIONES de herencias/index.html)
```js
const SITUACIONES = [
  ["fuga", "Fuga de agua", "Tengo una fuga de agua y no para: ¿qué hago?"],
  ["atasco", "Fregadero o lavabo atascado", "El fregadero está atascado y no traga el agua"],
  ["wc", "Váter atascado", "El váter está atascado y se sale el agua"],
  ["cisterna", "Cisterna que no para", "La cisterna no para de cargar agua o pierde"],
  ["termo", "Termo o calentador sin agua caliente", "Me he quedado sin agua caliente: el termo o el calentador no va"],
  ["oculta", "Humedad o fuga que no se ve", "Tengo una mancha de humedad y creo que hay una fuga escondida"],
  ["tuberia", "Tubería rota o reventada", "Se ha roto una tubería y sale mucha agua"],
  ["bajante", "Malos olores o bajante de la comunidad", "Huele mal en el baño y creo que es la bajante o la arqueta"]
];
```

### 5.3 Cómo funciona (3 pasos)
1. **Cuéntanos qué pasa.** Llama o habla con Andrés. En dos minutos sabes qué hacer mientras tanto.
2. **Te damos el precio antes de ir.** Salida, hora estimada de llegada y lo que suele costar tu avería. Sin sorpresas.
3. **Lo arreglamos y te lo dejamos por escrito.** Presupuesto antes de empezar, factura con IVA y garantía.

### 5.4 Precios orientativos (propuesta; IVA incluido)
| Servicio | Desde | Referencia de mercado |
|---|---|---|
| Salida urgente (desplazamiento + primera media hora) | 59 € | Granada 60-120 € |
| Visita programada (diagnóstico) | 39 € (se descuenta si se hace el trabajo) | — |
| Desatasco de fregadero o lavabo | 69 € | 30-150 € |
| Desatasco de váter | 89 € | desde 100 € |
| Reparar cisterna (mecanismo) | 49 € + pieza | 25-60 € |
| Reparar fuga accesible | 59 € | 35-70 € |
| Detección de fugas sin obra | 120 € | 70-140 € |
| Cambio de termo eléctrico (mano de obra) | 120 € + aparato | 80-250 € |
| Recargo de 22:00 a 8:00, domingos y festivos | +35 % | 30-50 % |

Debajo: «Precios orientativos. Antes de empezar te damos el presupuesto cerrado por escrito. Si no aceptas el presupuesto, solo pagas la salida.»

### 5.5 Seis preguntas frecuentes (borrador: el fontanero debe revisarlas)
1. **¿Cuánto cuesta que venga un fontanero de urgencia?**
   La salida urgente cuesta desde 59 €, con el desplazamiento y la primera media hora incluidos (propuesta). En Granada el mercado va de 60 a 120 € por una urgencia ([Servicio Xpress](https://servicioxpress.com/fontanero-granada-precios/)). Por la noche y en festivos hay un recargo que te decimos antes de salir.
2. **¿Qué hago mientras llega el fontanero si tengo una fuga?**
   Cierra la llave de paso general de la vivienda (suele estar en la cocina, el baño, junto al contador o en el armario de contadores de la comunidad). Si el agua toca enchufes o aparatos, corta la luz en el cuadro. Recoge el agua y aparta lo que se pueda mojar. Haz fotos: te servirán para el seguro. (Consejo práctico del oficio, sin fuente externa: revisar con el fontanero.)
3. **¿Me cobráis si al final no hacéis el trabajo?**
   Solo la salida, que te decimos antes de ir. El presupuesto del arreglo es gratis y por escrito. Hay empresas que anuncian «desplazamiento gratis» y luego lo cobran si no aceptas ([Fontaneros Nevada](https://fontanerosnevada.es/), condición publicada en su web); preferimos decirlo claro.
4. **¿Lo paga mi seguro del hogar?**
   Muchas pólizas cubren los daños por agua y a veces la reparación; depende de tu póliza. Llama antes a tu seguro o dinos tu compañía y te ayudamos. Antes de reparar, haz fotos de la avería y de los daños ([consejo recogido en guías de precios](https://www.cronoshare.com/cuanto-cuesta/fontanero/granada), verificar).
5. **¿Cuánto tardáis en llegar?**
   En Granada capital, normalmente entre 30 y 45 minutos; en el área metropolitana puede ser algo más según la zona y el tráfico (propuesta: confirmar con los tiempos reales del negocio). Andrés te da la hora estimada al pedir la visita.
6. **¿Andrés es un fontanero?**
   No. Andrés es un asistente con inteligencia artificial: te orienta, te dice qué hacer mientras tanto y apunta tu aviso para que no tengas que repetirlo. El diagnóstico y el precio final los da siempre el fontanero en tu casa.

### 5.6 Campos de la solicitud
- **Siempre:** nombre; teléfono; municipio y barrio; dirección (calle, número, piso, letra); ¿es urgente ahora o visita programada?; día y franja preferidos (si es programada).
- **Del problema:** tipo (fuga, atasco, cisterna, termo/calentador, humedad, tubería rota, olores/bajante, otro); dónde (cocina, baño, terraza, garaje, zonas comunes); ¿sale agua ahora?; ¿has podido cerrar la llave de paso?; ¿hay agua cerca de enchufes o aparatos?; desde cuándo; ¿afecta al vecino de abajo?
- **De la vivienda:** piso o casa; ¿propietario o inquilino?; ¿comunidad de vecinos? (si es bajante o arqueta común, avisar al administrador).
- **Termo o calentador:** eléctrico o de gas; marca y litros si se ven en la placa; edad aproximada; ¿salta el diferencial?; ¿huele a gas? (si huele a gas: salir, no tocar interruptores y llamar al teléfono de urgencias de la distribuidora o al 112).
- **Seguro:** ¿tienes seguro de hogar? compañía (opcional).
- **Fotos o vídeo** (opcional) y **cómo pagar** (tarjeta, Bizum, efectivo: verificar qué acepta el negocio).
- **Consentimiento** de privacidad.

### 5.7 Lo que el cliente debe preparar
- **Saber dónde está la llave de paso** (y cerrarla si hay fuga) y, si hace falta, el acceso al contador.
- **Fotos o un vídeo corto** de la avería, de la placa del termo o calentador y de las manchas de humedad.
- **Despejar el acceso:** el mueble bajo el fregadero vacío, el baño libre, la tapa del registro o la arqueta a mano.
- **Datos del seguro** (compañía y número de póliza) si quieres dar parte.
- **Si es de la comunidad:** teléfono del administrador o del presidente y acceso a zonas comunes o cuarto de contadores.
- **Alguien en casa** durante la visita, y el aparcamiento o la entrada al garaje si hace falta subir la máquina.
- Si hay agua cerca de la electricidad: **luz cortada** en el cuadro antes de que llegue el técnico.

---

## 6. Fotos (Pexels) descargadas en `media/`

Detalle, enlaces y licencia en `media/CREDITOS.md`. Todas abiertas y revisadas en esta sesión, comprimidas por debajo de 250 KB.

| Archivo | Tamaño | Qué se ve | Uso |
|---|---|---|---|
| `portada.jpg` | 1600x1067, 245 KB | Manos reparando una válvula de latón bajo un fregadero | Portada (en móvil, recorte 4:5 centrado en las manos) |
| `compartir.jpg` | 1200x630, 129 KB | Recorte de la portada | Imagen al compartir el enlace |
| `calentador.jpg` | 1000x420, 30 KB | Panel de una caldera mixta (pantalla y manómetro), recortada para quitar marcas y textos en inglés | Situación «termo o calentador» |
| `desague.jpg` | 1200x800, 46 KB | Desagüe de lavabo con guante | Situación «atasco» y bloque «Mientras llegamos» |
| `tuberias.jpg` | 960x1200, 218 KB | Tuberías cromadas, vertical | Bloque «Cómo funciona» o fondo de precios |

**Pendiente:** leer el autor de cada foto en su página de Pexels; y sustituir la portada por una foto real del negocio en cuanto exista (furgoneta o técnico de espaldas en una casa de Granada).
