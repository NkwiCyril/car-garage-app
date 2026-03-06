import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.page.html',
  styleUrls: ['./step-one.page.scss'],
  imports: [IonContent],
})
export class StepOnePage {
  constructor(private router: Router) {}

  goToNext(): void {
    this.router.navigate(['/onboarding/step-two']);
  }

  skip(): void {
    this.router.navigate(['/auth/login']);
  }
}
