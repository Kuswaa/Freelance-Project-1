import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth, private router: Router) {
    this.user$ = authState(this.auth);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

logout() {
  signOut(this.auth)
    .then(() => {
      console.log('✅ Firebase signOut successful');
      this.router.navigate(['/login']).then(success => {
        if (success) {
          console.log('✅ Navigated to /login');
        } else {
          console.error('❌ Navigation to /login failed');
        }
      });
    })
    .catch((error) => {
      console.error('❌ Logout error:', error);
    });
}


  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
