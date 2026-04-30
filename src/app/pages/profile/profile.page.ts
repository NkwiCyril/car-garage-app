import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  AlertController,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import {
  personOutline,
  carOutline,
  shieldCheckmarkOutline,
  heartOutline,
  languageOutline,
  helpCircleOutline,
  documentTextOutline,
  logOutOutline,
  chevronForwardOutline,
  checkmarkCircle,
  logoWhatsapp,
  cameraOutline,
  alertCircle,
  checkmark,
  alert,
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { BookingService } from '../../core/services/booking.service';
import { CarService } from '../../core/services/car.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

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
  imports: [CommonModule, IonContent, IonIcon, TranslatePipe],
})
export class ProfilePage implements OnInit, ViewWillEnter {
  userName = '';
  userPhone = '';
  userAvatar: string | null = null;

  stats = {
    bookings: 0,
    vehicles: 0,
    wishlist: 0,
  };

  accountItems: MenuItem[] = [
    {
      icon: 'person-outline',
      label: 'pf.personalInfo',
      subtitle: 'pf.personalInfoSub',
      color: 'blue',
      route: '/profile/personal-info',
    },
    {
      icon: 'shield-checkmark-outline',
      label: 'pf.idVerification',
      subtitle: 'pf.idVerificationSub',
      color: 'green',
      badge: true,
      route: '/profile/verification',
    },
    // { icon: 'card-outline', label: 'pf.paymentMethods', subtitle: 'pf.paymentMethodsSub', color: 'purple', route: '/profile/payment' },
    {
      icon: 'car-outline',
      label: 'pf.myListings',
      subtitle: 'pf.myListingsSub',
      color: 'dark',
      route: '/cars/my',
    },
  ];

  prefItems: MenuItem[] = [
    {
      icon: 'heart-outline',
      label: 'pf.myWishlist',
      color: 'danger',
      route: '/profile/wishlist',
    },
    // { icon: 'lock-closed-outline', label: 'pf.privacySecurity', color: 'blue', route: '/profile/privacy' },
    {
      icon: 'language-outline',
      label: 'pf.language',
      color: 'blue',
      meta: 'English (US)',
      route: '/profile/language',
    },
    // { icon: 'notifications-outline', label: 'pf.notifications', color: 'blue', route: '/profile/notifications' },
  ];

  constructor(
    private authService: AuthService,
    private wishlistService: WishlistService,
    private bookingService: BookingService,
    private carService: CarService,
    private router: Router,
    private alertController: AlertController,
  ) {
    addIcons({
      personOutline,
      carOutline,
      shieldCheckmarkOutline,
      heartOutline,
      languageOutline,
      helpCircleOutline,
      documentTextOutline,
      logOutOutline,
      chevronForwardOutline,
      checkmarkCircle,
      logoWhatsapp,
      cameraOutline,
      alertCircle,
      checkmark,
      alert,
    });
  }

  private static readonly LANG_LABELS: Record<string, string> = {
    en: 'English (US)', fr: 'French', es: 'Spanish',
    zh: 'Chinese', ar: 'Arabic', nl: 'Dutch',
  };

  private getCurrentLanguageLabel(): string {
    const code = localStorage.getItem('app_language') ?? 'en';
    return ProfilePage.LANG_LABELS[code] ?? 'English (US)';
  }

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.userName = user.name || 'User';
      this.userPhone = user.phone || '';
    }
    const langItem = this.prefItems.find(i => i.route === '/profile/language');
    if (langItem) langItem.meta = this.getCurrentLanguageLabel();
  }

  ionViewWillEnter(): void {
    this.loadStats();
  }

  private loadStats(): void {
    const user = this.authService.currentUser;
    if (!user) return;
    const userId = user._id || user.id;

    const wishlist$ = this.wishlistService.getWishlist().pipe(
      catchError(() => of([] as string[])),
    );
    const bookings$ = this.bookingService.getBookings().pipe(
      catchError(() => of([] as any[])),
    );
    const toArr = (res: any): any[] =>
      Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    const sale$ = this.carService.getUserCarsForSale(userId).pipe(
      map(toArr), catchError(() => of([] as any[])),
    );
    const rent$ = this.carService.getUserCarsForRent(userId).pipe(
      map(toArr), catchError(() => of([] as any[])),
    );

    forkJoin([wishlist$, bookings$, sale$, rent$]).subscribe(([wishlist, bookings, sale, rent]) => {
      const seen = new Set<string>();
      [...sale, ...rent].forEach((c: any) => { if (c._id) seen.add(c._id); });
      this.stats = {
        bookings: bookings.length,
        vehicles: seen.size,
        wishlist: wishlist.length,
      };
    });
  }

  get isVerified(): boolean {
    return this.authService.currentUser?.verified === 'verified';
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
    const msg = `Hello, I need assistance with my DriveEase account.`;
    window.open(`https://wa.me/237676541667?text=${encodeURIComponent(msg)}`, '_blank');
  }
}
