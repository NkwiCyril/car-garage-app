import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  imports: [IonContent],
})
export class SplashPage implements OnInit, OnDestroy {
  private advanceTimer?: ReturnType<typeof setTimeout>;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.advanceTimer = setTimeout(() => {
      this.router.navigate(['/onboarding/step-one']);
    }, 2500);
  }

  ngOnDestroy(): void {
    if (this.advanceTimer) {
      clearTimeout(this.advanceTimer);
    }
  }
}
