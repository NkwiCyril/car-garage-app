import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  carOutline,
  addOutline,
  pricetagOutline,
  keyOutline,
  trashOutline,
  homeOutline,
  chevronForward,
  refreshOutline,
} from 'ionicons/icons';
import { CarService } from '../../../core/services/car.service';
import { Car } from '../../../core/models/car.model';

@Component({
  selector: 'app-my-cars',
  templateUrl: './my-cars.page.html',
  styleUrls: ['./my-cars.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonSpinner,
  ],
})
export class MyCarsPage {
  // TODO: Populate from GET /api/cars/my once the endpoint is available.
  // Call loadMyCars() and replace the empty array with the API response.
  myCars: Car[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private carService: CarService,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {
    addIcons({
      carOutline,
      addOutline,
      pricetagOutline,
      keyOutline,
      trashOutline,
      homeOutline,
      chevronForward,
      refreshOutline,
    });
  }

  // ─── Navigation ──────────────────────────────────────

  goBack(): void {
    this.router.navigate(['/tabs/auto']);
  }

  goToAddCar(): void {
    this.router.navigate(['/cars/add']);
  }

  goToParkCar(): void {
    this.router.navigate(['/cars/park']);
  }

  openCarDetail(car: Car): void {
    this.router.navigate(['/cars/detail'], { state: { car, isOwned: true } });
  }

  // ─── Car Actions ─────────────────────────────────────

  async onCollectCar(car: Car): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Collect Car',
      message: `Collect ${this.getCarName(car)} from the garage?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Collect', handler: () => this.confirmCollect(car) },
      ],
    });
    await alert.present();
  }

  private confirmCollect(car: Car): void {
    this.carService.collectCar(car._id).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Car collected successfully!', 'success');
        this.myCars = this.myCars.filter((c) => c._id !== car._id);
      },
      error: (err) => this.showToast(err.message || 'Failed to collect car', 'danger'),
    });
  }

  async onListForSale(car: Car): Promise<void> {
    const alert = await this.alertController.create({
      header: 'List for Sale',
      message: `Enter the sale price for ${this.getCarName(car)} (CFA):`,
      inputs: [
        {
          name: 'price',
          type: 'number',
          placeholder: 'e.g. 18000000',
          min: 1,
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'List',
          handler: (data) => {
            const price = parseFloat(data.price);
            if (!price || price <= 0) {
              this.showToast('Please enter a valid price', 'warning');
              return false;
            }
            this.confirmListForSale(car, price);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  private confirmListForSale(car: Car, price: number): void {
    this.carService.sellCar(car._id, price).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Car listed for sale!', 'success');
        const idx = this.myCars.findIndex((c) => c._id === car._id);
        if (idx !== -1) this.myCars[idx] = { ...this.myCars[idx], forSale: true, price };
      },
      error: (err) => this.showToast(err.message || 'Failed to list car for sale', 'danger'),
    });
  }

  async onListForRent(car: Car): Promise<void> {
    const alert = await this.alertController.create({
      header: 'List for Rent',
      message: `Enter the daily rental price for ${this.getCarName(car)} (CFA/day):`,
      inputs: [
        {
          name: 'rentalPrice',
          type: 'number',
          placeholder: 'e.g. 25000',
          min: 1,
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'List',
          handler: (data) => {
            const rentalPrice = parseFloat(data.rentalPrice);
            if (!rentalPrice || rentalPrice <= 0) {
              this.showToast('Please enter a valid daily price', 'warning');
              return false;
            }
            this.confirmListForRent(car, rentalPrice);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  private confirmListForRent(car: Car, rentalPrice: number): void {
    this.carService.listCarForRent(car._id, rentalPrice).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Car listed for rent!', 'success');
        const idx = this.myCars.findIndex((c) => c._id === car._id);
        if (idx !== -1) this.myCars[idx] = { ...this.myCars[idx], forRent: true, rentalPrice };
      },
      error: (err) => this.showToast(err.message || 'Failed to list car for rent', 'danger'),
    });
  }

  async onDeleteCar(car: Car): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete Car',
      message: `Are you sure you want to remove ${this.getCarName(car)} from your account? This cannot be undone.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          cssClass: 'alert-danger-btn',
          handler: () => this.confirmDelete(car),
        },
      ],
    });
    await alert.present();
  }

  private confirmDelete(car: Car): void {
    this.carService.deleteCar(car._id).subscribe({
      next: (res) => {
        this.showToast(res.message || 'Car removed successfully', 'success');
        this.myCars = this.myCars.filter((c) => c._id !== car._id);
      },
      error: (err) => this.showToast(err.message || 'Failed to delete car', 'danger'),
    });
  }

  // ─── Helpers ─────────────────────────────────────────

  getCarName(car: Car): string {
    return `${car.year ?? ''} ${car.make ?? ''} ${car.model ?? ''}`.trim();
  }

  getFirstImage(car: Car): string | null {
    return car.images && car.images.length > 0
      ? this.carService.imageUrl(car.images[0])
      : null;
  }

  getStatusLabel(car: Car): string {
    if (car.forSale) return 'For Sale';
    if (car.forRent) return 'For Rent';
    if (car.inGarage || car.status === 'parked') return 'In Garage';
    return 'Private';
  }

  getStatusClass(car: Car): string {
    if (car.forSale) return 'status-sale';
    if (car.forRent) return 'status-rent';
    if (car.inGarage || car.status === 'parked') return 'status-garage';
    return 'status-normal';
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
