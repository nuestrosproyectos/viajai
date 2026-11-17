#!/bin/bash
# Genera un vídeo de Lía hablando con InfiniteTalk en una GPU alquilada de Vast.ai.
# El progreso se publica en la etiqueta (label) de la instancia; los vídeos se suben a litterbox (72 h).
exec > /root/it.log 2>&1
set -x
BASE=https://raw.githubusercontent.com/nuestrosproyectos/viajai/claude/gifted-lamport-2n79de/lia-web/pruebas-avatar
label() { curl -s -X PUT "https://console.vast.ai/api/v0/instances/${CONTAINER_ID}/" -H "Authorization: Bearer ${CONTAINER_API_KEY}" -H 'Content-Type: application/json' -d "{\"label\":\"$1\"}"; }
subir() { curl -s -F reqtype=fileupload -F time=72h -F "fileToUpload=@$1" https://litterbox.catbox.moe/resources/internals/api.php; }
fallo() { U=$(subir /root/it.log); label "error:$U"; exit 1; }
trap fallo ERR
set -e

label "1-instalando"
apt-get update -qq && apt-get install -y -qq ffmpeg git > /dev/null
cd /root && git clone -q https://github.com/MeiGen-AI/InfiniteTalk && cd InfiniteTalk
pip install -q xformers==0.0.28 --index-url https://download.pytorch.org/whl/cu121
pip install -q "misaki[en]" ninja psutil packaging wheel
pip install -q flash_attn==2.7.4.post1 --no-build-isolation || echo "SIN FLASH-ATTN"
pip install -q -r requirements.txt
pip install -q librosa "huggingface_hub[cli]" hf_transfer

label "2-descargando-modelo"
export HF_HUB_ENABLE_HF_TRANSFER=1
huggingface-cli download Wan-AI/Wan2.1-I2V-14B-480P --local-dir weights/Wan2.1-I2V-14B-480P
huggingface-cli download TencentGameMate/chinese-wav2vec2-base --local-dir weights/chinese-wav2vec2-base
huggingface-cli download TencentGameMate/chinese-wav2vec2-base model.safetensors --revision refs/pr/1 --local-dir weights/chinese-wav2vec2-base
huggingface-cli download MeiGen-AI/InfiniteTalk --include "single/*" --local-dir weights/InfiniteTalk
huggingface-cli download Kijai/WanVideo_comfy Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank32.safetensors --local-dir weights

mkdir -p entrada
curl -s -o entrada/lia.jpg "$BASE/lia-foto-frontal.jpg"
curl -s -o entrada/lia.mp3 "$BASE/lia-prueba-1min.mp3"
ffmpeg -y -loglevel error -i entrada/lia.mp3 -ar 16000 -ac 1 entrada/lia.wav
cat > entrada/lia.json <<'JSON'
{
  "prompt": "A middle-aged woman with dark curly hair, wearing a sheer black blouse with a black tie bow, sits in a dark room lit by warm candlelight and speaks calmly and warmly to the camera, with natural subtle head movements, blinking and gentle expressions. Realistic, cinematic, static camera.",
  "cond_video": "entrada/lia.jpg",
  "cond_audio": {"person1": "entrada/lia.wav"}
}
JSON

label "3-generando-rapido"
T0=$(date +%s)
python generate_infinitetalk.py --ckpt_dir weights/Wan2.1-I2V-14B-480P --wav2vec_dir weights/chinese-wav2vec2-base \
  --infinitetalk_dir weights/InfiniteTalk/single/infinitetalk.safetensors \
  --lora_dir weights/Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank32.safetensors --lora_scale 1.0 \
  --input_json entrada/lia.json --size infinitetalk-480 --sample_text_guide_scale 1.0 --sample_audio_guide_scale 2.0 \
  --sample_steps 4 --sample_shift 2 --mode streaming --motion_frame 9 --max_frame_num 1050 --save_file lia_rapido
T1=$(date +%s)
U1=$(subir lia_rapido.mp4)
label "4-rapido-listo:$U1:$((T1-T0))s|generando-calidad"

python generate_infinitetalk.py --ckpt_dir weights/Wan2.1-I2V-14B-480P --wav2vec_dir weights/chinese-wav2vec2-base \
  --infinitetalk_dir weights/InfiniteTalk/single/infinitetalk.safetensors \
  --input_json entrada/lia.json --size infinitetalk-480 --sample_steps 40 --mode streaming --motion_frame 9 \
  --max_frame_num 1050 --save_file lia_calidad
T2=$(date +%s)
U2=$(subir lia_calidad.mp4)
U3=$(subir /root/it.log)
label "5-hecho:$U1:$((T1-T0))s|$U2:$((T2-T1))s|log:$U3"
