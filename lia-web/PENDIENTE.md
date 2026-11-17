# Lía y compañía · estado y pendientes (15-11-2026, noche)

## Hecho hoy
- Web con 4 especialistas IA (Lía tarot, Mateo astrología, Mei horóscopo chino, Inés numerología).
- Tarot sí/no con baraja visible y aviso «Toca una carta»; tirada de 3 cartas; tirada completa (Cruz Celta 10, Amor 5, Trabajo 7) con 3 cartas gratis y resto bloqueado (pago simulado).
- Sección «Por qué una IA»: cifras verificables, comparativa objetiva, método y preguntas frecuentes.
- Caras fijas entrenadas de Mateo, Mei e Inés (ver EQUIPO.md).
- Web pública: https://nuestrosproyectos.github.io/viajai/lia/

## Datos que usamos y su fuente (no poner nada que no esté aquí)
- Planetas: efeméride DE440 de NASA JPL. 231/231 posiciones a <0,32" de JPL Horizons (mediana 0,05"); ascendente, MC y casas a <1,5". Fuente: roxyapi.com/methodology y benchmark abierto github.com/RoxyAPI/astrology-api-benchmark.
- 13.957 pruebas automáticas por actualización del motor (RoxyAPI).
- 5.180.000+ localidades con zona horaria IANA histórica (RoxyAPI).
- Tarot: SOLO baraja Rider-Waite-Smith (78 cartas). 936 significados = 78 x 2 posiciones x 6 temas. No decir «todas las barajas».
- Moneda de 1 € (23,25 mm) a 0,32" = 15 km.

## Pendiente de decisión de Juan
1. Marca y dominio: propuesta «La casa de Lía» con lacasadelia.es + .com (+ tarotconlia.es para redirigir).
2. Alta en Stripe (tarjeta y Bizum) a nombre de Area Internet Business Group.
3. ~~Voces~~ HECHO: Mateo = Álvaro, Mei = Mary Velvet, Inés = Sophie.

## Pendiente técnico
- Publicar con servidor (Vercel o Cloudflare) para carta astral y compatibilidad con cualquier dato.
- Con el cobro real, el servidor solo debe enviar las cartas bloqueadas tras confirmar el pago.
- Pasar el proyecto a un repositorio propio (lia-tarot).

## 17-11-2026
- Dominio: marca general propuesta cieloycartas.com (libre a 17 $ el 17-11). Compra pendiente del cliente. Una sola web con secciones /tarot (Lía), /carta-astral (Mateo), /horoscopo-chino (Mei), /luna (Inés).
- Activar cobros (Stripe) antes de publicar vídeos.
- Cambiar detector de caras de LatentSync (InsightFace, no comercial) por uno libre antes de publicar.
- Vast.ai: alquilar SOLO A100 de 80 GB (las «baratas» son de 40 GB y no sirven).
