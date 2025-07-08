import { Component } from '@angular/core';
// import modules from angular library to use a reactive angular form
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-masterform',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './masterform.html',
  styleUrl: './masterform.scss'
})
export class Masterform {
  quizForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.quizForm = this.formBuilder.group({
      questionTitle: ['', [Validators.required, Validators.minLength(3)]],
      answer: ['', [Validators.required]],
      confidenceLevel: [3, [Validators.required, Validators.min(1), Validators.max(5)]] // 1-5 scale, default 3
    });
  }

  onSubmit(): void {
    if (this.quizForm.valid) {
      console.log('Quiz Form Submitted:', this.quizForm.value);
      
      // TODO: Send data to backend/service
      // For now, just log the form data
      
      // Clear form after submission
      this.clearForm();
      
      // Show success message
      alert('Quiz submitted successfully!');
    } else {
      Object.keys(this.quizForm.controls).forEach(field => {
        const control = this.quizForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  clearForm(): void {
    this.quizForm.reset({
      questionTitle: '',
      answer: '',
      confidenceLevel: 3
    });
  }
  // catchall to check if any field has error
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.quizForm.get(fieldName);
    return field ? field.hasError(errorType) && field.touched : false;
  }

  // fetch any error messages
  getErrorMessage(fieldName: string): string {
    const field = this.quizForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${requiredLength} characters`;
      }
      if (field.errors['min']) {
        return `Minimum value is ${field.errors['min'].min}`;
      }
      if (field.errors['max']) {
        return `Maximum value is ${field.errors['max'].max}`;
      }
    }
    return '';
  }
}
