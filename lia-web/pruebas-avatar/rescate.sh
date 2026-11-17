#!/bin/bash
# Rescate de resultados en Vast.ai cuando litterbox rechaza la subida.
# Uso: bash rescate.sh ARCHIVO [ARCHIVO...]
# 1) Reintenta litterbox (nombres y tamaños distintos). 2) Si no, vuelca el archivo en base64 a la salida estándar
#    (registro del contenedor de Vast, que se descarga con la API request_logs) entre marcas INICIO/FIN.
label() { curl -s -X PUT "https://console.vast.ai/api/v0/instances/${CONTAINER_ID}/" -H "Authorization: Bearer ${CONTAINER_API_KEY}" -H 'Content-Type: application/json' -d "{\"label\":\"$1\"}" >/dev/null; }
RES=""
for F in "$@"; do
  [ -f "$F" ] || { RES="$RES|$(basename $F):NO-EXISTE"; continue; }
  U=""
  for i in 1 2 3 4 5; do
    cp "$F" "/root/r${i}_$(date +%s).mp4"; G=$(ls -t /root/r${i}_*.mp4 | head -1)
    U=$(curl -s -F reqtype=fileupload -F time=72h -F "fileToUpload=@$G" https://litterbox.catbox.moe/resources/internals/api.php)
    rm -f "$G"; case "$U" in https*) break;; esac; U=""; sleep $((i * 20))
  done
  if [ -n "$U" ]; then RES="$RES|$(basename $F):$U"; continue; fi
  N=$(basename "$F")
  echo "=====INICIO $N====="
  base64 -w 76 "$F"
  echo "=====FIN $N====="
  RES="$RES|$(basename $F):EN-REGISTRO:$(stat -c %s "$F")"
done
label "rescate$RES"
