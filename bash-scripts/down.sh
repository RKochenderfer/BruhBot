#!/bin/bash
cd "$(dirname $0)" 
cd ../

docker compose --env-file ./config/.env.dev -f deployments/docker.compose.debug.yaml down