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
import { AuthService } from '../../../core/services/auth.service';
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
  saleCars: Car[] = [];
  rentCars: Car[] = [];
  isLoading = false;

  get totalCount(): number {
    const ids = new Set([...this.saleCars, ...this.rentCars].map(c => c._id));
    return ids.size;
  }

  get isEmpty(): boolean {
    return !this.isLoading && this.saleCars.length === 0 && this.rentCars.length === 0;
  }

  constructor(
    private router: Router,
    private carService: CarService,
    private authService: AuthService,
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

  ionViewWillEnter(): void {
    this.loadMyCars();
  }

  private loadMyCars(): void {
    const userId = this.authService.currentUser?.id;
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
        this.removeFromLists(car._id);
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
        const updated = { ...car, forSale: true, price };
        this.patchInLists(car._id, updated);
        if (!this.saleCars.find((c) => c._id === car._id)) {
          this.saleCars = [updated, ...this.saleCars];
        }
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
        const updated = { ...car, forRent: true, rentalPrice };
        this.patchInLists(car._id, updated);
        if (!this.rentCars.find((c) => c._id === car._id)) {
          this.rentCars = [updated, ...this.rentCars];
        }
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
        this.removeFromLists(car._id);
      },
      error: (err) => this.showToast(err.message || 'Failed to delete car', 'danger'),
    });
  }

  // ─── List helpers ─────────────────────────────────────

  private removeFromLists(id: string): void {
    this.saleCars = this.saleCars.filter((c) => c._id !== id);
    this.rentCars = this.rentCars.filter((c) => c._id !== id);
  }

  private patchInLists(id: string, updated: Car): void {
    const patch = (arr: Car[]) => arr.map((c) => c._id === id ? updated : c);
    this.saleCars = patch(this.saleCars);
    this.rentCars = patch(this.rentCars);
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
