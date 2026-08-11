# Lipa Mdogo — Flutter Client

**Multi-platform mobile & desktop client** for Watu Credit sales agents and admins.

## Structure

```
client/
├── packages/core/        Shared API client, models, repositories
├── apps/admin/          Admin dashboard (desktop-first)
├── apps/agent/          Sales agent app (mobile-first)
└── SETUP.md             Detailed setup guide
```

## Quick Start

### 1. Install Flutter

```bash
# https://flutter.dev/docs/get-started/install
flutter doctor
```

### 2. Get Dependencies

```bash
cd client
flutter pub get
cd packages/core && flutter pub get && cd ../../
cd apps/admin && flutter pub get && cd ../../
cd apps/agent && flutter pub get && cd ../../
```

### 3. Run Agent App

```bash
cd apps/agent
flutter run
# Or: flutter run -d chrome (web) / -d emulator (Android)
```

### 4. Run Admin App

```bash
cd apps/admin
flutter run -d chrome  # Admin is desktop-first
```

## Features (Phase 1)

### Agent App
- ✅ Login / Auth
- ⬜ Device assignment view
- ⬜ Customer registration
- ⬜ Sale creation (financing agreement)
- ⬜ Payment entry
- ⬜ Lead pipeline (pre-sale)
- ⬜ Commission tracking

### Admin Dashboard
- ✅ Login / Auth
- ⬜ Device inventory overview
- ⬜ Sales & payment tracking
- ⬜ Customer list
- ⬜ Agent performance metrics
- ⬜ Reports & analytics

## Architecture

**Core Package** (`packages/core/`)
- Models (Freezed + JSON serialization)
- API Client (Dio + auth interceptor)
- Repositories (data layer)
- Exported for both admin & agent apps

**Admin App** (`apps/admin/`)
- Desktop UI (Adaptive Scaffold)
- Dashboard, inventory, analytics
- Web build target

**Agent App** (`apps/agent/`)
- Mobile UI (Material 3)
- Bottom nav, sales workflows
- Android/iOS build targets

## Development

### Edit Core Package
Changes to models/repos auto-sync to both apps:
```bash
cd packages/core
# Edit lib/src/models/models.dart
dart run build_runner build --delete-conflicting-outputs
cd ../../
```

Then run your app — Flutter Hot Reload picks up changes.

### Build for Production

**Admin (Web):**
```bash
cd apps/admin
flutter build web --release
```

**Agent (Android APK):**
```bash
cd apps/agent
flutter build apk --release
```

**Agent (iOS):**
```bash
cd apps/agent
flutter build ios --release
```

## Testing

Use demo Watu Credit credentials:
- **Email:** `agent1@watucredit.co.ke`
- **Password:** `password`

Backend must be running (`php artisan serve` in backend/).

## Dependencies

- **riverpod** — State management (providers, async)
- **dio** — HTTP client with interceptors
- **freezed** — Immutable models + JSON serialization
- **shared_preferences** — Local storage (auth token)
- **get** — Navigation + dependency injection
- **flutter_adaptive_scaffold** — Responsive layouts (admin)

## Next Steps

1. Implement login flow end-to-end (with backend)
2. Build device list & management screens
3. Build sales/customer entry workflows
4. Payment tracking & history
5. Phase 2: Alerts, KPI dashboards, device tracking
