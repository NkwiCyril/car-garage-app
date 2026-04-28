# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DriveEase — an Ionic 8 / Angular 20 mobile app (Capacitor for Android) for car management: buy, sell, rent, park. Backend API runs at `localhost:3000/api`.

## Commands

```bash
ng serve              # Dev server (localhost:8100)
ng build              # Production build → www/
ng test               # Run Karma/Jasmine tests
ng lint               # ESLint
npx cap sync android  # Sync web build to Android project
```

## Architecture

- **Standalone components** throughout (no NgModules). Bootstrap in `src/main.ts` with `provideRouter`, `provideHttpClient`, `provideIonicAngular`.
- **Route guards** control navigation flow: `authGuard` (requires login), `guestGuard` (blocks logged-in users from auth pages), `initialRedirectGuard` (smart `/` redirect based on auth + onboarding state).
- **JWT auth** via `authInterceptor` — automatically attaches `Bearer` token to all HTTP requests.
- **State** held in `AuthService` via `BehaviorSubject` (`isAuthenticated$`, `currentUser$`). No NgRx or other state management.
- **Storage** uses `localStorage` (wrapped in `StorageService`).

### Directory Layout

```
src/app/
  core/
    guards/          # authGuard, guestGuard, initialRedirectGuard, onboardingGuard
    interceptors/    # authInterceptor (JWT)
    models/          # user.model.ts, car.model.ts, parking.model.ts
    services/        # auth, car, storage, parking*, rental*, buy-sell*, payment*
  pages/
    auth/            # login, register, forgot-password, verify-otp, reset-password
    onboarding/      # splash, step-one, step-two
    tabs/            # Main shell with bottom tab bar + child routes
    dashboard/       # Home tab
    auto/            # Auto tab (Garage/Rent/Buy/Sell segments)
    bookings/        # Bookings tab
    profile/         # Profile tab
    cars/            # add-car, car-detail, my-cars, park-car
```

*Services marked with `*` are stubs awaiting backend endpoints.

### Routing

Root routes in `src/app/app.routes.ts`. Tab child routes in `src/app/pages/tabs/tabs.routes.ts`.

Tabs: `/tabs/home` (Dashboard), `/tabs/auto` (Auto), `/tabs/bookings`, `/tabs/profile`.

Standalone routes: `/cars/add`, `/cars/my`, `/cars/park`, `/cars/detail`.

### API Integration

`CarService` is fully wired to the backend. `AuthService` has login/register working; Google login, OTP, and password reset are stubs. `ParkingService`, `RentalService`, `BuySellService`, `PaymentService` are all stubs.

Environment config: `src/environments/environment.ts` (`apiUrl`, `mediaUrl`).

## Conventions

- **Components** suffixed with `Page` (e.g., `LoginPage`), selector prefix `app-`.
- **File naming**: kebab-case — `login.page.ts`, `auth.service.ts`, `auth.guard.ts`.
- **CSS variables** use `--de-` prefix (DriveEase). Utility classes use `.de-` prefix.
- **Design tokens** defined in `src/theme/variables.scss`. Global utilities in `src/global.scss`.
- **Font**: Plus Jakarta Sans (loaded locally from `assets/font/`).
- Ionic color overrides set primary to `#1a73e8`, secondary to `#0a1628`.
- Guards and interceptors are exported as functional constants (`CanActivateFn`, `HttpInterceptorFn`).
- Car images uploaded via `FormData` (up to 5 images). Media URLs constructed via `environment.mediaUrl`.
