import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  imports: [IonContent, IonInput, IonInputPasswordToggle, FormsModule],
})
export class ResetPasswordPage {
  newPassword: string = '';
  reapeatPassword: string = '';

  constructor(private router: Router) {}

  resetPassword(): void {
    // TODO: Replace with actual API call via AuthService
    this.router.navigate(['/auth/login']);
  }

  goBack(): void {
    this.router.navigate(['/auth/verify-otp']);
  }
}
