# Reparo · web de reparación de electrodomésticos con técnico virtual por voz

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La web completa (diseño, consola de voz del técnico, parte de trabajo, formulario «te llamamos»). |
| `cerebro.mjs` | **Lo único que hay que tocar para cambiar datos**: nombre, teléfono, zona, precios, marcas y las instrucciones del técnico. Lo usan la web y el servidor a la vez. |
| `aviso-legal.html`, `privacidad.html` | Páginas legales con huecos marcados como PENDIENTE (razón social, NIF, dirección, correo). |
| `servidor/` | El servidor para la web publicada (Cloudflare Workers): guarda la clave de la IA a salvo y recibe los avisos. |

## Cómo funciona el técnico

1. El cliente pulsa el micrófono y habla (o escribe). El navegador pasa la voz a texto.
2. El texto va a Claude (modelo Haiku 5.5, el más rápido) con las instrucciones de `cerebro.mjs`.
3. La respuesta vuelve frase a frase y se lee en voz alta mientras se escribe.
4. Con cada respuesta se va rellenando el **parte de trabajo** (aparato, avería, código, causa probable, cliente, franja).
5. Cuando el cliente confirma sus datos, el técnico genera un **aviso** que se guarda y te llega (Telegram, hoja de cálculo o lo que configuremos). El cliente puede mandarlo también por WhatsApp con un toque.

## Coste estimado de la IA

Haiku 5.5 cuesta 0,10 $ por millón de tokens de entrada y 0,50 $ por millón de salida. Las instrucciones del técnico ocupan unos 4.100 tokens y se reenvían en cada turno, así que una conversación típica de 10 turnos gasta unos 50.000 tokens de entrada y 1.500 de salida: **menos de 1 céntimo por conversación**. 1.000 conversaciones al mes ≈ 6-8 €. Con Sonnet 5.5 (más listo, algo más lento) serían unos 10 céntimos por conversación, menos con la caché de instrucciones activada (ya lo está).

## Publicar en tu dominio (cuando des el OK)

Requisitos: cuenta gratuita de Cloudflare, el dominio y una clave de API de Anthropic (console.anthropic.com).

```bash
cd reparacion/servidor
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY      # pegar la clave
npx wrangler deploy
```

Después, en `index.html`, pon `<meta name="servidor-tecnico" content="/api">` y quita la franja de «Vista previa».

Para recibir los avisos en el móvil por Telegram: crear un bot con @BotFather y guardar `TELEGRAM_TOKEN` y `TELEGRAM_CHAT` con `npx wrangler secret put`.

## Llamada de voz en directo con LiveKit (carpeta `agente/`)

Conversación continua como una llamada: el cliente habla sin tocar botones, puede interrumpir, y el técnico
mueve la página, rellena el formulario «Solicitud de técnico» delante del cliente y lo envía cuando este confirma.
Cuelga solo tras 20 s de silencio (pregunta «¿Sigues ahí?» a los 10 s) y como máximo a los 10 minutos.

| Pieza | Servicio | Dónde se saca la clave |
|---|---|---|
| Infraestructura | LiveKit Cloud (gratis: 1.000 min de agente al mes) | cloud.livekit.io |
| Oído | Deepgram Nova-3 en español (200 $ de crédito de regalo) | console.deepgram.com |
| Cerebro | Claude Haiku (o Gemini Flash cambiando `LLM_PROVEEDOR`) | console.anthropic.com |
| Voz | ElevenLabs Flash v2.5 con voz de España (o Cartesia en castellano) | elevenlabs.io |

### Probar en tu ordenador
```bash
cd reparacion/agente
python -m venv .venv && source .venv/bin/activate      # en Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                  # y rellena las claves
node exportar-instrucciones.mjs                       # copia las instrucciones de cerebro.mjs
python agente.py download-files
python agente.py console                              # hablar con el técnico desde la terminal
python agente.py dev                                  # o conectarlo a LiveKit Cloud para probar con la web
```
Para la web en local: en `index.html` pon `<meta name="livekit-token" content="/api/livekit-token">`, crea
`servidor/.dev.vars` con `LIVEKIT_URL`, `LIVEKIT_API_KEY` y `LIVEKIT_API_SECRET`, y ejecuta `npx wrangler dev` en `servidor/`.

### Publicar el agente en LiveKit Cloud (cuando des el OK)
```bash
cd reparacion/agente
lk cloud auth                                  # enlaza tu proyecto de LiveKit Cloud
lk agent create --secrets-file=.env            # sube, construye con el Dockerfile y despliega
lk agent status                                # comprobar que está en marcha
lk agent logs                                  # ver qué pasa en directo
```
Y en el servidor de la web: `npx wrangler secret put LIVEKIT_URL` (y `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`).
Si cambias `cerebro.mjs`, vuelve a ejecutar `node exportar-instrucciones.mjs` y `lk agent deploy`.

### Coste estimado por cliente de 5 minutos (precios leídos el 21-11-2026, sin IVA)

| Opción | Coste aprox. |
|---|---|
| Servidor propio + voz del navegador (sin LiveKit) | 0,01 $ |
| **LiveKit + Deepgram + Claude + ElevenLabs Flash** (lo montado) | **0,17-0,25 $** |
| LiveKit con su inferencia incluida (Deepgram + Cartesia) | 0,20 $ |
| OpenAI Realtime mini (voz a voz; acento sin comprobar) | 0,12 $ |
| Gemini Live (voz a voz; acento sin comprobar) | 0,06-0,27 $ |
| Vapi / Retell / Deepgram Voice Agent | 0,37-0,49 $ |
| ElevenLabs Agents (todo en uno) | 0,45-0,55 $ |

## Pendiente antes de publicar

- [ ] Nombre definitivo de la marca y dominio.
- [ ] Teléfono y WhatsApp reales.
- [ ] Precio de la visita, garantía (3 o 6 meses) y rangos de precios de reparación.
- [ ] Zona exacta de cobertura y horario.
- [ ] Datos de la empresa para aviso legal y privacidad.
- [ ] Fuentes alojadas en el propio servidor (ahora se cargan de Google Fonts).
- [ ] Probarlo con 10-20 conversaciones reales y ajustar las instrucciones.

## Navegadores

- Voz a texto: Chrome, Edge y Safari (iPhone incluido). En Firefox el cliente escribe.
- Lectura en voz alta: todos los navegadores modernos. Para una voz más natural se puede conectar ElevenLabs en el servidor.
- Requisito legal (Reglamento europeo de IA, en vigor desde agosto de 2026): el cliente tiene que saber que habla con una IA. La web y el propio técnico lo dicen.


## Coste por llamada del agente de voz (precios consultados el 22-11-2026, sin IVA)

Supuestos: llamada de 3 minutos, Andrés habla unos 10 turnos de ~22 palabras (~1.300 caracteres).

| Pieza | Antes | Ahora |
|---|---|---|
| Voz | ElevenLabs Flash, ~2.500 caracteres: 0,125 $ | Inworld TTS-2 Flash, ~1.300 caracteres: 0,020 $ |
| Oído | Deepgram + palabras clave: 0,018 $ | Deepgram sin palabras clave: 0,014 $ (0,023 $ si acaba la promoción) |
| Cerebro | Claude Haiku 4.5: ~0,030 $ | Claude Haiku 5.5: ~0,007 $ |
| Alojamiento del agente | LiveKit Cloud: 0,030 $ | Servidor propio: ~0 $ (más ~30-50 €/mes de servidor) |
| **Total por llamada** | **~0,20 $** | **~0,04 $** (~0,07 $ si se aloja en LiveKit Cloud) |

Con 600 llamadas al día (18.000 al mes): antes ~3.600 $/mes; ahora ~750 $/mes con servidor propio. Son estimaciones con precios de lista: las llamadas más cortas cuestan menos, y con volumen Inworld baja a ~7 $/millón de caracteres.
