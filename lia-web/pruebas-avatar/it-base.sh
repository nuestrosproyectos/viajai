#!/bin/bash
# Genera la BASE de Lía en silencio (boca cerrada, escuchando, vela parpadeando) para luego sincronizar labios con LatentSync.
# El progreso se publica en la etiqueta (label) de la instancia; los vídeos se suben a litterbox (72 h).
exec > /root/it.log 2>&1
set -x
BASE=https://raw.githubusercontent.com/nuestrosproyectos/viajai/claude/gifted-lamport-2n79de/lia-web/pruebas-avatar
label() { { set +x; } 2>/dev/null; curl -s -X PUT "https://console.vast.ai/api/v0/instances/${CONTAINER_ID}/" -H "Authorization: Bearer ${CONTAINER_API_KEY}" -H 'Content-Type: application/json' -d "{\"label\":\"$1\"}"; }
subir() { curl -s -F reqtype=fileupload -F time=72h -F "fileToUpload=@$1" https://litterbox.catbox.moe/resources/internals/api.php; }
fallo() { U=$(subir /root/it.log); label "error:$U"; exit 1; }
trap fallo ERR
set -e

T_INI=$(date +%s)
label "1-instalando"
apt-get update -qq && apt-get install -y -qq ffmpeg git > /dev/null
cd /root && (test -d InfiniteTalk || git clone -q https://github.com/MeiGen-AI/InfiniteTalk) && cd InfiniteTalk
# Python 3.11 ya no tiene inspect.ArgSpec: se sustituye por FullArgSpec
grep -rl 'from inspect import ArgSpec' --include=*.py . | xargs -r sed -i 's/from inspect import ArgSpec/from inspect import FullArgSpec as ArgSpec/'
# Fijar versiones de mediados de 2025: sin esto pip instala piezas de 2026 incompatibles (torch 2.15)
cat > /root/fijas.txt <<'FIJAS'
torch==2.4.1
torchvision==0.19.1
torchaudio==2.4.1
xformers==0.0.28
huggingface_hub>=0.30,<1.0
transformers==4.51.3
tokenizers>=0.21,<0.22
diffusers==0.33.1
accelerate==1.6.0
xfuser==0.4.3
numpy<2
FIJAS
pip install -q xformers==0.0.28 --index-url https://download.pytorch.org/whl/cu121
pip install -q "misaki[en]" ninja psutil packaging wheel -c /root/fijas.txt
pip install -q flash_attn==2.7.4.post1 --no-build-isolation || echo "SIN FLASH-ATTN"
grep -v gradio requirements.txt > /root/req.txt
pip install -q -r /root/req.txt -c /root/fijas.txt --extra-index-url https://download.pytorch.org/whl/cu121
pip install -q librosa hf_transfer -c /root/fijas.txt
python -c "import torch, xformers; print('TORCH', torch.__version__, torch.cuda.is_available())"

label "2-descargando-modelo"
export HF_HUB_ENABLE_HF_TRANSFER=1
python - <<'PY'
from huggingface_hub import snapshot_download, hf_hub_download
snapshot_download('Wan-AI/Wan2.1-I2V-14B-480P', local_dir='weights/Wan2.1-I2V-14B-480P')
snapshot_download('TencentGameMate/chinese-wav2vec2-base', local_dir='weights/chinese-wav2vec2-base')
hf_hub_download('TencentGameMate/chinese-wav2vec2-base', 'model.safetensors', revision='refs/pr/1', local_dir='weights/chinese-wav2vec2-base')
snapshot_download('MeiGen-AI/InfiniteTalk', allow_patterns=['single/*'], local_dir='weights/InfiniteTalk')
hf_hub_download('Kijai/WanVideo_comfy', 'Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank32.safetensors', local_dir='weights')
print('DESCARGAS OK')
PY
du -sh weights

mkdir -p entrada
curl -s -o entrada/lia.jpg "$BASE/lia-foto-frontal.jpg"
curl -s -o entrada/lia.mp3 "$BASE/lia-prueba-1min.mp3"
ffmpeg -y -loglevel error -i entrada/lia.mp3 -ar 16000 -ac 1 entrada/lia.wav
ffmpeg -y -loglevel error -f lavfi -i anullsrc=r=16000:cl=mono -t 60 entrada/silencio.wav
cat > entrada/base.json <<'JSON'
{
  "prompt": "A middle-aged woman with dark curly hair, wearing a sheer black blouse with a black tie bow, sits in a dark room lit by warm candlelight. She listens quietly and attentively to the camera with her mouth closed and a soft, warm expression, breathing calmly, blinking naturally, with very subtle head movements. The candle flame flickers gently and continuously. Realistic, cinematic, static camera.",
  "cond_video": "entrada/lia.jpg",
  "cond_audio": {"person1": "entrada/silencio.wav"}
}
JSON
label "3-generando-base"
# latido: cada 10 min sube el final del registro, por si se cuelga
( while sleep 600; do tr '\r' '\n' < /root/it.log | tail -c 200000 > /root/latido.txt; L=$(subir /root/latido.txt); label "3-generando-base|latido:$L"; done ) &
T0=$(date +%s)
timeout 4500 python generate_infinitetalk.py --ckpt_dir weights/Wan2.1-I2V-14B-480P --wav2vec_dir weights/chinese-wav2vec2-base \
  --infinitetalk_dir weights/InfiniteTalk/single/infinitetalk.safetensors \
  --lora_dir weights/Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank32.safetensors --lora_scale 1.0 \
  --input_json entrada/base.json --size infinitetalk-480 --sample_text_guide_scale 1.0 --sample_audio_guide_scale 2.0 \
  --sample_steps 4 --sample_shift 2 --mode streaming --motion_frame 9 --max_frame_num 1600 \
  --offload_model False --save_file lia_base_silencio
T1=$(date +%s)
U1=$(subir lia_base_silencio.mp4)
U2=$(subir /root/it.log)
label "5-hecho|base:$U1:$((T1-T0))s|log:$U2"
