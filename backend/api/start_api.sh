#!/bin/bash

echo "================================================"
echo "Starting NASA Exoplanet Classification API"
echo "================================================"
echo ""
echo "Activating virtual environment (if exists)..."
if [ -d "venv" ]; then
    source venv/bin/activate
fi
echo ""
echo "Starting FastAPI server..."
python start_api.py

