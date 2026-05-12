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

  // Tabs — main app shell. Home and Marketplace are public so guests can browse.
  // Per-tab auth is enforced inside tabs.routes.ts (wishlist, profile).
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.tabsRoutes),
  },

  // Public car browsing — guests can open detail pages.
  {
    path: 'cars/detail',
    loadComponent: () => import('./pages/cars/car-detail/car-detail.page').then((m) => m.CarDetailPage),
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
    path: 'cars/sell',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cars/sell-car/sell-car.page').then((m) => m.SellCarPage),
  },
  {
    path: 'cars/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cars/edit-car/edit-car.page').then((m) => m.EditCarPage),
  },

  // Profile sub-pages (full-screen, no tab bar)
  {
    path: 'profile/personal-info',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/personal-info/personal-info.page').then((m) => m.PersonalInfoPage),
  },
  {
    path: 'profile/verification',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/verification/verification.page').then((m) => m.VerificationPage),
  },
  {
    path: 'profile/wishlist',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/wishlist/wishlist.page').then((m) => m.WishlistPage),
  },
  {
    path: 'profile/language',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/language/language.page').then((m) => m.LanguagePage),
  },
  {
    path: 'profile/terms',
    loadComponent: () => import('./pages/profile/terms/terms.page').then((m) => m.TermsPage),
  },
  {
    path: 'profile/payment',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/payment/payment.page').then((m) => m.PaymentPage),
  },
  {
    path: 'profile/privacy',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/privacy/privacy.page').then((m) => m.PrivacyPage),
  },
  {
    path: 'profile/notifications',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/notifications/notifications.page').then((m) => m.NotificationsPage),
  },
  {
    path: 'profile/help',
    loadComponent: () => import('./pages/profile/help/help.page').then((m) => m.HelpPage),
  },
  {
    path: 'profile/dealer',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/dealer/dealer.page').then((m) => m.DealerPage),
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
