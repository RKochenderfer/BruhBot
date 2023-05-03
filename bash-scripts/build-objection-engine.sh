#!/bin/bash
cd "$(dirname $0)" 
cd ../objection-engine

docker build -t ghcr.io/rkochenderfer/bruhbot-objection-engine:latest . --load