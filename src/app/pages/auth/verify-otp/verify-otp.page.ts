import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonInput,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.page.html',
  styleUrls: ['./verify-otp.page.scss'],
  imports: [
    IonContent,
    IonInput,
    IonSpinner,
    IonIcon,
    FormsModule,
    CommonModule,
  ],
})
export class VerifyOtpPage implements OnInit, OnDestroy {
  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';
  otp5: string = '';
  isLoading: boolean = false;

  countdown: number = 60;
  countdownDisplay: string = '01:00';
  canResend: boolean = false;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }

  private startCountdown(): void {
    this.countdown = 60;
    this.canResend = false;
    this.updateDisplay();

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      this.updateDisplay();

      if (this.countdown <= 0) {
        this.clearCountdown();
        this.canResend = true;
        this.countdownDisplay = '00:00';
      }
    }, 1000);
  }

  private updateDisplay(): void {
    const mins = Math.floor(this.countdown / 60);
    const secs = this.countdown % 60;
    this.countdownDisplay = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private clearCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  verifyOtp(): void {
    this.router.navigate(['/auth/reset-password']);
  }

  resendOtp(): void {
    if (!this.canResend) return;
    // TODO: Implement resend OTP via AuthService
    this.startCountdown();
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
