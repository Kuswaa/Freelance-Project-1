// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) {}

  canActivate(): boolean {
    const loggedIn = !!this.auth.currentUser; // modular
    console.log('🔍 [AuthGuard] canActivate? ', loggedIn);

    if (!loggedIn) {
      console.warn('🔒 [AuthGuard] Redirecting to /login');
      this.router.navigate(['/login']);
      return false;
    }

    console.log('✅ [AuthGuard] Access granted');
    return true;
  }
}
