# Contributing

Thanks for taking an interest in the Wearit storefront. This guide covers how to set up, what to check before you open a pull request, and how we write commits.

The storefront is a thin client for the REST API in [`wear-it`](https://github.com/azizbeksiddikov/wear-it). Backend changes go there.

## Set up

You need Node 24 and npm.

```bash
git clone https://github.com/azizbeksiddikov/wear-it-react.git
cd wear-it-react
npm install
cp .env.example .env     # set VITE_API_URL, see docs/KEYS.md
npm run dev              # http://localhost:4210
```

Point `VITE_API_URL` at your own copy of the backend. Do not create accounts, orders or reviews on the public demo site.

## Branches

- `develop` is where work happens. Branch from it (`feature/short-name`, `fix/short-name`) and open your pull request against `develop`.
- `master` is the released branch. It only receives merges from `develop` once everything is checked. The live site runs from `master`.
- Keep a branch small and about one thing.

## Checks to run before a pull request

```bash
npm run lint            # ESLint
npm run build           # type check (tsc) and production build
npm test                # unit tests (error message mapping)
```

For any change to how a screen looks, also open it yourself at 350 and 1400 px and read [docs/DESIGN-RULES.md](docs/DESIGN-RULES.md). Its checklist at the bottom is the definition of done for a design change.

## Code style

- TypeScript, React function components, MUI where a component exists, plain CSS in `src/css` otherwise.
- Tabs for indentation, single quotes, semicolons, trailing commas, print width 120 (see `.prettierrc`). Run `npm run format:files -- <files>` before committing: it organizes imports and runs Prettier.
- Backend calls live in `src/app/services`. Components do not call axios directly.
- Show errors with `sweetErrorHandling(err)`. A new backend error code gets a sentence in `src/libs/errorMessages.ts` and a test in `tests/errorMessages.test.ts`.
- Never commit env files or real keys. `docs/KEYS.md` lists the one variable the app reads.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary`, in the present tense, 72 characters or fewer.

| Type       | Use for                                         |
| ---------- | ----------------------------------------------- |
| `feat`     | a new feature                                   |
| `fix`      | a bug fix                                       |
| `docs`     | documentation only                              |
| `style`    | visual changes that do not change behaviour     |
| `refactor` | code change that is neither a fix nor a feature |
| `test`     | adding or fixing tests or checks                |
| `chore`    | tooling, dependencies, config                   |

Examples: `fix(basket): ask before emptying the basket`, `docs: explain the basket rules`.

One logical change per commit, so a reviewer can read them one by one. Explain why in the body when it is not obvious.

## Pull requests

- Describe what changed and why, and how you checked it. For visual changes add before and after screenshots to the pull request description. Do not commit them to the repository.
- Update the docs when behaviour changes (`docs/`, `PROGRESS.md`).
- Be kind in reviews and discussions.

## Reporting a problem

Open an issue with what you did, what you expected, what happened, the browser and the screen width. For a security problem, do not open a public issue; email the maintainer through the address on their GitHub profile.

## License

By contributing you agree that your work is released under the [MIT license](LICENSE).
