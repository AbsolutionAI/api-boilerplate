# Security

- Change `JWT_SECRET` before any shared deploy
- Default SQLite is for local/dev only
- Rate limiting enabled via `RATE_LIMIT_MAX`
- Helmet security headers on by default
- Do not commit `.env` or `*.db`
