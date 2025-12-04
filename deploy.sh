#!/bin/bash

# Stop on error
set -e

echo "🚀 Starting Cantara Finance Deployment..."

# 1. Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull origin main

# 2. Build and Start Services
echo "🏗 Building and starting services..."
# We use --build to ensure we always run the latest code
docker-compose up -d --build

# 3. Wait for services to be healthy
echo "⏳ Waiting for services to stabilize..."
sleep 10

# 4. Run any necessary initialization (optional)
# Example: If you need to seed data via the backend container
# docker-compose exec backend npm run db:seed

echo "✅ Deployment Complete!"
echo "🌍 Frontend: https://cantara.finance"
echo "🔌 API: https://api.cantara.finance"
