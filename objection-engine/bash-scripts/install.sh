#!/bin/bash
echo "This script is intended to be run in an venv environment"

cd "$(dirname $0)" 
cd ../

# libicu-dev also needs to be installed
# python3.10-dev needs to be installed
# python3.10-tk needs to be installed
python -m pip install -r requirements.txt