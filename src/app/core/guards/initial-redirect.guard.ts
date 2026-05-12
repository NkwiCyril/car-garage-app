import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

export const initialRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    router.navigate(['/tabs/home']);
    return false;
  }

  // Guests land on the dashboard so they can browse the platform.
  // First-time visitors still see the onboarding flow once.
  const hasOnboarded = storageService.get<boolean>('hasOnboarded');
  if (hasOnboarded) {
    router.navigate(['/tabs/home']);
  } else {
    router.navigate(['/onboarding/splash']);
  }

  return false;
};
