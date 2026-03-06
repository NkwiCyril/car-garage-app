import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonIcon,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGoogle, logoApple, eyeOffOutline, eyeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonContent,
    IonInput,
    IonIcon,
    IonInputPasswordToggle,
    FormsModule,
  ],
})
export class LoginPage {
  phone: string = '';
  password: string = '';

  constructor(private router: Router) {
    addIcons({ logoGoogle, logoApple, eyeOffOutline, eyeOutline });
  }

  login(): void {
    // TODO: Replace with actual API call via AuthService
    this.router.navigate(['/home']);
  }

  loginWithGoogle(): void {
    // TODO: Implement Google OAuth
  }

  loginWithApple(): void {
    // TODO: Implement Apple Sign In
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
