import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
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
} from 'ionicons/icons';

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
  imports: [CommonModule, FormsModule, IonContent, IonIcon],
})
export class SellCarPage implements OnInit {
  step = 1;
  readonly totalSteps = 5;

  listing: SellListing = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    transmission: 'automatic',
    fuelType: 'Petrol',
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

  constructor(private router: Router) {
    addIcons({
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
    });
  }

  ngOnInit(): void {}

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
    const l: Record<number, string> = {
      1: 'Next: Photos', 2: 'Next: Verification', 3: 'Review Listing',
      4: 'Next: Pricing', 5: 'Submit Listing',
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

  goBack(): void {
    if (this.step > 1) {
      this.step--;
    } else {
      this.router.navigate(['/tabs/auto']);
    }
  }

  next(): void {
    if (this.step < this.totalSteps) {
      this.step++;
      window.scrollTo(0, 0);
    } else {
      this.submitListing();
    }
  }

  private submitListing(): void {
    // TODO: build FormData and call CarService
    this.step = 6;
  }

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
}
