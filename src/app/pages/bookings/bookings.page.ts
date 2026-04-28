import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  carOutline,
  carSportOutline,
  keyOutline,
  bagHandleOutline,
  logoWhatsapp,
} from 'ionicons/icons';

interface TimelineEvent {
  label: string;
  date: string;
  state: 'completed' | 'current' | 'pending';
}

interface Booking {
  id: number;
  bookingCode: string;
  type: 'rental' | 'purchase';
  title: string;
  image: string | null;
  dates: string;
  price: number;
  totalDays?: number;
  status: 'active' | 'processing' | 'completed' | 'cancelled';
  statusNote?: string;
  timeline: TimelineEvent[];
}

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class BookingsPage {
  activeFilter = 'all';

  filters = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Done', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  bookings: Booking[] = [
    {
      id: 1,
      bookingCode: 'PE-99283',
      type: 'rental',
      title: '2023 Porsche 911 Carrera S',
      image: 'assets/images/cars/2023 Porsche 911 Carrera S.png',
      dates: 'Oct 12 - Oct 15',
      price: 150000,
      totalDays: 3,
      status: 'active',
      timeline: [
        { label: 'Reservation Confirmed', date: 'OCT 10, 10:00 AM', state: 'completed' },
        { label: 'Payment Verified',      date: 'OCT 10, 10:15 AM', state: 'completed' },
        { label: 'Vehicle Pick-up',       date: 'OCT 12, 09:00 AM', state: 'current'   },
        { label: 'Scheduled Return',      date: 'OCT 15, 06:00 PM', state: 'pending'   },
      ],
    },
    {
      id: 2,
      bookingCode: 'PE-72451',
      type: 'purchase',
      title: '2022 Range Rover SV',
      image: 'assets/images/cars/range-rover-evoque.jpeg',
      dates: 'Oct 5',
      price: 85000000,
      status: 'processing',
      statusNote: 'Financing Approved',
      timeline: [
        { label: 'Order Placed',        date: 'OCT 5, 09:00 AM',  state: 'completed' },
        { label: 'Financing Approved',  date: 'OCT 5, 02:00 PM',  state: 'completed' },
        { label: 'Payment Processing',  date: 'OCT 6, 10:00 AM',  state: 'current'   },
        { label: 'Vehicle Delivery',    date: 'TBD',               state: 'pending'   },
      ],
    },
    {
      id: 3,
      bookingCode: 'PE-85920',
      type: 'rental',
      title: '2023 Mercedes-AMG GT',
      image: 'assets/images/cars/mercedes_formula_1.jpg',
      dates: 'Sep 20 - Sep 24',
      price: 120000,
      totalDays: 4,
      status: 'completed',
      timeline: [
        { label: 'Reservation Confirmed', date: 'SEP 18, 11:00 AM', state: 'completed' },
        { label: 'Payment Verified',      date: 'SEP 18, 11:20 AM', state: 'completed' },
        { label: 'Vehicle Pick-up',       date: 'SEP 20, 08:00 AM', state: 'completed' },
        { label: 'Vehicle Returned',      date: 'SEP 24, 06:00 PM', state: 'completed' },
      ],
    },
    {
      id: 4,
      bookingCode: 'PE-61837',
      type: 'purchase',
      title: '2022 BMW M5 Competition',
      image: 'assets/images/cars/g-wagon-benz.jpg',
      dates: 'Sep 10',
      price: 45500000,
      status: 'completed',
      statusNote: 'Delivered',
      timeline: [
        { label: 'Order Placed',       date: 'SEP 10, 10:00 AM', state: 'completed' },
        { label: 'Payment Confirmed',  date: 'SEP 10, 02:00 PM', state: 'completed' },
        { label: 'Vehicle Delivered',  date: 'SEP 15, 10:00 AM', state: 'completed' },
      ],
    },
  ];

  constructor(private router: Router) {
    addIcons({
      calendarOutline,
      carOutline,
      carSportOutline,
      keyOutline,
      bagHandleOutline,
      logoWhatsapp,
    });
  }

  get filteredBookings(): Booking[] {
    if (this.activeFilter === 'all') return this.bookings;
    return this.bookings.filter((b) => b.status === this.activeFilter);
  }

  countByStatus(status: string): number {
    return this.bookings.filter((b) => b.status === status).length;
  }

  padNum(n: number): string {
    return n.toString().padStart(2, '0');
  }

  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toLocaleString('fr-CM');
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'rental': return 'key-outline';
      case 'purchase': return 'bag-handle-outline';
      default: return 'car-outline';
    }
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case 'rental': return 'Rental';
      case 'purchase': return 'Purchase';
      default: return type;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Active';
      case 'processing': return 'Processing';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }

  getActionLabel(b: Booking): string {
    switch (b.status) {
      case 'active': return 'Details';
      case 'processing': return 'Track Status';
      case 'completed': return 'View Receipt';
      case 'cancelled': return 'View Details';
      default: return 'Details';
    }
  }

  onBookingAction(b: Booking): void {
    sessionStorage.setItem('pendingBookingDetail', JSON.stringify({ booking: b, fromRoute: '/tabs/bookings' }));
    this.router.navigate(['/bookings/detail']);
  }

  openWhatsApp(): void {
    window.open('https://wa.me/237XXXXXXXXX', '_blank');
  }
}