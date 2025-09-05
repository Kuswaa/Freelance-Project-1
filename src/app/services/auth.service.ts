// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  get isLoggedIn$(): Observable<boolean> {
    return this._isLoggedIn$.asObservable();
  }

  constructor() {}

  private hasToken(): boolean {
    return !!sessionStorage.getItem('token');
  }

  // ✅ Now accepts username + password and returns Observable
  login(username: string, password: string): Observable<boolean> {
    if (username && password) {
      const fakeToken = `${username}-session-token`;
      sessionStorage.setItem('token', fakeToken);
      this._isLoggedIn$.next(true);
      return of(true);
    } else {
      return throwError(() => new Error('Invalid credentials'));
    }
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this._isLoggedIn$.next(false);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
}
