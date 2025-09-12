#!/bin/bash
cd "$(dirname $0)" 
cd ../

tsc
docker compose --env-file ./config/.env.dev -f deployments/docker-compose.debug.yaml restart bruhbot
docker compose --env-file ./config/.env.dev -f deployments/docker-compose.debug.yaml restart objection_engine