import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder,private http: HttpClient) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit(): Promise<void>{
    if (this.loginForm.invalid) {
    this.markFormGroupTouched();
    return;
    }
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      try {
        const res = await lastValueFrom(
          this.http.post<{ success: boolean; token?: string; error?: string }>(
            'http://localhost:3000/api/auth/login',
            { email, password }
          )
        );
        this.isLoading = false;
        if (res.success) {
          localStorage.setItem('token', res.token!);
          alert('Login successful! Welcome to OpenQuizzer.');
          this.loginForm.reset();
        } 
        else {
          this.errorMessage = res.error || 'Login failed';
        }
      } 
      catch (err) {
      this.isLoading    = false;
      this.errorMessage = 'Server error. Please try again later.';
      console.error(err);
      }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${
          controlName.charAt(0).toUpperCase() + controlName.slice(1)
        } is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `${
          controlName.charAt(0).toUpperCase() + controlName.slice(1)
        } must be at least ${
          control.errors['minlength'].requiredLength
        } characters`;
      }
    }
    return '';
  }
}
