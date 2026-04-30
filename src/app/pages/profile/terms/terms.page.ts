import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, timeOutline, checkmarkCircleOutline, logoWhatsapp } from 'ionicons/icons';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class TermsPage {
  constructor(private router: Router) {
    addIcons({ arrowBackOutline, timeOutline, checkmarkCircleOutline, logoWhatsapp });
  }

  goBack(): void {
    this.router.navigate(['/tabs/profile']);
  }

  contactSupport(): void {
    const msg = `Hello, I have a question regarding the Terms & Conditions of DriveEase.`;
    window.open(`https://wa.me/237676541667?text=${encodeURIComponent(msg)}`, '_blank');
  }
}
