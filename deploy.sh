#!/bin/bash

# Configuration
PROJECT_ROOT=$(pwd)
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"

echo "🚀 Starting BeamGuard AI Production Build..."

# 1. Build Frontend
echo "📦 Building React Frontend..."
cd "$FRONTEND_DIR"
npm install
npm run build

# 2. Setup Backend Dependencies
echo "🐍 Setting up Flask Backend..."
cd "$BACKEND_DIR"
pip3 install -r requirements.txt

# 3. Launch Unified Server
echo "✨ Deployment Ready!"
echo "📍 Access your app at: http://localhost:5001"

# In a real cloud environment, use gunicorn
# export PORT=5001
# gunicorn --bind 0.0.0.0:$PORT app:app

python3 app.py
