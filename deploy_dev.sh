#!/bin/bash

# Development deployment script
set -e

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

# Check if .env.dev exists
if [ ! -f .env.dev ]; then
    echo "ERROR: .env.dev file is required but not found."
    exit 1
fi

IMAGE_NAME="wearit-react:dev"

echo "Stopping containers using image $IMAGE_NAME..."
docker ps -a --filter "ancestor=$IMAGE_NAME" --format "{{.ID}}" | while read container_id; do
    [ -n "$container_id" ] && docker stop "$container_id" 2>/dev/null || true
done

echo "Stopping and removing containers..."
docker compose -f docker-compose.dev.yml down

echo "Removing image $IMAGE_NAME..."
docker rmi -f "$IMAGE_NAME" 2>/dev/null || true

echo "Building and starting development containers..."
# Use DOCKER_BUILDKIT for faster builds with cache
export DOCKER_BUILDKIT=1
docker compose -f docker-compose.dev.yml up -d --build

# Wait a moment for container to start
sleep 2

# Check if container is running
if docker ps | grep -q wear-it-react-dev; then
    echo "Development deployment complete!"
    echo "Application is running at http://localhost:3000"
    echo ""
    echo "Container status:"
    docker ps --filter "name=wear-it-react-dev" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "To view logs: docker compose -f docker-compose.dev.yml logs -f"
    echo "To stop: docker compose -f docker-compose.dev.yml down"
else
    echo "ERROR: Container failed to start. Check logs:"
    docker compose -f docker-compose.dev.yml logs
    exit 1
fi

