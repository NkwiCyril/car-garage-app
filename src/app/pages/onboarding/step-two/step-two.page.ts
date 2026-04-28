import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.page.html',
  styleUrls: ['./step-two.page.scss'],
  imports: [IonContent],
})
export class StepTwoPage {
  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  goToNext(): void {
    this.router.navigate(['/onboarding/step-three']);
  }

  skip(): void {
    this.storageService.setOnboarded();
    this.router.navigate(['/auth/login']);
  }
}
