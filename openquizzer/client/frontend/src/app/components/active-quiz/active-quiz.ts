import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-active-quiz',
  imports: [],
  templateUrl: './active-quiz.html',
  styleUrl: './active-quiz.scss'
})
export class ActiveQuiz {
  quizId: string;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {
    // fetch quiz id from route url
    this.quizId = this.route.snapshot.params['id'] || 'Unknown';
  }

  closeQuiz(): void {
    const quizId = this.quizId;
    if (!quizId) {
      console.error('Quiz ID not found');
      return;
    }

    // Call the backend API to close the quiz
    this.http.patch(`http://localhost:3000/api/quiz/${quizId}/close`, {})
      .subscribe({
        next: (response: any) => {
          console.log('Quiz closed successfully:', response);
          // Navigate to quiz results page
          this.router.navigate(['/quiz-results', quizId]);
        },
        error: (error) => {
          console.error('Failed to close quiz:', error);
          // Still navigate to results even if API call fails
          this.router.navigate(['/quiz-results', quizId]);
        }
      });
  }

}
