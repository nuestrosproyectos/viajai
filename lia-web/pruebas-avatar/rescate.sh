#!/bin/bash
# Rescate de resultados en Vast.ai: prueba varios servicios de subida y deja los enlaces en la etiqueta.
# Uso: bash rescate.sh ARCHIVO [ARCHIVO...]
label() { curl -s -X PUT "https://console.vast.ai/api/v0/instances/${CONTAINER_ID}/" -H "Authorization: Bearer ${CONTAINER_API_KEY}" -H 'Content-Type: application/json' -d "{\"label\":\"$1\"}" >/dev/null; }
sube() {
  local F=$1 U r
  for r in 1 2 3 4; do U=$(sube1 "$F"); case "$U" in http*) echo "$U"; return;; esac; sleep $((r * 30)); done
  echo "FALLO"
}
sube1() {
  local F=$1 U
  U=$(curl -s -m 600 -F reqtype=fileupload -F time=72h -F "fileToUpload=@$F" https://litterbox.catbox.moe/resources/internals/api.php); case "$U" in https*) echo "$U"; return;; esac
  U=$(curl -s -m 600 -F reqtype=fileupload -F "fileToUpload=@$F" https://catbox.moe/user/api.php); case "$U" in https*) echo "$U"; return;; esac
  U=$(curl -s -m 600 -F "file=@$F" https://tmpfiles.org/api/v1/upload | python3 -c "import sys,json;print(json.load(sys.stdin)['data']['url'].replace('tmpfiles.org/','tmpfiles.org/dl/'))" 2>/dev/null); case "$U" in https*|http*) echo "$U"; return;; esac
  echo "FALLO"
}
RES=""
for F in "$@"; do
  [ -f "$F" ] && [ "$(basename $F)" = lia_cam01.mp4 ] && [ -f lia_cam01_1080.mp4 ] && continue
  [ -f "$F" ] || continue
  if [ $(stat -c %s "$F") -gt 90000000 ]; then
    mkdir -p /root/trozos && rm -f /root/trozos/*; split -b 60M -d -a 2 "$F" "/root/trozos/$(basename $F).parte"
    for P in /root/trozos/*; do RES="$RES|$(basename $P):$(sube "$P")"; done
  else
    RES="$RES|$(basename $F):$(sube "$F")"
  fi
done
label "rescate$RES"
