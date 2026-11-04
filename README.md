# Wearit Storefront

[![CI](https://github.com/azizbeksiddikov/wear-it-react/actions/workflows/ci.yml/badge.svg)](https://github.com/azizbeksiddikov/wear-it-react/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)
![Vite](https://img.shields.io/badge/Vite-7-646cff)

The customer-facing website of **Wearit**, an online fashion shop. Browse products, filter and search, pick a size and colour, keep a basket, place orders and leave reviews. Phone first, English only.

Live demo: https://wearit.azbek.me

This repository is the **frontend**. It is a thin client: all data comes from the REST API in the backend repository, [`wear-it`](https://github.com/azizbeksiddikov/wear-it) (Express and MongoDB, which also serves the shop's admin site). There is no database here.

## Features

- **Catalogue:** home page with featured and sale products, a product list with search, category and gender filters, sorting and pagination.
- **Product page:** photo gallery, size and colour chips, quantity, price with sale price, ratings and reviews.
- **Basket and checkout:** a basket saved in the browser, free shipping from $50, one-tap checkout for signed-in members. Orders ship to the address saved in the profile; without one, checkout asks for it first.
- **Points and top-up:** orders are paid with points. The profile has a Balance card to add free demo points (1 to 1,000 at a time, up to 10,000; no real money). Paying with too few points offers to add some.
- **Account:** sign up and log in, profile page with photo, order history with status tabs (paused, processing, completed) and actions.
- **Reviews:** members can write, edit and delete one review per product.
- **Made to be used:** phone-first layout, 44 px tap targets, keyboard and screen-reader friendly, friendly error messages. The rules are in [docs/DESIGN-RULES.md](docs/DESIGN-RULES.md).

## Tech stack

React 19, TypeScript 5.9, Vite 7, MUI 7, Redux Toolkit, React Query, React Router 7, axios, sweetalert2, swiper. Plain CSS per screen. Tested with Node's test runner.

## Quick start

You need **Node 24** and npm, and a running backend (or any API that follows the backend's routes).

```bash
git clone https://github.com/azizbeksiddikov/wear-it-react.git
cd wear-it-react
npm install
cp .env.example .env        # set VITE_API_URL to your backend
npm run dev                 # http://localhost:4210
```

Build for production:

```bash
npm run build               # type check, then files in build/
npm run start:prod          # serve build/ on port 4210 (the Docker image uses 4010)
```

## Configuration

| Variable       | Required | Meaning                                                    |
| -------------- | -------- | ---------------------------------------------------------- |
| `VITE_API_URL` | yes      | base URL of the backend REST API, without a trailing slash |

It is read at build time and ends up in the browser bundle, so never put a secret in it. Details, file names per environment and rules: [docs/KEYS.md](docs/KEYS.md).

## Scripts

| Command                             | What it does                                                                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run dev`                       | Vite dev server with hot reload on port 4210; `/api` is proxied to `VITE_API_URL`                                                                            |
| `npm run build`                     | `tsc` type check, then production build into `build/`                                                                                                        |
| `npm run preview`                   | serve the Vite build locally                                                                                                                                 |
| `npm run start:prod`                | `serve -s build -l $PORT` (what the Docker image runs)                                                                                                       |
| `npm run lint` / `npm run lint:fix` | ESLint over `src`                                                                                                                                            |
| `npm test`                          | unit tests for the error message mapping                                                                                                                     |

## Project structure

```
src/
├── index.tsx             providers: Redux, React Query, MUI theme, router
├── app/
│   ├── App.tsx           routes, header, footer, login and signup modals
│   ├── screens/          one folder per page: homePage, productsPage, ordersPage,
│   │                     userPage, helpPage, notFoundPage
│   ├── components/       shared UI: headers (navbar, basket), footer, auth modals
│   ├── services/         axios classes for the backend (member, product, order, review)
│   ├── hooks/            useBasket (the basket), useGlobals (signed-in member)
│   └── MaterialTheme/    MUI theme: brand red, radius, typography
├── libs/                 config, error messages, alerts, image helpers, types, enums
└── css/                  plain CSS per screen and component
tests/                    unit tests
docs/                     architecture, design rules, deploy, keys
```

More in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## How it talks to the backend

Every request goes from the browser to the backend REST API (`/member`, `/product`, `/order`, `/review`) with cookies for the session. In development the Vite server proxies `/api` to `VITE_API_URL`, so there are no CORS problems; in production the API must allow your site's origin and credentials. The backend repo is [`wear-it`](https://github.com/azizbeksiddikov/wear-it); run it locally or point `VITE_API_URL` at your own copy. Please do not create accounts, orders or reviews on the public demo.

## Documentation

| File                                               | Content                                              |
| -------------------------------------------------- | ---------------------------------------------------- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)       | folders, routes, data flow, auth, basket, state      |
| [docs/DESIGN-RULES.md](docs/DESIGN-RULES.md)       | how the storefront looks and behaves, with checklist |
| [docs/DEPLOY.md](docs/DEPLOY.md)                   | Docker and static hosting, redeploy steps            |
| [docs/KEYS.md](docs/KEYS.md)                       | environment variable (name only)                     |
| [PROGRESS.md](PROGRESS.md)                         | status, known gaps, open decisions                   |

## Contributing

Report security problems as described in [SECURITY.md](SECURITY.md). Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for the branch model (`develop`, then `master`), the checks to run (`npm run lint`, `npm run build`, `npm test`) and the commit style.

## License

[MIT](LICENSE), Copyright (c) 2026 Azizbek Siddikov.
