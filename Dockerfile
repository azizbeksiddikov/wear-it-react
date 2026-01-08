# Stage 1: Build the React app
FROM node:24.11.1-slim AS builder

WORKDIR /app

# Copy only package files first for better layer caching
COPY package.json yarn.lock ./

# Install dependencies with BuildKit cache mount
RUN --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile --production=false --network-timeout 100000 && \
    yarn cache clean

# Copy source code
COPY . .

# Build the app - standardized on VITE_API_URL
ARG VITE_API_URL
ENV NODE_ENV=production
RUN VITE_API_URL=$VITE_API_URL yarn build

# Stage 2: Minimal Node.js static file server
FROM node:24.11.1-slim

WORKDIR /app

# Install serve globally and curl for healthcheck
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    yarn global add serve@14.2.1 && \
    yarn cache clean && \
    rm -rf /tmp/* /var/tmp/* && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy built files from builder stage
COPY --from=builder /app/build ./build

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose port 3000 (standard for your setup)
EXPOSE 3000

# Start serve
CMD ["serve", "-s", "build", "-l", "3000"]
