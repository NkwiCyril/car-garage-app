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
    if (!this.phone || !this.password) {
      await this.showToast('Please enter phone and password', 'warning');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.phone, this.password).subscribe({
      next: async (response) => {
        this.isLoading = false;
        if (response.success) {
          await this.showToast('Login successful!', 'success');
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: async (error) => {
        this.isLoading = false;
        await this.showToast(error.message || 'Login failed', 'danger');
      }
    });
  }

  loginWithGoogle(): void {
    this.showToast('Google OAuth not available yet', 'warning');
  }

  loginWithApple(): void {
    this.showToast('Apple Sign In not available yet', 'warning');
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
