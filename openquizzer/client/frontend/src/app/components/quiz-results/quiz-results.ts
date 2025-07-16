import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-results',
  imports: [CommonModule],
  templateUrl: './quiz-results.html',
  styleUrl: './quiz-results.scss'
})
export class QuizResults implements OnInit {
  quizId: string;
  quiz: any = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    // fetch quiz id from route url
    this.quizId = this.route.snapshot.params['id'] || 'Unknown';
  }

  ngOnInit(): void {
    this.loadQuizData();
  }

  loadQuizData(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<{ ok: boolean; message: string; quiz: any }>(`http://localhost:3000/api/quiz/${this.quizId}`)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.quiz = response.quiz;
          } else {
            this.error = response.message || 'Failed to load quiz data';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading quiz:', error);
          this.error = 'Failed to load quiz data. Please try again.';
          this.isLoading = false;
        }
      });
  }

  viewQuiz(): void {
    this.router.navigate(['/quiz-list']);
  }

  navigateToQuizMaster(): void {
    this.router.navigate(['/quiz-master']);
  }
}
