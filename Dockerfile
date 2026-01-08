# Multi-stage build for production - optimized for minimal resources
# Stage 1: Build the React app
FROM node:24.11.1-slim AS builder

# Add metadata labels
LABEL maintainer="Wear It Team" \
      version="1.0.0" \
      description="Wear It React Application"

WORKDIR /app

# Copy only package files first for better layer caching
COPY package.json yarn.lock ./

# Install dependencies with BuildKit cache mount for faster rebuilds
# Use --network-timeout to prevent hanging on slow networks
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile --production=false --network-timeout 100000 && \
    yarn cache clean && \
    rm -rf /tmp/* /var/tmp/*

# Copy source code
COPY . .

# Build the app - env var passed as build arg (not stored in image)
# Set NODE_ENV for optimized production build
ARG REACT_APP_API_URL
ENV NODE_ENV=production
RUN REACT_APP_API_URL=$REACT_APP_API_URL yarn build && \
    rm -rf node_modules yarn.lock package.json src public tsconfig.json && \
    rm -rf /tmp/* /var/tmp/*

# Stage 2: Minimal static file server
FROM node:24.11.1-slim

WORKDIR /app

# Install serve globally and curl for healthcheck, then clean up
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    yarn global add serve@14.2.1 && \
    yarn cache clean && \
    rm -rf /tmp/* /var/tmp/* && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy only built files from builder stage
COPY --from=builder /app/build ./build

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose port 3000 (as configured in nginx proxy)
EXPOSE 3000

# Start serve to serve static files
CMD ["serve", "-s", "build", "-l", "3000"]

