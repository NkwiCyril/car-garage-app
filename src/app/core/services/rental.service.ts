import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  getAvailableCars(): Observable<any[]> {
    // TODO: Replace with actual API call
    return of([]);
  }

  rentCar(carId: string): Observable<any> {
    // TODO: Replace with actual API call
    return of({ success: true });
  }

  getRentalHistory(): Observable<any[]> {
    // TODO: Replace with actual API call
    return of([]);
  }
}
