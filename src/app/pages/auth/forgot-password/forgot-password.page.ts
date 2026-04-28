import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonInput,
  IonSpinner,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonInput,
    IonSpinner,
    IonIcon,
    FormsModule,
  ],
})
export class ForgotPasswordPage {
  phone: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {
    addIcons({ arrowForwardOutline });
  }

  sendOtp(): void {
    // TODO: Replace with actual API call via AuthService
    this.router.navigate(['/auth/verify-otp']);
  }

  goBack(): void {
    this.router.navigate(['/auth/login']);
  }

  contactSupport(): void {
    // TODO: Wire up support contact flow
  }
}
