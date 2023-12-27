#!/bin/bash
echo "Building all images"
cd "$(dirname $0)" 

echo "Building objection engine"
cd ../objection-engine
docker build -t ghcr.io/rkochenderfer/bruhbot-objection-engine:latest . --load

echo "Building Bruhbot"
cd ../
docker build -t ghcr.io/rkochenderfer/bruhbot:latest . --load

echo "All builds finished. Beginning publishing."

echo "Publishing bruhbot objection engine"
docker push ghcr.io/rkochenderfer/bruhbot-objection-engine:latest

echo "Publishing bruhbot"
docker push ghcr.io/rkochenderfer/bruhbot:latest