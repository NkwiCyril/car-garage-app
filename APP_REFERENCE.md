# DriveEase — App Reference Document

> **Purpose:** This document is the single source of truth for all edits, features, and API integrations made to the DriveEase car garage app. Update this document whenever new endpoints are integrated, new pages are added, or architectural decisions change.

---

## 1. App Overview

| Field | Value |
|-------|-------|
| **App Name** | DriveEase |
| **Package ID** | io.ionic.starter |
| **Version** | 0.0.1 |
| **Framework** | Ionic 8 + Angular 20 (Standalone Components) |
| **Mobile Runtime** | Capacitor 8 (Android) |
| **API Base URL (Dev)** | `http://localhost:3000/api` |
| **API Base URL (Prod)** | `http://localhost:3000/api` *(TODO: update)* |

**What it is:** A mobile application for car parking management, car rentals, and car buy/sell listings. The app is targeted at users in Cameroon (phone numbers, location Yaoundé).

---

## 2. Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts           # Protects /tabs routes (requires login)
│   │   │   ├── guest.guard.ts          # Blocks logged-in users from auth/onboarding
│   │   │   ├── initial-redirect.guard.ts  # Smart root-path routing
│   │   │   └── onboarding.guard.ts     # Ensures onboarding flow (not used in main routes)
│   │   ├── models/
│   │   │   ├── user.model.ts           # User, LoginRequest, RegisterRequest, AuthResponse
│   │   │   ├── car.model.ts            # Car, RentalCar
│   │   │   └── parking.model.ts        # ParkingSpot, Booking
│   │   └── services/
│   │       ├── auth.service.ts         # Auth API calls + state (BehaviorSubjects)
│   │       ├── storage.service.ts      # localStorage wrapper
│   │       ├── parking.service.ts      # Parking API calls (stubs)
│   │       ├── rental.service.ts       # Rental API calls (stubs)
│   │       ├── buy-sell.service.ts     # Buy/Sell API calls (stubs)
│   │       └── payment.service.ts      # Payment API calls (stubs)
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── login/                  # Phone + password login
│   │   │   ├── register/               # Full registration form
│   │   │   ├── forgot-password/        # Stub
│   │   │   ├── verify-otp/             # Stub (4-digit OTP input)
│   │   │   └── reset-password/         # Stub
│   │   ├── onboarding/
│   │   │   ├── splash/                 # App intro screen
│   │   │   ├── step-one/               # Onboarding step 1
│   │   │   └── step-two/               # Onboarding step 2 (sets hasOnboarded)
│   │   ├── tabs/
│   │   │   ├── tabs.page.ts/html/scss  # Bottom tabs shell
│   │   │   └── tabs.routes.ts          # Tab child route definitions
│   │   ├── dashboard/                  # Home tab — main dashboard
│   │   ├── auto/                       # Auto tab — Garage/Rent/Buy/Sell segments
│   │   ├── bookings/                   # Bookings tab — booking history
│   │   └── profile/                    # Profile tab — user settings
│   ├── app.routes.ts                   # Root route definitions
│   ├── app.component.ts
│   └── app.component.html
├── environments/
│   ├── environment.ts                  # { production: false, apiUrl: 'http://localhost:3000/api' }
│   └── environment.prod.ts             # { production: true, apiUrl: '...' }
├── theme/
│   └── variables.scss                  # Design token CSS variables
├── global.scss                         # Global utility classes + Ionic overrides
└── assets/
    ├── font/                           # Plus Jakarta Sans (variable + italic)
    ├── icon/
    └── images/
```

---

## 3. Routing Map

### Root Routes (`app.routes.ts`)

| Path | Guard | Destination |
|------|-------|-------------|
| `` (empty) | `initialRedirectGuard` | Smart redirect (see below) |
| `home` | — | Redirects to `tabs/home` |
| `onboarding/splash` | `guestGuard` | SplashPage |
| `onboarding/step-one` | `guestGuard` | StepOnePage |
| `onboarding/step-two` | `guestGuard` | StepTwoPage |
| `auth/login` | `guestGuard` | LoginPage |
| `auth/register` | `guestGuard` | RegisterPage |
| `auth/forgot-password` | `guestGuard` | ForgotPasswordPage |
| `auth/verify-otp` | `guestGuard` | VerifyOtpPage |
| `auth/reset-password` | `guestGuard` | ResetPasswordPage |
| `tabs` | `authGuard` | TabsPage (shell) |

### Tab Routes (`tabs.routes.ts`)

| Path | Component | Tab |
|------|-----------|-----|
| `tabs/home` | DashboardPage | Home |
| `tabs/auto` | AutoPage | Auto |
| `tabs/bookings` | BookingsPage | Bookings |
| `tabs/profile` | ProfilePage | Profile |

### `initialRedirectGuard` Logic

```
Logged in?       → /tabs/home
Onboarded?       → /auth/login
Not onboarded?   → /onboarding/splash
```

---

## 4. Pages Reference

### Onboarding

| Page | File | Notes |
|------|------|-------|
| Splash | `pages/onboarding/splash/` | App branding intro |
| Step One | `pages/onboarding/step-one/` | Feature highlights |
| Step Two | `pages/onboarding/step-two/` | Calls `storageService.setOnboarded()` |

### Auth

| Page | File | Status | Notes |
|------|------|--------|-------|
| Login | `pages/auth/login/` | ✅ Implemented | Phone + password, toast feedback, loading state |
| Register | `pages/auth/register/` | ✅ Implemented | Validates all fields, password match/length, redirects to login |
| Forgot Password | `pages/auth/forgot-password/` | ⚠️ Stub | No API call yet |
| Verify OTP | `pages/auth/verify-otp/` | ⚠️ Stub | 4-digit input UI exists |
| Reset Password | `pages/auth/reset-password/` | ⚠️ Stub | No API call yet |

### Main App (Tabs)

| Page | File | Status | Notes |
|------|------|--------|-------|
| Dashboard | `pages/dashboard/` | ⚠️ Partial | Shows user name from auth state; services/parking cards use placeholder data |
| Auto | `pages/auto/` | ⚠️ Stub | Segments: Garage, Rent, Buy, Sell — all placeholder data |
| Bookings | `pages/bookings/` | ⚠️ Stub | Filter UI exists; all placeholder data |
| Profile | `pages/profile/` | ⚠️ Stub | Shows user name/phone; menu items not functional; logout works |

---

## 5. Services Reference

### `AuthService` — `core/services/auth.service.ts`

**State:**
- `isAuthenticated$: BehaviorSubject<boolean>`
- `currentUser$: BehaviorSubject<any>`

**Implemented Methods:**

| Method | Endpoint | Status |
|--------|----------|--------|
| `login(phone, password)` | `POST /users/login` | ✅ Done |
| `register(fullName, phone, password, repeatPassword)` | `POST /users/register` | ✅ Done |
| `logout()` | — (local only) | ✅ Done |
| `getToken()` | — (local only) | ✅ Done |
| `forgotPassword(phone)` | `POST /users/forgot-password` | ⚠️ Stub |
| `verifyOtp(phone, otp)` | `POST /users/verify-otp` | ⚠️ Stub |
| `resetPassword(phone, newPassword)` | `POST /users/reset-password` | ⚠️ Stub |
| `loginWithGoogle()` | — | ❌ Not planned yet |

---

### JWT Interceptor — `core/interceptors/auth.interceptor.ts` *(new)*

Functional interceptor registered in `main.ts` via `withInterceptors([authInterceptor])`. Attaches `Authorization: Bearer <token>` to every outgoing HTTP request when a token is present in localStorage.

---

### `StorageService` — `core/services/storage.service.ts`

localStorage wrapper. Keys in use:

| Key | Type | Set By |
|-----|------|--------|
| `authToken` | `string` (JWT) | `AuthService.login()` |
| `currentUser` | `{ id, name, phone }` | `AuthService.login()` |
| `hasOnboarded` | `boolean` | `StorageService.setOnboarded()` |

---

### `CarService` — `core/services/car.service.ts` *(new)*

| Method | Endpoint | Status |
|--------|----------|--------|
| `getAvailableCars()` | `GET /cars/available` | ✅ Done |
| `addCar(formData)` | `POST /cars` | ✅ Wired — needs Add Car screen |
| `parkCar(formData)` | `POST /cars/park` | ✅ Wired — needs Park Car screen |
| `collectCar(id)` | `POST /cars/collect/:id` | ✅ Wired — needs My Cars screen |
| `buyCar(id)` | `POST /cars/buy/:id` | ✅ Done |
| `sellCar(id, price)` | `POST /cars/sell/:id` | ✅ Wired — needs My Cars screen |
| `rentCar(id)` | `POST /cars/rent/:id` | ✅ Done |
| `listCarForRent(id, rentalPrice)` | `POST /cars/rent-list/:id` | ✅ Wired — needs My Cars screen |
| `updateCar(id, data)` | `PUT /cars/:id` | ✅ Wired — needs Car Detail screen |
| `deleteCar(id)` | `DELETE /cars/:id` | ✅ Wired — needs Car Detail screen |

---

### `ParkingService` — `core/services/parking.service.ts`

| Method | Endpoint | Status |
|--------|----------|--------|
| `getAvailableSpots()` | `GET /parking/spots` | ⚠️ Stub (returns `of([])`) |
| `bookSpot(spotId)` | `POST /parking/book` | ⚠️ Stub |
| `getBookingHistory()` | `GET /parking/bookings` | ⚠️ Stub |
| `getNearbyParking(lat, lng)` | `GET /parking/nearby` | ⚠️ Stub |

---

### `RentalService` — `core/services/rental.service.ts`

| Method | Endpoint | Status |
|--------|----------|--------|
| `getAvailableCars()` | `GET /rental/cars` | ⚠️ Stub (returns `of([])`) |
| `rentCar(carId)` | `POST /rental/book` | ⚠️ Stub |
| `getRentalHistory()` | `GET /rental/history` | ⚠️ Stub |

---

### `BuySellService` — `core/services/buy-sell.service.ts`

| Method | Endpoint | Status |
|--------|----------|--------|
| `getListings()` | `GET /listings` | ⚠️ Stub (returns `of([])`) |
| `getListingById(id)` | `GET /listings/:id` | ⚠️ Stub |
| `createListing(listing)` | `POST /listings` | ⚠️ Stub |

---

### `PaymentService` — `core/services/payment.service.ts`

| Method | Endpoint | Status |
|--------|----------|--------|
| `processPayment(amount, method)` | `POST /payments` | ⚠️ Stub (returns `of({})`) |
| `getPaymentHistory()` | `GET /payments/history` | ⚠️ Stub |
| `getPaymentMethods()` | `GET /payments/methods` | ⚠️ Stub |

---

## 6. Models Reference

### `user.model.ts`

```typescript
interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  createdAt?: string;
}

interface LoginRequest { phone: string; password: string; }
interface RegisterRequest { name: string; phone: string; password: string; }
interface OtpVerifyRequest { phone: string; otp: string; }
interface ResetPasswordRequest { phone: string; newPassword: string; repeatPassword: string; } // typo: "reapeat"
interface AuthResponse { success: boolean; token?: string; user?: User; message?: string; }
```

### `car.model.ts`

```typescript
interface Car {
  id: string; make: string; model: string; year: number; price: number;
  mileage?: string; condition?: 'new' | 'like-new' | 'used';
  color?: string; imageUrl?: string; description?: string; sellerId?: string;
}
interface RentalCar extends Car { rentalPrice: number; available: boolean; }
```

### `parking.model.ts`

```typescript
interface ParkingSpot {
  id: string; name: string; address: string; price: number; currency: string;
  available: boolean; imageUrl?: string; rating?: number; distance?: string;
}
interface Booking {
  id: string; spotId: string; userId: string;
  startTime: string; endTime: string; duration: string;
  totalPrice: number; status: 'active' | 'completed' | 'cancelled';
}
```

---

## 7. API Integration Status

### Implemented Endpoints

| # | Method | Endpoint | Service Method | Page Using It |
|---|--------|----------|----------------|---------------|
| 1 | POST | `/users/register` | `AuthService.register()` | RegisterPage |
| 2 | POST | `/users/login` | `AuthService.login()` | LoginPage |
| 3 | GET | `/cars/available` | `CarService.getAvailableCars()` | AutoPage (Rent + Buy tabs) |
| 4 | POST | `/cars/rent/:id` | `CarService.rentCar()` | AutoPage Rent tab |
| 5 | POST | `/cars/buy/:id` | `CarService.buyCar()` | AutoPage Buy tab |

### Wired but Need Screens

| # | Method | Endpoint | Service Method | Needs |
|---|--------|----------|----------------|-------|
| 6 | POST | `/cars` | `CarService.addCar()` | Add Car screen |
| 7 | POST | `/cars/park` | `CarService.parkCar()` | Park Car screen |
| 8 | POST | `/cars/collect/:id` | `CarService.collectCar()` | My Cars screen |
| 9 | POST | `/cars/sell/:id` | `CarService.sellCar()` | My Cars screen |
| 10 | POST | `/cars/rent-list/:id` | `CarService.listCarForRent()` | My Cars screen |
| 11 | PUT | `/cars/:id` | `CarService.updateCar()` | Car Detail/Edit screen |
| 12 | DELETE | `/cars/:id` | `CarService.deleteCar()` | Car Detail/Edit screen |

> **Backend gap:** `GET /cars/my` (or similar) is needed to list the current user's own cars in the Garage tab and My Cars screen.

### Pending Endpoints (Stubs)

| # | Method | Endpoint | Service Method | Priority |
|---|--------|----------|----------------|----------|
| 13 | POST | `/users/forgot-password` | `AuthService.forgotPassword()` | High |
| 14 | POST | `/users/verify-otp` | `AuthService.verifyOtp()` | High |
| 15 | POST | `/users/reset-password` | `AuthService.resetPassword()` | High |

---

## 8. Authentication Architecture

### Flow

```
Register → POST /users/register → Redirect to Login
Login    → POST /users/login   → Store JWT + User → Navigate to /tabs/home
Logout   → Clear localStorage  → Navigate to /auth/login
```

### JWT Storage

- Token stored in `localStorage` key `authToken`
- User stored in `localStorage` key `currentUser`
- Restored to BehaviorSubjects on app startup in `AuthService` constructor

### HTTP Interceptor

**Status: NOT YET IMPLEMENTED**

A JWT interceptor is needed to attach `Authorization: Bearer <token>` to all protected API requests. This is a prerequisite before implementing any service that requires authentication (parking, rental, buy/sell, payments).

Pattern to implement in `src/app/core/interceptors/auth.interceptor.ts`:
```typescript
// Attach to provideHttpClient() in main.ts:
// withInterceptors([authInterceptor])
```

---

## 9. Design System

### CSS Variable Prefix: `--de-`

| Token | Value |
|-------|-------|
| `--de-primary` | `#1a73e8` (blue) |
| `--de-accent` | `#0a1628` (dark navy) |
| `--de-white` | `#ffffff` |
| `--de-off-white` | `#f5f7fa` |
| `--de-gray-light` | `#e8ecf1` |
| `--de-gray` | `#8c8c8c` |
| `--de-text-primary` | `#0a1628` |
| `--de-success` | `#2ecc71` |
| `--de-warning` | `#f39c12` |
| `--de-danger` | `#e74c3c` |
| `--de-radius-sm/md/lg/xl` | `8px / 12px / 16px / 24px` |
| `--de-spacing-xs/sm/md/lg/xl/2xl` | `4/8/16/24/32/48px` |
| `--de-font-family` | `'Plus Jakarta Sans', system fallbacks` |
| `--de-shadow-sm/md/lg` | `0 2px 8px / 4px 16px / 8px 32px rgba(10,22,40,...)` |

### Global CSS Classes (`global.scss`)

| Class | Purpose |
|-------|---------|
| `.de-btn-primary` | Primary solid button |
| `.de-btn-outline` | Outlined button |
| `.de-btn-dark` | Dark/accent button |
| `.de-input` | Form input styling |
| `.de-card` | Card container |
| `.de-link` | Inline text link |
| `.de-text-muted` | Muted text color |
| `.de-text-accent` | Accent text color |
| `.de-social-btn` | Google/Apple login buttons |
| `.safe-area-top/bottom` | Safe area padding for mobile |

---

## 10. Architecture Patterns

| Pattern | Detail |
|---------|--------|
| **Component style** | Standalone (Angular 14+), all use `standalone: true` |
| **Lazy loading** | All routes use `loadComponent()` |
| **State management** | RxJS BehaviorSubjects in services (no NgRx) |
| **Icons** | Ionicons v7 — registered with `addIcons()` per component |
| **HTTP** | `HttpClient` via `provideHttpClient()` in `main.ts` |
| **Feedback** | `ToastController` for success/error, `AlertController` for confirmations |
| **Forms** | Template-driven (FormsModule + `[(ngModel)]`) |
| **Persistence** | localStorage via `StorageService` wrapper |

---

## 11. Known Issues & TODOs

| Issue | File | Priority |
|-------|------|----------|
| `forgotPassword`, `verifyOtp`, `resetPassword` throw errors | `auth.service.ts` | 🔴 High |
| Need **Add Car** screen | new page | 🔴 High |
| Need **Park Car** screen | new page | 🔴 High |
| Need **My Cars** screen + backend `GET /cars/my` endpoint | new page + backend | 🔴 High |
| Typo `repeatPassword` in `ResetPasswordRequest` | `user.model.ts` | 🟡 Medium |
| Dashboard, Bookings use hardcoded placeholder data | `dashboard.page.ts`, `bookings.page.ts` | 🔴 High |
| Profile menu items have no routes/actions | `profile/profile.page.ts` | 🟡 Medium |
| Production `apiUrl` not set | `environment.prod.ts` | 🟡 Medium |
| Social login (Google/Apple) throws errors | `auth.service.ts` | 🟢 Low |
| No token refresh mechanism | `auth.service.ts` | 🟡 Medium |

---

## 12. Change Log

| Date | Change | Files |
|------|--------|-------|
| Initial | Auth endpoints (register + login) integrated | `auth.service.ts`, `login.page.ts`, `register.page.ts`, `main.ts`, environments |
| Initial | Route guards (auth, guest, initial-redirect) | `core/guards/` |
| Initial | Tabs setup with dashboard, auto, bookings, profile pages | `pages/tabs/`, `pages/dashboard/`, `pages/auto/`, `pages/bookings/`, `pages/profile/` |
| Initial | Color theme and app rename to DriveEase | `theme/variables.scss`, `global.scss` |
| 2026-04-01 | JWT auth interceptor — attaches Bearer token to all requests | `core/interceptors/auth.interceptor.ts`, `main.ts` |
| 2026-04-01 | Unified CarService for all `/api/cars` endpoints | `core/services/car.service.ts` |
| 2026-04-01 | car.model.ts updated — `_id`, `listingType`, `images`, `transmission`, `rentalPrice`, new request/response interfaces | `core/models/car.model.ts` |
| 2026-04-01 | AutoPage wired to real API — Rent & Buy tabs load from `GET /cars/available`; Rent/Buy buttons call API with confirmation + toast | `pages/auto/auto.page.ts`, `.html`, `.scss` |

---

*Last updated: 2026-04-01*
