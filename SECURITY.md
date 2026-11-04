# Security policy

## Reporting a vulnerability

Please do not open a public issue for a security problem. Use GitHub's private vulnerability reporting (the **Security** tab of this repository, then **Report a vulnerability**).

Include what you found, how to reproduce it and what you think the impact is. You will get an answer as soon as the maintainer can, usually within a week.

Problems in the API itself belong in the backend repository: <https://github.com/azizbeksiddikov/wear-it>.

## Known limitations

These are documented and are not secrets:

- The member object (name, email, phone, address, points) and the cart are cached in `localStorage`, so any script running on the page can read them. They are only display hints: the session lives in an httpOnly cookie that scripts cannot read, and the server decides who is signed in.

## Keeping your own deployment safe

- Never commit real values. The only tracked environment file is `.env.example`, which holds placeholders.
- `VITE_*` variables are baked into the public bundle at build time. Never put a secret in them.
- Serve the site over HTTPS.
