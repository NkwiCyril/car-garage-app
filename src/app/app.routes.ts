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
