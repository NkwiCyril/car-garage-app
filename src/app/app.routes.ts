import { Routes } from '@angular/router';

export const routes: Routes = [
  // Onboarding
  {
    path: 'onboarding/splash',
    loadComponent: () => import('./pages/onboarding/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'onboarding/step-one',
    loadComponent: () => import('./pages/onboarding/step-one/step-one.page').then((m) => m.StepOnePage),
  },
  {
    path: 'onboarding/step-two',
    loadComponent: () => import('./pages/onboarding/step-two/step-two.page').then((m) => m.StepTwoPage),
  },

  // Auth
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./pages/auth/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'auth/forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.page').then((m) => m.ForgotPasswordPage),
  },
  {
    path: 'auth/verify-otp',
    loadComponent: () => import('./pages/auth/verify-otp/verify-otp.page').then((m) => m.VerifyOtpPage),
  },
  {
    path: 'auth/reset-password',
    loadComponent: () => import('./pages/auth/reset-password/reset-password.page').then((m) => m.ResetPasswordPage),
  },

  // Home (placeholder for post-auth)
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },

  // Default redirect to onboarding splash
  {
    path: '',
    redirectTo: 'onboarding/splash',
    pathMatch: 'full',
  },
];
