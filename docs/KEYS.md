# Keys and environment variables

Names and meaning only. **Never put real values in this file, the repo, or chat.**

| Variable       | Required | Meaning                                                                                                                      |
| -------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL` | yes      | base URL of the backend REST API, no trailing slash. Production: used for every request. Dev: the target of the `/api` proxy |

That is the only variable. It is **baked into the browser bundle at build time**, so it is public. It is not a secret; never put a secret in it. The client holds no API keys.

If `VITE_API_URL` is unset, `vite.config.ts` defaults the dev proxy to the local backend, `http://localhost:4011`. Production is only reached when you set `VITE_API_URL` to it on purpose.

A template with a placeholder value is `.env.example`. Copy it to `.env` and fill in your own value.

## Where each lives

| Environment         | File                         | Notes                                                                                                                        |
| ------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Production          | `.env` on the host           | read by `docker-compose.prod.yml` as `env_file` and for the `VITE_API_URL` build argument. Never overwrite it when deploying |
| Docker dev          | `.env.dev`                   | read by `docker-compose.dev.yml`                                                                                             |
| Local `npm run dev` | `.env`                       | Vite loads it in dev mode                                                                                                    |

`.gitignore` covers `.env` and every `.env.*` file (`.env.example` excepted). Do not commit env files.

## Changing a value

- Dev server: edit the file, restart `npm run dev`.
- Production: the value is passed as a Docker build argument, so **rebuild the image** after a change (`./deploy_prod.sh`, or `docker compose -f docker-compose.prod.yml up -d --build`). Restarting alone does not change what the browser sees.

## Rules

- The API must allow the site origin and credentials (CORS and cookies); this is set in the backend.
