#!/bin/bash
echo "This script is intended to be run in an venv environment"

cd "$(dirname $0)" 
cd ../

python -m pip install -r requirements.txt