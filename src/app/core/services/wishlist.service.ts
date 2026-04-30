import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Car } from '../models/car.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/users/wishlist`;

  constructor(private http: HttpClient) {}

  getWishlistCars(): Observable<Car[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        const data = Array.isArray(res?.data) ? res.data
          : Array.isArray(res) ? res : [];
        // Filter to full Car objects (not bare ID strings)
        return data.filter((item: any) => typeof item === 'object' && item !== null && item._id) as Car[];
      }),
      catchError(this.handleError),
    );
  }

  getWishlist(): Observable<string[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => {
        const data = Array.isArray(res?.data) ? res.data
          : Array.isArray(res) ? res : [];
        return data.map((item: any) =>
          typeof item === 'string' ? item : (item._id ?? item.id ?? '')
        );
      }),
      catchError(this.handleError),
    );
  }

  add(carId: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/${carId}`, {})
      .pipe(catchError(this.handleError));
  }

  remove(carId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/${carId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const msg = error.error?.message ?? `Error: ${error.status}`;
    return throwError(() => new Error(msg));
  }
}
