import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap, firstValueFrom, Observable, map } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from '../../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.checkExistingAuth();
  }

  private checkExistingAuth(): void {
    this.http.get<any>(`${this.baseUrl}/verify`, { withCredentials: true })
    .subscribe({
      next: () => this.isAuthenticatedSubject.next(true),
      error: () => this.isAuthenticatedSubject.next(false)
    });
  }

  getUser() {
    return this.currentUser$;
  }

  getUserSubscription() {
    return this.currentUser$;
  }

  isAuthenticated() {
    return this.isAuthenticated$;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return firstValueFrom(
      this.http
        .post<AuthResponse>(`${this.baseUrl}/login`, credentials, {
          withCredentials: true, // Important for cookies
        })
        .pipe(
          tap((response) => {
            this.handleAuthSuccess(response);
            this.isAuthenticatedSubject.next(true);
          })
        )
    );
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      return firstValueFrom(
        this.http
          .post<AuthResponse>(`${this.baseUrl}/signup`, userData, {
            withCredentials: true,
          })
          .pipe(
            tap((response) => {
              this.handleAuthSuccess(response);
            })
          )
      );
    } catch (error: any) {
      if (error.status === 429) {
        throw new Error('Zbyt wiele prób. Spróbuj ponownie później.');
      }
      throw error;
    }
  }

  logout(): void {
    // Call backend logout to clear cookies
    this.http
      .post(`${this.baseUrl}/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          this.router.navigate(['/']);
        },
        error: () => {
          // Even if backend call fails, clear frontend state
          this.currentUserSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          this.router.navigate(['/']);
        },
      });
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const { user } = response;
    // No need to store anything manually - cookies are set by backend
    this.currentUserSubject.next(user);
  }

  private getUserFromCookie(): User | null {
    const userCookie = this.getCookie('userInfo');
    if (userCookie) {
      try {
        return JSON.parse(decodeURIComponent(userCookie));
      } catch {
        return null;
      }
    }
    return null;
  }

  private hasAuthCookie(): boolean {
    return !!this.getCookie('authToken');
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getUserFromCookie() && this.hasAuthCookie();
  }

  isAdmin(): Observable<boolean> {
    console.log("Checking if user is admin");
    return this.http.get<{ isAdmin : boolean }>(`${this.baseUrl}/isAdmin`, { withCredentials: true })
    .pipe(
      map((response) => {
        console.log('isAdmin check response:', response);
        return response.isAdmin;
      })
    );
  }

  isUser(): boolean {
    const user = this.getUserFromCookie();
    return user?.role === 'USER' || user?.role === 'ADMIN';
  }
}
