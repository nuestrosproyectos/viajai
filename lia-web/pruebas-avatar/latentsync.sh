#!/bin/bash
# Prueba LatentSync 1.6 (solo la boca) sobre un vídeo base de Lía, en una RTX 4090 alquilada en Vast.ai.
exec > /root/ls.log 2>&1
set -x
BASE=https://raw.githubusercontent.com/nuestrosproyectos/viajai/claude/gifted-lamport-2n79de/lia-web
label() { { set +x; } 2>/dev/null; curl -s -X PUT "https://console.vast.ai/api/v0/instances/${CONTAINER_ID}/" -H "Authorization: Bearer ${CONTAINER_API_KEY}" -H 'Content-Type: application/json' -d "{\"label\":\"$1\"}"; }
subir() { curl -s -F reqtype=fileupload -F time=72h -F "fileToUpload=@$1" https://litterbox.catbox.moe/resources/internals/api.php; }
fallo() { U=$(subir /root/ls.log); label "error:$U"; exit 1; }
trap fallo ERR
set -e

label "1-instalando"
T0=$(date +%s)
apt-get update -qq && apt-get install -y -qq ffmpeg git libgl1 > /dev/null
cd /root && (test -d LatentSync || git clone -q https://github.com/bytedance/LatentSync) && cd LatentSync
grep -v gradio requirements.txt > /root/req.txt
pip install -q -r /root/req.txt
pip install -q hf_transfer
export HF_HUB_ENABLE_HF_TRANSFER=1
python - <<'PY'
from huggingface_hub import hf_hub_download
hf_hub_download('ByteDance/LatentSync-1.6', 'whisper/tiny.pt', local_dir='checkpoints')
hf_hub_download('ByteDance/LatentSync-1.6', 'latentsync_unet.pt', local_dir='checkpoints')
print('DESCARGAS OK')
PY
mkdir -p entrada
curl -s -o entrada/base.mp4 "$BASE/pruebas-avatar/lia-base-40s.mp4"
curl -s -o entrada/a1.mp3 "$BASE/videos/audio-01-d5/A1.mp3"
ffmpeg -y -loglevel error -i entrada/a1.mp3 -ar 16000 -ac 1 entrada/a1.wav
T1=$(date +%s)
nvidia-smi --query-gpu=name,memory.total --format=csv

label "2-sincronizando"
python -m scripts.inference --unet_config_path configs/unet/stage2_512.yaml \
  --inference_ckpt_path checkpoints/latentsync_unet.pt --inference_steps 20 --guidance_scale 1.5 \
  --enable_deepcache --video_path entrada/base.mp4 --audio_path entrada/a1.wav --video_out_path ls_a1.mp4
T2=$(date +%s)
U1=$(subir ls_a1.mp4)
U2=$(subir /root/ls.log)
label "3-hecho|video:$U1|instalar:$((T1-T0))s|generar:$((T2-T1))s|log:$U2"
