import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CarApiResponse, SellCarRequest, RentListRequest } from '../models/car.model';
import { friendlyErrorMessage } from '../utils/error-message.util';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiUrl = `${environment.apiUrl}/cars`;
  private mediaUrl = environment.mediaUrl;

  /**
   * Build a renderable URL for a car image path returned by the API.
   *
   * The backend has historically returned paths in several shapes
   * (`/cars/foo.jpg`, `cars/foo.jpg`, occasionally an absolute URL once the
   * platform moves uploads off the local disk). The naive
   * `${mediaUrl}${filename}` concatenation breaks on any of those: it can
   * drop the slash between host and path, or double up the scheme on
   * already-absolute URLs. This helper handles all four cases plus
   * empty/null input safely.
   */
  imageUrl(filename: string | null | undefined): string {
    if (!filename) return '';
    if (
      filename.startsWith('http://') ||
      filename.startsWith('https://') ||
      filename.startsWith('data:')
    ) {
      return filename;
    }
    const base = this.mediaUrl.replace(/\/$/, '');
    const path = filename.startsWith('/') ? filename : `/${filename}`;
    return `${base}${path}`;
  }

  constructor(private http: HttpClient) {}

  // GET /api/cars/home — premium-verified, available cars for the dashboard
  getHomeCars(filters?: { forSale?: boolean; forRent?: boolean; page?: number; limit?: number }): Observable<any> {
    let params = new HttpParams();
    if (filters?.forSale !== undefined) params = params.set('forSale', String(filters.forSale));
    if (filters?.forRent !== undefined) params = params.set('forRent', String(filters.forRent));
    if (filters?.page !== undefined) params = params.set('page', String(filters.page));
    if (filters?.limit !== undefined) params = params.set('limit', String(filters.limit));

    return this.http
      .get<any>(`${this.apiUrl}/home`, { params })
      .pipe(catchError(this.handleError));
  }

  // GET /api/cars/marketplace — non-premium, available cars for the marketplace
  getMarketplaceCars(filters?: { forSale?: boolean; forRent?: boolean; page?: number; limit?: number }): Observable<any> {
    let params = new HttpParams();
    if (filters?.forSale !== undefined) params = params.set('forSale', String(filters.forSale));
    if (filters?.forRent !== undefined) params = params.set('forRent', String(filters.forRent));
    if (filters?.page !== undefined) params = params.set('page', String(filters.page));
    if (filters?.limit !== undefined) params = params.set('limit', String(filters.limit));

    return this.http
      .get<any>(`${this.apiUrl}/marketplace`, { params })
      .pipe(catchError(this.handleError));
  }

  // GET /api/cars/available — list all available cars (legacy fallback)
  getAvailableCars(filters?: { forSale?: boolean; forRent?: boolean; page?: number; limit?: number }): Observable<any> {
    let params = new HttpParams().set('status', 'available');
    if (filters?.forSale !== undefined) params = params.set('forSale', String(filters.forSale));
    if (filters?.forRent !== undefined) params = params.set('forRent', String(filters.forRent));
    if (filters?.page !== undefined) params = params.set('page', String(filters.page));
    if (filters?.limit !== undefined) params = params.set('limit', String(filters.limit));

    return this.http
      .get<any>(`${this.apiUrl}/available`, { params })
      .pipe(catchError(this.handleError));
  }

  // GET /api/cars/:id — fetch a single car by id (used by shareable links)
  getCarById(id: string): Observable<CarApiResponse> {
    return this.http
      .get<CarApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // GET /api/cars/user/:userId/sale — list the user's own cars for sale
  getUserCarsForSale(userId: string): Observable<CarApiResponse> {
    return this.http
      .get<CarApiResponse>(`${this.apiUrl}/user/${userId}/sale`)
      .pipe(catchError(this.handleError));
  }

  // GET /api/cars/user/:userId/rent — list the user's own cars for rent
  getUserCarsForRent(userId: string): Observable<CarApiResponse> {
    return this.http
      .get<CarApiResponse>(`${this.apiUrl}/user/${userId}/rent`)
      .pipe(catchError(this.handleError));
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

  // GET /api/cars/search — full-text + faceted search
  searchCars(params: {
    q?: string;
    make?: string;
    model?: string;
    forSale?: boolean;
    forRent?: boolean;
    priceMin?: number;
    priceMax?: number;
    yearMin?: number;
    yearMax?: number;
    sort?: 'recent' | 'priceAsc' | 'priceDesc' | 'yearAsc' | 'yearDesc';
    page?: number;
    limit?: number;
  }): Observable<any> {
    let p = new HttpParams();
    if (params.q) p = p.set('q', params.q);
    if (params.make) p = p.set('make', params.make);
    if (params.model) p = p.set('model', params.model);
    if (params.forSale !== undefined) p = p.set('forSale', String(params.forSale));
    if (params.forRent !== undefined) p = p.set('forRent', String(params.forRent));
    if (params.priceMin !== undefined) p = p.set('priceMin', String(params.priceMin));
    if (params.priceMax !== undefined) p = p.set('priceMax', String(params.priceMax));
    if (params.yearMin !== undefined) p = p.set('yearMin', String(params.yearMin));
    if (params.yearMax !== undefined) p = p.set('yearMax', String(params.yearMax));
    if (params.sort) p = p.set('sort', params.sort);
    if (params.page !== undefined) p = p.set('page', String(params.page));
    if (params.limit !== undefined) p = p.set('limit', String(params.limit));
    return this.http.get<any>(`${this.apiUrl}/search`, { params: p }).pipe(catchError(this.handleError));
  }

  // DELETE /api/cars/:id — delete an owned car
  deleteCar(id: string): Observable<CarApiResponse> {
    return this.http
      .delete<CarApiResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // PATCH /api/cars/:id/images — append new images to an existing car listing
  addCarImages(id: string, formData: FormData): Observable<CarApiResponse> {
    return this.http
      .patch<CarApiResponse>(`${this.apiUrl}/${id}/images`, formData)
      .pipe(catchError(this.handleError));
  }

  // DELETE /api/cars/:id/images/:filename — remove a specific image from a car
  removeCarImage(id: string, filename: string): Observable<CarApiResponse> {
    return this.http
      .delete<CarApiResponse>(`${this.apiUrl}/${id}/images/${encodeURIComponent(filename)}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(friendlyErrorMessage(error)));
  }
}
