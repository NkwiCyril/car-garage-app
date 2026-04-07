import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CarApiResponse, SellCarRequest, RentListRequest } from '../models/car.model';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiUrl = `${environment.apiUrl}/cars`;
  private mediaUrl = environment.mediaUrl;

  imageUrl(filename: string): string {
    console.log(`${this.mediaUrl}${filename}`);
    return `${this.mediaUrl}${filename}`;
  }

  constructor(private http: HttpClient) {}

  // GET /api/cars/available — list all cars available for sale or rent
  getAvailableCars(filters?: { forSale?: boolean; forRent?: boolean; page?: number; limit?: number }): Observable<any> {
    let params = new HttpParams().set('status', 'available');
    if (filters?.forSale !== undefined) params = params.set('forSale', String(filters.forSale));
    if (filters?.forRent !== undefined) params = params.set('forRent', String(filters.forRent));
    if (filters?.page !== undefined) params = params.set('page', String(filters.page));
    if (filters?.limit !== undefined) params = params.set('limit', String(filters.limit));

    console.log('[CarService] GET /cars/available — params:', params.toString());

    return this.http
      .get<any>(`${this.apiUrl}/available`, { params })
      .pipe(
        tap((response) => console.log('[CarService] /cars/available raw response:', JSON.stringify(response))),
        catchError(this.handleError)
      );
  }

  // POST /api/cars — create a new car (for sale/rent/normal) with images
  addCar(formData: FormData): Observable<CarApiResponse> {
    return this.http
      .post<CarApiResponse>(`${this.apiUrl}`, formData)
      .pipe(catchError(this.handleError));
  }

  // POST /api/cars/park — park/keep a car in the garage with images
  parkCar(formData: FormData): Observable<CarApiResponse> {
    return this.http
      .post<CarApiResponse>(`${this.apiUrl}/park`, formData)
      .pipe(catchError(this.handleError));
  }

  // POST /api/cars/collect/:id — collect car from garage
  collectCar(id: string): Observable<CarApiResponse> {
    return this.http
      .post<CarApiResponse>(`${this.apiUrl}/collect/${id}`, {})
      .pipe(catchError(this.handleError));
  }

  // POST /api/cars/buy/:id — buy an available car for sale
  buyCar(id: string): Observable<CarApiResponse> {
    return this.http
      .post<CarApiResponse>(`${this.apiUrl}/buy/${id}`, {})
      .pipe(catchError(this.handleError));
  }

  // POST /api/cars/sell/:id — put an owned car up for sale with a price
  sellCar(id: string, price: number): Observable<CarApiResponse> {
    const payload: SellCarRequest = { price };
    return this.http
      .post<CarApiResponse>(`${this.apiUrl}/sell/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  // POST /api/cars/rent/:id — rent an available car
  rentCar(id: string): Observable<CarApiResponse> {
    return this.http
      .post<CarApiResponse>(`${this.apiUrl}/rent/${id}`, {})
      .pipe(catchError(this.handleError));
  }

  // POST /api/cars/rent-list/:id — list an owned car for rent
  listCarForRent(id: string, rentalPrice: number): Observable<CarApiResponse> {
    const payload: RentListRequest = { rentalPrice };
    return this.http
      .post<CarApiResponse>(`${this.apiUrl}/rent-list/${id}`, payload)
      .pipe(catchError(this.handleError));
  }

  // PUT /api/cars/:id — update an owned car's details
  updateCar(id: string, data: Partial<any>): Observable<CarApiResponse> {
    return this.http
      .put<CarApiResponse>(`${this.apiUrl}/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // DELETE /api/cars/:id — delete an owned car
  deleteCar(id: string): Observable<CarApiResponse> {
    return this.http
      .delete<CarApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Server error: ${error.status}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
