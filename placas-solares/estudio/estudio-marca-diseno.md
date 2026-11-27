# Estudio de competencia, marca, diseño y fotos: web de placas solares (Granada)

Fecha: 27 de noviembre de 2026. Ámbito: primera web provincial (Granada y provincia), con una marca pensada para toda España. Público: viviendas unifamiliares, comunidades de vecinos y pequeños negocios; baterías y cargador de coche eléctrico como extras. Objetivo de Andrés: orientar (ahorro, tamaño, precio orientativo) y cerrar un **estudio gratuito** (visita técnica o presupuesto).

## 0. Cómo se ha hecho y límites (léelo antes de nada)

- **WebSearch** ha funcionado hasta agotar el cupo de búsquedas de la sesión (límite compartido de 200 por turno). Da títulos, URL y extractos de lo indexado. **No he visto ninguna web renderizada**: la «primera pantalla» de cada competidor se reconstruye a partir del contenido indexado.
- **WebFetch está bloqueado**: `getaddrinfo ENOTFOUND` en sede.agenciatributaria.gob.es y autosolar.es. No he podido abrir el texto oficial de la AEAT ni el BOJA.
- **Dominios**: comprobados con la herramienta de dominios de Shopify (`generate-domain-names`), que consulta el registro en el momento. No es una reserva. No he comprado nada.
- **OEPM**: no comprobada. El cupo de búsquedas se agotó justo al empezar esa parte, y en el estudio de Herencias ya se vio que consultas2.oepm.es está bloqueado. **Queda como tarea a mano** (ver 2.3).
- **Fotos**: la búsqueda de páginas de Pexels no se pudo hacer (cupo agotado). He descargado por identificador desde images.pexels.com (único host permitido), **he abierto y revisado cada foto**, pero **no he podido leer el autor** (las páginas de pexels.com no son accesibles y los JPEG no traen metadatos). El autor queda «(verificar)» salvo en una foto ya documentada en Herencias.
- No he usado Apify ni ningún servicio de pago.

---

## 1. Competencia

Búsquedas: «placas solares Granada», «instaladores placas solares Granada», «empresa instaladora fotovoltaica Granada comunidades de vecinos», «precio instalación placas solares vivienda 2026», y búsquedas por marca. En Granada, la primera página la copan **comparadores y directorios** (Selectra, Tarifasgasluz, Habitissimo, Cronoshare, Certicalia) y la tienda online AutoSolar. Los instaladores locales casi no aparecen con web propia: aparecen dentro de esos directorios.

### 1.1 Instaladores locales de Granada (Solurgy, ARF Solar, AC Fotovoltaica, Enerty Sur)
- **Dónde aparecen:** en el listado «Los 5 instaladores de placas solares en Granada» de [Tarifasgasluz](https://tarifasgasluz.com/autoconsumo/provincias/granada):
  - Solurgy Renovables, con nave en el Polígono de Juncaril; su domicilio social está en Gran Vía de Colón, 16 ([ENF Solar](https://www.enfsolar.com/solurgy-renovables), [ranking El Economista](https://ranking-empresas.eleconomista.es/SOLURGY-RENOVABLES.html));
  - ARF Solar, en C/ La Coruña 69, 18151 Ogíjares ([ENF Solar](https://www.enfsolar.com/arf-solar-1));
  - AC Fotovoltaica, en Churriana de la Vega;
  - Enerty Sur Fotovoltaica, en C/ Ramón Guardiola 1, Granada ([energias-renovables.com](https://www.energias-renovables.com/empresas/enerty-sur-fotovoltaica)).
- **Primera pantalla:** no vista. Ninguna de sus webs propias salió en las búsquedas, así que su captación depende de directorios.
- **Precios publicados:** ninguno propio. El directorio da una cifra común: «desde 4.200 € para 4 a 12 placas, con 1 a 2 meses de instalación».
- **Confianza:** dirección física en Granada y antigüedad. No he encontrado reseñas verificables. En el ranking de ventas, Solurgy cae 875 puestos de 2023 a 2024.
- **Llamadas a la acción:** «pedir presupuesto» a través del directorio.
- **Bien:** son de aquí, con nave y equipo cerca, y eso es justo lo que pide quien teme a las grandes.
- **Mal:** son casi invisibles en buscadores, no dan precio, ni calculadora, ni respuesta inmediata. Un plazo de «1 a 2 meses» sin explicar asusta.

### 1.2 AutoSolar, página «Instalación placas solares Granada» (tienda nacional con página local)
- **URL:** https://autosolar.es/mi-experiencia-placas-solares/instalacion-placas-solares-granada (y [conexión a red en Granada](https://autosolar.es/instalaciones-fotovoltaicas/instalacion-solar-de-conexion-a-red-en-granada)).
- **Primera pantalla (según lo indexado):** instalación en Granada para particulares, comunidades y empresas, con un «estudio personalizado, gratuito y sin compromiso».
- **Precios publicados:** una tabla por factura mensual. Una factura de 50-100 € al mes (unos 4.000 kWh y más de 6 paneles) sale por unos 2.500 €, y una de más de 250 € al mes (11.000 kWh y más de 15 paneles) por unos 10.500 €. Kits de conexión a red: de 200 € a 9.000 €; kits híbridos: de 4.800 € a 18.000 €.
- **Confianza:**
  - casos reales en Granada (unifamiliar y una instalación con inversores SMA);
  - nota propia de «4,5/5 con más de 2.550 opiniones», que no he verificado en Trustpilot;
  - dato de producción: «hasta 1.500 kWh por kWp al año».
  - Habla de bonificaciones municipales (IBI del 30-50 % durante 3-10 años en Armilla, Motril, Albolote o Maracena), sin citar la ordenanza.
- **Llamadas a la acción:** estudio gratuito y compra de kits.
- **Bien:** es **la única que traduce la factura a tamaño y precio** («si pagas X al mes, te toca esto»), con casos locales y bonificaciones por municipio.
- **Mal:** es un distribuidor, así que no se sabe quién instala; el precio de 2.500 € parece de kit, no de instalación legalizada con boletín; y las bonificaciones no tienen fuente.

### 1.3 Habitissimo y Cronoshare (mercados de presupuestos)
- **URL:** https://www.habitissimo.es/empresas/placas-solares/granada/granada (66 profesionales; también páginas por municipio: [Armilla](https://www.habitissimo.es/empresas/placas-solares/granada/armilla), [Almuñécar](https://www.habitissimo.es/empresas/placas-solares/granada/almunecar), [Huétor Tájar](https://www.habitissimo.es/empresas/placas-solares/granada/huetor-tajar/2)) y https://www.cronoshare.com/servicios/instalar-placas-solares/granada/atarfe
- **Primera pantalla:** formulario «pide hasta 4 presupuestos gratis» y lista de empresas (Intesur Energía Solar, 4,4/5 con 13 opiniones; Fotovoltaica Polaris, 4,2/5 con 6 opiniones).
- **Precios:** Habitissimo da un precio medio de **8.000 €**, en un rango de 3.700 € a 25.000 €, según los presupuestos recibidos ([precios](https://habitissimo.es/presupuestos/placas-solares)).
- **Bien:** cubre los municipios uno a uno y muestra opiniones de terceros.
- **Mal:** el cliente da su teléfono y le llaman cuatro empresas. Eso genera desconfianza y es **nuestro hueco: una sola empresa, sin subasta de tu teléfono**.

### 1.4 1KOMMA5° (antes Experta Solar; nacional)
- **URL:** https://1komma5.com/es/ y [estudio gratuito](https://1komma5.com/es/estudio-gratuito/)
- **Primera pantalla:** «Estudio gratuito» y promociones con fecha («Hasta 1.000 € dto. hasta 29/07», «Tablet + 2 enchufes inteligentes gratis»).
- **Precios publicados:** instalación media de unos **6.500 €**, con amortización «de 2 a 6 años»; baterías desde 2.790 € instaladas ([precio](https://1komma5.com/es/placas-solares/precio/), [baterías](https://1komma5.com/es/baterias-solares/)). Avisa de una subida del 15-20 % en 2026 ([evolución](https://1komma5.com/es/placas-solares/evolucion-precio-placas-solares/)).
- **Confianza:**
  - garantías publicadas: 30 años de producción al 80 % y 3 años de mano de obra ([garantías](https://1komma5.com/es/legal/garantias/)), aunque otras páginas dicen 25 años;
  - financiación con Cetelem, BBVA o Sabadell, de 3 a 144 meses.
- **Bien:** es la que mejor explica la garantía y la financiación, y tiene una página por tema (precio, baterías, IRPF, excedentes).
- **Mal:**
  - las promociones caducadas siguen indexadas, lo que da sensación de presión comercial;
  - «amortiza en 2 años» es poco creíble;
  - las cifras de garantía no son coherentes entre páginas.

### 1.5 SotySolar (nacional, red de instaladores)
- **URL:** https://sotysolar.es (vista a través de [Selectra](https://selectra.es/autoconsumo/companias/sotysolar), [Roams](https://roams.es/energia/energia-renovable/energia-solar/instaladores/sotysolar) y foros de la OCU).
- **Primera pantalla (según terceros):** calculadora solar y estudio personalizado, que llega por correo y SMS junto al contrato.
- **Precios:** entre 4.000 € y 26.000 € según Selectra; «desde 6.500 € para 6 paneles» en otra comparativa.
- **Confianza:** premio EUPD Research de 2023, según Selectra. Pero su nota en Roams es de **2,5/5**, y en el foro de la OCU hay mensajes promocionales con códigos de descuento.
- **Bien:** la calculadora es el imán: el cliente entra por saber cuánto ahorraría.
- **Mal:** el instalador es un tercero que el cliente no conoce, y las reseñas están divididas.

### 1.6 Iberdrola Smart Solar, Holaluz y Otovo (grandes, como referencia y advertencia)
- **Iberdrola Smart Solar** ([web](https://www.iberdrola.es/en/smart-solar)):
  - instalación de 4.000 € a 8.000 € según [Roams](https://roams.es/energia/companias-energeticas/iberdrola/energia-solar/); 8 placas desde 5.400 € sin IVA, a unos 1,35 €/Wp, según [Tarifasgasluz](https://tarifasgasluz.com/autoconsumo/companias-instaladoras/smart-solar-iberdrola);
  - **Solar Cloud**, su batería virtual, paga los excedentes a unos 0,06 €/kWh ([Selectra](https://selectra.es/autoconsumo/companias/smart-solar-iberdrola/bateria-virtual)).
  - Bien: el concepto «batería virtual» es fácil de entender. Mal: ata la instalación a la comercializadora.
- **Holaluz:**
  - desde 4.100 € + IVA ([Papernest](https://www.papernest.es/holaluz/placas-solares/));
  - el estudio de viabilidad se hace después de aceptar el presupuesto, no antes;
  - situación financiera delicada: reestructuró su deuda en 2025 ([ARA](https://es.ara.cat/economia/energia/holaluz-evita-insolvencia-juez-avala-reestructuracion_1_5400399.html)) y en julio de 2026 el Gobierno abrió un procedimiento para inhabilitarla como comercializadora ([ARA](https://es.ara.cat/economia/energia/gobierno-espanol-inicia-procedimiento-inhabilitar-holaluz-traspasar-clientes_1_5802496.html)).
  - **Lección:** al cliente le preocupa quién responde de la garantía dentro de 10 años.
- **Otovo:**
  - modelo de alquiler con cuota mensual (desde 25 € al mes en 2020, [energias-renovables.com](https://www.energias-renovables.com/fotovoltaica/la-compania-noruega-otovo-lanza-en-espana-20200603/pagpos/1/));
  - en 2026 hay quejas por una penalización de 3.800 € por desistir más 500 € por desinstalar ([Roams](https://roams.es/energia/energia-renovable/energia-solar/instaladores/otovo/)).
  - **Lección:** decir claro qué pasa si el cliente quiere salir.

### 1.7 Referencias de precio de mercado (para el cerebro y la web)

Todas las cifras llevan el IVA incluido salvo que se diga lo contrario. Fecha de consulta: 27/11/2026.

| Concepto | Cifra | Fuente |
|---|---|---|
| Vivienda, mínimo habitual (4 placas) | desde 4.200 € | [Selectra](https://selectra.es/autoconsumo/info/instalacion), [Tarifasgasluz Granada](https://tarifasgasluz.com/autoconsumo/provincias/granada) |
| 6 placas / 10 placas | desde 5.100 € / desde 7.200 € | [Selectra](https://selectra.es/autoconsumo/info/instalacion) |
| Vivienda de 3 a 7 kWp sin batería | 4.000 € – 8.500 € | [Tarifasgasluz](https://tarifasgasluz.com/autoconsumo/instalacion) |
| Vivienda con batería | 7.000 € – 14.000 € | [Tarifasgasluz](https://tarifasgasluz.com/autoconsumo/instalacion) |
| Precio por kWp instalado | 850 € – 1.300 € | [Ecosistemas Startup](https://ecosistemastartup.com/?p=78401) |
| Media de presupuestos recibidos | 8.000 € (de 3.700 € a 25.000 €) | [Habitissimo](https://habitissimo.es/presupuestos/placas-solares) |
| Pyme de 12 a 15 placas | desde 8.100 € | [Selectra pymes](https://selectra.es/autoconsumo/info/instalacion/pymes) |
| Batería de 5 kWh (añadida) | 3.000 € – 5.000 €; 1KOMMA5° desde 2.790 € instalada | [Ecosistemas Startup](https://ecosistemastartup.com/?p=78401), [1KOMMA5°](https://1komma5.com/es/baterias-solares/) |
| Cargador de coche en unifamiliar | 800 € – 1.700 € (Repsol desde 2.065,95 €) | [movilidadelectrica.com](https://movilidadelectrica.com/cuanto-cuesta-instalar-punto-carga-casa/), [Autofácil 2026](https://www.autofacil.es/cargar-coche-electrico-casa-guia-2026-instalacion-precios-normativa/), [Repsol](https://www.repsol.es/particulares/vehiculos/movilidad-electrica/instalacion-punto-de-recarga/) |
| Proyecto técnico en Granada (si hace falta) | unos 650 € + IVA | [Certicalia](https://www.certicalia.com/proyecto-de-instalacion-de-placas-solares/granada) |
| Excedentes vertidos a la red (mercado libre) | 0,06 – 0,10 €/kWh (algunas 0,04 € o 0 €) | [Selectra](https://selectra.es/autoconsumo/info/tarifas), [Roams](https://roams.es/energia/energia-renovable/energia-solar/compensacion-excentes/) |
| Precio medio de la luz en casa (3.500 kWh al año) | unos 0,20 €/kWh en PVPC (708 € al año, cálculo propio a partir de la OCU); Eurostat da 0,25 €/kWh para el 1.er semestre de 2026 | [OCU](https://www.ocu.org/organizacion/prensa/notas-de-prensa/2026/luz310726), [Selectra](https://selectra.es/energia/noticias/kwh-luz-2026-consumo-bajo-precio-caro) |
| Producción en Granada | unos 1.500 – 1.550 kWh por kWp al año (orden de magnitud; hay que lanzar PVGIS con cada tejado) | [AutoSolar](https://autosolar.es/mi-experiencia-placas-solares/instalacion-placas-solares-granada), simulación PVGIS cerca de Granada (1.520 kWh/kWp) en [SolarWeb](https://www.solarweb.net/forosolar/attachments/fotovoltaica-sistemas-aislados-la-red/20837-futuro-proyecto-algunas-dudas-pvgis-5_gridconnectedpv_37.760_-3.791_cm_undefined_4.5kwp_14_20deg_-45deg.pdf) |
| Horas de sol y amortización en Granada | 3.228 h al año; de 6 a 7 años | [Selectra Andalucía](https://selectra.es/autoconsumo/normativa/subvenciones/andalucia) |
| Tendencia de precio | los paneles suben un 15-20 % en 2026 (según un vendedor); las baterías, en torno al +20 % previsto | [1KOMMA5°](https://1komma5.com/es/placas-solares/evolucion-precio-placas-solares/), [AutoSolar](https://autosolar.es/noticias-internacionales/subira-el-precio-de-las-baterias-placas-solares-este-2026) |

En los precios de la luz, PVPC es la tarifa regulada.

**Ayudas e impuestos (todo marcado «verificar» antes de publicarlo como dato firme):**
- **Junta de Andalucía.** El 22/10/2026 se abrió el programa residencial de la Agencia Andaluza de la Energía: 20,77 M€ con fondos FEDER, ayudas de **hasta el 65 % para autoconsumo con baterías**, sin concurrencia competitiva y con plazo hasta el 30/09/2027 o hasta que se agote el dinero ([energias-renovables.com](https://www.energias-renovables.com/autoconsumo/andaluc-a-abre-las-solicitudes-de-ayudas-20261022)). Convocatoria publicada en el BOJA del 25 de septiembre. **No he podido ver los importes por kWp. (verificar en el BOJA)**
- **IRPF por obras de eficiencia energética (20/40/60 %).** Prorrogada hasta el 31/12/2026 por el RDL 16/2025 ([BOLINFORM AEAT](https://www3.agenciatributaria.gob.es/static_files/Sede/Actualidad/Novedades/2025/BOLINFORM_RDL_16_2025.pdf), [Moncloa.com](https://www.moncloa.com/2026/07/30/subvencion-irpf-placas-solares-3407779/)). Se necesitan certificados energéticos antes y después de la obra. (verificar)
- **Nueva deducción en el IRPF por autoconsumo renovable** (RDL 7/2026, con efectos desde el 01/01/2026): la AEAT la recoge ([AEAT](https://sede.agenciatributaria.gob.es/Sede/irpf/novedades-impuesto/novedades-normativa-2026/principales-novedades-tributarias-introducidas-real-marzo.html), [Pérez-Llorca](https://www.perezllorca.com/wp-content/uploads/2026/03/Nota-Juridica-Analisis-de-las-principales-medidas-tributarias-contenidas-en-el-RD72026.pdf)), pero **las fuentes no coinciden en el porcentaje**: Selectra dice el 10 % y Ecoticias el 20 %. Solo vale para instalaciones terminadas en 2026. **(verificar)**. Mensaje útil para la web: «Si terminas la instalación antes del 31 de diciembre de 2026, puede haber deducción en la Renta; te lo explicamos en el estudio».
- **IBI e ICIO en Granada capital.** Guiafiscal.es habla de una bonificación del 25 % en el IBI por autoconsumo ([guiafiscal](https://guiafiscal.es/patrimonio/ibi/granada/)), pero la propuesta de modificación de las ordenanzas para 2026 que he visto no menciona la energía solar ([propuesta OOFF 2026](https://transparencia.granada.org//images/gallerys/pages/files/EXP%20210-2025%20DOC%201%20PROPUESTA%20MODIFICACION%20OOFF%202026%20FIRMADA.pdf)). **(verificar las Ordenanzas n.º 3 y n.º 4)**. En Motril, Tarifasgasluz cita un 95 % del ICIO (verificar).
- **Comunidades de vecinos.** Hace falta acuerdo en junta y reparto con coeficientes ([guía IDAE](https://www.idae.es/sites/default/files/documentos/publicaciones_idae/NIPO_629-24-001-9_GUIA_05_PASOS-AUTOCONSUMO-COMUNIDADES-PROPIETARIOS_actualizado.pdf)). El MITECO anunció en octubre de 2025 una revisión que permite cambiar los coeficientes cada mes ([MITECO](https://www.miteco.gob.es/es/prensa/ultimas-noticias/2025/octubre/el-miteco-impulsa-el-autoconsumo-colectivo-con-una-revision-de-l.html)). No he encontrado un precio por vecino con fuente.

### 1.8 Diez conclusiones concretas para nuestra web
1. **El instalador de Granada no existe en internet.** Los locales solo salen dentro de directorios. Una web propia, rápida y con Andrés atendiendo al momento ya gana la búsqueda local frente a Solurgy, ARF o Enerty Sur.
2. **Factura → tamaño → precio en 30 segundos.** AutoSolar y SotySolar enganchan con eso. Andrés debe preguntar «¿cuánto pagas de luz al mes?» y devolver un rango de placas, de precio y de ahorro, con la palabra «orientativo» y el botón del estudio gratuito.
3. **«Tu teléfono no se reparte».** Habitissimo y Cronoshare pasan el contacto a varias empresas. Decirlo arriba: «Te atiende una sola empresa instaladora. No vendemos tus datos a nadie».
4. **Estudio gratuito ANTES de firmar,** al revés que Holaluz, que visita después de aceptar el presupuesto. Prometer: visita técnica, foto del tejado con la colocación propuesta y un presupuesto cerrado por escrito.
5. **Publicar una tabla de precios orientativos por tamaño** (4-6, 8-10 y 12-15 placas; batería; cargador), con IVA y qué incluye (legalización, boletín, alta de excedentes). Nadie local lo hace.
6. **Garantías con nombre y años, y quién responde.** Tras lo de Holaluz y Otovo, el miedo es «¿y si la empresa desaparece?». Mostrar la garantía del fabricante, la del inversor y la de mano de obra, y la empresa instaladora autorizada en la Junta (con número de registro).
7. **Promesas creíbles.** Nada de «factura cero» ni «amortiza en 2 años». Usar «en Granada se suele recuperar en 6-8 años» con su fuente, y enseñar el cálculo.
8. **Ayudas con fecha y sin prometer.** El 65 % de la Junta para baterías y la deducción del IRPF de 2026 son el gancho de este invierno. Un bloque «Ayudas vigentes (revisado: nov. 2026)» con enlaces oficiales y la frase «te ayudamos a pedirla».
9. **Tres caminos claros desde la portada:** Mi casa · Mi comunidad · Mi negocio. Las comunidades necesitan otro discurso: acta de junta, reparto entre vecinos y quién paga. Ningún competidor local lo explica.
10. **Páginas por municipio con datos reales,** no plantillas: AutoSolar menciona Armilla, Motril, Albolote y Maracena; Habitissimo, cada pueblo. Primero la provincia; luego los municipios con bonificación de IBI/ICIO comprobada, citando la ordenanza.

---

## 2. Marca

**Criterios:**
- corta y fácil de dictar;
- sin anglicismos;
- que valga para toda España («[Marca] Granada», «[Marca] Málaga»);
- que no se parezca a marcas grandes del sector.

Se evitan «Solaria» (Solaria Energía), «Lucera» (comercializadora), «Vatia», «Solana» (cripto), «Sol en casa» y similares.

**Método:** herramienta de dominios de Shopify (`generate-domain-names`), consulta exacta de cada .es y, cuando el .com no aparecía como variante disponible, consulta exacta del .com. Precio del primer año que da la herramienta, en USD; la renovación puede ser más cara. **No se ha comprado nada.** Consulta del 27/11/2026: no es una reserva.

**Descartadas por dominio ocupado** (`available: false`): solaz.es, placaaplaca.es (el .com sí estaba libre), solencasa.es y lumbrera.es.

### 2.1 Siete nombres comprobados

| # | Marca | Así se dicta | .es | .com | Comentario |
|---|---|---|---|---|---|
| 1 | **Tejaluz** | «teja y luz, todo junto» | **true** (22 USD) | **true** (17 USD) | Inventada y muy española: teja + luz. Corta, visual, fácil de recordar. Pega: en naves y azoteas no hay teja, pero como marca funciona igual. |
| 2 | **Tejado Claro** | «tejado claro» | **true** (22 USD) | **true** (17 USD) | Promesa de transparencia («cuentas claras»). Dos palabras normales, cero dudas al teléfono. Más descriptiva, y por tanto más débil para registrar. |
| 3 | **Solpropio** | «sol propio, todo junto» | **true** (22 USD) | false | Dice el beneficio: tu propia luz. El .com está ocupado; usar el .es y proteger solpropio.net (19 USD, disponible). |
| 4 | **Solvecino** | «sol vecino, todo junto» | **true** (22 USD) | **true** (17 USD) | Perfecta para comunidades y autoconsumo compartido; se queda corta para negocios. Buena como submarca («Solvecino, de Tejaluz»). |
| 5 | **Tejasol** | «teja sol» | **true** (22 USD) | false | Corta, pero el .com está ocupado y puede confundirse con fabricantes de tejas (sin comprobar). |
| 6 | **Azotea Solar** | «azotea solar» | **true** (22 USD) | false | Muy clara para pisos y comunidades; larga y genérica. |
| 7 | **Mediodía Solar** | «mediodía solar» | **true** (22 USD) | false | Evocadora (la hora de más producción), pero lleva tilde y no la lleva el dominio, y es larga. |

### 2.2 Recomendación
1. **Tejaluz** (tejaluz.es y tejaluz.com disponibles). Es corta, propia, sin parecido con las grandes y con imagen inmediata (tejado al sol). Dominio único `tejaluz.es` con rutas `/granada`, `/malaga`; el .com, para proteger la marca.
2. **Tejado Claro** (.es y .com disponibles). Es la mejor si se quiere que el nombre ya diga «transparencia». Riesgo: es más descriptiva y más difícil de registrar como marca.
3. **Solpropio** (.es disponible; .com ocupado). Es la que mejor cuenta el beneficio. Solo si no importa no tener el .com.

**Extra:** reservar también `solvecino.es` para una futura página de comunidades.

### 2.3 OEPM (pendiente, a mano)
No comprobado: el cupo de búsquedas web se agotó y la OEPM no es accesible desde esta sesión. **Tarea:**
- buscar «Tejaluz», «Teja Luz», «Tejado Claro» y «Solpropio» en el Localizador de marcas de la OEPM y en EUIPO eSearch plus, clases 37 (instalación), 40 (producción de energía), 42 (estudios técnicos) y 35;
- mirar también denominaciones parecidas («Tejasol», «Tejaluz» en cerámica: clase 19, materiales de construcción).

---

## 3. Dirección visual

**Idea: «mediodía de invierno en la Vega».** Es la luz limpia y fría de un día despejado de enero en Granada, con Sierra Nevada nevada: cielo azul intenso, cal blanca, el azul casi negro de las células del panel y un único golpe de amarillo sol.

Se diferencia así de las otras webs:
- no es crema ni terracota;
- no hay degradados morados;
- no usa el verde pino de Herencias;
- no usa el gris acero con naranja de Reparo.

El amarillo es **solo de Andrés**. Las acciones de la persona van en azul célula. Se mantiene la regla de la fábrica: un color = Andrés, otro = lo que hace la persona.

### 3.1 Paleta (contrastes WCAG calculados con Python en esta sesión)

| Token | Uso | Claro | Oscuro |
|---|---|---|---|
| `--fondo` | fondo general (cal fría) | `#F3F6F9` | `#0B1220` |
| `--tarjeta` | tarjetas y capas | `#FFFFFF` | `#131C2E` |
| `--tinta` | texto principal (azul pizarra de panel) | `#0E1A2B`: 16,1:1 sobre fondo; 17,5:1 sobre tarjeta | `#E8EDF5`: 15,9:1; 14,5:1 |
| `--tinta-2` | texto secundario | `#46536A`: 7,2:1; 7,8:1 | `#A9B5C8`: 9,0:1; 8,2:1 |
| `--celula` | **acciones de la persona** (botón principal, enlaces, selección) | `#1D3E8A`: texto blanco encima 10,0:1; como texto, 9,2:1 sobre fondo | `#8FB2FF`: texto `#0B1220` encima 8,9:1; 8,1:1 sobre tarjeta |
| `--sol` | **todo lo que es Andrés** (botón de micrófono, punto de estado, burbuja). Siempre como relleno, con `--tinta` encima | `#F5C431`: `#0E1A2B` encima 10,7:1. Contra el fondo solo 1,5:1, así que **siempre con borde `--sol-texto`** | `#F5C431`: 11,4:1 sobre fondo; `#0B1220` encima 11,4:1 |
| `--sol-texto` | iconos y textos pequeños de Andrés; borde de los rellenos amarillos | `#7A5A00`: 5,9:1 sobre fondo; 6,4:1 sobre tarjeta | `#F5C431`: 11,4:1 |
| `--sol-suave` | fondo de la burbuja de Andrés | `#FFF3C4`: tinta encima 15,7:1 | `#2A2410`: tinta encima 13,2:1 |
| `--aviso` | errores de formulario | `#B3261E`: 6,0:1 | `#FF8A80`: 8,2:1 |
| `--linea` | bordes y separadores (decorativos) | `#D3DBE5` | `#26324A` |
| `--celula-suave` | bloques destacados (precios, ayudas) | `#E4ECF8`: tinta encima 14,7:1 | `#17233C`: 13,3:1 |

**Reglas:**
- Sin degradados ni brillos de «energía». Sombras mínimas.
- Esquinas de 8 px, más rectas que en Herencias, como el marco de un panel.
- Un único detalle gráfico propio: una **rejilla fina de líneas** como la de las células del panel. Va en `--linea`, de 1 px y al 40 % de opacidad, solo detrás de la portada y del bloque de precios.
- Las cifras de ahorro van en `--tinta` y en peso 700, nunca en verde de «dinero».

### 3.2 Tipografía (Google Fonts, licencia SIL Open Font License)
- **Titulares: Red Hat Display** (700; 600 para subtítulos). Grotesca geométrica con carácter técnico pero cálida; no es la Inter ni la Montserrat de siempre.
- **Texto e interfaz: Red Hat Text** (400/500/700). Hermana de la anterior, diseñada para tamaños pequeños; números claros para precios y kWh.
- No repite tipografías de las otras webs de la fábrica: Atkinson, Archivo, Schibsted, Bricolage y Barlow ya están usadas.
- **Tamaños en móvil:**
  - cuerpo de 18 px con interlineado 1,55;
  - titular de 32-36 px;
  - cifras de precio de 28 px;
  - botones de 18 px, con altura mínima de 52 px.
- Cifras con `font-variant-numeric: tabular-nums` en las tablas.
- Alojar las fuentes en la propia web (woff2 recortado al español), sin llamadas a Google.

### 3.3 Tono de las fotos
- **Luz:** sol alto y duro, de día despejado; sombras nítidas. Nada de atardeceres dorados en las fotos de producto (sí vale en la imagen para compartir, que es de Granada).
- **Contenido:**
  - tejados de teja árabe, azoteas, manos con guantes montando, perfiles de aluminio;
  - instaladores con casco y de espaldas o concentrados en el trabajo, nunca posando ni mirando a cámara;
  - el cargador conectado al coche, en plano corto.
- **Prohibido:**
  - huertos solares de campo (no es lo que vendemos);
  - aerogeneradores;
  - hojas verdes en la mano;
  - bombillas;
  - casas de estilo americano con piscina;
  - logotipos de coches o de fabricantes;
  - matrículas o enchufes extranjeros visibles.
- **Tratamiento uniforme:** temperatura ligeramente fría (−200 K), saturación −10 % y recorte 4:3 en escritorio y 4:5 en móvil.
- **Regla:** nunca presentar las fotos de banco como «nuestro equipo» ni «nuestras instalaciones». Cuando haya trabajos reales en Granada, sustituir con fotos propias (con permiso del cliente).

### 3.4 Tono de los textos
- **Persona:** de tú, cercano y concreto, como un buen técnico de pueblo: «Mira tu factura: ¿cuánto pagas al mes?».
- **Cifras siempre con unidad y con «orientativo»:** «unas 8 placas (3,6 kWp)», «entre 5.500 y 7.000 € con IVA».
- **Explicar cada término la primera vez:** kWp («la potencia de las placas»), excedentes («la luz que te sobra y vuelve a la red»), inversor («el aparato que convierte la luz de las placas en luz de casa»).
- **Prohibido:**
  - «factura cero», «ahorra el 100 %», «gratis» (salvo «estudio gratuito»);
  - emojis y signos de exclamación en serie;
  - anglicismos («lead», «smart», «checklist»).

### 3.5 Estructura de la página (móvil, en este orden)
1. **Barra superior fina:** marca, «Granada» y botón de llamar.
2. **Portada:**
   - foto de un panel sobre teja árabe;
   - titular, subtítulo y botón principal «Calcular mi ahorro con Andrés»;
   - botón secundario «Pedir estudio gratuito»;
   - tres datos de confianza en una línea: «Empresa instaladora autorizada (n.º ____) · Estudio y visita gratis · Presupuesto cerrado por escrito».
3. **«¿Dónde quieres las placas?»:** tres tarjetas grandes (Mi casa · Mi comunidad · Mi negocio) y debajo la lista de situaciones (3.6). Cada una abre a Andrés con el contexto cargado.
4. **«Cuánto podrías ahorrar»:**
   - una mini-calculadora de un solo dato (cuánto pagas de luz al mes);
   - devuelve un rango de placas, de precio y de ahorro anual;
   - va marcada como orientativa y lleva un botón para afinarla con Andrés.
5. **Cómo funciona** (3 pasos).
6. **Precios orientativos** (tabla, 3.6).
7. **Ayudas vigentes** (Junta, IRPF, IBI/ICIO de tu municipio), con fecha de revisión y enlaces oficiales.
8. **Garantías y quién responde:** placas, inversor, batería, mano de obra; seguro de responsabilidad civil; registro de instalador.
9. **Extras:** batería y cargador del coche (foto del cargador).
10. **Quién instala:** empresa real, dirección, foto del equipo real (cuando exista) y zona de servicio (lista de comarcas: Vega, Costa, Alpujarra, Poniente, Altiplano, Marquesado…).
11. **Opiniones:** reseñas de Google enlazadas a la ficha, sin estrellas inventadas y sin fotos de banco al lado.
12. **Preguntas frecuentes**, con la fecha de revisión.
13. **Qué tienes que preparar** (lista, 3.6).
14. **Contacto y pie:** aviso legal, privacidad y aviso de que Andrés orienta y el precio final sale del estudio.
15. **Capa de conversación con Andrés** (como `#conv` en Reparo y Herencias), con la solicitud rellenándose a la vista.

### 3.6 Textos propuestos

**Titular:** «Placas solares en tu tejado, con las cuentas claras desde el principio.»
- Alternativa: «Produce tu propia luz en Granada. Te decimos cuánto ahorras antes de firmar nada.»

**Subtítulo:** «Cuéntale a Andrés cuánto pagas de luz: en un minuto te dice cuántas placas te harían falta, cuánto costarían y cuánto ahorrarías. Si te encaja, te reserva el estudio gratuito en tu casa, comunidad o negocio.»

**Botones:** «Calcular mi ahorro con Andrés» · «Pedir estudio gratuito»

**Situaciones (formato de la lista `SITUACIONES` de herencias/index.html: id, nombre, frase del cliente):**
```js
const SITUACIONES = [
  ["casa", "Placas para mi casa", "Quiero poner placas solares en mi casa: ¿cuántas me harían falta?"],
  ["factura", "Pago mucho de luz", "Pago mucho de luz al mes, ¿me compensan las placas?"],
  ["comunidad", "Comunidad de vecinos", "Somos una comunidad de vecinos y queremos poner placas en la azotea"],
  ["negocio", "Negocio o nave", "Tengo un negocio y quiero bajar la factura de la luz con placas"],
  ["bateria", "Añadir batería", "Ya tengo placas y quiero saber si me compensa añadir una batería"],
  ["coche", "Cargador de coche eléctrico", "Quiero un cargador para el coche eléctrico, y si puede ser con placas"],
  ["ayudas", "Ayudas y deducciones", "¿Qué ayudas o deducciones hay ahora para poner placas en Granada?"],
  ["revision", "Revisar mi instalación", "Tengo placas pero producen poco o el inversor da error"]
];
```

**Cómo funciona (3 pasos):**
1. **Hablas con Andrés (1 minuto).** Le dices cuánto pagas de luz y dónde irían las placas. Te da un tamaño y un precio orientativos al momento.
2. **Visita y estudio gratis.** Un técnico va a tu tejado, mide, comprueba orientación, sombras y cuadro eléctrico, y te entrega por escrito cuántas placas, dónde, cuánto cuesta y cuánto ahorrarás.
3. **Instalamos y lo legalizamos todo.** Montaje en uno o dos días en una vivienda. Nosotros tramitamos el boletín, el registro de autoconsumo, la compensación de excedentes y, si procede, la ayuda.

Los plazos de montaje y de trámites los confirma la empresa (verificar).

**Precios orientativos (IVA incluido, instalación y legalización incluidas; el precio final sale del estudio):**

| Para quién | Tamaño típico | Precio orientativo | Base |
|---|---|---|---|
| Vivienda con consumo bajo (factura de 40-70 €/mes) | 4-6 placas (2-3 kWp) | 4.200 € – 5.500 € | Selectra, Tarifasgasluz |
| Vivienda con consumo medio-alto (70-150 €/mes) | 8-10 placas (4-5 kWp) | 5.500 € – 8.000 € | Selectra (10 placas desde 7.200 €), Tarifasgasluz (4.000-8.500 €) |
| Pequeño negocio | 12-15 placas (6-8 kWp) | desde 8.100 € | Selectra pymes |
| Comunidad de vecinos | según azotea y número de vecinos | tras el estudio (sin dato con fuente) | IDAE |
| Batería (unos 5 kWh) | — | + 3.000 € – 5.000 € | Ecosistemas Startup, 1KOMMA5° |
| Cargador de coche (unifamiliar) | — | 800 € – 1.700 € | movilidadelectrica.com, Autofácil |

La columna de tamaño típico es una estimación propia. **Las cifras de la tabla son de mercado, no de esta empresa:** antes de publicarlas, el instalador debe confirmar sus propios precios.

**Ejemplo de ahorro para Andrés** (estimación propia; mostrarla como «ejemplo», no como promesa):
- Una casa que gasta 4.000 kWh al año pone 3 kWp, que producen unos 4.500 kWh (1.500 por kWp).
- Si usa directamente el 40-50 % de esa producción, ahorra unos 1.800-2.200 kWh a 0,20 € = **360-440 €**.
- El resto lo vierte a la red y se compensa a unos 0,06 € = **140-160 €**.
- Total: **unos 500-600 € al año**. Con una inversión de 4.500-5.500 €, se recupera en unos 8-10 años sin ayudas, y antes con ellas.
- Selectra da 6-7 años para Granada. Es mejor dar un rango y explicarlo.

**Seis preguntas frecuentes (borrador; el instalador debe revisarlas y fecharlas):**
1. **¿Cuánto cuesta poner placas en una casa?**
   Una vivienda normal en Granada suele estar entre 4.200 y 8.000 € con IVA, según el número de placas ([Selectra](https://selectra.es/autoconsumo/info/instalacion), [Tarifasgasluz](https://tarifasgasluz.com/autoconsumo/instalacion)). Andrés te da un rango para tu caso, y el precio cerrado te lo damos por escrito tras la visita gratuita.
2. **¿En cuánto tiempo se recupera el dinero?**
   Depende de cuánta luz gastes de día y de lo que te paguen por la que sobra. En Granada, con más de 3.200 horas de sol al año, se habla de 6 a 7 años ([Selectra](https://selectra.es/autoconsumo/normativa/subvenciones/andalucia)). En el estudio te enseñamos el cálculo con tu factura.
3. **¿Hay ayudas ahora mismo?**
   La Junta de Andalucía abrió en octubre de 2026 ayudas para autoconsumo, con más apoyo si añades batería, hasta septiembre de 2027 o hasta que se acabe el dinero ([energias-renovables.com](https://www.energias-renovables.com/autoconsumo/andaluc-a-abre-las-solicitudes-de-ayudas-20261022)). También puede haber deducción en la Renta si terminas la instalación en 2026 ([AEAT](https://sede.agenciatributaria.gob.es/Sede/irpf/novedades-impuesto/novedades-normativa-2026/principales-novedades-tributarias-introducidas-real-marzo.html)). Te decimos cuáles te corresponden y te ayudamos a pedirlas. (verificar los porcentajes antes de publicar)
4. **¿Me hace falta batería?**
   No siempre. Sin batería aprovechas la luz mientras hay sol y lo que sobra se descuenta de tu factura. La batería compensa si gastas mucho por la noche: añade unos 3.000-5.000 € ([Ecosistemas Startup](https://ecosistemastartup.com/?p=78401)). Andrés te pregunta tus horarios y te dice si te sale a cuenta.
5. **Vivo en un piso. ¿Podemos poner placas en la comunidad?**
   Sí. Se aprueba en la junta de propietarios y la luz se reparte entre los vecinos que participen según unos porcentajes acordados ([guía IDAE](https://www.idae.es/sites/default/files/documentos/publicaciones_idae/NIPO_629-24-001-9_GUIA_05_PASOS-AUTOCONSUMO-COMUNIDADES-PROPIETARIOS_actualizado.pdf)). Preparamos el estudio para presentarlo en la junta.
6. **¿Andrés es un técnico?**
   No. Andrés es un asistente con inteligencia artificial que te orienta con cifras de mercado y recoge tus datos para que no tengas que repetirlos. El tamaño y el precio definitivos los decide un técnico de la empresa tras ver tu tejado.

**Campos de la solicitud (lo que Andrés apunta):**
- **Siempre:**
  - nombre;
  - teléfono;
  - municipio (y barrio o pedanía);
  - tipo (casa / comunidad / negocio);
  - qué quiere (placas, batería, cargador, revisión);
  - mejor hora para llamar o visitar;
  - consentimiento de privacidad.
- **Consumo:**
  - cuánto paga de luz al mes, aproximadamente;
  - consumo anual en kWh (si lo tiene en la factura);
  - potencia contratada;
  - compañía y tarifa (fija o PVPC);
  - ¿gasta más de día o de noche?;
  - ¿tiene o piensa tener aire acondicionado, aerotermia o coche eléctrico?
- **Tejado:**
  - tipo (teja, chapa, azotea plana, suelo o pérgola);
  - orientación aproximada (sur / este-oeste / no sé);
  - sombras (árboles, edificios, chimeneas);
  - metros disponibles, aproximadamente;
  - altura o número de plantas;
  - ¿está en zona protegida o en un casco histórico? (Albaicín, Realejo, centros históricos: puede pedir permisos especiales).
- **Instalación eléctrica:**
  - monofásica o trifásica (si lo sabe);
  - antigüedad del cuadro.
- **Extras:**
  - para el cargador, distancia del cuadro al garaje (en metros) y si el garaje es privado o comunitario;
  - para la batería, si quiere tener luz cuando se corta la red.
- **Comunidad:**
  - número de viviendas;
  - ¿hay acuerdo o fecha de junta?;
  - datos del administrador.
- **Negocio:**
  - actividad;
  - horario de apertura;
  - factura media mensual;
  - ¿nave propia o alquilada?
- **Ayudas:** ¿vivienda habitual? ¿Le interesa tramitar ayuda o deducción?

**Lo que el cliente debe preparar para el estudio:**
1. Una **factura de la luz reciente** (mejor si trae el gráfico de consumo de 12 meses), o foto de las páginas donde salen el CUPS, la potencia y los kWh.
2. **Fotos del tejado o azotea** desde varios ángulos y, si se puede, una desde la calle. Una foto de satélite (Google Maps) también ayuda.
3. **Foto del cuadro eléctrico** (con la tapa abierta) y **del contador**.
4. **Referencia catastral** de la vivienda o nave (sale en el recibo del IBI).
5. Para el **cargador**: foto del garaje y del recorrido aproximado hasta el cuadro.
6. Para **comunidades**: número de viviendas, contacto del administrador y fecha de la próxima junta (o acta si ya se habló del tema).
7. Para **negocios**: CIF, horario de actividad y, si la hay, la factura con la tarifa 3.0TD o 6.1TD.
8. Si quiere **ayudas o deducción**: DNI del titular, e indicar si es vivienda habitual.

---

## 4. Fotos (Pexels)

**Descargadas, revisadas una a una y comprimidas** en `/home/user/viajai/placas-solares/media/`. Detalle y licencia en `media/CREDITOS.md`.

| Archivo | Id Pexels | Tamaño | Peso | Qué se ve | Uso |
|---|---|---|---|---|---|
| portada.jpg | 9875439 | 1440×1080 | 250 KB | Panel apoyado en un tejado de teja árabe, con jardín al fondo y sol de mediodía | Portada |
| instalacion.jpg | 8853502 | 1400×935 | 176 KB | Instalador con casco de espaldas fijando perfiles sobre una fila de paneles en una azotea | «Cómo funciona», paso 3 |
| montaje.jpg | 9875413 | 1400×1050 | 193 KB | Manos con guantes colocando un panel sobre teja árabe | Bloque «Garantías» o «Quién instala» |
| cargador.jpg | 9800009 (recortada) | 1000×1250 | 92 KB | Conector de carga enchufado al coche, en plano corto. **He recortado la parte izquierda para quitar la marca del coche** | Bloque «Extras» |
| compartir.jpg | 21294775 (recortada) | 1200×630 | 62 KB | Silueta de Granada al amanecer o atardecer con iglesia y caserío | Imagen al compartir el enlace |

**Avisos:**
- Los paneles de portada y montaje llevan una pegatina del fabricante ilegible a ese tamaño. Comprobado en el original: no se lee.
- En la serie 9875xxx el panel parece de kit pequeño, sin estructura. Vale como ambiente; cuando haya fotos de trabajos propios en Granada, sustituirlas.
- La del cargador es en un aparcamiento, no en una casa: no presentarla como «instalación en vivienda».
- Las fotos con huertos solares, aerogeneradores o casas americanas con piscina se descartaron, igual que la carpa solar con un coche de marca visible (9800029).
