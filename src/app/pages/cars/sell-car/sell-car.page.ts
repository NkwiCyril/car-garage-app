import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  checkmarkOutline,
  checkmarkCircle,
  addOutline,
  cameraOutline,
  documentTextOutline,
  cloudUploadOutline,
  lockClosedOutline,
  informationCircleOutline,
  alertCircleOutline,
  chevronDownOutline,
  carOutline,
  speedometerOutline,
  settingsOutline,
  flameOutline,
  rocketOutline,
  timeOutline,
  listOutline,
  homeOutline,
  closeOutline,
} from 'ionicons/icons';
import { CarService } from '../../../core/services/car.service';

const DRAFT_KEY = 'sc_listing_draft';

interface SellListing {
  make: string;
  model: string;
  year: number;
  mileage: number;
  transmission: 'automatic' | 'manual';
  fuelType: string;
  color: string;
  bodyType: string;
  vin: string;
  price: number;
  description: string;
}

interface PhotoSlot {
  file: File | null;
  preview: string | null;
}

interface DocumentItem {
  key: string;
  label: string;
  desc: string;
  file: File | null;
  status: 'pending' | 'uploaded';
}

@Component({
  selector: 'app-sell-car',
  templateUrl: './sell-car.page.html',
  styleUrls: ['./sell-car.page.scss'],
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonSpinner],
})
export class SellCarPage implements OnInit {
  step = 1;
  readonly totalSteps = 5;
  isSubmitting = false;

  readonly defaultFuelType = 'Petrol';

  listing: SellListing = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    transmission: 'automatic',
    fuelType: this.defaultFuelType,
    color: '',
    bodyType: 'SUV',
    vin: '',
    price: 0,
    description: '',
  };

  photoSlotLabels = ['MAIN COVER', 'SIDE VIEW', 'INTERIOR', 'DETAIL', 'RIMS', 'EXTRA'];
  photos: PhotoSlot[] = Array.from({ length: 6 }, () => ({ file: null, preview: null }));
  private activePhotoSlot: number | null = null;

  documents: DocumentItem[] = [
    { key: 'carteGrise',       label: 'Carte Grise',       desc: 'Required for official registration manifest',  file: null, status: 'pending' },
    { key: 'customs',          label: 'Customs Document',  desc: 'Clearance proof for imported vehicles',        file: null, status: 'pending' },
    { key: 'ownerId',          label: 'Owner ID',          desc: 'Valid Passport or National Identity Card',     file: null, status: 'pending' },
    { key: 'salesCertificate', label: 'Sales Certificate', desc: 'Proof of acquisition or purchase agreement',   file: null, status: 'pending' },
  ];

  makes = [
    'Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Audi', 'Porsche', 'Land Rover',
    'Ford', 'Volkswagen', 'Peugeot', 'Renault', 'Hyundai', 'Kia', 'Chevrolet',
    'Nissan', 'Lexus', 'Jeep', 'Volvo', 'Range Rover', 'Mazda',
  ];
  years: number[] = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);
  fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'];
  colors    = ['Black', 'White', 'Silver', 'Grey', 'Red', 'Blue', 'Green', 'Brown', 'Obsidian Black', 'GT Silver Metallic', 'Pearl White'];
  bodyTypes = ['SUV', 'Sedan', 'Hatchback', 'Coupe', 'Pickup', 'Van', 'Wagon', 'Convertible', 'Sports'];

  constructor(
    private router: Router,
    private carService: CarService,
    private toastController: ToastController,
  ) {
    addIcons({
      arrowBackOutline, arrowForwardOutline, checkmarkOutline, checkmarkCircle,
      addOutline, cameraOutline, documentTextOutline, cloudUploadOutline,
      lockClosedOutline, informationCircleOutline, alertCircleOutline,
      chevronDownOutline, carOutline, speedometerOutline, settingsOutline,
      flameOutline, rocketOutline, timeOutline, listOutline, homeOutline,
      closeOutline,
    });
  }

  ngOnInit(): void {
    this.restoreDraft();
  }

  // ─── Draft persistence ───────────────────────────────

  private saveDraft(): void {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(this.listing));
    } catch {}
  }

  private restoreDraft(): void {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<SellListing>;
        this.listing = { ...this.listing, ...saved };
        if (!this.listing.fuelType || !this.fuelTypes.includes(this.listing.fuelType)) {
          this.listing.fuelType = this.defaultFuelType;
        }
      }
    } catch {}
  }

  private clearDraft(): void {
    localStorage.removeItem(DRAFT_KEY);
  }

  // ─── Computed getters ────────────────────────────────

  get stepProgress(): number[] {
    return Array.from({ length: this.totalSteps }, (_, i) => i + 1);
  }

  get stepTitle(): string {
    const t: Record<number, string> = {
      1: 'Car Details', 2: 'Upload Photos', 3: 'Verify Ownership',
      4: 'Set Price', 5: 'Review & Submit',
    };
    return t[this.step] ?? '';
  }

  get stepSubtitle(): string {
    const s: Record<number, string> = {
      2: 'Upload clear high-quality photos of the car you are listing for sale.',
      3: 'Upload clear digital copies of your vehicle documents to ensure a secure transaction.',
      4: 'Set a competitive price and describe your vehicle to attract premium buyers.',
      5: 'Review your listing details carefully before submitting for verification.',
    };
    return s[this.step] ?? '';
  }

  get ctaLabel(): string {
    if (this.isSubmitting) return 'Submitting…';
    const l: Record<number, string> = {
      1: 'Next: Photos', 2: 'Next: Verification', 3: 'Next: Pricing',
      4: 'Next: Review', 5: 'Submit Listing',
    };
    return l[this.step] ?? 'Next';
  }

  get reviewCarName(): string {
    return `${this.listing.year} ${this.listing.make} ${this.listing.model}`.trim();
  }

  get uploadedPhotoCount(): number {
    return this.photos.filter((p) => p.file !== null).length;
  }

  get uploadedDocCount(): number {
    return this.documents.filter((d) => d.status === 'uploaded').length;
  }

  // ─── Navigation ──────────────────────────────────────

  goBack(): void {
    if (this.step > 1) {
      this.step--;
    } else {
      this.router.navigate(['/tabs/auto']);
    }
  }

  next(): void {
    this.saveDraft();
    if (this.step < this.totalSteps) {
      this.step++;
      window.scrollTo(0, 0);
    } else {
      this.submitListing();
    }
  }

  // ─── API submission ──────────────────────────────────

  private submitListing(): void {
    this.isSubmitting = true;
    const formData = this.buildFormData();

    this.carService.addCar(formData).subscribe({
      next: () => {
        this.clearDraft();
        this.isSubmitting = false;
        this.step = 6;
      },
      error: (err: Error) => {
        this.isSubmitting = false;
        this.showToast(err.message || 'Failed to submit listing. Please try again.', 'danger');
      },
    });
  }

  private buildFormData(): FormData {
    const fd = new FormData();
    fd.append('make', this.listing.make);
    fd.append('model', this.listing.model);
    fd.append('year', String(this.listing.year));
    fd.append('price', String(this.listing.price));
    fd.append('mileage', String(this.listing.mileage));
    fd.append('transmission', this.listing.transmission);
    fd.append('fuelType', this.mapFuelType(this.listing.fuelType));
    fd.append('forSale', 'true');
    fd.append('condition', 'used');
    if (this.listing.vin) fd.append('vin', this.listing.vin);
    if (this.listing.color) fd.append('color', this.listing.color);
    if (this.listing.bodyType) fd.append('bodyType', this.listing.bodyType);
    if (this.listing.description) fd.append('description', this.listing.description);
    this.photos.forEach((p) => {
      if (p.file) fd.append('images', p.file, p.file.name);
    });
    return fd;
  }

  private mapFuelType(fuel: string): string {
    const map: Record<string, string> = {
      'Petrol': 'petrol',
      'Diesel': 'diesel',
      'Hybrid': 'hybrid',
      'Electric': 'electric',
      'LPG': 'petrol',
    };
    return map[fuel] ?? fuel.toLowerCase();
  }

  // ─── Photo slots ─────────────────────────────────────

  triggerPhotoSlot(index: number): void {
    this.activePhotoSlot = index;
    (document.getElementById('scPhotoInput') as HTMLInputElement)?.click();
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || this.activePhotoSlot === null) return;
    const file = input.files[0];
    const idx = this.activePhotoSlot;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.photos[idx] = { file, preview: e.target?.result as string };
    };
    reader.readAsDataURL(file);
    input.value = '';
    this.activePhotoSlot = null;
  }

  onDropZoneFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    Array.from(input.files).forEach((file) => {
      const emptyIdx = this.photos.findIndex((p) => p.file === null);
      if (emptyIdx < 0) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photos[emptyIdx] = { file, preview: e.target?.result as string };
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removePhoto(index: number, event: Event): void {
    event.stopPropagation();
    this.photos[index] = { file: null, preview: null };
  }

  // ─── Document slots ──────────────────────────────────

  triggerDocInput(key: string): void {
    (document.getElementById('docInput_' + key) as HTMLInputElement)?.click();
  }

  onDocumentSelected(event: Event, doc: DocumentItem): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    doc.file = input.files[0];
    doc.status = 'uploaded';
    input.value = '';
  }

  // ─── Helpers ─────────────────────────────────────────

  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toLocaleString('fr-CM');
  }

  goToMyListings(): void {
    this.router.navigate(['/cars/my']);
  }

  returnHome(): void {
    this.router.navigate(['/tabs/home']);
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      position: 'top',
      color,
    });
    await toast.present();
  }
}
