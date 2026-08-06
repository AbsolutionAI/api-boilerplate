# Third-party review

1. `cp .env.example .env` (set any JWT_SECRET)
2. `npm ci` (or `npm install`)
3. `npx prisma db push`
4. `npm test`
5. `make smoke`
6. Optional: `npm run dev` and hit health/auth routes

## Expect
- No production secrets in repo
- SQLite file created locally (gitignored)
- MIT license
