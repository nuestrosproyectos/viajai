#!/bin/bash
# Fase en espera: no genera nada; deja el ordenador listo para la siguiente fase.
label() { curl -s -X PUT "https://console.vast.ai/api/v0/instances/${CONTAINER_ID}/" -H "Authorization: Bearer ${CONTAINER_API_KEY}" -H 'Content-Type: application/json' -d "{\"label\":\"$1\"}"; }
label "en-espera"
