# syntax=docker/dockerfile:1

FROM python:3.8
LABEL org.opencontainers.image.source https://github.com/RKochenderfer/BruhBot

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .
EXPOSE 5005

CMD [ "rasa", "run", "--enable-api"]