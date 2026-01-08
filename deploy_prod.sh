#!/bin/bash

# Production deployment script
set -e

echo "Starting production deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if docker compose is available (Docker Compose V2)
if ! docker compose version &> /dev/null; then
    echo "ERROR: docker compose (V2) is not available. Please ensure Docker is installed."
    exit 1
fi

# Check if .env exists
if [ ! -f .env ]; then
    echo "ERROR: .env file is required but not found."
    exit 1
fi

IMAGE_NAME="wearit-react:prod"

echo "Stopping containers using image $IMAGE_NAME..."
docker ps -a --filter "ancestor=$IMAGE_NAME" --format "{{.ID}}" | while read container_id; do
    [ -n "$container_id" ] && docker stop "$container_id" 2>/dev/null || true
done

echo "Stopping and removing containers..."
docker compose -f docker-compose.prod.yml down

echo "Removing image $IMAGE_NAME..."
docker rmi -f "$IMAGE_NAME" 2>/dev/null || true

echo "Building and starting production containers..."
# Use DOCKER_BUILDKIT for faster builds with cache
export DOCKER_BUILDKIT=1
docker compose -f docker-compose.prod.yml up -d --build

# Wait a moment for container to start
sleep 2

# Check if container is running
if docker ps | grep -q wear-it-react-prod; then
    echo "Production deployment complete!"
    echo "Application is running on port 3000 (proxied by nginx at server level)"
    echo ""
    echo "Container status:"
    docker ps --filter "name=wear-it-react-prod" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "Showing latest 200 logs (Ctrl+C to exit logs)..."
    docker compose -f docker-compose.prod.yml logs --tail=200 -f
else
    echo "ERROR: Container failed to start. Check logs:"
    docker compose -f docker-compose.prod.yml logs
    exit 1
fi

