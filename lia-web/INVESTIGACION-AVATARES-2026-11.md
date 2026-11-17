# Investigación avatares parlantes (17-11-2026, 15 agentes) — conclusiones

## Decisión de formato
- Referencia: TarotimeAI (~356k subs, web de lecturas IA): Shorts 30–60 s «elige 1/2/3», «te saqué una carta», microhistorias; enlace a lectura gratis concreta en la 1.ª línea de la descripción. Vídeos largos de 2–3 min, no de 12–15.

## Herramientas (calidad de labios)
- HeyGen Avatar 6: n.º 1 en New Measure Avatar Arena (a ciegas, 27/10–16/11/2026; clips ≤35 s, inglés). App Pro 59 €/mes ≈ 50 min avatar. Web Creator 29 $ (Avatar IV foto 16 créd/min).
- InfiniteTalk: n.º 1 en sincronía en español (Everypixel, oct-2026, a ciegas). Pago por uso: WaveSpeed 0,03 $/s 480p, hasta 10 min por llamada. RunPod Public Endpoint 0,25–0,50 $/vídeo (límite sin verificar).
- OmniHuman 2.0 (BytePlus 0,07 $/s, fal 0,105 $/s; hasta 300 s; 720p). Kling Avatar 2.0 Pro fal 0,115 $/s. Hedra Character-3 ~3,75 $/min 1080p.
- LongCat-Video-Avatar 1.6 (MIT, Whisper multilingüe): bien en evaluaciones del propio fabricante; en ComfyUI se degrada antes que InfiniteTalk en vídeos largos.
- Descartados: LatentSync (labios malos), 720p InfiniteTalk (3,5× coste), HunyuanVideo-Avatar (excluye UE), Sonic (no comercial).

## Infraestructura
- Vast.ai: experiencia mala (GPU averiadas, A100 de 40 GB anunciadas como A100, litterbox/tmpfiles bloquean sus IPs). No volver salvo necesidad.
- Si se alquila GPU: RunPod Secure + network volume (~6 $/mes) o OVH (España, IVA). Transferencia de archivos: Cloudflare R2 con URL prefirmadas.
- Ajustes InfiniteTalk buenos: lightx2v 4 pasos, lora_scale 1.0, audio_guide 2–2,5, text 1, tramos <1 min, audio original de ElevenLabs en el montaje.

## Normas
- YouTube: «contenido alterado/sintético = Sí»; política de contenido inauténtico (jul-2026): no monetiza personajes IA que dan consejos de salud/finanzas/legal. Guiones sin predicciones de salud, dinero ni temas legales; aviso de entretenimiento.
- TikTok: etiqueta «contenido generado por IA».

## Coste real del 17-11 en Vast
- Pagado con tarjeta: 35 $ (recarga automática de 5 $). Consumido ~23,5 $. Saldo 11,47 $ (incluye abono de 2 $ de Vast tras reclamación por GPU averiada, instancia 61103812).
- Recomendado: desactivar la recarga automática en Vast → Billing.

## CORRECCIÓN con datos reales (Apify, búsquedas YouTube ES, noviembre 2026)
- TarotimeAI NO sirve de referencia: 356k subs con 8 Shorts → inflado.
- Lo que funciona en tarot en español: VÍDEOS LARGOS (20–90 min). Ej.: The Destiny Call 84k (34 min, «qué piensa/siente de ti»), Mystic Tarot 30–40k («tarot interactivo amor hoy», 48–71 min), Katiuska Romero 35–39k (horóscopo semanal 1,5 h), Stargirl 12–24k, Aura Tarot 11–22k (un signo por vídeo, 16 min), Tarot Amor Edén ~20k.
- Shorts de tarot: casi todos 10–900 visitas; solo despuntan drama de amor y horóscopo semanal (7k–36k). Usar como anzuelo.
- «Tarot con IA» como gancho: rechazo («La IA está destruyendo el tarot», 34k). Etiquetar IA (obligatorio) pero no venderlo en título/miniatura.
- Temas: amor/persona especial/qué siente de ti > signo por signo > horóscopo semanal > elige una carta genérico.
