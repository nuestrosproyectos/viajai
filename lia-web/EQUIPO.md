# Equipo de Lía y compañía (todos creados con IA)

| Especialista | Disciplina | Cara fija Higgsfield (soul_2) | Voz |
|---|---|---|---|
| Lía | Tarot | e672083f-33cb-4a2e-9dc0-3cc8d42e4e01 | ElevenLabs Carolina (BkOojM1ZhtSAHgsAkMx2) |
| Mateo, ~58 | Carta astral, compatibilidad, luna | 53b91137-2df0-44b6-a58b-549ad72ce3ed | ElevenLabs Álvaro Sereno (Fm7BveXW2pOo1gtPxYfM) |
| Mei, ~46 | Horóscopo chino | 585719d1-a168-4075-9c10-2206ee6ff517 | ElevenLabs Mary Velvet (Ugu6b5thG2v8TpHWKQhs) |
| Inés, ~34 | Numerología y biorritmo | 88b816d6-371b-481b-8f36-390351c2ecd6 | ElevenLabs Sophie (XirH81OfTmRrNPuPRQCg) |

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
