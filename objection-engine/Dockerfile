FROM python:3.10.11-slim-buster

WORKDIR /app

COPY requirements.txt .
RUN apt-get update && \
	apt-get install ffmpeg libsm6 g++ pkg-config libicu-dev python3-tk -y && \
	pip install -r requirements.txt && \
	apt-get clean && \
	rm -rf ~/.cache/pip/*

COPY . .

EXPOSE 5000

# CMD FLASK_APP=app.py flask run
CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]
# FROM python:3.10.11 AS build


# WORKDIR /app

# COPY requirements.txt requirements.txt
# RUN apt-get update && \
# 	apt-get install -y libicu-dev && \
# 	pip3 install --user --no-cache-dir -r requirements.txt

# COPY . .

# # Production stage
# FROM python:3.10.11-slim-buster
# LABEL org.opencontainers.image.source https://github.com/RKochenderfer/BruhBot

# WORKDIR /app

# COPY --from=build /root/.local /root/.local
# ENV PATH=/root/.local/bin:$PATH

# COPY . .

# EXPOSE 5000/tcp

# CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]