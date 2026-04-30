import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  lockClosedOutline,
  fingerPrintOutline,
  shieldOutline,
  eyeOffOutline,
} from 'ionicons/icons';

interface Setting {
  key: string;
  label: string;
  desc: string;
  enabled: boolean;
}

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.page.html',
  styleUrls: ['./privacy.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class PrivacyPage {
  securitySettings: Setting[] = [
    {
      key: 'biometric',
      label: 'Biometric Login',
      desc: 'Use fingerprint or Face ID to sign in',
      enabled: false,
    },
    {
      key: '2fa',
      label: 'Two-Factor Authentication',
      desc: 'Get a code via SMS on each login',
      enabled: false,
    },
    {
      key: 'alerts',
      label: 'Login Alerts',
      desc: 'Get notified of new sign-ins to your account',
      enabled: true,
    },
  ];

  privacySettings: Setting[] = [
    {
      key: 'activity',
      label: 'Activity Tracking',
      desc: 'Allow us to improve your experience',
      enabled: true,
    },
    {
      key: 'marketing',
      label: 'Marketing Emails',
      desc: 'Receive offers and promotions via email',
      enabled: false,
    },
    {
      key: 'data',
      label: 'Data Sharing',
      desc: 'Share anonymized data with partners',
      enabled: false,
    },
  ];

  constructor(private router: Router) {
    addIcons({
      arrowBackOutline,
      lockClosedOutline,
      fingerPrintOutline,
      shieldOutline,
      eyeOffOutline,
    });
  }

  toggle(setting: Setting): void {
    setting.enabled = !setting.enabled;
  }

  goBack(): void {
    this.router.navigate(['/tabs/profile']);
  }
}
