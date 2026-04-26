import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { initialRedirectGuard } from './core/guards/initial-redirect.guard';

export const routes: Routes = [
  // Onboarding
  {
    path: 'onboarding/splash',
    loadComponent: () => import('./pages/onboarding/splash/splash.page').then((m) => m.SplashPage),
    canActivate: [guestGuard],
  },
  {
    path: 'onboarding/step-one',
    loadComponent: () => import('./pages/onboarding/step-one/step-one.page').then((m) => m.StepOnePage),
    canActivate: [guestGuard],
  },
  {
    path: 'onboarding/step-two',
    loadComponent: () => import('./pages/onboarding/step-two/step-two.page').then((m) => m.StepTwoPage),
    canActivate: [guestGuard],
  },
  {
    path: 'onboarding/step-three',
    loadComponent: () => import('./pages/onboarding/step-three/step-three.page').then((m) => m.StepThreePage),
    canActivate: [guestGuard],
  },

  // Auth
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/auth/login/login.page').then((m) => m.LoginPage),
    canActivate: [guestGuard],
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./pages/auth/register/register.page').then((m) => m.RegisterPage),
    canActivate: [guestGuard],
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.page').then((m) => m.ForgotPasswordPage),
    canActivate: [guestGuard],
  },
  {
    path: 'auth/verify-otp',
    loadComponent: () => import('./pages/auth/verify-otp/verify-otp.page').then((m) => m.VerifyOtpPage),
    canActivate: [guestGuard],
  },
  {
    path: 'auth/reset-password',
    loadComponent: () => import('./pages/auth/reset-password/reset-password.page').then((m) => m.ResetPasswordPage),
    canActivate: [guestGuard],
  },

  // Tabs (protected - main app shell)
  {
    path: 'tabs',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.tabsRoutes),
  },

  // Cars (protected full-screen pages, no tab bar)
  {
    path: 'cars/add',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cars/add-car/add-car.page').then((m) => m.AddCarPage),
  },
  {
    path: 'cars/park',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cars/park-car/park-car.page').then((m) => m.ParkCarPage),
  },
  {
    path: 'cars/my',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cars/my-cars/my-cars.page').then((m) => m.MyCarsPage),
  },
  {
    path: 'cars/detail',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cars/car-detail/car-detail.page').then((m) => m.CarDetailPage),
  },

  {
    path: 'cars/sell',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cars/sell-car/sell-car.page').then((m) => m.SellCarPage),
  },

  // Bookings (protected full-screen pages, no tab bar)
  {
    path: 'bookings/detail',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/bookings/booking-detail/booking-detail.page').then((m) => m.BookingDetailPage),
  },

  // Legacy home redirect
  {
    path: 'home',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },

  // Default redirect - smart routing based on auth status
  {
    path: '',
    canActivate: [initialRedirectGuard],
    children: [],
  },
];
