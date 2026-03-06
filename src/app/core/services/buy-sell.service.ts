import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuySellService {

  getListings(): Observable<any[]> {
    // TODO: Replace with actual API call
    return of([]);
  }

  getListingById(id: string): Observable<any> {
    // TODO: Replace with actual API call
    return of({});
  }

  createListing(listing: any): Observable<any> {
    // TODO: Replace with actual API call
    return of({ success: true });
  }
}
