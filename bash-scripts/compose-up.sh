#!/bin/bash
cd "$(dirname $0)" 
cd ../

tsc
docker build -t ghcr.io/rkochenderfer/bruhbot:latest .
docker compose --env-file ./config/.env.dev -f deployments/development.yaml up