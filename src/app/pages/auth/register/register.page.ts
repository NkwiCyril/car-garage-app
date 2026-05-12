import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonSpinner,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    IonSpinner,
    IonIcon,
    FormsModule,
  ],
})
export class RegisterPage {
  fullName: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    addIcons({ arrowForwardOutline });
  }

  private get returnUrl(): string {
    const url = this.route.snapshot.queryParamMap.get('returnUrl');
    return url && url.startsWith('/') && !url.startsWith('/auth/') ? url : '/tabs/home';
  }

  async register(): Promise<void> {
    if (!this.fullName.trim() || !this.phone.trim() || !this.password || !this.confirmPassword) {
      await this.showToast('Please fill in every field so we can create your account.', 'warning');
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showToast('Those passwords don’t match. Please try again.', 'warning');
      return;
    }

    if (this.password.length < 6) {
      await this.showToast('Choose a password with at least 6 characters.', 'warning');
      return;
    }

    this.isLoading = true;

    this.authService.register(this.fullName, this.phone, this.password, this.confirmPassword).subscribe({
      next: async (response) => {
        this.isLoading = false;
        if (response.success) {
          await this.showToast(
            response.message || `We just sent a verification code to ${this.phone}.`,
            'success',
          );
          this.router.navigate(['/auth/verify-otp'], {
            queryParams: {
              phone: this.phone,
              returnUrl: this.returnUrl,
            },
          });
        } else {
          await this.showToast(
            response?.message || 'We couldn’t create your account. Please try again.',
            'danger',
          );
        }
      },
      error: async (error) => {
        this.isLoading = false;
        await this.showToast(
          error.message || 'Sign-up failed. Please check your details and try again.',
          'danger',
        );
      },
    });
  }

  goToLogin(): void {
    const url = this.route.snapshot.queryParamMap.get('returnUrl');
    this.router.navigate(['/auth/login'], url ? { queryParams: { returnUrl: url } } : {});
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
