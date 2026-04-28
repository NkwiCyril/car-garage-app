import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonRange, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, refreshOutline, chevronDownOutline } from 'ionicons/icons';

export interface FilterState {
  priceRange: { lower: number; upper: number };
  brands: string[];
  year: string;
  transmission: 'automatic' | 'manual' | null;
  fuelType: 'petrol' | 'diesel' | 'electric' | null;
}

@Component({
  selector: 'app-filters-sheet',
  templateUrl: './filters.sheet.html',
  styleUrls: ['./filters.sheet.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonIcon, IonRange],
})
export class FiltersSheet {
  readonly priceMin = 10_000_000;
  readonly priceMax = 250_000_000;
  readonly priceStep = 5_000_000;

  priceRange = { lower: this.priceMin, upper: this.priceMax };

  readonly brands = [
    'Toyota', 'Mercedes-Benz', 'BMW', 'Land Rover', 'Lexus', 'Porsche',
    'Honda', 'Audi', 'Kia', 'Hyundai',
  ];
  selectedBrands: Set<string> = new Set();

  readonly yearOptions = [
    '2022 – 2024', '2020 – 2021', '2017 – 2019', '2014 – 2016', 'Before 2014',
  ];
  selectedYear = '';

  transmission: 'automatic' | 'manual' | null = null;
  fuelType: 'petrol' | 'diesel' | 'electric' | null = null;

  constructor(private modalCtrl: ModalController) {
    addIcons({ closeOutline, refreshOutline, chevronDownOutline });
  }

  onPriceChange(event: CustomEvent): void {
    this.priceRange = event.detail.value as { lower: number; upper: number };
  }

  toggleBrand(brand: string): void {
    this.selectedBrands.has(brand)
      ? this.selectedBrands.delete(brand)
      : this.selectedBrands.add(brand);
  }

  isBrandSelected(brand: string): boolean {
    return this.selectedBrands.has(brand);
  }

  setTransmission(val: 'automatic' | 'manual'): void {
    this.transmission = this.transmission === val ? null : val;
  }

  setFuelType(val: 'petrol' | 'diesel' | 'electric'): void {
    this.fuelType = this.fuelType === val ? null : val;
  }

  formatPrice(value: number): string {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(0) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K';
    return value.toString();
  }

  formatFull(value: number): string {
    return value.toLocaleString('fr-CM');
  }

  get priceSummary(): string {
    const lo = this.formatPrice(this.priceRange.lower);
    const hi = this.priceRange.upper >= this.priceMax
      ? this.formatPrice(this.priceMax) + '+'
      : this.formatPrice(this.priceRange.upper);
    return `${lo} – ${hi}`;
  }

  reset(): void {
    this.priceRange = { lower: this.priceMin, upper: this.priceMax };
    this.selectedBrands.clear();
    this.selectedYear = '';
    this.transmission = null;
    this.fuelType = null;
  }

  apply(): void {
    const state: FilterState = {
      priceRange: { ...this.priceRange },
      brands: Array.from(this.selectedBrands),
      year: this.selectedYear,
      transmission: this.transmission,
      fuelType: this.fuelType,
    };
    this.modalCtrl.dismiss(state, 'apply');
  }

  close(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }
}
