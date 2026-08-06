# Architecture

Express HTTP API with Prisma ORM and JWT auth.

```
Client → Express (helmet, rate-limit) → routes
                              ↓
                     JWT middleware
                              ↓
                     Prisma → SQLite (default) / Postgres
```

## Boundaries
- **Standalone tool:** clone, `npm i`, `make smoke` / tests — no Aspen runtime required
- **Grove:** optional API demo service on port 4000 in products profile

## Layout
- `src/` — app entry and routes
- `prisma/` — schema + seed
- `tests/` — Node test runner
