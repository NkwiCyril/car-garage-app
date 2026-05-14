import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonInput,
  IonIcon,
  IonInputPasswordToggle,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, logoApple, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonInput,
    IonIcon,
    IonInputPasswordToggle,
    IonSpinner,
    FormsModule,
  ],
})
export class LoginPage {
  phone: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    addIcons({ logoGoogle, logoApple, eyeOffOutline, eyeOutline });
  }

  private get returnUrl(): string {
    const url = this.route.snapshot.queryParamMap.get('returnUrl');
    return url && url.startsWith('/') && !url.startsWith('/auth/') ? url : '/tabs/home';
  }

  async login(): Promise<void> {
    if (!this.phone.trim() || !this.password) {
      await this.showToast('Enter your phone number and password to continue.', 'warning');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.phone, this.password).subscribe({
      next: async (response) => {
        this.isLoading = false;
        if (!response?.success) {
          await this.showToast(
            response?.message || 'We couldn’t sign you in. Please try again.',
            'danger',
          );
          return;
        }

        // The backend may either:
        //   (a) return a session token directly, or
        //   (b) issue an OTP (Step 1 of a 2-step login) — token is delivered after
        //       POST /users/verify-otp succeeds.
        // AuthService.login() stores the token automatically when present, so
        // we can simply check the authenticated state here.
        if (this.authService.isLoggedIn) {
          const firstName = this.authService.currentUser?.name?.split(' ')[0];
          const greeting = firstName ? `Welcome back, ${firstName}!` : 'Welcome back!';
          await this.showToast(greeting, 'success');
          this.router.navigateByUrl(this.returnUrl);
          return;
        }

        // No token yet → backend issued an OTP. Send the user to the verify screen.
        const otp = this.extractOtp(response);
        const baseMsg = response.message || 'We sent a verification code to your phone.';
        const msg = otp ? `${baseMsg} Your OTP is ${otp}` : baseMsg;
        await this.showToast(msg, 'success', otp ? 8000 : 3000);
        this.router.navigate(['/auth/verify-otp'], {
          queryParams: {
            phone: this.phone,
            returnUrl: this.returnUrl,
          },
        });
      },
      error: async (error) => {
        this.isLoading = false;
        await this.showToast(
          error.message || 'Sign-in failed. Please check your phone and password.',
          'danger',
        );
      },
    });
  }

  loginWithGoogle(): void {
    this.showToast('Google sign-in is coming soon.', 'medium');
  }

  loginWithApple(): void {
    this.showToast('Apple sign-in is coming soon.', 'medium');
  }

  goToRegister(): void {
    const url = this.route.snapshot.queryParamMap.get('returnUrl');
    this.router.navigate(['/auth/register'], url ? { queryParams: { returnUrl: url } } : {});
  }

  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  /** Dev helper: pull the OTP from the login response when the backend echoes it. */
  private extractOtp(response: any): string | null {
    const direct = response?.otp ?? response?.code ?? response?.data?.otp;
    if (direct) return String(direct);
    const msg: string = response?.message ?? '';
    const match = msg.match(/\b(\d{4,6})\b/);
    return match ? match[1] : null;
  }

  private async showToast(message: string, color: string = 'primary', duration = 3000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top',
      color,
    });
    await toast.present();
  }
}
