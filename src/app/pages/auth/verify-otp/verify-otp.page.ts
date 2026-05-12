import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonInput,
  IonSpinner,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from '../../../core/services/auth.service';

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
  otp1 = '';
  otp2 = '';
  otp3 = '';
  otp4 = '';
  otp5 = '';
  otp6 = '';
  isLoading = false;

  phone = '';
  returnUrl = '/tabs/home';

  countdown = 60;
  countdownDisplay = '01:00';
  canResend = false;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastController: ToastController,
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.phone = params.get('phone') || this.authService.pendingAuthPhone || '';
    const r = params.get('returnUrl');
    this.returnUrl = r && r.startsWith('/') && !r.startsWith('/auth/') ? r : '/tabs/home';

    if (!this.phone) {
      // No pending registration — send the user to register
      this.router.navigate(['/auth/register']);
      return;
    }

    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }

  get maskedPhone(): string {
    if (!this.phone) return '';
    const digits = this.phone.replace(/\D/g, '');
    if (digits.length < 4) return this.phone;
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ••• •${digits.slice(-2)}`;
  }

  private startCountdown(): void {
    this.clearCountdown();
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

  private get otpCode(): string {
    return (this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6).trim();
  }

  verifyOtp(): void {
    if (this.isLoading) return;
    const code = this.otpCode;
    if (code.length < 4) {
      this.showToast('Enter the full verification code we sent to your phone.', 'warning');
      return;
    }

    this.isLoading = true;
    this.authService.verifyOtp(this.phone, code).subscribe({
      next: async (response) => {
        this.isLoading = false;
        if (response?.success && response?.token) {
          const firstName = response.user?.name?.split(' ')[0];
          const greeting = firstName
            ? `Phone verified — welcome aboard, ${firstName}!`
            : 'Phone verified — welcome to DriveEase!';
          await this.showToast(greeting, 'success');
          this.router.navigateByUrl(this.returnUrl);
        } else {
          await this.showToast(
            response?.message || 'That code didn’t match. Double-check it and try again.',
            'danger',
          );
        }
      },
      error: async (err: Error) => {
        this.isLoading = false;
        await this.showToast(
          err.message || 'We couldn’t verify that code. Please try again.',
          'danger',
        );
      },
    });
  }

  resendOtp(): void {
    if (!this.canResend || !this.phone) return;
    this.authService.resendOtp(this.phone).subscribe({
      next: async (response) => {
        await this.showToast(
          response?.message || `A fresh code is on its way to ${this.maskedPhone}.`,
          'success',
        );
        this.startCountdown();
      },
      error: async (err: Error) => {
        await this.showToast(
          err.message || 'We couldn’t resend the code. Wait a moment and try again.',
          'danger',
        );
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/auth/register']);
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

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2800,
      position: 'top',
      color,
    });
    await toast.present();
  }
}
