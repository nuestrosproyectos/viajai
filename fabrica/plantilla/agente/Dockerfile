# Imagen del agente de voz COMÚN para una web de la fábrica (lk agent create / lk agent deploy).
# Construir desde la raíz del repositorio indicando la web:
#   docker build -f fabrica/plantilla/agente/Dockerfile --build-arg WEB=reformas -t agente-reformas .
FROM python:3.13-slim
ARG WEB
ENV PYTHONUNBUFFERED=1 WEB_AGENTE=/app/web
WORKDIR /app
COPY fabrica/plantilla/agente/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY fabrica/plantilla/agente/agente.py fabrica/plantilla/agente/decir.py fabrica/plantilla/agente/apuntador.py ./
COPY ${WEB}/agente/ ./web/
RUN python -m livekit.agents download-files
CMD ["python", "agente.py", "start"]
