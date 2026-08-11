# Flutter Client - Setup & Development

## Project Structure

```
client/
├── pubspec.yaml              Main project file
├── packages/
│   └── core/                 Shared package (API client, models, repos)
│       ├── lib/
│       │   ├── src/
│       │   │   ├── models/   Data models (User, Device, Sale, etc)
│       │   │   ├── services/ API client with Dio
│       │   │   └── repositories/ Data access layer
│       │   └── core.dart     Package exports
│       └── pubspec.yaml
├── apps/
│   ├── admin/                Admin dashboard flavor
│   │   └── pubspec.yaml
│   └── agent/                Sales agent app flavor
│       └── pubspec.yaml
└── README.md
```

## Prerequisites

1. **Flutter SDK** (3.24.0+) — [Install](https://flutter.dev/docs/get-started/install)
2. **Dart** (comes with Flutter)
3. **Android Studio** or **Xcode** (for mobile development)
4. **PostgreSQL** running with backend API

## Installation

### 1. Install Flutter

```bash
# Download Flutter SDK
# https://flutter.dev/docs/get-started/install

# Verify installation
flutter doctor
```

### 2. Get Dependencies

```bash
cd client

# Install main project deps
flutter pub get

# Install core package deps
cd packages/core
flutter pub get
cd ../../

# Install admin app deps
cd apps/admin
flutter pub get
cd ../../

# Install agent app deps
cd apps/agent
flutter pub get
cd ../../
```

### 3. Configure Backend URL

Create `.env` in `client/` (or in each app):

```
API_BASE_URL=http://localhost:8000/api/v1
```

Update `api_client.dart` if using a different URL.

## Running Apps

### Admin Dashboard

```bash
cd apps/admin
flutter run
```

Or specify device:
```bash
flutter run -d chrome  # Web
flutter run -d emulator-5554  # Android emulator
```

### Sales Agent App

```bash
cd apps/agent
flutter run
```

## Development Workflow

1. **Edit core package** (models, repositories, API client)
   - Changes auto-sync to both admin & agent apps
   - No build step needed

2. **Edit admin app** (dashboard UI, admin flows)
   - `cd apps/admin && flutter pub get` (after core changes)

3. **Edit agent app** (mobile UI, sales workflows)
   - `cd apps/agent && flutter pub get` (after core changes)

## Building for Production

### Admin Dashboard (Web)

```bash
cd apps/admin
flutter build web --release
# Output: build/web/
```

### Agent App (Android)

```bash
cd apps/agent
flutter build apk --release
# Output: build/app/outputs/apk/release/app-release.apk
```

### Agent App (iOS)

```bash
cd apps/agent
flutter build ios --release
# Output: build/ios/
```

## Code Generation

Models use `freezed` and `json_serializable` for automatic generation.

After editing models in `packages/core/lib/src/models/models.dart`:

```bash
cd packages/core
dart run build_runner build --delete-conflicting-outputs
```

## Testing Login

### 1. Start backend

```bash
cd backend
php artisan serve
```

### 2. Run Flutter app

```bash
cd apps/agent
flutter run
```

### 3. Login with Watu Credit credentials

- **Email:** `agent1@watucredit.co.ke`
- **Password:** `password`

## Troubleshooting

### "core package not found"

```bash
flutter pub get
flutter packages get
```

### Model/Repository changes not appearing

Regenerate code:
```bash
cd packages/core
dart run build_runner build --delete-conflicting-outputs
```

### Network errors in app

Check:
1. Backend is running (`php artisan serve`)
2. `api_client.dart` baseUrl matches backend URL
3. Device can reach localhost (emulator may need `10.0.2.2` instead)

### Device doesn't show in `flutter devices`

```bash
flutter devices
# If empty, try:
flutter emulator --launch emulator_id
```

## Next Steps

1. Scaffold login screen (auth flow)
2. Build admin dashboard (device list, sales overview)
3. Build agent app (device list, customer registration, payment entry)
4. End-to-end testing with backend
5. Phase 2 features (alerts, overdue detection)

## Key Libraries

- **riverpod** — State management (providers)
- **get** — Navigation & dependency injection
- **dio** — HTTP client (with auth interceptor)
- **freezed** — Immutable models with JSON serialization
- **shared_preferences** — Local auth token storage
