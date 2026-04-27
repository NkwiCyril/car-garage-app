import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  ToastController,
  ViewWillEnter,
} from '@ionic/angular/standalone';
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
} from 'ionicons/icons';
import { CarService } from '../../core/services/car.service';
import { AuthService } from '../../core/services/auth.service';
import { Car } from '../../core/models/car.model';

interface SellStep {
  title: string;
  desc: string;
  icon: string;
}

@Component({
  selector: 'app-auto',
  templateUrl: './auto.page.html',
  styleUrls: ['./auto.page.scss'],
  imports: [CommonModule, IonContent, IonIcon, IonSpinner],
})
export class AutoPage implements OnInit, ViewWillEnter {
  activeTab: 'buy' | 'rent' | 'sell' = 'buy';
  activeFilterIndex: number = -1;

  isLoadingAvailable = false;
  rentCars: Car[] = [];
  buyCars: Car[] = [];
  favoritedIds: Set<string> = new Set();

  myListings: Car[] = [];
  isLoadingMyListings = false;
  private myListingsLoaded = false;

  filterOptions = ['SUV', 'Sedan', 'Luxury', 'Sports', 'Pickup'];

  sellSteps: SellStep[] = [
    {
      title: 'Car Details',
      desc: 'VIN, mileage, and specific technical features.',
      icon: 'car-outline',
    },
    {
      title: 'Photos',
      desc: 'High-resolution exterior and interior gallery.',
      icon: 'camera-outline',
    },
    {
      title: 'Documents',
      desc: 'Registration and service history verification.',
      icon: 'document-text-outline',
    },
    {
      title: 'Price & Description',
      desc: 'Market analysis and your personal storytelling.',
      icon: 'pricetag-outline',
    },
  ];

  constructor(
    private router: Router,
    private carService: CarService,
    private authService: AuthService,
    private toastController: ToastController,
  ) {
    addIcons({
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
    });
  }

  ngOnInit(): void {
    this.loadAvailableCars();
  }

  ionViewWillEnter(): void {
    if (this.activeTab === 'sell') {
      this.loadMyListings();
    }
  }

  get currentCars(): Car[] {
    return this.activeTab === 'rent' ? this.rentCars : this.buyCars;
  }

  padStep(n: number): string {
    return n.toString().padStart(2, '0');
  }

  loadAvailableCars(): void {
    this.isLoadingAvailable = true;
    let completed = 0;
    const onComplete = () => {
      if (++completed >= 2) this.isLoadingAvailable = false;
    };

    this.carService.getAvailableCars({ forRent: true }).subscribe({
      next: (response) => {
        this.rentCars = this.extractCars(response);
        onComplete();
      },
      error: (err) => {
        onComplete();
        this.showToast(err.message || 'Failed to load rental cars', 'danger');
      },
    });

    this.carService.getAvailableCars({ forSale: true }).subscribe({
      next: (response) => {
        this.buyCars = this.extractCars(response);
        onComplete();
      },
      error: (err) => {
        onComplete();
        this.showToast(err.message || 'Failed to load cars for sale', 'danger');
      },
    });
  }

  loadMyListings(): void {
    const userId = this.authService.currentUser?.id;
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
          if (!seen.has(car._id)) {
            seen.add(car._id);
            combined.push(car);
          }
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

  private extractCars(response: any): Car[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.cars)) return response.cars;
    if (Array.isArray(response.results)) return response.results;
    return [];
  }

  onTabChange(tab: 'buy' | 'rent' | 'sell'): void {
    this.activeTab = tab;
    this.activeFilterIndex = -1;
    if (tab === 'sell' && !this.myListingsLoaded) {
      this.loadMyListings();
    }
  }

  selectFilter(index: number): void {
    this.activeFilterIndex = this.activeFilterIndex === index ? -1 : index;
  }

  openFilters(): void {
    // TODO: open full filter modal
  }

  toggleFavorite(car: Car): void {
    const id = (car as any)._id || (car as any).id || '';
    if (this.favoritedIds.has(id)) {
      this.favoritedIds.delete(id);
    } else {
      this.favoritedIds.add(id);
    }
  }

  isFavorited(car: Car): boolean {
    const id = (car as any)._id || (car as any).id || '';
    return this.favoritedIds.has(id);
  }

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

  onAddCar(): void {
    this.router.navigate(['/cars/add']);
  }

  onStartListing(): void {
    this.router.navigate(['/cars/sell']);
  }

  getCarName(car: Car): string {
    return `${car.make ?? ''} ${car.model ?? ''}`.trim();
  }

  getTransmission(car: Car): string {
    if (!car.transmission) return '';
    return car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1);
  }

  getFirstImage(car: Car): string | null {
    return car.images && car.images.length > 0
      ? this.carService.imageUrl(car.images[0])
      : null;
  }

  formatPrice(price: number): string {
    if (!price) return '0';
    if (price >= 1000000) {
      return (price / 1000).toFixed(0) + 'K';
    }
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

  goToMyListings(): void {
    this.router.navigate(['/cars/my']);
  }

  openWhatsApp(): void {
    window.open('https://wa.me/237XXXXXXXXX', '_blank');
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
