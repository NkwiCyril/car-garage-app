import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  locationOutline,
  carOutline,
  carSportOutline,
  keyOutline,
  bagHandleOutline,
  colorPaletteOutline,
  speedometerOutline,
  settingsOutline,
  starOutline,
  star,
  createOutline,
  checkmarkCircleOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { Car } from '../../../core/models/car.model';

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class CarDetailPage implements OnInit {
  car: Car | null = null;
  isOwned = false;

  constructor(private router: Router) {
    addIcons({
      arrowBackOutline,
      locationOutline,
      carOutline,
      carSportOutline,
      keyOutline,
      bagHandleOutline,
      colorPaletteOutline,
      speedometerOutline,
      settingsOutline,
      starOutline,
      star,
      createOutline,
      checkmarkCircleOutline,
      informationCircleOutline,
    });
  }

  ngOnInit(): void {
    const state = history.state;
    this.car = state?.car ?? null;
    this.isOwned = state?.isOwned ?? false;
  }

  goBack(): void {
    this.router.navigate([history.state?.fromRoute ?? (this.isOwned ? '/cars/my' : '/tabs/auto')]);
  }

  getCarName(): string {
    if (!this.car) return '';
    return `${this.car.year ?? ''} ${this.car.make ?? ''} ${this.car.model ?? ''}`.trim();
  }

  getConditionLabel(): string {
    if (!this.car?.condition) return '';
    const map: Record<string, string> = { 'new': 'New', 'like-new': 'Like New', 'used': 'Used' };
    return map[this.car.condition] ?? this.car.condition;
  }

  getTransmission(): string {
    if (!this.car?.transmission) return '';
    return this.car.transmission.charAt(0).toUpperCase() + this.car.transmission.slice(1);
  }

  getFirstImage(): string | null {
    return this.car?.images && this.car.images.length > 0 ? this.car.images[0] : null;
  }

  getAllImages(): string[] {
    return this.car?.images ?? [];
  }

  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toLocaleString('fr-CM');
  }

  get ctaLabel(): string {
    if (this.isOwned) return 'Manage Car';
    if (this.car?.listingType === 'rent') return 'Book Now';
    if (this.car?.listingType === 'sale') return 'Buy Now';
    return 'Contact Seller';
  }

  get ctaClass(): string {
    if (this.isOwned) return 'cta-manage';
    if (this.car?.listingType === 'rent') return 'cta-rent';
    if (this.car?.listingType === 'sale') return 'cta-buy';
    return 'cta-contact';
  }

  onCta(): void {
    if (this.isOwned) {
      this.router.navigate(['/cars/my']);
    }
    // Rent/buy flows to be wired when booking/purchase screens are built
  }
}
