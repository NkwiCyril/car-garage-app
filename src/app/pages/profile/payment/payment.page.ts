import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  cardOutline,
  trashOutline,
  addCircleOutline,
  phonePortraitOutline,
  checkmarkOutline,
} from 'ionicons/icons';

interface PaymentMethod {
  id: string;
  type: 'momo' | 'orange' | 'visa' | 'mastercard';
  name: string;
  detail: string;
  color: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class PaymentPage {
  methods: PaymentMethod[] = [
    { id: '1', type: 'momo', name: 'MTN Mobile Money', detail: '•••• 6712', color: '#FFCC00' },
    { id: '2', type: 'orange', name: 'Orange Money', detail: '•••• 4421', color: '#FF6600' },
  ];

  constructor(private router: Router) {
    addIcons({
      arrowBackOutline,
      cardOutline,
      trashOutline,
      addCircleOutline,
      phonePortraitOutline,
      checkmarkOutline,
    });
  }

  remove(id: string): void {
    this.methods = this.methods.filter((m) => m.id !== id);
  }

  addMethod(type: string): void {
    // TODO: show add form
  }

  goBack(): void {
    this.router.navigate(['/tabs/profile']);
  }
}
