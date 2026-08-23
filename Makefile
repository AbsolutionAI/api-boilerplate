.PHONY: smoke test docs-check deps
docs-check:
	@test -f README.md
	@test -f ARCHITECTURE.md
	@test -f THIRD_PARTY.md
	@test -f SECURITY.md
	@test -f CONTRACTS.md
	@test -f .env.example
	@test -f LICENSE
	@test -f docs/linear-map.md
	@echo 'docs-check ok'

deps:
	@npm install --no-fund --no-audit

test: docs-check deps
	@cp -n .env.example .env 2>/dev/null || true
	@# Use package-local Prisma (package.json ^5.x). Host-global Prisma 7 rejects schema url=.
	@./node_modules/.bin/prisma generate
	@./node_modules/.bin/prisma db push --skip-generate
	@node scripts/smoke.js

smoke: test
