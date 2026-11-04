# AGENTS.md: wear-it-react

Map and rules for any AI agent in this repo. Details live in `docs/`.

## Hard rules

- **Never read, print, edit or search inside env files** (`.env`, `.env.*`, any depth). Use `docs/KEYS.md` and `.env.example`.
- Dev talks to the local backend by default. Never point it at the live API, and never create accounts, orders or reviews on the live site, without an explicit `VITE_API_URL` from the maintainer.
- Develop on `develop`; merge to `master` when confirmed. Do not commit, push, deploy or send anything unless asked.
- No big rewrites. Extend what exists.

## Map

Read the doc that matches the task before you start.

| Task                                                                       | Read                                               |
| -------------------------------------------------------------------------- | -------------------------------------------------- |
| Where things are, routes, state, backend calls, auth, cart, points         | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)       |
| Any UI or CSS change (spacing, tap targets, colours, definition of done)   | [docs/DESIGN-RULES.md](docs/DESIGN-RULES.md)       |
| Env variables, API URL, keys                                               | [docs/KEYS.md](docs/KEYS.md)                       |
| Build, Docker, nginx, release                                              | [docs/DEPLOY.md](docs/DEPLOY.md)                   |
| What is done, known gaps, what is next                                     | [PROGRESS.md](PROGRESS.md)                         |
| Setup, scripts, project overview                                           | [README.md](README.md)                             |
| Branches, commit style, checks                                             | [CONTRIBUTING.md](CONTRIBUTING.md)                 |
| Reporting a vulnerability                                                  | [SECURITY.md](SECURITY.md)                         |

Source layout (details in ARCHITECTURE):

- `src/index.tsx`, `src/app/App.tsx`: providers, routes, shell.
- `src/app/screens/<page>/`: one folder per page, with its components, `slice.ts`, `selector.ts`.
- `src/app/components/`, `hooks/`, `services/`, `MaterialTheme/`: shared UI, hooks, axios services, theme.
- `src/libs/`: config, alerts, error messages, points helpers, `types/`, `enums/`, `data/`.
- `src/css/`: plain CSS per screen and component.

## Rules

- Stack style: tabs, single quotes, semicolons, trailing commas, width 120 (`.prettierrc`).
- Backend calls only through `src/app/services` (`serverApi`). No axios in components.
- New backend field or enum value: update `libs/types` and `libs/enums` with the service.
- Show errors with `sweetErrorHandling(err)`. Never raw backend text.
- Auth is an httpOnly cookie: never use `document.cookie`.
- Points: only `MemberService.topUp` adds them; use `libs/points.ts` helpers.
- Money is USD (`$`, two decimals). Brand text is "Wearit".
- UI work follows `docs/DESIGN-RULES.md`.

## Before finishing

1. `npm run format:files -- <changed files>`.
2. `npm run lint`, `npm run build`, `npm test` pass.
3. UI changes: checked at 350, 700, 1050 and 1400 px.
4. Update `PROGRESS.md` (and the relevant doc if behaviour changed).
5. Report briefly: what changed, what was verified, what needs the maintainer.
