import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.scss',
})
export class SignupPage implements OnInit {
  signupForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordStrengthValidator(),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordStrengthValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.value;
      if (!password) return null;

      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const valid =
        hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
      return valid ? null : { passwordStrength: { value: control.value } };
    };
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: any } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = this.signupForm.value;
      console.log('Signup Form Submitted:', formData);

      setTimeout(() => {
        this.isLoading = false;
        console.log('Signup successful!');

        this.signupForm.reset();

        Object.keys(this.signupForm.controls).forEach((key) => {
          const control = this.signupForm.get(key);
          control?.markAsUntouched();
          control?.markAsPristine();
        });

        alert('Account created successfully!');
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach((key) => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);
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
      if (control.errors['passwordStrength']) {
        return 'Password must contain uppercase, lowercase, number, and special character';
      }
    }
    return '';
  }

  getPasswordStrength(): string {
    const password = this.signupForm.get('password')?.value;
    if (!password) return '';

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = [
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    ].filter(Boolean).length;

    if (strength === 0) return '';
    if (strength <= 2) return 'weak';
    if (strength === 3) return 'medium';
    return 'strong';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'strong':
        return '#27ae60';
      default:
        return '#e1e5e9';
    }
  }

  getFormError(): string {
    if (
      this.signupForm.errors?.['passwordMismatch'] &&
      this.signupForm.get('confirmPassword')?.touched
    ) {
      return 'Passwords do not match';
    }
    return '';
  }
}
