import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
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
  calendarOutline,
  flameOutline,
  businessOutline,
  chatbubbleOutline,
  heartOutline,
  heart,
  createOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  bookmarkOutline,
  bookmark,
} from 'ionicons/icons';
import { Car } from '../../../core/models/car.model';
import { CarService } from '../../../core/services/car.service';

interface SimilarCar {
  id: string;
  name: string;
  image: string;
  year: number;
  price: string;
}

@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class CarDetailPage implements OnInit, ViewWillEnter {
  car: Car | null = null;
  isOwned = false;
  isBookmarked = false;
  activeImageIndex = 0;
  similarCars: SimilarCar[] = [];
  private fromRoute: string | null = null;

  constructor(private router: Router, private carService: CarService) {
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
      calendarOutline,
      flameOutline,
      businessOutline,
      chatbubbleOutline,
      heartOutline,
      heart,
      createOutline,
      checkmarkCircle,
      checkmarkCircleOutline,
      bookmarkOutline,
      bookmark,
    });
  }

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    const raw = sessionStorage.getItem('pendingCarNav');
    if (raw) {
      const nav = JSON.parse(raw);
      this.car = nav.car ?? null;
      this.isOwned = nav.isOwned ?? false;
      this.fromRoute = nav.fromRoute ?? null;
      sessionStorage.removeItem('pendingCarNav');
    }
    if (this.car) {
      this.loadSimilarCars();
    }
  }

  goBack(): void {
    const fallback = this.isOwned ? '/cars/my' : '/tabs/auto';
    this.router.navigate([this.fromRoute ?? fallback]);
  }

  toggleBookmark(): void {
    this.isBookmarked = !this.isBookmarked;
  }

  selectImage(index: number): void {
    this.activeImageIndex = index;
  }

  getCarName(): string {
    if (!this.car) return '';
    return `${this.car.make ?? ''} ${this.car.model ?? ''}`.trim();
  }

  getConditionLabel(): string {
    if (!this.car?.condition) return '';
    const map: Record<string, string> = {
      new: 'New',
      'like-new': 'Like New',
      used: 'Used',
    };
    return map[this.car.condition] ?? this.car.condition;
  }

  getTransmission(): string {
    if (!this.car?.transmission) return '';
    return (
      this.car.transmission.charAt(0).toUpperCase() +
      this.car.transmission.slice(1)
    );
  }

  getFirstImage(): string | null {
    const images = this.getAllImages();
    return images.length > 0
      ? images[this.activeImageIndex] ?? images[0]
      : null;
  }

  getAllImages(): string[] {
    return (this.car?.images ?? []).map((f) => this.carService.imageUrl(f));
  }

  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toLocaleString('fr-CM');
  }

  get ctaLabel(): string {
    if (this.isOwned) return 'Manage Car';
    return 'Add to Wishlist';
  }

  messageSeller(): void {
    // TODO: open messaging flow
  }

  viewDealer(): void {
    // TODO: navigate to dealer profile
  }

  onCta(): void {
    if (this.isOwned) {
      this.router.navigate(['/cars/my']);
    }
  }

  openSimilarCar(car: SimilarCar): void {
    // TODO: navigate to similar car detail
  }

  private loadSimilarCars(): void {
    this.similarCars = [
      {
        id: 's1',
        name: 'Mercedes-AMG GT',
        image: 'assets/images/cars/amg-gt.png',
        year: 2023,
        price: '38,500,000',
      },
      {
        id: 's2',
        name: 'BMW M4 Competition',
        image: 'assets/images/cars/bmw-m4.png',
        year: 2022,
        price: '42,000,000',
      },
    ];
  }
}