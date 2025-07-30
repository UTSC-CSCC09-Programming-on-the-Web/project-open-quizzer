import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})

export class LoginPage implements OnInit{
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  private googleClientId = '246084124226-5sl2r5124hl2ugd1hst63ko55k94p49u.apps.googleusercontent.com';
  private googleRedirectUri = 'http://localhost:3000/api/auth/google';
  
  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });


    //after redirect, the backend sends the token and we store it in localstorage.
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      this.router.navigate(['/dashboard']);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;
    console.log('Form Submitted:', { email, password });

    try {
      const res = await lastValueFrom(
        this.http.post<{ success: boolean; token?: string; error?: string }>(
          `${environment.apiBaseUrl}/auth/login`,
          { email, password }
        )
      );
      this.isLoading = false;
      if (res.success) {
        //storing the bearer token in the local storage
        localStorage.setItem('token', res.token!);
        alert('Login successful! Welcome to OpenQuizzer.');
        this.loginForm.reset();
        const token = localStorage.getItem('token')!;
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        const profile = await lastValueFrom(
          this.http.get<{ data: { user: { status: boolean } } }>(
            `${environment.apiBaseUrl}/auth/verify`,
            { headers }
          )
        );
        if (profile.data.user.status) {
          this.router.navigateByUrl('/');
        } else {
          this.router.navigateByUrl('/pay');
        }
      } else {
        this.errorMessage = res.error || 'Login failed';
      }
    } catch (err) {
      this.isLoading = false;
      this.errorMessage = 'Server error. Please try again later.';
      console.error(err);
    }
  }

  loginWithGoogle(): void {
    const authEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: this.googleClientId,
      redirect_uri: this.googleRedirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent'
    });

    window.location.href = `${authEndpoint}?${params.toString()}`;
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
