import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdvertService {
  private apiUrl = `${environment.apiUrl}/adverts`;
  private mediaUrl = environment.mediaUrl;

  constructor(private http: HttpClient) {}

  imageUrl(filename: string): string {
    return `${this.mediaUrl}${filename}`;
  }

  getAdverts(params?: { status?: string; page?: number; limit?: number }): Observable<any> {
    let p = new HttpParams();
    if (params?.status) p = p.set('status', params.status);
    if (params?.page !== undefined) p = p.set('page', String(params.page));
    if (params?.limit !== undefined) p = p.set('limit', String(params.limit));
    return this.http.get<any>(this.apiUrl, { params: p }).pipe(catchError(this.handleError));
  }

  getFeaturedAdverts(limit = 5): Observable<any> {
    const p = new HttpParams().set('limit', String(limit));
    return this.http.get<any>(`${this.apiUrl}/featured`, { params: p }).pipe(catchError(this.handleError));
  }

  trackClick(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/click`, {}).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const msg = error.error?.message ?? `Server error: ${error.status}`;
    return throwError(() => new Error(msg));
  }
}
