import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  cardOutline,
  carOutline,
  shieldCheckmarkOutline,
  heartOutline,
  lockClosedOutline,
  languageOutline,
  notificationsOutline,
  helpCircleOutline,
  documentTextOutline,
  logOutOutline,
  chevronForwardOutline,
  checkmarkCircle,
  logoWhatsapp,
  cameraOutline,
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  subtitle?: string;
  color: string;
  badge?: boolean;
  meta?: string;
  route: string | null;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class ProfilePage implements OnInit {
  userName = '';
  userPhone = '';
  userAvatar: string | null = null;

  stats = {
    bookings: 12,
    vehicles: 4,
    wishlist: 28,
  };

  accountItems: MenuItem[] = [
    {
      icon: 'person-outline',
      label: 'Personal Information',
      subtitle: 'Manage your profile details',
      color: 'blue',
      route: '/profile/personal-info',
    },
    {
      icon: 'shield-checkmark-outline',
      label: 'ID Verification',
      subtitle: 'Status: Verified Account',
      color: 'green',
      badge: true,
      route: '/profile/verification',
    },
    {
      icon: 'card-outline',
      label: 'Payment Methods',
      subtitle: 'Momo, Orange, Cards',
      color: 'purple',
      route: null,
    },
    {
      icon: 'car-outline',
      label: 'My Listings',
      subtitle: 'Manage your fleet',
      color: 'dark',
      route: '/cars/my',
    },
  ];

  prefItems: MenuItem[] = [
    {
      icon: 'heart-outline',
      label: 'My Wishlist',
      color: 'danger',
      route: null,
    },
    {
      icon: 'lock-closed-outline',
      label: 'Privacy & Security',
      color: 'blue',
      route: null,
    },
    {
      icon: 'language-outline',
      label: 'Language',
      color: 'blue',
      meta: 'English (US)',
      route: null,
    },
    {
      icon: 'notifications-outline',
      label: 'Notifications',
      color: 'blue',
      route: null,
    },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
  ) {
    addIcons({
      personOutline,
      cardOutline,
      carOutline,
      shieldCheckmarkOutline,
      heartOutline,
      lockClosedOutline,
      languageOutline,
      notificationsOutline,
      helpCircleOutline,
      documentTextOutline,
      logOutOutline,
      chevronForwardOutline,
      checkmarkCircle,
      logoWhatsapp,
      cameraOutline,
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.userName = user.name || 'User';
      this.userPhone = user.phone || '';
    }
  }

  get isVerified(): boolean {
    return this.accountItems.some(
      item => item.route === '/profile/verification' && item.badge,
    );
  }

  get maskedPhone(): string {
    if (!this.userPhone) return 'No phone number';
    const digits = this.userPhone.replace(/\D/g, '');
    if (digits.length < 6) return this.userPhone;
    const prefix = digits.slice(0, 6);
    const suffix = digits.slice(-2);
    return `+${prefix.slice(0, 3)} ${prefix.slice(3)} • • • • ${suffix}`;
  }

  padNum(n: number): string {
    return n.toString().padStart(2, '0');
  }

  onMenuItemClick(item: any): void {
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  async confirmLogout(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Logout',
          role: 'confirm',
          cssClass: 'alert-logout-btn',
          handler: () => this.logout(),
        },
      ],
    });
    await alert.present();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  openWhatsApp(): void {
    window.open('https://wa.me/237XXXXXXXXX', '_blank');
  }
}