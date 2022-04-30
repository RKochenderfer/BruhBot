#!/bin/bash
docker build -t ghcr.io/rkochenderfer/bruhbot:latest . --load
docker run ghcr.io/rkochenderfer/bruhbot:latest