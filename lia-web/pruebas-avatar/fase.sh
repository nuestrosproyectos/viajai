#!/bin/bash
# Fase: 15 s a 480p con UNA sola pasada por paso (sin refuerzo de audio), para comparar con la de dos pasadas.
exec > /root/it.log 2>&1
set -x
label() { { set +x; } 2>/dev/null; curl -s -X PUT "https://console.vast.ai/api/v0/instances/${CONTAINER_ID}/" -H "Authorization: Bearer ${CONTAINER_API_KEY}" -H 'Content-Type: application/json' -d "{\"label\":\"$1\"}"; }
subir() { curl -s -F reqtype=fileupload -F time=72h -F "fileToUpload=@$1" https://litterbox.catbox.moe/resources/internals/api.php; }
fallo() { U=$(subir /root/it.log); label "error:$U"; exit 1; }
trap fallo ERR
set -e
cd /root/InfiniteTalk

# Parche: con audio_guide_scale = 1 no hace falta la segunda pasada (el resultado matemático es el mismo que la primera)
python - <<'PY'
import re
p='wan/multitalk.py'; s=open(p).read()
n=len(re.findall(r'noise_pred_drop_audio = self\.model\(\s*latent_model_input, t=timestep, \*\*arg_null_audio\)\[0\]', s))
s=re.sub(r'noise_pred_drop_audio = self\.model\(\s*latent_model_input, t=timestep, \*\*arg_null_audio\)\[0\]',
         'noise_pred_drop_audio = noise_pred_cond if math.isclose(audio_guide_scale, 1.0) else self.model(latent_model_input, t=timestep, **arg_null_audio)[0]', s)
open(p,'w').write(s); print('PARCHES', n)
PY

label "10-prueba1pasada"
T0=$(date +%s)
python generate_infinitetalk.py --ckpt_dir weights/Wan2.1-I2V-14B-480P --wav2vec_dir weights/chinese-wav2vec2-base \
  --infinitetalk_dir weights/InfiniteTalk/single/infinitetalk.safetensors \
  --lora_dir weights/Wan21_T2V_14B_lightx2v_cfg_step_distill_lora_rank32.safetensors --lora_scale 1.0 \
  --input_json entrada/p15.json --size infinitetalk-480 --sample_text_guide_scale 1.0 --sample_audio_guide_scale 1.0 \
  --sample_steps 4 --sample_shift 2 --mode streaming --motion_frame 9 --max_frame_num 1050 \
  --offload_model False --save_file p480_1pasada
T1=$(date +%s)
U1=$(subir p480_1pasada.mp4)
U2=$(subir /root/it.log)
label "11-hecho|480_1pasada:$U1:$((T1-T0))s|log:$U2"
