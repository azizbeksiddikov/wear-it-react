# Stage 1: Build the React app
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies in one layer
COPY package.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install --production=false --prefer-offline --no-audit && \
    npm cache clean --force

# Copy source code and build in one layer
COPY . .
ARG VITE_API_URL
ENV NODE_ENV=production
RUN VITE_API_URL=$VITE_API_URL npm run build

# Stage 2: Production runtime
FROM node:24-alpine

WORKDIR /app

# Install serve and create user in one layer
RUN npm install -g serve@14.2.1 && \
    addgroup -g 1001 -S appuser && \
    adduser -S -u 1001 -G appuser appuser && \
    npm cache clean --force

# Copy built files and set ownership
COPY --from=builder --chown=appuser:appuser /app/build ./build

USER appuser

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
