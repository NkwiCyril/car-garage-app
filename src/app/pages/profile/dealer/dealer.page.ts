import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  shareOutline,
  star,
  locationOutline,
  logoWhatsapp,
  callOutline,
  checkmarkCircle,
  carSportOutline,
} from 'ionicons/icons';
import { CarService } from '../../../core/services/car.service';
import { Car } from '../../../core/models/car.model';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

interface DealerInfo {
  dealerName: string;
  location: string;
  ownerId: string;
  isVerified: boolean;
  fromRoute?: string;
}

@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.page.html',
  styleUrls: ['./dealer.page.scss'],
  imports: [CommonModule, IonContent, IonIcon, IonSpinner, TranslatePipe],
})
export class DealerPage implements OnInit {
  dealer: DealerInfo = {
    dealerName: 'Seller',
    location: '',
    ownerId: '',
    isVerified: true,
  };

  dealerCars: Car[] = [];
  isLoading = false;
  private fromRoute = '/cars/detail';

  stats = { sold: 12, active: 0, years: 3 };

  constructor(
    private router: Router,
    private carService: CarService,
    public translationService: TranslationService,
  ) {
    addIcons({
      arrowBackOutline, shareOutline, star, locationOutline,
      logoWhatsapp, callOutline, checkmarkCircle, carSportOutline,
    });
  }

  ngOnInit(): void {
    const raw = sessionStorage.getItem('pendingDealerNav') ?? localStorage.getItem('dealerDetailState');
    if (raw) {
      const data = JSON.parse(raw);
      this.dealer = data;
      this.fromRoute = data.fromRoute ?? '/cars/detail';
      sessionStorage.removeItem('pendingDealerNav');
      // Persist so a hard refresh still shows the dealer
      localStorage.setItem('dealerDetailState', raw);
      if (this.dealer.ownerId) {
        this.loadInventory();
      }
    }
  }

  private loadInventory(): void {
    this.isLoading = true;
    const toArray = (res: any): Car[] => {
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      return data as Car[];
    };
    const sale$ = this.carService.getUserCarsForSale(this.dealer.ownerId).pipe(
      map(toArray), catchError(() => of([] as Car[])),
    );
    const rent$ = this.carService.getUserCarsForRent(this.dealer.ownerId).pipe(
      map(toArray), catchError(() => of([] as Car[])),
    );
    forkJoin([sale$, rent$]).subscribe(([sale, rent]) => {
      const seen = new Set<string>();
      const combined: Car[] = [];
      [...sale, ...rent].forEach(c => {
        if (!seen.has(c._id)) { seen.add(c._id); combined.push(c); }
      });
      this.dealerCars = combined;
      this.stats.active = combined.filter(c => c.isAvailable !== false).length;
      this.isLoading = false;
    });
  }

  goBack(): void {
    localStorage.removeItem('dealerDetailState');
    this.router.navigate([this.fromRoute]);
  }

  getInitial(): string {
    return (this.dealer.dealerName.charAt(0) || 'S').toUpperCase();
  }

  getCarLabel(car: Car): string {
    if (car.year) return `${car.year} ${car.condition === 'new' ? 'NEW' : 'EDITION'}`;
    return '';
  }

  formatPrice(price: number): string {
    return price?.toLocaleString('fr-CM') ?? '0';
  }

  getFirstImage(car: Car): string | null {
    if (!car.images?.length) return null;
    return this.carService.imageUrl(car.images[0]);
  }

  openWhatsApp(): void {
    const msg = `Hello ${this.dealer.dealerName}, I found your profile on DriveEase and would like to inquire about your vehicle listings.`;
    window.open(`https://wa.me/237676541667?text=${encodeURIComponent(msg)}`, '_blank');
  }

  callSeller(): void {}

  openCarDetail(car: Car): void {
    sessionStorage.setItem('pendingCarNav', JSON.stringify({
      car,
      isOwned: false,
      fromRoute: '/profile/dealer',
    }));
    this.router.navigate(['/cars/detail']);
  }
}
