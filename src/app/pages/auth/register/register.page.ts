import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    FormsModule,
  ],
})
export class RegisterPage {
  name: string = '';
  phone: string = '';
  password: string = '';
  reapeatPassword: string = '';

  constructor(private router: Router) {}

  register(): void {
    // TODO: Replace with actual API call via AuthService
    this.router.navigate(['/auth/login']);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
