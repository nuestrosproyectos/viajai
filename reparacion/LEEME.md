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
