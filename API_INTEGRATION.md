# API Integration Documentation - DriveEase

## Overview
This document describes the API integrations implemented for the DriveEase mobile application.

---

## Backend API Details

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: Update in `src/environments/environment.prod.ts`

---

## Authentication

### JWT Interceptor
All protected API calls automatically attach the JWT token via an HTTP interceptor:
- **File**: `src/app/core/interceptors/auth.interceptor.ts`
- **Registered in**: `src/main.ts` via `withInterceptors([authInterceptor])`
- **Header added**: `Authorization: Bearer <token>`

The interceptor fires on every outgoing HTTP request. If no token is stored it passes the request through unchanged (used for login/register calls).

---

## Implemented Endpoints

### 1. User Registration
- **Endpoint**: `POST /api/users/register`
- **Auth required**: No
- **Request Body**:
```json
{
  "name": "string (required)",
  "phone": "string (required, 9-15 digits)",
  "password": "string (required, min 6 characters)",
  "repeatPassword": "string (required)"
}
```
- **Success Response** (201):
```json
{ "success": true, "data": { "id": "...", "name": "...", "phone": "..." } }
```
- **Implemented In**: `AuthService.register()` → `RegisterPage`

---

### 2. User Login
- **Endpoint**: `POST /api/users/login`
- **Auth required**: No
- **Request Body**:
```json
{ "phone": "string", "password": "string" }
```
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token",
  "user": { "id": "...", "name": "...", "phone": "..." }
}
```
- **Implemented In**: `AuthService.login()` → `LoginPage`

---

### 3. Get Available Cars
- **Endpoint**: `GET /api/cars/available`
- **Auth required**: Yes (JWT)
- **Description**: Returns all cars currently listed for sale or rent
- **Success Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "make": "Toyota", "model": "Corolla", "year": 2022,
      "price": 18000000,
      "rentalPrice": 25000,
      "listingType": "sale | rent",
      "condition": "new | like-new | used",
      "transmission": "automatic | manual",
      "mileage": "45000",
      "location": "Yaoundé",
      "images": ["url1", "url2"]
    }
  ]
}
```
- **Implemented In**: `CarService.getAvailableCars()` → `AutoPage` (Rent & Buy tabs)
- **Filtering**: Client-side — `listingType === 'rent'` → Rent tab, `listingType === 'sale'` → Buy tab

---

### 4. Rent a Car
- **Endpoint**: `POST /api/cars/rent/:id`
- **Auth required**: Yes (JWT)
- **Request Body**: `{}` (empty)
- **Success Response** (200):
```json
{ "success": true, "message": "Car rented successfully", "data": { ... } }
```
- **Implemented In**: `CarService.rentCar(id)` → `AutoPage` Rent tab (Rent button + confirmation alert)

---

### 5. Buy a Car
- **Endpoint**: `POST /api/cars/buy/:id`
- **Auth required**: Yes (JWT)
- **Request Body**: `{}` (empty)
- **Success Response** (200):
```json
{ "success": true, "message": "Car purchased successfully", "data": { ... } }
```
- **Implemented In**: `CarService.buyCar(id)` → `AutoPage` Buy tab (Buy button + confirmation alert)

---

### 6. Add a New Car
- **Endpoint**: `POST /api/cars`
- **Auth required**: Yes (JWT)
- **Request Body**: `FormData` with car details + image files
- **Status**: `CarService.addCar(formData)` wired — **screen needed** (see below)

---

### 7. Park Car in Garage
- **Endpoint**: `POST /api/cars/park`
- **Auth required**: Yes (JWT)
- **Request Body**: `FormData` with car details + image files
- **Status**: `CarService.parkCar(formData)` wired — **screen needed** (see below)

---

### 8. Collect Car from Garage
- **Endpoint**: `POST /api/cars/collect/:id`
- **Auth required**: Yes (JWT)
- **Request Body**: `{}` (empty)
- **Status**: `CarService.collectCar(id)` wired — **screen needed** (see below)

---

### 9. List Car for Sale
- **Endpoint**: `POST /api/cars/sell/:id`
- **Auth required**: Yes (JWT)
- **Request Body**: `{ "price": number }`
- **Status**: `CarService.sellCar(id, price)` wired — **screen needed** (see below)

---

### 10. List Car for Rent
- **Endpoint**: `POST /api/cars/rent-list/:id`
- **Auth required**: Yes (JWT)
- **Request Body**: `{ "rentalPrice": number }`
- **Status**: `CarService.listCarForRent(id, rentalPrice)` wired — **screen needed** (see below)

---

### 11. Update a Car
- **Endpoint**: `PUT /api/cars/:id`
- **Auth required**: Yes (JWT)
- **Request Body**: Partial car fields to update
- **Status**: `CarService.updateCar(id, data)` wired — **screen needed** (see below)

---

### 12. Delete a Car
- **Endpoint**: `DELETE /api/cars/:id`
- **Auth required**: Yes (JWT)
- **Status**: `CarService.deleteCar(id)` wired — **screen needed** (see below)

---

## Stub Endpoints (Not Yet Implemented)

| Endpoint | Service Method | Notes |
|----------|----------------|-------|
| `POST /api/users/forgot-password` | `AuthService.forgotPassword()` | Throws error stub |
| `POST /api/users/verify-otp` | `AuthService.verifyOtp()` | Throws error stub |
| `POST /api/users/reset-password` | `AuthService.resetPassword()` | Throws error stub |

---

## Screens Needed to Complete Car Integration

The following screens do not yet exist and are required to fully expose the remaining car endpoints:

| Screen | Endpoint(s) | Description |
|--------|-------------|-------------|
| **Add Car** | `POST /api/cars` | Form with make, model, year, price, condition, transmission, description + image upload. Accessible from the Sell tab "Add a New Car" button. |
| **Park Car** | `POST /api/cars/park` | Form to park/store a car in the garage with images. Accessible from the Garage tab "Park a Car" button. |
| **My Cars / Car Detail** | `PUT /api/cars/:id`, `DELETE /api/cars/:id`, `POST /api/cars/sell/:id`, `POST /api/cars/rent-list/:id`, `POST /api/cars/collect/:id` | A screen listing the authenticated user's own cars where they can edit, delete, list for sale/rent, or collect from garage. **Requires a GET endpoint for user's own cars** (e.g. `GET /api/cars/my` — not yet in the API). |

> **Note:** The `GET /api/cars/available` endpoint only returns cars listed by other users. A `GET /api/cars/my` (or similar) endpoint is needed to display the current user's own cars in the Garage tab and to allow them to select a car to sell/rent-list.

---

## Frontend Files Modified / Created

| File | Change |
|------|--------|
| `src/main.ts` | Switched from `withInterceptorsFromDi()` to `withInterceptors([authInterceptor])` |
| `src/app/core/interceptors/auth.interceptor.ts` | **New** — functional JWT interceptor |
| `src/app/core/models/car.model.ts` | Updated with `_id`, `listingType`, `images`, `transmission`, `location`, `rentalPrice`; added `CreateCarRequest`, `SellCarRequest`, `RentListRequest`, `CarApiResponse` |
| `src/app/core/services/car.service.ts` | **New** — unified service for all `/api/cars` endpoints |
| `src/app/pages/auto/auto.page.ts` | Replaced all placeholder data with `CarService`; added loading states, `rentCars`/`buyCars` arrays, confirmation alerts, toast feedback |
| `src/app/pages/auto/auto.page.html` | Real data bindings; loading spinners; empty states; real car image support; Garage tab CTA; Sell tab now has Add + List buttons |
| `src/app/pages/auto/auto.page.scss` | Added `.loading-state`, `.empty-state`, `.action-btn`, `.car-img`, `.sell-cta-outline` |

---

## Authentication Flow (recap)

### Registration
1. Fill name, phone, password, confirm password
2. Client-side validation
3. `POST /api/users/register`
4. Success → redirect to login

### Login
1. Fill phone, password
2. `POST /api/users/login`
3. Store JWT (`authToken`) + user (`currentUser`) in localStorage
4. Update `AuthService` state → navigate to `/tabs/home`

### Protected Requests
- Interceptor reads `authToken` from localStorage
- Attaches `Authorization: Bearer <token>` to every request automatically

### Logout
- Clear `authToken` + `currentUser` from localStorage
- Reset `AuthService` BehaviorSubjects → navigate to `/auth/login`

---

## Data Storage

| Key | Type | Set By |
|-----|------|--------|
| `authToken` | `string` (JWT) | `AuthService.login()` |
| `currentUser` | `{ id, name, phone }` | `AuthService.login()` |
| `hasOnboarded` | `boolean` | `StorageService.setOnboarded()` |

---

## Testing

### Prerequisites
1. Backend running at `http://localhost:3000`
2. MongoDB connected
3. Frontend dev server at `http://localhost:4200`

### Test Available Cars
1. Login with valid credentials
2. Navigate to Auto tab → Rent or Buy segments
3. If the backend has cars with `listingType: 'rent'` or `listingType: 'sale'` they will appear
4. Empty state shows if none are available

### Test Rent a Car
1. Ensure at least one car with `listingType: 'rent'` exists in the backend
2. Navigate to Auto → Rent tab
3. Tap the "Rent" button on a car
4. Confirm in the alert dialog
5. Expected: success toast with backend message

### Test Buy a Car
1. Ensure at least one car with `listingType: 'sale'` exists in the backend
2. Navigate to Auto → Buy tab
3. Tap the "Buy" button on a car
4. Confirm in the alert dialog
5. Expected: success toast with backend message

### Test JWT Interceptor
1. Login and observe `authToken` in localStorage
2. Open DevTools Network tab
3. Any API request to `/api/cars/*` should have `Authorization: Bearer <token>` header

---

## Security Notes
1. Token stored in localStorage — consider httpOnly cookies for production
2. HTTPS required in production
3. Token refresh not implemented

## Next Steps
1. Implement `GET /api/users/forgot-password`, `verify-otp`, `reset-password` flows
2. Build Add Car screen (`POST /api/cars`)
3. Build Park Car screen (`POST /api/cars/park`)
4. Build My Cars / Car Detail screen (needs `GET /api/cars/my` from backend)
5. Wire up Edit (`PUT`), Delete (`DELETE`), Sell listing, Rent listing from Car Detail screen
