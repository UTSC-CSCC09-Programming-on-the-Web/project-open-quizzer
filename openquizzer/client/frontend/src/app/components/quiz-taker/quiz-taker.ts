import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-taker',
  imports: [CommonModule],
  templateUrl: './quiz-taker.html',
  styleUrl: './quiz-taker.scss'
})
export class QuizTaker {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/home']);
  }

  joinQuiz(): void {
    this.router.navigate(['/student/join']);
  }
}
