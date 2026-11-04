# Architecture

## Overview

```
Browser
  │
  ▼
nginx on the host ──► wear-it-react-prod  (serve, static build, container and host port 4010)
  │                        │
  │                        │ runs in the browser, axios with credentials:
  │                        │   REST ──► VITE_API_URL  (/member, /product, /order, /review)
  ▼                        ▼
wear-it backend (Express, host port 4011, wearit.admin.azbek.me) ─► MongoDB, Supabase (images)
```

The storefront is a single-page app: Vite builds static files and `serve -s` returns `index.html` for every route. All data is fetched from the browser. There is no server-side rendering and no server code here.

In dev, `serverApi` is `/api` and Vite proxies `/api/*` to `VITE_API_URL` (prefix stripped), which avoids CORS. In a production build `serverApi` is `VITE_API_URL`.

## Folders

| Path                      | Content                                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `src/index.tsx`           | providers: Redux, global context, React Query, MUI theme and `CssBaseline`, router. Sets axios `withCredentials` |
| `src/app/App.tsx`         | routes, navbar, footer, login and signup modal, cart state from `useBasket`                                      |
| `src/app/screens/<page>/` | `homePage`, `productsPage` (list and `ChosenProduct`), `ordersPage`, `userPage`, `helpPage`                      |
| `src/app/components/`     | `headers` (Navbar, Basket), `footer`, `auth` (login and signup modals), `divider`, `ScrollToTop`                 |
| `src/app/services/`       | `MemberService`, `ProductService`, `OrderService`, `ReviewService` (axios classes)                               |
| `src/app/hooks/`          | `useBasket` (cart in localStorage), `useGlobals` (auth member, order refresh trigger)                            |
| `src/app/MaterialTheme/`  | MUI theme: brand red `#E60023`, 16 px radius, container padding                                                  |
| `src/libs/`               | `config` (API base, messages), `sweetAlert`, `types`, `enums`, `data` (FAQ, terms, plans)                        |
| `src/css/`                | plain CSS per screen and component, imported by the component that uses it                                       |

## Routes

| Route           | Screen                                                                    |
| --------------- | ------------------------------------------------------------------------- |
| `/`             | home: introduction, featured products, sale products, statistics, advert  |
| `/products`     | catalogue with search, category, gender, sort and pagination              |
| `/products/:id` | product detail: images, variant (size and colour), quantity, reviews      |
| `/orders`       | the signed-in member's orders by status (links shown only when signed in) |
| `/my-page`      | profile and account settings                                              |
| `/help`         | FAQ, terms, plans                                                         |
| anything else   | 404 page ("Page not found") with links home and to the products           |

Every screen except home is lazy loaded behind `Suspense`. There is no route guard component: `/orders` and `/my-page` send a signed-out visitor to the home page from inside the screen, and the API refuses their requests anyway.

## Backend calls

| Service          | Calls                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `MemberService`  | `POST /member/signup`, `/member/login`, `/member/logout`, `/member/update`, `/member/topup`; `GET /member/detail` |
| `ProductService` | `GET /product/all?...` (direction, page, limit, category, gender, isFeatured, onSale, search), `GET /product/:id` |
| `OrderService`   | `POST /order/create`, `GET /order/all/?page&orderStatus`, `POST /order/update`                                    |
| `ReviewService`  | `POST /review/create/`, `/review/update/`, `/review/delete/:id`                                                   |

## State

- **Auth:** the backend sets an httpOnly session cookie, which the page cannot read, and every request sends it (`withCredentials`). Nothing in the app touches `document.cookie`. The member object is cached in `localStorage` (`memberData`) only as a display hint, so the header renders signed-in at once; `ContextProvider` asks `GET /member/detail` on every start. A 401 clears the hint and signs the shopper out; offline or server errors keep what is shown.
- **Cart:** `useBasket` keeps items in React state and `localStorage` (`cartData`), keyed by `variantId`. The cart UI (`Basket`) is shown only to signed-in members. Subtotal uses the sale price when set; shipping is $5 under a $50 subtotal, free from $50.
- **Checkout:** `Basket` posts the order via `OrderService.createOrder` and then clears the cart, bumps `orderBuilder` in the global context (orders refetch) and navigates to `/orders`. The shipping address is the member's saved address (`shippingAddressOf` in `libs/points.ts`). Without one, the API is not called: a dialog sends the shopper to the profile page and the basket stays.
- **Points and top-up:** orders are paid with points (an order moves from paused to processing on the Orders page, and the backend checks the balance). `BalanceCard` on the profile page adds free demo points through `MemberService.topUp` (`POST /member/topup`, 1 to 1,000 at a time, balance at most 10,000). `libs/points.ts` holds the limits and the pure checks (`shippingAddressOf`, `pointsMissing`, `checkTopUp`) used by the basket, the order card and the balance card. `POST /member/update` ignores points, so the profile form shows the balance read-only.
- **Page data:** Redux Toolkit slices per page (`homePage`, `productsPage`, `ordersPage`) with selectors next to them; services are called from the components. The Redux logger runs only in dev.
- **Alerts and errors:** `libs/sweetAlert.ts` wraps sweetalert2 for error, success, toast and confirm dialogs. Errors go through `libs/errorMessages.ts`, which turns the backend's `{ errorCode, message }` into a friendly sentence (known code, then backend message, then a "no connection" or generic line). Product photos fall back to a placeholder through `libs/image.ts`.

## Theme and styling

MUI theme (`src/app/MaterialTheme`) sets the palette (red `#E60023` primary, `#111111` text, `#767676` secondary text), typography (system font stack, h1 28 px, body 16 px) and button shape. Most layout is plain CSS in `src/css`, with a phone layout up to 600 px, a tablet layout from 601 to 899 px (the header turns into the compact bar with a drawer up to 899 px, and the product filters collapse behind a button) and the desktop layout from 900 px. There is no dark mode.

## Build

`npm run build` runs `tsc` (type check only) and `vite build` into `build/`. The Vite config splits vendor chunks (react, mui, utils), pre-compresses assets larger than 10 KB to gzip and optimises images at build time.
