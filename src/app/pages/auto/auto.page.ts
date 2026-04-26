import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  ToastController,
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
} from 'ionicons/icons';
import { CarService } from '../../core/services/car.service';
import { Car } from '../../core/models/car.model';

@Component({
  selector: 'app-auto',
  templateUrl: './auto.page.html',
  styleUrls: ['./auto.page.scss'],
  imports: [CommonModule, IonContent, IonIcon, IonSpinner],
})
export class AutoPage implements OnInit {
  activeTab: 'buy' | 'rent' = 'rent';
  activeFilterIndex: number = -1;

  isLoadingAvailable = false;
  rentCars: Car[] = [];
  buyCars: Car[] = [];
  favoritedIds: Set<string> = new Set();

  filterOptions = ['SUV', 'Sedan', 'Luxury', 'Sports', 'Pickup'];

  constructor(
    private router: Router,
    private carService: CarService,
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
    });
  }

  ngOnInit(): void {
    this.loadAvailableCars();
  }

  get currentCars(): Car[] {
    return this.activeTab === 'rent' ? this.rentCars : this.buyCars;
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

  private extractCars(response: any): Car[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.cars)) return response.cars;
    if (Array.isArray(response.results)) return response.results;
    return [];
  }

  onTabChange(tab: 'buy' | 'rent'): void {
    this.activeTab = tab;
    this.activeFilterIndex = -1;
  }

  selectFilter(index: number): void {
    this.activeFilterIndex = this.activeFilterIndex === index ? -1 : index;
    // TODO: filter cars by category
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
    sessionStorage.setItem('pendingCarNav', JSON.stringify({ car, isOwned: false, fromRoute: '/tabs/auto' }));
    this.router.navigate(['/cars/detail']);
  }
  onAddCar(): void {
    this.router.navigate(['/cars/add']);
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