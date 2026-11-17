#!/bin/bash
# Vídeo 01: genera a Lía hablando (InfiniteTalk 480p, voz Carolina) y la escala a 1080p con RealESRGAN x2. EXIGE GPU de 80 GB.
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
MEM=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | head -1)
if [ "${MEM:-0}" -lt 79000 ]; then label "error:GPU-de-${MEM}MB-no-80GB"; exit 1; fi
label "1-instalando|GPU:${MEM}MB"
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
curl -s -o entrada/cam.mp3 "https://raw.githubusercontent.com/nuestrosproyectos/viajai/claude/gifted-lamport-2n79de/lia-web/videos/audio-01-carolina/lia_camara_01.mp3"
ffmpeg -y -loglevel error -i entrada/cam.mp3 -ar 16000 -ac 1 entrada/cam.wav
cat > entrada/cam.json <<'JSON'
{
  "prompt": "A middle-aged woman with dark curly hair, wearing a sheer black blouse with a black tie bow, sits in a dark room lit by warm candlelight and speaks calmly and warmly to the camera, with natural subtle head movements, blinking and gentle expressions. The candle flame flickers gently. Realistic, cinematic, static camera.",
  "cond_video": "entrada/lia.jpg",
  "cond_audio": {"person1": "entrada/cam.wav"}
}
JSON
label "3-generando-lia|GPU:${MEM}MB"
# latido: cada 10 min sube el final del registro, por si se cuelga
( while sleep 600; do tr '\r' '\n' < /root/it.log | tail -c 200000 > /root/latido.txt; L=$(subir /root/latido.txt); label "3-generando-lia|GPU:${MEM}MB|latido:$L"; done ) &
T0=$(date +%s)
timeout 10800 python generate_infinitetalk.py --ckpt_dir weights/Wan2.1-I2V-14B-480P --wav2vec_dir weights/chinese-wav2vec2-base \
  --infinitetalk_dir weights/InfiniteTalk/single/infinitetalk.safetensors \
  --lora_dir weights/Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank32.safetensors --lora_scale 1.0 \
  --input_json entrada/cam.json --size infinitetalk-480 --sample_text_guide_scale 1.0 --sample_audio_guide_scale 2.0 \
  --sample_steps 4 --sample_shift 2 --mode streaming --motion_frame 9 --max_frame_num 4000 \
  --offload_model False --save_file lia_cam01
T1=$(date +%s)
U1=$(subir lia_cam01.mp4)
label "4-escalando|480:$U1"
pip install -q realesrgan -c /root/fijas.txt
D=$(python -c "import importlib.util;print(importlib.util.find_spec('basicsr').submodule_search_locations[0])")
sed -i 's/torchvision.transforms.functional_tensor/torchvision.transforms.functional/' "$D/data/degradations.py"
test -f RealESRGAN_x2plus.pth || curl -sL -o RealESRGAN_x2plus.pth https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth
rm -rf fr fo && mkdir -p fr fo && ffmpeg -y -loglevel error -i lia_cam01.mp4 fr/%05d.png
python - <<'PY2'
import cv2, glob, os
from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan import RealESRGANer
m = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=2)
up = RealESRGANer(scale=2, model_path='RealESRGAN_x2plus.pth', model=m, tile=0, half=True)
fs = sorted(glob.glob('fr/*.png'))
for f in fs:
    out, _ = up.enhance(cv2.imread(f), outscale=2); cv2.imwrite('fo/' + os.path.basename(f), out)
print('ESCALADOS', len(fs))
PY2
ffmpeg -y -loglevel error -framerate 25 -i fo/%05d.png -vf "scale=-2:1080:flags=lanczos" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p lia_cam01_1080.mp4
T2=$(date +%s)
U2=$(subir lia_cam01_1080.mp4)
U3=$(subir /root/it.log)
label "5-hecho|480:$U1|1080:$U2|generar:$((T1-T0))s|escalar:$((T2-T1))s|GPU:${MEM}MB|log:$U3"
