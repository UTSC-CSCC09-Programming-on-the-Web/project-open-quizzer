import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-quiz-list',
  imports: [CommonModule],
  templateUrl: './quiz-list.html',
  styleUrl: './quiz-list.scss'
})
export class QuizList {
  constructor(private router: Router) {}

  activateQuiz(quizId: string): void {
    this.router.navigate(['/active-quiz', quizId]);
  }

  goBack(): void {
    this.router.navigate(['/quiz-master']);
  }
}
