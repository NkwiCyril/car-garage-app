import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  MenuController,
} from '@ionic/angular/standalone';
import { Subject, EMPTY, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
} from 'rxjs/operators';
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
  bagHandleOutline,
  keyOutline,
  pricetagOutline,
  closeOutline,
  refreshOutline,
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { CarService } from '../../core/services/car.service';
import { AdvertService } from '../../core/services/advert.service';
import { TranslationService } from '../../core/services/translation.service';
import { GeolocationService } from '../../core/services/geolocation.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { Car } from '../../core/models/car.model';
import { Advert } from '../../core/models/advert.model';

interface FeaturedCar {
  id: string;
  make: string;
  model: string;
  name: string;
  image: string;
  km: string;
  year: number;
  price: string;
  priceValue: number;
  isFavorite: boolean;
  bodyType: string;
  _raw: Car;
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
  advertId?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonSpinner, TranslatePipe],
})
export class DashboardPage implements OnInit, OnDestroy {
  @ViewChild('promoTrack', { static: false })
  promoTrack!: ElementRef<HTMLDivElement>;
  @ViewChild('searchField')
  searchFieldRef!: ElementRef<HTMLInputElement>;

  userName = '';
  currentLocation = 'Locating…';
  isLocating = false;
  locationError = false;
  activeCategoryIndex = 0;

  // Promo slider
  promos: Promo[] = [];
  isLoadingPromos = true;
  activePromoIndex = 0;
  private autoSlideInterval: ReturnType<typeof setInterval> | null = null;

  // Countdown
  countdownDisplay = '04:12:45';
  private countdownTarget: Date;
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  // Featured cars
  allFeaturedCars: FeaturedCar[] = [];
  featuredCars: FeaturedCar[] = [];
  isLoadingCars = true;

  // Search
  isSearchMode = false;
  searchQuery = '';
  searchResults: Car[] = [];
  isSearchLoading = false;
  private searchSubject = new Subject<string>();
  private searchSub!: Subscription;

  categories = [
    { icon: 'grid-outline', label: 'auto.cat.all' },
    { icon: 'car-outline', label: 'auto.cat.sedans' },
    { icon: 'car-sport-outline', label: 'auto.cat.suvs' },
    { icon: 'body-outline', label: 'auto.cat.luxury' },
  ];

  quickActions = [
    { icon: 'bag-handle-outline', label: 'auto.qa.buy', route: '/tabs/auto', bg: '#dbeafe', color: '#2563eb' },
    { icon: 'key-outline', label: 'auto.qa.rent', route: '/tabs/auto', bg: '#dcfce7', color: '#16a34a' },
    { icon: 'pricetag-outline', label: 'auto.qa.sell', route: '/cars/sell', bg: '#ede9fe', color: '#7c3aed' },
    { icon: 'car-outline', label: 'auto.qa.myCars', route: '/cars/my', bg: '#fef3c7', color: '#d97706' },
  ];

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return this.translationService.t('dash.greeting.morning');
    if (hour < 17) return this.translationService.t('dash.greeting.afternoon');
    return this.translationService.t('dash.greeting.evening');
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private carService: CarService,
    private advertService: AdvertService,
    private menuController: MenuController,
    public translationService: TranslationService,
    private geolocationService: GeolocationService,
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
      bagHandleOutline,
      keyOutline,
      pricetagOutline,
      closeOutline,
      refreshOutline,
    });
    this.countdownTarget = new Date(
      Date.now() + (4 * 3600 + 12 * 60 + 45) * 1000,
    );
  }

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) this.userName = user.name?.split(' ')[0] || 'Driver';
    this.startCountdown();
    this.loadAdverts();
    this.loadFeaturedCars();
    this.setupSearch();
    this.loadLocation();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    this.stopAutoSlide();
    this.searchSub?.unsubscribe();
  }

  // ─── Location ────────────────────────────────────────

  private loadLocation(force = false): void {
    const cached = this.geolocationService.current;
    if (cached && !force) {
      this.currentLocation = cached.display;
      return;
    }
    this.isLocating = true;
    this.locationError = false;
    this.geolocationService.getLocation(force).subscribe({
      next: (loc) => {
        this.currentLocation = loc.display;
        this.isLocating = false;
      },
      error: () => {
        this.isLocating = false;
        this.locationError = true;
        this.currentLocation = 'Set location';
      },
    });
  }

  refreshLocation(): void {
    if (this.isLocating) return;
    this.loadLocation(true);
  }

  // ─── Data loading ─────────────────────────────────────

  private loadAdverts(): void {
    this.advertService.getAdverts({ status: 'active', limit: 5 }).subscribe({
      next: (res) => {
        const adverts: Advert[] = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        this.promos = adverts.map((a) => this.advertToPromo(a));
        this.isLoadingPromos = false;
        if (this.promos.length > 1) this.startAutoSlide();
      },
      error: () => {
        this.isLoadingPromos = false;
      },
    });
  }

  private loadFeaturedCars(): void {
    this.carService.getAvailableCars({ limit: 20 }).subscribe({
      next: (res) => {
        const cars: Car[] = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
            ? res
            : [];
        this.allFeaturedCars = cars
          .filter((c) => c.verified === 'verified')
          .map((c) => this.carToFeatured(c));
        this.featuredCars = this.filterByCategory(this.activeCategoryIndex);
        this.isLoadingCars = false;
      },
      error: () => {
        this.isLoadingCars = false;
      },
    });
  }

  private filterByCategory(index: number): FeaturedCar[] {
    if (index === 0) return this.allFeaturedCars;
    if (index === 1) {
      const filtered = this.allFeaturedCars.filter(c => /sedan|saloon/i.test(c.bodyType));
      return filtered.length ? filtered : this.allFeaturedCars;
    }
    if (index === 2) {
      const filtered = this.allFeaturedCars.filter(c =>
        /suv|crossover|pickup|truck|4x4|4wd/i.test(c.bodyType));
      return filtered.length ? filtered : this.allFeaturedCars;
    }
    if (index === 3) {
      const filtered = this.allFeaturedCars.filter(c =>
        c.priceValue >= 20_000_000 || /coupe|convertible|sport|grand|limousine/i.test(c.bodyType));
      return filtered.length ? filtered : this.allFeaturedCars;
    }
    return this.allFeaturedCars;
  }

  private advertToPromo(advert: Advert): Promo {
    const isHot = (advert.priority ?? 0) > 5;
    return {
      image: advert.images?.length
        ? this.advertService.imageUrl(advert.images[0])
        : 'assets/images/dashboard/banner-luxury-car.jpg',
      title: advert.title,
      subtitle:
        advert.description ||
        (advert.make
          ? `${advert.make} ${advert.model ?? ''} ${advert.year ?? ''}`.trim()
          : 'Discover this offer'),
      badgeIcon: isHot ? 'flash-outline' : 'pricetag-outline',
      badgeText: isHot ? 'HOT DEAL' : 'FEATURED',
      hasCountdown: false,
      buttonText: advert.price ? 'View Offer' : 'Learn More',
      route: '/tabs/auto',
      advertId: advert._id,
    };
  }

  private carToFeatured(car: Car): FeaturedCar {
    return {
      id: car._id,
      make: car.make,
      model: car.model,
      name: `${car.make} ${car.model}`,
      image: car.images?.length ? this.carService.imageUrl(car.images[0]) : '',
      km: car.mileage ? String(car.mileage) : '—',
      year: car.year,
      price: this.shortPrice(car.price),
      priceValue: car.price,
      isFavorite: false,
      bodyType: car.bodyType ?? '',
      _raw: car,
    };
  }

  private shortPrice(price: number): string {
    if (!price) return '0';
    if (price >= 1_000_000) return (price / 1_000_000).toFixed(1) + 'M';
    if (price >= 1_000) return (price / 1_000).toFixed(0) + 'K';
    return price.toString();
  }

  // ─── Search ───────────────────────────────────────────

  private setupSearch(): void {
    this.searchSub = this.searchSubject
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((q) => {
          if (!q.trim()) {
            this.searchResults = [];
            this.isSearchLoading = false;
            return EMPTY;
          }
          this.isSearchLoading = true;
          return this.carService.searchCars({ q, limit: 8 }).pipe(
            catchError(() => {
              this.isSearchLoading = false;
              return EMPTY;
            }),
          );
        }),
      )
      .subscribe((res) => {
        this.isSearchLoading = false;
        const raw: Car[] = Array.isArray(res?.data) ? res.data : [];
        this.searchResults = raw.filter((c) => c.verified === 'verified');
      });
  }

  activateSearch(): void {
    this.isSearchMode = true;
    setTimeout(() => this.searchFieldRef?.nativeElement?.focus(), 50);
  }

  deactivateSearch(): void {
    this.isSearchMode = false;
    this.searchQuery = '';
    this.searchResults = [];
    this.isSearchLoading = false;
  }

  onSearchFocus(): void {
    this.activateSearch();
  }

  onSearchChange(q: string): void {
    this.searchSubject.next(q);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.isSearchLoading = false;
    this.searchFieldRef?.nativeElement?.focus();
  }

  getCarImageUrl(car: Car): string {
    return this.carService.imageUrl(car.images![0]);
  }

  formatSearchPrice(car: Car): string {
    const p =
      car.forRent && car.rentalPrice ? car.rentalPrice : car.price;
    return this.shortPrice(p);
  }

  openSearchResult(car: Car): void {
    sessionStorage.setItem(
      'pendingCarNav',
      JSON.stringify({ car, isOwned: false, fromRoute: '/tabs/home' }),
    );
    this.router.navigate(['/cars/detail']);
  }

  // ─── Promo slider ─────────────────────────────────────

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
    const cardWidth = track.children[0]?.clientWidth || 1;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const index = Math.round(track.scrollLeft / (cardWidth + gap));
    if (
      index !== this.activePromoIndex &&
      index >= 0 &&
      index < this.promos.length
    ) {
      this.activePromoIndex = index;
      this.resetAutoSlide();
    }
  }

  onPromoClick(promo: Promo): void {
    if (promo.advertId) {
      this.advertService.trackClick(promo.advertId).subscribe();
    }
    this.navigateTo(promo.route);
  }

  // ─── Countdown ────────────────────────────────────────

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
    if (diff <= 0 && this.countdownInterval) clearInterval(this.countdownInterval);
  }

  // ─── Cars ─────────────────────────────────────────────

  selectCategory(index: number): void {
    this.activeCategoryIndex = index;
    this.featuredCars = this.filterByCategory(index);
  }

  toggleFavorite(car: FeaturedCar): void {
    car.isFavorite = !car.isFavorite;
  }

  openCarDetail(car: FeaturedCar): void {
    sessionStorage.setItem(
      'pendingCarNav',
      JSON.stringify({ car: car._raw, isOwned: false, fromRoute: '/tabs/home' }),
    );
    this.router.navigate(['/cars/detail']);
  }

  // ─── Other ────────────────────────────────────────────

  openMenu(): void {
    this.menuController.open('main-menu');
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  openFilters(): void {
    // TODO: open filter modal
  }

  viewAllCars(): void {
    this.navigateTo('/tabs/auto');
  }

  openNotifications(): void {
    // TODO
  }

  openWhatsApp(): void {
    const msg = `Hello, I have a general inquiry about DriveEase.`;
    window.open(`https://wa.me/237676541667?text=${encodeURIComponent(msg)}`, '_blank');
  }
}
