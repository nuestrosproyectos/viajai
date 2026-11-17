#!/bin/bash
# Fase: prueba de 15 s a 720p (sin descarga de modelo a CPU) + escalado RealESRGAN x2 -> 1080p, y la misma a 480p para comparar.
exec > /root/it.log 2>&1
set -x
label() { curl -s -X PUT "https://console.vast.ai/api/v0/instances/${CONTAINER_ID}/" -H "Authorization: Bearer ${CONTAINER_API_KEY}" -H 'Content-Type: application/json' -d "{\"label\":\"$1\"}"; }
subir() { curl -s -F reqtype=fileupload -F time=72h -F "fileToUpload=@$1" https://litterbox.catbox.moe/resources/internals/api.php; }
fallo() { U=$(subir /root/it.log); label "error:$U"; exit 1; }
trap fallo ERR
set -e
cd /root/InfiniteTalk
nvidia-smi --query-gpu=name,memory.used,memory.total --format=csv

ffmpeg -y -loglevel error -i entrada/lia.wav -t 15 entrada/p15.wav
cat > entrada/p15.json <<'JSON'
{
  "prompt": "A middle-aged woman with dark curly hair, wearing a sheer black blouse with a black tie bow, sits in a dark room lit by warm candlelight and speaks calmly and warmly to the camera, with natural subtle head movements, blinking and gentle expressions. Realistic, cinematic, static camera.",
  "cond_video": "entrada/lia.jpg",
  "cond_audio": {"person1": "entrada/p15.wav"}
}
JSON

gen() { # $1 tamaño  $2 salida
  python generate_infinitetalk.py --ckpt_dir weights/Wan2.1-I2V-14B-480P --wav2vec_dir weights/chinese-wav2vec2-base \
    --infinitetalk_dir weights/InfiniteTalk/single/infinitetalk.safetensors \
    --lora_dir weights/Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank32.safetensors --lora_scale 1.0 \
    --input_json entrada/p15.json --size "$1" --sample_text_guide_scale 1.0 --sample_audio_guide_scale 2.0 \
    --sample_steps 4 --sample_shift 2 --mode streaming --motion_frame 9 --max_frame_num 1050 \
    --offload_model False --save_file "$2"
}

label "6-prueba720"
T0=$(date +%s); gen infinitetalk-720 p720; T1=$(date +%s)
U1=$(subir p720.mp4)
label "7-720listo:$U1:$((T1-T0))s|escalando"

# Escalado RealESRGAN x2 (fotograma a fotograma en la GPU) y bajada a 1080 de alto
pip install -q realesrgan -c /root/fijas.txt
F=$(python -c "import basicsr,os;print(os.path.join(os.path.dirname(basicsr.__file__),'data','degradations.py'))")
sed -i 's/torchvision.transforms.functional_tensor/torchvision.transforms.functional/' "$F"
test -f RealESRGAN_x2plus.pth || curl -sL -o RealESRGAN_x2plus.pth https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.1/RealESRGAN_x2plus.pth
rm -rf fr fo && mkdir -p fr fo
ffmpeg -y -loglevel error -i p720.mp4 fr/%05d.png
T2=$(date +%s)
python - <<'PY'
import cv2, glob, os, torch
from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan import RealESRGANer
m = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=2)
up = RealESRGANer(scale=2, model_path='RealESRGAN_x2plus.pth', model=m, tile=0, half=True)
fs = sorted(glob.glob('fr/*.png'))
for f in fs:
    img = cv2.imread(f)
    out, _ = up.enhance(img, outscale=2)
    cv2.imwrite('fo/' + os.path.basename(f), out)
print('ESCALADOS', len(fs))
PY
ffmpeg -y -loglevel error -framerate 25 -i fo/%05d.png -i entrada/p15.wav -vf "scale=-2:1080:flags=lanczos" \
  -c:v libx264 -crf 17 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -shortest p720_1080.mp4
T3=$(date +%s)
U2=$(subir p720_1080.mp4)
label "8-1080listo:$U2:$((T3-T2))s|prueba480"

T4=$(date +%s); gen infinitetalk-480 p480; T5=$(date +%s)
U3=$(subir p480.mp4)
U4=$(subir /root/it.log)
label "9-hecho|720:$U1:$((T1-T0))s|1080:$U2:$((T3-T2))s|480:$U3:$((T5-T4))s|log:$U4"
