# Lía y compañía · tarot y astrología con IA

Cuatro especialistas IA: Lía (tarot), Mateo (astrología: carta astral, compatibilidad y previsiones), Mei (horóscopo chino) e Inés (luna y rituales). La numerología y el biorritmo se retiraron (17-11-2026).

Web de Area Internet Business Group, S.L.U. conectada a RoxyAPI.

- `server.js`: servidor Node (sin dependencias). Sirve `public/` y hace de puente con RoxyAPI.
  La clave va en la variable de entorno `ROXY_API_KEY` y nunca llega al navegador.
  Arrancar: `ROXY_API_KEY=xxxx node server.js` (puerto 8787).
- `public/`: la web (HTML, CSS, JS) y las 78 cartas del tarot Rider-Waite (1909, dominio público).
- `data/demo.json`: datos reales de RoxyAPI descargados para la vista previa sin servidor.
- `tools/fetch_data.py`: vuelve a descargar esos datos. `tools/build_demo.py`: genera `lia-vista-previa.html`.
