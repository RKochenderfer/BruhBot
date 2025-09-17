#!/bin/bash
cd "$(dirname $0)" 
cd ../
# Read version from package.json
VERSION=$(grep '"version"' ./package.json | head -1 | sed -E 's/.*"version": *"([^"]+)".*/\1/')

echo "Detected version: $VERSION"

echo "Building Bruhbot"
docker build -t ghcr.io/rkochenderfer/bruhbot:"$VERSION" . --load
docker push ghcr.io/rkochenderfer/bruhbot:"$VERSION"