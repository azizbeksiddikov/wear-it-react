# Deploy

The storefront is a static single-page app. You build it once and serve the files from any static host, or from the Docker image in this repo. It only needs the URL of the backend API.

The live site, https://wearit.azbek.me, runs this repository's `master` branch in Docker behind a reverse proxy, with the backend on https://wearit.admin.azbek.me.

## What you need

- A running [`wear-it`](https://github.com/azizbeksiddikov/wear-it) backend that allows your site's origin and credentials (CORS and cookies).
- Docker with Compose V2, or Node 24 to build the files yourself.
- A reverse proxy for HTTPS (nginx, Caddy, a CDN, or your host's own).

## Option 1: Docker (what production uses)

`Dockerfile` has two stages on Node 24 alpine: a builder (`npm ci`, then `npm run build` with `VITE_API_URL` as a build argument) and a small runtime stage that serves `build/` with `serve` on port 4010 as a non-root user.

```bash
git clone https://github.com/azizbeksiddikov/wear-it-react.git
cd wear-it-react
cp .env.example .env            # set VITE_API_URL to your backend, see KEYS.md
docker compose -f docker-compose.prod.yml up -d --build
```

The container listens on `127.0.0.1:4010` only, so put a reverse proxy in front of it. `VITE_API_URL` is baked into the files at build time: change it and you must rebuild the image.

|            | Dev compose              | Prod compose                               |
| ---------- | ------------------------ | ------------------------------------------ |
| File       | `docker-compose.dev.yml` | `docker-compose.prod.yml`                  |
| Container  | `wear-it-react-dev`      | `wear-it-react-prod`                       |
| Dockerfile | `Dockerfile.dev`         | `Dockerfile`                               |
| Env file   | `.env.dev`               | `.env`                                     |
| Port       | 4110                     | 127.0.0.1:4010                             |
| Checks     | none                     | `curl -f http://localhost:4010` every 30 s |

The dev compose mounts the repository into the container for hot reload. `deploy_dev.sh` and `deploy_prod.sh` stop the old container, rebuild and follow the logs. The compose files set no memory or CPU limit; add one for your host if you need it. Logs rotate (30 MB files, 10 kept).

## Option 2: static files

```bash
npm ci
VITE_API_URL=https://api.example.com npm run build
```

Upload `build/` to any static host. The host must send `index.html` for every path that is not a file (single-page app fallback), for example `try_files $uri /index.html;` in nginx.

## Reverse proxy example

`wearit-client.conf` and `wearit-admin.conf` are the nginx server blocks used for the live site. They proxy the storefront to `localhost:4010` and the backend to `localhost:4011`. HTTPS is added by Certbot. Use them as a starting point and replace the domain names.

## Redeploy

1. Merge to `master`.
2. On the host: `git fetch origin && git reset --hard origin/master`. Keep your env file out of git and do not overwrite it.
3. `docker compose -f docker-compose.prod.yml up -d --build`, then check the logs.
4. Check that the home page loads, a product opens, and the browser console shows no failed API calls.

Deploy the backend first when a change needs a new API field or error code, then the storefront. An older backend sends no `errorCode`, and the storefront then falls back to the backend's message text.

## Checks before deploying

```bash
npm run lint
npm test
npm run build
```

## Notes

- Compose names a project after its folder. If you rename the folder, stop and remove the old container (`docker rm -f wear-it-react-prod`) before the first deploy under the new name, because the container name is fixed.
- `Dockerfile` copies everything not listed in `.dockerignore`; env files are excluded from the image.
- See [KEYS.md](KEYS.md) for the one environment variable.
