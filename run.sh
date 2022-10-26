#!/bin/bash
tsc
docker build -t ghcr.io/rkochenderfer/bruhbot:latest .
docker compose up