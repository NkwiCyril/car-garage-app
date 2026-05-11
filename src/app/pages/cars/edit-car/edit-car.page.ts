import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  checkmarkOutline,
  carOutline,
  informationCircleOutline,
  trashOutline,
  cameraOutline,
  closeOutline,
  refreshOutline,
} from 'ionicons/icons';
import { CarService } from '../../../core/services/car.service';
import { Car } from '../../../core/models/car.model';

interface EditCarForm {
  make: string;
  model: string;
  year: number | null;
  price: number | null;
  rentalPrice: number | null;
  mileage: number;
  condition: 'new' | 'like-new' | 'used' | '';
  transmission: 'automatic' | 'manual' | '';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid' | '';
  color: string;
  vin: string;
  description: string;
  location: string;
  forSale: boolean;
  forRent: boolean;
}

@Component({
  selector: 'app-edit-car',
  templateUrl: './edit-car.page.html',
  styleUrls: ['./edit-car.page.scss'],
  imports: [CommonModule, FormsModule, IonContent, IonIcon],
})
export class EditCarPage {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  car: Car | null = null;
  isSaving = false;

  existingImages: string[] = [];
  imagesToRemove = new Set<string>();
  pendingFiles: File[] = [];
  pendingPreviews: string[] = [];

  readonly MAX_IMAGES = 5;

  form: EditCarForm = {
    make: '',
    model: '',
    year: null,
    price: null,
    rentalPrice: null,
    mileage: 0,
    condition: '',
    transmission: '',
    fuelType: '',
    color: '',
    vin: '',
    description: '',
    location: '',
    forSale: false,
    forRent: false,
  };

  readonly conditions: Array<{ value: EditCarForm['condition']; label: string }> = [
    { value: 'new', label: 'Brand New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'used', label: 'Used' },
  ];

  readonly transmissions: Array<{ value: EditCarForm['transmission']; label: string }> = [
    { value: 'automatic', label: 'Automatic' },
    { value: 'manual', label: 'Manual' },
  ];

  readonly fuelTypes: Array<{ value: EditCarForm['fuelType']; label: string }> = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  constructor(
    private router: Router,
    private carService: CarService,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {
    addIcons({
      arrowBackOutline, checkmarkOutline, carOutline,
      informationCircleOutline, trashOutline,
      cameraOutline, closeOutline, refreshOutline,
    });
  }

  ionViewWillEnter(): void {
    const raw = sessionStorage.getItem('pendingCarEdit');
    if (raw) {
      this.car = JSON.parse(raw) as Car;
      sessionStorage.removeItem('pendingCarEdit');
      this.populateForm(this.car);
      this.existingImages = [...(this.car.images ?? [])];
      this.imagesToRemove.clear();
      this.pendingFiles = [];
      this.pendingPreviews.forEach(url => URL.revokeObjectURL(url));
      this.pendingPreviews = [];
    }
  }

  private populateForm(car: Car): void {
    this.form = {
      make: car.make ?? '',
      model: car.model ?? '',
      year: car.year ?? null,
      price: car.price ?? null,
      rentalPrice: car.rentalPrice ?? null,
      mileage: typeof car.mileage === 'string' ? parseFloat(car.mileage) || 0 : (car.mileage ?? 0),
      condition: (car.condition as EditCarForm['condition']) ?? '',
      transmission: (car.transmission as EditCarForm['transmission']) ?? '',
      fuelType: ((car as any).fuelType as EditCarForm['fuelType']) ?? '',
      color: car.color ?? '',
      vin: car.vin ?? '',
      description: car.description ?? '',
      location: car.location ?? '',
      forSale: car.forSale ?? false,
      forRent: car.forRent ?? false,
    };
  }

  get carName(): string {
    if (!this.car) return 'Edit Listing';
    return `${this.car.year ?? ''} ${this.car.make ?? ''} ${this.car.model ?? ''}`.trim();
  }

  get descLength(): number {
    return this.form.description?.length ?? 0;
  }

  get totalImages(): number {
    const kept = this.existingImages.filter(f => !this.imagesToRemove.has(f)).length;
    return kept + this.pendingFiles.length;
  }

  getImageUrl(filename: string): string {
    return this.carService.imageUrl(filename);
  }

  isMarkedForRemoval(filename: string): boolean {
    return this.imagesToRemove.has(filename);
  }

  toggleRemoveExisting(filename: string): void {
    if (this.imagesToRemove.has(filename)) {
      this.imagesToRemove.delete(filename);
    } else {
      this.imagesToRemove.add(filename);
    }
  }

  removePending(index: number): void {
    URL.revokeObjectURL(this.pendingPreviews[index]);
    this.pendingFiles.splice(index, 1);
    this.pendingPreviews.splice(index, 1);
  }

  openFilePicker(): void {
    this.fileInputRef?.nativeElement.click();
  }

  onFilesPicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const files = Array.from(input.files);
    const remaining = this.MAX_IMAGES - this.totalImages;
    files.slice(0, Math.max(0, remaining)).forEach(f => {
      this.pendingFiles.push(f);
      this.pendingPreviews.push(URL.createObjectURL(f));
    });
    input.value = '';
  }

  async saveChanges(): Promise<void> {
    if (!this.car || this.isSaving) return;
    this.isSaving = true;

    const payload: Partial<any> = {
      make: this.form.make,
      model: this.form.model,
      year: this.form.year,
      price: this.form.price,
      rentalPrice: this.form.rentalPrice || undefined,
      mileage: this.form.mileage,
      condition: this.form.condition || undefined,
      transmission: this.form.transmission || undefined,
      fuelType: this.form.fuelType || undefined,
      color: this.form.color,
      vin: this.form.vin,
      description: this.form.description,
      location: this.form.location,
      forSale: this.form.forSale,
      forRent: this.form.forRent,
    };

    this.carService.updateCar(this.car._id, payload).subscribe({
      next: async (res) => {
        if (!res.success) {
          this.isSaving = false;
          this.showToast(res.message || 'Update failed', 'danger');
          return;
        }
        const updated: Car = { ...this.car!, ...(res.data as Car) };
        await this.applyImageChanges(this.car!._id);
        this.isSaving = false;
        sessionStorage.setItem('pendingCarEdit_refresh', JSON.stringify(updated));
        this.showToast('Listing updated successfully', 'success');
        setTimeout(() => this.router.navigate(['/cars/my']), 1200);
      },
      error: (err) => {
        this.isSaving = false;
        this.showToast(err.message || 'Failed to update listing', 'danger');
      },
    });
  }

  private async applyImageChanges(carId: string): Promise<void> {
    const removes = Array.from(this.imagesToRemove);
    if (removes.length > 0) {
      await Promise.all(
        removes.map(f =>
          firstValueFrom(
            this.carService.removeCarImage(carId, f).pipe(catchError(() => of(null))),
          ),
        ),
      );
    }
    if (this.pendingFiles.length > 0) {
      const fd = new FormData();
      this.pendingFiles.forEach(f => fd.append('images', f));
      await firstValueFrom(
        this.carService.addCarImages(carId, fd).pipe(catchError(() => of(null))),
      );
    }
  }

  async confirmDeleteListing(): Promise<void> {
    if (!this.car) return;
    const alert = await this.alertController.create({
      header: 'Remove Listing',
      message: `Permanently remove <strong>${this.carName}</strong>? This action cannot be undone.`,
      cssClass: 'alert-danger',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          cssClass: 'alert-btn-danger',
          handler: () => this.deleteListing(),
        },
      ],
    });
    await alert.present();
  }

  private deleteListing(): void {
    if (!this.car) return;
    this.carService.deleteCar(this.car._id).subscribe({
      next: () => {
        sessionStorage.setItem('listings_needsRefresh', '1');
        this.showToast('Listing removed', 'success');
        setTimeout(() => this.router.navigate(['/tabs/auto']), 900);
      },
      error: (err) => this.showToast(err.message || 'Failed to delete', 'danger'),
    });
  }

  goBack(): void {
    this.router.navigate(['/cars/my']);
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
