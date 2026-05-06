import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonContent,
  IonIcon,
  MenuController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline,
  homeOutline,
  storefrontOutline,
  carOutline,
  addCircleOutline,
  personOutline,
  shieldCheckmarkOutline,
  cardOutline,
  logoWhatsapp,
  logOutOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { AuthService } from './core/services/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  bg: string;
  color: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet, IonMenu, IonContent, IonIcon, CommonModule],
})
export class AppComponent implements OnInit {

  readonly navItems: MenuItem[] = [
    { icon: 'home-outline',       label: 'Home',        route: '/tabs/home',     bg: '#dbeafe', color: '#0043eb' },
    { icon: 'storefront-outline', label: 'Marketplace', route: '/tabs/auto',     bg: '#ede9fe', color: '#7c3aed' },
    { icon: 'car-outline',        label: 'My Listings', route: '/cars/my',       bg: '#f1f5f9', color: '#0b1b2b' },
  ];

  readonly actionItems: MenuItem[] = [
    { icon: 'add-circle-outline', label: 'Start a Listing', route: '/cars/sell', bg: '#fef3c7', color: '#d97706' },
    { icon: 'heart-outline',       label: 'My Wishlist', route: '/profile/wishlist', bg: '#f5f3ff', color: '#7c3aed' },
  ];

  readonly accountItems: MenuItem[] = [
    { icon: 'person-outline',           label: 'Personal Information', route: '/profile/personal-info',  bg: '#dbeafe', color: '#0043eb' },
    { icon: 'shield-checkmark-outline', label: 'ID Verification',      route: '/profile/verification',   bg: '#dcfce7', color: '#16a34a' },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private menuController: MenuController,
    private alertController: AlertController,
  ) {
    addIcons({
      closeOutline,
      homeOutline,
      storefrontOutline,
      carOutline,
      addCircleOutline,
      personOutline,
      shieldCheckmarkOutline,
      cardOutline,
      logoWhatsapp,
      logOutOutline,
      chevronForwardOutline,
    });
  }

  ngOnInit(): void {}

  get userName(): string {
    return this.authService.currentUser?.name?.split(' ')[0] || 'Driver';
  }

  get userInitial(): string {
    return (this.authService.currentUser?.name?.charAt(0) || 'D').toUpperCase();
  }

  get userPhone(): string {
    return this.authService.currentUser?.phone || '';
  }

  get isVerified(): boolean {
    return this.authService.currentUser?.verified === 'verified';
  }

  get maskedPhone(): string {
    const digits = this.userPhone.replace(/\D/g, '');
    if (digits.length < 6) return this.userPhone;
    const prefix = digits.slice(0, 3);
    const suffix = digits.slice(-2);
    return `+${prefix} • • • • ${suffix}`;
  }

  async navigate(route: string): Promise<void> {
    await this.menuController.close('main-menu');
    this.router.navigate([route]);
  }

  async closeMenu(): Promise<void> {
    await this.menuController.close('main-menu');
  }

  async openWhatsApp(): Promise<void> {
    await this.menuController.close('main-menu');
    const msg = `Hello, I have a general inquiry about DriveEase.`;
    window.open(`https://wa.me/237676541667?text=${encodeURIComponent(msg)}`, '_blank');
  }

  async confirmLogout(): Promise<void> {
    await this.menuController.close('main-menu');
    const alert = await this.alertController.create({
      header: 'Sign Out',
      message: 'Are you sure you want to sign out of your account?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Sign Out',
          role: 'confirm',
          cssClass: 'alert-btn-danger',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          },
        },
      ],
    });
    await alert.present();
  }
}
