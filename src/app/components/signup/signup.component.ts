import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  signupForm: FormGroup;

  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  constructor() {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSignup() {
    if (this.signupForm.invalid) return;

    const username = this.signupForm.value.username.trim();
    const password = this.signupForm.value.password;
    const fakeEmail = `${username}@dummy.com`;

    try {
      const res = await createUserWithEmailAndPassword(this.auth, fakeEmail, password);
      console.log('✅ User created:', res.user);
      this.router.navigate(['/home']);
    } catch (err: any) {
      console.error('❌ Signup error:', err.message || err);
    }
  }
}
