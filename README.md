# Wear It - React Application

Modern e-commerce React application for the Wear It fashion platform. A full-featured online shopping experience with product browsing, shopping cart, order management, and user authentication.

## About

Wear It is a web application built with React and TypeScript that provides customers with an intuitive shopping experience. The platform features product catalogs, shopping cart functionality, order tracking, and user account management.

## Features

- **Product Catalog**: Browse and search through fashion products with detailed product pages
- **Shopping Cart**: Add, remove, and manage items in your cart
- **Order Management**: Track orders with status (Processing, Paused, Finished)
- **User Authentication**: Secure login and registration system
- **User Profile**: Manage account settings and view order history
- **Featured Products**: Highlighted product collections and sales

## Tech Stack

- **Frontend Framework**: React 18.2.0
- **Language**: TypeScript 4.1.5
- **State Management**: Redux Toolkit with React Redux
- **UI Library**: Material-UI (MUI) v6.3.1
- **Routing**: React Router DOM v5.1.9
- **HTTP Client**: Axios
- **Data Fetching**: TanStack React Query
- **Styling**: Styled Components, CSS Modules
- **Build Tool**: Create React App (react-scripts 5.0.0)
- **Package Manager**: Yarn

## Prerequisites

- Docker with Docker Compose V2 (built-in `docker compose` command)
- Node.js 24.11.1+ (for local development)
- Yarn package manager

## Environment Setup

1. Copy the example environment file:

   ```bash
   cp env.example .env        # For production
   cp env.example .env.dev    # For development
   ```

2. Edit `.env` or `.env.dev` and set your environment variables:
   ```
   REACT_APP_API_URL=https://your-api-url.com
   ```

## Docker Deployment

### Production Deployment

```bash
./deploy_prod.sh
```

This will:

- Build the production Docker image
- Start the container on port 3000
- Configure resource limits (256MB memory, 0.5 CPU)
- Set up health checks

### Development Deployment

```bash
./deploy_dev.sh
```

This will:

- Build the development Docker image with hot reload
- Start the container on port 3000
- Mount source code for live updates

## Manual Docker Commands

### Build and Run Production

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Build and Run Development

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

### View Logs

```bash
# Production
docker compose -f docker-compose.prod.yml logs -f

# Development
docker compose -f docker-compose.dev.yml logs -f
```

### Stop Containers

```bash
# Production
docker compose -f docker-compose.prod.yml down

# Development
docker compose -f docker-compose.dev.yml down
```

## Local Development (without Docker)

```bash
# Install dependencies
yarn install

# Start development server (runs on http://localhost:3000)
yarn start

# Build for production
yarn build

# Run production build locally
yarn start:prod

# Lint code
yarn lint
```

## Project Structure

```
src/
├── app/
│   ├── components/       # Reusable UI components
│   │   ├── auth/         # Authentication modals
│   │   ├── headers/      # Navigation and basket
│   │   └── footer/       # Footer component
│   ├── screens/          # Page components
│   │   ├── homePage/     # Home page with featured products
│   │   ├── productsPage/ # Product catalog and details
│   │   ├── ordersPage/   # Order management
│   │   └── userPage/     # User profile
│   ├── services/         # API service layer
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React context providers
│   └── store.ts          # Redux store configuration
├── css/                  # Stylesheets
├── libs/                 # Utilities and configurations
└── public/               # Static assets
```

## Available Scripts

- `yarn start` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Check code for linting errors
- `yarn lint:fix` - Automatically fix linting issues
- `yarn start:prod` - Serve production build locally

## Environment Variables

The application requires the following environment variable:

- `REACT_APP_API_URL` - Backend API endpoint URL

## Health Checks

Production container includes health checks that verify the application is responding on port 3000.

## Notes

- The application runs on port 3000 inside the container
- Nginx at server level proxies requests to the container
- Environment variables are loaded from `.env` files (not baked into image)
- Build uses BuildKit cache for faster rebuilds
