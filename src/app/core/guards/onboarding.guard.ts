import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const onboardingGuard: CanActivateFn = () => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  if (storageService.hasOnboarded()) {
    router.navigate(['/auth/login']);
    return false;
  }

  return true;
};
