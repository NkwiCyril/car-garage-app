import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonInput,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cloudUploadOutline,
  closeOutline,
  chevronDownOutline,
} from 'ionicons/icons';
import { CarService } from '../../../core/services/car.service';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.page.html',
  styleUrls: ['./add-car.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonInput,
    IonSpinner,
  ],
})
export class AddCarPage implements OnDestroy {
  make = '';
  model = '';
  yearStr = '';
  priceStr = '';
  condition = '';
  transmission = '';
  color = '';
  mileageStr = '';
  description = '';
  listingType = 'normal';

  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  isLoading = false;

  readonly currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private carService: CarService,
    private toastController: ToastController,
  ) {
    addIcons({ cloudUploadOutline, closeOutline, chevronDownOutline });
  }

  ngOnDestroy(): void {
    this.imagePreviews.forEach((url) => URL.revokeObjectURL(url));
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const incoming = Array.from(input.files);
    const combined = [...this.selectedFiles, ...incoming].slice(0, 5);
    this.selectedFiles = combined;
    this.imagePreviews = combined.map((f) => URL.createObjectURL(f));
    input.value = '';
  }

  removeImage(index: number): void {
    URL.revokeObjectURL(this.imagePreviews[index]);
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  async submit(): Promise<void> {
    const error = this.getValidationError();
    if (error) {
      await this.showToast(error, 'warning');
      return;
    }

    const year = parseInt(this.yearStr, 10);
    const price = parseFloat(this.priceStr);

    const formData = new FormData();
    formData.append('make', this.make.trim());
    formData.append('model', this.model.trim());
    formData.append('year', year.toString());
    formData.append('price', price.toString());
    formData.append('condition', this.condition);
    formData.append('transmission', this.transmission);
    formData.append('listingType', this.listingType);
    if (this.color.trim()) formData.append('color', this.color.trim());
    if (this.mileageStr.trim()) formData.append('mileage', this.mileageStr.trim());
    if (this.description.trim()) formData.append('description', this.description.trim());
    this.selectedFiles.forEach((f) => formData.append('images', f));

    this.isLoading = true;
    this.carService.addCar(formData).subscribe({
      next: async (res) => {
        this.isLoading = false;
        await this.showToast(res.message || 'Car added successfully!', 'success');
        this.router.navigate(['/cars/my']);
      },
      error: async (err) => {
        this.isLoading = false;
        await this.showToast(err.message || 'Failed to add car', 'danger');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/tabs/auto']);
  }

  private getValidationError(): string | null {
    if (!this.make.trim()) return 'Please enter the car make';
    if (!this.model.trim()) return 'Please enter the car model';
    const year = parseInt(this.yearStr, 10);
    if (!this.yearStr || isNaN(year) || year < 1950 || year > this.currentYear + 1) {
      return `Please enter a valid year (1950–${this.currentYear + 1})`;
    }
    const price = parseFloat(this.priceStr);
    if (!this.priceStr || isNaN(price) || price <= 0) {
      return 'Please enter a valid price greater than 0';
    }
    if (!this.condition) return 'Please select the car condition';
    if (!this.transmission) return 'Please select the transmission type';
    return null;
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
