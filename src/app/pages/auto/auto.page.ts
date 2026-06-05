import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  ModalController,
  ToastController,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { parsePage } from '../../core/utils/pagination.util';
import { FiltersSheet, FilterState } from './filters/filters.sheet';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  carOutline,
  carSportOutline,
  keyOutline,
  bagHandleOutline,
  addOutline,
  refreshOutline,
  optionsOutline,
  heartOutline,
  heart,
  logoWhatsapp,
  shieldCheckmarkOutline,
  cameraOutline,
  documentTextOutline,
  pricetagOutline,
  arrowForwardOutline,
  eyeOutline,
  pencilOutline,
  timeOutline,
  searchOutline,
  closeOutline,
} from 'ionicons/icons';
import { CarService } from '../../core/services/car.service';
import { AuthService } from '../../core/services/auth.service';
import { AuthPromptService } from '../../core/services/auth-prompt.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Car } from '../../core/models/car.model';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

interface SellStep {
  title: string;
  desc: string;
  icon: string;
}

@Component({
  selector: 'app-auto',
  templateUrl: './auto.page.html',
  styleUrls: ['./auto.page.scss'],
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonSpinner, IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent, TranslatePipe],
})
export class AutoPage implements OnInit, OnDestroy, ViewWillEnter {
  activeTab: 'buy' | 'rent' | 'sell' = 'buy';

  // Base car lists loaded on init (paginated per tab)
  buyCars: Car[] = [];
  rentCars: Car[] = [];
  isLoadingAvailable = false;
  private buyPage = 1;
  private rentPage = 1;
  private buyHasMore = true;
  private rentHasMore = true;
  readonly PAGE_SIZE = 20;

  // Search / filter results (also paginated)
  filteredCars: Car[] = [];
  isFiltered = false;
  isSearchLoading = false;
  private filteredPage = 1;
  private filteredHasMore = false;
  private lastSearchParams: any = null;

  // Search
  searchQuery = '';
  private searchSubject = new Subject<void>();
  private searchSub!: Subscription;

  // Filters from FiltersSheet
  activeFilters: FilterState | null = null;

  // Wishlist
  wishlistedIds: Set<string> = new Set();

  // Track images that failed to load so the placeholder shows instead
  brokenImageIds: Set<string> = new Set();

  // Sell tab
  myListings: Car[] = [];
  isLoadingMyListings = false;
  private myListingsLoaded = false;

  sellSteps: SellStep[] = [
    { title: 'auto.step1.title', desc: 'auto.step1.desc', icon: 'car-outline' },
    { title: 'auto.step2.title', desc: 'auto.step2.desc', icon: 'camera-outline' },
    { title: 'auto.step3.title', desc: 'auto.step3.desc', icon: 'document-text-outline' },
    { title: 'auto.step4.title', desc: 'auto.step4.desc', icon: 'pricetag-outline' },
  ];

  constructor(
    private router: Router,
    private carService: CarService,
    private authService: AuthService,
    private authPrompt: AuthPromptService,
    private wishlistService: WishlistService,
    private toastController: ToastController,
    private modalController: ModalController,
  ) {
    addIcons({
      locationOutline, carOutline, carSportOutline, keyOutline, bagHandleOutline,
      addOutline, refreshOutline, optionsOutline, heartOutline, heart, logoWhatsapp,
      shieldCheckmarkOutline, cameraOutline, documentTextOutline, pricetagOutline,
      arrowForwardOutline, eyeOutline, pencilOutline, timeOutline, searchOutline, closeOutline,
    });
  }

  ngOnInit(): void {
    this.setupSearch();
    this.loadAvailableCars();
    this.loadWishlist();
  }

  ionViewWillEnter(): void {
    if (sessionStorage.getItem('listings_needsRefresh')) {
      sessionStorage.removeItem('listings_needsRefresh');
      this.myListingsLoaded = false;
    }
    if (this.activeTab === 'sell' && !this.myListingsLoaded) {
      this.loadMyListings();
    }
    this.loadWishlist();
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  // ─── Pull to refresh ─────────────────────────────────

  onRefresh(event: CustomEvent): void {
    this.brokenImageIds.clear();
    if (this.activeTab === 'sell') {
      this.myListingsLoaded = false;
      this.loadMyListings();
    } else {
      this.loadAvailableCars();
      if (this.isFiltered) this.runQuery();
    }
    this.loadWishlist();
    setTimeout(() => (event.target as HTMLIonRefresherElement)?.complete(), 600);
  }

  // ─── Computed ────────────────────────────────────────

  get displayCars(): Car[] {
    const base = this.isFiltered
      ? this.filteredCars
      : this.activeTab === 'rent' ? this.rentCars : this.buyCars;
    return this.applyClientFilters(base);
  }

  get isLoading(): boolean {
    return this.isLoadingAvailable || this.isSearchLoading;
  }

  get hasActiveFilters(): boolean {
    if (!this.activeFilters) return false;
    const f = this.activeFilters;
    const priceDefault = f.priceRange.lower <= 10_000_000 && f.priceRange.upper >= 250_000_000;
    return f.brands.length > 0 || !!f.year || !!f.transmission || !!f.fuelType || !priceDefault;
  }

  // ─── Data loading ────────────────────────────────────

  // Marketplace browse surface — non-premium cars only.
  //
  // The dedicated /cars/marketplace endpoint is currently broken on the backend
  // (returns no cars even when non-premium listings exist), so we pull from the
  // catch-all /cars/available and apply a `premiumVerified !== true` filter in
  // the client. Premium-verified listings remain in the dashboard's Featured
  // rail (/cars/home); the marketplace must never surface them.
  //
  // Switch back to /cars/marketplace (drop the filter) once the backend ticket
  // is fixed — the segmentation invariant is unchanged.
  loadAvailableCars(): void {
    this.isLoadingAvailable = true;
    this.buyPage = 1;
    this.rentPage = 1;
    this.buyHasMore = true;
    this.rentHasMore = true;
    let done = 0;
    const finish = () => { if (++done >= 2) this.isLoadingAvailable = false; };

    this.carService.getAvailableCars({ forRent: true, page: 1, limit: this.PAGE_SIZE }).subscribe({
      next: (res) => {
        const { items, meta } = parsePage<Car>(res, 1, this.PAGE_SIZE);
        this.rentCars = this.excludePremium(items);
        this.rentHasMore = meta.hasMore;
        finish();
      },
      error: (err) => { finish(); this.showToast(err.message || 'Failed to load rental cars', 'danger'); },
    });

    this.carService.getAvailableCars({ forSale: true, page: 1, limit: this.PAGE_SIZE }).subscribe({
      next: (res) => {
        const { items, meta } = parsePage<Car>(res, 1, this.PAGE_SIZE);
        this.buyCars = this.excludePremium(items);
        this.buyHasMore = meta.hasMore;
        finish();
      },
      error: (err) => { finish(); this.showToast(err.message || 'Failed to load cars for sale', 'danger'); },
    });
  }

  // The single source of truth for the "no premium in marketplace" rule.
  // Cars with premiumVerified !== true (false, undefined, or missing) pass
  // through; explicitly-premium ones are dropped.
  private excludePremium(cars: Car[]): Car[] {
    return cars.filter((c) => c.premiumVerified !== true);
  }

  // ─── Infinite scroll ─────────────────────────────────

  get canLoadMore(): boolean {
    if (this.activeTab === 'sell') return false;
    if (this.isFiltered) return this.filteredHasMore;
    return this.activeTab === 'rent' ? this.rentHasMore : this.buyHasMore;
  }

  loadMore(event: CustomEvent): void {
    const target = event.target as HTMLIonInfiniteScrollElement;
    if (!this.canLoadMore) {
      target.complete();
      return;
    }

    if (this.isFiltered) {
      this.filteredPage += 1;
      const params = { ...this.lastSearchParams, page: this.filteredPage, limit: this.PAGE_SIZE };
      this.carService.searchCars(params).subscribe({
        next: (res) => {
          const { items, meta } = parsePage<Car>(res, this.filteredPage, this.PAGE_SIZE);
          this.filteredCars = [...this.filteredCars, ...this.excludePremium(items)];
          this.filteredHasMore = meta.hasMore;
          target.complete();
        },
        error: () => { this.filteredPage -= 1; target.complete(); },
      });
      return;
    }

    if (this.activeTab === 'rent') {
      this.rentPage += 1;
      this.carService.getAvailableCars({ forRent: true, page: this.rentPage, limit: this.PAGE_SIZE }).subscribe({
        next: (res) => {
          const { items, meta } = parsePage<Car>(res, this.rentPage, this.PAGE_SIZE);
          this.rentCars = [...this.rentCars, ...this.excludePremium(items)];
          this.rentHasMore = meta.hasMore;
          target.complete();
        },
        error: () => { this.rentPage -= 1; target.complete(); },
      });
    } else {
      this.buyPage += 1;
      this.carService.getAvailableCars({ forSale: true, page: this.buyPage, limit: this.PAGE_SIZE }).subscribe({
        next: (res) => {
          const { items, meta } = parsePage<Car>(res, this.buyPage, this.PAGE_SIZE);
          this.buyCars = [...this.buyCars, ...this.excludePremium(items)];
          this.buyHasMore = meta.hasMore;
          target.complete();
        },
        error: () => { this.buyPage -= 1; target.complete(); },
      });
    }
  }

  loadMyListings(): void {
    const user = this.authService.currentUser;
    const userId = user?._id || user?.id;
    if (!userId) return;
    this.isLoadingMyListings = true;
    this.myListingsLoaded = false;

    forkJoin({
      sale: this.carService.getUserCarsForSale(userId),
      rent: this.carService.getUserCarsForRent(userId),
    }).subscribe({
      next: ({ sale, rent }) => {
        const saleCars: Car[] = Array.isArray(sale.data) ? sale.data : [];
        const rentCars: Car[] = Array.isArray(rent.data) ? rent.data : [];
        const seen = new Set<string>();
        const combined: Car[] = [];
        for (const car of [...saleCars, ...rentCars]) {
          if (!seen.has(car._id)) { seen.add(car._id); combined.push(car); }
        }
        this.myListings = combined;
        this.isLoadingMyListings = false;
        this.myListingsLoaded = true;
      },
      error: (err) => {
        this.isLoadingMyListings = false;
        this.myListingsLoaded = true;
        this.showToast(err.message || 'Failed to load your listings', 'danger');
      },
    });
  }

  loadWishlist(): void {
    if (!this.authService.isLoggedIn) {
      this.wishlistedIds = new Set();
      return;
    }
    this.wishlistService.getWishlist().subscribe({
      next: (ids) => { this.wishlistedIds = new Set(ids); },
      error: () => {},
    });
  }

  // ─── Search ──────────────────────────────────────────

  private setupSearch(): void {
    this.searchSub = this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
    ).subscribe(() => this.runQuery());
  }

  onSearchChange(): void {
    this.searchSubject.next();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.runQuery();
  }

  // ─── Filters ─────────────────────────────────────────

  async openFilters(): Promise<void> {
    const modal = await this.modalController.create({
      component: FiltersSheet,
      initialBreakpoint: 1,
      breakpoints: [0, 1],
      handle: true,
      cssClass: 'filters-modal',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<FilterState>();
    if (role === 'apply' && data) {
      this.activeFilters = data;
      this.runQuery();
    }
  }

  clearFilters(): void {
    this.activeFilters = null;
    this.runQuery();
  }

  // ─── Core query runner ───────────────────────────────

  private runQuery(): void {
    const q = this.searchQuery.trim();
    const hasApiFilters = this.activeFilters
      ? this.activeFilters.brands.length > 0
        || !!this.activeFilters.year
        || this.activeFilters.priceRange.lower > 10_000_000
        || this.activeFilters.priceRange.upper < 250_000_000
      : false;

    if (!q && !hasApiFilters) {
      this.isFiltered = false;
      this.filteredCars = [];
      this.filteredHasMore = false;
      this.lastSearchParams = null;
      return;
    }

    this.isSearchLoading = true;
    this.isFiltered = true;
    this.filteredPage = 1;

    const baseParams: Parameters<CarService['searchCars']>[0] = {};
    if (this.activeTab === 'buy') baseParams.forSale = true;
    if (this.activeTab === 'rent') baseParams.forRent = true;
    if (q) baseParams.q = q;

    if (this.activeFilters) {
      const f = this.activeFilters;
      if (f.brands.length > 0) baseParams.make = f.brands[0];
      if (f.priceRange.lower > 10_000_000) baseParams.priceMin = f.priceRange.lower;
      if (f.priceRange.upper < 250_000_000) baseParams.priceMax = f.priceRange.upper;
      const { yearMin, yearMax } = this.parseYear(f.year);
      if (yearMin) baseParams.yearMin = yearMin;
      if (yearMax) baseParams.yearMax = yearMax;
    }

    this.lastSearchParams = baseParams;
    const params = { ...baseParams, page: 1, limit: this.PAGE_SIZE };

    this.carService.searchCars(params).subscribe({
      next: (res) => {
        const { items, meta } = parsePage<Car>(res, 1, this.PAGE_SIZE);
        this.filteredCars = this.excludePremium(items);
        this.filteredHasMore = meta.hasMore;
        this.isSearchLoading = false;
      },
      error: () => {
        this.isSearchLoading = false;
        this.filteredHasMore = false;
      },
    });
  }

  private parseYear(year: string): { yearMin?: number; yearMax?: number } {
    if (!year) return {};
    if (year === 'Before 2014') return { yearMax: 2013 };
    const m = year.match(/(\d{4})\s*[–-]\s*(\d{4})/);
    if (m) return { yearMin: parseInt(m[1], 10), yearMax: parseInt(m[2], 10) };
    return {};
  }

  private applyClientFilters(cars: Car[]): Car[] {
    if (!this.activeFilters) return cars;
    const { transmission, fuelType } = this.activeFilters;
    return cars.filter((c) => {
      if (transmission && c.transmission !== transmission) return false;
      if (fuelType && c.fuelType !== fuelType) return false;
      return true;
    });
  }


  // ─── Tab ─────────────────────────────────────────────

  onTabChange(tab: 'buy' | 'rent' | 'sell'): void {
    if (tab === 'sell' && !this.authService.isLoggedIn) {
      this.authPrompt.requireAuth('Sign in to sell or list your vehicles', '/tabs/auto');
      return;
    }
    this.activeTab = tab;
    if (tab === 'sell') {
      if (!this.myListingsLoaded) this.loadMyListings();
      return;
    }
    // Re-run query for new tab context (forSale/forRent changes)
    this.runQuery();
  }

  // ─── Wishlist ────────────────────────────────────────

  isWishlisted(car: Car): boolean {
    return this.wishlistedIds.has(car._id);
  }

  isOwned(car: Car): boolean {
    const user = this.authService.currentUser;
    const userId = user?._id || user?.id;
    return !!userId && (car.owner?._id === userId || car.ownerId === userId);
  }

  toggleWishlist(car: Car): void {
    if (!this.authService.isLoggedIn) {
      this.authPrompt.requireAuth('Sign in to save vehicles to your wishlist', '/tabs/auto');
      return;
    }
    const id = car._id;
    if (this.wishlistedIds.has(id)) {
      this.wishlistedIds.delete(id);
      this.wishlistService.remove(id).subscribe({
        error: () => this.wishlistedIds.add(id),
      });
    } else {
      this.wishlistedIds.add(id);
      this.wishlistService.add(id).subscribe({
        error: () => this.wishlistedIds.delete(id),
      });
    }
  }

  // ─── Car helpers ─────────────────────────────────────

  openCarDetail(car: Car): void {
    sessionStorage.setItem(
      'pendingCarNav',
      JSON.stringify({ car, isOwned: false, fromRoute: '/tabs/auto' }),
    );
    this.router.navigate(['/cars/detail']);
  }

  openOwnedCarDetail(car: Car): void {
    sessionStorage.setItem(
      'pendingCarNav',
      JSON.stringify({ car, isOwned: true, fromRoute: '/tabs/auto' }),
    );
    this.router.navigate(['/cars/detail']);
  }

  getCarName(car: Car): string {
    return `${car.make ?? ''} ${car.model ?? ''}`.trim();
  }

  getTransmission(car: Car): string {
    if (!car.transmission) return '';
    return car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1);
  }

  getFirstImage(car: Car): string | null {
    return car.images?.length ? this.carService.imageUrl(car.images[0]) : null;
  }

  onCarImgError(carId: string): void {
    this.brokenImageIds.add(carId);
  }

  hasImage(car: Car): boolean {
    return !!this.getFirstImage(car) && !this.brokenImageIds.has(car._id);
  }

  formatPrice(price: number): string {
    if (!price) return '0';
    if (price >= 1_000_000) return (price / 1_000_000).toFixed(0) + 'M';
    return price.toLocaleString('fr-CM');
  }

  getStatusLabel(car: Car): string {
    const status = (car as any).status;
    if (status === 'sold') return 'SOLD';
    if (status === 'review') return 'IN REVIEW';
    if (car.forSale || car.forRent) return 'ACTIVE';
    return '';
  }

  getStatusClass(car: Car): string {
    const status = (car as any).status;
    if (status === 'sold') return 'sold';
    if (status === 'review') return 'review';
    return 'active';
  }

  isInReview(car: Car): boolean {
    return (car as any).status === 'review';
  }

  padStep(n: number): string {
    return n.toString().padStart(2, '0');
  }

  // ─── Navigation ──────────────────────────────────────

  onAddCar(): void {
    if (!this.authPromptOk('Sign in to add a vehicle', '/cars/add')) return;
    this.router.navigate(['/cars/add']);
  }

  onStartListing(): void {
    if (!this.authPromptOk('Sign in to list a vehicle for sale', '/cars/sell')) return;
    this.router.navigate(['/cars/sell']);
  }

  goToMyListings(): void {
    if (!this.authPromptOk('Sign in to view your listings', '/cars/my')) return;
    this.router.navigate(['/cars/my']);
  }

  private authPromptOk(message: string, returnUrl: string): boolean {
    if (this.authService.isLoggedIn) return true;
    this.authPrompt.requireAuth(message, returnUrl);
    return false;
  }

  openWhatsApp(): void {
    const msg = `Hello, I have an inquiry about the DriveEase auto marketplace.`;
    window.open(`https://wa.me/237676541667?text=${encodeURIComponent(msg)}`, '_blank');
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color,
    });
    await toast.present();
  }
}
