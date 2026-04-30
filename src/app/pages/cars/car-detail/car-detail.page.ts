import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
} from 'ionicons/icons';
import { Car } from '../../../core/models/car.model';
import { CarService } from '../../../core/services/car.service';
import { WishlistService } from '../../../core/services/wishlist.service';
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
    private carService: CarService,
    private wishlistService: WishlistService,
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
    });
  }

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    const raw = sessionStorage.getItem('pendingCarNav') ?? localStorage.getItem('carDetailState');
    if (raw) {
      const nav = JSON.parse(raw);
      this.car = nav.car ?? null;
      this.isOwned = nav.isOwned ?? false;
      this.fromRoute = nav.fromRoute ?? null;
      sessionStorage.removeItem('pendingCarNav');
      // Persist so a hard refresh still shows the car
      localStorage.setItem('carDetailState', raw);

      if (this.car && !this.isOwned) {
        this.wishlistService.getWishlist().subscribe({
          next: (ids) => { this.isWishlisted = ids.includes(this.car!._id); },
          error: () => {},
        });
      }
    }
  }

  goBack(): void {
    localStorage.removeItem('carDetailState');
    const fallback = this.isOwned ? '/cars/my' : '/tabs/auto';
    this.router.navigate([this.fromRoute ?? fallback]);
  }

  toggleWishlist(): void {
    if (!this.car || this.isOwned) return;
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
