#!/bin/bash
cd "$(dirname $0)" 
cd ../

docker compose -f deployments/development.yaml down