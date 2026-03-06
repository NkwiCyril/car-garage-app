import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  imports: [IonContent, IonInput, FormsModule],
})
export class ForgotPasswordPage {
  phone: string = '';

  constructor(private router: Router) {}

  sendOtp(): void {
    // TODO: Replace with actual API call via AuthService
    this.router.navigate(['/auth/verify-otp']);
  }

  goBack(): void {
    this.router.navigate(['/auth/login']);
  }
}
