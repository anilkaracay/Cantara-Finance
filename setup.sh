#!/bin/bash

# Stop on error
set -e

echo "🔧 Initializing Cantara Server..."

# 1. Update System
echo "📦 Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update && apt-get upgrade -y

# 2. Install Basic Tools
echo "🛠 Installing git, curl, unzip..."
apt-get install -y git curl unzip

# 3. Install Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    echo "✅ Docker already installed."
fi

# 4. Install Docker Compose (Standalone)
if ! command -v docker-compose &> /dev/null; then
    echo "🐙 Installing Docker Compose..."
    curl -SL https://github.com/docker/compose/releases/download/v2.23.3/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo "✅ Docker Compose already installed."
fi

echo "🎉 Server Setup Complete!"
echo "👉 Now run: ./deploy.sh"
