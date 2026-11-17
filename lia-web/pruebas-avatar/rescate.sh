#!/bin/bash
# Rescate de resultados en Vast.ai cuando litterbox rechaza la subida.
# Uso: bash rescate.sh ARCHIVO [ARCHIVO...]
# 1) Reintenta litterbox. 2) Si no, entrega el archivo por el registro del contenedor (API request_logs):
#    el registro corta las líneas a 500 caracteres y solo devuelve las 20.000 últimas, así que se entrega
#    en partes de 18.000 líneas de 480 caracteres. Tras cada parte pone la etiqueta «parte:N/T:archivo» y espera
#    a que la etiqueta cambie a «siguiente:N» antes de soltar la siguiente.
api() { curl -s "$@" -H "Authorization: Bearer ${CONTAINER_API_KEY}" -H 'Content-Type: application/json'; }
label() { api -X PUT "https://console.vast.ai/api/v0/instances/${CONTAINER_ID}/" -d "{\"label\":\"$1\"}" >/dev/null; }
leer_label() { api "https://console.vast.ai/api/v0/instances/${CONTAINER_ID}/" | python3 -c "import sys,json;d=json.load(sys.stdin);x=d.get('instances',d);print(x.get('label') or '')"; }
RES=""
for F in "$@"; do
  [ -f "$F" ] || { RES="$RES|$(basename $F):NO-EXISTE"; continue; }
  U=""
  for i in 1 2 3; do
    cp "$F" "/root/r${i}.mp4"; U=$(curl -s -F reqtype=fileupload -F time=72h -F "fileToUpload=@/root/r${i}.mp4" https://litterbox.catbox.moe/resources/internals/api.php)
    rm -f "/root/r${i}.mp4"; case "$U" in https*) break;; esac; U=""; sleep 15
  done
  if [ -n "$U" ]; then RES="$RES|$(basename $F):$U"; continue; fi
  N=$(basename "$F"); rm -rf /root/b64 && mkdir -p /root/b64
  base64 -w 480 "$F" > /root/b64/todo.txt
  split -l 18000 -d -a 3 /root/b64/todo.txt /root/b64/p_
  T=$(ls /root/b64/p_* | wc -l); k=0
  for P in /root/b64/p_*; do
    k=$((k + 1))
    echo "=====INICIO $N $k/$T====="; cat "$P"; echo "=====FIN $N $k/$T====="
    label "parte:$k/$T:$N:$(stat -c %s "$F")"
    for w in $(seq 1 720); do sleep 5; [ "$(leer_label)" = "siguiente:$k" ] && break; done
  done
  RES="$RES|$N:ENTREGADO-EN-$T-PARTES"
done
label "rescate$RES"
