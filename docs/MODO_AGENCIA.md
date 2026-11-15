# Modo agencia: la demo de Viajai con la marca de cada agencia

La misma web se convierte en el planificador de una agencia **solo cambiando el enlace**. Sirve para enseñar la demo en una visita comercial y, después, como versión que la agencia pone en su web.

## Cómo crear el enlace de una agencia

Parte de la dirección de la web y añade los datos de la agencia:

```
https://nuestrosproyectos.github.io/viajai/?agencia=Viajes%20Alhambra&color=8B1E3F&wa=34958123456#demo
```

| Dato | Qué es | Ejemplo |
|---|---|---|
| `agencia` | Nombre de la agencia (los espacios se escriben `%20`). **Obligatorio** | `Viajes%20Alhambra` |
| `color` | Color de su marca, en código de 6 cifras sin `#` (se saca de su web o logo) | `8B1E3F` |
| `wa` | Su WhatsApp con prefijo 34, solo números. Aquí le llegan los viajes pedidos | `34958123456` |
| `email` | Alternativa si no usan WhatsApp | `reservas@agencia.es` |
| `logo` | Dirección (https) de la imagen de su logo. Si no se pone, se escribe el nombre | `https://…/logo.png` |

Añadir `#demo` al final hace que la página se abra directamente en el chat.

## Qué cambia en modo agencia

- Nombre o logo de la agencia en la cabecera, el título de la pestaña y el pie de página.
- Toda la web con el color de la agencia.
- El asistente de IA se presenta como «el asistente de viajes de [agencia]» y no menciona Viajai.
- Se ocultan las partes que solo tienen sentido para Viajai: «Para agencias», la comparativa con agencias tradicionales y las opiniones de ejemplo.
- **Lo más importante:** en lugar de mandar al cliente a Booking u otras webs, todos los botones de reserva llevan a **«Pedir este viaje a [agencia]»**. A la agencia le llega por WhatsApp el viaje resumido (destino, fechas, viajeros, día a día, hotel y presupuesto) para que su equipo cierre la venta.
- En el pie queda una línea discreta: «Planificador con tecnología Viajai».

## Para la visita comercial

1. Antes de ir, crea el enlace con su nombre, su color y **tu** WhatsApp, para que la petición te llegue a ti delante de ellos.
2. Pide al dueño que planifique un viaje real de sus clientes desde su propio móvil.
3. Cuando pulse «Pedir este viaje», enséñale el mensaje que acaba de llegar: «Así os llegaría cada cliente, de día o de noche».
