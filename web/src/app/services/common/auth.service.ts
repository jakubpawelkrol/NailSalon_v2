import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, firstValueFrom } from 'rxjs';
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
    const token = this.getToken();
    const user = this.getStoredUser();
    if (token && user && !this.isTokenExpired(token)) {
      this.currentUserSubject.next(user);
    } else {
      this.logout();
    }
  }

  getUser() {
    return this.currentUser$;
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('Logging in with credentials:', credentials);
    return firstValueFrom(
      this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials).pipe(
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
      this.http.post<AuthResponse>(`${this.baseUrl}/signup`, userData).pipe(
        tap((response) => {
          console.log('Signup response:', response);
          this.handleAuthSuccess(response);
        })
      )
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const { token, user } = response;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isAdmin(): boolean {
    const user = this.getStoredUser();
    return user?.role === 'ADMIN';
  }

  isUser(): boolean {
    const user = this.getStoredUser();
    return user?.role === 'USER' || user?.role === 'ADMIN';
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() > exp;
    } catch {
      return true;
    }
  }
}
