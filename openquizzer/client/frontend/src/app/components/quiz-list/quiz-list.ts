import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface Quiz {
  id: string;
  title: string;
  answer: string;
  userid: string;
  status: string;
  created_at: string;
}

@Component({
  selector: 'app-quiz-list',
  imports: [CommonModule],
  templateUrl: './quiz-list.html',
  styleUrl: './quiz-list.scss'
})
export class QuizList implements OnInit {
  quizzes: Quiz[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<{ ok: boolean; message: string; quizzes: Quiz[] }>('http://localhost:3000/api/quiz')
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.quizzes = response.quizzes;
          } else {
            this.error = response.message || 'Failed to load quizzes';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading quizzes:', error);
          this.error = 'Failed to load quizzes. Please try again.';
          this.isLoading = false;
        }
      });
  }

  trackByQuizId(index: number, quiz: Quiz): string {
    return quiz.id;
  }

  activateQuiz(quizId: string): void {
    this.router.navigate(['/active-quiz', quizId]);
  }

  goBack(): void {
    this.router.navigate(['/quiz-master']);
  }

  refreshQuizzes(): void {
    this.loadQuizzes();
  }
}
