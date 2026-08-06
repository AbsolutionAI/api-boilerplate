.PHONY: smoke test docs-check
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

test: docs-check
	@cp -n .env.example .env 2>/dev/null || true
	@npx prisma db push --skip-generate >/dev/null 2>&1 || npx prisma db push
	@node scripts/smoke.js

smoke: test
