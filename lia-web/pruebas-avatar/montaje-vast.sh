#!/bin/bash
# Monta el vídeo 01 completo en la propia máquina de Vast (ya tiene lia_cam01_1080.mp4) y lo entrega con rescate.sh.
exec > /root/montaje.log 2>&1
set -x
label() { curl -s -X PUT "https://console.vast.ai/api/v0/instances/${CONTAINER_ID}/" -H "Authorization: Bearer ${CONTAINER_API_KEY}" -H 'Content-Type: application/json' -d "{\"label\":\"$1\"}" >/dev/null; }
label "6-montando"
cd /root && rm -rf repo && git clone -q --depth 1 -b claude/gifted-lamport-2n79de https://github.com/nuestrosproyectos/viajai repo
T=/root/v01; rm -rf $T && mkdir -p $T/car $T/cartas
cp repo/lia-web/videos/audio-01-carolina/* $T/car/
cp repo/lia-web/videos/cartas-es/* $T/cartas/
cp /root/InfiniteTalk/lia_cam01_1080.mp4 $T/
pip install -q pillow
python repo/lia-web/videos/montar_video01.py $T repo/lia-web/videos/fuentes || { cd /root && bash repo/lia-web/pruebas-avatar/rescate.sh /root/montaje.log; exit 1; }
cp $T/final/video01_elige_un_monton.mp4 /root/video01_elige_un_monton.mp4
cd /root && bash repo/lia-web/pruebas-avatar/rescate.sh /root/video01_elige_un_monton.mp4
