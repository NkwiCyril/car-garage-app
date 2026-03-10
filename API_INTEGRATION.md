# API Integration Documentation - DriveEase

## Overview
This document describes the API integration implemented for the authentication screens (Login and Registration) in the DriveEase mobile application.

## Backend API Details

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: Update in `src/environments/environment.prod.ts`

### Available Endpoints

#### 1. User Registration
- **Endpoint**: `POST /api/users/register`
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
{
  "success": true,
  "data": {
    "id": "user_id",
    "name": "user_name",
    "phone": "user_phone"
  }
}
```
- **Error Response** (400):
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...]
}
```

#### 2. User Login
- **Endpoint**: `POST /api/users/login`
- **Request Body**:
```json
{
  "phone": "string (required)",
  "password": "string (required)"
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "user_name",
    "phone": "user_phone"
  }
}
```
- **Error Response** (400):
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Frontend Implementation

### Files Modified

1. **Environment Configuration**
   - `src/environments/environment.ts` - Added `apiUrl: 'http://localhost:3000/api'`
   - `src/environments/environment.prod.ts` - Added production API URL placeholder

2. **Main Application Bootstrap**
   - `src/main.ts` - Added `provideHttpClient()` to enable HTTP requests

3. **Auth Service**
   - `src/app/core/services/auth.service.ts`
   - Implemented real HTTP calls for `login()` and `register()`
   - Added token and user storage in localStorage
   - Implemented error handling with proper error messages
   - Added authentication state management with BehaviorSubjects

4. **Login Page**
   - `src/app/pages/auth/login/login.page.ts`
   - Integrated AuthService
   - Added loading state and spinner
   - Implemented toast notifications for success/error feedback
   - Added form validation

5. **Register Page**
   - `src/app/pages/auth/register/register.page.ts`
   - Integrated AuthService
   - Added client-side validation (password match, length, required fields)
   - Added loading state and spinner
   - Implemented toast notifications
   - **Redirects to login page after successful registration** (no auto-login)

6. **Home Page**
   - `src/app/pages/home/home.page.ts` and `home.page.html`
   - Added logout button in header
   - Displays logged-in user's name
   - Calls AuthService.logout() and redirects to login

7. **Route Guards**
   - `src/app/core/guards/guest.guard.ts` - Prevents logged-in users from accessing auth/onboarding screens
   - `src/app/core/guards/auth.guard.ts` - Protects home route, requires authentication
   - `src/app/core/guards/initial-redirect.guard.ts` - Smart routing on app launch based on auth status

### Authentication Flow

#### Registration Flow
1. User fills in: Full Name, Phone Number, Password, Confirm Password
2. Client-side validation:
   - All fields required
   - Password minimum 6 characters
   - Passwords must match
3. API call to `/api/users/register`
4. On success: Show success toast → Navigate to `/auth/login`
5. On error: Show error toast with server message

#### Login Flow
1. User fills in: Phone Number, Password
2. Client-side validation: Both fields required
3. API call to `/api/users/login`
4. On success:
   - Store JWT token in localStorage (`authToken`)
   - Store user data in localStorage (`currentUser`)
   - Update authentication state
   - Show success toast → Navigate to `/home`
5. On error: Show error toast with server message

#### Logout Flow
1. User clicks "Logout" button in home page header
2. AuthService clears:
   - JWT token from localStorage
   - User data from localStorage
   - Authentication state
3. Navigate to `/auth/login`

### Data Storage

The following data is stored in localStorage:
- `authToken`: JWT token received from login
- `currentUser`: User object `{ id, name, phone }`
- `hasOnboarded`: Boolean flag for onboarding completion

### Error Handling

The AuthService includes comprehensive error handling:
- Network errors
- Server validation errors
- HTTP status errors
- Custom error messages from backend

Error messages are displayed to users via Ionic Toast notifications.

## Testing Instructions

### Prerequisites
1. Ensure backend server is running at `http://localhost:3000`
2. MongoDB connection is active
3. Frontend dev server is running at `http://localhost:4200`

### Test Registration
1. Navigate to `/auth/register` or click "Sign Up" from login page
2. Fill in the form:
   - Full Name: "Test User"
   - Phone: "237651234567" (9-15 digits)
   - Password: "password123" (min 6 chars)
   - Confirm Password: "password123"
3. Click "Sign Up"
4. Expected: Success toast → Redirect to login page

### Test Login
1. Navigate to `/auth/login`
2. Fill in credentials from registration
3. Click "Login"
4. Expected: Success toast → Redirect to home page
5. Check localStorage for `authToken` and `currentUser`

### Test Error Cases

**Registration Errors:**
- Empty fields → "Please fill in all fields"
- Password mismatch → "Passwords do not match"
- Short password → "Password must be at least 6 characters"
- Duplicate phone → Server error: "Phone already registered"

**Login Errors:**
- Empty fields → "Please enter phone and password"
- Wrong credentials → Server error: "Invalid credentials"

## CORS Configuration

The backend already has CORS enabled in `app.js`:
```javascript
app.use(cors());
```

This allows the frontend (localhost:4200) to make requests to the backend (localhost:3000).

## Future Enhancements

The following authentication features are stubbed but not yet implemented:
- Google OAuth (`loginWithGoogle()`)
- Apple Sign In (`loginWithApple()`)
- Forgot Password flow (`forgotPassword()`, `verifyOtp()`, `resetPassword()`)

These will require additional backend endpoints to be implemented.

## Security Notes

1. **Token Storage**: Currently using localStorage. Consider using httpOnly cookies for production.
2. **Password Validation**: Backend validates minimum 6 characters. Consider stronger requirements.
3. **Phone Validation**: Backend validates 9-15 digits. Ensure proper phone format validation.
4. **HTTPS**: Use HTTPS in production for secure token transmission.

## Troubleshooting

### Common Issues

**Issue**: CORS errors
- **Solution**: Ensure backend has `cors()` middleware enabled

**Issue**: Network error / Connection refused
- **Solution**: Verify backend server is running on port 3000

**Issue**: 401 Unauthorized on protected routes
- **Solution**: Check if token is being sent in request headers (implement HTTP interceptor)

**Issue**: Registration succeeds but user can't login
- **Solution**: Verify password is being hashed correctly in backend

## Route Protection

### Guest Guard
Prevents authenticated users from accessing:
- Onboarding screens (`/onboarding/*`)
- Auth screens (`/auth/*`)

If a logged-in user tries to access these routes, they are redirected to `/home`.

### Auth Guard
Protects the home route (`/home`) - requires authentication.
If an unauthenticated user tries to access, they are redirected to `/auth/login`.

### Initial Redirect Guard
Smart routing on app launch (`/`):
- If logged in → Redirect to `/home`
- If not logged in but onboarded → Redirect to `/auth/login`
- If not logged in and not onboarded → Redirect to `/onboarding/splash`

## Next Steps

1. Implement HTTP interceptor to attach JWT token to protected API requests
2. Add token refresh mechanism
3. Implement forgot password flow when backend endpoints are ready
4. Add more protected routes (parking, rental, buy/sell features)
5. Implement profile management
