import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthPromptService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
  ) {}

  /** Returns true if the user is signed in. Otherwise shows a toast and routes
   * to /auth/login with a returnUrl set to `returnTo` (defaults to current URL). */
  async requireAuth(message = 'Please sign in to continue', returnTo?: string): Promise<boolean> {
    if (this.authService.isLoggedIn) return true;

    const url = returnTo ?? this.router.url ?? '/tabs/home';
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      position: 'top',
      color: 'primary',
    });
    await toast.present();

    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: url } });
    return false;
  }
}
