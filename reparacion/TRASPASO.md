# Traspaso: seguir Reparo en el ordenador de Juan

Habla siempre en español de España. Juan dicta por voz. Antes de nada lee `NOTAS-PROYECTO.md` (todo el contexto del proyecto) y `LEEME.md` (cómo se publica).

## Dónde está todo
- Repositorio `nuestrosproyectos/viajai`, rama `claude/brave-pascal-azy07j`, carpeta `reparacion/`.
- Web: `index.html` (rediseñada para móvil). Datos del negocio: `cerebro.mjs`. Instrucciones de Andrés: `instrucciones.mjs`.
- Servidor (Cloudflare Workers): `servidor/`. Agente de voz (LiveKit, Python): `agente/`.

## Lo primero: darse de alta para conectar la voz
Abre estas páginas en el navegador de Juan y guíale paso a paso (él crea las cuentas, acepta condiciones y paga; tú no pagues nada sin su OK):
1. LiveKit Cloud: https://cloud.livekit.io → proyecto «reparo» → Settings → API Keys → Create key (URL `wss://…`, API Key y secreto).
2. Deepgram: https://console.deepgram.com/signup → API Keys → Create a New API Key (regalan unos 200 $ de saldo).
3. ElevenLabs: https://elevenlabs.io/app/sign-up → Voice Library, filtrar Spanish / Spain, voz de hombre (se llama Andrés) → copiar Voice ID; Perfil → API Keys. Para clientes reales hace falta el plan Starter (~5 $/mes, licencia comercial): que decida Juan.
4. Anthropic: https://console.anthropic.com → cargar 5 $ de saldo → API Keys → Create Key.
5. Cloudflare (gratis): https://dash.cloudflare.com/sign-up.

Las claves NUNCA se pegan en el chat ni se suben a GitHub: van a `agente/.env` (ver `agente/.env.example`, ya está en .gitignore) y a los secretos de Cloudflare con `npx wrangler secret put …` (lista en `servidor/wrangler.toml`).

## Después
1. Primera llamada real de prueba en local (agente con `python agente.py dev` + web con el token de LiveKit), antes de publicar nada.
2. Pedir OK a Juan antes de publicar/desplegar o gastar dinero.
3. Probar en móviles reales (iPhone y Android barato), también abriendo la web desde Instagram/Facebook.

## Trabajo a medias (hacerlo cuando toque)
- El agente YA espera sin colgar si el cliente sale de la web, le entra una llamada (atributo de participante `pausa`, hasta 3 min) o se corta la conexión (90 s). Falta la parte de la web (`index.html`, sección «Llamada de voz en directo»):
  - Poner `localParticipant.setAttributes({pausa: "fuera"|"llamada"|"silenciado"|""})` al ocultarse la página (visibilitychange), cuando el sistema silencia la pista del micro (evento `mute`/`unmute` del MediaStreamTrack: llamada entrante) y con el botón Silenciar.
  - Si la sala se desconecta sin que el cliente cuelgue, ofrecer «Reconectar», que vuelva a la misma sala con el mismo pase (válido 10 min) sin borrar la conversación.
- Navegadores de Instagram, Facebook, TikTok o la app de Google (detectar por el user agent: FBAN, FBAV, FB_IAB, Instagram, TikTok, GSA/): si el micro falla, en vez del error mostrar «Para hablar con Andrés, abre la web en tu navegador». En Android, botón con `intent://…#Intent;scheme=https;package=com.android.chrome;end`; en iPhone, los pasos «··· → Abrir en el navegador» y un botón «Copiar enlace». Siempre con las opciones Escribir y Llamar.

## Datos que faltan de Juan
Nombre definitivo, teléfono y WhatsApp, garantía (3 o 6 meses), precio de la visita (39 €), ciudades con técnico de gas, y voz/nombre de Andrés.
