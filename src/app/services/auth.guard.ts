// src/app/services/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const loggedIn = this.authService.isAuthenticated();
    console.log('🔍 [AuthGuard] canActivate? ', loggedIn, 'Token:', this.authService.getToken());
    
    if (!loggedIn) {
      console.warn('🔒 [AuthGuard] Redirecting to /login');
      this.router.navigate(['/login']);
      return false;
    }
    
    console.log('✅ [AuthGuard] Access granted');
    return true;
  }

}
