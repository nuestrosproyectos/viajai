# Imagen para desplegar el agente en LiveKit Cloud (lk agent create / lk agent deploy)
FROM python:3.13-slim
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY agente.py instrucciones.txt saludo.txt ./
# Descarga previa de los modelos locales (detector de voz y de fin de turno)
RUN python -m livekit.agents download-files
CMD ["python", "agente.py", "start"]
