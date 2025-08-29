import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loginForm: FormGroup;
  errorMessage: string = '';

  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  constructor() {
  this.loginForm = this.fb.group({
  username: ['', [Validators.required]],
  password: ['', Validators.required],
  });
}

onLogin() {
  this.errorMessage = '';

  console.log('Form valid?', this.loginForm.valid);
  console.log('Form values:', this.loginForm.value);


  if (this.loginForm.valid) {
    const { username, password } = this.loginForm.value;

    // Convert username to dummy email
    const dummyEmail = `${username}@dummy.com`; // 👈 Important

    console.log('Attempting login with:', dummyEmail, password);

    signInWithEmailAndPassword(this.auth, dummyEmail, password)
      .then(() => this.router.navigate(['/home']))
      .catch((error) => {
        console.error('Login error:', error);
        switch (error.code) {
          case 'auth/user-not-found':
            this.errorMessage = 'User not found';
            break;
          case 'auth/wrong-password':
            this.errorMessage = 'Incorrect password';
            break;
          case 'auth/invalid-email':
            this.errorMessage = 'Invalid email';
            break;
          default:
            this.errorMessage = 'Login failed. Try again.';
        }
      });
  } else {
    this.errorMessage = 'Please fill in all fields correctly';
  }
}

}
