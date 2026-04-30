import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Booking } from '../models/booking.model';
import { CarService } from './car.service';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient, private carService: CarService) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        const data = Array.isArray(res?.data) ? res.data
          : Array.isArray(res) ? res : [];
        return data.map((b: any) => this.mapBooking(b));
      }),
      catchError(this.handleError),
    );
  }

  getBooking(id: string): Observable<Booking> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((res) => this.mapBooking(res?.data ?? res)),
      catchError(this.handleError),
    );
  }

  cancelBooking(id: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/${id}/cancel`, {})
      .pipe(catchError(this.handleError));
  }

  private mapBooking(b: any): Booking {
    const car = typeof b.car === 'object' ? b.car : {};
    const year = car.year ?? '';
    const make = car.make ?? '';
    const model = car.model ?? '';
    const title = b.title
      ?? (make ? `${year} ${make} ${model}`.trim() : 'Car Booking');
    const image = b.image
      ?? (car.images?.[0] ? this.carService.imageUrl(car.images[0]) : null);

    return {
      _id: b._id ?? b.id,
      bookingCode: b.bookingCode ?? b.code
        ?? `BK-${String(b._id ?? b.id ?? '').slice(-5).toUpperCase()}`,
      type: b.type ?? (b.rentalPrice ? 'rental' : 'purchase'),
      title,
      image,
      dates: b.dates ?? this.formatDates(b.startDate, b.endDate),
      startDate: b.startDate,
      endDate: b.endDate,
      price: b.price ?? b.rentalPrice ?? car.rentalPrice ?? car.price ?? 0,
      totalDays: b.totalDays,
      status: b.status ?? 'processing',
      statusNote: b.statusNote,
      timeline: Array.isArray(b.timeline) ? b.timeline : [],
      car: b.car,
      createdAt: b.createdAt,
    };
  }

  private formatDates(start?: string, end?: string): string {
    if (!start) return '';
    const fmt = (d: string) =>
      new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const msg = error.error?.message ?? `Error: ${error.status}`;
    return throwError(() => new Error(msg));
  }
}
