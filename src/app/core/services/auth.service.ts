import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';
import { StorageService } from './storage.service';
import { friendlyErrorMessage } from '../utils/error-message.util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private currentUser$ = new BehaviorSubject<any>(null);

  get isLoggedIn$(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  get isLoggedIn(): boolean {
    return this.isAuthenticated$.value;
  }

  get currentUser(): any {
    return this.currentUser$.value;
  }

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.storageService.get<string>('authToken');
    const user = this.storageService.get<any>('currentUser');
    if (token && user) {
      this.isAuthenticated$.next(true);
      this.currentUser$.next(user);
    }
  }

  login(phone: string, password: string): Observable<any> {
    const payload: LoginRequest = { phone, password };
    return this.http.post<any>(`${this.apiUrl}/users/login`, payload).pipe(
      tap((response) => {
        if (response.success && response.token) {
          this.storageService.set('authToken', response.token);
          this.storageService.set('currentUser', response.user);
          this.isAuthenticated$.next(true);
          this.currentUser$.next(response.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  register(fullName: string, phone: string, password: string, repeatPassword: string): Observable<any> {
    const payload: RegisterRequest & { repeatPassword: string } = {
      name: fullName,
      phone,
      password,
      repeatPassword
    };
    return this.http.post<any>(`${this.apiUrl}/users/register`, payload).pipe(
      tap((response) => {
        if (response.success && response.token) {
          this.storageService.set('authToken', response.token);
          this.storageService.set('currentUser', response.user);
          this.isAuthenticated$.next(true);
          this.currentUser$.next(response.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  loginWithGoogle(): Observable<any> {
    throw new Error('Google OAuth not implemented yet');
  }

  forgotPassword(phone: string): Observable<any> {
    throw new Error('Forgot password not implemented yet');
  }

  verifyOtp(phone: string, otp: string): Observable<any> {
    throw new Error('OTP verification not implemented yet');
  }

  resetPassword(phone: string, newPassword: string): Observable<any> {
    throw new Error('Reset password not implemented yet');
  }

  updateProfile(data: { name?: string; email?: string; phone?: string; dob?: string; address?: string }): Observable<any> {
    const user = this.currentUser$.value;
    const userId = user?._id || user?.id;
    if (!userId) {
      return throwError(() => new Error('Not authenticated'));
    }
    return this.http.patch<any>(`${this.apiUrl}/users/${userId}`, data).pipe(
      tap((response) => {
        const updated = { ...this.currentUser$.value, ...(response.user ?? response.data ?? {}) };
        this.storageService.set('currentUser', updated);
        this.currentUser$.next(updated);
      }),
      catchError(this.handleError),
    );
  }

  logout(): void {
    this.storageService.remove('authToken');
    this.storageService.remove('currentUser');
    this.isAuthenticated$.next(false);
    this.currentUser$.next(null);
  }

  getToken(): string | null {
    return this.storageService.get<string>('authToken');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(friendlyErrorMessage(error)));
  }
}
