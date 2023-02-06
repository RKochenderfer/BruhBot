#!/bin/bash
cd "$(dirname $0)" 
cd ../chat_trainer

docker build -t ghcr.io/rkochenderfer/bruhbot-chatbot:latest . --load