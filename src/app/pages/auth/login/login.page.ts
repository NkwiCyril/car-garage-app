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
        if (response.success) {
          const firstName = response.user?.name?.split(' ')[0];
          const greeting = firstName ? `Welcome back, ${firstName}!` : 'Welcome back!';
          await this.showToast(greeting, 'success');
          this.router.navigateByUrl(this.returnUrl);
        } else {
          await this.showToast(
            response?.message || 'We couldn’t sign you in. Please try again.',
            'danger',
          );
        }
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

  private async showToast(message: string, color: string = 'primary'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    await toast.present();
  }
}
