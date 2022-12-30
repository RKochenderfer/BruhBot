#!/bin/bash
cd "$(dirname $0)" 
cd ../

docker build -t ghcr.io/rkochenderfer/bruhbot:latest . --load && docker push ghcr.io/rkochenderfer/bruhbot:latest