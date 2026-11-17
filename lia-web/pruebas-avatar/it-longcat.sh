#!/bin/bash
# Si ya hay resultado de una ejecución anterior, solo lo rescata (no vuelve a generar)
if [ -f /root/LongCat-Video/lia_longcat_a1.mp4 ]; then
  curl -s -H "Accept: application/vnd.github.raw" -o /root/rescate.sh "https://api.github.com/repos/nuestrosproyectos/viajai/contents/lia-web/pruebas-avatar/rescate.sh?ref=claude/gifted-lamport-2n79de"
  cd /root/LongCat-Video && exec bash /root/rescate.sh lia_longcat_a1.mp4
fi
# Prueba LongCat-Video-Avatar (1.6, o 1.5 si no existe) con la presentación de Lía (A1, voz Carolina, 46 s). EXIGE GPU de 80 GB.
exec > /root/lc.log 2>&1
set -x
label() { { set +x; } 2>/dev/null; curl -s -X PUT "https://console.vast.ai/api/v0/instances/${CONTAINER_ID}/" -H "Authorization: Bearer ${CONTAINER_API_KEY}" -H 'Content-Type: application/json' -d "{\"label\":\"$1\"}"; }
subir() { for i in 1 2 3; do U=$(curl -s -F reqtype=fileupload -F time=72h -F "fileToUpload=@$1" https://litterbox.catbox.moe/resources/internals/api.php); case "$U" in https*) echo "$U"; return;; esac; cp "$1" /root/subida_$i.txt; set -- /root/subida_$i.txt; sleep 5; done; echo "SUBIDA-FALLIDA"; }
fallo() { { set +x; } 2>/dev/null; U=$(subir /root/lc.log); C=$(tr '\r' '\n' < /root/lc.log | grep -vE '^\+|^\s*$' | tail -4 | tr -cd '[:alnum:] ._:/=-' | tail -c 350); label "error:$U|$C"; exit 1; }
trap fallo ERR
set -e
RAW=https://raw.githubusercontent.com/nuestrosproyectos/viajai/claude/gifted-lamport-2n79de/lia-web
MEM=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | head -1)
if [ "${MEM:-0}" -lt 79000 ]; then label "error:GPU-de-${MEM}MB-no-80GB"; exit 1; fi
python -c "import torch;x=torch.ones(4096,4096,device='cuda');print('GPU OK',float((x@x).sum()))" || { label "error:GPU-averiada"; exit 1; }
label "1-instalando|GPU:${MEM}MB"
T0=$(date +%s)
apt-get update -qq && apt-get install -y -qq ffmpeg libsndfile1 git > /dev/null
cd /root && (test -d LongCat-Video || git clone -q https://github.com/meituan-longcat/LongCat-Video) && cd LongCat-Video
pip install -q torch==2.6.0+cu124 torchvision==0.21.0+cu124 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu124
pip install -q ninja psutil packaging hf_transfer "huggingface_hub[cli]"
pip install -q "https://github.com/Dao-AILab/flash-attention/releases/download/v2.7.4.post1/flash_attn-2.7.4.post1+cu12torch2.6cxx11abiFALSE-cp311-cp311-linux_x86_64.whl"
# Sus listas traen paquetes que no existen en pip (libsndfile1 es del sistema) o que no hacen falta para generar
grep -vE '^(streamlit|flash-attn|torch)==' requirements.txt > /root/req1.txt
grep -vE '^(libsndfile1|tritonserverclient)==' requirements_avatar.txt > /root/req2.txt
pip install -q -r /root/req1.txt
pip install -q -r /root/req2.txt
python -c "import torch,flash_attn;print('VERSIONES',torch.__version__,flash_attn.__version__,torch.cuda.is_available())"

label "2-descargando-modelo"
export HF_HUB_ENABLE_HF_TRANSFER=1
python - <<'PY'
from huggingface_hub import snapshot_download
snapshot_download("meituan-longcat/LongCat-Video", local_dir="weights/LongCat-Video", allow_patterns=["tokenizer/*","text_encoder/*","vae/*"])
ver = None
for v in ("1.6", "1.5"):
    try:
        snapshot_download(f"meituan-longcat/LongCat-Video-Avatar-{v}", local_dir=f"weights/LongCat-Video-Avatar-{v}", ignore_patterns=["base_model_int8/*"])
        ver = v; break
    except Exception as e:
        print("NO DISPONIBLE", v, e)
open("/root/lc_version.txt", "w").write(ver or "")
print("VERSION", ver)
PY
V=$(cat /root/lc_version.txt); [ -n "$V" ]
du -sh weights

mkdir -p inputs
curl -s -o inputs/lia.jpg "$RAW/pruebas-avatar/lia-foto-frontal.jpg"
curl -s -o inputs/a1.mp3 "$RAW/videos/audio-01-carolina/A1.mp3"
ffmpeg -y -loglevel error -i inputs/a1.mp3 -ar 16000 -ac 1 inputs/a1.wav
cat > inputs/lia.json <<'JSON'
{
  "prompt": "A middle-aged woman with dark curly hair, wearing a sheer black blouse with a black tie bow, sits in a dark room lit by warm candlelight and speaks calmly and warmly to the camera, with natural subtle head movements, natural blinking and gentle expressions. The candle flame flickers gently. Realistic, cinematic, static camera.",
  "cond_image": "inputs/lia.jpg",
  "cond_audio": { "person1": "inputs/a1.wav" }
}
JSON
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 inputs/a1.wav)
SEG=$(python -c "import math;print(math.ceil(($DUR-3.72)/3.2)+1)")
T1=$(date +%s)
label "3-generando|v$V|$SEG-segmentos|GPU:${MEM}MB"
( while sleep 600; do tr '\r' '\n' < /root/lc.log | tail -c 200000 > /root/latido.txt; L=$(subir /root/latido.txt); label "3-generando|v$V|latido:$L"; done ) &
timeout 7200 torchrun --nproc_per_node=1 run_demo_avatar_single_audio_to_video.py \
  --context_parallel_size=1 --checkpoint_dir=./weights/LongCat-Video-Avatar-$V \
  --model_type avatar-v$V --stage_1=ai2v --input_json=inputs/lia.json --resolution 480p \
  --num_segments=$SEG --ref_img_index=10 --mask_frame_range=3 --use_distill --lora_multiplier 1.0 \
  --output_dir ./salida
T2=$(date +%s)
OUT=$(ls -t salida/*.mp4 | head -1)
ffmpeg -y -loglevel error -i "$OUT" -i inputs/a1.mp3 -map 0:v -map 1:a -c:v libx264 -crf 17 -c:a aac -shortest lia_longcat_a1.mp4
U1=$(subir lia_longcat_a1.mp4)
U2=$(subir /root/lc.log)
label "5-hecho|v$V|video:$U1|instalar:$((T1-T0))s|generar:$((T2-T1))s|log:$U2"
