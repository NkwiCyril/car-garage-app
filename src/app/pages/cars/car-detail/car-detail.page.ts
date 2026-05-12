import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, ToastController, ViewWillEnter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  locationOutline,
  carOutline,
  carSportOutline,
  keyOutline,
  bagHandleOutline,
  colorPaletteOutline,
  speedometerOutline,
  settingsOutline,
  calendarOutline,
  flameOutline,
  businessOutline,
  chatbubbleOutline,
  heartOutline,
  heart,
  createOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  bookmarkOutline,
  bookmark,
  pricetagOutline,
  chevronBackOutline,
  chevronForwardOutline,
  star,
  logoWhatsapp,
  alertCircle,
  shareSocialOutline,
} from 'ionicons/icons';
import { environment } from '../../../../environments/environment';
import { Car } from '../../../core/models/car.model';
import { CarService } from '../../../core/services/car.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthPromptService } from '../../../core/services/auth-prompt.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

interface SimilarCar {
  id: string;
  name: string;
  image: string;
  year: number;
  price: string;
}

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
  imports: [CommonModule, IonContent, IonIcon, TranslatePipe],
})
export class CarDetailPage implements OnInit, ViewWillEnter {
  @ViewChild('imgTrack') imgTrackRef!: ElementRef<HTMLElement>;

  car: Car | null = null;
  isOwned = false;
  isWishlisted = false;
  activeImageIndex = 0;
  similarCars: SimilarCar[] = [];
  private fromRoute: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private carService: CarService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    private authPrompt: AuthPromptService,
    private toastController: ToastController,
  ) {
    addIcons({
      arrowBackOutline,
      locationOutline,
      carOutline,
      carSportOutline,
      keyOutline,
      bagHandleOutline,
      colorPaletteOutline,
      speedometerOutline,
      settingsOutline,
      calendarOutline,
      flameOutline,
      businessOutline,
      chatbubbleOutline,
      heartOutline,
      heart,
      createOutline,
      checkmarkCircle,
      checkmarkCircleOutline,
      bookmarkOutline,
      bookmark,
      pricetagOutline,
      chevronBackOutline,
      chevronForwardOutline,
      star,
      logoWhatsapp,
      alertCircle,
      shareSocialOutline,
    });
  }

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    const sharedId = this.route.snapshot.queryParamMap.get('id');
    const raw = sessionStorage.getItem('pendingCarNav') ?? localStorage.getItem('carDetailState');

    if (raw && (!sharedId || this.matchesId(raw, sharedId))) {
      const nav = JSON.parse(raw);
      this.car = nav.car ?? null;
      this.isOwned = nav.isOwned ?? false;
      this.fromRoute = nav.fromRoute ?? null;
      sessionStorage.removeItem('pendingCarNav');
      localStorage.setItem('carDetailState', raw);
      this.refreshWishlistFlag();
    } else if (sharedId) {
      this.loadCarFromShareLink(sharedId);
    }
  }

  private matchesId(rawState: string, id: string): boolean {
    try {
      return JSON.parse(rawState)?.car?._id === id;
    } catch { return false; }
  }

  private loadCarFromShareLink(id: string): void {
    this.carService.getCarById(id).subscribe({
      next: (res) => {
        const car = (res?.data as Car) ?? null;
        if (!car) return;
        this.car = car;
        this.isOwned = false;
        this.fromRoute = '/tabs/auto';
        localStorage.setItem(
          'carDetailState',
          JSON.stringify({ car, isOwned: false, fromRoute: this.fromRoute }),
        );
        this.refreshWishlistFlag();
      },
      error: async (err: Error) => {
        const toast = await this.toastController.create({
          message: err.message || 'We couldn’t load that vehicle.',
          duration: 2500,
          position: 'top',
          color: 'danger',
        });
        await toast.present();
      },
    });
  }

  private refreshWishlistFlag(): void {
    if (!this.car || this.isOwned || !this.authService.isLoggedIn) return;
    this.wishlistService.getWishlist().subscribe({
      next: (ids) => { this.isWishlisted = ids.includes(this.car!._id); },
      error: () => {},
    });
  }

  goBack(): void {
    localStorage.removeItem('carDetailState');
    const fallback = this.isOwned ? '/cars/my' : '/tabs/auto';
    this.router.navigate([this.fromRoute ?? fallback]);
  }

  toggleWishlist(): void {
    if (!this.car || this.isOwned) return;
    if (!this.authService.isLoggedIn) {
      this.authPrompt.requireAuth('Sign in to save vehicles to your wishlist', '/cars/detail');
      return;
    }
    const wasWishlisted = this.isWishlisted;
    this.isWishlisted = !wasWishlisted;

    const op$ = wasWishlisted
      ? this.wishlistService.remove(this.car._id)
      : this.wishlistService.add(this.car._id);

    op$.subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
          duration: 2000,
          position: 'top',
          color: wasWishlisted ? 'medium' : 'success',
        });
        await toast.present();
      },
      error: async () => {
        this.isWishlisted = wasWishlisted;
        const toast = await this.toastController.create({
          message: 'Failed to update wishlist',
          duration: 2500,
          position: 'top',
          color: 'danger',
        });
        await toast.present();
      },
    });
  }

  selectImage(index: number): void {
    this.activeImageIndex = index;
    const track = this.imgTrackRef?.nativeElement;
    if (track) {
      track.scrollTo({ left: index * track.offsetWidth, behavior: 'smooth' });
    }
  }

  prevImage(): void {
    const total = this.getAllImages().length;
    this.selectImage((this.activeImageIndex - 1 + total) % total);
  }

  nextImage(): void {
    const total = this.getAllImages().length;
    this.selectImage((this.activeImageIndex + 1) % total);
  }

  onImgScroll(): void {
    const track = this.imgTrackRef?.nativeElement;
    if (!track) return;
    const total = this.getAllImages().length;
    const index = Math.round(track.scrollLeft / track.offsetWidth);
    this.activeImageIndex = Math.max(0, Math.min(index, total - 1));
  }

  getCarName(): string {
    console.log("CAR DETAILS: ", this.car);
    if (!this.car) return '';
    return `${this.car.make ?? ''} ${this.car.model ?? ''}`.trim();
  }

  getConditionLabel(): string {
    if (!this.car?.condition) return '';
    const map: Record<string, string> = {
      new: 'New',
      'like-new': 'Like New',
      used: 'Used',
    };
    return map[this.car.condition] ?? this.car.condition;
  }

  getTransmission(): string {
    if (!this.car?.transmission) return '';
    return (
      this.car.transmission.charAt(0).toUpperCase() +
      this.car.transmission.slice(1)
    );
  }

  getFirstImage(): string | null {
    const images = this.getAllImages();
    return images.length > 0
      ? images[this.activeImageIndex] ?? images[0]
      : null;
  }

  getAllImages(): string[] {
    return (this.car?.images ?? []).map((f) => this.carService.imageUrl(f));
  }

  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toLocaleString('fr-CM');
  }

  getSellerName(): string {
    return this.car?.owner?.name || this.car?.dealerName || 'Private Seller';
  }

  getMileage(): string {
    const m = this.car?.mileage;
    if (m === undefined || m === null) return '';
    if (typeof m === 'number') return m.toLocaleString('fr-CM') + ' km';
    return m;
  }

  buildShareUrl(): string {
    const id = this.car?._id ?? '';
    const base = (environment.shareBaseUrl?.trim()) || window.location.origin;
    return `${base.replace(/\/$/, '')}/cars/detail?id=${encodeURIComponent(id)}`;
  }

  async share(): Promise<void> {
    if (!this.car) return;
    const url = this.buildShareUrl();
    const name = this.getCarName();
    const yearPrefix = this.car.year ? `${this.car.year} ` : '';
    const title = `${yearPrefix}${name} on DriveEase`;
    const priceVal = this.car.forRent && !this.car.forSale && this.car.rentalPrice
      ? this.car.rentalPrice
      : this.car.price;
    const unit = this.car.forRent && !this.car.forSale ? '/day' : '';
    const text = `Check out this ${yearPrefix}${name} for ${this.formatPrice(priceVal)} XAF${unit} on DriveEase.`;

    const nav = navigator as any;
    if (nav.share) {
      try {
        await nav.share({ title, text, url });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return; // user cancelled
        // fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      const toast = await this.toastController.create({
        message: 'Link copied to clipboard',
        duration: 1800,
        position: 'top',
        color: 'success',
      });
      await toast.present();
    } catch {
      const toast = await this.toastController.create({
        message: `Share this link: ${url}`,
        duration: 4000,
        position: 'top',
        color: 'medium',
      });
      await toast.present();
    }
  }

  messageSeller(): void {
    if (!this.car) return;
    const name = this.getCarName();
    const price = this.formatPrice(
      this.car.forRent && this.car.rentalPrice ? this.car.rentalPrice : this.car.price,
    );
    const unit = this.car.forRent && !this.car.forSale ? '/day' : '';
    const yearPrefix = this.car.year ? `${this.car.year} ` : '';
    const msg =
      `Hello, I'm interested in the ${yearPrefix}${name} listed for ${price} FCFA${unit} on DriveEase. Is it still available?`;
    window.open(`https://wa.me/237676541667?text=${encodeURIComponent(msg)}`, '_blank');
  }

  viewDealer(): void {
    if (!this.car) return;
    sessionStorage.setItem('pendingDealerNav', JSON.stringify({
      dealerName: this.getSellerName(),
      location: this.car.location || '',
      ownerId: this.car.owner?._id || this.car.ownerId || '',
      phone: this.car.owner?.phone || '',
      isVerified: this.car.isVerified !== false,
      fromRoute: '/cars/detail',
    }));
    sessionStorage.setItem('pendingCarNav', JSON.stringify({
      car: this.car,
      isOwned: this.isOwned,
      fromRoute: this.fromRoute,
    }));
    this.router.navigate(['/profile/dealer']);
  }

  onCta(): void {
    if (this.isOwned) {
      if (this.car) {
        sessionStorage.setItem('pendingCarEdit', JSON.stringify(this.car));
      }
      this.router.navigate(['/cars/edit']);
    } else {
      this.toggleWishlist();
    }
  }

  openSimilarCar(_car: SimilarCar): void {}
}
