# Lipa Mdogo Platform - Phase 1 Backend Setup

## Prerequisites

- PHP 8.5+
- PostgreSQL 13+
- Composer 2.0+

## Environment Setup

### 1. PostgreSQL Database

Install PostgreSQL locally or use a cloud provider. For local development:

```bash
# Windows - Download from https://www.postgresql.org/download/windows/
# Create database
createdb lipa_mdogo_dev
# Or via psql:
psql -U postgres
CREATE DATABASE lipa_mdogo_dev;
```

Update `.env` with your PostgreSQL credentials:
```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=lipa_mdogo_dev
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 2. Install Dependencies

```bash
cd backend
composer install
```

### 3. Run Migrations

```bash
php artisan migrate
```

### 4. Seed Data (Watu Credit)

```bash
php artisan db:seed --class=WatuCreditSeeder
```

This creates:
- Company: Watu Credit
- Users: 1 admin, 1 ops staff, 2 sales agents

**Default credentials:**
- Admin: `admin@watucredit.co.ke` / `password`
- Agent 1: `agent1@watucredit.co.ke` / `password`

### 5. Start Development Server

```bash
php artisan serve
```

API will be available at `http://localhost:8000/api/v1`

## API Endpoints (Phase 1)

### Authentication
- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/logout` - Logout (requires token)
- `GET /api/v1/auth/me` - Get current user (requires token)

### Devices
- `GET /api/v1/devices` - List devices
- `POST /api/v1/devices` - Create device
- `GET /api/v1/devices/{id}` - Get device
- `PATCH /api/v1/devices/{id}` - Update device
- `DELETE /api/v1/devices/{id}` - Delete device

### Customers
- `GET /api/v1/customers` - List customers
- `POST /api/v1/customers` - Create customer
- `GET /api/v1/customers/{id}` - Get customer
- `PATCH /api/v1/customers/{id}` - Update customer
- `DELETE /api/v1/customers/{id}` - Delete customer

### Sales (Financing Agreements)
- `GET /api/v1/sales` - List sales
- `POST /api/v1/sales` - Create sale
- `GET /api/v1/sales/{id}` - Get sale
- `PATCH /api/v1/sales/{id}` - Update sale status
- `DELETE /api/v1/sales/{id}` - Delete sale

### Payments
- `GET /api/v1/payments?sale_id=X` - List payments (optionally filtered by sale)
- `POST /api/v1/payments` - Record payment
- `GET /api/v1/payments/{id}` - Get payment
- `DELETE /api/v1/payments/{id}` - Delete payment

### Leads
- `GET /api/v1/leads?stage=new` - List leads (optionally filtered by stage)
- `POST /api/v1/leads` - Create lead
- `GET /api/v1/leads/{id}` - Get lead
- `PATCH /api/v1/leads/{id}` - Update lead
- `DELETE /api/v1/leads/{id}` - Delete lead

## Authentication

All endpoints except login use **Bearer token authentication**:

```bash
# 1. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@watucredit.co.ke","password":"password"}'

# Response includes token:
# {"message":"Logged in successfully","user":{...},"token":"..."}

# 2. Use token in requests
curl -X GET http://localhost:8000/api/v1/devices \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Multi-Tenant Isolation

All endpoints are automatically scoped to the authenticated user's company (`company_id`). A Watu Credit admin/agent can only see Watu Credit data.

## Next Steps

1. Validate API endpoints work (postman or curl)
2. Scaffold Flutter client
3. Build agent mobile UI + sales workflow
4. Build admin dashboard UI
