import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  starOutline,
  star,
  carOutline,
  carSportOutline,
  keyOutline,
  bagHandleOutline,
  pricetagOutline,
  searchOutline,
  filterOutline,
  addOutline,
  refreshOutline,
  homeOutline,
} from 'ionicons/icons';
import { CarService } from '../../core/services/car.service';
import { Car } from '../../core/models/car.model';

@Component({
  selector: 'app-auto',
  templateUrl: './auto.page.html',
  styleUrls: ['./auto.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSpinner,
  ],
})
export class AutoPage implements OnInit {
  activeTab = 'garage';

  isLoadingAvailable = false;
  rentCars: Car[] = [];
  buyCars: Car[] = [];

  sellPlaceholder = {
    title: 'Sell Your Car',
    subtitle:
      'List your vehicle and reach thousands of potential buyers in Cameroon.',
    steps: [
      {
        icon: 'car-outline',
        label: 'Add car details',
        desc: 'Model, year, mileage, photos',
      },
      {
        icon: 'pricetag-outline',
        label: 'Set your price',
        desc: 'Competitive pricing suggestions',
      },
      {
        icon: 'star-outline',
        label: 'Get offers',
        desc: 'Connect with verified buyers',
      },
    ],
  };

  constructor(
    private router: Router,
    private carService: CarService,
    private toastController: ToastController,
  ) {
    addIcons({
      locationOutline,
      starOutline,
      star,
      carOutline,
      carSportOutline,
      keyOutline,
      bagHandleOutline,
      pricetagOutline,
      searchOutline,
      filterOutline,
      addOutline,
      refreshOutline,
      homeOutline,
    });
  }

  ngOnInit(): void {
    this.loadAvailableCars();
  }

  loadAvailableCars(): void {
    this.isLoadingAvailable = true;
    let completed = 0;
    const onComplete = () => {
      if (++completed >= 2) this.isLoadingAvailable = false;
    };

    console.log('[AutoPage] Loading rental cars — forRent=true');
    this.carService.getAvailableCars({ forRent: true }).subscribe({
      next: (response) => {
        console.log('[AutoPage] Rent response received:', response);
        this.rentCars = this.extractCars(response);
        console.log(
          '[AutoPage] rentCars extracted:',
          this.rentCars.length,
          this.rentCars,
        );
        onComplete();
      },
      error: (err) => {
        console.error('[AutoPage] Rent request error:', err);
        onComplete();
        this.showToast(err.message || 'Failed to load rental cars', 'danger');
      },
    });

    console.log('[AutoPage] Loading sale cars — forSale=true');
    this.carService.getAvailableCars({ forSale: true }).subscribe({
      next: (response) => {
        console.log('[AutoPage] Sale response received:', response);
        this.buyCars = this.extractCars(response);
        console.log(
          '[AutoPage] buyCars extracted:',
          this.buyCars.length,
          this.buyCars,
        );
        onComplete();
      },
      error: (err) => {
        console.error('[AutoPage] Sale request error:', err);
        onComplete();
        this.showToast(err.message || 'Failed to load cars for sale', 'danger');
      },
    });
  }

  private extractCars(response: any): Car[] {
    console.log(
      '[AutoPage] extractCars — response keys:',
      response ? Object.keys(response) : 'null/undefined',
    );
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.cars)) return response.cars;
    if (Array.isArray(response.results)) return response.results;
    console.warn(
      '[AutoPage] extractCars — no recognised array key in response, returning []',
    );
    return [];
  }

  onTabChange(event: any): void {
    this.activeTab = event.detail.value;
  }

  openCarDetail(car: Car): void {
    this.router.navigate(['/cars/detail'], { state: { car, isOwned: false } });
  }

  onAddCar(): void {
    this.router.navigate(['/cars/add']);
  }

  onParkCar(): void {
    this.router.navigate(['/cars/park']);
  }

  onListForSale(): void {
    this.router.navigate(['/cars/my']);
  }

  getCarName(car: Car): string {
    return `${car.year ?? ''} ${car.make ?? ''} ${car.model ?? ''}`.trim();
  }

  getTransmission(car: Car): string {
    if (!car.transmission) return '';
    return car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1);
  }

  getCondition(car: Car): string {
    const map: Record<string, string> = {
      new: 'New',
      'like-new': 'Like New',
      used: 'Used',
    };
    return car.condition ? (map[car.condition] ?? car.condition) : '';
  }

  getFirstImage(car: Car): string | null {
    return car.images && car.images.length > 0
      ? this.carService.imageUrl(car.images[0])
      : null;
  }

  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toLocaleString('fr-CM');
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
