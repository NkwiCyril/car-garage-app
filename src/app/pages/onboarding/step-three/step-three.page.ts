import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.page.html',
  styleUrls: ['./step-three.page.scss'],
  imports: [IonContent],
})
export class StepThreePage {
  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  getStarted(): void {
    this.storageService.setOnboarded();
    this.router.navigate(['/auth/login']);
  }

  reviewListingPolicy(): void {
    this.storageService.setOnboarded();
    this.router.navigate(['/auth/login']);
  }
}
