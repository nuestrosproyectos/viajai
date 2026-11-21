# Equipo de Lía y compañía (todos creados con IA)

| Especialista | Disciplina | Cara fija Higgsfield (soul_2) | Voz |
|---|---|---|---|
| Lía | Tarot | e672083f-33cb-4a2e-9dc0-3cc8d42e4e01 | ElevenLabs Carolina (BkOojM1ZhtSAHgsAkMx2) |
| Mateo, ~58 | Carta astral, compatibilidad, previsiones | 53b91137-2df0-44b6-a58b-549ad72ce3ed | ElevenLabs Álvaro Sereno (Fm7BveXW2pOo1gtPxYfM) |
| Mei, ~46 | Horóscopo chino | 585719d1-a168-4075-9c10-2206ee6ff517 | ElevenLabs Mary Velvet (Ugu6b5thG2v8TpHWKQhs) |
| Inés, ~34 | Luna y rituales (numerología retirada el 17-11) | 88b816d6-371b-481b-8f36-390351c2ecd6 | ElevenLabs Sophie (XirH81OfTmRrNPuPRQCg) |

Estilo de cada uno:
- Lía: blusa negra semitransparente con lazo, medallón antiguo, mesa de terciopelo granate, velas, cartas siempre boca abajo.
- Mateo: barba entrecana, gafas de leer en la cabeza, cárdigan gris oscuro sobre camisa de lino, despacho con libros y esfera armilar.
- Mei: pelo negro en moño bajo, pendientes de jade, blusa de seda verde, farol de papel, almanaque y té.
- Inés: pelo castaño ondulado recogido, pecas, jersey crema, cuaderno con números, cafetería con ventana.

Reglas de vídeo: movimientos mínimos (respirar, parpadear, sonreír), sin girar la cabeza (la IA inventa detalles como piercings), sin barajar cartas.

Voces: modelo eleven_v4, castellano de España. Mei sin imitar acento extranjero.

## Coste (comprobado el 16-11-2026)
- Voz: usar SIEMPRE la API directa de ElevenLabs (POST /v1/text-to-speech/{voz}), no la herramienta de «flows».
  Mismo texto de 352 caracteres: flows = 346 créditos (≈12,6 céntimos); API directa flash_v2_5 = 38 créditos (≈1,4 céntimos).
- Vídeo: reutilizar la biblioteca de clips y fotos ya hechas; zoom lento en fotos (gratis). Animar clips nuevos solo cuando haga falta (7,5 créditos de Higgsfield cada uno).

## Voz de Lía EN PRUEBA (17-11-2026, pendiente de aprobar)
- Voz diseñada a medida «Lía · prueba D5»: KKm83u9cmAwZogGKB2rU (ElevenLabs, diseño D5: mujer española ~58 años, grave pero limpia, sin ronquera, pausada).
- Modelo: eleven_multilingual_v2, stability 0.55, similarity 0.8, style 0.1, speed 1.0. Candidata a sustituir a Carolina (sonaba demasiado joven para la cara de Lía).
- Ojo: el vídeo que sale de InfiniteTalk/LatentSync lleva el audio rebajado a 16 kHz. En el montaje final poner SIEMPRE el mp3 original de ElevenLabs.

## Voz elegida para Lía: F1 (17-11-2026)
- «Lía · F1 (elegida)»: DoYDMl2vmaVLlVlhaWSy. Diseñada: tarotista española 55–60 años, castellano, grave, aterciopelada, elegante, muy pausada, toque de misterio, sin ronquera.
- Modelo eleven_multilingual_v2, stability 0.55, similarity 0.8, style 0.1, speed 1.0. La D5 queda descartada.
- Regla para cualquier voz nueva de personaje: empezar la descripción por su OFICIO y su EDAD.

## Cambios de especialidades (17-11-2026, confirmados el 20-11-2026)
- Numerología: se retira (también de los rituales: nada de «año personal»).
- Vídeos: «La Luna en los 12 signos» lo presenta Inés (no Mateo). Mateo: carta astral, ascendentes, «Tu Sol, tu Luna y tu Ascendente», compatibilidad y previsiones.
- Inés pasa a ser la especialista de la LUNA: fases, calendario lunar, rituales de luna nueva y llena (texto nuestro con datos reales de RoxyAPI: fase, iluminación, signo, hora, cristales) y producto «tu retorno lunar del mes» (/astrology/lunar-return).
- La API no tiene endpoint de «rituales»; sí moon-phase (current/upcoming/calendar), lunar-return, crystals (daily, zodiac, chakra, element), dreams, angel-numbers.

## DECISIÓN FINAL voz de Lía (17-11-2026): CAROLINA
- Se vuelve a Carolina (BkOojM1ZhtSAHgsAkMx2, eleven_flash_v2_5, es). La F1 y la D5 quedan descartadas.
- Audios del vídeo 01 con Carolina: lia-web/videos/audio-01-carolina/ (A1–A5, R1–R3, M1_1…M3_4).

## Aviso de IA en vídeos (decisión de Juan, 21-11-2026: «la mezcla»)
- Etiqueta fija «Presentadora creada con IA» abajo a la izquierda durante todo el vídeo (Reglamento (UE) 2024/1689, art. 50) + casilla de contenido sintético en YouTube/TikTok.
- Gancho primero; hacia el segundo 20–30 la presentadora dice con naturalidad que es una inteligencia artificial, en positivo (cálculo exacto, disponible a cualquier hora). Nunca «acierta más» ni «interpreta mejor que una persona».
- Inés: vestuario opción A (blusa de terciopelo azul noche, colgante de luna creciente). Misma imagen en web, rituales y vídeos.
