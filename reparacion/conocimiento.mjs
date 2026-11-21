// GENERADO por construir-manual.mjs a partir de conocimiento/*.json. No editar a mano.
export default {
 "generado": "2026-11-21",
 "familias": [
  {
   "familia": "BSH",
   "marcas": [
    "Bosch",
    "Balay",
    "Siemens",
    "Neff"
   ],
   "notas": "Bosch, Balay, Siemens y Neff son del grupo BSH y comparten electrónica: el mismo código significa lo mismo en las cuatro marcas (OCU lo indica expresamente para las lavadoras Balay, Bosch y Siemens), aunque puede variar según la generación o el modelo. En muchos modelos la letra E y la F son equivalentes (E18 = F18, E24 = F24); a veces aparecen con dos puntos (E:18) o con un subcódigo (E:36-10). En algunas lavadoras Bosch el mismo fallo sale con otro formato (por ejemplo F18 = d02). OJO: el mismo número no significa lo mismo en distintos aparatos (E23 en lavadora = Aquastop activado; E23 en lavavajillas = fallo de la bomba de desagüe; E18 en lavadora = no desagua; E18 en lavavajillas = manguera de entrada retorcida). Pregunta siempre qué aparato es y el número E-Nr de la placa de características (en la lavadora y el lavavajillas, en el marco de la puerta; en el frigorífico, dentro). La lavadora-secadora usa los mismos códigos de lavado que la lavadora. Recomendación oficial para cualquier código no listado: apagar el aparato, esperar al menos 5 segundos (Bosch EE. UU. dice 30 segundos cortando el diferencial) y volver a encender; si vuelve a salir, Bosch España dice que el resto de códigos son fallos electrónicos que debe resolver un técnico. En las placas de inducción algunos modelos muestran solo una 'E' y, al mantener pulsado el sensor de la zona, sale el código largo (p. ej. E0111) que hay que buscar en el manual del modelo. Una placa que enciende los mandos pero no calienta puede estar en modo demostración. Los manuales de usuario de BSH no suelen traer la tabla de códigos de servicio (E63 y similares de secadora); esos solo vienen en la documentación técnica. No se encontraron fuentes fiables con códigos de campana extractora ni de Pitsos. Seguridad: en E15 y E23 (Aquastop o agua en la base) cerrar el grifo y desenchufar ya; al vaciar la bomba el agua puede salir muy caliente.",
   "codigos": [
    {
     "aparato": "lavadora",
     "codigos": [
      "E17",
      "F17",
      "F29"
     ],
     "significado": "Se ha superado el tiempo de llenado: no entra agua suficiente.",
     "causas": [
      "Grifo cerrado o medio cerrado, o falta de agua en casa",
      "Filtro de la toma de agua o de la manguera Aquastop obstruido",
      "Manguera de entrada doblada",
      "Presión de agua demasiado baja",
      "Electroválvula de entrada o presostato averiados (si lo anterior está bien)"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que hay agua en casa y que el grifo está abierto del todo; revisar que la manguera de entrada no está doblada. Bosch indica que el grifo abierto debe dar unos 10 litros por minuto (prueba: llenar un cubo). Después apagar, esperar y volver a encender.",
     "pieza_probable": "Electroválvula de entrada; filtro de entrada o manguera Aquastop",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/error-e17-o-f17-lavadora",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E18",
      "F18",
      "d02"
     ],
     "significado": "La lavadora no desagua: se ha superado el tiempo de vaciado.",
     "causas": [
      "Filtro de la bomba de desagüe obstruido (monedas, pelusa, objetos)",
      "Manguera de desagüe doblada, retorcida u obstruida",
      "Bomba de desagüe bloqueada o averiada"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que la manguera de desagüe no está doblada ni aplastada detrás de la lavadora. Si sabe hacerlo y el manual lo explica, apagar, desenchufar, cerrar el grifo y limpiar el filtro de la bomba (tapa abajo delante) con un recipiente y una toalla; el agua puede estar caliente.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.siemens-home.bsh-group.com/es/servicio-oficial/asistencia-y-consejos/resolucion-de-problemas/lavadoras/codigos-error-e18-f18",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E23",
      "F23"
     ],
     "significado": "Aquastop activado: la lavadora ha detectado agua en la base (fuga).",
     "causas": [
      "Fuga interna (manguitos, juntas, cuba, bomba)",
      "Cajetín del detergente mal colocado o con exceso de espuma",
      "Manguera de entrada dañada",
      "Sensor (flotador) del Aquastop averiado"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo de inmediato y desenchufar. Mirar si hay agua debajo de la lavadora. Bosch indica que el usuario no puede resolverlo: hay que pedir técnico.",
     "pieza_probable": "Depende del origen de la fuga (manguito, junta, bomba); manguera Aquastop",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/error-e23-o-f23-lavadora",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E16",
      "F16",
      "E34",
      "F34"
     ],
     "significado": "La puerta no se ha bloqueado bien.",
     "causas": [
      "Puerta mal cerrada",
      "Ropa u objeto atrapado entre la puerta y la carcasa",
      "Cierre de puerta (blocapuertas) averiado si se repite"
     ],
     "que_puede_hacer_el_cliente": "Cerrar la puerta con firmeza hasta oír el clic, comprobar que no hay ropa pillada en la goma y volver a iniciar el programa.",
     "pieza_probable": "Blocapuertas (cierre electromagnético de la puerta)",
     "fuente": "https://bosch-home.com/us/owner-support/error-codes/washers",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E36",
      "E:36-10"
     ],
     "significado": "Problema de desagüe (según Bosch EE. UU.).",
     "causas": [
      "Tubo de desagüe o manguera de salida obstruidos",
      "Bomba de desagüe bloqueada"
     ],
     "que_puede_hacer_el_cliente": "Revisar que la manguera de desagüe no está obstruida ni doblada; limpiar el filtro de la bomba si el manual lo indica.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://bosch-home.com/us/owner-support/error-codes/washers",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E21",
      "F21"
     ],
     "significado": "El tambor no gira: motor bloqueado o tambor atascado.",
     "causas": [
      "Objeto atascado entre tambor y cuba",
      "Sobrecarga de ropa",
      "Escobillas o motor averiados",
      "Tacogenerador averiado",
      "Fallo del módulo de control del motor"
     ],
     "que_puede_hacer_el_cliente": "Apagar y desenchufar; con la lavadora vacía, comprobar si el tambor gira a mano. No sobrecargar. Si sigue, pedir técnico (Bosch: si el tambor no gira, hace falta técnico).",
     "pieza_probable": "Escobillas o motor; tacogenerador",
     "fuente": "https://ocu.org/electrodomesticos/lavadora/consejos/codigos-error-lavadoras",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E32",
      "F32"
     ],
     "significado": "Sensor de carga defectuoso (según la tabla de OCU para Balay, Bosch y Siemens).",
     "causas": [
      "Sensor de carga o de nivel averiado",
      "Conexión del sensor"
     ],
     "que_puede_hacer_el_cliente": "Apagar, esperar y volver a encender; si persiste, técnico.",
     "pieza_probable": "",
     "fuente": "https://ocu.org/electrodomesticos/lavadora/consejos/codigos-error-lavadoras",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E15",
      "F15"
     ],
     "significado": "Protección antifugas (Aquastop) activada: hay agua en la bandeja de la base.",
     "causas": [
      "Fuga interna (manguito, bomba, junta, depósito de sal mal cerrado)",
      "Exceso de espuma por usar lavavajillas a mano o demasiado detergente",
      "Flotador de la base atascado"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo y desenchufar. Bosch España recomienda no intentar arreglarlo en casa por seguridad: pedir técnico. Preguntar si se ha usado jabón de fregar a mano.",
     "pieza_probable": "Depende del origen de la fuga; manguera Aquastop",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/error-e15-en-el-lavavajillas",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E24",
      "F24"
     ],
     "significado": "El agua no desagua bien.",
     "causas": [
      "Manguera de desagüe doblada u obstruida",
      "Sifón o conexión al fregadero obstruidos",
      "Filtros sucios",
      "Bomba de desagüe bloqueada"
     ],
     "que_puede_hacer_el_cliente": "Apagar y desenchufar. Comprobar que la manguera de desagüe no está doblada, limpiar los filtros del fondo y revisar la conexión al sifón. Poner un programa corto de prueba.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/error-e24-en-el-lavavajillas",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E25",
      "F25"
     ],
     "significado": "Bomba de desagüe bloqueada por un objeto o tapa de la bomba mal colocada.",
     "causas": [
      "Trozos de cristal, huesos, huesos de fruta u otros objetos en la bomba",
      "Tapa de la bomba suelta o mal colocada"
     ],
     "que_puede_hacer_el_cliente": "Apagar y desenchufar. Según Bosch: sacar los filtros, quitar la tapa de la bomba (se puede usar una cuchara), retirar objetos con cuidado de no cortarse con cristales, comprobar que la turbina gira libre y volver a montar la tapa y los filtros.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/lavavajillas-error-e25",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E22",
      "F22"
     ],
     "significado": "Filtros bloqueados.",
     "causas": [
      "Filtros sucios u obstruidos con restos de comida",
      "Filtros mal colocados",
      "Desagüe con dificultad (Bosch Francia)"
     ],
     "que_puede_hacer_el_cliente": "Apagar, sacar y limpiar los filtros bajo el grifo y volver a colocarlos bien encajados. Revisar también la manguera de desagüe.",
     "pieza_probable": "",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/error-e22-en-el-lavavajillas",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E23"
     ],
     "significado": "Fallo en la bomba de agua sucia (desagüe).",
     "causas": [
      "Bomba de desagüe averiada o desgastada",
      "Turbina de la bomba dañada u obstruida"
     ],
     "que_puede_hacer_el_cliente": "Bosch indica que solo lo puede resolver un técnico. Como mucho, comprobar que los filtros están limpios y apagar y encender.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/lavavajillas-error-e23",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E14"
     ],
     "significado": "Fallo en el sistema de filtrado o en la entrada de agua (caudalímetro).",
     "causas": [
      "Grifo de escuadra poco abierto",
      "Manguera de entrada doblada",
      "Caudalímetro averiado"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo de escuadra está abierto del todo y que la manguera de entrada no está doblada.",
     "pieza_probable": "Caudalímetro",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/error-e14-en-el-lavavajillas",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E16",
      "E17"
     ],
     "significado": "Fallo en la entrada de agua o en el sistema de filtrado; el programa se para y desagua a intervalos.",
     "causas": [
      "Grifo de escuadra con poco caudal",
      "Manguera de entrada doblada",
      "Filtro de entrada obstruido",
      "Electroválvula de entrada averiada (si se repite a menudo)"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto del todo y que la manguera de entrada no está doblada. Si se repite con frecuencia, pedir técnico.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/codigos-de-error-e16-e17-en-el-lavavajillas",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E18"
     ],
     "significado": "Manguera de suministro (entrada) retorcida o doblada.",
     "causas": [
      "Manguera de entrada con dobleces",
      "Grifo poco abierto"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que la manguera de entrada está instalada sin dobleces y que el grifo está abierto.",
     "pieza_probable": "",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/lavavajillas-error-e18",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E12"
     ],
     "significado": "Capa de cal en el sistema de calentamiento.",
     "causas": [
      "Agua dura sin sal o con la descalcificación mal ajustada",
      "Cal acumulada en la resistencia"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que hay sal regeneradora y que la dureza del agua está bien ajustada; hacer un lavado de mantenimiento con producto descalcificador para lavavajillas.",
     "pieza_probable": "",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/error-e12-en-el-lavavajillas",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E09"
     ],
     "significado": "Fallo de calentamiento (resistencia integrada en la bomba de circulación).",
     "causas": [
      "Resistencia de la bomba de calor averiada",
      "Aspiración de la bomba de circulación obstruida por suciedad"
     ],
     "que_puede_hacer_el_cliente": "Limpiar los filtros; cortar la corriente unos 30 segundos y volver a encender. Si persiste, técnico.",
     "pieza_probable": "Bomba de calor (bomba de circulación con resistencia)",
     "fuente": "https://www.bosch-home.com/us/owner-support/error-codes/dishwashers",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E01",
      "E04"
     ],
     "significado": "Fallo electrónico (circuito de la bomba de calor en la placa de control); el significado exacto varía según modelo.",
     "causas": [
      "Fallo de la placa de control",
      "Fallo del circuito de la bomba de calor o de su resistencia"
     ],
     "que_puede_hacer_el_cliente": "Cortar la corriente 30 segundos y volver a encender. Si vuelve a salir, técnico.",
     "pieza_probable": "Módulo electrónico o bomba de calor (diagnosticar antes)",
     "fuente": "https://www.bosch-home.com/us/owner-support/error-codes/dishwashers",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "E01",
      "E02"
     ],
     "significado": "Filtro de pelusas bloqueado.",
     "causas": [
      "Pelusa acumulada en el filtro",
      "Restos de suavizante que tapan el filtro",
      "Si persiste tras limpiar: sensor de humedad o paso de aire obstruido"
     ],
     "que_puede_hacer_el_cliente": "Sacar y limpiar el filtro de pelusas (lavarlo con agua si tiene restos de suavizante y dejarlo secar). Bosch recomienda limpiarlo tras cada secado.",
     "pieza_probable": "",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/secadora-codigos-error",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "E03"
     ],
     "significado": "Tubo de desagüe del agua de condensación obstruido o retorcido.",
     "causas": [
      "Tubo de desagüe doblado",
      "Tubo o válvula del sifón obstruidos"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el tubo está bien instalado y sin dobleces; soltar la abrazadera del sifón, retirar el tubo y limpiar el tubo y la válvula del sifón. Si no tiene desagüe conectado, vaciar el depósito de agua tras cada secado.",
     "pieza_probable": "Bomba de condensados (si no se resuelve limpiando)",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/secadora-codigos-error",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "E06"
     ],
     "significado": "Fallo en el circuito de calefacción.",
     "causas": [
      "Resistencia o circuito de calefacción averiados"
     ],
     "que_puede_hacer_el_cliente": "Bosch indica que solo lo puede reparar un técnico. Limpiar filtros y apagar y encender no resuelve una avería real.",
     "pieza_probable": "Resistencia de calefacción",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/secadora-codigos-error",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "E08",
      "E09",
      "E24",
      "E25",
      "E28",
      "E90"
     ],
     "significado": "Fallo en el sistema eléctrico o en la electrónica.",
     "causas": [
      "Avería de la electrónica de control o de potencia",
      "Conexiones o sensores"
     ],
     "que_puede_hacer_el_cliente": "Apagar, esperar y volver a encender. Si sigue, técnico (Bosch indica que solo lo resuelve un técnico experimentado).",
     "pieza_probable": "Diagnosticar antes; posible módulo electrónico",
     "fuente": "https://www.bosch-home.es/servicio-oficial/garantias-y-asistencia/secadora-codigos-error",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "E63",
      "E:63"
     ],
     "significado": "Error de comunicación entre la electrónica de potencia y el módulo de control (código de servicio, no viene en el manual de usuario).",
     "causas": [
      "Conector entre placas flojo o dañado (el caso más habitual según Fersay)",
      "Una de las dos placas averiada",
      "Codificación incorrecta del módulo"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar unos minutos y volver a encender. Si persiste, técnico.",
     "pieza_probable": "Revisar primero el conector entre placas; después módulo de potencia o de control",
     "fuente": "https://www.fersay.com/blog/codigos-de-error-secadoras-guia-marca-por-marca/",
     "confianza": "media"
    },
    {
     "aparato": "horno",
     "codigos": [
      "E011"
     ],
     "significado": "Tecla pulsada demasiado tiempo o atascada (fallo de un sensor táctil del panel).",
     "causas": [
      "Suciedad, grasa o humedad en el panel de mandos",
      "Tecla atascada",
      "Sensor táctil o placa de mandos averiados"
     ],
     "que_puede_hacer_el_cliente": "Limpiar y secar bien el panel de mandos, pulsar las teclas una a una y desconectar el horno de la corriente un minuto.",
     "pieza_probable": "Módulo de mandos (panel táctil)",
     "fuente": "https://media3.bsh-group.com/Documents/8001327827_C.pdf",
     "confianza": "media"
    },
    {
     "aparato": "horno",
     "codigos": [
      "E115"
     ],
     "significado": "Temperatura demasiado alta dentro del horno; la puerta puede quedarse bloqueada.",
     "causas": [
      "Sobrecalentamiento del compartimento",
      "Ventilador de refrigeración que no funciona",
      "Sonda de temperatura o electrónica averiadas si se repite"
     ],
     "que_puede_hacer_el_cliente": "Apagar el horno y dejarlo enfriar al menos 30 minutos antes de volver a usarlo. Si se repite, técnico.",
     "pieza_probable": "Ventilador de refrigeración o sonda de temperatura (diagnosticar)",
     "fuente": "https://www.coolblue.nl/en/advice/how-do-you-solve-error-codes-of-siemens-and-bosch-ovens.html",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "F2",
      "F4"
     ],
     "significado": "La electrónica de la placa se ha sobrecalentado y ha apagado la zona de cocción.",
     "causas": [
      "Uso intenso prolongado a potencia máxima",
      "Mala ventilación bajo la placa (mueble u horno debajo)",
      "Ventilador de la placa averiado si se repite"
     ],
     "que_puede_hacer_el_cliente": "Esperar a que la electrónica se enfríe y volver a encender la zona. Comprobar que no hay objetos que tapen la ventilación del mueble bajo la placa. Si se repite, técnico.",
     "pieza_probable": "Ventilador de la placa",
     "fuente": "https://www.bosch-home.com/us/owner-support/get-support/support-selfhelp-induction-cooktop-error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "F5"
     ],
     "significado": "Recipiente caliente cerca del panel de mandos (F5 parpadea alternando con el nivel de potencia y suena un pitido).",
     "causas": [
      "Olla o sartén apoyada sobre o junto a los mandos"
     ],
     "que_puede_hacer_el_cliente": "Retirar el recipiente de la zona de mandos y dejar que se enfríe.",
     "pieza_probable": "",
     "fuente": "https://www.bosch-home.com/us/owner-support/get-support/support-selfhelp-induction-cooktop-error-codes",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E9000",
      "E9010"
     ],
     "significado": "Tensión de alimentación incorrecta, fuera del rango normal.",
     "causas": [
      "Tensión de red fuera de rango",
      "Conexión eléctrica de la placa incorrecta"
     ],
     "que_puede_hacer_el_cliente": "Desconectar la placa del diferencial o del automático, esperar y volver a conectar. Si sigue, técnico o electricista.",
     "pieza_probable": "",
     "fuente": "https://www.bosch-home.com/us/owner-support/get-support/support-selfhelp-induction-cooktop-error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "U400"
     ],
     "significado": "Placa mal conectada o tensión de alimentación demasiado alta (alarma de sobretensión).",
     "causas": [
      "Conexión eléctrica incorrecta (esquema de conexión del manual)",
      "Tensión de red por encima de lo admitido"
     ],
     "que_puede_hacer_el_cliente": "Desconectar del automático y avisar al técnico; no manipular la conexión.",
     "pieza_probable": "",
     "fuente": "https://www.yoreparo.com/es/electrodomesticos/hornos/preguntas/1444551/balay-3et900x-01-alarma-por-sobretension",
     "confianza": "media"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "Alarma de temperatura"
     ],
     "significado": "Pitido y temperatura parpadeando: el compartimento (normalmente el congelador) está demasiado caliente.",
     "causas": [
      "Puesta en marcha reciente",
      "Se han metido muchos alimentos frescos de golpe",
      "Puerta del congelador abierta mucho tiempo o mal cerrada",
      "Si no se recupera: fallo de frío (sonda, condensador, compresor)"
     ],
     "que_puede_hacer_el_cliente": "Pulsar el botón de alarma para silenciar, comprobar que las puertas cierran bien y esperar unas horas a que recupere temperatura sin abrir. Si no baja, técnico.",
     "pieza_probable": "",
     "fuente": "https://media3.bosch-home.com/Documents/8001162009/es-ES/1824354671034271755.html",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "Alarma de puerta"
     ],
     "significado": "La puerta lleva demasiado tiempo abierta o no está bien cerrada.",
     "causas": [
      "Puerta abierta o entreabierta",
      "Alimentos o bandejas que impiden cerrar",
      "Junta de la puerta deformada"
     ],
     "que_puede_hacer_el_cliente": "Cerrar bien la puerta, recolocar lo que la estorbe y pulsar el botón de alarma para silenciarla.",
     "pieza_probable": "Junta de puerta (si no cierra bien)",
     "fuente": "https://www.siemens-home.bsh-group.com/es/inspiracion/blog/alarma-frigorifico",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "E",
      "d"
     ],
     "significado": "Una 'E' o una 'd' en el indicador de temperatura: el autodiagnóstico ha detectado un fallo electrónico (el código exacto depende del modelo).",
     "causas": [
      "Sonda de temperatura averiada",
      "Fallo de la electrónica",
      "Otros fallos del sistema de frío"
     ],
     "que_puede_hacer_el_cliente": "Apagar y volver a encender (o desenchufar unos 5 minutos) y ver si el código vuelve; anotar el código completo y el E-Nr de la placa interior.",
     "pieza_probable": "Diagnosticar; posible sonda de temperatura o módulo electrónico",
     "fuente": "https://www.bosch-home.fr/nos-services/aide-en-ligne/assistance-refrigerateur-congelateur/panne-frigo/code-erreur-frigo/e-ou-d",
     "confianza": "media"
    }
   ]
  }
 ],
 "sintomas": [],
 "peligro": [],
 "compensa_reparar": ""
};
