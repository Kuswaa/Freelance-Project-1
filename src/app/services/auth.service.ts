// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

  login(username: string, password: string): Observable<void> {
    // Transform username into a dummy email for Firebase
    const email = username.includes('@') ? username : `${username}@dummy.com`;
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(() => {})
    );
  }

  logout(): Observable<void> {
    return from(this.auth.signOut());
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }
}
