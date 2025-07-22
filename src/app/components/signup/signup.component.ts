import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Auth } from '@angular/fire/auth'; // ✅ DI token
import { createUserWithEmailAndPassword } from 'firebase/auth'; // ✅ Firebase function

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;

  private fb = inject(FormBuilder);
  private auth = inject(Auth); // ✅ works now

  constructor() {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSignup(): void {
    const username: string = this.signupForm.value.username;
    const password: string = this.signupForm.value.password;
    const fakeEmail: string = `${username}@dummy.com`;

    createUserWithEmailAndPassword(this.auth, fakeEmail, password)
      .then((res) => {
        console.log('✅ User created:', res.user);
      })
      .catch((err) => {
        console.error('❌ Signup error:', err.message || err);
      });
  }
}
