# ManyChat: de comentario en Reel/TikTok a seguidor del Canal de WhatsApp

Embudo completo: **comentario con palabra clave → respuesta pública → DM con la guía gratis → DM de seguimiento con botón al Canal**.

Antes de pegar los textos, ten a mano estos dos enlaces (son los únicos datos tuyos que hay que sustituir):

| Marcador | Qué es | Dónde se consigue |
|---|---|---|
| `[ENLACE_GUIA]` | Enlace a tu guía en PDF | Súbela a Google Drive (compartir → «cualquier persona con el enlace») o a tu web |
| `[ENLACE_CANAL]` | Enlace de invitación al Canal | WhatsApp → tu Canal → «Enlace del canal» (formato `https://whatsapp.com/channel/...`) |

---

## 1. Disparador (trigger)

- **Instagram:** Automation → New Automation → *User comments on your Post or Reel* → «Any post or Reel».
- **TikTok:** mismo flujo con el disparador de comentarios de TikTok (requiere cuenta TikTok Business conectada a ManyChat; comprueba que esté disponible en tu plan y país).
- **Palabra clave:** `VIAJE` (añade también las variantes `viaje`, `Viaje`, `VIAJES`, `quiero`).

**Llamada a la acción para decir en el vídeo y poner en el pie de foto:**

> Comenta **VIAJE** y te mando gratis por privado la guía con los 7 trucos que uso para volar por menos de 50 €.

---

## 2. Respuestas públicas al comentario (3 variantes aleatorias)

En el disparador activa **«Reply to comment publicly»** y pega las tres. ManyChat las rota solo, así las respuestas no parecen de robot y la plataforma no las marca como spam.

**Variante 1**
```
¡Hecho! ✈️ Te la acabo de enviar por privado. Mira tus mensajes (y la carpeta de solicitudes, por si acaso).
```

**Variante 2**
```
¡Enviada! 📩 Tienes la guía en tu bandeja de mensajes. Si no la ves, revisa las solicitudes de mensaje.
```

**Variante 3**
```
¡Ya la tienes! 🌍 Abre tus mensajes privados, ahí está la guía. Buen viaje 😉
```

---

## 3. DM inicial: entrega de la guía gratuita

Bloque de **texto + botón**. Se envía en cuanto la persona comenta.

**Texto**
```
¡Hola! 👋

Lo prometido: aquí tienes la guía «7 trucos para volar por menos de 50 €».

Dentro vas a encontrar:
✅ Cómo buscar para que el precio elija la fecha (y no al revés)
✅ Los recargos de las low cost y cómo esquivarlos
✅ Qué días y con cuánta antelación reservar según el destino

Se lee en 5 minutos y te sirve para tu próximo viaje.
```

**Botón** (tipo «Open website»)
- Texto del botón: `📥 Descargar la guía`
- URL: `[ENLACE_GUIA]`

---

## 4. DM de seguimiento: botón directo al Canal de WhatsApp

Añade un bloque **Smart Delay de 2 minutos** después del DM inicial (da tiempo a abrir la guía y entra dentro de la ventana de 24 h de mensajería) y a continuación este mensaje.

**Texto**
```
Una cosa más ✈️

La guía te enseña a buscar. Pero los mejores precios duran horas y no da tiempo a buscarlos uno mismo.

Por eso tenemos un Canal de WhatsApp donde avisamos en cuanto salta un chollo desde Madrid, Barcelona o Málaga:

🔥 Vuelos ida y vuelta por menos de 60 €
🔕 Sin spam: 2 o 3 avisos al día como mucho
🙈 Nadie ve tu número ni puede escribirte
🚪 Te sales con un clic cuando quieras

Es gratis. Entra y activa la campanita 🔔 para no perderte ninguno.
```

**Botón** (tipo «Open website»)
- Texto del botón: `🔔 Unirme al Canal gratis`
- URL: `[ENLACE_CANAL]`

---

## 5. Recordatorio opcional (recupera a los que no hicieron clic)

Condición: **«no ha hecho clic en el botón del Canal»** → Smart Delay de **20 horas** (dentro de la ventana de 24 h) → este mensaje:

```
Hoy hemos publicado chollos en el Canal que ya no están disponibles 😅

Si no quieres perderte los de mañana, entra aquí (es gratis y te sales cuando quieras):
```

Botón: `✈️ Ver los chollos de hoy` → `[ENLACE_CANAL]`

---

## Lista de comprobación antes de activar

- [ ] La palabra clave `VIAJE` dispara el flujo (pruébalo comentando desde otra cuenta).
- [ ] Las 3 respuestas públicas están cargadas.
- [ ] Los dos botones abren el enlace correcto (guía y Canal).
- [ ] Etiqueta en ManyChat a quien hace clic en el Canal (`clic_canal`) para medir la conversión comentario → Canal.
- [ ] El pie de foto de cada Reel/TikTok incluye la llamada a la acción con la palabra clave.
