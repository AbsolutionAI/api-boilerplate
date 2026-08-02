# API Boilerplate — Express + Prisma + JWT

**Production-ready REST API with authentication, database, validation, rate limiting, tests, and Docker.**

## Quick Start

```bash
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

Server runs at `http://localhost:4000`.

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | HTTP port |
| `JWT_SECRET` | *(required)* | Secret used to sign JWTs — **change before production** |
| `DATABASE_URL` | `file:./dev.db` | Prisma connection string (SQLite by default) |
| `RATE_LIMIT_MAX` | `100` | Max requests per IP per 15-minute window |

To use PostgreSQL:
1. Change `provider` in `prisma/schema.prisma` to `"postgresql"`
2. Set `DATABASE_URL` to your Postgres connection string
3. Run `npx prisma db push`

## Features

- **Express** — fast, unopinionated, well-documented
- **Prisma ORM** — type-safe database access (SQLite/Postgres)
- **JWT auth** — signup/login with bcrypt, middleware
- **Zod validation** — request body validation with detailed errors
- **Rate limiting** — configurable per-IP limits
- **Helmet** — security headers
- **Tests** — Node.js native test runner
- **Docker** — Dockerfile for production builds
- **CI** — GitHub Actions workflow

## API

```
GET  /api/health        → health check
POST /api/auth/signup   → create account (email, password, name?)
POST /api/auth/login    → login (email, password)
GET  /api/users/me      → get current user (auth required)
GET  /api/users         → list users (auth required)
```

### Example: signup + login

```bash
# Signup
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","password":"password123","name":"Dev"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@example.com","password":"password123"}'

# Authenticated request
curl http://localhost:4000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Scripts

```bash
npm run dev        # start with --watch
npm start          # production start
npm test           # run tests
npm run db:push    # push Prisma schema
npm run db:seed    # seed sample data
npm run db:studio  # open Prisma Studio
```

## License

MIT
