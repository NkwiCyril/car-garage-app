import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

export interface UserLocation {
  city: string;
  country: string;
  display: string;
  lat: number;
  lon: number;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  private readonly NOMINATIM_URL =
    'https://nominatim.openstreetmap.org/reverse';
  private cached: UserLocation | null = null;

  constructor(private http: HttpClient) {}

  get current(): UserLocation | null {
    return this.cached;
  }

  getLocation(forceRefresh = false): Observable<UserLocation> {
    if (this.cached && !forceRefresh) return of(this.cached);

    return from(
      Geolocation.requestPermissions().catch(() => ({ location: 'denied' as const })),
    ).pipe(
      switchMap((perm) => {
        if (perm.location === 'denied') {
          return throwError(() => new Error('Location permission denied'));
        }
        return from(
          Geolocation.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60_000,
          }),
        );
      }),
      switchMap((pos) =>
        this.reverseGeocode(pos.coords.latitude, pos.coords.longitude),
      ),
      map((location) => {
        this.cached = location;
        return location;
      }),
      catchError((err) => throwError(() => err)),
    );
  }

  private reverseGeocode(lat: number, lon: number): Observable<UserLocation> {
    const params = `?lat=${lat}&lon=${lon}&format=json&zoom=10&addressdetails=1`;
    return this.http
      .get<any>(`${this.NOMINATIM_URL}${params}`, {
        headers: { Accept: 'application/json' },
      })
      .pipe(
        map((res) => this.toUserLocation(res, lat, lon)),
        catchError(() =>
          of<UserLocation>({
            city: 'Unknown',
            country: '',
            display: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
            lat,
            lon,
          }),
        ),
      );
  }

  private toUserLocation(res: any, lat: number, lon: number): UserLocation {
    const a = res?.address ?? {};
    const city =
      a.city || a.town || a.village || a.municipality || a.county || a.state || '';
    const country = a.country_code ? a.country_code.toUpperCase() : a.country ?? '';
    const display = city && country ? `${city}, ${country}` : city || country || 'Unknown';
    return { city, country, display, lat, lon };
  }
}
