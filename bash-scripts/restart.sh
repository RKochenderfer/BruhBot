#!/bin/bash
cd "$(dirname $0)" 
cd ../

tsc
docker compose -f deployments/development.yaml restart