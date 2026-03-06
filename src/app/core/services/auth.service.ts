import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  get isLoggedIn$(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  get isLoggedIn(): boolean {
    return this.isAuthenticated$.value;
  }

  login(phone: string, password: string): Observable<any> {
    // TODO: Replace with actual API call
    return of({ success: true });
  }

  register(fullName: string, phone: string, password: string): Observable<any> {
    // TODO: Replace with actual API call
    return of({ success: true });
  }

  loginWithGoogle(): Observable<any> {
    // TODO: Replace with Google OAuth API call
    return of({ success: true });
  }

  forgotPassword(phone: string): Observable<any> {
    // TODO: Replace with actual API call to send OTP
    return of({ success: true });
  }

  verifyOtp(phone: string, otp: string): Observable<any> {
    // TODO: Replace with actual API call
    return of({ success: true });
  }

  resetPassword(phone: string, newPassword: string): Observable<any> {
    // TODO: Replace with actual API call
    return of({ success: true });
  }

  logout(): void {
    this.isAuthenticated$.next(false);
    // TODO: Clear tokens, navigate to login
  }

  setAuthenticated(value: boolean): void {
    this.isAuthenticated$.next(value);
  }
}
