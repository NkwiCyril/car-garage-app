import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
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
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  async register(): Promise<void> {
    if (!this.fullName || !this.phone || !this.password || !this.confirmPassword) {
      await this.showToast('Please fill in all fields', 'warning');
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showToast('Passwords do not match', 'warning');
      return;
    }

    if (this.password.length < 6) {
      await this.showToast('Password must be at least 6 characters', 'warning');
      return;
    }

    this.isLoading = true;

    this.authService.register(this.fullName, this.phone, this.password, this.confirmPassword).subscribe({
      next: async (response) => {
        this.isLoading = false;
        if (response.success) {
          await this.showToast('Registration successful! Please login.', 'success');
          this.router.navigate(['/auth/login']);
        }
      },
      error: async (error) => {
        this.isLoading = false;
        await this.showToast(error.message || 'Registration failed', 'danger');
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
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
