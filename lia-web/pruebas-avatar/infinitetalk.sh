#!/bin/bash
# Arranque en Vast.ai: guarda el registro de la ejecución anterior (si lo hay) y lanza la fase actual (fase.sh).
BASE=https://raw.githubusercontent.com/nuestrosproyectos/viajai/claude/gifted-lamport-2n79de/lia-web/pruebas-avatar
label() { { set +x; } 2>/dev/null; curl -s -X PUT "https://console.vast.ai/api/v0/instances/${CONTAINER_ID}/" -H "Authorization: Bearer ${CONTAINER_API_KEY}" -H 'Content-Type: application/json' -d "{\"label\":\"$1\"}"; }
subir() { curl -s -F reqtype=fileupload -F time=72h -F "fileToUpload=@$1" https://litterbox.catbox.moe/resources/internals/api.php; }
if [ -f /root/it.log ]; then
  P=/root/it_prev_$(date +%s).log; mv /root/it.log "$P"
  tr '\r' '\n' < "$P" > "$P.txt"
  U=$(subir "$P.txt"); label "log-anterior:$U"; sleep 20
fi
curl -s -H "Accept: application/vnd.github.raw" -o /root/fase.sh "https://api.github.com/repos/nuestrosproyectos/viajai/contents/lia-web/pruebas-avatar/fase.sh?ref=claude/gifted-lamport-2n79de"
grep -q "^#!/bin/bash" /root/fase.sh || curl -s -o /root/fase.sh "$BASE/fase.sh?$(date +%s)"
exec bash /root/fase.sh
