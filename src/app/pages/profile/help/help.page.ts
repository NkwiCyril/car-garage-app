import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  chevronDownOutline,
  logoWhatsapp,
  mailOutline,
  helpCircleOutline,
} from 'ionicons/icons';

interface FaqItem {
  q: string;
  a: string;
  open: boolean;
}

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class HelpPage {
  faqs: FaqItem[] = [
    {
      q: 'How do I list my car for sale?',
      a: 'Go to the Auto Market tab, tap the "+" button and follow the 5-step listing wizard. Your listing will be reviewed by our team within 24 hours.',
      open: false,
    },
    {
      q: 'How does the verification process work?',
      a: 'After submitting your listing, an admin will review your documents and contact you via WhatsApp to schedule a physical inspection.',
      open: false,
    },
    {
      q: 'What payment methods are accepted?',
      a: 'We accept MTN Mobile Money, Orange Money, Visa, and Mastercard. All transactions are encrypted and secured.',
      open: false,
    },
    {
      q: 'Can I rent and sell a car at the same time?',
      a: 'Yes! You can list a car as both available for sale and for rent simultaneously. Buyers and renters will both see your listing.',
      open: false,
    },
    {
      q: 'How do I cancel a booking?',
      a: 'Open the Bookings tab, find your active booking, and tap "Cancel Booking". Cancellation policies vary by listing.',
      open: false,
    },
  ];

  constructor(private router: Router) {
    addIcons({
      arrowBackOutline,
      chevronDownOutline,
      logoWhatsapp,
      mailOutline,
      helpCircleOutline,
    });
  }

  toggleFaq(item: FaqItem): void {
    item.open = !item.open;
  }

  openWhatsApp(): void {
    const msg = `Hello, I'm contacting you from the Help & Support section of DriveEase. I need some assistance.`;
    window.open(`https://wa.me/237676541667?text=${encodeURIComponent(msg)}`, '_blank');
  }

  sendEmail(): void {
    window.open('mailto:support@driveease.cm', '_blank');
  }

  goBack(): void {
    this.router.navigate(['/tabs/profile']);
  }
}
