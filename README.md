# Lipa Mdogo Platform

**Multi-tenant SaaS for asset-financing companies** — Phase 1 MVP focused on **Watu Credit**.

## Architecture

```
lipa-mdogo-platform/
├── backend/          Laravel REST API (PostgreSQL)
├── client/           Flutter (admin dashboard + sales agent app)
├── device-agent/     Native Android tracking agent (Phase 3+)
└── docs/
```

## Phase 1 - Complete

✅ **Backend API** - REST, multi-tenant, Sanctum auth
✅ **Data Model** - 10 tables, row-level isolation via `company_id`
✅ **Core Workflows**:
   - Device inventory management
   - Customer onboarding
   - Sales/financing agreement creation
   - Payment logging
   - Lead pipeline (pre-sale)

✅ **Watu Credit Seed Data** - 1 admin, 1 ops, 2 agents

## Project Status

**Backend:** Phase 1 API complete, ready for migration + testing
**Client:** Next — Flutter scaffolding with shared core package
**Device Agent:** Phase 3+

## Quick Start

### Backend

```bash
cd backend

# 1. Set up PostgreSQL (local or cloud)
# Update .env with DB credentials

# 2. Install & migrate
composer install
php artisan migrate

# 3. Seed Watu Credit data
php artisan db:seed --class=WatuCreditSeeder

# 4. Start server
php artisan serve
# API: http://localhost:8000/api/v1
```

See [backend/SETUP.md](backend/SETUP.md) for full details and API endpoints.

### Watu Credit Test Credentials

- **Admin:** `admin@watucredit.co.ke` / `password`
- **Agent:** `agent1@watucredit.co.ke` / `password`

## Key Design Decisions

1. **PostgreSQL** — Native JSONB, RLS, superior to MySQL for multi-tenant
2. **Sanctum Token Auth** — Stateless, API-first, device-friendly
3. **Row-Level Scoping** — All queries auto-filter by `company_id` (one DB, many tenants)
4. **Watu Credit First** — Single tenant proof-of-concept before multi-onboarding
5. **Database Queue** — No external dependencies for Phase 1; Redis optional for Phase 2+

## Next Steps

1. **Migrate + test** backend API (local PostgreSQL)
2. **Scaffold Flutter client** — monorepo with admin/agent flavors
3. **Build agent mobile UI** — device list, customer onboarding, payment entry
4. **Build admin dashboard UI** — inventory, sales, payment overview
5. **End-to-end test** — flutter ↔ API ↔ database
6. **Phase 2** — Alerts, overdue detection, agent KPIs
7. **Phase 3** — Android device tracking agent

## Compliance & Security

- ✅ Multi-tenant row-level isolation
- ✅ Sanctum token-based auth (no sessions)
- ⚠️ **TODO:** Encrypt IMEI + national_id at rest (Phase 2)
- ⚠️ **TODO:** Data retention policy for location pings (Phase 3+)
- ⚠️ **TODO:** Consent screens in client (Phase 3+)

## Team

Single developer MVP — backend complete, client next.

---

**For detailed API docs, see [backend/SETUP.md](backend/SETUP.md)**
