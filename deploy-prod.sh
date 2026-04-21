#!/bin/bash
# Production Deployment Script
# Usage: ./deploy.sh [local|ovh]

set -e

ENV=${1:-local}

echo "🚀 Deploying Portfolio in $ENV production mode..."

# Load environment variables
if [ "$ENV" = "local" ]; then
    ENV_FILE=".env.production.local"
    echo "📝 Using local production environment: $ENV_FILE"
elif [ "$ENV" = "ovh" ]; then
    ENV_FILE=".env.production.ovh"
    echo "📝 Using OVH production environment: $ENV_FILE"
else
    echo "❌ Invalid environment. Use 'local' or 'ovh'"
    exit 1
fi

# Check if .env file exists
if [ ! -f "backend/$ENV_FILE" ]; then
    echo "❌ File not found: backend/$ENV_FILE"
    echo "Please create the environment file first."
    exit 1
fi

# Export variables from .env file
set -a
source "backend/$ENV_FILE"
set +a

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Build and start
echo "🔨 Building Docker images..."
docker-compose -f docker-compose.prod.yml up --build -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 5

# Health check
echo "🏥 Checking service health..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend is healthy!"
else
    echo "⚠️ Backend health check failed"
    docker-compose -f docker-compose.prod.yml logs backend
    exit 1
fi

# Show status
echo ""
echo "✅ Deployment successful!"
echo ""
echo "📊 Services:"
echo "  - Backend:  http://localhost:5000"
echo "  - Frontend: http://localhost:3000"
echo "  - Health:   http://localhost:5000/api/health"
echo ""
echo "📝 View logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 Stop services: docker-compose -f docker-compose.prod.yml down"
