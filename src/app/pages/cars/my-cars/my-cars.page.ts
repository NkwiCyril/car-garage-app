import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  carOutline,
  addOutline,
  bookmarkOutline,
  keyOutline,
  trashOutline,
  pricetagOutline,
  eyeOutline,
  pencilOutline,
  receiptOutline,
  locationOutline,
} from 'ionicons/icons';
import { CarService } from '../../../core/services/car.service';
import { AuthService } from '../../../core/services/auth.service';
import { Car } from '../../../core/models/car.model';

@Component({
  selector: 'app-my-cars',
  templateUrl: './my-cars.page.html',
  styleUrls: ['./my-cars.page.scss'],
  imports: [CommonModule, IonContent, IonIcon, IonSpinner],
})
export class MyCarsPage {
  saleCars: Car[] = [];
  rentCars: Car[] = [];
  isLoading = false;

  get allCars(): Car[] {
    const seen = new Set<string>();
    const combined: Car[] = [];
    for (const car of [...this.saleCars, ...this.rentCars]) {
      if (!seen.has(car._id)) {
        seen.add(car._id);
        combined.push(car);
      }
    }
    return combined;
  }

  get totalCount(): number {
    return this.allCars.length;
  }

  get isEmpty(): boolean {
    return !this.isLoading && this.allCars.length === 0;
  }

  get portfolioValue(): number {
    return this.allCars.reduce((sum, car) => sum + (car.price || 0), 0);
  }

  get portfolioDisplay(): string {
    const val = this.portfolioValue;
    if (val >= 1000000000) return (val / 1000000000).toFixed(1) + 'B';
    if (val >= 1000000) return Math.round(val / 1000000) + 'M';
    if (val >= 1000) return Math.round(val / 1000) + 'K';
    return val.toString();
  }

  constructor(
    private router: Router,
    private carService: CarService,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {
    addIcons({
      arrowBackOutline,
      carOutline,
      addOutline,
      bookmarkOutline,
      keyOutline,
      trashOutline,
      pricetagOutline,
      eyeOutline,
      pencilOutline,
      receiptOutline,
      locationOutline,
    });
  }

  ionViewWillEnter(): void {
    this.loadMyCars();
  }

  padNum(n: number): string {
    return n.toString().padStart(2, '0');
  }

  private loadMyCars(): void {
    const user = this.authService.currentUser;
    const userId = user?._id || user?.id;
    if (!userId) return;

    this.isLoading = true;
    forkJoin({
      sale: this.carService.getUserCarsForSale(userId),
      rent: this.carService.getUserCarsForRent(userId),
    }).subscribe({
      next: ({ sale, rent }) => {
        this.saleCars = Array.isArray(sale.data) ? sale.data : [];
        this.rentCars = Array.isArray(rent.data) ? rent.data : [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast(err.message || 'Failed to load your cars', 'danger');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/tabs/auto']);
  }

  onStartListing(): void {
    this.router.navigate(['/cars/sell']);
  }

  openCarDetail(car: Car): void {
    sessionStorage.setItem(
      'pendingCarNav',
      JSON.stringify({ car, isOwned: true, fromRoute: '/cars/my' }),
    );
    this.router.navigate(['/cars/detail']);
  }

  openEditListing(car: Car): void {
    sessionStorage.setItem('pendingCarEdit', JSON.stringify(car));
    this.router.navigate(['/cars/edit']);
  }

  getCarName(car: Car): string {
    return `${car.year ?? ''} ${car.make ?? ''} ${car.model ?? ''}`.trim();
  }

  getFirstImage(car: Car): string | null {
    return car.images && car.images.length > 0
      ? this.carService.imageUrl(car.images[0])
      : null;
  }

  getTransmission(car: Car): string {
    if (!car.transmission) return '';
    return car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1);
  }

  getFuelType(car: Car): string {
    return (car as any).fuelType || '';
  }

  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toLocaleString('fr-CM');
  }

  getStatusLabel(car: Car): string {
    if ((car as any).status === 'sold') return 'SOLD';
    if ((car as any).status === 'review') return 'AWAITING REVIEW';
    if (car.forSale || car.forRent) return 'ACTIVE';
    return '';
  }

  isInReview(car: Car): boolean {
    return (car as any).status === 'review';
  }

  getStatusClass(car: Car): string {
    if ((car as any).status === 'sold') return 'sold';
    if ((car as any).status === 'review') return 'review';
    return 'active';
  }

  getActionLabel(car: Car): string {
    if ((car as any).status === 'sold') return 'VIEW TRANSACTION';
    if ((car as any).status === 'review') return 'AWAITING REVIEW';
    return 'EDIT LISTING';
  }

  onCardAction(car: Car): void {
    if ((car as any).status === 'sold') {
      // TODO: navigate to transaction detail
      return;
    }
    // Edit listing flow
    this.openCarDetail(car);
  }

  async onDeleteCar(car: Car): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Remove Listing',
      message: `Remove ${this.getCarName(car)}? This cannot be undone.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Remove',
          handler: () => {
            this.carService.deleteCar(car._id).subscribe({
              next: () => {
                this.showToast('Listing removed', 'success');
                this.loadMyCars();
              },
              error: (err) => this.showToast(err.message || 'Failed', 'danger'),
            });
          },
        },
      ],
    });
    await alert.present();
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