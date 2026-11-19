---
name: ritual-personalizado
description: Crear un ritual personalizado de pago (luna llena/nueva, Año Nuevo, San Juan, San Valentín, cumpleaños, por necesidad) para la web de Lía y compañía, con datos reales de RoxyAPI y efemérides, PDF diseñado y audio guiado con la voz de Inés. Úsala cuando se pida un ritual, una muestra de ritual o la biblioteca de rituales.
---

# Ritual personalizado (Lía y compañía)

Producto: ritual de intención y bienestar, hecho a medida del cliente (nombre, fecha/hora/lugar de nacimiento → signo, ascendente, año personal), en **PDF de 4–5 páginas + audio guiado de 6–8 min** con la voz de Inés. Coste por ritual: céntimos de voz.

## Reglas que no se rompen
- **Sin promesas de resultados**, sin «amarres», sin «que vuelva», sin dinero garantizado, **nada de salud** (la API de cristales trae frases de salud falsas: no usarlas nunca).
- Decir siempre que Inés es una IA y añadir el aviso legal y de seguridad con la vela. El fuego nunca es obligatorio (papeles: romper, no quemar).
- **Todos los datos se comprueban**: nada de fechas u horas inventadas. Si algo no se pudo verificar, decirlo.
- Español de España, tono cálido y concreto. Pausas reales para escribir.

## Datos (fuentes)
- RoxyAPI (`https://roxyapi.com/api/v2`, la clave la pone el proxy; con curl funciona, desde Node no):
  - Fases: `GET /astrology/moon-phase/upcoming?lang=es&timezone=Europe/Madrid`
  - Cristales por signo: `GET /crystals/zodiac/{sign}?lang=es` y ficha `GET /crystals/{id}?lang=es` (solo usar nombre, palabras clave, mes de nacimiento).
  - Año personal: `POST /numerology/personal-year` con `{year,month,day}` de nacimiento. **OJO: solo calcula el año en curso.** Para otro año: día + mes + cifras del año, reducir a una cifra (11/22/33 se pueden mantener). Para sacar los textos de un año N, llamar con una fecha que dé N en el año en curso.
  - Catálogo completo de la API: `https://roxyapi.com/llms.txt` (18 temas).
- Efemérides con `ephem` (pip): hora exacta de luna llena/nueva, signo de la Luna, salida de la Luna en la ciudad, equinoccios/solsticios, estaciones de Mercurio. Convertir a hora de Europe/Madrid.
- Casas por **signo entero** según el ascendente: casa = (signo − ascendente) mod 12 + 1. Temas de cada casa y cielo de 2027: `lia-web/videos/guion-m01-2027-ascendente.md`.

## Pasos
1. Saca los datos del cliente y del momento (tabla de arriba) y apúntalos en `lia-web/rituales/<nombre>.md` (sección de datos).
2. Escribe en ese mismo archivo la sección `## Audio guiado` con piezas `R1: …` seguidas de `[PAUSA n]` (segundos). Estructura que funciona: bienvenida y material → por qué esta fecha es especial para ti (dato real) → respirar y encender vela → agradecer/soltar por escrito → intención en voz alta → afirmación → cierre seguro + próxima cita (la próxima fecha que le venderemos).
3. Audio: `python3 lia-web/rituales/montar_audio_ritual.py GUION.md CARPETA_TRABAJO "Salida.mp3"` (voz Inés = ElevenLabs Sophie `XirH81OfTmRrNPuPRQCg`, eleven_multilingual_v2, velocidad 0,92; revisa cada pieza con transcripción y pone fondo suave y campana). Si dice REVISAR, corregir el texto y regenerar esa pieza (borrar su mp3).
4. PDF: copia una plantilla (`lia-web/rituales/ritual.html` = luna, añil y plata; `anonuevo.html` = Año Nuevo, noche y oro), cambia textos y datos, y genera: `cd lia-web/rituales && node pdf_ritual.js PLANTILLA.html SALIDA.pdf CARPETA_CAPTURAS`. Mira las capturas: nada de páginas medio vacías, textos solapados ni recuadros blancos en imágenes (`mix-blend-mode:multiply`).
5. Entrega con SendUserFile (PDF + MP3) y guarda guion y plantilla en el repositorio.

## Catálogo y precios propuestos (pendiente de OK de Juan)
- Luna llena / luna nueva: 4,90 € (suscripción «Tus lunas» 6,99 €/mes).
- Por necesidad (amor propio, abrirte al amor, soltar a un ex, prosperidad, trabajo/entrevista, exámenes, limpieza de casa con feng shui de Mei, protección, gratitud) y personales (cumpleaños, Mercurio retrógrado, eclipse en tu signo): 6,90 €.
- Fechas grandes (Año Nuevo, San Juan 23-06, San Valentín, Año Nuevo chino, solsticios/equinoccios, Halloween/Día de Muertos): 9,90 €.
- Pack «Mi año ritual»: 39 €/año.

## Muestras hechas
- `rituales/luna-llena-2026-11-24-muestra.md` + `ritual.html` (luna llena en Géminis, Marta, ascendente Leo, Granada).
- `rituales/anonuevo-2027-muestra.md` + `anonuevo.html` (Marta, 3-05-1990: 2026 año 9 → 2027 año 1).
