#!/bin/bash

cd "$(dirname $0)" 
cd ../

mkdir -p ./deployments/.temp

tsc
docker compose --env-file ./config/.env.dev -f deployments/docker.compose.debug.yaml up