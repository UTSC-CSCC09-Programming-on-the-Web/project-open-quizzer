import { Component } from '@angular/core';
// import modules from angular library to use a reactive angular form
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-masterform',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './masterform.html',
  styleUrl: './masterform.scss',
})
export class Masterform {
  quizForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.quizForm = this.formBuilder.group({
      questionTitle: ['', [Validators.required, Validators.minLength(3)]],
      answer: ['', [Validators.required]],
      difficultyLevel: [
        3,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ], // 1-5 scale, default 3
      time_limit: ['', [Validators.required, this.time_limitValidator]], // ✅ Add Validators.required
    });
  }

  // Updated validator for MM:SS format - now required
  time_limitValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value) {
      return null; // Let the required validator handle empty values
    }

    const timePattern = /^([0-5]?[0-9]):([0-5]?[0-9])$/;
    if (!timePattern.test(control.value)) {
      return { invalidTimeFormat: true };
    }

    const [minutes, seconds] = control.value.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds === 0) {
      return { zeroTime: true };
    }

    if (totalSeconds > 3600) {
      // Max 60 minutes
      return { maxTimeExceeded: true };
    }

    return null;
  }

  // Convert MM:SS to total seconds
  private convertTimeToSeconds(timeString: string): number | null {
    if (!timeString) return null;

    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
  }

  onSubmit(): void {
    if (this.quizForm.valid) {
      console.log('Quiz Form Submitted:', this.quizForm.value);

      // Generate random quiz ID
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      const quizId = (randomArray[0] % 900000) + 100000;

      const quizData = {
        id: quizId,
        userid: '000000', // placeholder for now
        title: this.quizForm.get('questionTitle')?.value,
        answer: this.quizForm.get('answer')?.value,
        time_limit: this.convertTimeToSeconds(
          this.quizForm.get('time_limit')?.value
        ),
        difficulty: this.quizForm.get('difficultyLevel')?.value,
      };

      // actually call backend API
      this.http.post('http://localhost:3000/api/quiz', quizData).subscribe({
        next: (response: any) => {
          console.log('Quiz created successfully:', response);
          alert(`Quiz created successfully! \nQuiz Code: ${response.quiz.id}`);
          // Clear form after submission
          this.clearForm();
        },
        error: (error: any) => {
          console.error('Error creating quiz. Please try again.');
          alert('Failed to create quiz. Please try again.');
        },
      });
    } else {
      Object.keys(this.quizForm.controls).forEach((field) => {
        const control = this.quizForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  clearForm(): void {
    this.quizForm.reset({
      questionTitle: '',
      answer: '',
      difficultyLevel: 3,
      time_limit: '',
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
