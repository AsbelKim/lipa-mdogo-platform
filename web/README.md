# Lipa Mdogo — Web Platform

**Multi-platform web applications for Watu Credit** — Admin dashboard & sales agent app.

## 🏗️ Structure

```
web/
├── packages/
│   └── core/          Shared API client, models, types, hooks
├── apps/
│   ├── admin/        Admin dashboard (desktop-first)
│   └── agent/        Sales agent app (mobile-optimized)
├── tsconfig.base.json
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
cd web

# Install dependencies (with npm workspaces)
npm install

# Or with pnpm (recommended)
pnpm install
```

### Development

**Start both apps in development mode:**
```bash
npm run dev
# or
pnpm dev
```

**Run individually:**

```bash
# Admin dashboard (http://localhost:3000)
cd apps/admin
npm run dev

# Sales agent app (http://localhost:3001)
cd apps/agent
npm run dev
```

### Environment Setup

Copy example env files:

```bash
# Admin
cp apps/admin/.env.local.example apps/admin/.env.local

# Agent
cp apps/agent/.env.local.example apps/agent/.env.local
```

Update `.env.local` with your backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 📱 Admin Dashboard

**Location:** `apps/admin/`

### Features
- ✅ Login/Auth (Sanctum token)
- 📊 Dashboard overview (stats, quick actions)
- 📱 Device inventory management
- 👥 Customer list & management
- 💰 Sales & financing tracking
- 💳 Payment verification & logging
- 📈 Analytics & reports

### Build for Production
```bash
cd apps/admin
npm run build
npm run start
```

## 🤖 Agent App

**Location:** `apps/agent/`

### Features
- ✅ Login/Auth (Sanctum token)
- 📱 Assigned devices view
- 🎯 Lead pipeline management
- 💼 Customer registration
- 📋 Sales creation
- 💳 Payment entry
- 📊 Commission tracking

### Build for Production
```bash
cd apps/agent
npm run build
npm run start
```

## 📦 Shared Core Package

**Location:** `packages/core/`

### Exports
- **`@lipa/core`** — All exports
- **`@lipa/core/api`** — API clients (devices, customers, sales, payments, leads)
- **`@lipa/core/types`** — TypeScript types (User, Device, Customer, Sale, Payment, Lead, etc.)
- **`@lipa/core/hooks`** — React hooks (useAuth, useQuery, useMutation)
- **`@lipa/core/utils`** — Utilities (formatting, validation, cn)

### Using Core Package

```typescript
import { 
  useAuth, 
  useQuery, 
  deviceApi, 
  formatCurrency 
} from '@lipa/core';

// In your component
const { user, login, logout } = useAuth();
const { data, loading } = useQuery(() => deviceApi.list());
```

## 🔑 Test Credentials

**Admin:**
- Email: `admin@watucredit.co.ke`
- Password: `password`

**Agent:**
- Email: `agent1@watucredit.co.ke`
- Password: `password`

Backend must be running: `php artisan serve` from `backend/`

## 🛠️ Development

### Edit Core Package

```bash
cd packages/core
# Edit src/api, src/types, src/hooks, etc.
# Changes auto-sync to both apps via workspaces
```

### Type Safety

All code is TypeScript. Generate types from backend if needed:

```bash
# Future: API type generation from OpenAPI/Swagger
```

### Styling

- **Framework:** TailwindCSS
- **Config:** `apps/admin/tailwind.config.ts`, `apps/agent/tailwind.config.ts`
- **Colors:** `primary: #10b981` (Emerald), `secondary: #f59e0b` (Amber)

## 📊 API Integration

Both apps connect to the **Laravel REST API** at `http://localhost:8000/api/v1`.

### Auth Flow
1. User submits email/password to `/auth/login`
2. Backend returns token + user data
3. Token stored in `localStorage`
4. Attached to all requests via Axios interceptor

### API Endpoints Used

```
POST   /auth/login              - Login
POST   /auth/logout             - Logout
GET    /auth/me                 - Current user

GET    /devices                 - List devices
POST   /devices                 - Create device
PUT    /devices/:id             - Update device
POST   /devices/:id/assign      - Assign to agent

GET    /customers               - List customers
POST   /customers               - Create customer

GET    /sales                   - List sales
POST   /sales                   - Create sale
GET    /sales/:id/payments      - Sale payments

POST   /payments                - Create payment
POST   /payments/:id/verify     - Verify payment

GET    /leads                   - List leads
POST   /leads                   - Create lead
```

See backend `SETUP.md` for full API docs.

## 🔐 Security

- ✅ Sanctum token-based auth (no cookies)
- ✅ Token stored in localStorage
- ✅ HTTPS ready (via Next.js)
- ⚠️ **TODO:** Implement refresh token rotation
- ⚠️ **TODO:** Add request signing for sensitive operations

## 📝 Build & Deploy

### Docker (Optional)

```dockerfile
# Example: apps/admin/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Vercel/Railway Deploy

Both apps are Next.js and ready for serverless deployment:

```bash
vercel deploy apps/admin
vercel deploy apps/agent
```

## 🐛 Troubleshooting

**"Cannot find module '@lipa/core'"**
- Run `npm install` from web root
- Ensure `packages/core/` exists with src/index.ts

**API requests failing with 401**
- Check backend is running: `php artisan serve`
- Verify token in localStorage: `localStorage.getItem('auth_token')`
- Clear localStorage and re-login if corrupted

**Tailwind styles not appearing**
- Ensure `content` in `tailwind.config.ts` includes all template paths
- Run `npm run build` to verify

## 📚 Next Steps

1. **Complete API integration** — Test all endpoints
2. **Build device management flows** — Assignment, tracking
3. **Build sales/payment workflows** — Forms, validation
4. **Add state management** — Zustand stores if needed
5. **Add error boundaries** — Graceful error handling
6. **Add analytics** — Page views, user actions
7. **Mobile polish** — Responsive design, touch interactions
8. **Performance** — Bundle optimization, lazy loading

## 📄 License

Internal use only — Watu Credit.
