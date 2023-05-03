#!/bin/bash
echo "Building all images"
cd "$(dirname $0)" 

echo "Building bruhbot chatbot"
cd ../chat_trainer
docker build -t ghcr.io/rkochenderfer/bruhbot-chatbot:latest . --load

echo "Building objection engine"
cd ../objection-engine
docker build -t ghcr.io/rkochenderfer/bruhbot-objection-engine:latest . --load

echo "Building Bruhbot"
cd ../
docker build -t ghcr.io/rkochenderfer/bruhbot:latest . --load
