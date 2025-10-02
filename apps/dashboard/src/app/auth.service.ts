import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LoginDto, User, Role } from '@task-management-take-home/data/browser';

interface DecodedToken {
  email: string;
  sub: number;
  role: Role;
  organizationId: number;
  exp: number;
  iat: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly TOKEN_KEY = 'access_token';

  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.currentUser());

  constructor() {
    this.loadUserFromToken();
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  private loadUserFromToken() {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        this.currentUser.set({
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
          organizationId: decoded.organizationId,
        } as User);
      } else {
        this.logout();
      }
    }
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  login(credentials: LoginDto) {
    return this.http
      .post<{ access_token: string }>('api/auth/login', credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem(this.TOKEN_KEY, response.access_token);
          this.loadUserFromToken();
          this.router.navigate(['/tasks']);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
