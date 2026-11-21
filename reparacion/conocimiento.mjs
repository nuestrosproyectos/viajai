// GENERADO por construir-manual.mjs a partir de conocimiento/*.json. No editar a mano.
export default {
 "generado": "2026-11-21",
 "familias": [
  {
   "familia": "Beko",
   "marcas": [
    "Beko",
    "Grundig"
   ],
   "notas": "Beko y Grundig pertenecen al grupo turco Arçelik (hoy Beko Europe en Europa) y comparten plataforma de fabricación; es probable que muchos códigos coincidan, pero no se ha encontrado una fuente que lo confirme, así que en Grundig hay que verificar con el manual del modelo. Los códigos de Beko cambian mucho según la serie y el año: el mismo código (p. ej. E02 en lavadora) significa cosas distintas según el modelo, así que conviene pedir siempre el modelo exacto (etiqueta en el marco de la puerta en lavadoras y en el lateral interior de la puerta en lavavajillas). En lavavajillas el código puede salir como 'E:01' o como un icono que parpadea (p. ej. P1). Los códigos H (H1, H5...) de lavadora son de diagnóstico y normalmente solo se ven en el modo de servicio, no los ve el cliente en uso normal. Las secadoras Beko de consumo suelen avisar con iconos (depósito, filtro, condensador) en lugar de códigos numéricos.",
   "codigos": [
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E:01",
      "E01",
      "P1"
     ],
     "significado": "Desbordamiento: el lavavajillas ha detectado demasiada agua o una fuga en algún componente.",
     "causas": [
      "fuga interna que activa el sistema antidesbordamiento",
      "exceso de espuma por usar detergente inadecuado",
      "fallo de la electroválvula de entrada o del flotador"
     ],
     "que_puede_hacer_el_cliente": "Dejar que la máquina intente vaciarse sola; si el aviso desaparece, el problema está resuelto. Si no se apaga, cerrar el grifo, desenchufar y llamar al servicio técnico.",
     "pieza_probable": "electroválvula de entrada, flotador/microinterruptor antidesbordamiento",
     "fuente": "https://www.beko.com/content/dam/spain-es-aem/spain-es-aemProductCatalog/product-documents/7656453977-DIN28423/es-ES-7656453977-20171009121131-User-Manual---Filees-ES.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E:02",
      "E02"
     ],
     "significado": "Corte de agua: no entra agua en la máquina.",
     "causas": [
      "grifo cerrado o suministro de agua cortado",
      "manguera de entrada doblada",
      "filtro de entrada obstruido"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto y hay agua en casa, y que la manguera no está doblada. El programa se reanuda solo cuando vuelve el agua.",
     "pieza_probable": "electroválvula de entrada",
     "fuente": "https://www.beko.com/content/dam/spain-es-aem/spain-es-aemProductCatalog/product-documents/7656453977-DIN28423/es-ES-7656453977-20171009121131-User-Manual---Filees-ES.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E05"
     ],
     "significado": "Sonda de temperatura (NTC) en circuito abierto, según documentación de servicio; no figura en el manual de usuario.",
     "causas": [
      "sonda NTC averiada",
      "conector o cableado de la sonda suelto"
     ],
     "que_puede_hacer_el_cliente": "Apagar y desenchufar un minuto y volver a probar; si se repite, llamar al servicio técnico.",
     "pieza_probable": "sonda NTC de temperatura",
     "fuente": "https://www.fersay.com/blog/codigos-error-lavavajillas-segun-tu-marca/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E06",
      "E07"
     ],
     "significado": "Fallo de lectura de temperatura (sonda en cortocircuito o lectura incorrecta); en muchos modelos son variantes del mismo fallo de termometría.",
     "causas": [
      "sonda NTC en cortocircuito",
      "cableado o conector de la sonda dañado",
      "fallo de la placa electrónica"
     ],
     "que_puede_hacer_el_cliente": "Apagar y desenchufar un minuto y volver a probar; si se repite, llamar al servicio técnico.",
     "pieza_probable": "sonda NTC de temperatura",
     "fuente": "https://codigodeerror.com/electrodomestico/lavavajillas/error-e06-e07-lavavajillas-beko/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E5"
     ],
     "significado": "En algunos modelos indica que la lavadora no desagua porque el filtro de la bomba puede estar obstruido.",
     "causas": [
      "filtro de la bomba obstruido",
      "manguera de desagüe doblada o atascada",
      "bomba de desagüe averiada"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar, vaciar el agua con el tubo de emergencia y limpiar el filtro de la bomba (tapa frontal inferior), como indica el manual. Revisar que la manguera de desagüe no esté doblada.",
     "pieza_probable": "bomba de desagüe",
     "fuente": "https://www.beko.com/content/dam/spain-es-aem/spain-es-aemProductCatalog/product-documents/7004440019-BM3WFSU38213/es-ES-7004440019-202406271707826-User-Manual---File-Longpt-PT.pdf",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E1"
     ],
     "significado": "En lavadoras de carga superior serie WTL: se ha superado el tiempo de entrada de agua (no llena).",
     "causas": [
      "grifo cerrado o baja presión",
      "manguera de entrada doblada",
      "filtro de entrada obstruido",
      "electroválvula averiada"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto, que hay presión de agua y que la manguera no está doblada.",
     "pieza_probable": "electroválvula de entrada",
     "fuente": "http://download.beko.com/Download.UsageManualsBeko/MR/en_US_201802080318115_User%20Manual%20-%20Fileen_US.pdf",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E2"
     ],
     "significado": "En lavadoras de carga superior serie WTL: se ha superado el tiempo de desagüe (no vacía).",
     "causas": [
      "filtro de la bomba obstruido",
      "manguera de desagüe doblada o mal colocada",
      "bomba de desagüe averiada"
     ],
     "que_puede_hacer_el_cliente": "Revisar que la manguera de desagüe está bien colocada y no doblada, y limpiar el filtro de la bomba si el manual lo indica.",
     "pieza_probable": "bomba de desagüe",
     "fuente": "http://download.beko.com/Download.UsageManualsBeko/MR/en_US_201802080318115_User%20Manual%20-%20Fileen_US.pdf",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E3"
     ],
     "significado": "En lavadoras de carga superior serie WTL: carga desequilibrada.",
     "causas": [
      "ropa mal repartida o una sola prenda pesada",
      "lavadora mal nivelada"
     ],
     "que_puede_hacer_el_cliente": "Repartir la ropa en el tambor, añadir o quitar prendas y comprobar que la lavadora está nivelada.",
     "pieza_probable": "",
     "fuente": "http://download.beko.com/Download.UsageManualsBeko/MR/en_US_201802080318115_User%20Manual%20-%20Fileen_US.pdf",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E4"
     ],
     "significado": "En lavadoras de carga superior serie WTL: desbordamiento (exceso de agua); según el manual requiere servicio técnico. En otros modelos, E4 indica que no llena.",
     "causas": [
      "electroválvula que no cierra",
      "presostato averiado"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo, desenchufar y llamar al servicio técnico.",
     "pieza_probable": "electroválvula de entrada, presostato",
     "fuente": "http://download.beko.com/Download.UsageManualsBeko/MR/en_US_201802080318115_User%20Manual%20-%20Fileen_US.pdf",
     "confianza": "media"
    },
    {
     "aparato": "lavadora-secadora",
     "codigos": [
      "E02"
     ],
     "significado": "En la lavadora-secadora BMM5DFO: no entra agua.",
     "causas": [
      "grifo cerrado o baja presión",
      "manguera de entrada doblada",
      "filtro de entrada obstruido"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto y la manguera no está doblada.",
     "pieza_probable": "electroválvula de entrada",
     "fuente": "https://www.beko.com/content/dam/bosnia-ba-aem/bosnia-ba-aemProductCatalog/product-documents/8784853200-BMM5DFO5741WPB/en-US-8784853200-MDM2-USER-MANUAL-FILE-en-US.pdf",
     "confianza": "media"
    },
    {
     "aparato": "lavadora-secadora",
     "codigos": [
      "E03"
     ],
     "significado": "En la lavadora-secadora BMM5DFO: desagüe anómalo (no vacía o vacía muy despacio).",
     "causas": [
      "filtro de la bomba obstruido",
      "manguera de desagüe doblada",
      "bomba de desagüe averiada"
     ],
     "que_puede_hacer_el_cliente": "Revisar la manguera de desagüe y limpiar el filtro de la bomba según el manual.",
     "pieza_probable": "bomba de desagüe",
     "fuente": "https://www.beko.com/content/dam/bosnia-ba-aem/bosnia-ba-aemProductCatalog/product-documents/8784853200-BMM5DFO5741WPB/en-US-8784853200-MDM2-USER-MANUAL-FILE-en-US.pdf",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "H5"
     ],
     "significado": "Código de diagnóstico (modo de servicio): fallo de desagüe o de la bomba de desagüe.",
     "causas": [
      "bomba o filtro obstruidos",
      "bomba de desagüe averiada"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de la bomba según el manual.",
     "pieza_probable": "bomba de desagüe",
     "fuente": "https://guide.washerhouse.com/es/kkody-oshibok-beko/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "H1"
     ],
     "significado": "Código de diagnóstico (modo de servicio): sensor de temperatura (NTC) abierto o en cortocircuito.",
     "causas": [
      "sonda NTC averiada",
      "cableado de la sonda dañado"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "sonda NTC de temperatura",
     "fuente": "https://guide.washerhouse.com/es/kkody-oshibok-beko/",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "icono depósito de agua"
     ],
     "significado": "El depósito de agua condensada está lleno; la secadora se detiene hasta vaciarlo.",
     "causas": [
      "depósito lleno",
      "depósito mal colocado"
     ],
     "que_puede_hacer_el_cliente": "Vaciar el depósito, colocarlo bien y pulsar inicio para continuar. No sacar el depósito con el programa en marcha.",
     "pieza_probable": "",
     "fuente": "https://www.beko.com/content/dam/spain-es-aem/spain-es-aemProductCatalog/product-documents/7188236420-B5T42243/es-ES-7188236420-202202241435707-User-Manual---File-Longes-ES.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "icono condensador"
     ],
     "significado": "El frontal del condensador está obstruido por pelusa; en bomba de calor provoca ropa húmeda al terminar.",
     "causas": [
      "condensador sucio de pelusa"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el frontal del condensador como indica el manual.",
     "pieza_probable": "",
     "fuente": "https://www.beko.com/content/dam/spain-es-aem/spain-es-aemProductCatalog/product-documents/7188283340-BM3T49240W/es-ES-7188283340-MDM2-USER-MANUAL-FILE-es-ES.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "icono filtro"
     ],
     "significado": "Los filtros de pelusa están obstruidos, no están colocados o (en modelos con filtro eco) hay que cambiarlos.",
     "causas": [
      "filtros de pelusa sucios",
      "filtros interior o exterior no colocados",
      "filtro eco gastado"
     ],
     "que_puede_hacer_el_cliente": "Lavar los filtros de pelusa con agua templada, secarlos y colocarlos en su sitio; cambiar el filtro eco si el manual lo indica.",
     "pieza_probable": "filtro eco (si el modelo lo lleva)",
     "fuente": "https://www.beko.com/content/dam/spain-es-aem/spain-es-aemProductCatalog/product-documents/7188283340-BM3T49240W/es-ES-7188283340-MDM2-USER-MANUAL-FILE-es-ES.pdf",
     "confianza": "alta"
    }
   ]
  },
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
  },
  {
   "familia": "Cata",
   "marcas": [
    "Cata"
   ],
   "notas": "Cata es la marca principal de CNA Group, que en junio de 2026 pasó a llamarse Cata Group. Es el mismo grupo que fabrica hoy Fagor (bajo licencia) y Edesa, así que es probable que comparta electrónica de inducción con ellas, pero no se ha verificado. No se encontró documentación oficial de Cata con tablas de códigos; solo fuentes de terceros.",
   "codigos": [
    {
     "aparato": "placa",
     "codigos": [
      "ER03",
      "Er03"
     ],
     "significado": "Pulsación mantenida o panel de mandos mojado: hay algo sobre los sensores táctiles.",
     "causas": [
      "agua o restos sobre el panel táctil",
      "recipiente u objeto apoyado en los mandos"
     ],
     "que_puede_hacer_el_cliente": "Retirar lo que haya sobre los mandos, secar y limpiar el panel y volver a encender.",
     "pieza_probable": "",
     "fuente": "https://vitroceramica.online/codigos-de-error/error-vitroceramica-cata/",
     "confianza": "media"
    }
   ]
  },
  {
   "familia": "Electrolux",
   "marcas": [
    "AEG",
    "Electrolux",
    "Zanussi"
   ],
   "notas": "AEG, Electrolux y Zanussi comparten electrónica y códigos (lo indica la OCU), aunque puede haber pequeñas variaciones por modelo; pedir siempre el modelo y el PNC de la placa de características. Los códigos suelen ser familias: E10 cubre E11-E1x, E20 cubre E21-E2x, etc.; en modelos antiguos o de otros mercados el mismo fallo aparece como C1/F1 (agua), C2/F2 (desagüe) o AL5/AL6 en lavavajillas. Lavadoras sin pantalla (sobre todo Zanussi): el piloto de fin de programa parpadea tantas veces como la primera cifra y el de Inicio/Pausa tantas como la segunda; se antepone 'E' (4 y 3 parpadeos = E43). Lavavajillas sin pantalla: el indicador de fin parpadea N veces tras una pausa (1 = i10, 2 = i20, 3 = i30...). Primer paso general: desenchufar o bajar el automático 30 s-1 min, volver a conectar y relanzar el programa; si el código vuelve, avería real. Corberó no se incluye: no se encontró ninguna fuente que confirme que comparte códigos con este grupo.",
   "codigos": [
    {
     "aparato": "lavadora",
     "codigos": [
      "E10",
      "E11",
      "E13",
      "C1",
      "F1"
     ],
     "significado": "Problema de entrada de agua: no llena o llena demasiado despacio.",
     "causas": [
      "Grifo de agua cerrado o poco abierto",
      "Manguera de entrada doblada u obstruida",
      "Filtro de la entrada de agua sucio",
      "Presión de agua baja",
      "Electroválvula de entrada averiada"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto del todo y que la manguera de entrada no está doblada ni pisada; desenchufar, esperar un minuto y volver a probar.",
     "pieza_probable": "Electroválvula de entrada de agua",
     "fuente": "https://support.aeg.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E20",
      "E21",
      "E22",
      "E23",
      "E24",
      "E25",
      "C2",
      "F2"
     ],
     "significado": "Problema de desagüe: la lavadora no vacía el agua.",
     "causas": [
      "Filtro de la bomba de desagüe obstruido",
      "Manguera de desagüe doblada u obstruida",
      "Desagüe de la casa atascado",
      "Bomba de desagüe bloqueada o averiada"
     ],
     "que_puede_hacer_el_cliente": "Revisar que la manguera de desagüe no esté doblada y limpiar el filtro de la bomba de desagüe (parte inferior delantera) como indica el manual, poniendo un recipiente y toallas porque saldrá agua.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://support.aeg.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E30",
      "E31",
      "E32"
     ],
     "significado": "Fallo del sensor de presión de agua (presostato). Algunas fuentes no oficiales lo asocian a fugas o, en ciertos Lavamat, a la puerta.",
     "causas": [
      "Presostato averiado",
      "Tubo o cámara del presostato obstruida",
      "Fallo de conexión"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar un minuto y volver a probar.",
     "pieza_probable": "Presostato (sensor de nivel)",
     "fuente": "https://support.aeg.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E40",
      "E41",
      "E42",
      "E43",
      "E44",
      "E45"
     ],
     "significado": "Problema con el cierre (bloqueo) de la puerta.",
     "causas": [
      "Puerta mal cerrada",
      "Ropa o goma atrapada en la puerta",
      "Blocapuertas averiado",
      "Fallo de cableado entre cierre y placa"
     ],
     "que_puede_hacer_el_cliente": "Abrir y volver a cerrar la puerta con firmeza comprobando que no haya ropa enganchada en la goma; desenchufar un minuto y volver a probar.",
     "pieza_probable": "Blocapuertas (cierre electromagnético de puerta)",
     "fuente": "https://support.aeg.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E50",
      "E51",
      "E52",
      "E53",
      "E54"
     ],
     "significado": "Problema del motor.",
     "causas": [
      "Fallo del motor",
      "Fallo del control del motor en la placa",
      "Sobrecarga o carga desequilibrada (según algunas fuentes no oficiales)"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar un minuto, no sobrecargar el tambor y volver a probar.",
     "pieza_probable": "Motor / módulo de control del motor",
     "fuente": "https://support.aeg.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E60",
      "E61",
      "E62",
      "E66",
      "E68",
      "E69"
     ],
     "significado": "Problema de calentamiento del agua.",
     "causas": [
      "Resistencia calefactora averiada",
      "Sonda de temperatura (NTC) averiada",
      "Fallo de conexión o de placa"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar un minuto y volver a probar; si se repite, avisar al técnico.",
     "pieza_probable": "Resistencia calefactora y/o sonda NTC",
     "fuente": "https://support.aeg.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "EF0",
      "EFO"
     ],
     "significado": "Aviso de fuga de agua, exceso de espuma o carga desequilibrada (según modelo).",
     "causas": [
      "Fuga de agua a la bandeja inferior (sistema antifugas activado)",
      "Exceso de detergente / espuma",
      "Carga desequilibrada",
      "En modelos con SoftWater, falta de sal"
     ],
     "que_puede_hacer_el_cliente": "Si hay agua en el suelo: cerrar el grifo y desenchufar. Si no: reducir la dosis de detergente, repartir la ropa en el tambor y relanzar el programa.",
     "pieza_probable": "",
     "fuente": "https://support.aeg.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "EH0",
      "EHO"
     ],
     "significado": "Problema de alimentación eléctrica (tensión de red inestable o incorrecta).",
     "causas": [
      "Enchufe flojo o base de enchufe defectuosa",
      "Tensión de red inestable",
      "Uso de alargadores o regletas"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el enchufe está bien metido, enchufar directamente a la pared sin regletas y volver a probar.",
     "pieza_probable": "",
     "fuente": "https://support.aeg.co.uk/support-articles/article/washing-machine-displays-an-error-code-how-to-fix-it",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E90",
      "E91",
      "E92",
      "E93",
      "E94"
     ],
     "significado": "Error de electrónica: fallo de comunicación entre la placa de mando y la de potencia.",
     "causas": [
      "Fallo de comunicación entre placas",
      "Placa electrónica averiada",
      "Configuración incorrecta tras reparación"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar unos minutos y volver a encender.",
     "pieza_probable": "Placa electrónica (módulo de control o de mandos)",
     "fuente": "https://www.coolblue.nl/en/advice/aeg-washing-machines-errors.html",
     "confianza": "media"
    },
    {
     "aparato": "lavadora-secadora",
     "codigos": [
      "E20",
      "C2",
      "F2"
     ],
     "significado": "Problema de desagüe del agua.",
     "causas": [
      "Manguera de desagüe doblada u obstruida",
      "Filtro de la bomba sucio",
      "Bomba de desagüe averiada"
     ],
     "que_puede_hacer_el_cliente": "Revisar la manguera de desagüe y limpiar el filtro de la bomba según el manual; desenchufar 30 s y volver a encender.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.coolblue.nl/en/advice/the-most-common-errors-of-aeg-washer-dryer-combinations.html",
     "confianza": "media"
    },
    {
     "aparato": "lavadora-secadora",
     "codigos": [
      "EF0",
      "EFO"
     ],
     "significado": "Aviso con varias causas posibles: fuga, exceso de espuma o carga desequilibrada.",
     "causas": [
      "Exceso de detergente",
      "Carga desequilibrada",
      "Fuga de agua a la base"
     ],
     "que_puede_hacer_el_cliente": "Si hay agua en el suelo, cerrar el grifo y desenchufar. Si no, desenchufar 30 minutos, reducir detergente y relanzar el ciclo.",
     "pieza_probable": "",
     "fuente": "https://www.coolblue.nl/en/advice/the-most-common-errors-of-aeg-washer-dryer-combinations.html",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "E20",
      "C2"
     ],
     "significado": "Problema con el desagüe del agua condensada.",
     "causas": [
      "Manguera de desagüe doblada o con bucles",
      "Bomba de agua condensada averiada"
     ],
     "que_puede_hacer_el_cliente": "Si la secadora va a desagüe directo, comprobar que la manguera no esté doblada ni forme bucles grandes; si usa depósito, vaciarlo.",
     "pieza_probable": "Bomba de agua condensada",
     "fuente": "https://www.coolblue.nl/en/advice/the-most-common-errors-on-aeg-dryers.html",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "C6"
     ],
     "significado": "Problema con el sensor de humedad; el ciclo tarda más de lo normal.",
     "causas": [
      "Sensor de humedad sucio",
      "Sensor de humedad averiado"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de pelusas y el condensador según el manual y repetir el ciclo.",
     "pieza_probable": "Sensor de humedad",
     "fuente": "https://www.coolblue.nl/en/advice/the-most-common-errors-on-aeg-dryers.html",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "C8"
     ],
     "significado": "Fallo del sensor de temperatura.",
     "causas": [
      "Sonda de temperatura averiada"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Sonda de temperatura (NTC)",
     "fuente": "https://www.coolblue.nl/en/advice/the-most-common-errors-on-aeg-dryers.html",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "E40"
     ],
     "significado": "La puerta no cierra bien (o problema de conexión eléctrica de la secadora).",
     "causas": [
      "Puerta mal cerrada o ropa atrapada",
      "Interruptor de puerta averiado",
      "Secadora conectada a un circuito inadecuado (p. ej. instalaciones con placas solares)"
     ],
     "que_puede_hacer_el_cliente": "Cerrar bien la puerta comprobando que no haya ropa enganchada; probar en otro enchufe/circuito.",
     "pieza_probable": "Interruptor / cierre de puerta",
     "fuente": "https://www.coolblue.nl/en/advice/the-most-common-errors-on-aeg-dryers.html",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "E60"
     ],
     "significado": "La secadora no calienta correctamente.",
     "causas": [
      "Filtro de pelusas sucio",
      "Condensador sucio",
      "Fallo del sistema de calefacción o bomba de calor"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de pelusas y el condensador (según el manual) y desenchufar 30 minutos antes de volver a probar.",
     "pieza_probable": "",
     "fuente": "https://www.coolblue.nl/en/advice/the-most-common-errors-on-aeg-dryers.html",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "EH0",
      "EHO"
     ],
     "significado": "La secadora no recibe alimentación eléctrica correcta.",
     "causas": [
      "Enchufe mal insertado",
      "Base de enchufe sin corriente",
      "Problema de la instalación eléctrica"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el enchufe está bien metido y probar otro aparato en esa toma.",
     "pieza_probable": "",
     "fuente": "https://www.coolblue.nl/en/advice/the-most-common-errors-on-aeg-dryers.html",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "E5A",
      "E97"
     ],
     "significado": "Error grave del aparato que el manual remite al servicio técnico. Una guía no oficial asocia E5A a sobrecalentamiento de la placa de potencia.",
     "causas": [
      "Fallo de la placa electrónica",
      "Sobrecalentamiento de la electrónica de potencia (según fuentes no oficiales)"
     ],
     "que_puede_hacer_el_cliente": "Apagar y volver a encender la secadora; si persiste, servicio técnico.",
     "pieza_probable": "Placa electrónica",
     "fuente": "https://www.manualslib.com/manual/2473049/Aeg-T9dec866r.html?page=27",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "i10",
      "i11",
      "AL5",
      "C1"
     ],
     "significado": "No entra agua o entra insuficiente (1 pitido o 1 parpadeo en modelos sin pantalla).",
     "causas": [
      "Grifo cerrado o poco abierto",
      "Presión de agua baja",
      "Manguera de entrada doblada",
      "Filtro de la entrada obstruido",
      "Electroválvula de entrada averiada"
     ],
     "que_puede_hacer_el_cliente": "Abrir el grifo del todo, comprobar que la manguera no esté doblada y apagar y encender el lavavajillas.",
     "pieza_probable": "Electroválvula de entrada / Aquastop",
     "fuente": "https://support.aeg.co.uk/support-articles/article/dishwasher-displays-error-code-i10-i11-al5-c1-beeps-once-or-the-warning-light-flashes-once",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "i20",
      "C2",
      "F2",
      "AL6"
     ],
     "significado": "No desagua (2 pitidos o 2 parpadeos en modelos sin pantalla).",
     "causas": [
      "Filtros del fondo obstruidos",
      "Manguera de desagüe doblada",
      "Desagüe o sifón de la casa atascado",
      "Bomba de desagüe bloqueada o averiada",
      "Presostato obstruido o averiado"
     ],
     "que_puede_hacer_el_cliente": "Limpiar los filtros del fondo de la cuba como indica el manual y comprobar que la manguera de desagüe no esté doblada.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://support.electrolux.co.uk/support-articles/article/dishwasher-displays-an-error-code-how-to-fix-it",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "i30"
     ],
     "significado": "Protección antidesbordamiento/antifugas activada: hay agua en la base (3 parpadeos sin pantalla). El manual de algún modelo Electrolux lo describe como fallo del sensor de nivel.",
     "causas": [
      "Fuga interna de agua a la bandeja inferior",
      "Exceso de espuma por detergente inadecuado",
      "Flotador antifugas atascado o averiado"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo de agua y apagar/desenchufar el lavavajillas; no volver a usarlo hasta que lo revise el técnico.",
     "pieza_probable": "Según la fuga: manguitos, junta o flotador/interruptor antifugas",
     "fuente": "https://support.electrolux.co.uk/support-articles/article/dishwasher-displays-error-code-i30",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "i40",
      "i43",
      "i44"
     ],
     "significado": "Fallo del sensor de presión: no mide bien el nivel de agua.",
     "causas": [
      "Presostato averiado",
      "Cámara o tubo del presostato obstruido"
     ],
     "que_puede_hacer_el_cliente": "Apagar, esperar unos segundos y volver a encender.",
     "pieza_probable": "Presostato / sensor de nivel",
     "fuente": "https://www.coolblue.nl/en/advice/how-do-you-solve-error-codes-on-an-aeg-dishwasher.html",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "i50",
      "i51",
      "i52",
      "i53",
      "i54",
      "i55",
      "i56",
      "i57",
      "i58",
      "i59",
      "i5A",
      "i5B",
      "i5C"
     ],
     "significado": "Funcionamiento anómalo del motor de lavado / bomba de circulación.",
     "causas": [
      "Bomba de circulación averiada o bloqueada",
      "Fallo en el circuito de control del motor (placa/triac)"
     ],
     "que_puede_hacer_el_cliente": "Apagar y encender; si vuelve a aparecer, avisar al técnico.",
     "pieza_probable": "Bomba de circulación (lavado) o placa de control",
     "fuente": "https://support.electrolux.co.uk/support-articles/article/dishwasher-displays-error-code-i50",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "i60",
      "i61",
      "i69",
      "i6C"
     ],
     "significado": "Fallo del sistema de calentamiento: no calienta el agua o no detecta la subida de temperatura.",
     "causas": [
      "Resistencia calefactora (o bomba con resistencia integrada) averiada",
      "Sonda de temperatura averiada",
      "Termostato de seguridad disparado",
      "Fallo de placa"
     ],
     "que_puede_hacer_el_cliente": "Apagar y encender; si persiste, avisar al técnico.",
     "pieza_probable": "Bomba de circulación con resistencia / resistencia y sonda NTC",
     "fuente": "https://www.coolblue.nl/en/advice/how-do-you-solve-error-codes-on-an-aeg-dishwasher.html",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "i70",
      "i80",
      "i90",
      "i91",
      "i92",
      "i93",
      "i94",
      "i95",
      "i96",
      "i97",
      "i98",
      "i99"
     ],
     "significado": "Avería interna (sensores o electrónica). No es reparable por el usuario.",
     "causas": [
      "Componente o sensor averiado",
      "Fallo de la placa electrónica"
     ],
     "que_puede_hacer_el_cliente": "Apagar y encender una vez; si sigue, no manipular y llamar al técnico.",
     "pieza_probable": "Placa electrónica (i90) / sensor correspondiente",
     "fuente": "https://support.aeg.co.uk/support-articles/article/dishwasher-displays-error-code-i90",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "iC0",
      "iC3"
     ],
     "significado": "Error electrónico/técnico (comunicación entre mandos y placa).",
     "causas": [
      "Fallo temporal de software",
      "Exceso de espuma",
      "Suciedad en los filtros y el sumidero",
      "Fallo de comunicación entre placas"
     ],
     "que_puede_hacer_el_cliente": "Apagar, esperar unos segundos y encender; limpiar los filtros y usar detergente específico de lavavajillas.",
     "pieza_probable": "Placa electrónica / mandos",
     "fuente": "https://support.aeg.co.uk/support-articles/article/dishwasher-displays-error-code-ic0-ico",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "iF0",
      "iF1"
     ],
     "significado": "Nivel de agua demasiado alto en la cuba.",
     "causas": [
      "Filtros obstruidos",
      "Problema en mangueras de entrada o desagüe"
     ],
     "que_puede_hacer_el_cliente": "Limpiar los filtros y revisar que las mangueras de entrada y desagüe no estén dobladas.",
     "pieza_probable": "",
     "fuente": "https://www.coolblue.nl/en/advice/how-do-you-solve-error-codes-on-an-aeg-dishwasher.html",
     "confianza": "media"
    },
    {
     "aparato": "horno",
     "codigos": [
      "F101",
      "F102"
     ],
     "significado": "Fallo del sensor de la cerradura de la puerta (F102 también cuando la puerta no se abre tras la pirólisis).",
     "causas": [
      "Puerta no cerrada del todo",
      "Restos de suciedad en la puerta tras la pirólisis",
      "Cerradura de puerta averiada"
     ],
     "que_puede_hacer_el_cliente": "Cerrar bien la puerta; desconectar el horno del automático al menos 30 segundos y volver a conectar.",
     "pieza_probable": "Cerradura de puerta (pirolítica)",
     "fuente": "https://supporthub.aegaustralia.com.au/support-articles/article/oven-displays-error-f101-or-f102",
     "confianza": "alta"
    },
    {
     "aparato": "horno",
     "codigos": [
      "F104",
      "F04",
      "F105",
      "F05"
     ],
     "significado": "F104: sensor de temperatura fuera de rango. F105: alarma de temperatura demasiado alta.",
     "causas": [
      "Sonda de temperatura del horno averiada",
      "Sobretemperatura"
     ],
     "que_puede_hacer_el_cliente": "Desconectar del automático al menos 30 segundos y volver a conectar; si persiste, técnico.",
     "pieza_probable": "Sonda de temperatura del horno",
     "fuente": "https://supporthub.aegaustralia.com.au/support-articles/article/oven-displays-error-f104-f04-f105-f05",
     "confianza": "alta"
    },
    {
     "aparato": "horno",
     "codigos": [
      "F11",
      "F111",
      "F129"
     ],
     "significado": "Según AEG: sonda de carne (termómetro) mal conectada o averiada. Otra fuente (IKEA) lo asocia al bloqueo de seguridad infantil.",
     "causas": [
      "Sonda de carne mal insertada en su conector",
      "Sonda de carne averiada",
      "Bloqueo infantil activado (según otras fuentes)"
     ],
     "que_puede_hacer_el_cliente": "Sacar y volver a conectar la sonda de carne; comprobar en el manual si está activado el bloqueo infantil.",
     "pieza_probable": "Sonda de carne",
     "fuente": "https://support.aeg.co.uk/support-articles/article/oven-displays-error-message-f11-f111",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E0",
      "E1",
      "E011",
      "E012",
      "E013"
     ],
     "significado": "Error electrónico: comunicación interna, perturbación de la alimentación o fallo de placa.",
     "causas": [
      "Error temporal de comunicación",
      "Perturbación en la alimentación eléctrica",
      "Placa de control o componente averiado"
     ],
     "que_puede_hacer_el_cliente": "Desconectar la placa en el automático 30 segundos-1 minuto y volver a conectar.",
     "pieza_probable": "Placa de control / módulo de potencia",
     "fuente": "https://support.aeg.co.uk/support-articles/article/hob-displays-error-message-e0-e1",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E2"
     ],
     "significado": "Fallo electrónico; AEG lo relaciona en placas de inducción con los indicadores LED. Otras fuentes lo asocian a protección por sobrecalentamiento.",
     "causas": [
      "Fallo de la electrónica de indicadores",
      "Protección por sobrecalentamiento (según otras fuentes)"
     ],
     "que_puede_hacer_el_cliente": "Desconectar la placa del automático al menos 30 segundos y volver a conectar.",
     "pieza_probable": "Placa de mandos",
     "fuente": "https://support.aeg.co.uk/support-articles/article/hob-displays-error-message-e2",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E3",
      "E311",
      "E312",
      "E313"
     ],
     "significado": "Tensión de alimentación incorrecta (sobretensión/subtensión, p. ej. conexión a 400 V o fase y neutro mal conectados).",
     "causas": [
      "Conexión eléctrica incorrecta",
      "Tensión de red fuera de rango"
     ],
     "que_puede_hacer_el_cliente": "Desconectar la placa de inmediato en el automático y no usarla hasta que se revise la conexión.",
     "pieza_probable": "",
     "fuente": "https://support.aeg.co.uk/support-articles/article/induction-hob-displays-error-message-e3-e311-e312-e313",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E4",
      "E401",
      "E402",
      "E403",
      "E421",
      "E422",
      "E423",
      "E431",
      "E432",
      "E433"
     ],
     "significado": "Sobrecalentamiento de la electrónica de la placa.",
     "causas": [
      "Uso prolongado a máxima potencia",
      "Recipiente no adecuado para inducción",
      "Ventilación insuficiente bajo la placa"
     ],
     "que_puede_hacer_el_cliente": "Apagar y dejar enfriar; el código debe desaparecer al enfriarse. Usar recipientes aptos para inducción.",
     "pieza_probable": "",
     "fuente": "https://support.aeg.co.uk/support-articles/article/hob-displays-error-message-e4-e401-e402-e403-e421-e422-e423-e431-e432-e433",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E6",
      "E641"
     ],
     "significado": "Problema de tensión en la conexión: potencia insuficiente o error en la placa de potencia.",
     "causas": [
      "Conexión intermitente o incorrecta",
      "Fallo del módulo de potencia"
     ],
     "que_puede_hacer_el_cliente": "Desconectar del automático al menos 30 segundos y volver a conectar.",
     "pieza_probable": "Módulo de potencia (inductor/placa de potencia)",
     "fuente": "https://support.aeg.co.uk/support-articles/article/hob-displays-error-message-e6-e641",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E8",
      "E822"
     ],
     "significado": "En instalación nueva: placa conectada incorrectamente a la red eléctrica.",
     "causas": [
      "Error de conexión eléctrica en la instalación"
     ],
     "que_puede_hacer_el_cliente": "Desconectar en el automático y pedir revisión de la conexión.",
     "pieza_probable": "",
     "fuente": "https://support.aeg.co.uk/support-articles/article/hob-displays-error-message-e8-e822",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E9"
     ],
     "significado": "Posible fallo de la placa electrónica.",
     "causas": [
      "Error de la placa de circuito"
     ],
     "que_puede_hacer_el_cliente": "Hacer un reinicio: desconectar en el automático y volver a conectar.",
     "pieza_probable": "Placa electrónica",
     "fuente": "https://support.aeg.co.uk/support-articles/article/hob-displays-error-message-e9",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "E10"
     ],
     "significado": "Alarma de temperatura alta en el frigorífico.",
     "causas": [
      "Corte de luz prolongado",
      "Comida caliente introducida",
      "Puerta abierta mucho tiempo"
     ],
     "que_puede_hacer_el_cliente": "Bajar la temperatura de consigna o activar Super Cool y comprobar que la puerta cierra bien; desconectar 1 minuto y reconectar si no se borra.",
     "pieza_probable": "",
     "fuente": "https://support.aeg.co.uk/support-articles/article/fridge-freezer-shows-code-e10",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "E01",
      "E02",
      "E03",
      "E06",
      "E07"
     ],
     "significado": "Fallo de un sensor de temperatura; requiere técnico.",
     "causas": [
      "Sonda de temperatura averiada",
      "Fallo de cableado o placa"
     ],
     "que_puede_hacer_el_cliente": "Desconectar 1 minuto y reconectar; si vuelve, llamar al técnico.",
     "pieza_probable": "Sonda de temperatura (NTC)",
     "fuente": "https://support.aeg.co.uk/support-articles/article/fridge-freezer-shows-code-e01-e02-e03-e06-e07-on-the-display",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "F3",
      "F4",
      "F5"
     ],
     "significado": "Fallo del sensor de temperatura; necesita técnico.",
     "causas": [
      "Sonda de temperatura averiada"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Sonda de temperatura",
     "fuente": "https://support.electrolux.co.uk/support-articles/article/fridge-freezer-shows-f4-on-the-display",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "E09",
      "E11"
     ],
     "significado": "E09: el congelador no enfría lo suficiente. E11: el frigorífico enfría demasiado.",
     "causas": [
      "Temperatura mal ajustada",
      "Puerta mal cerrada (E09)",
      "Fallo de regulación"
     ],
     "que_puede_hacer_el_cliente": "Revisar el ajuste de temperatura (subirla en E11) y que las puertas cierran bien.",
     "pieza_probable": "",
     "fuente": "https://nettoparts.ie/shop/diy-errorcodelist-fridge-freezer-aeg-44835s1.html",
     "confianza": "media"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "F6",
      "F7"
     ],
     "significado": "Las fuentes no coinciden: interrupción del suministro eléctrico o puerta abierta mucho tiempo, o error de conexión a la red.",
     "causas": [
      "Corte de corriente",
      "Puerta abierta o mal cerrada",
      "Problema en el cable de alimentación"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que la puerta cierra bien y el enchufe; puede desaparecer solo al recuperar la temperatura.",
     "pieza_probable": "",
     "fuente": "https://support.aeg.co.uk/support-articles/article/refrigerator-shows-f7-on-the-display",
     "confianza": "media"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "dEMo"
     ],
     "significado": "El aparato está en modo demostración (no enfría).",
     "causas": [
      "Modo demostración activado por error"
     ],
     "que_puede_hacer_el_cliente": "Desactivar el modo demostración siguiendo el manual del modelo.",
     "pieza_probable": "",
     "fuente": "https://www.manualslib.com/manual/854764/Aeg-Skz81800f0.html?page=30",
     "confianza": "alta"
    }
   ]
  },
  {
   "familia": "Fagor",
   "marcas": [
    "Fagor",
    "Edesa",
    "Aspes"
   ],
   "notas": "Fagor Electrodomésticos (cooperativa de Mondragón) quebró en 2013. En 2014 CNA Group (grupo de Cata, que en junio de 2026 pasó a llamarse Cata Group) compró sus activos y fábricas del País Vasco y opera mediante Edesa Industrial. Las marcas Fagor y Aspes siguen siendo propiedad de Fagor S.C. (Mondragón), que se las alquila a CNA, y Edesa es del propio grupo CNA. Por tanto, los aparatos Fagor y Edesa actuales los fabrica CNA/Cata Group, y es razonable que compartan códigos, aunque no hay una fuente que lo confirme modelo a modelo. Las Fagor antiguas (anteriores a 2014, de Fagor Electrodomésticos) usan otras tablas, y la documentación encontrada sobre ellas es escasa. Los manuales de los modelos actuales están en file.fagorelectrodomestico.com. En lavadora, el mismo fallo aparece como E01, Er 01 o E30 según el modelo. Sobre Aspes no se encontró ninguna tabla de códigos.",
   "codigos": [
    {
     "aparato": "lavadora",
     "codigos": [
      "E01",
      "Er 01",
      "E30"
     ],
     "significado": "La puerta no está bien cerrada.",
     "causas": [
      "puerta mal cerrada o ropa pillada",
      "blocapuerta averiado"
     ],
     "que_puede_hacer_el_cliente": "Cerrar la puerta con firmeza, comprobar que no hay ropa atrapada y volver a iniciar.",
     "pieza_probable": "blocapuerta",
     "fuente": "https://file.fagorelectrodomestico.com/0/f/0/3/0f03b1e0a21d9785521e39a9c62fee1ee5500ccb_SER_0028787_ART.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E02",
      "Er 02",
      "E10"
     ],
     "significado": "Baja presión o bajo nivel de agua: no entra agua suficiente.",
     "causas": [
      "grifo cerrado",
      "baja presión",
      "manguera de entrada doblada",
      "filtro de entrada obstruido",
      "electroválvula averiada"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto y la manguera no está doblada.",
     "pieza_probable": "electroválvula de entrada",
     "fuente": "https://file.fagorelectrodomestico.com/0/f/0/3/0f03b1e0a21d9785521e39a9c62fee1ee5500ccb_SER_0028787_ART.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E03",
      "Er 03"
     ],
     "significado": "Avería de la bomba o filtro de la bomba obstruido: no desagua.",
     "causas": [
      "filtro de la bomba obstruido",
      "manguera de desagüe doblada",
      "bomba de desagüe averiada"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar, vaciar el agua y limpiar el filtro de la bomba como indica el manual.",
     "pieza_probable": "bomba de desagüe",
     "fuente": "https://file.fagorelectrodomestico.com/0/f/0/3/0f03b1e0a21d9785521e39a9c62fee1ee5500ccb_SER_0028787_ART.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E21"
     ],
     "significado": "Evacuación de agua incorrecta.",
     "causas": [
      "filtro de la bomba obstruido",
      "bomba de desagüe averiada"
     ],
     "que_puede_hacer_el_cliente": "Revisar la manguera de desagüe y limpiar el filtro de la bomba según el manual.",
     "pieza_probable": "bomba de desagüe",
     "fuente": "https://file.fagorelectrodomestico.com/0/f/0/3/0f03b1e0a21d9785521e39a9c62fee1ee5500ccb_SER_0028787_ART.pdf",
     "confianza": "media"
    },
    {
     "aparato": "lavadora-secadora",
     "codigos": [
      "F02"
     ],
     "significado": "Lavadora-secadora Fagor 3FS-3611: problema de desagüe.",
     "causas": [
      "bomba de desagüe bloqueada",
      "tubería de desagüe de la vivienda obstruida",
      "conexión eléctrica de la bomba incorrecta"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el desagüe de la casa no está atascado y limpiar el filtro de la bomba si el manual lo indica.",
     "pieza_probable": "bomba de desagüe",
     "fuente": "https://manualslib.mx/manual/884132/Fagor-3Fs-3611.html?page=89",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E1"
     ],
     "significado": "Entrada de agua bloqueada o presión demasiado baja: tarda demasiado en llenar.",
     "causas": [
      "grifo cerrado",
      "baja presión",
      "manguera doblada",
      "electroválvula averiada"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto y la manguera no está doblada.",
     "pieza_probable": "electroválvula de entrada",
     "fuente": "https://file.fagorelectrodomestico.com/2/4/b/3/24b3ce89ce67556d3f5c9a0b681689fffa06098e_SER_0028659_ART.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E3"
     ],
     "significado": "Según el modelo: avería del calefactor (no alcanza la temperatura) o desbordamiento por una pieza no hermética.",
     "causas": [
      "resistencia averiada",
      "fuga interna"
     ],
     "que_puede_hacer_el_cliente": "Si hay agua en el suelo, cerrar el grifo y desenchufar.",
     "pieza_probable": "resistencia de calentamiento",
     "fuente": "https://file.fagorelectrodomestico.com/2/4/b/3/24b3ce89ce67556d3f5c9a0b681689fffa06098e_SER_0028659_ART.pdf",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E4"
     ],
     "significado": "Según el modelo: desbordamiento o fuga, o avería del calefactor.",
     "causas": [
      "fuga interna",
      "resistencia averiada"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo, desenchufar y llamar al servicio técnico.",
     "pieza_probable": "",
     "fuente": "https://file.fagorelectrodomestico.com/c/c/3/6/cc36d861eca5e29df0154059ece107042f06facf_SER_0029139_ART.pdf",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E8"
     ],
     "significado": "Avería de la válvula de sentido (distribuidora del agua).",
     "causas": [
      "válvula de sentido averiada"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "válvula de sentido",
     "fuente": "https://file.fagorelectrodomestico.com/2/4/b/3/24b3ce89ce67556d3f5c9a0b681689fffa06098e_SER_0028659_ART.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E9"
     ],
     "significado": "Un botón se ha mantenido pulsado más de 30 segundos.",
     "causas": [
      "botón atascado",
      "algo apoyado sobre el panel"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que no hay nada apoyado en el panel y que ningún botón se ha quedado hundido; apagar y volver a encender.",
     "pieza_probable": "panel de mandos",
     "fuente": "https://file.fagorelectrodomestico.com/2/4/b/3/24b3ce89ce67556d3f5c9a0b681689fffa06098e_SER_0028659_ART.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E2",
      "E3"
     ],
     "significado": "Inducción Fagor 3IF-355BS / 3IF-305BC: tensión de alimentación incorrecta. En Edesa EIR-6331 B, E2 es temperatura alta del IGBT y E3 tensión demasiado alta.",
     "causas": [
      "tensión de red fuera de rango",
      "conexión eléctrica incorrecta",
      "sobrecalentamiento de la electrónica (Edesa E2)"
     ],
     "que_puede_hacer_el_cliente": "Apagar y dejar enfriar; si se repite, no usarla y avisar al técnico.",
     "pieza_probable": "",
     "fuente": "https://file.fagorelectrodomestico.com/5/9/a/3/59a3458ba09d09e10f744a9a168e97411546d791_SER_0051668_ART.pdf",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E4",
      "E5"
     ],
     "significado": "Inducción Fagor 3IF-355BS / 3IF-305BC: sensor de temperatura averiado.",
     "causas": [
      "sensor de temperatura de la zona averiado"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "sensor de temperatura",
     "fuente": "https://file.fagorelectrodomestico.com/5/9/a/3/59a3458ba09d09e10f744a9a168e97411546d791_SER_0051668_ART.pdf",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E7",
      "E8"
     ],
     "significado": "Inducción Fagor 3IF-355BS / 3IF-305BC: fallo del sensor de temperatura del transistor IGBT.",
     "causas": [
      "sensor del IGBT averiado",
      "placa de potencia"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "placa de potencia (módulo IGBT)",
     "fuente": "https://file.fagorelectrodomestico.com/5/9/a/3/59a3458ba09d09e10f744a9a168e97411546d791_SER_0051668_ART.pdf",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "ER03"
     ],
     "significado": "Edesa: agua o un recipiente sobre el cristal de la zona de mandos.",
     "causas": [
      "líquido u objeto sobre el panel táctil"
     ],
     "que_puede_hacer_el_cliente": "Retirar lo que haya sobre los mandos y secar el panel.",
     "pieza_probable": "",
     "fuente": "https://manualslib.es/manual/159945/Edesa-Eir-6331-B.html?page=23",
     "confianza": "alta"
    }
   ]
  },
  {
   "familia": "Haier",
   "marcas": [
    "Candy",
    "Hoover",
    "Haier"
   ],
   "notas": "Candy y Hoover comparten electrónica y códigos; Haier usa su propia nomenclatura (ERR1, ERR2..., UNB, y en algunos modelos E4). Candy y Hoover apenas publican tablas de códigos en su web española: los significados proceden de manuales de modelos concretos y de fuentes técnicas, por eso casi todo va con confianza media. Las lavadoras Candy/Hoover sin pantalla muestran el código con parpadeos de pilotos: contar los parpadeos entre pausas (por ejemplo, 3 parpadeos = E03). En lavavajillas Candy/Hoover conviven dos generaciones: la clásica con códigos E (E2, E3...) y la moderna con códigos A (A10, A20...). Primer paso habitual: desenchufar 2-3 minutos y volver a conectar; si el código vuelve, la avería sigue presente. Pedir siempre marca y modelo. Sin fuente fiable para hornos, placas y frigoríficos de este grupo: no se incluyen.",
   "codigos": [
    {
     "aparato": "lavadora",
     "codigos": [
      "E01"
     ],
     "significado": "Candy/Hoover: la puerta no está bien cerrada o falla el cierre de puerta.",
     "causas": [
      "Puerta mal cerrada o ropa pillada en la goma",
      "Blocapuertas averiado",
      "Placa"
     ],
     "que_puede_hacer_el_cliente": "Cerrar la puerta con firmeza comprobando que no hay ropa pillada y volver a arrancar.",
     "pieza_probable": "Blocapuertas (cierre de puerta)",
     "fuente": "https://guide.washerhouse.com/es/oshibka-e01-v-sm-candy/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E02"
     ],
     "significado": "Candy/Hoover: problema de entrada de agua (no llena o tarda demasiado).",
     "causas": [
      "Grifo cerrado o poca presión",
      "Manguera de entrada doblada",
      "Filtro de la toma de agua sucio",
      "Electroválvula de entrada"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto, que hay agua en casa y que la manguera de entrada no está doblada.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.ocu.org/electrodomesticos/lavadora/consejos/codigos-error-lavadoras",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E03"
     ],
     "significado": "Candy/Hoover: no desagua o desagua muy despacio.",
     "causas": [
      "Filtro de la bomba atascado",
      "Manguera de desagüe doblada u obstruida",
      "Bomba de desagüe",
      "Presostato (sensor de nivel)"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de la bomba si el manual lo indica (sale agua: poner recipiente y toallas) y comprobar la manguera de desagüe.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://guide.washerhouse.com/es/kody-oshibok-stiralnyx-mashin-kandi/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E04"
     ],
     "significado": "Candy/Hoover: exceso de agua en la cuba (actúa el sistema antidesbordamiento).",
     "causas": [
      "Electroválvula que no cierra",
      "Presostato o su tubo",
      "Placa"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo de agua y desenchufar. Si hay agua en el suelo, no volver a usar hasta la revisión.",
     "pieza_probable": "Electroválvula de entrada o presostato",
     "fuente": "https://guide.washerhouse.com/es/kody-oshibok-stiralnyx-mashin-kandi/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E05"
     ],
     "significado": "Candy/Hoover: el agua no se calienta.",
     "causas": [
      "Resistencia averiada",
      "Sonda de temperatura",
      "Circuito de calentamiento en la placa"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2-3 minutos y reintentar.",
     "pieza_probable": "Resistencia o sonda de temperatura",
     "fuente": "https://guide.washerhouse.com/es/oshibka-e05-candy/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "ERR1"
     ],
     "significado": "Haier: la puerta no está bien cerrada; la lavadora no arranca.",
     "causas": [
      "Puerta mal cerrada u objeto que impide el cierre",
      "Blocapuertas o su cableado"
     ],
     "que_puede_hacer_el_cliente": "Empujar la puerta hasta que quede bloqueada, comprobar que nada impide el cierre y desenchufar unos minutos si persiste.",
     "pieza_probable": "Blocapuertas",
     "fuente": "https://www.manualslib.com/manual/819173/Haier-Hw-F1481-Me.html?page=18",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "ERR2"
     ],
     "significado": "Haier: error de desagüe; no vacía el agua en el tiempo previsto (unos 4-6 minutos según modelo).",
     "causas": [
      "Filtro de la bomba atascado",
      "Manguera de desagüe doblada",
      "Bomba de desagüe"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de la bomba si el manual lo indica y revisar la manguera de desagüe. No insistir con lavados si sigue, puede dañar la bomba.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.tuexperto.com/2023/08/29/que-significa-el-codigo-de-error-de-mi-lavadora-haier-y-como-solucionarlo/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "ERR3"
     ],
     "significado": "Haier: fallo de temperatura (sensor de temperatura o la resistencia no alcanza la temperatura).",
     "causas": [
      "Sonda de temperatura",
      "Resistencia"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar unos minutos y reintentar.",
     "pieza_probable": "Sonda de temperatura o resistencia",
     "fuente": "https://guide.washerhouse.com/es/kody-oshibok-stiralnyx-mashin-haier/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "ERR5"
     ],
     "significado": "Haier: error de entrada de agua; no alcanza el nivel en unos 8 minutos.",
     "causas": [
      "Grifo cerrado o poca presión",
      "Manguera de entrada doblada",
      "Filtro de entrada sucio",
      "Electroválvula"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto y la manguera de entrada no está doblada.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.northlondonappliancerepairs.co.uk/error-codes/haier-error-codes/error-codes-for-haier-washing-machine.html",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E4"
     ],
     "significado": "Haier (algunos modelos de carga frontal): no entra agua.",
     "causas": [
      "Grifo cerrado",
      "Poca presión de agua",
      "Manguera o filtro de entrada obstruidos",
      "Electroválvula"
     ],
     "que_puede_hacer_el_cliente": "Abrir el grifo del todo, comprobar que hay agua en casa y que la manguera no está doblada.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.haier-europe.com/ru_RU/faq/e4-kod-oshibki-problema-otsutstviya-podachi-vody-v-stiralnoj-mashine-s-frontalnoj-zagruzkoj-video/",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "ERR8"
     ],
     "significado": "Haier: nivel de agua demasiado alto (exceso de agua en el tambor).",
     "causas": [
      "Electroválvula que no cierra",
      "Presostato (sensor de nivel)"
     ],
     "que_puede_hacer_el_cliente": "Apagar la lavadora y cerrar el grifo de agua de inmediato. No volver a usar hasta la revisión.",
     "pieza_probable": "Electroválvula de entrada o presostato",
     "fuente": "https://www.northlondonappliancerepairs.co.uk/error-codes/haier-error-codes/error-codes-for-haier-washing-machine.html",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "UNB",
      "UNb"
     ],
     "significado": "Haier: carga desequilibrada; vibra o hace ruido anormal y no centrifuga bien.",
     "causas": [
      "Ropa mal repartida o carga muy pequeña o muy grande",
      "Lavadora mal nivelada",
      "Si se repite: amortiguadores o rodamientos"
     ],
     "que_puede_hacer_el_cliente": "Parar, repartir la ropa en el tambor y volver a centrifugar. Comprobar que la lavadora está nivelada y apoya bien las cuatro patas.",
     "pieza_probable": "Amortiguadores si se repite con carga normal",
     "fuente": "https://www.haier-europe.com/ru_RU/faq/u-nb-kod-oshibki-nepravilnaya-vibracziya-nenormalnyh-shum-stiralnoj-mashiny-s-frontalnoj-zagruzkoj-video/",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "A10"
     ],
     "significado": "Lavavajillas Candy/Hoover (generación moderna): no carga agua.",
     "causas": [
      "Grifo cerrado",
      "Manguera de entrada doblada",
      "Filtro de entrada sucio",
      "Electroválvula"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto y la manguera de entrada no está doblada.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.fersay.com/blog/codigos-error-lavavajillas-segun-tu-marca/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "A20"
     ],
     "significado": "Lavavajillas Candy/Hoover (generación moderna): no desagua.",
     "causas": [
      "Filtro del fondo atascado",
      "Manguera de desagüe doblada",
      "Sifón del fregadero atascado",
      "Bomba de desagüe"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro del fondo de la cuba y revisar la manguera de desagüe y el sifón del fregadero.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.fersay.com/blog/codigos-error-lavavajillas-segun-tu-marca/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E2"
     ],
     "significado": "Lavavajillas Candy/Hoover (generación clásica): falta de agua.",
     "causas": [
      "Grifo cerrado",
      "Manguera de entrada doblada",
      "Electroválvula"
     ],
     "que_puede_hacer_el_cliente": "Comprobar el grifo y la manguera de entrada.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.fersay.com/blog/codigos-error-lavavajillas-segun-tu-marca/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E3"
     ],
     "significado": "Lavavajillas Candy/Hoover (generación clásica): desagüe lento o sin desagüe.",
     "causas": [
      "Filtro atascado",
      "Manguera de desagüe doblada",
      "Bomba de desagüe"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro del fondo y revisar la manguera de desagüe.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.fersay.com/blog/codigos-error-lavavajillas-segun-tu-marca/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E5",
      "E6",
      "E7"
     ],
     "significado": "Lavavajillas Candy/Hoover (generación clásica): fallo de la sonda de temperatura.",
     "causas": [
      "Sonda de temperatura (NTC)",
      "Cableado"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2-3 minutos y reintentar.",
     "pieza_probable": "Sonda de temperatura",
     "fuente": "https://www.fersay.com/blog/codigos-error-lavavajillas-segun-tu-marca/",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "E3"
     ],
     "significado": "Secadora Candy/Hoover de condensación: depósito de agua lleno (dato no oficial, comprobar en el manual).",
     "causas": [
      "Depósito de condensación lleno",
      "Bomba de condensado"
     ],
     "que_puede_hacer_el_cliente": "Vaciar el depósito de agua, colocarlo bien y reiniciar el ciclo.",
     "pieza_probable": "Bomba de condensado si persiste con el depósito vacío",
     "fuente": "https://www.fersay.com/blog/codigos-de-error-secadoras-guia-marca-por-marca/",
     "confianza": "media"
    }
   ]
  },
  {
   "familia": "Hisense",
   "marcas": [
    "Hisense",
    "Gorenje"
   ],
   "notas": "Grupo Hisense (incluye Gorenje). Los códigos de Hisense CAMBIAN MUCHO según la serie y el modelo: en lavadoras hay series con códigos F (F01, F03, F13...) y series con códigos E (E10...); en placas de inducción E1/E2 significan tensión anómala en unos modelos y fallo de sensor en otros. Pedir SIEMPRE el modelo exacto (etiqueta) y, si es posible, consultar su manual en hisense.es. En lavadoras con códigos F, pulsar Inicio/Pausa borra el código y reinicia el programa. En lavavajillas Hisense de libre instalación: E1 puerta, E2 entrada de agua, E3 desagüe, E4 sensor de temperatura, E5 desbordamiento/fuga (si hay agua en la base, hay que retirarla antes de volver a usarlo). En frigoríficos Hisense, los códigos aparecen en la zona de temperatura del compartimento afectado. Gorenje: solo se han encontrado tablas de terceros (contradictorias), por eso sus entradas van con confianza media. Daewoo/Winia: no se han encontrado fuentes fiables de códigos y no se incluyen. Hornos y microondas Hisense: no verificados, no se incluyen.",
   "codigos": [
    {
     "aparato": "lavadora",
     "codigos": [
      "F13"
     ],
     "significado": "Error del bloqueo de la puerta: la puerta se cierra pero no se bloquea.",
     "causas": [
      "Ropa u objeto pillado entre puerta y carcasa",
      "Puerta no cerrada del todo",
      "Blocapuertas averiado",
      "Módulo de control"
     ],
     "que_puede_hacer_el_cliente": "Abrir la puerta, comprobar que no haya ropa en la goma y cerrarla con firmeza; pulsar Inicio/Pausa de nuevo.",
     "pieza_probable": "Blocapuertas",
     "fuente": "https://www.hisense.es/wp-content/uploads/2024/02/WF3S1045BW3-20013525-6901101830050-User-Manual-ES.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F01"
     ],
     "significado": "Fallo de entrada de agua: no entra agua suficiente.",
     "causas": [
      "Grifo cerrado",
      "Poca presión de agua",
      "Manguera doblada",
      "Filtro de la manguera de entrada sucio"
     ],
     "que_puede_hacer_el_cliente": "Abrir el grifo del todo, comprobar la manguera de entrada y la presión de agua; limpiar el filtro de la entrada si el manual lo indica.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.whitegoodshelp.co.uk/hisense-washing-machine-error-codes/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F03"
     ],
     "significado": "Fallo de desagüe: no vacía el agua a tiempo.",
     "causas": [
      "Filtro de la bomba atascado",
      "Manguera de desagüe doblada u obstruida",
      "Bomba de desagüe"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de la bomba según el manual (sale agua) y comprobar la manguera de desagüe.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.whitegoodshelp.co.uk/hisense-washing-machine-error-codes/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F04"
     ],
     "significado": "Error de calentamiento: no calienta el agua a la temperatura programada.",
     "causas": [
      "Resistencia averiada",
      "Sensor de temperatura"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Resistencia / sensor de temperatura",
     "fuente": "https://www.whitegoodshelp.co.uk/hisense-washing-machine-error-codes/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F06"
     ],
     "significado": "Error del motor (sin señal de velocidad del motor).",
     "causas": [
      "Motor o tacogenerador",
      "Cableado",
      "Módulo de control"
     ],
     "que_puede_hacer_el_cliente": "Pulsar Inicio/Pausa para borrar el código y reintentar; si vuelve, llamar al técnico.",
     "pieza_probable": "Motor / módulo de control",
     "fuente": "https://www.whitegoodshelp.co.uk/hisense-washing-machine-error-codes/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "Unb",
      "UNB"
     ],
     "significado": "Carga desequilibrada.",
     "causas": [
      "Ropa mal repartida o una sola prenda voluminosa",
      "Lavadora no nivelada"
     ],
     "que_puede_hacer_el_cliente": "Repartir la ropa, evitar lavar una sola prenda voluminosa y comprobar que la lavadora esté nivelada.",
     "pieza_probable": "",
     "fuente": "https://www.whitegoodshelp.co.uk/hisense-washing-machine-error-codes/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E10"
     ],
     "significado": "En la serie con códigos E (p. ej. WFGS1016VM): error del sensor de nivel de agua. Otras fuentes genéricas lo dan como 'no entra agua'.",
     "causas": [
      "Sensor de nivel (presostato)",
      "Problema de entrada de agua"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto y la manguera no está doblada; apagar y volver a encender.",
     "pieza_probable": "Presostato (sensor de nivel)",
     "fuente": "https://www.hisense.es/wp-content/uploads/2019/11/USER-MANUAL-WFGS1016VM-ES.pdf",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E1"
     ],
     "significado": "Puerta abierta (mal cerrada).",
     "causas": [
      "Puerta no cerrada del todo",
      "Cesto u objeto que impide el cierre",
      "Interruptor de puerta"
     ],
     "que_puede_hacer_el_cliente": "Cerrar bien la puerta comprobando que nada sobresalga de los cestos.",
     "pieza_probable": "Cierre/interruptor de puerta",
     "fuente": "https://hisense.es/wp-content/uploads/2021/09/HS60240X-User-Manual-ES.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E2"
     ],
     "significado": "Fallo de entrada de agua.",
     "causas": [
      "Grifo cerrado",
      "Manguera de entrada doblada",
      "Filtro de entrada obstruido",
      "Poca presión"
     ],
     "que_puede_hacer_el_cliente": "Abrir el grifo del todo y comprobar que la manguera de entrada no esté doblada.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://hisense.es/wp-content/uploads/2021/09/HS60240X-User-Manual-ES.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E3"
     ],
     "significado": "Fallo de desagüe.",
     "causas": [
      "Filtro obstruido",
      "Manguera de desagüe doblada",
      "Bomba de desagüe"
     ],
     "que_puede_hacer_el_cliente": "Limpiar los filtros del fondo de la cuba y comprobar la manguera de desagüe.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.hisense.es/wp-content/uploads/2021/02/HV603D40-User-Manual-ES.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E4"
     ],
     "significado": "Fallo del sensor de temperatura.",
     "causas": [
      "Sensor de temperatura (NTC) defectuoso o desconectado"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Sensor de temperatura (NTC)",
     "fuente": "https://hisense.es/wp-content/uploads/2021/09/HS60240X-User-Manual-ES.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E5"
     ],
     "significado": "Desbordamiento o fuga (agua en la base).",
     "causas": [
      "Exceso de agua o espuma",
      "Pequeña fuga interna"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo y desenchufar; el agua de la base debe retirarse antes de volver a usarlo.",
     "pieza_probable": "",
     "fuente": "https://hisense.es/wp-content/uploads/2021/09/HS60240X-User-Manual-ES.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E6"
     ],
     "significado": "Fuga de agua (en el modelo HV603D40).",
     "causas": [
      "Fuga interna detectada"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo y desenchufar el aparato.",
     "pieza_probable": "",
     "fuente": "https://www.hisense.es/wp-content/uploads/2021/02/HV603D40-User-Manual-ES.pdf",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E3"
     ],
     "significado": "Temperatura alta en el sensor de la placa (sobrecalentamiento).",
     "causas": [
      "Uso prolongado a máxima potencia",
      "Mala ventilación bajo la encimera",
      "Sensor"
     ],
     "que_puede_hacer_el_cliente": "Apagar y esperar a que la placa se enfríe antes de volver a usarla.",
     "pieza_probable": "",
     "fuente": "https://www.hisense.es/wp-content/uploads/2024/02/HI6321BSCE-743291-3838782757631-User-Manual-ES.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E1",
      "E2"
     ],
     "significado": "Depende del modelo: en HI6321BSCE tensión de red por encima (E1) o por debajo (E2) de la nominal; en HI6311BSHYCE fallo del sensor de temperatura (circuito abierto o cortocircuito).",
     "causas": [
      "Tensión de la red anómala",
      "Sensor de temperatura defectuoso"
     ],
     "que_puede_hacer_el_cliente": "Apagar la placa desde el magnetotérmico unos minutos y volver a conectar.",
     "pieza_probable": "Sensor de temperatura / placa de potencia",
     "fuente": "https://www.hisense.es/wp-content/uploads/2026/04/Manual-de-usuario-HI6311BSHYCE.pdf",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "Eb"
     ],
     "significado": "Fallo del sensor (modelo HI6311BSHYCE).",
     "causas": [
      "Sensor defectuoso"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "",
     "fuente": "https://www.hisense.es/wp-content/uploads/2026/04/Manual-de-usuario-HI6311BSHYCE.pdf",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "u"
     ],
     "significado": "Símbolo 'u' parpadeando: la placa se ha sobrecalentado (protección).",
     "causas": [
      "Sobrecalentamiento por uso prolongado",
      "Mala ventilación"
     ],
     "que_puede_hacer_el_cliente": "Esperar a que baje la temperatura y pulsar encendido/apagado para reiniciar.",
     "pieza_probable": "",
     "fuente": "https://www.hisense.es/wp-content/uploads/2024/02/HI6311BSCE-743290-3838782757471-User-Manual-ES.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "E1",
      "E2"
     ],
     "significado": "Error o fallo de un sensor de temperatura.",
     "causas": [
      "Sensor (termistor) defectuoso o desconectado",
      "Cableado"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Sensor de temperatura",
     "fuente": "https://www.hisense.es/wp-content/uploads/2021/12/RB470N4CIC-User-Guide-ES.pdf",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "F1"
     ],
     "significado": "Fallo del ventilador del congelador (según manual de servicio de modelo americano HRF266N6CSE); otras fuentes le dan otros significados.",
     "causas": [
      "Ventilador del congelador bloqueado o averiado"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que las puertas cierran bien.",
     "pieza_probable": "Motor ventilador del congelador",
     "fuente": "https://www.manualslib.com/manual/2984873/Hisense-Hrf266n6cse.html",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E1"
     ],
     "significado": "Gorenje: no entra agua en el tiempo previsto (algunas fuentes lo dan como sensor de fuga). Confirmar modelo.",
     "causas": [
      "Grifo cerrado o no abierto del todo",
      "Manguera de entrada doblada",
      "Aquastop bloqueado"
     ],
     "que_puede_hacer_el_cliente": "Abrir del todo el grifo y comprobar que la manguera de entrada no esté doblada.",
     "pieza_probable": "Electroválvula de entrada / Aquastop",
     "fuente": "https://grupomarcservice.com/gorenje-lavavajillas-fallos-codigos-de-error/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E2"
     ],
     "significado": "Gorenje: no desagua en el tiempo previsto y el programa se aborta.",
     "causas": [
      "Manguera de desagüe doblada",
      "Filtro atascado",
      "Bomba de desagüe"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro y comprobar la manguera de desagüe.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://grupomarcservice.com/gorenje-lavavajillas-fallos-codigos-de-error/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E3"
     ],
     "significado": "Gorenje: fallo de calentamiento (el agua no llega a la temperatura).",
     "causas": [
      "Resistencia averiada",
      "Sensor de temperatura (NTC)"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Resistencia de calentamiento / NTC",
     "fuente": "https://grupomarcservice.com/gorenje-lavavajillas-fallos-codigos-de-error/",
     "confianza": "media"
    }
   ]
  },
  {
   "familia": "LG",
   "marcas": [
    "LG"
   ],
   "notas": "LG España publica índices de errores por aparato (lavado-secado y lavavajillas) en lg.com/es; para frigoríficos y microondas la información oficial está en las bibliotecas de ayuda de LG de otros países (mismos códigos en los modelos europeos, pero pueden variar por modelo). En lavadoras LG la primera recomendación oficial suele ser desenchufar 60 segundos y volver a intentar. CL (bloqueo infantil) y PF (corte de luz) NO son averías. En frigoríficos los códigos aparecen como 'Er' + código (Er FF, Er dH...) y en frigoríficos americanos el modo DEMO desactiva el frío sin que haya avería. LG vende pocos hornos y placas en España: no se han incluido códigos de horno ni placa por falta de fuente fiable. Pedir siempre el modelo exacto (etiqueta en la puerta o lateral) porque algunos códigos (tE, AE) cambian de significado según modelo.",
   "codigos": [
    {
     "aparato": "lavadora",
     "codigos": [
      "IE"
     ],
     "significado": "No entra agua suficiente (error de entrada de agua).",
     "causas": [
      "Grifo cerrado o no abierto del todo",
      "Filtro de entrada de la manguera obstruido",
      "Poca presión de agua",
      "Manguera de entrada doblada o congelada"
     ],
     "que_puede_hacer_el_cliente": "Abrir del todo el grifo, comprobar que la manguera de entrada no esté doblada y que haya presión en otros grifos de la casa; desenchufar 60 segundos y volver a intentar.",
     "pieza_probable": "Electroválvula de entrada de agua",
     "fuente": "https://www.lg.com/es/posventa/guias-y-soluciones/lavado-secado/indice-errores",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "OE"
     ],
     "significado": "La lavadora no desagua (error de salida de agua).",
     "causas": [
      "Filtro de la bomba de desagüe atascado (monedas, horquillas, pelusa)",
      "Manguera de desagüe doblada u obstruida",
      "Bomba de desagüe averiada",
      "Agua congelada en invierno"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 60 segundos y volver a intentar; comprobar que la manguera de desagüe no esté doblada; limpiar el filtro de la bomba siguiendo el manual (con un recipiente y toallas, porque sale agua).",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.lg.com/es/posventa/guias-y-soluciones/lavado-secado/indice-errores",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "UE"
     ],
     "significado": "Carga desequilibrada: no puede centrifugar bien.",
     "causas": [
      "Ropa amontonada en un lado del tambor (mantas, una sola prenda grande)",
      "Lavadora mal nivelada",
      "Carga muy pequeña o muy grande"
     ],
     "que_puede_hacer_el_cliente": "Repartir la ropa por el tambor, añadir o quitar prendas y comprobar que la lavadora está nivelada y no cojea.",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/es/posventa/guias-y-soluciones/lavado-secado/indice-errores",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "dE",
      "dE1",
      "dE2"
     ],
     "significado": "Puerta abierta o que no se ha podido bloquear.",
     "causas": [
      "Puerta mal cerrada",
      "Ropa o un objeto pillado en la puerta",
      "Cierre de puerta (blocapuertas) defectuoso"
     ],
     "que_puede_hacer_el_cliente": "Abrir y cerrar la puerta con firmeza comprobando que no haya ropa en la goma; desenchufar 60 segundos y volver a intentar.",
     "pieza_probable": "Blocapuertas (cierre de puerta)",
     "fuente": "https://www.lg.com/es/posventa/guias-y-soluciones/lavado-secado/indice-errores",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "LE"
     ],
     "significado": "Motor bloqueado o sobrecargado.",
     "causas": [
      "Exceso de ropa",
      "Algo que frena el tambor",
      "Fallo del motor o de su electrónica"
     ],
     "que_puede_hacer_el_cliente": "Reducir la carga, dejar la lavadora parada 30 minutos y reiniciar el programa.",
     "pieza_probable": "Estator/motor o placa de control del motor",
     "fuente": "https://www.lg.com/es/posventa/guias-y-soluciones/lavado-secado/indice-errores",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "PE"
     ],
     "significado": "Error del sensor de presión (nivel de agua).",
     "causas": [
      "Sensor de presión/nivel averiado",
      "Tubo del presostato obstruido o suelto"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar unos minutos y volver a intentar; si se repite, requiere técnico.",
     "pieza_probable": "Presostato (sensor de nivel)",
     "fuente": "https://www.lg.com/es/posventa/guias-y-soluciones/lavado-secado/indice-errores",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "FE"
     ],
     "significado": "Llenado excesivo de agua (desbordamiento).",
     "causas": [
      "Electroválvula de entrada que no cierra",
      "Fallo del sensor de nivel"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo de agua y desenchufar la lavadora.",
     "pieza_probable": "Electroválvula de entrada de agua",
     "fuente": "https://www.lg.com/us/support/help-library/lg-front-load-washer-error-code-list--20155069413456",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "tE"
     ],
     "significado": "Error de calentamiento o del sensor de temperatura del agua.",
     "causas": [
      "Termistor (sensor de temperatura) defectuoso",
      "Fallo de la resistencia o su conexión"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 60 segundos y volver a intentar.",
     "pieza_probable": "Sensor de temperatura (NTC) / resistencia",
     "fuente": "https://www.lg.com/es/posventa/guias-y-soluciones/lavado-secado/indice-errores",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "AE",
      "E04"
     ],
     "significado": "Error de fuga de agua detectada.",
     "causas": [
      "Fuga interna (manguitos, junta, bomba)",
      "Exceso de espuma que se sale"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo, desenchufar y comprobar si hay agua en el suelo bajo la lavadora.",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/es/posventa/guias-y-soluciones/lavado-secado/indice-errores",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "CL"
     ],
     "significado": "NO es avería: bloqueo infantil activado (los botones no responden).",
     "causas": [
      "Se ha activado el bloqueo infantil (Child Lock)"
     ],
     "que_puede_hacer_el_cliente": "Desactivar el bloqueo infantil manteniendo pulsado unos 3 segundos el botón o la combinación de botones que indica el panel o el manual (suele llevar un icono de candado).",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/es/posventa/guias-y-soluciones/lavado-secado/indice-errores",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "PF"
     ],
     "significado": "NO es avería: ha habido un corte de luz o se desenchufó durante el ciclo.",
     "causas": [
      "Corte de corriente",
      "Enchufe flojo"
     ],
     "que_puede_hacer_el_cliente": "Volver a poner en marcha el programa; la lavadora retoma desde donde se quedó. Si se repite a menudo, revisar el enchufe.",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/us/support/help-library/lg-front-load-washer-error-code-list--20155069413456",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "Sud"
     ],
     "significado": "NO es avería: exceso de espuma; la lavadora añade un ciclo para eliminarla.",
     "causas": [
      "Demasiado detergente",
      "Detergente no apto para lavadora de carga frontal"
     ],
     "que_puede_hacer_el_cliente": "Esperar a que termine (puede alargar el ciclo unas 2 horas) y usar menos detergente en adelante.",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/us/support/help-library/lg-front-load-washer-error-code-list--20155069413456",
     "confianza": "media"
    },
    {
     "aparato": "lavadora-secadora",
     "codigos": [
      "dHE"
     ],
     "significado": "Error temporal de la función de secado.",
     "causas": [
      "Fallo puntual de la electrónica de secado",
      "Fallo del ventilador o resistencia de secado"
     ],
     "que_puede_hacer_el_cliente": "Apagar, desenchufar 10 segundos, volver a enchufar y reiniciar el ciclo.",
     "pieza_probable": "Resistencia o ventilador de secado",
     "fuente": "https://www.lg.com/es/posventa/guias-y-soluciones/lavado-secado/indice-errores",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "tE1",
      "tE2",
      "tE3",
      "tE4"
     ],
     "significado": "Error de un sensor de temperatura (termistor) del sistema de secado.",
     "causas": [
      "Termistor defectuoso",
      "Pelusa acumulada o evacuación obstruida",
      "tE2 puede aparecer con la estancia muy fría"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de pelusa, desenchufar 60 segundos y volver a intentar.",
     "pieza_probable": "Termistor (sensor de temperatura)",
     "fuente": "https://www.lg.com/es/posventa/guias-y-soluciones/lavado-secado/indice-errores",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "d80",
      "d90",
      "d95"
     ],
     "significado": "Aviso de conducto de evacuación obstruido (aprox. 80, 90 o 95 %); en secadoras de evacuación.",
     "causas": [
      "Tubo de salida aplastado, demasiado largo u obstruido",
      "Pelusa acumulada en el conducto"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de pelusa y comprobar que el tubo de evacuación no esté doblado ni tapado.",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/es/posventa/guias-y-soluciones/lavado-secado/indice-errores",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "CL"
     ],
     "significado": "NO es avería: bloqueo de controles/infantil activado.",
     "causas": [
      "Bloqueo infantil activado"
     ],
     "que_puede_hacer_el_cliente": "Mantener pulsados 3-5 segundos los botones marcados con el candado (en algunos modelos 'Temp' + 'Time Dry'; ver manual).",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/eastafrica/support/product-help/CT20279040-20153792977841",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "IE"
     ],
     "significado": "No entra la cantidad de agua necesaria.",
     "causas": [
      "Grifo cerrado",
      "Manguera de entrada doblada",
      "Filtro de entrada obstruido"
     ],
     "que_puede_hacer_el_cliente": "Abrir del todo el grifo y comprobar que la manguera de entrada no esté doblada.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.lg.com/es/soporte/guias-y-soluciones/lavavajillas/codigos-de-error-lavavajillas/",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "OE"
     ],
     "significado": "No desagua correctamente.",
     "causas": [
      "Filtro tapado por restos de comida",
      "Manguera de desagüe aplastada o doblada",
      "Bomba de desagüe"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro del fondo de la cuba y comprobar la manguera de desagüe.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.lg.com/es/soporte/guias-y-soluciones/lavavajillas/codigos-de-error-lavavajillas/",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "FE"
     ],
     "significado": "Exceso de agua: el lavavajillas activa la bomba de desagüe automáticamente.",
     "causas": [
      "Presión o suministro de agua excesivo",
      "Electroválvula que no cierra"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo y desenchufar el aparato.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.lg.com/us/support/help-library/lg-dishwasher-error-code-list--20150933422943",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "HE"
     ],
     "significado": "Fallo de calentamiento del agua.",
     "causas": [
      "Resistencia averiada",
      "Sobrecalentamiento del agua"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 60 segundos y volver a intentar.",
     "pieza_probable": "Resistencia de calentamiento",
     "fuente": "https://www.lg.com/us/support/help-library/lg-dishwasher-error-code-list--20150933422943",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "bE"
     ],
     "significado": "Exceso de espuma (el aparato se protege para evitar fugas).",
     "causas": [
      "Uso de lavavajillas a mano en vez de detergente para lavavajillas",
      "Exceso de detergente o abrillantador"
     ],
     "que_puede_hacer_el_cliente": "Usar solo detergente específico para lavavajillas y retirar la espuma de la cuba.",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/us/support/help-library/lg-dishwasher-error-code-list--20150933422943",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "LE"
     ],
     "significado": "Sobrecarga o bloqueo del motor.",
     "causas": [
      "Algo bloquea la bomba de lavado",
      "Fallo del motor"
     ],
     "que_puede_hacer_el_cliente": "Dejar el aparato parado 30 minutos y reiniciar el programa.",
     "pieza_probable": "Motor/bomba de lavado",
     "fuente": "https://www.lg.com/es/soporte/guias-y-soluciones/lavavajillas/codigos-de-error-lavavajillas/",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "nE"
     ],
     "significado": "Problema en los brazos aspersores: no distribuyen bien el agua.",
     "causas": [
      "Un objeto frena los brazos",
      "Orificios de los brazos obstruidos"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que ningún plato o cubierto frene los brazos, limpiar sus orificios, desenchufar 60 segundos y volver a intentar.",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/es/soporte/guias-y-soluciones/lavavajillas/codigos-de-error-lavavajillas/",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "CL"
     ],
     "significado": "NO es avería: bloqueo infantil activado.",
     "causas": [
      "Bloqueo infantil activado"
     ],
     "que_puede_hacer_el_cliente": "Mantener pulsado 3 segundos el botón Child Lock (o la combinación de dos botones que indique el manual).",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/es/soporte/guias-y-soluciones/lavavajillas/codigos-de-error-lavavajillas/",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "AE"
     ],
     "significado": "Según modelo: fuga de agua detectada; en la guía de LG España aparece descrito como bloqueo del panel. Confirmar con el manual.",
     "causas": [
      "Fuga de agua a la base",
      "Bloqueo de panel activado (según la guía española)"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo, desenchufar y comprobar si hay agua en el suelo; si no hay fuga, probar a quitar el bloqueo del panel.",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/es/soporte/guias-y-soluciones/lavavajillas/codigos-de-error-lavavajillas/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "tE"
     ],
     "significado": "Error térmico: agua demasiado caliente o fallo del termistor.",
     "causas": [
      "Termistor defectuoso",
      "Agua sobrecalentada"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 60 segundos y volver a intentar.",
     "pieza_probable": "Termistor (sensor de temperatura)",
     "fuente": "https://www.lg.com/us/support/help-library/lg-dishwasher-error-code-list--20150933422943",
     "confianza": "media"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "Er FF",
      "FF"
     ],
     "significado": "Fallo del ventilador del congelador.",
     "causas": [
      "Hielo/escarcha que bloquea el ventilador",
      "Motor del ventilador averiado"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que las puertas cierran bien y que nada tapa las salidas de aire; reiniciar desenchufando. No desmontar.",
     "pieza_probable": "Motor ventilador del congelador",
     "fuente": "https://www.lg.com/levant_en/support/product-help/CT20158016-20154835856064",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "Er rF",
      "rF"
     ],
     "significado": "Fallo del ventilador del compartimento frigorífico.",
     "causas": [
      "Escarcha acumulada",
      "Motor del ventilador averiado"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que la puerta cierra bien y reiniciar desenchufando.",
     "pieza_probable": "Motor ventilador del frigorífico",
     "fuente": "https://www.lg.com/levant_en/support/product-help/CT20158016-20154835856064",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "Er IF",
      "IF"
     ],
     "significado": "Fallo del ventilador o sensor de la fábrica de hielo.",
     "causas": [
      "Ventilador de la máquina de hielo bloqueado o averiado",
      "Sensor de la máquina de hielo desconectado"
     ],
     "que_puede_hacer_el_cliente": "Reiniciar el frigorífico desenchufándolo; si vuelve, avisar al técnico.",
     "pieza_probable": "Ventilador de la fábrica de hielo",
     "fuente": "https://www.lg.com/levant_en/support/product-help/CT20158016-20154835856064",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "Er dH",
      "dH"
     ],
     "significado": "Fallo de descongelación (desescarche).",
     "causas": [
      "Hielo acumulado en el evaporador",
      "Resistencia de desescarche averiada",
      "Fusible térmico fundido",
      "Placa de control"
     ],
     "que_puede_hacer_el_cliente": "Reiniciar el frigorífico; si vuelve, avisar al técnico porque bajará el rendimiento de frío.",
     "pieza_probable": "Resistencia de desescarche / fusible térmico",
     "fuente": "https://www.lg.com/levant_en/support/product-help/CT20158016-20154835856064",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "Er CO",
      "CO"
     ],
     "significado": "Fallo de comunicación entre la placa de control y la pantalla.",
     "causas": [
      "Cable o conector defectuoso",
      "Placa de control o de pantalla"
     ],
     "que_puede_hacer_el_cliente": "Reiniciar desenchufando; si vuelve a aparecer, dejar de usarlo y avisar al técnico.",
     "pieza_probable": "Placa de control / mazo de cables de la puerta",
     "fuente": "https://www.lg.com/levant_en/support/product-help/CT20158016-20154835856064",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "Er rS",
      "rS"
     ],
     "significado": "Fallo del sensor de temperatura del compartimento frigorífico.",
     "causas": [
      "Sensor (termistor) defectuoso o desconectado"
     ],
     "que_puede_hacer_el_cliente": "Reiniciar desenchufando; requiere técnico.",
     "pieza_probable": "Sensor de temperatura del frigorífico",
     "fuente": "https://www.lg.com/levant_en/support/product-help/CT20158016-20154835856064",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "Er FS",
      "FS"
     ],
     "significado": "Fallo del sensor de temperatura del congelador.",
     "causas": [
      "Sensor (termistor) del congelador defectuoso"
     ],
     "que_puede_hacer_el_cliente": "Reiniciar desenchufando; requiere técnico.",
     "pieza_probable": "Sensor de temperatura del congelador",
     "fuente": "https://www.lg.com/levant_en/support/product-help/CT20158016-20154835856064",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "Er 22",
      "22"
     ],
     "significado": "Problema en el relé del compresor.",
     "causas": [
      "Relé de arranque del compresor",
      "Compresor (compresores lineales/inverter)"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Relé de compresor / placa de control",
     "fuente": "https://www.lg.com/ae/support/product-help/CT20076062-20155399841849",
     "confianza": "media"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "Er 67",
      "67"
     ],
     "significado": "La puerta no cierra bien (hueco o algo que impide el cierre).",
     "causas": [
      "Un alimento o cajón impide cerrar la puerta",
      "Puerta desalineada"
     ],
     "que_puede_hacer_el_cliente": "Revisar que nada dentro impida cerrar la puerta y cerrarla bien.",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/ae/support/product-help/CT20076062-20155399841849",
     "confianza": "media"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "DEMO",
      "modo exposición"
     ],
     "significado": "NO es avería: modo demostración/exposición; el frigorífico enciende luces y pantalla pero no enfría.",
     "causas": [
      "Modo de exposición de tienda activado por error"
     ],
     "que_puede_hacer_el_cliente": "Desactivar el modo demo con la combinación de botones que indica el manual del modelo (varía según modelo).",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/us/support/help-library/lg-refrigerator-error-code-list--20155159406537",
     "confianza": "alta"
    },
    {
     "aparato": "microondas",
     "codigos": [
      "L",
      "Loc"
     ],
     "significado": "NO es avería: bloqueo infantil activado (las teclas no responden).",
     "causas": [
      "Bloqueo infantil activado"
     ],
     "que_puede_hacer_el_cliente": "Mantener pulsado unos 4 segundos el botón Stop/Cancelar o Start/Enter (según modelo) hasta que desaparezca la L o el candado.",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/us/support/help-library/lg-microwave-troubleshooting-the-keypad-not-responding--1429739856887",
     "confianza": "alta"
    },
    {
     "aparato": "microondas",
     "codigos": [
      "F2",
      "F3",
      "F4",
      "F5",
      "F11",
      "F13",
      "F14",
      "F15",
      "F16",
      "F17",
      "F19"
     ],
     "significado": "Códigos de fallo interno (modelos NeoChef): requieren servicio técnico.",
     "causas": [
      "Fallo de sensor, teclado o placa según el código"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar un minuto y volver a enchufar; si sigue, no usarlo y avisar al técnico.",
     "pieza_probable": "",
     "fuente": "https://www.lg.com/us/support/help-library/lg-microwave-error-codes--20150592554522",
     "confianza": "media"
    }
   ]
  },
  {
   "familia": "Liebherr",
   "marcas": [
    "Liebherr"
   ],
   "notas": "Liebherr no publica una tabla general de códigos; cada manual (home.liebherr.com/fridge-manuals, por número de servicio de la placa de características) trae los avisos de su modelo. Las fuentes de terceros no coinciden en el significado de F0, F2 y F3, así que no se incluyen. Solo F1 coincide entre fuentes (sensor de temperatura). Ante cualquier código F conviene anotar el número de servicio y el número de serie de la placa de características.",
   "codigos": [
    {
     "aparato": "frigorifico",
     "codigos": [
      "F1"
     ],
     "significado": "Fallo de un sensor de temperatura (según fuentes de terceros, del compartimento frigorífico o BioFresh); la temperatura puede ser incorrecta o fluctuar.",
     "causas": [
      "sensor NTC averiado",
      "cableado o conector del sensor en la placa"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que los alimentos se mantienen fríos y, si no, pasarlos a otro aparato; anotar el número de servicio de la placa de características.",
     "pieza_probable": "sensor de temperatura (NTC)",
     "fuente": "https://techfaultfix.com/es/refrigerators/liebherr/error-f1-refrigerator-or-biofresh-compartment-shows",
     "confianza": "media"
    }
   ]
  },
  {
   "familia": "Miele",
   "marcas": [
    "Miele"
   ],
   "notas": "Miele muestra 'Fallo Fxx' (o 'Anomalía Fxx') en pantalla; en modelos recientes a veces aparece texto ('Fallo de entrada de agua', 'Limpiar filtros') sin número. Los significados varían entre lavadora, lavavajillas, secadora y horno: el mismo número (p. ej. F11, F20, F55) significa cosas distintas según el aparato, así que confirmar siempre qué aparato es. Para muchos fallos técnicos Miele indica desconectar del automático (20 s a 2 min según el caso) y volver a conectar; si se repite, servicio técnico. Fuentes oficiales consultadas en las webs de soporte de Miele de Reino Unido, EE. UU., Canadá y Francia (los artículos son los mismos que en miele.es). Lavadora-secadora comparte los códigos de entrada y desagüe con la lavadora.",
   "codigos": [
    {
     "aparato": "lavadora",
     "codigos": [
      "F10"
     ],
     "significado": "Fallo de entrada de agua.",
     "causas": [
      "Grifo cerrado o poco abierto",
      "Filtro de la entrada de agua sucio",
      "Presión de agua demasiado baja",
      "Electroválvula de entrada averiada"
     ],
     "que_puede_hacer_el_cliente": "Abrir el grifo del todo y comprobar que la manguera no esté doblada; limpiar el filtro de la entrada si el manual lo indica.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://mieleusa.com/support/customer-assistance/washer-1323/all/fault_f10-93198268811",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F11"
     ],
     "significado": "Fallo de desagüe: el desagüe está restringido.",
     "causas": [
      "Filtros de desagüe sucios",
      "Extremo de la manguera de desagüe demasiado alto (máx. 1 m)",
      "Manguera doblada",
      "Bomba de desagüe bloqueada o averiada"
     ],
     "que_puede_hacer_el_cliente": "Vaciar y limpiar con cuidado el filtro de desagüe (tapa inferior) y volver a colocarlo bien apretado; comprobar la altura y que la manguera no esté doblada.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://mieleusa.com/support/customer-assistance/washer-1323/all/fault_f11-93199759115",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F15"
     ],
     "significado": "Problema con la entrada de agua caliente (en modelos con toma de agua caliente). Las fuentes no oficiales no coinciden del todo.",
     "causas": [
      "Grifo de agua caliente cerrado",
      "Manguera o filtro de entrada de agua caliente",
      "Agua de entrada demasiado caliente"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo de agua caliente está abierto y la manguera bien conectada.",
     "pieza_probable": "",
     "fuente": "https://www.tuexperto.com/2023/08/04/que-significa-el-codigo-de-error-de-mi-lavadora-miele-y-como-solucionarlo/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F16"
     ],
     "significado": "Exceso de espuma / detergente.",
     "causas": [
      "Demasiado detergente o aditivos (quitamanchas)",
      "Detergente no apto para lavadora"
     ],
     "que_puede_hacer_el_cliente": "Reducir la dosis de detergente y no usar aditivos que generen espuma.",
     "pieza_probable": "",
     "fuente": "https://www.domex-uk.co.uk/help-advice/miele-washing-machine-fault-codes/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F19"
     ],
     "significado": "Las fuentes no coinciden: fallo del caudalímetro de entrada de agua o del sensor de nivel.",
     "causas": [
      "Caudalímetro averiado",
      "Presostato/sensor de nivel con fallo"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Caudalímetro / sensor de nivel",
     "fuente": "https://www.domex-uk.co.uk/help-advice/miele-washing-machine-fault-codes/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F20"
     ],
     "significado": "Fallo de calentamiento. Puede ser normal si se ha activado el Thermostop: el programa sigue al alcanzar la temperatura.",
     "causas": [
      "Resistencia calefactora averiada",
      "Sonda de temperatura",
      "Thermostop activado (situación normal, no avería)"
     ],
     "que_puede_hacer_el_cliente": "Esperar a ver si el programa continúa solo; si no, apagar y encender.",
     "pieza_probable": "Resistencia calefactora / sonda NTC",
     "fuente": "https://www.miele.ca/en/support/customer-assistance/washer-1323/all/fault_f20_or_heating_fault-93190924171",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F34"
     ],
     "significado": "Fallo del bloqueo de la puerta.",
     "causas": [
      "Tambor sobrecargado",
      "Puerta mal cerrada",
      "Cierre de puerta averiado"
     ],
     "que_puede_hacer_el_cliente": "Respetar la carga máxima; desenchufar al menos 2 minutos y volver a encender.",
     "pieza_probable": "Cierre de puerta",
     "fuente": "https://www.miele.co.uk/support/customer-assistance/washing_machine-1243/all/fault_f34_or_door_lock-153279294987",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F35"
     ],
     "significado": "Fallo de desbloqueo de la puerta (no se libera el cierre).",
     "causas": [
      "Cierre de puerta averiado"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar unos minutos y volver a encender.",
     "pieza_probable": "Cierre de puerta",
     "fuente": "https://www.miele.co.uk/support/customer-assistance/washing_machine-1243/all/fault_f35_or_door_release-164084655883",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F53"
     ],
     "significado": "Fallo del sensor de velocidad (tacómetro) del motor / accionamiento del tambor.",
     "causas": [
      "Sensor de velocidad del motor",
      "Motor o electrónica del motor"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Tacómetro / motor",
     "fuente": "https://www.domex-uk.co.uk/help-advice/miele-washing-machine-fault-codes/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora-secadora",
     "codigos": [
      "F10"
     ],
     "significado": "Fallo de entrada de agua.",
     "causas": [
      "Grifo cerrado",
      "Filtro de entrada sucio",
      "Presión de agua baja"
     ],
     "que_puede_hacer_el_cliente": "Abrir el grifo del todo y revisar la manguera de entrada.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://miele.co.uk/support/customer-assistance/washer_dryer-1244/all/fault_f10-93198268811",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora-secadora",
     "codigos": [
      "F11"
     ],
     "significado": "Fallo de desagüe: desagüe restringido.",
     "causas": [
      "Filtros de desagüe sucios",
      "Manguera de desagüe demasiado alta o doblada",
      "Bomba de desagüe"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de desagüe con cuidado y revisar la manguera.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.miele.co.uk/support/customer-assistance/washer_dryer-1244/all/fault_f11-108358209547",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F11"
     ],
     "significado": "No desagua: queda agua en la cuba.",
     "causas": [
      "Filtros del fondo obstruidos",
      "Manguera de desagüe doblada",
      "Bomba de desagüe o válvula antirretorno bloqueada"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar, limpiar el conjunto de filtros del fondo y comprobar que la manguera de desagüe no esté doblada.",
     "pieza_probable": "Bomba de desagüe / válvula antirretorno",
     "fuente": "https://www.miele.fr/support/customer-assistance/lave_vaisselle-572/toutes_les_categories/anomalie_f11_g1xxx_g6xxx-92911423883",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F12"
     ],
     "significado": "Fallo de entrada de agua: entrada bloqueada o restringida.",
     "causas": [
      "Grifo cerrado",
      "Filtro de la entrada sucio",
      "Manguera doblada"
     ],
     "que_puede_hacer_el_cliente": "Abrir el grifo del todo y comprobar la manguera de entrada.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://miele.co.uk/support/customer-assistance/dishwashing-1236/all/fault_f12_water_inlet-92678499851",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F13"
     ],
     "significado": "Fallo de entrada de agua al final de la fase de llenado.",
     "causas": [
      "Suministro de agua insuficiente",
      "Electroválvula de entrada",
      "Caudalímetro"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto del todo.",
     "pieza_probable": "Electroválvula / caudalímetro",
     "fuente": "https://www.domex-uk.co.uk/help-advice/what-are-the-common-miele-dishwasher-fault-codes/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F14"
     ],
     "significado": "Fallo de entrada de agua relacionado con el presostato de la bomba o del calentamiento (las fuentes no coinciden).",
     "causas": [
      "Presostato del calentamiento",
      "Bomba pegada tras semanas sin uso (según fuentes no oficiales)"
     ],
     "que_puede_hacer_el_cliente": "Apagar y encender el aparato.",
     "pieza_probable": "Presostato",
     "fuente": "https://www.miele.ca/en/support/customer-assistance/dishwashing-1316/all/fault_f14-143482921867",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F15"
     ],
     "significado": "Fallo de entrada de agua: entrada bloqueada o restringida.",
     "causas": [
      "Grifo cerrado",
      "Filtro de la entrada sucio"
     ],
     "que_puede_hacer_el_cliente": "Abrir el grifo del todo y comprobar la manguera de entrada.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.miele.co.uk/support/customer-assistance/dishwashing-1236/all/fault_f15_water_inlet-92735715595",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F70"
     ],
     "significado": "Sistema Waterproof activado (fuga detectada): se cancela el programa y se activa la bomba de desagüe.",
     "causas": [
      "Fuga interna a la bandeja inferior",
      "Manguitos o juntas con pérdida",
      "Flotador del sistema Waterproof atascado"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo del agua, apagar el aparato y desenchufarlo.",
     "pieza_probable": "Según la fuga: manguito/junta; flotador del sistema Waterproof",
     "fuente": "https://www.miele.co.uk/support/customer-assistance/dishwashing-1236/all/fault_f70_waterproof_system-92659753867",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F78"
     ],
     "significado": "Fallo de la bomba de circulación (fallo técnico).",
     "causas": [
      "Bomba de circulación averiada o bloqueada"
     ],
     "que_puede_hacer_el_cliente": "Apagar, esperar unos minutos y volver a encender.",
     "pieza_probable": "Bomba de circulación",
     "fuente": "https://www.domex-uk.co.uk/help-advice/what-are-the-common-miele-dishwasher-fault-codes/",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "F66"
     ],
     "significado": "Filtros de pelusa sucios.",
     "causas": [
      "Filtros de pelusa obstruidos",
      "Intercambiador de calor sucio",
      "Filtro del zócalo sucio o colocado mojado"
     ],
     "que_puede_hacer_el_cliente": "Limpiar los filtros de pelusa, revisar el intercambiador y aclarar el filtro del zócalo bajo el grifo; escurrirlo bien antes de colocarlo.",
     "pieza_probable": "",
     "fuente": "https://www.miele.co.uk/support/customer-assistance/tumble_dryer-1242/all/fault_f66-91861736203",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "F55"
     ],
     "significado": "La ropa no está seca tras el tiempo máximo de secado (180 minutos).",
     "causas": [
      "Filtros de pelusa o del zócalo sucios",
      "Carga excesiva",
      "Fallo del sistema de secado"
     ],
     "que_puede_hacer_el_cliente": "Limpiar los filtros de pelusa y del zócalo y no sobrecargar.",
     "pieza_probable": "",
     "fuente": "https://www.miele.co.uk/support/customer-assistance/tumble_dryer-1242/all/fault_f55-91860611595",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "F43"
     ],
     "significado": "Tipo de modelo no programado o variante incorrecta: fallo técnico no reparable por el usuario.",
     "causas": [
      "Configuración de la electrónica incorrecta (p. ej. tras cambiar la placa)"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Reprogramación / placa electrónica",
     "fuente": "https://mieleusa.com/support/customer-assistance/tumble_dryer-1322/all/fault_f43-91864972683",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "Limpiar vías de aire",
      "Información: limpiar conductos"
     ],
     "significado": "Aviso de mantenimiento: las vías de aire (filtros) necesitan limpieza.",
     "causas": [
      "Filtros de pelusa o del zócalo sucios"
     ],
     "que_puede_hacer_el_cliente": "Limpiar los filtros de pelusa y el del zócalo según el manual.",
     "pieza_probable": "",
     "fuente": "https://miele.co.uk/support/customer-assistance/tumble_dryer-1242/all/information_clean_out_airwaysend_of_programme-91858401419",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "Vaciar depósito de agua condensada"
     ],
     "significado": "El depósito de agua condensada está lleno o la manguera de desagüe está doblada.",
     "causas": [
      "Depósito lleno",
      "Manguera de desagüe doblada"
     ],
     "que_puede_hacer_el_cliente": "Vaciar el depósito y comprobar la manguera; si el mensaje vuelve tras reiniciar, servicio técnico.",
     "pieza_probable": "Bomba de agua condensada (si el mensaje se repite)",
     "fuente": "https://www.manualslib.com/manual/528308/Miele-T-4452-C.html?page=33",
     "confianza": "alta"
    },
    {
     "aparato": "horno",
     "codigos": [
      "F33"
     ],
     "significado": "El bloqueo de la puerta de la pirólisis no se abre.",
     "causas": [
      "Cerradura de pirólisis averiada",
      "Objeto entre la puerta y el horno"
     ],
     "que_puede_hacer_el_cliente": "Interrumpir la pirólisis apagando el horno y comprobar que no haya nada atrapado en la puerta.",
     "pieza_probable": "Cerradura de puerta de pirólisis",
     "fuente": "https://www.miele.co.uk/support/customer-assistance/oven-1229/all/fault_f33-91151768203",
     "confianza": "alta"
    },
    {
     "aparato": "horno",
     "codigos": [
      "F44"
     ],
     "significado": "Fallo técnico (electrónica).",
     "causas": [
      "Fallo de comunicación o de la electrónica"
     ],
     "que_puede_hacer_el_cliente": "Desconectar el horno del automático 20 segundos y volver a conectar.",
     "pieza_probable": "Placa electrónica",
     "fuente": "https://www.mieleusa.com/support/customer-assistance/oven-1309/all/fault_f44-91179117963",
     "confianza": "alta"
    },
    {
     "aparato": "horno",
     "codigos": [
      "F20"
     ],
     "significado": "Horno de vapor / combinado: la temperatura no sube al menos 2 °C en 5 minutos al inicio del calentamiento.",
     "causas": [
      "Fallo de calentamiento",
      "Sonda de temperatura"
     ],
     "que_puede_hacer_el_cliente": "Apagar y encender el aparato y reiniciar el programa.",
     "pieza_probable": "Resistencia / sonda de temperatura",
     "fuente": "https://miele.co.uk/support/customer-assistance/steam_oven-1230/all/fault_f20-91501471243",
     "confianza": "alta"
    },
    {
     "aparato": "horno",
     "codigos": [
      "F55"
     ],
     "significado": "Desconexión automática de seguridad por uso muy prolongado.",
     "causas": [
      "Tiempo máximo de funcionamiento superado"
     ],
     "que_puede_hacer_el_cliente": "Apagar y volver a encender el horno.",
     "pieza_probable": "",
     "fuente": "https://www.coolblue.nl/en/advice/how-do-you-solve-error-codes-with-a-miele-oven.html",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "F"
     ],
     "significado": "Uno o varios sensores táctiles cubiertos más de unos 10 segundos (dedo, derrame, objeto o restos de cal).",
     "causas": [
      "Derrame de comida sobre los mandos",
      "Objeto apoyado sobre el panel",
      "Restos de cal secos"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el panel de mandos con un paño suave y retirar objetos; la F se apaga sola.",
     "pieza_probable": "",
     "fuente": "https://www.miele.co.uk/support/customer-assistance/hob-1232/all/fault_f-92670031883",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "FE44"
     ],
     "significado": "La placa se ha sobrecalentado.",
     "causas": [
      "Ventilador obstruido por objetos en el cajón inferior",
      "Polvo en la ventilación",
      "Uso intenso prolongado"
     ],
     "que_puede_hacer_el_cliente": "Dejar enfriar y comprobar que nada del cajón de debajo tapa el ventilador.",
     "pieza_probable": "Ventilador de refrigeración (si se repite)",
     "fuente": "https://miele.co.uk/support/customer-assistance/hob-1232/all/fault_fe44-92683636491",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "Err 039",
      "Err 040",
      "Err 408",
      "Err 412"
     ],
     "significado": "Fallo del módulo electrónico (parpadea junto al temporizador).",
     "causas": [
      "Módulo electrónico averiado"
     ],
     "que_puede_hacer_el_cliente": "Desconectar la placa del automático aproximadamente 1 minuto y volver a conectar.",
     "pieza_probable": "Módulo electrónico",
     "fuente": "https://www.miele.co.uk/support/customer-assistance/hob-1232/all/err_039_040_408_or_412-153373176331",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "Alarma de temperatura",
      "indicador de temperatura parpadeando"
     ],
     "significado": "La temperatura interior ha subido por encima de la ajustada.",
     "causas": [
      "Puerta abierta con demasiada frecuencia o mucho tiempo",
      "Mucha comida introducida a la vez",
      "Corte de corriente"
     ],
     "que_puede_hacer_el_cliente": "Cerrar bien la puerta y esperar: la alarma y el parpadeo se apagan solos al recuperar la temperatura.",
     "pieza_probable": "",
     "fuente": "https://www.mieleusa.com/support/customer-assistance/refrigeration-1317/all/temperature_alarm_sounds_and_temperature_display_flashing-91879645579",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "Alarma de puerta"
     ],
     "significado": "La puerta lleva abierta más de 60 segundos.",
     "causas": [
      "Puerta mal cerrada o abierta"
     ],
     "que_puede_hacer_el_cliente": "Cerrar la puerta y comprobar que nada impide el cierre.",
     "pieza_probable": "",
     "fuente": "https://manualslib.com/manual/714489/Miele-Kdn-37132-Id.html?page=42",
     "confianza": "media"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "F (parpadeando en el indicador de temperatura)"
     ],
     "significado": "Fallo del aparato; el manual remite al servicio técnico (modelos antiguos).",
     "causas": [
      "Avería de sensor o electrónica"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "",
     "fuente": "https://www.manualslib.com/manual/528233/Miele-F-1354-S.html?page=29",
     "confianza": "media"
    }
   ]
  },
  {
   "familia": "Samsung",
   "marcas": [
    "Samsung"
   ],
   "notas": "Samsung usa la misma cifra con terminación C (modelos nuevos) o E (modelos antiguos): 4C = 4E, 5C = 5E, dC = dE, etc. En lavadoras, tras mostrar un código los botones pueden quedar desactivados unos 3 minutos. Primer paso habitual oficial: apagar, cortar la corriente 30 segundos o más y volver a encender. En frigoríficos, 'OF OF' / 'O FF' es el modo demostración (cooling off), NO una avería. En hornos y microondas casi todos los códigos C-xx se intentan primero con apagado y corte de corriente de 30 segundos. No se encontró fuente fiable para códigos de placas de inducción Samsung: no se incluyen. Algunos códigos (dC, 8C, 1C, PC) cambian de significado según modelo: pedir siempre el modelo.",
   "codigos": [
    {
     "aparato": "lavadora",
     "codigos": [
      "4C",
      "4E",
      "E1"
     ],
     "significado": "No entra agua (fallo de suministro de agua).",
     "causas": [
      "Grifo cerrado",
      "Manguera de entrada doblada o congelada",
      "Filtro de malla de la entrada obstruido"
     ],
     "que_puede_hacer_el_cliente": "Abrir del todo el grifo, comprobar que la manguera no esté doblada y limpiar el filtro de malla de la entrada si el manual lo indica.",
     "pieza_probable": "Electroválvula de entrada de agua",
     "fuente": "https://www.samsung.com/co/support/home-appliances/check-out-the-information-codes-on-my-washing-machine/",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "5C",
      "5E"
     ],
     "significado": "No desagua.",
     "causas": [
      "Filtro de la bomba obstruido",
      "Manguera de desagüe doblada u obstruida",
      "Bomba de desagüe averiada"
     ],
     "que_puede_hacer_el_cliente": "Comprobar la manguera de desagüe y limpiar el filtro de la bomba según el manual (sale agua: poner recipiente y toallas).",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.samsung.com/co/support/home-appliances/check-out-the-information-codes-on-my-washing-machine/",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "dC",
      "dE",
      "dE1"
     ],
     "significado": "Puerta abierta o mal cerrada (en algún modelo dC indica desequilibrio).",
     "causas": [
      "Puerta mal cerrada",
      "Ropa pillada en la puerta",
      "Blocapuertas defectuoso"
     ],
     "que_puede_hacer_el_cliente": "Cerrar bien la puerta comprobando que no haya ropa pillada; apagar y encender; comprobar que no esté activo el bloqueo infantil.",
     "pieza_probable": "Blocapuertas",
     "fuente": "https://www.samsung.com/co/support/home-appliances/check-out-the-information-codes-on-my-washing-machine/",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "Ub",
      "UE",
      "UB"
     ],
     "significado": "Carga desequilibrada: no centrifuga.",
     "causas": [
      "Ropa mal repartida o una sola prenda grande",
      "Lavadora mal nivelada"
     ],
     "que_puede_hacer_el_cliente": "Repartir la ropa, comprobar que la lavadora está nivelada sobre suelo firme y volver a centrifugar.",
     "pieza_probable": "",
     "fuente": "https://www.samsung.com/co/support/home-appliances/check-out-the-information-codes-on-my-washing-machine/",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "OC",
      "OE",
      "OF"
     ],
     "significado": "Desbordamiento: demasiada agua en la lavadora.",
     "causas": [
      "Exceso de detergente/espuma",
      "Electroválvula que no cierra",
      "Sensor de nivel"
     ],
     "que_puede_hacer_el_cliente": "Apagar y volver a encender para que la bomba vacíe el tambor; usar menos detergente. Si sigue entrando agua, cerrar el grifo.",
     "pieza_probable": "Electroválvula de entrada / sensor de nivel",
     "fuente": "https://www.samsung.com/uk/support/home-appliances/what-do-the-codes-on-my-washing-machine-mean/",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "UC"
     ],
     "significado": "Tensión eléctrica inestable (fluctuación de voltaje).",
     "causas": [
      "Uso de alargadera o regleta",
      "Enchufe flojo",
      "Problema de la instalación eléctrica"
     ],
     "que_puede_hacer_el_cliente": "Enchufar directamente a la pared, sin alargaderas ni regletas, y comprobar que el enchufe esté firme.",
     "pieza_probable": "",
     "fuente": "https://www.samsung.com/uk/support/home-appliances/what-do-the-codes-on-my-washing-machine-mean/",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "HC",
      "HE",
      "HE1"
     ],
     "significado": "Problema de temperatura del agua / calentamiento.",
     "causas": [
      "Manguera conectada a toma de agua caliente",
      "Resistencia averiada"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que la manguera esté conectada a la toma de agua fría.",
     "pieza_probable": "Resistencia de calentamiento",
     "fuente": "https://www.samsung.com/uk/support/home-appliances/what-do-the-codes-on-my-washing-machine-mean/",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "tC",
      "tE",
      "tC1"
     ],
     "significado": "Fallo del sensor de temperatura (termistor).",
     "causas": [
      "Termistor defectuoso o desconectado"
     ],
     "que_puede_hacer_el_cliente": "Apagar, desenchufar un minuto y volver a intentar.",
     "pieza_probable": "Sensor de temperatura (NTC)",
     "fuente": "https://www.samsung.com/latin_en/support/home-appliances/check-out-the-information-codes-on-my-washing-machine/",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "3C",
      "3E"
     ],
     "significado": "Error del motor.",
     "causas": [
      "Exceso de carga",
      "Algo frena el tambor",
      "Motor o su electrónica"
     ],
     "que_puede_hacer_el_cliente": "Apagar de la red, esperar un minuto, aligerar la carga y reiniciar el programa.",
     "pieza_probable": "Motor / placa inverter",
     "fuente": "https://www.samsung.com/uk/support/home-appliances/what-do-the-codes-on-my-washing-machine-mean/",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "LC",
      "LE",
      "LC1"
     ],
     "significado": "Nivel de agua bajo o fuga detectada (según modelo).",
     "causas": [
      "Manguera de desagüe colocada por debajo de la base (efecto sifón)",
      "Fuga de agua"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que la manguera de desagüe esté colgada a la altura correcta y no por debajo de la lavadora; buscar agua en el suelo.",
     "pieza_probable": "",
     "fuente": "https://www.samsung.com/uk/support/home-appliances/what-do-the-codes-on-my-washing-machine-mean/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "1C",
      "1E"
     ],
     "significado": "Fallo del sensor de nivel de agua (en algunos modelos se agrupa con fugas).",
     "causas": [
      "Sensor de nivel (presostato) defectuoso"
     ],
     "que_puede_hacer_el_cliente": "Apagar, desenchufar y volver a intentar.",
     "pieza_probable": "Sensor de nivel de agua",
     "fuente": "https://www.samsung.com/latin_en/support/home-appliances/samsung-washing-machine-error-codes-and-information/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "Sud",
      "SUdS"
     ],
     "significado": "NO es avería: exceso de espuma; la lavadora se para un rato y continúa sola.",
     "causas": [
      "Demasiado detergente",
      "Detergente no apto (no HE)"
     ],
     "que_puede_hacer_el_cliente": "Esperar a que continúe sola y usar menos detergente en adelante.",
     "pieza_probable": "",
     "fuente": "https://ushl.samsung.com/latin/support/home-appliances/why-does-my-washing-machine-show-sdu-on-the-screen",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "8C",
      "8E"
     ],
     "significado": "Según fuentes: fallo del sensor de vibración (MEMS); otras lo relacionan con exceso de espuma. Confirmar modelo.",
     "causas": [
      "Sensor de vibración",
      "Exceso de espuma"
     ],
     "que_puede_hacer_el_cliente": "Apagar, desenchufar y volver a intentar con menos detergente.",
     "pieza_probable": "",
     "fuente": "https://www.ifixit.com/Troubleshooting/Samsung_Washing_Machine/Error+Codes/536061",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "tC",
      "tE"
     ],
     "significado": "Problema del sensor de temperatura del aire.",
     "causas": [
      "Filtro de pelusa o intercambiador de calor obstruido",
      "Ventilación obstruida",
      "Sensor defectuoso"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de pelusa y el intercambiador (si el manual lo permite) y comprobar que la secadora ventile bien.",
     "pieza_probable": "Sensor de temperatura (termistor)",
     "fuente": "https://www.samsung.com/es/support/home-appliances/check-the-information-codes-of-the-dryer/",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "HC",
      "HE"
     ],
     "significado": "Sobrecalentamiento (del compresor en secadoras de bomba de calor).",
     "causas": [
      "Filtro de pelusa obstruido",
      "Fallo del compresor o calefacción"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de pelusa y revisar si ha saltado el diferencial; rearmarlo si es necesario.",
     "pieza_probable": "",
     "fuente": "https://www.samsung.com/es/support/home-appliances/check-the-information-codes-of-the-dryer/",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "5C",
      "5E"
     ],
     "significado": "Fallo de drenaje del agua condensada o depósito lleno.",
     "causas": [
      "Depósito de agua lleno",
      "Manguera de drenaje doblada o congelada",
      "Bomba de drenaje"
     ],
     "que_puede_hacer_el_cliente": "Vaciar el depósito de agua, comprobar la manguera de drenaje (si la tiene) y volver a empezar.",
     "pieza_probable": "Bomba de drenaje de condensados",
     "fuente": "https://www.samsung.com/es/support/home-appliances/check-the-information-codes-of-the-dryer/",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "dC",
      "dE"
     ],
     "significado": "Puerta abierta o mal cerrada.",
     "causas": [
      "Puerta mal cerrada",
      "Bloqueo infantil activo",
      "Interruptor de puerta"
     ],
     "que_puede_hacer_el_cliente": "Cerrar bien la puerta y comprobar si está activado el bloqueo infantil.",
     "pieza_probable": "Interruptor de puerta",
     "fuente": "https://www.samsung.com/es/support/home-appliances/check-the-information-codes-of-the-dryer/",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "9C1",
      "9E1"
     ],
     "significado": "Problema de tensión de alimentación o del control electrónico.",
     "causas": [
      "Uso de alargadera",
      "Enchufe defectuoso",
      "Placa de control"
     ],
     "que_puede_hacer_el_cliente": "Enchufar directamente a la pared sin alargadera y comprobar el enchufe.",
     "pieza_probable": "",
     "fuente": "https://www.samsung.com/latin/support/home-appliances/check-the-information-codes-of-the-dryer/",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "NC",
      "NC1"
     ],
     "significado": "Problema con el filtro de pelusa (filtro no colocado o mal colocado).",
     "causas": [
      "Filtro ausente, mal colocado o muy sucio"
     ],
     "que_puede_hacer_el_cliente": "Revisar que el filtro de pelusa esté limpio y bien colocado.",
     "pieza_probable": "",
     "fuente": "https://www.samsung.com/es/support/home-appliances/check-the-information-codes-of-the-dryer/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "4C",
      "4E"
     ],
     "significado": "No recibe agua con la presión o temperatura necesarias.",
     "causas": [
      "Llave de paso cerrada",
      "Manguera o válvula de entrada congelada u obstruida"
     ],
     "que_puede_hacer_el_cliente": "Abrir del todo la llave de paso y comprobar que la manguera de entrada no esté doblada.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.samsung.com/es/support/home-appliances/que-significan-los-codigos-5c-5e-4c-4e-y-lc-le-de-tu-lavavajillas/",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "5C",
      "5E"
     ],
     "significado": "No desagua.",
     "causas": [
      "Filtro obstruido",
      "Manguera de desagüe doblada",
      "Desagüe de la casa atascado",
      "Bomba de desagüe"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro y comprobar que la manguera de desagüe no esté doblada.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.samsung.com/es/support/home-appliances/que-significan-los-codigos-5c-5e-4c-4e-y-lc-le-de-tu-lavavajillas/",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "LC",
      "LE"
     ],
     "significado": "Fuga detectada: el sensor de fugas detecta agua (el aparato no se apaga e intenta desaguar).",
     "causas": [
      "Fuga interna de agua a la base",
      "Reflector de agua bloqueado (modelos WaterWall)"
     ],
     "que_puede_hacer_el_cliente": "Cerrar la llave de agua y bajar el diferencial/magnetotérmico del lavavajillas.",
     "pieza_probable": "",
     "fuente": "https://www.samsung.com/es/support/home-appliances/que-significan-los-codigos-5c-5e-4c-4e-y-lc-le-de-tu-lavavajillas/",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "3C",
      "3E"
     ],
     "significado": "Fallo de funcionamiento de la bomba/motor (puede estar relacionado con el dispensador de detergente).",
     "causas": [
      "Pastilla atascada en el dispensador",
      "Bomba de lavado"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que la pastilla de detergente no esté atascada en el cajetín.",
     "pieza_probable": "Bomba de lavado",
     "fuente": "https://www.samsung.com/es/support/home-appliances/que-significan-los-codigos-que-muestra-tu-lavavajillas/",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "HC",
      "HE"
     ],
     "significado": "Problema de calentamiento / temperatura demasiado alta.",
     "causas": [
      "Resistencia o sensor de temperatura"
     ],
     "que_puede_hacer_el_cliente": "Apagar al menos 5 minutos y hacer un ciclo normal con la cuba vacía y detergente.",
     "pieza_probable": "Resistencia / sensor de temperatura",
     "fuente": "https://www.samsung.com/latin/support/home-appliances/samsung-dishwasher-error-codes/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "AC",
      "AE"
     ],
     "significado": "Fallo de comunicación entre la placa principal y otras partes.",
     "causas": [
      "Picos o cortes de tensión",
      "Conexión entre placas"
     ],
     "que_puede_hacer_el_cliente": "Cortar la corriente un minuto y volver a encender; si desaparece fue un fallo temporal.",
     "pieza_probable": "",
     "fuente": "https://www.samsung.com/latin/support/home-appliances/samsung-dishwasher-error-codes/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "PC",
      "PE"
     ],
     "significado": "Según fuente: error de la válvula divisora/Zone Wash o del sensor de temperatura. Confirmar modelo.",
     "causas": [
      "Válvula divisora",
      "Sensor de temperatura"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "",
     "fuente": "https://www.samsung.com/latin/support/home-appliances/samsung-dishwasher-error-codes/",
     "confianza": "media"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "OF OF",
      "O FF"
     ],
     "significado": "NO es avería: modo demostración/exposición (cooling off); luces y pantalla funcionan pero no enfría.",
     "causas": [
      "Modo tienda activado por error"
     ],
     "que_puede_hacer_el_cliente": "Mantener pulsados a la vez los dos botones que indica el manual (p. ej. Frigorífico + Power Cool) unos segundos hasta oír un pitido; si no funciona, desenchufar 2 minutos y volver a enchufar.",
     "pieza_probable": "",
     "fuente": "https://www.samsung.com/latin/support/home-appliances/samsung-refigerator-error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "21E",
      "21C"
     ],
     "significado": "Fallo del ventilador del congelador.",
     "causas": [
      "Ventilador bloqueado por hielo",
      "Motor del ventilador defectuoso",
      "Puerta dejada abierta"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que las puertas cierran bien; la descongelación debe hacerla preferiblemente el técnico.",
     "pieza_probable": "Motor ventilador del congelador",
     "fuente": "https://www.samsung.com/latin/support/home-appliances/samsung-refigerator-error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "22E",
      "22C"
     ],
     "significado": "Fallo del ventilador del frigorífico.",
     "causas": [
      "Puerta abierta demasiado tiempo",
      "Hielo en el ventilador",
      "Motor del ventilador"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que la puerta cierra bien. Samsung sugiere desenchufarlo unas horas con las puertas abiertas (vaciando antes los alimentos).",
     "pieza_probable": "Motor ventilador del frigorífico",
     "fuente": "https://www.samsung.com/latin/support/home-appliances/samsung-refigerator-error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "33E",
      "33C"
     ],
     "significado": "Fallo de la resistencia del conducto de hielo (frigoríficos con dispensador).",
     "causas": [
      "Resistencia del conducto de hielo averiada"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Resistencia del conducto de hielo",
     "fuente": "https://www.samsung.com/latin/support/home-appliances/samsung-refigerator-error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "39E",
      "39C"
     ],
     "significado": "Fallo de funcionamiento de la máquina de hielo.",
     "causas": [
      "Fábrica de hielo atascada o averiada"
     ],
     "que_puede_hacer_el_cliente": "Reiniciar desenchufando unos minutos.",
     "pieza_probable": "Fábrica de hielo (ice maker)",
     "fuente": "https://www.samsung.com/latin/support/home-appliances/samsung-refigerator-error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "40E",
      "40C"
     ],
     "significado": "Fallo del ventilador de la cámara de hielo.",
     "causas": [
      "Ventilador bloqueado por hielo o averiado"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Ventilador de la cámara de hielo",
     "fuente": "https://www.samsung.com/latin/support/home-appliances/samsung-refigerator-error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "84C",
      "84E"
     ],
     "significado": "Compresor bloqueado.",
     "causas": [
      "Fallo del compresor o de su placa inverter"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Compresor / placa inverter",
     "fuente": "https://www.samsung.com/latin/support/home-appliances/samsung-refigerator-error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "5E",
      "5C"
     ],
     "significado": "Fallo del sensor de descongelación del frigorífico.",
     "causas": [
      "Sensor de desescarche defectuoso"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "Sensor de desescarche",
     "fuente": "https://www.samsung.com/latin/support/home-appliances/samsung-refigerator-error-codes",
     "confianza": "media"
    },
    {
     "aparato": "horno",
     "codigos": [
      "C-d0"
     ],
     "significado": "Botón pulsado más de un minuto o atascado.",
     "causas": [
      "Tecla atascada",
      "Agua o suciedad sobre los botones"
     ],
     "que_puede_hacer_el_cliente": "Limpiar y secar los botones, apagar y volver a encender el horno.",
     "pieza_probable": "Panel de mandos/teclado",
     "fuente": "https://www.samsung.com/es/support/home-appliances/que-significan-los-codigos-que-muestra-tu-horno/",
     "confianza": "alta"
    },
    {
     "aparato": "horno",
     "codigos": [
      "C-d1"
     ],
     "significado": "Fallo del bloqueo de puerta (hornos pirolíticos).",
     "causas": [
      "Objeto que impide el cierre del pestillo",
      "Motor/cerradura de puerta"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que nada bloquea el pestillo, reiniciar y, si persiste, cortar la corriente al menos 30 segundos.",
     "pieza_probable": "Cerradura de puerta (motor de bloqueo)",
     "fuente": "https://www.samsung.com/es/support/home-appliances/que-significan-los-codigos-que-muestra-tu-horno/",
     "confianza": "alta"
    },
    {
     "aparato": "horno",
     "codigos": [
      "C-F0",
      "C-F1",
      "C-F2"
     ],
     "significado": "Fallo de comunicación o de memoria (EEPROM) entre placas / panel táctil.",
     "causas": [
      "Fallo temporal de la electrónica",
      "Placa principal o de panel"
     ],
     "que_puede_hacer_el_cliente": "Apagar y reiniciar; si sigue, cortar la corriente 30 segundos o más y volver a conectar.",
     "pieza_probable": "Placa electrónica / panel táctil",
     "fuente": "https://www.samsung.com/es/support/home-appliances/que-significan-los-codigos-que-muestra-tu-horno/",
     "confianza": "alta"
    },
    {
     "aparato": "horno",
     "codigos": [
      "C-20",
      "C-21",
      "C-22"
     ],
     "significado": "Error del sensor de temperatura; C-21 suele indicar temperatura superior a la ajustada (sobrecalentamiento).",
     "causas": [
      "Sensor de temperatura (sonda) defectuoso o su cableado",
      "Sobrecalentamiento"
     ],
     "que_puede_hacer_el_cliente": "Apagar y dejar enfriar; reiniciar y, si sigue, cortar la corriente unos 30 segundos.",
     "pieza_probable": "Sensor de temperatura del horno",
     "fuente": "https://www.samsung.com/es/support/home-appliances/que-significan-los-codigos-que-muestra-tu-horno/",
     "confianza": "media"
    },
    {
     "aparato": "microondas",
     "codigos": [
      "C-d0",
      "SE",
      "-SE-"
     ],
     "significado": "Tecla pulsada más de 10 segundos o atascada.",
     "causas": [
      "Polvo o agua en el teclado",
      "Tecla atascada"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar, limpiar y secar el teclado y volver a enchufar.",
     "pieza_probable": "Teclado/membrana",
     "fuente": "https://www.samsung.com/uk/support/home-appliances/displayed-information-codes-on-my-microwave/",
     "confianza": "alta"
    },
    {
     "aparato": "microondas",
     "codigos": [
      "C-F0",
      "C-F1",
      "C-F2"
     ],
     "significado": "Error de comunicación o de memoria (EEPROM) de la electrónica.",
     "causas": [
      "Fallo temporal",
      "Placa de control"
     ],
     "que_puede_hacer_el_cliente": "Apagar y reiniciar; si sigue, desenchufar 30 segundos o más.",
     "pieza_probable": "Placa de control",
     "fuente": "https://www.samsung.com/latin/support/home-appliances/displayed-information-codes-on-my-microwave/",
     "confianza": "alta"
    },
    {
     "aparato": "microondas",
     "codigos": [
      "C-21"
     ],
     "significado": "Temperatura interna demasiado alta (sensor de temperatura).",
     "causas": [
      "Uso prolongado a alta potencia",
      "Salidas de ventilación tapadas",
      "Sensor"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar, dejar enfriar y volver a intentar; comprobar que las rejillas de ventilación no estén tapadas.",
     "pieza_probable": "",
     "fuente": "https://www.samsung.com/uk/support/home-appliances/displayed-information-codes-on-my-microwave/",
     "confianza": "alta"
    }
   ]
  },
  {
   "familia": "Smeg",
   "marcas": [
    "Smeg"
   ],
   "notas": "PENDIENTE: no se ha verificado ningún código de Smeg. El límite de búsquedas web de la sesión se agotó antes de investigar esta marca, y las páginas de soporte no se pudieron abrir directamente porque la red de la sesión no las permite. No se incluye ningún código sin fuente. Mientras tanto, el técnico virtual debe pedir el modelo exacto y el código, y remitir al manual del modelo (smeg.es) o a la visita del técnico.",
   "codigos": []
  },
  {
   "familia": "Teka",
   "marcas": [
    "Teka"
   ],
   "notas": "Teka publica manuales de servicio en su portal técnico (apiportalsat.teka.com). La numeración cambia según la gama: en lavadoras las gamas TK2/TKM/TKW usan Err1, Err2, Err3; las TKS/TLM/WCZ usan E01 a E05; las LI5/LSI5 usan E:00 a E:05. En lavavajillas sin display el código se muestra con parpadeos de los LEDs (número de parpadeos y pausa de 5 segundos; p. ej. E2 son 2 parpadeos). En inducción, la gama G4 usa E2, E5, Er25, U400 y Er31, y las gamas G0 a G3 usan F02 y F04. En frigoríficos No Frost el significado del código cambia por modelo. Conviene pedir siempre el modelo exacto.",
   "codigos": [
    {
     "aparato": "lavadora",
     "codigos": [
      "E01",
      "E:01",
      "Err1"
     ],
     "significado": "Fallo de cierre de puerta: la puerta no se bloquea.",
     "causas": [
      "puerta mal cerrada o ropa atrapada en la goma",
      "blocapuerta averiado",
      "cableado del blocapuerta"
     ],
     "que_puede_hacer_el_cliente": "Abrir y cerrar la puerta con firmeza, comprobar que no hay ropa pillada y volver a iniciar.",
     "pieza_probable": "blocapuerta",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/28",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E02",
      "E:02"
     ],
     "significado": "Falta de carga de agua: no llena en el tiempo previsto.",
     "causas": [
      "grifo cerrado o baja presión",
      "manguera de entrada pinzada",
      "filtro de entrada obstruido",
      "electroválvula o presostato averiados"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto, que hay presión y que la manguera no está doblada.",
     "pieza_probable": "electroválvula de entrada",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/28",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E03",
      "E:03",
      "Err2"
     ],
     "significado": "Fallo de desagüe: no vacía (en la gama TK2 es Err2, desagüe incompleto en 4 minutos).",
     "causas": [
      "filtro de la bomba obstruido",
      "manguera de desagüe doblada o atascada",
      "bomba de desagüe averiada",
      "presostato"
     ],
     "que_puede_hacer_el_cliente": "Comprobar la manguera de desagüe y limpiar el filtro de la bomba si el manual lo indica.",
     "pieza_probable": "bomba de desagüe",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/25",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E04",
      "E:04"
     ],
     "significado": "Exceso de agua o actuación repetida del contacto antidesbordamiento.",
     "causas": [
      "electroválvula que no cierra",
      "presostato averiado"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo, desenchufar y llamar al servicio técnico.",
     "pieza_probable": "electroválvula de entrada, presostato",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/214",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E05",
      "E:05",
      "Err3"
     ],
     "significado": "Fallo de la sonda de temperatura NTC (en la gama TKS también puede ser la resistencia). En TKS/TLM/WCZ solo aparece en el test de servicio.",
     "causas": [
      "sonda NTC fuera de valor",
      "cableado de la sonda a la placa",
      "resistencia de calentamiento (gama TKS)"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "sonda NTC, resistencia",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/25",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E:00"
     ],
     "significado": "En la gama LI5/LSI5: fallo de la placa de potencia.",
     "causas": [
      "placa de potencia averiada"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar un minuto y volver a probar; si se repite, llamar al servicio técnico.",
     "pieza_probable": "placa electrónica",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/214",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "E10"
     ],
     "significado": "Tiempo de carga de agua superado (7 minutos); no se muestra durante el programa, solo queda registrado en el menú de servicio (t02).",
     "causas": [
      "grifo cerrado",
      "tubo de entrada pinzado",
      "presión baja"
     ],
     "que_puede_hacer_el_cliente": "Comprobar grifo y manguera de entrada.",
     "pieza_probable": "electroválvula de entrada",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/15",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E1"
     ],
     "significado": "Problema de entrada de agua: no alcanza el nivel en unos 4 minutos.",
     "causas": [
      "grifo cerrado o baja presión",
      "electroválvula que no abre",
      "caudalímetro averiado",
      "placa que no alimenta la válvula"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto y que la manguera no está doblada.",
     "pieza_probable": "electroválvula de entrada",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/32",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E2"
     ],
     "significado": "En LP7 810 / LV 821: fallo de desagüe.",
     "causas": [
      "manguera de desagüe doblada",
      "filtro obstruido",
      "bomba de desagüe",
      "presostato"
     ],
     "que_puede_hacer_el_cliente": "Limpiar los filtros del fondo de la cuba y comprobar que la manguera de desagüe no está doblada.",
     "pieza_probable": "bomba de desagüe",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/330",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E3"
     ],
     "significado": "Fallo de calentamiento: no alcanza la temperatura en el tiempo previsto.",
     "causas": [
      "resistencia averiada",
      "terminal de la resistencia suelto",
      "sonda desconectada",
      "placa electrónica"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "resistencia de calentamiento",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/240",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E4"
     ],
     "significado": "Desbordamiento: ha actuado el sistema antidesbordamiento (aquastop). Es el error de mayor prioridad.",
     "causas": [
      "fuga en la cuba o en un tubo",
      "manguera de entrada con fuga",
      "flotador o microinterruptor averiado"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo, desenchufar y llamar al servicio técnico.",
     "pieza_probable": "microinterruptor/flotador antidesbordamiento",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/240",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E6",
      "E7"
     ],
     "significado": "Sonda de temperatura en circuito abierto (E6) o en cortocircuito (E7).",
     "causas": [
      "sonda NTC averiada",
      "terminal de conexión suelto"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "sonda NTC de temperatura",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/240",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E8"
     ],
     "significado": "Fallo de la válvula de lavado alternado (según modelo).",
     "causas": [
      "válvula de lavado alternado averiada"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "válvula de lavado alternado",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/32",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "E9"
     ],
     "significado": "Un sensor o botón ha estado pulsado más de 30 segundos.",
     "causas": [
      "botón atascado o algo apoyado sobre el panel",
      "panel de mandos averiado"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que no hay nada apoyado en el panel, limpiarlo y volver a encender.",
     "pieza_probable": "panel de mandos",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/32",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "ER03",
      "Er03"
     ],
     "significado": "Hay un objeto o líquido sobre los sensores táctiles; el control se desconecta con señal sonora.",
     "causas": [
      "agua, recipiente u objeto sobre el panel de mandos",
      "panel sucio"
     ],
     "que_puede_hacer_el_cliente": "Retirar lo que haya sobre los mandos y secar y limpiar la zona de sensores.",
     "pieza_probable": "",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/79",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E2"
     ],
     "significado": "Inducción gama G4: sobrecalentamiento en el inductor o en el cristal.",
     "causas": [
      "uso prolongado a máxima potencia",
      "recipiente vacío",
      "sensor de temperatura averiado",
      "generador averiado"
     ],
     "que_puede_hacer_el_cliente": "Apagar, retirar el recipiente y dejar enfriar la placa. Comprobar que la ventilación bajo la encimera no está tapada.",
     "pieza_probable": "sensor de temperatura del inductor",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/79",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "E5"
     ],
     "significado": "Inducción gama G4: tensión de red anormalmente baja.",
     "causas": [
      "tensión de red baja",
      "filtro de entrada averiado"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "filtro de entrada",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/79",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "Er25",
      "U400"
     ],
     "significado": "Inducción gama G4: sobretensión de red (por encima de unos 270 V) o conexión incorrecta.",
     "causas": [
      "tensión de red demasiado alta",
      "conexión mal hecha (p. ej. a 400 V)"
     ],
     "que_puede_hacer_el_cliente": "Desconectar la placa y avisar al técnico; no volver a usarla hasta revisar la instalación.",
     "pieza_probable": "",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/79",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "Er31",
      "Er-31"
     ],
     "significado": "Inducción gama G4: error de configuración, típico tras sustituir el control táctil o el filtro de entrada.",
     "causas": [
      "placa sin configurar tras una reparación"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/79",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "F02",
      "F04"
     ],
     "significado": "Inducción gamas G0 a G3: sobretensión (F02) o baja tensión (F04) de red.",
     "causas": [
      "tensión de red fuera de rango",
      "conexión eléctrica incorrecta"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/1",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "ER21"
     ],
     "significado": "Desconexión por exceso de temperatura en la electrónica del control.",
     "causas": [
      "ventilación insuficiente bajo la encimera",
      "ventilador averiado"
     ],
     "que_puede_hacer_el_cliente": "Apagar y dejar enfriar; comprobar que el mueble bajo la placa tiene ventilación.",
     "pieza_probable": "ventilador",
     "fuente": "https://www.electronica-pt.com/media/kunena/attachments/62/TEKA_ERROR_CODES.pdf",
     "confianza": "media"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "E1"
     ],
     "significado": "No Frost: fallo del sensor de desescarche (en NF 900 X, sensor del evaporador del congelador). El compresor sigue funcionando.",
     "causas": [
      "sensor de desescarche averiado",
      "cableado del sensor"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "sensor (sonda) de desescarche",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/277",
     "confianza": "media"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "E4"
     ],
     "significado": "No Frost: fallo de la resistencia de desescarche.",
     "causas": [
      "resistencia de desescarche abierta",
      "conexiones de la resistencia"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "resistencia de desescarche",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/277",
     "confianza": "media"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "E3",
      "E8"
     ],
     "significado": "NFE2 320/400: fallo del sensor del conservador (E3) o del sensor del evaporador del conservador (E8).",
     "causas": [
      "sensor de temperatura averiado",
      "cableado del sensor"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "sensor de temperatura",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/277",
     "confianza": "media"
    },
    {
     "aparato": "frigorifico",
     "codigos": [
      "E0"
     ],
     "significado": "NFE1 320: fallo de la sonda del congelador.",
     "causas": [
      "sonda del congelador averiada"
     ],
     "que_puede_hacer_el_cliente": "",
     "pieza_probable": "sonda del congelador",
     "fuente": "https://apiportalsat.teka.com/api/documentos/descargar/36",
     "confianza": "media"
    }
   ]
  },
  {
   "familia": "Whirlpool",
   "marcas": [
    "Whirlpool",
    "Indesit",
    "Hotpoint",
    "Ariston"
   ],
   "notas": "Hotpoint, Indesit y Ariston (antes Hotpoint-Ariston) comparten la misma electrónica y casi la misma tabla de códigos F (F01, F02...). Whirlpool de marca usa una tabla distinta en lavadoras (FH, FA, F02, F18...), así que antes de interpretar un código hay que preguntar SIEMPRE la marca y, si es posible, el modelo (pegatina en el marco de la puerta o el manual). Un mismo código puede significar cosas distintas en lavadora, lavadora-secadora, secadora y lavavajillas. Las lavadoras Indesit/Ariston antiguas sin pantalla indican el código con parpadeos: se cuentan los parpadeos de la luz de encendido o de los pilotos entre pausa y pausa (por ejemplo, 8 parpadeos = F08), y en otros modelos con combinaciones de pilotos encendidos (pilotos 1 y 3 = F05, bomba de desagüe). Los lavavajillas Hotpoint integrables muestran el código en binario con los LED del panel. Primer paso casi universal que indica el fabricante: desenchufar al menos 2 minutos, volver a conectar, esperar 30 segundos y reintentar; si el código vuelve, la avería sigue presente. Hotpoint tiene abierta una campaña de seguridad (llamada a revisión) sobre el cierre de puerta de algunas lavadoras Hotpoint e Indesit: ante errores de puerta conviene comprobar el modelo. Las fuentes oficiales consultadas son del Reino Unido (hotpoint.co.uk) porque las webs españolas no publican tablas; los códigos son los mismos del grupo, pero puede haber variaciones por modelo. Sin fuente fiable para hornos y frigoríficos de este grupo: no se incluyen.",
   "codigos": [
    {
     "aparato": "lavadora",
     "codigos": [
      "F01"
     ],
     "significado": "Fallo de la placa electrónica (Hotpoint/Indesit/Ariston).",
     "causas": [
      "Fallo de la placa de control",
      "En algunos modelos, fallo del cierre de puerta asociado"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar la lavadora al menos 2 minutos, volver a enchufar, esperar 30 segundos e intentar arrancar de nuevo.",
     "pieza_probable": "Placa electrónica de control",
     "fuente": "https://www.hotpoint.co.uk/service/washing-machine-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F02"
     ],
     "significado": "Fallo del circuito del motor: el tambor gira a ratos o no gira durante el lavado (Hotpoint/Indesit/Ariston).",
     "causas": [
      "Motor o escobillas",
      "Tacómetro o cableado del motor",
      "Placa electrónica"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2 minutos y reintentar. Comprobar que no hay una prenda atascada que impida girar el tambor.",
     "pieza_probable": "Escobillas o motor; placa si el motor está bien",
     "fuente": "https://www.hotpoint.co.uk/service/washing-machine-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F03"
     ],
     "significado": "Fallo del sensor de temperatura: no calienta el agua (Hotpoint/Indesit/Ariston).",
     "causas": [
      "Sonda de temperatura (NTC) averiada",
      "Cableado de la sonda"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2 minutos y reintentar.",
     "pieza_probable": "Sonda de temperatura NTC",
     "fuente": "https://www.hotpoint.co.uk/service/washing-machine-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F05"
     ],
     "significado": "En Hotpoint/Indesit/Ariston: no desagua; el desagüe está atascado o falla la bomba y la puerta no abre porque queda agua en el tambor.",
     "causas": [
      "Filtro de la bomba obstruido",
      "Manguera de desagüe doblada o atascada",
      "Sifón del fregadero atascado",
      "Bomba de desagüe averiada"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de la bomba si el manual de su modelo lo indica (poner un recipiente y toallas, sale agua). Comprobar que la manguera de desagüe no está doblada ni aplastada y que el desagüe de la pared o fregadero no está atascado.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.hotpoint.co.uk/service/washing-machine-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F06"
     ],
     "significado": "En Hotpoint/Indesit/Ariston: fallo del cierre de puerta; la puerta no abre o no cierra y el programa no arranca. En Whirlpool de marca F06 puede indicar otra cosa (motor que no gira o exceso de carga).",
     "causas": [
      "Cierre electromagnético de puerta averiado",
      "Algo obstruye el cierre",
      "En Whirlpool: motor, tacómetro o ropa atrapada o exceso de carga"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que nada obstruye el cierre ni hay ropa pillada en la goma. Cerrar la puerta con firmeza. Desenchufar 2 minutos y reintentar.",
     "pieza_probable": "Blocapuertas (cierre de puerta)",
     "fuente": "https://www.hotpoint.co.uk/service/washing-machine-repair/error-codes",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F07"
     ],
     "significado": "Fallo de placa o del circuito de calentamiento: el programa se para a mitad, no calienta y la bomba puede quedarse funcionando sin parar (Hotpoint/Indesit/Ariston).",
     "causas": [
      "Resistencia sin agua suficiente (presostato)",
      "Relé de la resistencia en la placa",
      "Fuga a tierra en la resistencia"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2 minutos y reintentar. Comprobar que el grifo de agua está abierto.",
     "pieza_probable": "Resistencia, presostato o placa",
     "fuente": "https://www.hotpoint.co.uk/service/washing-machine-repair/error-codes",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F08"
     ],
     "significado": "En Hotpoint/Indesit/Ariston: fallo de la resistencia calefactora; el programa se para a mitad del lavado. En Whirlpool de marca algunas fuentes lo dan como aviso ocasional que se borra al reiniciar.",
     "causas": [
      "Resistencia averiada",
      "Relé de la resistencia en la placa"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2 minutos y reintentar.",
     "pieza_probable": "Resistencia calefactora",
     "fuente": "https://www.hotpoint.co.uk/service/washing-machine-repair/error-codes",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F09"
     ],
     "significado": "En Hotpoint/Indesit/Ariston: fallo de software; parpadean varias luces o la pantalla y no deja elegir programa. En Whirlpool de marca suele indicar desbordamiento o agua en la base de la lavadora.",
     "causas": [
      "Placa o memoria (software) de la placa",
      "En Whirlpool: fuga interna con agua en la bandeja de la base"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2 minutos y reintentar. En Whirlpool, mirar si hay agua en el suelo bajo la lavadora y cerrar el grifo si la hay.",
     "pieza_probable": "Placa electrónica (Hotpoint/Indesit); localizar fuga (Whirlpool)",
     "fuente": "https://www.hotpoint.co.uk/service/washer-dryer-repair/error-codes",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F11"
     ],
     "significado": "En Hotpoint/Indesit/Ariston: fallo del circuito de la bomba; el agua se queda dentro y no la saca. En Whirlpool de marca suele ser un fallo de comunicación entre placas.",
     "causas": [
      "Bomba de desagüe averiada o bloqueada",
      "Cableado de la bomba",
      "En Whirlpool: comunicación entre placas"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de la bomba si el manual lo indica y comprobar la manguera de desagüe. Desenchufar al menos 1-2 minutos y reintentar.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.hotpoint.co.uk/service/washer-dryer-repair/error-codes",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F12"
     ],
     "significado": "Fallo del control electrónico o de comunicación entre placa y pantalla; la máquina no enciende (Hotpoint/Indesit/Ariston).",
     "causas": [
      "Fallo de comunicación entre placa principal y pantalla",
      "Placa de mandos"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2 minutos y reintentar.",
     "pieza_probable": "Placa de mandos o placa principal",
     "fuente": "https://www.hotpoint.co.uk/service/washer-dryer-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "FH",
      "H2O"
     ],
     "significado": "En Whirlpool: no entra agua o tarda demasiado en llenar. En Indesit/Hotpoint aparece como H2O: falta de agua.",
     "causas": [
      "Grifo de agua cerrado o poca presión",
      "Manguera de entrada doblada o aplastada",
      "Filtro de la toma de agua sucio",
      "Electroválvula de entrada averiada"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto y que hay agua en casa. Revisar que la manguera de entrada no está doblada ni aplastada detrás de la lavadora. Desenchufar unos minutos y reintentar.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.coolblue.nl/en/advice/help-most-common-errors-whirlpool-washing-machines.html",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "FA"
     ],
     "significado": "Whirlpool: actuó el sistema antifugas AquaStop; hay agua en la base de la lavadora o fallo de la manguera AquaStop.",
     "causas": [
      "Fuga interna con agua en la bandeja de la base",
      "Manguera AquaStop dañada"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo de agua, desenchufar y comprobar si hay agua en el suelo. No volver a usar hasta que se revise.",
     "pieza_probable": "Manguera AquaStop; localizar la fuga interna",
     "fuente": "https://www.whitegoodshelp.co.uk/whirlpool-washing-machine-error-codes/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F02"
     ],
     "significado": "En Whirlpool de marca: tiempo de desagüe excedido (tarda más de unos 8 minutos en sacar el agua). Ojo: en Hotpoint/Indesit/Ariston F02 es fallo del motor.",
     "causas": [
      "Filtro de la bomba obstruido",
      "Manguera de desagüe doblada o atascada",
      "Exceso de espuma",
      "Bomba de desagüe"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de la bomba si el manual lo indica, revisar la manguera de desagüe y no usar demasiado detergente.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.tuexperto.com/2023/08/14/que-significa-el-codigo-de-error-de-mi-lavadora-whirlpool-y-como-solucionarlo/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F05"
     ],
     "significado": "En Whirlpool de marca el significado varía por modelo: problema de desagüe o filtro de bomba sucio, o fallo del sensor de temperatura.",
     "causas": [
      "Filtro de la bomba sucio",
      "Manguera de desagüe mal instalada",
      "Sonda de temperatura en algunos modelos"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar, limpiar el filtro de la bomba si el manual lo indica y revisar la manguera de desagüe. Si sigue, desenchufar unos 30 minutos y reintentar.",
     "pieza_probable": "Bomba de desagüe o sonda de temperatura",
     "fuente": "https://www.tuexperto.com/2023/08/14/que-significa-el-codigo-de-error-de-mi-lavadora-whirlpool-y-como-solucionarlo/",
     "confianza": "media"
    },
    {
     "aparato": "lavadora",
     "codigos": [
      "F18",
      "FOAM",
      "FoD"
     ],
     "significado": "Whirlpool: exceso de espuma en el tambor (o, en algunos modelos, desagüe impedido por la espuma o por un objeto en la bomba).",
     "causas": [
      "Demasiado detergente o detergente no apto para lavadora",
      "Objeto en la bomba",
      "Manguera de desagüe mal instalada (efecto sifón)"
     ],
     "que_puede_hacer_el_cliente": "Esperar a que baje la espuma, sacar la ropa y hacer un aclarado o un ciclo sin detergente. En adelante, usar menos detergente.",
     "pieza_probable": "",
     "fuente": "https://www.coolblue.nl/en/advice/help-most-common-errors-whirlpool-washing-machines.html",
     "confianza": "media"
    },
    {
     "aparato": "lavadora-secadora",
     "codigos": [
      "F13"
     ],
     "significado": "Fallo del sensor de temperatura de secado: no seca la ropa (Hotpoint/Indesit/Ariston).",
     "causas": [
      "Sonda de temperatura del secado",
      "Cableado"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2 minutos y reintentar.",
     "pieza_probable": "Sonda de temperatura de secado",
     "fuente": "https://www.hotpoint.co.uk/service/washer-dryer-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora-secadora",
     "codigos": [
      "F15"
     ],
     "significado": "Fallo del control de la resistencia: no calienta el agua o se pausa durante el lavado (Hotpoint/Indesit/Ariston).",
     "causas": [
      "Relé de la resistencia en la placa",
      "Resistencia"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2 minutos y reintentar.",
     "pieza_probable": "Placa o resistencia",
     "fuente": "https://www.hotpoint.co.uk/service/washer-dryer-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora-secadora",
     "codigos": [
      "F18"
     ],
     "significado": "En Hotpoint/Indesit/Ariston: error de datos internos; la pantalla o algunas funciones no responden.",
     "causas": [
      "Fallo de comunicación o datos de la placa"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2 minutos y reintentar.",
     "pieza_probable": "Placa electrónica",
     "fuente": "https://www.hotpoint.co.uk/service/washer-dryer-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "lavadora-secadora",
     "codigos": [
      "F05",
      "F08",
      "F11"
     ],
     "significado": "En lavadoras-secadoras Hotpoint/Indesit/Ariston significan lo mismo que en lavadora: F05 desagüe atascado o bomba; F08 resistencia; F11 circuito de la bomba (no saca el agua).",
     "causas": [
      "Filtro o manguera de desagüe atascados",
      "Bomba de desagüe",
      "Resistencia"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro de la bomba si el manual lo indica, revisar la manguera de desagüe y desenchufar 2 minutos antes de reintentar.",
     "pieza_probable": "Bomba de desagüe o resistencia según el código",
     "fuente": "https://www.hotpoint.co.uk/service/washer-dryer-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "F01",
      "F02",
      "F03"
     ],
     "significado": "Secadora Whirlpool: una pieza de la secadora no funciona correctamente.",
     "causas": [
      "Fallo de un componente (sensor, motor o placa)"
     ],
     "que_puede_hacer_el_cliente": "Reiniciar manteniendo pulsado el botón de encendido al menos 3 segundos y volver a lanzar el ciclo. Vaciar el filtro de pelusas.",
     "pieza_probable": "",
     "fuente": "https://www.coolblue.nl/en/advice/how-to-resolve-a-whirlpool-dryer-error.html",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "F04"
     ],
     "significado": "Secadora Whirlpool: problema del condensador (sucio u obstruido).",
     "causas": [
      "Condensador sucio u obstruido de pelusa"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar, sacar el condensador y aclararlo bajo el grifo (en bomba de calor, aspirarlo con cepillo) según el manual, volver a colocarlo, esperar unos 30 minutos y reiniciar.",
     "pieza_probable": "",
     "fuente": "https://www.coolblue.nl/en/advice/how-to-resolve-a-whirlpool-dryer-error.html",
     "confianza": "media"
    },
    {
     "aparato": "secadora",
     "codigos": [
      "F05",
      "F06",
      "F07",
      "F08",
      "F09"
     ],
     "significado": "Secadora Whirlpool: fallo de una pieza, a menudo provocado por exceso de calor (sobrecalentamiento).",
     "causas": [
      "Filtro de pelusa lleno",
      "Condensador sucio",
      "Mala ventilación",
      "Sensor o componente averiado"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar, abrir la puerta y dejar enfriar una hora. Limpiar el filtro de pelusa y el condensador. Volver a enchufar y reiniciar el ciclo.",
     "pieza_probable": "Termostato o sonda de temperatura si se repite",
     "fuente": "https://www.coolblue.nl/en/advice/how-to-resolve-a-whirlpool-dryer-error.html",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F01"
     ],
     "significado": "Lavavajillas Hotpoint: actuó el antidesbordamiento (antiinundación).",
     "causas": [
      "Fuga de agua a la bandeja de la base",
      "Exceso de espuma (detergente de mano)",
      "Electroválvula que no cierra"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo, desenchufar al menos 2 minutos y reintentar. No usar lavavajillas de mano en el aparato.",
     "pieza_probable": "Localizar fuga; electroválvula de entrada",
     "fuente": "https://www.hotpoint.co.uk/service/dishwasher-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F02"
     ],
     "significado": "Lavavajillas Indesit/Hotpoint/Ariston: fallo de llenado de agua (electroválvula de entrada). Ojo: en Whirlpool de marca F2 es fuga con AquaStop activado.",
     "causas": [
      "Grifo cerrado o poca presión",
      "Manguera de entrada doblada",
      "Electroválvula de entrada"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que el grifo está abierto y la manguera de entrada no está doblada.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.fersay.com/blog/codigos-error-lavavajillas-segun-tu-marca/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F03"
     ],
     "significado": "Lavavajillas Hotpoint/Indesit: fallo o tiempo excedido de desagüe (en modelos sin pantalla: parpadean LED 1 y LED 2).",
     "causas": [
      "Filtro del fondo atascado",
      "Manguera de desagüe doblada",
      "Desagüe del fregadero atascado",
      "Bomba de desagüe"
     ],
     "que_puede_hacer_el_cliente": "Limpiar el filtro del fondo de la cuba, comprobar que la manguera de desagüe no está doblada y que el sifón del fregadero no está atascado.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.hotpoint.co.uk/service/slimline-dishwasher-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F05"
     ],
     "significado": "Lavavajillas Hotpoint/Indesit: filtro de la bomba o manguera de desagüe obstruidos; si no se soluciona, fallo de la bomba.",
     "causas": [
      "Filtro obstruido por restos (huesos, cristal)",
      "Manguera de desagüe estrangulada",
      "Bomba de desagüe"
     ],
     "que_puede_hacer_el_cliente": "Limpiar los filtros del fondo y revisar la manguera de desagüe. Desenchufar 2 minutos y reintentar.",
     "pieza_probable": "Bomba de desagüe",
     "fuente": "https://www.hotpoint.co.uk/service/dishwasher-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F10"
     ],
     "significado": "Lavavajillas Hotpoint/Indesit: fallo de la resistencia calefactora (en modelos sin pantalla: LED 4 o LED 2 + LED 4).",
     "causas": [
      "Resistencia o calentador de paso averiado",
      "Sonda de temperatura"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2 minutos y reintentar.",
     "pieza_probable": "Resistencia (calentador)",
     "fuente": "https://www.hotpoint.co.uk/service/slimline-dishwasher-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F12"
     ],
     "significado": "Lavavajillas Hotpoint/Indesit: error de comunicación entre la placa principal y la pantalla.",
     "causas": [
      "Placa principal",
      "Placa de mandos o cableado"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2 minutos y reintentar.",
     "pieza_probable": "Placa electrónica",
     "fuente": "https://www.hotpoint.co.uk/service/dishwasher-repair/error-codes",
     "confianza": "alta"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F6"
     ],
     "significado": "Lavavajillas Whirlpool: no entra agua o no la detecta en el tiempo previsto.",
     "causas": [
      "Grifo cerrado o corte de agua",
      "Manguera de entrada doblada",
      "Filtro de la toma de agua sucio",
      "Electroválvula o caudalímetro averiado"
     ],
     "que_puede_hacer_el_cliente": "Comprobar que la llave de paso está abierta, que hay agua en casa y que la manguera de entrada no está doblada.",
     "pieza_probable": "Electroválvula de entrada o caudalímetro",
     "fuente": "https://www.justfixed.co.uk/whirlpool-dishwasher-error-codes/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F2"
     ],
     "significado": "Lavavajillas Whirlpool (modelos europeos): fuga de agua con AquaStop activado.",
     "causas": [
      "Fuga interna a la bandeja de la base",
      "Exceso de espuma",
      "Manguera AquaStop"
     ],
     "que_puede_hacer_el_cliente": "Cerrar el grifo y desenchufar. No usar lavavajillas de mano.",
     "pieza_probable": "Localizar fuga; manguera AquaStop",
     "fuente": "https://www.fersay.com/blog/codigos-error-lavavajillas-segun-tu-marca/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "F1"
     ],
     "significado": "Lavavajillas Whirlpool: fallo del sensor de temperatura.",
     "causas": [
      "Sonda de temperatura",
      "Cableado"
     ],
     "que_puede_hacer_el_cliente": "Desenchufar 2 minutos y reintentar.",
     "pieza_probable": "Sonda de temperatura",
     "fuente": "https://www.fersay.com/blog/codigos-error-lavavajillas-segun-tu-marca/",
     "confianza": "media"
    },
    {
     "aparato": "lavavajillas",
     "codigos": [
      "H2O"
     ],
     "significado": "Lavavajillas Indesit/Hotpoint: no ha entrado agua (unos 6 minutos sin agua).",
     "causas": [
      "Grifo cerrado",
      "Manguera de entrada doblada",
      "Filtro de entrada sucio",
      "Electroválvula"
     ],
     "que_puede_hacer_el_cliente": "Abrir el grifo, revisar la manguera de entrada y reiniciar.",
     "pieza_probable": "Electroválvula de entrada",
     "fuente": "https://www.fersay.com/blog/codigos-error-lavavajillas-segun-tu-marca/",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "C81",
      "C82"
     ],
     "significado": "Placa de inducción Whirlpool: el panel de mandos se apaga por temperatura demasiado alta de la electrónica.",
     "causas": [
      "Sobrecalentamiento de la electrónica",
      "Ventilación de la placa insuficiente (horno o cajón debajo)"
     ],
     "que_puede_hacer_el_cliente": "Esperar a que la placa se enfríe antes de volver a usarla. Si se repite a menudo, que se revise la ventilación de la instalación.",
     "pieza_probable": "Ventilador de la placa si se repite",
     "fuente": "https://www.manualslib.com/manual/784170/Whirlpool-Hobs.html?page=12",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "C85"
     ],
     "significado": "Placa de inducción Whirlpool: no puede calentar el recipiente; normalmente el recipiente no es apto para inducción.",
     "causas": [
      "Recipiente no apto para inducción",
      "Recipiente demasiado pequeño o mal centrado"
     ],
     "que_puede_hacer_el_cliente": "Probar con otro recipiente apto para inducción (que se pegue un imán al fondo) y bien centrado en la zona.",
     "pieza_probable": "",
     "fuente": "https://www.manualslib.com/manual/784170/Whirlpool-Hobs.html",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "F42",
      "F43"
     ],
     "significado": "Placa de inducción Whirlpool: tensión de conexión incorrecta (demasiado baja o alta para el aparato).",
     "causas": [
      "Conexión eléctrica mal hecha",
      "Tensión de red anómala"
     ],
     "que_puede_hacer_el_cliente": "Desconectar la placa (diferencial o magnetotérmico) y no usarla hasta que un técnico revise la conexión eléctrica.",
     "pieza_probable": "",
     "fuente": "https://www.manualslib.com/manual/784170/Whirlpool-Hobs.html?page=12",
     "confianza": "alta"
    },
    {
     "aparato": "placa",
     "codigos": [
      "F02",
      "F04"
     ],
     "significado": "En algunas placas Whirlpool: tensión de conexión incorrecta o problema de alimentación.",
     "causas": [
      "Conexión eléctrica incorrecta",
      "Problema de suministro"
     ],
     "que_puede_hacer_el_cliente": "Desconectar la placa y revisar con un técnico la conexión eléctrica.",
     "pieza_probable": "",
     "fuente": "https://www.manualslib.com/manual/635516/Whirlpool-Electric-Hob.html?page=12",
     "confianza": "media"
    },
    {
     "aparato": "placa",
     "codigos": [
      "F12",
      "F21",
      "F25",
      "F36",
      "F37",
      "F40",
      "F47",
      "F56",
      "F58",
      "F60"
     ],
     "significado": "Placa de inducción Whirlpool: fallo interno; la placa se apaga y pita cada 4 segundos.",
     "causas": [
      "Fallo de la electrónica de potencia o de mandos",
      "Sensor interno"
     ],
     "que_puede_hacer_el_cliente": "Desconectar la placa de la corriente unos segundos y volver a conectar. Si el código vuelve, llamar al servicio técnico indicando el código.",
     "pieza_probable": "Placa electrónica de potencia o de mandos",
     "fuente": "https://www.manualslib.com/manual/784170/Whirlpool-Hobs.html?page=12",
     "confianza": "alta"
    }
   ]
  }
 ],
 "sintomas": [],
 "peligro": [],
 "compensa_reparar": ""
};
