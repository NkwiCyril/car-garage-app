import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonSpinner, ViewWillEnter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, heartOutline, heart, carOutline } from 'ionicons/icons';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CarService } from '../../../core/services/car.service';
import { Car } from '../../../core/models/car.model';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
  imports: [CommonModule, IonContent, IonIcon, IonSpinner],
})
export class WishlistPage implements ViewWillEnter {
  cars: Car[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private wishlistService: WishlistService,
    public carService: CarService,
  ) {
    addIcons({ arrowBackOutline, heartOutline, heart, carOutline });
  }

  ionViewWillEnter(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.wishlistService.getWishlistCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  getImage(car: Car): string | null {
    return car.images?.length ? this.carService.imageUrl(car.images[0]) : null;
  }

  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toLocaleString('fr-CM');
  }

  openCar(car: Car): void {
    sessionStorage.setItem(
      'pendingCarNav',
      JSON.stringify({ car, isOwned: false, fromRoute: '/tabs/profile' }),
    );
    this.router.navigate(['/cars/detail']);
  }

  remove(car: Car, event: Event): void {
    event.stopPropagation();
    const prev = [...this.cars];
    this.cars = this.cars.filter((c) => c._id !== car._id);
    this.wishlistService.remove(car._id).subscribe({
      error: () => {
        this.cars = prev;
      },
    });
  }

  explore(): void {
    this.router.navigate(['/tabs/auto']);
  }

  goBack(): void {
    this.router.navigate(['/tabs/profile']);
  }
}
