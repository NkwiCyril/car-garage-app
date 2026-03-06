import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  processPayment(amount: number, method: string): Observable<any> {
    // TODO: Replace with actual API call
    return of({ success: true });
  }

  getPaymentHistory(): Observable<any[]> {
    // TODO: Replace with actual API call
    return of([]);
  }

  getPaymentMethods(): Observable<any[]> {
    // TODO: Replace with actual API call
    return of([]);
  }
}
