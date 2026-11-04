# Progress: wear-it-react

Last updated: 2026-11-03

Backend progress is tracked in the [wear-it](https://github.com/azizbeksiddikov/wear-it/blob/master/PROGRESS.md) repository. This file covers the storefront only.

## Status

Live at https://wearit.azbek.me, running from `master`.

## Done

- Brand text changed to "Wearit" (2026-10-21).
- Phone redesign: compact header with drawer, compact hero, 2-column grids, collapsible filters, 44 px chips (2026-10-26).
- Docs: short README, CONTRIBUTING, LICENSE (MIT), AGENTS.md, `docs/` set (architecture, design rules, deploy, keys).
- Design standard: [docs/DESIGN-RULES.md](docs/DESIGN-RULES.md) with a definition of done.
- Friendly errors by backend `errorCode` (`libs/errorMessages.ts`, tests in `tests/`), a "no connection" message, confirm dialogs for destructive actions.
- Audit and fixes on every storefront screen: contrast, text size, 44 px tap targets at touch widths, focus ring, reduced motion, safe area, labelled controls and fields, one `h1` per page, real buttons for options, loading, empty and error states, placeholder for missing photos, a 404 page, a "Product not found" state for missing products, and a crash fallback page (`src/app/components/errorBoundary`).
- Checkout ships to the member's saved address; without one the API is not called and a dialog sends the shopper to the profile (`libs/points.ts`, unit tested).
- Balance card on the profile: free demo points via `POST /member/topup` (1 to 1,000 per top-up, balance cap 10,000). The editable Reward Points field is gone. Paying an order with too few points offers to add points; the basket shows the shortfall.
- Auth: the session cookie is httpOnly; nothing reads `document.cookie`. `ContextProvider` asks `GET /member/detail` on every start and only a 401 signs the shopper out.
- CI (`.github/workflows/ci.yml`: lint, build, test) and `svgo` and `sharp` added so the image optimizer runs without errors (the Docker image builds unchanged).

## Known gaps

- Font sizes are still fixed `px` in most CSS files (the rule says rem); only "no text under 12 px" is enforced. The spacing scale (4, 8, 12, 16, 24, 32, 48) is not applied everywhere.
- Colour contrast is not measured automatically. Contrast was checked by script on the public pages at phone and desktop widths and fixed; the signed-in screens, modals and the help page were only looked at, not measured.
- Outlined buttons have a very light border (`#efefef`) that is below 3:1 against white; their text is clear.
- The top-up and the httpOnly cookie need the matching backend (`POST /member/topup`, cookie flag). Deploy the backend first, then this frontend.
- A few leftovers of an older blue accent remain in the review styles and the Featured badge on the detail page.
- Orders, profile, basket and reviews were checked with a mocked API only, never against a live account. Nothing was tested with a screen reader.
- Home page sections have no loading skeleton (they stay empty until the data arrives).
- No dark theme (a decision, see the design rules).
- No end-to-end or component tests; only the error message mapping and the points helpers have unit tests.
- The admin site (EJS views in the backend) was out of scope and is unchanged.
