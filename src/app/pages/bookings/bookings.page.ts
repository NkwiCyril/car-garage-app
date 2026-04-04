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
  timeOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  locationOutline,
  calendarOutline,
  carOutline,
  keyOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
})
export class BookingsPage {
  activeFilter: string = 'all';

  bookings = [
    {
      id: 1,
      type: 'parking',
      title: 'Central Market Parking',
      location: 'Bastos Area, Yaound\u00e9',
      date: 'Mar 10, 2026',
      time: '09:00 - 14:00',
      price: 2500,
      status: 'active',
    },
    {
      id: 2,
      type: 'rental',
      title: 'Toyota Corolla 2022',
      location: 'Pickup: Mvan, Yaound\u00e9',
      date: 'Mar 8 - Mar 12, 2026',
      time: '4 days',
      price: 100000,
      status: 'active',
    },
    {
      id: 3,
      type: 'parking',
      title: 'Hilton Hotel Parking',
      location: 'Centre Ville, Yaound\u00e9',
      date: 'Mar 5, 2026',
      time: '10:00 - 18:00',
      price: 6000,
      status: 'completed',
    },
    {
      id: 4,
      type: 'rental',
      title: 'Honda CR-V 2023',
      location: 'Pickup: Bastos, Yaound\u00e9',
      date: 'Feb 28 - Mar 2, 2026',
      time: '2 days',
      price: 70000,
      status: 'completed',
    },
    {
      id: 5,
      type: 'parking',
      title: 'Mvan Complex Parking',
      location: 'Mvan, Yaound\u00e9',
      date: 'Feb 20, 2026',
      time: '08:00 - 12:00',
      price: 1200,
      status: 'cancelled',
    },
  ];

  constructor() {
    addIcons({
      timeOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      locationOutline,
      calendarOutline,
      carOutline,
      keyOutline,
    });
  }

  get filteredBookings() {
    if (this.activeFilter === 'all') return this.bookings;
    return this.bookings.filter((b) => b.status === this.activeFilter);
  }

  countByStatus(status: string): number {
    return this.bookings.filter((b) => b.status === status).length;
  }

  onFilterChange(event: any): void {
    this.activeFilter = event.detail.value;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('fr-CM');
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'active': return 'time-outline';
      case 'completed': return 'checkmark-circle-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'time-outline';
    }
  }

  getTypeIcon(type: string): string {
    return type === 'parking' ? 'car-outline' : 'key-outline';
  }
}
