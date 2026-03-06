import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  getAvailableSpots(): Observable<any[]> {
    // TODO: Replace with actual API call
    return of([]);
  }

  bookSpot(spotId: string): Observable<any> {
    // TODO: Replace with actual API call
    return of({ success: true });
  }

  getBookingHistory(): Observable<any[]> {
    // TODO: Replace with actual API call
    return of([]);
  }

  getNearbyParking(lat: number, lng: number): Observable<any[]> {
    // TODO: Replace with actual API call
    return of([]);
  }
}
