import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  locationOutline,
  starOutline,
  star,
  carOutline,
  keyOutline,
  bagHandleOutline,
  pricetagOutline,
  searchOutline,
  filterOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-auto',
  templateUrl: './auto.page.html',
  styleUrls: ['./auto.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
})
export class AutoPage {
  activeTab: string = 'garage';

  garagePlaceholder = [
    {
      name: 'Central Market Parking',
      distance: '0.5km',
      area: 'Bastos Area',
      price: 500,
      spots: 24,
      status: 'Open',
      rating: 4.5,
    },
    {
      name: 'Mvan Complex Parking',
      distance: '2.1km',
      area: 'Mvan',
      price: 300,
      spots: 12,
      status: 'Open',
      rating: 4.2,
    },
    {
      name: 'Hilton Hotel Parking',
      distance: '3.0km',
      area: 'Centre Ville',
      price: 750,
      spots: 8,
      status: 'Full',
      rating: 4.8,
    },
  ];

  rentPlaceholder = [
    {
      name: 'Toyota Corolla 2022',
      type: 'Sedan',
      price: 25000,
      unit: 'day',
      transmission: 'Automatic',
      rating: 4.6,
    },
    {
      name: 'Honda CR-V 2023',
      type: 'SUV',
      price: 35000,
      unit: 'day',
      transmission: 'Automatic',
      rating: 4.7,
    },
    {
      name: 'Toyota Hilux 2021',
      type: 'Pickup',
      price: 40000,
      unit: 'day',
      transmission: 'Manual',
      rating: 4.4,
    },
  ];

  buyPlaceholder = [
    {
      name: 'Mercedes C300 2020',
      type: 'Sedan',
      price: 18500000,
      mileage: '45,000 km',
      condition: 'Used',
      location: 'Yaound\u00e9',
    },
    {
      name: 'Toyota Land Cruiser 2023',
      type: 'SUV',
      price: 42000000,
      mileage: '12,000 km',
      condition: 'Used',
      location: 'Douala',
    },
    {
      name: 'BMW X5 2022',
      type: 'SUV',
      price: 28000000,
      mileage: '30,000 km',
      condition: 'Used',
      location: 'Yaound\u00e9',
    },
  ];

  sellPlaceholder = {
    title: 'Sell Your Car',
    subtitle: 'List your vehicle and reach thousands of potential buyers in Cameroon.',
    steps: [
      { icon: 'car-outline', label: 'Add car details', desc: 'Model, year, mileage, photos' },
      { icon: 'pricetag-outline', label: 'Set your price', desc: 'Competitive pricing suggestions' },
      { icon: 'star-outline', label: 'Get offers', desc: 'Connect with verified buyers' },
    ],
  };

  constructor() {
    addIcons({
      locationOutline,
      starOutline,
      star,
      carOutline,
      keyOutline,
      bagHandleOutline,
      pricetagOutline,
      searchOutline,
      filterOutline,
    });
  }

  onTabChange(event: any): void {
    this.activeTab = event.detail.value;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('fr-CM');
  }
}
