import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonSpinner,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  imports: [IonContent, IonSpinner, IonIcon, IonInput, IonInputPasswordToggle, FormsModule],
})
export class ResetPasswordPage {
  newPassword: string = '';
  repeatPassword: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}

  resetPassword(): void {
    // TODO: Replace with actual API call via AuthService
    this.router.navigate(['/auth/login']);
  }

  goBack(): void {
    this.router.navigate(['/auth/verify-otp']);
  }

  contactSupport(): void {
    const msg = `Hello, I need help resetting my DriveEase account password.`;
    window.open(`https://wa.me/237676541667?text=${encodeURIComponent(msg)}`, '_blank');
  }
}
