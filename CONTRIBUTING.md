# Contributing to Lipa Mdogo Platform

Thanks for contributing! This document covers how to set up a local development environment and basic hygiene to avoid committing secrets.

1. Setup

- Backend (Laravel):
  - Copy example env: cp backend/.env.example backend/.env
  - Install PHP deps: composer install (run in backend/)
  - Run migrations: php artisan migrate
  - Run tests: composer test

- Web (Next.js monorepo):
  - cd web
  - npm ci
  - npm run dev

2. Git hooks (recommended)

This repo includes a simple pre-commit hook under `.githooks/` to help prevent accidental commits of .env and private keys. To enable it locally run:

  git config core.hooksPath .githooks

After enabling, the hook will block commits that stage obvious sensitive files or private key contents.

3. Running tests

- Backend: from repo root run `cd backend && composer test`
- Web: from repo root run `cd web && npm run test` (if present)

4. Coding style

- Follow existing project patterns. Run linters where available (see web package scripts).

5. Opening PRs

- Include a short description of the change, why it is needed, and any migration or deployment steps.

Thank you!
