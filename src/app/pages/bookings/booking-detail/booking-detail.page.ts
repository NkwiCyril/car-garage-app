import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, ViewWillEnter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  checkmarkOutline,
  carOutline,
  calendarOutline,
  chatbubbleOutline,
  documentTextOutline,
} from 'ionicons/icons';

interface TimelineEvent {
  label: string;
  date: string;
  state: 'completed' | 'current' | 'pending';
}

interface BookingDetail {
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
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.page.html',
  styleUrls: ['./booking-detail.page.scss'],
  imports: [CommonModule, IonContent, IonIcon],
})
export class BookingDetailPage implements OnInit, ViewWillEnter {
  booking: BookingDetail | null = null;
  private fromRoute = '/tabs/bookings';

  constructor(private router: Router) {
    addIcons({
      arrowBackOutline,
      checkmarkOutline,
      carOutline,
      calendarOutline,
      chatbubbleOutline,
      documentTextOutline,
    });
  }

  ngOnInit(): void {}

  ionViewWillEnter(): void {
    const raw = sessionStorage.getItem('pendingBookingDetail');
    if (raw) {
      const payload = JSON.parse(raw);
      this.booking = payload.booking ?? null;
      this.fromRoute = payload.fromRoute ?? '/tabs/bookings';
      sessionStorage.removeItem('pendingBookingDetail');
    }
  }

  goBack(): void {
    this.router.navigate([this.fromRoute]);
  }

  getStatusLabel(): string {
    switch (this.booking?.status) {
      case 'active':     return 'ACTIVE';
      case 'processing': return 'PROCESSING';
      case 'completed':  return 'COMPLETED';
      case 'cancelled':  return 'CANCELLED';
      default:           return '';
    }
  }

  getStatusNote(): string {
    switch (this.booking?.status) {
      case 'active':     return 'is currently active and under your care';
      case 'processing': return 'order is currently being processed';
      case 'completed':  return 'booking has been completed successfully';
      case 'cancelled':  return 'booking has been cancelled';
      default:           return '';
    }
  }

  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toLocaleString('fr-CM');
  }

  get totalAmount(): number {
    if (!this.booking) return 0;
    if (this.booking.type === 'rental' && this.booking.totalDays) {
      return this.booking.price * this.booking.totalDays;
    }
    return this.booking.price;
  }

  openReceipt(): void {
    // TODO: download/view receipt PDF
  }

  openSupport(): void {
    const code = this.booking?.bookingCode ?? '';
    const title = this.booking?.title ?? 'my booking';
    const msg = `Hello, I need support regarding my DriveEase booking #${code} (${title}).`;
    window.open(`https://wa.me/237676541667?text=${encodeURIComponent(msg)}`, '_blank');
  }

  extendBooking(): void {
    // TODO: open extend booking flow
  }
}
