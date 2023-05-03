#!/bin/bash
cd "$(dirname $0)" 
cd ../

tsc
docker compose --env-file ./config/.env.dev -f deployments/development.yaml up --build