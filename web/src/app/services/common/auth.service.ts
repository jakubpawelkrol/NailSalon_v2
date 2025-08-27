import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap, firstValueFrom } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from '../../models/auth.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private currentUser$ = this.currentUserSubject.asObservable();

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.checkExistingAuth();
  }

  private checkExistingAuth(): void {
    const user = this.getUserFromCookie();
    if (user && this.hasAuthCookie()) {
      this.currentUserSubject.next(user);
    } else {
      this.currentUserSubject.next(null);
    }
  }

  getUser() {
    return this.currentUser$;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('Logging in with credentials:', credentials);
    return firstValueFrom(
      this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials, {
        withCredentials: true // Important for cookies
      }).pipe(
        tap((response) => {
          console.log('Login response:', response);
          this.handleAuthSuccess(response);
        })
      )
    );
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    console.log('Signing up user:', userData);
    return firstValueFrom(
      this.http.post<AuthResponse>(`${this.baseUrl}/signup`, userData, {
        withCredentials: true
      }).pipe(
        tap((response) => {
          console.log('Signup response:', response);
          this.handleAuthSuccess(response);
        })
      )
    );
  }

  logout(): void {
    // Call backend logout to clear cookies
    this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.currentUserSubject.next(null);
        this.router.navigate(['/']);
      },
      error: () => {
        // Even if backend call fails, clear frontend state
        this.currentUserSubject.next(null);
        this.router.navigate(['/']);
      }
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
        console.log('User cookie found:', userCookie);
        return JSON.parse(decodeURIComponent(userCookie));
      } catch {
        console.error("Failed to parse user cookie");
        return null;
      }
    }
    return null;
  }

  private hasAuthCookie(): boolean {
    return !!this.getCookie('authToken');
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
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

  isAdmin(): boolean {
    const user = this.getUserFromCookie();
    return user?.role === 'ADMIN';
  }

  isUser(): boolean {
    const user = this.getUserFromCookie();
    return user?.role === 'USER' || user?.role === 'ADMIN';
  }
}
