import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  searchOutline,
  optionsOutline,
  carOutline,
  carSportOutline,
  notificationsOutline,
  arrowForwardOutline,
  heartOutline,
  heart,
  flashOutline,
  timeOutline,
  logoWhatsapp,
  gridOutline,
  bodyOutline,
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

interface FeaturedCar {
  id: string;
  name: string;
  image: string;
  km: string;
  year: number;
  price: string;
  isFavorite: boolean;
}

interface Promo {
  image: string;
  title: string;
  subtitle: string;
  badgeIcon: string;
  badgeText: string;
  hasCountdown: boolean;
  buttonText: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class DashboardPage implements OnInit, OnDestroy {
  @ViewChild('promoTrack', { static: false })
  promoTrack!: ElementRef<HTMLDivElement>;

  userName = '';
  currentLocation = 'Douala, CM';
  activeCategoryIndex = 0;

  // Promo countdown
  countdownDisplay = '04:12:45';
  private countdownTarget: Date;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  activePromoIndex = 0;
  private autoSlideInterval: ReturnType<typeof setInterval> | null = null;

  promos: Promo[] = [
    {
      image: 'assets/images/dashboard/banner-luxury-car.jpg',
      title: 'Weekend Luxury<br/>Getaway',
      subtitle: 'Experience the drive of your dreams.',
      badgeIcon: 'flash-outline',
      badgeText: 'HOT DEAL',
      hasCountdown: true,
      buttonText: 'Save 15% on Rentals',
      route: '/tabs/auto',
    },
    {
      image: 'assets/images/dashboard/banner-luxury-car.jpg',
      title: 'New SUV<br/>Collection',
      subtitle: 'Explore the latest models available now.',
      badgeIcon: 'car-sport-outline',
      badgeText: 'JUST IN',
      hasCountdown: false,
      buttonText: 'Browse SUVs',
      route: '/tabs/auto',
    },
    {
      image: 'assets/images/dashboard/banner-luxury-car.jpg',
      title: 'Smart Parking<br/>Solutions',
      subtitle: 'Reserve your spot in seconds.',
      badgeIcon: 'location-outline',
      badgeText: 'NEW',
      hasCountdown: false,
      buttonText: 'Find Parking',
      route: '/tabs/parking',
    },
  ];

  categories = [
    { icon: 'grid-outline', label: 'All' },
    { icon: 'car-outline', label: 'Sedans' },
    { icon: 'car-sport-outline', label: 'SUVs' },
    { icon: 'body-outline', label: 'Luxury' },
  ];

  featuredCars: FeaturedCar[] = [
    {
      id: '1',
      name: 'BMW M5 Competition',
      image: 'assets/images/dashboard/car-bmw-m5.jpg',
      km: '12,500',
      year: 2022,
      price: '45.5M',
      isFavorite: false,
    },
    {
      id: '2',
      name: 'Toyota Land Cruiser',
      image: 'assets/images/dashboard/car-toyota-lc.jpg',
      km: '4,200',
      year: 2023,
      price: '72.0M',
      isFavorite: false,
    },
    {
      id: '3',
      name: 'BMW M5 Competition',
      image: 'assets/images/dashboard/car-bmw-m5.jpg',
      km: '12,500',
      year: 2022,
      price: '45.5M',
      isFavorite: false,
    },
    {
      id: '4',
      name: 'Toyota Land Cruiser',
      image: 'assets/images/dashboard/car-toyota-lc.jpg',
      km: '4,200',
      year: 2023,
      price: '72.0M',
      isFavorite: false,
    },
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    addIcons({
      locationOutline,
      searchOutline,
      optionsOutline,
      carOutline,
      carSportOutline,
      notificationsOutline,
      arrowForwardOutline,
      heartOutline,
      heart,
      flashOutline,
      timeOutline,
      logoWhatsapp,
      gridOutline,
      bodyOutline,
    });

    // Set countdown target 4h 12m 45s from now
    this.countdownTarget = new Date(
      Date.now() + (4 * 3600 + 12 * 60 + 45) * 1000,
    );
  }

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.userName = user.name?.split(' ')[0] || 'Driver';
    }
    this.startCountdown();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.stopAutoSlide();
  }

  private startAutoSlide(): void {
  this.autoSlideInterval = setInterval(() => {
    const next = (this.activePromoIndex + 1) % this.promos.length;
    this.scrollToPromo(next);
  }, 5000);
}

private stopAutoSlide(): void {
  if (this.autoSlideInterval) {
    clearInterval(this.autoSlideInterval);
    this.autoSlideInterval = null;
  }
}

private resetAutoSlide(): void {
  this.stopAutoSlide();
  this.startAutoSlide();
}

scrollToPromo(index: number): void {
  const track = this.promoTrack?.nativeElement;
  if (!track) return;

  const card = track.children[index] as HTMLElement;
  if (card) {
    track.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    this.activePromoIndex = index;
    this.resetAutoSlide();
  }
}

onPromoScroll(): void {
  const track = this.promoTrack?.nativeElement;
  if (!track) return;

  const scrollLeft = track.scrollLeft;
  const cardWidth = track.children[0]?.clientWidth || 1;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const index = Math.round(scrollLeft / (cardWidth + gap));
  if (index !== this.activePromoIndex && index >= 0 && index < this.promos.length) {
    this.activePromoIndex = index;
    this.resetAutoSlide();
  }
}

  private startCountdown(): void {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
  }

  private updateCountdown(): void {
    const diff = Math.max(0, this.countdownTarget.getTime() - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    this.countdownDisplay = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    if (diff <= 0 && this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  selectCategory(index: number): void {
    this.activeCategoryIndex = index;
    // TODO: filter cars by category
  }

  toggleFavorite(car: FeaturedCar): void {
    car.isFavorite = !car.isFavorite;
  }

  openCarDetail(car: FeaturedCar): void {
    this.router.navigate(['/cars/detail', car.id]);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  onSearchFocus(): void {
    // TODO: navigate to search page
  }

  openFilters(): void {
    // TODO: open filter modal
  }

  viewAllCars(): void {
    this.navigateTo('/tabs/auto');
  }

  openNotifications(): void {
    // TODO: open notifications
  }

  openWhatsApp(): void {
    window.open('https://wa.me/237XXXXXXXXX', '_blank');
  }
}
