import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
  imports: [IonContent, IonInput, FormsModule],
})
export class VerifyOtpPage {
  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';

  constructor(private router: Router) {}

  verifyOtp(): void {
    // TODO: Replace with actual API call via AuthService
    this.router.navigate(['/auth/reset-password']);
  }

  resendOtp(): void {
    // TODO: Implement resend OTP via AuthService
  }

  goBack(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  onOtpInput(event: any, nextInput: string | null): void {
    const value = event.detail.value;
    if (value && value.length === 1 && nextInput) {
      const next = document.getElementById(nextInput);
      if (next) {
        (next as any).setFocus();
      }
    }
  }
}
