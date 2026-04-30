import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon,
  IonSpinner,
  ViewWillEnter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  carOutline,
  carSportOutline,
  keyOutline,
  bagHandleOutline,
  logoWhatsapp,
  refreshOutline,
  checkmarkCircleOutline,
  timeOutline,
  ellipseOutline,
} from 'ionicons/icons';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  imports: [CommonModule, IonContent, IonIcon, IonSpinner, TranslatePipe],
})
export class BookingsPage implements OnInit, ViewWillEnter {
  activeFilter = 'all';
  isLoading = false;

  filters = [
    { label: 'bk.filter.all', value: 'all' },
    { label: 'bk.filter.active', value: 'active' },
    { label: 'bk.filter.done', value: 'completed' },
    { label: 'bk.filter.cancelled', value: 'cancelled' },
  ];

  bookings: Booking[] = [
    // {
    //   bookingCode: 'PE-99283',
    //   type: 'rental',
    //   title: '2023 Porsche 911 Carrera S',
    //   image: 'assets/images/cars/2023 Porsche 911 Carrera S.png',
    //   dates: 'Oct 12 – Oct 15',
    //   price: 150000,
    //   totalDays: 3,
    //   status: 'active',
    //   timeline: [
    //     { label: 'Reservation Confirmed', date: 'OCT 10', state: 'completed' },
    //     { label: 'Payment Verified',      date: 'OCT 10', state: 'completed' },
    //     { label: 'Vehicle Pick-up',       date: 'OCT 12', state: 'current'   },
    //     { label: 'Scheduled Return',      date: 'OCT 15', state: 'pending'   },
    //   ],
    // },
    // {
    //   bookingCode: 'PE-72451',
    //   type: 'purchase',
    //   title: '2022 Range Rover SV',
    //   image: 'assets/images/cars/range-rover-evoque.jpeg',
    //   dates: 'Oct 5',
    //   price: 85000000,
    //   status: 'processing',
    //   statusNote: 'Financing Approved',
    //   timeline: [
    //     { label: 'Order Placed',       date: 'OCT 5',  state: 'completed' },
    //     { label: 'Financing Approved', date: 'OCT 5',  state: 'completed' },
    //     { label: 'Payment Processing', date: 'OCT 6',  state: 'current'   },
    //     { label: 'Vehicle Delivery',   date: 'TBD',    state: 'pending'   },
    //   ],
    // },
    // {
    //   bookingCode: 'PE-85920',
    //   type: 'rental',
    //   title: '2023 Mercedes-AMG GT',
    //   image: 'assets/images/cars/mercedes_formula_1.jpg',
    //   dates: 'Sep 20 – Sep 24',
    //   price: 120000,
    //   totalDays: 4,
    //   status: 'completed',
    //   timeline: [
    //     { label: 'Reservation Confirmed', date: 'SEP 18', state: 'completed' },
    //     { label: 'Payment Verified',      date: 'SEP 18', state: 'completed' },
    //     { label: 'Vehicle Pick-up',       date: 'SEP 20', state: 'completed' },
    //     { label: 'Vehicle Returned',      date: 'SEP 24', state: 'completed' },
    //   ],
    // },
    // {
    //   bookingCode: 'PE-61837',
    //   type: 'purchase',
    //   title: '2022 BMW M5 Competition',
    //   image: 'assets/images/cars/g-wagon-benz.jpg',
    //   dates: 'Sep 10',
    //   price: 45500000,
    //   status: 'completed',
    //   statusNote: 'Delivered',
    //   timeline: [
    //     { label: 'Order Placed',      date: 'SEP 10', state: 'completed' },
    //     { label: 'Payment Confirmed', date: 'SEP 10', state: 'completed' },
    //     { label: 'Vehicle Delivered', date: 'SEP 15', state: 'completed' },
    //   ],
    // },
  ];

  constructor(
    private router: Router,
    private bookingService: BookingService,
  ) {
    addIcons({
      calendarOutline,
      carOutline,
      carSportOutline,
      keyOutline,
      bagHandleOutline,
      logoWhatsapp,
      refreshOutline,
      checkmarkCircleOutline,
      timeOutline,
      ellipseOutline,
    });
  }

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
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
    if (price >= 1_000_000) return (price / 1_000_000).toFixed(0) + 'M';
    return price.toLocaleString('fr-CM');
  }

  getTotal(b: Booking): string {
    if (b.type === 'rental' && b.totalDays) {
      return this.formatPrice(b.price * b.totalDays);
    }
    return this.formatPrice(b.price);
  }

  getTypeIcon(type: string): string {
    return type === 'rental' ? 'key-outline' : 'bag-handle-outline';
  }

  getTypeLabel(type: string): string {
    return type === 'rental' ? 'Rental' : 'Purchase';
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':     return 'Active';
      case 'processing': return 'Processing';
      case 'completed':  return 'Completed';
      case 'cancelled':  return 'Cancelled';
      default:           return status;
    }
  }

  getActionLabel(b: Booking): string {
    switch (b.status) {
      case 'active':     return 'Details';
      case 'processing': return 'Track';
      case 'completed':  return 'Receipt';
      case 'cancelled':  return 'Details';
      default:           return 'Details';
    }
  }

  currentStep(b: Booking): number {
    return b.timeline?.findIndex((t) => t.state === 'current') ?? -1;
  }

  onBookingAction(b: Booking): void {
    sessionStorage.setItem(
      'pendingBookingDetail',
      JSON.stringify({ booking: b, fromRoute: '/tabs/bookings' }),
    );
    this.router.navigate(['/bookings/detail']);
  }

  openWhatsApp(): void {
    const msg = `Hello, I need help with a booking on DriveEase.`;
    window.open(`https://wa.me/237676541667?text=${encodeURIComponent(msg)}`, '_blank');
  }
}
