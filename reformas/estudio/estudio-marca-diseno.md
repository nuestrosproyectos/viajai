# Estudio de competencia, marca, diseño y fotos: web de reformas (Granada)

Fecha: 27 de noviembre de 2026. Ámbito: primera web de reformas (baños, cocinas y reformas integrales de vivienda) para Granada y provincia, con una marca que sirva para toda España. Andrés orienta, rellena la solicitud a la vista y **cierra una visita de medición y presupuesto en casa**.

## 0. Cómo se ha hecho y límites (léelo antes de nada)

- **WebSearch** ha funcionado durante parte del trabajo y da títulos, URL y extractos de lo que el buscador tiene indexado. **No he visto ninguna web renderizada**: la «primera pantalla» de cada competidor está reconstruida a partir del contenido indexado. El buscador no reproduce el orden de Google España.
- **El cupo de búsquedas web se agotó a mitad del trabajo** (límite compartido de la sesión). Por eso quedan sin hacer: la ficha de Pexels de cada foto (autor), la búsqueda de marcas parecidas en OEPM, la comprobación del IVA reducido en la web de Hacienda y una segunda ronda de competidores nacionales. Se marca en cada sitio con **(verificar)**.
- **WebFetch está bloqueado** (`getaddrinfo ENOTFOUND www.cronoshare.com`). Desde Bash solo sale tráfico a images.pexels.com; www.pexels.com y consultas2.oepm.es devuelven 403 en el proxy.
- **Dominios:** comprobados con la herramienta de dominios de Shopify (`generate-domain-names`), que consulta el registro en el momento. No es una reserva. **No se ha comprado nada.**
- **No he usado Apify** ni servicios de pago.
- Lo que más pesa en la búsqueda local son **directorios**: [Habitissimo](https://www.habitissimo.es/empresas/reformas/granada), [Cronoshare](https://www.cronoshare.com/servicios/reformas-integrales/granada/motril), [Trustlocal](https://trustlocal.es/granada/granada/reformas/construcciones-arenas-medina/) y Milanuncios. Las empresas granadinas aparecen detrás, casi siempre con webs antiguas.

---

## 1. Competencia

Búsquedas usadas: «reformas integrales Granada empresa», «reformas Granada presupuesto visita», «reforma de baño Granada precio», «reforma de baño precio cerrado online», «reforma integral piso Sevilla precio», «calculadora presupuesto reforma precio cerrado». Webs propias de Granada que salen al excluir directorios ([búsqueda](https://reformaintegralgranada.es/)): CrearSur, Construcciones Arenas Medina, Reformas Granada, Emilio Callejas, Rehabilitaciones Granada, ICS Proyectos, El Mafra, Reformas Granada Ciudad, Todo Reformas Granada y Reformas Grama.

### 1.1 CrearSur, reformaintegralgranada.es (Granada, local)
- **URL:** https://reformaintegralgranada.es/ ([servicios](https://reformaintegralgranada.es/servicios/), [nosotros](https://reformaintegralgranada.es/nosotros/), [contacto](https://reformaintegralgranada.es/contacto/)).
- **Primera pantalla (según lo indexado):** «Reformas en Granada». Empresa de construcción especializada en reformas integrales y mantenimiento en la provincia; Avda. de Andalucía 5; teléfono 958 045 431 y un correo de Gmail.
- **Precios publicados:** ninguno.
- **Confianza:** dice tener más de 15 años; garantiza «por escrito» calidad de materiales y **plazos de ejecución**; seguro de responsabilidad civil; 37 opiniones alojadas en su propia web (no en Google). Casos con calle real: [Obispo Hurtado](https://reformaintegralgranada.es/trabajos/reforma-integral-de-un-piso-en-calle-obispo-hurtado/), [Camino de Ronda](https://reformaintegralgranada.es/trabajos/reforma-camino-de-ronda/), [calle Dilar](https://reformaintegralgranada.es/trabajos/reforma-de-piso-en-la-calle-dilar-granada/).
- **Llamadas a la acción:** visita a la vivienda para conocer necesidades y presupuesto sin compromiso; teléfono y formulario.
- **Bien:** obras con nombre de calle de Granada (prueba local muy creíble); servicios de acompañamiento poco habituales (licencias, guardamuebles, **alojamiento** durante la obra, limpieza final).
- **Mal:** correo de Gmail, opiniones propias poco verificables, páginas indexadas con varios años; ningún precio ni plazo orientativo.

### 1.2 El Mafra, elmafra.es (Granada, local)
- **URL:** https://elmafra.es/ ([servicios](https://elmafra.es/nuestros-servicios-de-reformas-en-granada/), [viviendas](http://elmafra.es/reformas-de-viviendas-en-granada/)).
- **Primera pantalla:** «Reformas en Granada»; viviendas, locales y comunidades; «más de 20 años».
- **Precios:** no publica; dice que el precio depende del tipo de proyecto, metros y calidades, y que el presupuesto permite conocer el coste antes de empezar.
- **Confianza:** galería de obras, pero indexada con nombres de archivo de móvil (`IMG-20170525-WA0010`), es decir, fotos de WhatsApp de 2017.
- **Bien:** muestra obras reales y variedad (viviendas, locales, una clínica).
- **Mal:** fotos sin tratar y antiguas, sin explicación del proceso ni de plazos; parece una web que no se toca desde hace años.

### 1.3 Todo Reformas Granada, todoreformasgranada.com (Granada, contenido)
- **URL:** https://todoreformasgranada.com/ y su [blog de consejos](https://todoreformasgranada.com/consejos-y-noticias/).
- **Primera pantalla:** «Reformas Granada»; presupuesto gratuito y sin compromiso.
- **Precios publicados (en el blog, sin fecha visible):** ducha de obra o plato 700-1.500 €; cambio completo de baño 1.000-3.000 €; mampara unos 400 €; muebles de baño 700-2.000 €; alicatar paredes y suelo de un baño de 5 m² unos 2.000 €.
- **Bien:** es de las pocas webs locales que da cifras; capta búsquedas del tipo «cuánto cuesta».
- **Mal:** las cifras son bajas para 2026 comparadas con otras fuentes (sección 2) y no tienen fecha, lo que puede atraer clientes con expectativas irreales.

### 1.4 Reformas Anjo, reformasanjo.com (Sevilla, Andalucía)
- **URL:** https://reformasanjo.com/ ([precio reforma integral 2026](https://reformasanjo.com/precio-reforma-integral-sevilla/), [reforma integral de piso](https://reformasanjo.com/reforma-integral-piso-sevilla/), [precio baño 2026](https://reformasanjo.com/precio-reforma-bano-sevilla/), [cocina y baño a la vez](https://reformasanjo.com/reformar-cocina-y-bano-a-la-vez-sevilla/), [licencias](https://reformasanjo.com/licencias-permisos-para-reformar-en-sevilla/)).
- **Primera pantalla:** «Empresa de reformas en Sevilla y el Aljarafe».
- **Precios publicados:** reforma integral **desde 18.000 €**; piso hasta 60 m²: 18.000-30.000 €; 60-90 m²: 30.000-50.000 €; 90-120 m²: 50.000-80.000 €; 350-700 €/m²; cocina y baño juntos 14.000-28.000 €. Duración de una integral: 4-12 semanas.
- **Confianza:** contenido fechado («2026»), explica licencias y por dónde empezar.
- **Llamadas a la acción:** **visita técnica y presupuesto por partidas gratis y sin compromiso**.
- **Bien:** es el mejor modelo andaluz: precios por tamaño de piso, fechados, y artículos que responden a las dudas reales (licencias, piso o casa, por dónde empezar).
- **Mal:** muchas páginas casi iguales (SEO por barrio); la horquilla €/m² es baja comparada con fuentes nacionales de 2026.

### 1.5 Leroy Merlin, servicio de reforma de baño (nacional)
- **URL:** https://www.leroymerlin.es/servicios/reformas-de-banos/servicio-de-reforma-de-banos.html, [medición para reforma de baño](https://www.leroymerlin.es/servicios/medicion-para-reforma-de-bano.html), [cambio de bañera por ducha](https://www.leroymerlin.es/servicios/reformas-de-banos/servicio-de-cambio-de-banera-por-ducha.html).
- **Primera pantalla:** servicio completo (producto, transporte e instalación) en seis pasos: inspiración, cita, **toma de medidas**, propuesta, confirmación y pago, obra.
- **Precios publicados:**
  - **Medición: 40 € con IVA, que se descuentan si se contrata** (en otra página antigua figura a 35 €). Se cobra también si no estás en casa tras confirmar la cita.
  - Reforma básica de baño hasta 3,99 m² **desde 3.390 €**; premium **desde 4.490 €** (productos de Leroy Merlin).
  - Instalación de cambio de bañera por plato desde 645 € (sin producto ni transporte), hecha en 24 horas.
  - Obra de baño de 7-9 días. Presupuesto válido 30 días.
- **Confianza:** marca conocida, garantía mínima de 2 años en instalación, llamada en 24-48 h para fijar la medición.
- **Bien:** proceso por pasos muy claro, plazo en días, precio «desde» por paquete y una medición con precio que filtra curiosos.
- **Mal:** solo con su catálogo, depende de que haya instalador en tu código postal, letra pequeña (lo no listado queda excluido), nada de reformas integrales a medida.

### 1.6 Construcciones Carmona y otros con calculadora (Madrid y nacional)
- **URL:** https://construccionesreformasmadrid.es/calculadoras-de-presupuestos/ (y como patrones: [360 Reforma](https://360reforma.com/prespuestador-reformas/), [Stylo 10, Córdoba](https://stylo10.com/calculadora-de-reformas/), [idealista/reformas](https://www.idealista.com/reformas/)).
- **Primera pantalla:** calculadora online de presupuesto.
- **Precios:** la calculadora da una cifra con **±20 % de precisión** y dice que no puede ver el estado real; el precio cerrado se firma tras la visita.
- **Confianza:** presupuesto **cerrado y vinculante por escrito**; **penalización de 50-200 € por día de retraso**; garantía de 12 meses más la de la LOE. Stylo 10 firma la fecha de entrega antes de empezar.
- **Bien:** la promesa que más tranquiliza en reformas no es el precio bajo, es «no se va a disparar y no se va a alargar», y la ponen por escrito.
- **Mal:** una calculadora fría no resuelve dudas («¿necesito licencia?», «¿hay que cambiar la instalación?»). Es justo lo que Andrés hace mejor.

### 1.7 Lo que no he podido ver
- Ninguna web renderizada (ni móvil ni escritorio), ni tiempos de carga, ni botones flotantes de WhatsApp.
- Las fichas de Google de las empresas locales (número real de reseñas).
- Grandes empresas nacionales de reforma integral con precio cerrado online (no aparecieron en las búsquedas y el cupo se agotó).

### 1.8 Diez conclusiones concretas para nuestra web
1. **La visita de medición, gratis.** Las locales (CrearSur, Todo Reformas, Vega Reformas) y la andaluza mejor montada (Anjo) la dan gratis; solo Leroy Merlin cobra 40 € descontables. Cobrarla en Granada nos pondría peor que la competencia directa. Para filtrar, el filtro es **Andrés**: antes de dar cita pide fotos, medidas aproximadas, municipio y una horquilla de presupuesto. Excepción propuesta: municipios a más de ~45 minutos de Granada capital, 40 € que se descuentan si se contrata (a decidir con la empresa).
2. **Lo que vendemos es certeza: precio cerrado por partidas y fecha de entrega por escrito**, con penalización por retraso si la empresa la acepta (Carmona). Debe estar en la portada, no en letra pequeña.
3. **Plazo del presupuesto también prometido:** «presupuesto por partidas en 5 días hábiles después de la visita» (verificar con la empresa). Nadie local lo promete.
4. **Precios orientativos fechados en la web** (como Anjo y Leroy Merlin): por baño, cocina y piso según metros. Las webs locales sin cifras pierden al cliente que compara.
5. **Ordenar por situación del cliente, no por gremios:** «cambiar la bañera por ducha», «el baño entero», «la cocina», «he comprado un piso viejo», «adaptar el baño a una persona mayor».
6. **Obras con nombre de calle y barrio de Granada** (lo mejor de CrearSur), con fotos propias del antes y después, bien hechas. Las fotos de banco solo para ambientar.
7. **Explicar el proceso por días**, como Leroy Merlin (pasos y «7-9 días» para un baño) y Anjo (4-12 semanas para una integral).
8. **Licencias, escombros y vecinos explicados**: declaración responsable o licencia, contenedor, horario de ruidos. Anjo gana búsquedas con eso; Andrés lo puede contestar al momento.
9. **Reseñas verificables** (Google, enlazadas), nunca alojadas en la propia web sin enlace.
10. **Correo y dominio propios, web rápida y fotos tratadas**: CrearSur usa Gmail y El Mafra fotos de WhatsApp de 2017. Solo con parecer cuidada, la web ya destaca.

---

## 2. Precios de mercado (para el cerebro de Andrés y para la web)

Todas son orientaciones de terceros; **el precio real sale de la visita**. «Fuente comercial» = web de una empresa o plataforma, no un estudio independiente.

| Trabajo | Cifra | Fuente y fecha |
|---|---|---|
| Cambio de bañera por plato, Granada | 845 € (80x80) a 1.350 € (140x80); máximos ~1.700 € | [VIP Reformas, Granada](https://www.vipreformas.es/presupuestos/cambio-de-banera-por-plato-de-ducha/granada/) (fecha no visible) |
| Cambio de bañera por plato, Granada | media 838 € quitando bañera; 350 € solo cambiar plato | [HazmePrecio](http://www.hazmeprecio.com/presupuesto/cambiar-ba%C3%B1era-por-ducha/granada) (fecha no visible) |
| Cambio de bañera por plato | 800-1.500 €; desde 600 € en baños pequeños; 24 h solo bañera, 2-4 días si se quitan azulejos | [Ducha Nueva, Granada](https://duchanueva.es/andalucia/granada/) (fecha no visible) |
| Cambio de bañera por plato (instalación sola) | desde 645 €, sin producto | [Leroy Merlin](https://www.leroymerlin.es/servicios/reformas-de-banos/servicio-de-cambio-de-banera-por-ducha.html) (consultado 27/11/2026) |
| Baño completo ~5 m², Granada | 3.300-3.500 € en reforma estándar | [Cronoshare Granada](https://www.cronoshare.com/cuanto-cuesta/reformar-bano/granada) (fecha no visible) |
| Baño completo hasta 3,99 m² | desde 3.390 € (básica) / 4.490 € (premium) | [Leroy Merlin](https://www.leroymerlin.es/servicios/medicion-para-reforma-de-bano.html) (consultado 27/11/2026) |
| Baño completo 4-6 m², España | 4.000-5.000 € de media | [N26](https://n26.com/es-es/blog/cuanto-cuesta-reformar-un-bano) (fecha no visible) |
| Baño, España | 800-1.500 €/m² | [Cronoshare](https://www.cronoshare.com/blog/?p=1707) (fecha no visible) |
| Cocina completa, España | 6.000-12.000 € de media; desde ~2.000 € sin cambiar muebles; >25.000 € gama alta | [cuantomecuesta.com, abril 2026](https://cuantomecuesta.com/es/reforma-cocina/) |
| Cocina, España | ~850 €/m² en calidad media | [idealista](https://www.idealista.com/news/node/914014) (fecha no visible) |
| Cocina: muebles gama media | 3.500-7.000 € | [cuantomecuesta.com, abril 2026](https://cuantomecuesta.com/es/reforma-cocina/) |
| Instalación eléctrica antigua (años 80) | +800-2.000 € al renovar cuadro y circuitos | misma fuente |
| Reforma integral, provincia de Granada | 557 €/m² de media (477-664 €/m²) en Loja y Belicena | [Cronoshare Loja](https://www.cronoshare.com/servicios/presupuesto-reforma-integral-piso/granada/loja) (fecha no visible) |
| Reforma integral, Almuñécar | media ~28.650 € (22.000-37.250 €), sin metros | [Cronoshare Almuñécar](https://www.cronoshare.com/servicios/presupuesto-reforma-integral-piso/granada/almunecar) |
| Reforma integral, Sevilla | 350-700 €/m²; 60-90 m²: 30.000-50.000 € | [Reformas Anjo, 2026](https://reformasanjo.com/precio-reforma-integral-sevilla/) |
| Reforma integral, España | 400-1.200 €/m²; 60 m²: 24.000-60.000 € | [Habitissimo](https://www.habitissimo.es/presupuestos/reforma-integral-piso) (fecha no visible) |
| Reforma integral, España | hoy 850 a más de 1.200 €/m² (antes de la pandemia 500-700) | [El Español, 30/07/2026](https://www.elespanol.com/sociedad/20260730/jose-ramon-garcia-arquitecto-reformar-casa-tamano-precio-eur-tarda-meses/1003744336742_0.html) |
| Piso de 75 m², España | 60.000-75.000 € | [Qué!, 04/09/2026](https://www.que.es/2026/09/04/cuanto-cuesta-reformar-un-piso-2/) |
| Visita de medición | 40 € descontables (Leroy Merlin); 40 € (IKEA, tiendas de Canarias); gratis en Anjo y locales de Granada | [Leroy Merlin](https://www.leroymerlin.es/servicios/medicion-para-reforma-de-bano.html), [IKEA Gran Canaria](https://www.islas.ikea.es/grancanaria/es/tu-cocina/servicios), [Anjo](https://reformasanjo.com/precio-reforma-integral-sevilla/) |

**Horquillas que propongo para la web (estimación a validar con la empresa antes de publicar):**
- Cambiar bañera por plato de ducha: **900-1.800 €**, normalmente 1-2 días.
- Baño completo (4-5 m²): **4.500-8.000 €**, 7-15 días laborables.
- Cocina completa con muebles (8-10 m²): **7.000-14.000 €**, 2-4 semanas (más el plazo de fabricación de los muebles).
- Reforma integral de piso: **650-1.000 €/m²** (un piso de 80 m²: unos 52.000-80.000 €), 2-4 meses.
- Siempre con «IVA aparte o incluido» dicho claramente. **(Verificar)** si aplica el IVA reducido del 10 % en obras de renovación de vivienda habitual: no he podido consultarlo en la web de la Agencia Tributaria por el límite de búsquedas.

**Licencias en Granada capital:** la ordenanza municipal sujeta las obras a licencia, declaración responsable o comunicación previa según el caso ([ordenanza, granada.org](https://www.granada.org/inet/wordenanz.nsf/wwalias/F2A1B47981131BB5C1257A78002A73E7)). Un foro de 2021 dice que baño y cocina van por declaración responsable con tasas ([Certicalia](https://www.certicalia.com/preguntas/p/pedir-permiso-de-obra-en-granada); no oficial). Tasas e ICIO vigentes: **(verificar)** en la sede electrónica. Cada municipio tiene su ordenanza (ejemplo: [Monachil](https://monachil.es/wp-content/uploads/2024/07/TRAMITACION-DECLARACIONES-RESPONSABLES-OBRAS-1.pdf)).

---

## 3. Marca

**Criterios:** corta; se dicta por teléfono sin deletrear; española; que suene a «obra bien hecha» y no a cadena de bricolaje; que valga para «[Marca] Granada», «[Marca] Málaga»… sin cambiar el nombre; sin parecerse a marcas del sector que haya visto (Leroy Merlin, Habitissimo, Cronoshare, CrearSur, El Mafra, Anjo, Reformas Grama…).

**Descartadas por dominio .es ocupado** (Shopify, `available: false`, 27/11/2026): plomada.es, escuadra.es, nivela.es, tabica.es, aplomo.es, buenaobra.es, obralimpia.es, lallana.es, cotacero.es. Casa a Punto tiene el .es libre pero el **.com ocupado**.

### 3.1 Nombres propuestos

Precios de la herramienta de Shopify (primer año, en dólares; la renovación suele costar más).

| # | Marca | Cómo se dicta | .es | .com | Comentario |
|---|---|---|---|---|---|
| 1 | **Obra Redonda** | «obra redonda, todo junto, punto es» | **Disponible** (22 USD) | **Disponible** (17 USD) | «Una obra redonda» es una expresión española de trabajo perfecto y terminado. Promesa clara, cálida, nada técnica. Vale para baño, cocina o piso. |
| 2 | **Casa a Plomo** | «casa a plomo, todo junto» | **Disponible** (22 USD) | **Disponible** (17 USD) | «A plomo» = perfectamente recto, de la plomada del albañil. Suena a oficio y es muy registrable. Riesgo: la palabra «plomo» puede sonar a pesado o a tuberías viejas. |
| 3 | **En Escuadra** | «en escuadra, todo junto» | **Disponible** (22 USD) | **Disponible** (17 USD) | Estar «en escuadra» = bien cuadrado. Corta y de oficio. Algo más fría que Obra Redonda. |
| 4 | **Obra Hecha** | «obra hecha, con hache» | **Disponible** (22 USD) | **Disponible** (17 USD) | Promesa de terminar; pero hay que decir «con hache» y suena a algo ya pasado. |
| 5 | **Reforma Redonda** | «reforma redonda, todo junto» | **Disponible** (22 USD) | **Disponible** (17 USD) | Más descriptiva que la 1 (dice qué hacemos), pero más larga y más débil como marca. Buena como dominio defensivo de la 1. |
| 6 | **Casa a Punto** | «casa a punto, todo junto» | **Disponible** (22 USD) | Ocupado | Muy entendible, pero el .com está ocupado y suena más a mantenimiento que a reforma. |

**OEPM:** **no comprobado.** consultas2.oepm.es está bloqueado por el proxy y el cupo de WebSearch se agotó antes de poder buscar «OEPM Obra Redonda». **Tarea a mano:** buscar cada nombre en el Localizador de marcas de la OEPM y en EUIPO (eSearch plus), clases 37 (construcción y reparación) y 35, antes de registrar dominio o marca. Tampoco he podido buscar si hay empresas que ya usen «Obra Redonda» como nombre comercial.

### 3.2 Recomendación
1. **Obra Redonda** (obraredonda.es y obraredonda.com libres). Se entiende a la primera, se dicta sin deletrear, transmite exactamente lo que el cliente teme no conseguir (que la obra acabe bien, sin flecos) y escala igual en todas las provincias: `obraredonda.es/granada`, `/malaga`. Registrar también reformaredonda.es como defensa. Andrés: «Hola, soy Andrés, de Obra Redonda».
2. **Casa a Plomo** (.es y .com libres). La más distintiva y registrable; tiene alma de oficio. Probarla con 5-10 personas del público por si «plomo» les suena mal.
3. **En Escuadra** (.es y .com libres). Corta y seria, buena alternativa si la empresa prefiere un tono más técnico.

---

## 4. Dirección visual

**Idea: «obra limpia».** Lo que se ve el día que se retiran los plásticos: paredes de yeso recién lijadas, el amarillo del nivel de burbuja y el azul de los azulejos de **Fajalauza** (la cerámica tradicional de Granada). Fondos claros casi blancos y neutros (ni crema ni beige), texto grafito, un amarillo de herramienta solo para las acciones de la persona y un azul cobalto para todo lo que es Andrés. Nada de verde (Herencias), nada de gris acero con naranja (Reparo), nada de terracota, nada de degradados.

Se conserva de las webs modelo: la estructura móvil primero, la regla «un color = Andrés, otro = acciones de la persona», las fuentes alojadas en la propia web y la capa de conversación.

### 4.1 Paleta (contrastes WCAG calculados con Python en esta sesión)

| Token | Uso | Claro | Oscuro |
|---|---|---|---|
| `--fondo` | fondo general («yeso») | `#F7F6F3` | `#131416` |
| `--tarjeta` | tarjetas y capas | `#FFFFFF` | `#1C1E21` |
| `--tinta` | texto principal («grafito») | `#1A1C1F` (15,8:1 sobre fondo; 17,1:1 sobre tarjeta) | `#ECEDEF` (15,7:1 sobre fondo; 14,3:1 sobre tarjeta) |
| `--tinta-2` | texto secundario | `#4B5058` (7,5:1) | `#ADB2BA` (8,7:1 sobre fondo; 7,8:1 sobre tarjeta) |
| `--tinta-3` | notas, fechas, pies | `#6B7079` (5,0:1 sobre tarjeta) | usar `--tinta-2` |
| `--nivel` | **acciones de la persona** (botón principal, selección, foco) | `#F2B92E` con texto `#1A1C1F` encima: **9,6:1**. Nunca como color de texto sobre fondo (1,6:1) | `#F5C443` con texto `#131416` encima: **11,3:1**; como texto sobre tarjeta: 10,2:1 |
| `--nivel-texto` | enlaces y cifras destacadas en modo claro | `#7A5300` (6,3:1 sobre fondo) | `#F5C443` |
| `--fajalauza` | **todo lo que es Andrés** (burbuja, micrófono, estado, su tarjeta) | `#23408E`; blanco encima 9,6:1; como texto sobre fondo 8,9:1 | `#9FB6F2` (8,3:1 sobre tarjeta); texto `#131416` encima 9,2:1 |
| `--fajalauza-suave` | fondo de la burbuja de Andrés | `#E9EDF7` (tinta encima 14,6:1) | `#1B2440` (verificar al montarlo) |
| `--nivel-suave` | fondo de bloques destacados (precios, garantía) | `#FBF1D6` (tinta encima 15,2:1) | `#2A2412` (verificar al montarlo) |
| `--ok` | confirmaciones | `#1E7A4F` (5,3:1 sobre tarjeta) | `#6FD3A0` (9,2:1) |
| `--rojo` | errores y avisos | `#B3261E` (6,5:1 sobre tarjeta) | `#FF8A80` (7,3:1) |
| `--linea` / `--linea-fuerte` | bordes | `#DEDDD8` / `#8C9099` (3,0:1, solo para bordes de campos) | `#2B2E33` / `#5C616A` |

Reglas:
- El amarillo **solo** en el botón principal y en el estado seleccionado. Si todo es amarillo, parece una ferretería.
- Sin degradados ni sombras grandes: borde de 1 px y una sombra mínima. Esquinas de 8 px (más rectas que Herencias: esto es obra).
- Detalle gráfico propio: una **retícula fina de 8 px tipo papel milimetrado** muy suave (`--linea` al 40 %) detrás del bloque de precios y de la solicitud, como el plano que se dibuja en la visita. Cotas (líneas con flechas y medidas) como adorno en las tarjetas de situaciones, nunca iconos de casco o martillo.

### 4.2 Tipografía (Google Fonts, licencia SIL Open Font License)
- **Titulares: «Bricolage Grotesque»** (600-800). Grotesca con carácter, algo irregular, que sugiere oficio sin caer en lo rústico. Usar con tamaño óptico grande.
- **Texto e interfaz: «Public Sans»** (400/600/700). Neutra, muy legible en móvil, buena para cifras y formularios.
- Tamaños en móvil: cuerpo 17-18 px con interlineado 1,55; titular 32-36 px; botones 18 px con altura mínima de 52 px; cifras de precios en Bricolage 28 px.
- Alojar las dos en la web (woff2 recortado a latín/español). Comprobar la licencia en la ficha de cada fuente en Google Fonts antes de publicar (verificar: no he podido abrirla en esta sesión; ambas se distribuyen allí con OFL según mi conocimiento).

### 4.3 Tono de las fotos
- **Contenido:** estancias reales de tamaño español (baños de 4-6 m², cocinas en L o con península, no islas americanas gigantes); materiales de cerca (azulejo, junta, madera, piedra, grifería); obra en proceso honesta (plásticos, escalera, plano); manos y herramientas.
- **Luz:** natural o la luz real del baño; nada de atardeceres dorados ni renders.
- **Color:** neutro, ligeramente frío; se admite una foto en blanco y negro (la del oficio).
- **Personas:** de perfil o trabajando, nunca mirando a cámara; jamás presentarlas como plantilla ni como clientes.
- **Prohibido:** cascos amarillos posando, apretones de manos, llaves entregándose, renders 3D, cocinas americanas, enchufes o textos de otros países.
- **Fotos propias:** en cuanto la empresa tenga obras, sustituir las de banco por antes/después propios (mismo encuadre, misma luz), con calle y barrio.

### 4.4 Tono de los textos
- De tú, frases cortas, palabras de obra que todo el mundo entiende («alicatar», «plato de ducha», «tabique»), explicando la primera vez las raras («declaración responsable: el papel que se presenta en el ayuntamiento para obras sin cambiar estructura»).
- Prometer **certeza** (precio por partidas, fecha, limpieza), no «la mejor reforma de Granada».
- Prohibido: emojis, exclamaciones en serie, «¡Pide presupuesto ya!», anglicismos («home staging», «checklist»).

### 4.5 Estructura de la página (móvil, en este orden)
1. **Barra superior fina:** marca y botón de llamar.
2. **Portada:** foto del baño; titular, subtítulo; botón principal «Hablar con Andrés» y secundario «Prefiero que me llamen». Debajo, tres garantías en una línea: «Visita de medición gratis · Presupuesto por partidas y por escrito · Fecha de entrega en el contrato».
3. **«¿Qué quieres reformar?»:** 8 tarjetas (situaciones) que abren a Andrés con el contexto cargado.
4. **Cómo funciona:** 3 pasos.
5. **Precios orientativos:** 4 tarjetas con horquilla, plazo y qué incluye; fecha de revisión; «el precio cerrado sale de la visita».
6. **Qué incluye siempre:** licencia o declaración responsable, protección de zonas comunes, contenedor y escombros, limpieza final, garantía por escrito.
7. **Obras en Granada:** antes/después propios con barrio (cuando existan).
8. **Quién hace la obra:** empresa, CIF, años, seguro de responsabilidad civil, dirección. Andrés se presenta como asistente.
9. **Opiniones:** reseñas de Google enlazadas.
10. **Preguntas frecuentes** con fecha de revisión.
11. **Qué tener preparado para la visita** (lista).
12. **Contacto y zona de trabajo:** Granada capital, área metropolitana y provincia (municipios).
13. **Pie:** aviso legal, privacidad, aviso de que los precios son orientativos.
14. **Capa de conversación con Andrés.**

---

## 5. Textos propuestos

- **Titular:** «Tu baño, tu cocina o tu piso, con precio cerrado y fecha de entrega.»
  - Alternativa: «Una reforma que acaba cuando te dijimos y cuesta lo que firmamos.»
- **Subtítulo:** «Cuéntale a Andrés qué quieres cambiar: te orienta ahora mismo, te da una idea de precio y te reserva la visita de medición en casa, gratis, en Granada y provincia.»
- **Botones:** «Hablar con Andrés» · «Prefiero que me llamen».

### 5.1 Situaciones (lista para el código, formato de herencias/index.html)
```js
const SITUACIONES = [
  ["banera", "Cambiar la bañera por ducha", "Quiero quitar la bañera y poner un plato de ducha"],
  ["bano", "Reformar el baño entero", "Quiero reformar el baño completo: azulejos, sanitarios y todo"],
  ["cocina", "Reformar la cocina", "Quiero cambiar la cocina: muebles, encimera y lo que haga falta"],
  ["integral", "Reformar el piso entero", "Quiero hacer una reforma integral de mi piso"],
  ["pisoviejo", "He comprado un piso para reformar", "He comprado (o voy a comprar) un piso viejo y quiero saber cuánto costaría reformarlo"],
  ["mayores", "Adaptar el baño a una persona mayor", "Necesito adaptar el baño para una persona mayor o con movilidad reducida"],
  ["instalaciones", "Cambiar instalación de luz o agua", "La instalación eléctrica o las tuberías son antiguas y quiero cambiarlas"],
  ["alquilar", "Reformar para alquilar o vender", "Quiero reformar un piso para alquilarlo o venderlo mejor"]
];
```

### 5.2 Cómo funciona (3 pasos)
1. **Cuéntaselo a Andrés.** Qué quieres reformar, metros aproximados y unas fotos. Te da una horquilla de precio en el momento.
2. **Visita de medición en casa, gratis.** Un técnico mide, mira instalaciones y te explica opciones y materiales. Unos 45 minutos (estimación).
3. **Presupuesto por partidas y fecha de entrega, por escrito.** Lo recibes en pocos días (plazo a fijar con la empresa). Si te convence, se firma con precio cerrado y calendario.

### 5.3 Bloque de precios orientativos (borrador; validar con la empresa)
- **Cambiar bañera por plato de ducha:** desde 900 €; normalmente 1.000-1.800 €. 1-2 días.
- **Baño completo (4-5 m²):** 4.500-8.000 €. 7-15 días laborables.
- **Cocina completa con muebles:** 7.000-14.000 €. 2-4 semanas de obra.
- **Reforma integral de piso:** 650-1.000 €/m². 2-4 meses.
- Nota: «Precios orientativos revisados en noviembre de 2026, IVA [incluido/aparte]. Dependen del estado de la vivienda, de los materiales y de si hay que cambiar instalaciones. El precio cerrado te lo damos por escrito después de la visita.»

### 5.4 Seis preguntas frecuentes (borrador)
1. **¿Cuánto cuesta la visita para medir?**
   Nada. La visita de medición y el presupuesto por partidas son gratis y sin compromiso en Granada capital y el área metropolitana. Para pueblos lejanos te lo decimos antes de ir.
2. **¿Cuánto cuesta cambiar la bañera por un plato de ducha?**
   En Granada suele estar entre unos 850 y 1.700 € según el tamaño del plato y lo que haya que alicatar ([VIP Reformas](https://www.vipreformas.es/presupuestos/cambio-de-banera-por-plato-de-ducha/granada/), [Ducha Nueva](https://duchanueva.es/andalucia/granada/)). Si solo se cambia la bañera, se hace en uno o dos días.
3. **¿Cuánto tarda una reforma de baño, de cocina o de un piso entero?**
   Un baño, entre una y tres semanas; una reforma integral, entre uno y tres meses según tamaño ([Leroy Merlin](https://www.leroymerlin.es/servicios/reformas-de-banos/servicio-de-reforma-de-banos.html), [Reformas Anjo](https://reformasanjo.com/precio-reforma-integral-sevilla/)). La fecha de entrega va en el contrato.
4. **¿Necesito licencia del ayuntamiento?**
   Casi siempre hace falta algún trámite: licencia, declaración responsable o comunicación previa, según la obra ([Ordenanza de Granada](https://www.granada.org/inet/wordenanz.nsf/wwalias/F2A1B47981131BB5C1257A78002A73E7)). Nos encargamos de presentarlo; las tasas del ayuntamiento van aparte y te las decimos en el presupuesto.
5. **¿Y si a mitad de obra aparece algo que no estaba previsto?**
   El presupuesto es por partidas y cerrado. Si al abrir aparece algo oculto (una tubería rota, una viga dañada), te lo enseñamos, te damos el precio por escrito y no se hace nada sin tu firma.
6. **¿Andrés es una persona?**
   No. Andrés es un asistente con inteligencia artificial que te orienta, apunta tu caso y te reserva la visita. Las mediciones, el presupuesto y la obra los hace siempre el equipo de la empresa.

### 5.5 Campos de la solicitud (lo que Andrés apunta)
- Nombre, teléfono, municipio y barrio o código postal.
- Qué quiere reformar (situación de la lista) y, si son varias, cuáles.
- Tipo de vivienda: piso (planta, **¿hay ascensor?**), casa o local; propietario, comprador en proceso o inquilino.
- Metros aproximados de la estancia o del piso; número de baños.
- Año aproximado del edificio o de la última reforma (para saber si hay que cambiar instalaciones).
- Qué se quiere cambiar exactamente (bañera por ducha, distribución, tirar tabiques, muebles, suelos, ventanas, instalación eléctrica o de agua).
- Nivel de acabados (sencillo, medio, alto) y presupuesto aproximado que tiene en mente.
- Cuándo quiere empezar y si hay una fecha límite (mudanza, alquiler).
- Si la vivienda está habitada durante la obra.
- Fotos enviadas (sí/no).
- Día y franja preferidos para la visita; mejor hora para llamar.
- Consentimiento de privacidad.

### 5.6 Lo que el cliente debe tener preparado para la visita
- Fotos de cada estancia (de frente y desde la puerta), del cuadro eléctrico y de la llave de paso.
- Medidas aproximadas (largo y ancho) de la estancia, o el plano del piso si lo tiene (escrituras, nota simple o anuncio de venta).
- Ideas o fotos de lo que le gusta (revistas, Pinterest, otras casas).
- Qué quiere conservar (muebles, sanitarios, electrodomésticos).
- Presupuesto aproximado y fecha en la que necesita la obra terminada.
- Si es un piso: normas de la comunidad sobre obras (horarios, ascensor, contenedor) y contacto del administrador.
- Si lo acaba de comprar: fecha de entrega de llaves y si necesita el presupuesto para la hipoteca o un préstamo.
- Estar en casa quien decide (y, si son dos, los dos).

---

## 6. Fotos (Pexels)

Descargadas, revisadas una a una y comprimidas en `reformas/media/` (detalle y créditos en `media/CREDITOS.md`):

| Archivo | Uso | Página |
|---|---|---|
| portada.jpg (1600x1068, 123 KB) | Portada: baño reformado con hornacinas y suspendidos | https://www.pexels.com/photo/6782573/ |
| cocina.jpg (1400x934, 137 KB) | Tarjeta y precio de cocina | https://www.pexels.com/photo/6782576/ |
| piso-viejo.jpg (1400x934, 143 KB) | «He comprado un piso para reformar» / reforma integral | https://www.pexels.com/photo/6474478/ |
| oficio.jpg (1400x934, 110 KB, B/N) | «Cómo funciona» o «Qué incluye» | https://www.pexels.com/photo/6474344/ |
| compartir.jpg (1200x630, 54 KB) | Imagen al compartir el enlace | https://www.pexels.com/photo/6782575/ |

Sin verificar: el **autor** de cada foto (www.pexels.com bloqueado y buscador agotado). Licencia: https://www.pexels.com/license/ (uso comercial gratis, sin atribución obligatoria; no vender la foto sin modificar ni insinuar que las personas respaldan el servicio).
