import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-answer-results',
  imports: [CommonModule],
  templateUrl: './answer-results.html',
  styleUrl: './answer-results.scss'
})
export class AnswerResults implements OnInit {
  quizId: string = '';
  quiz: any = null;
  submittedAnswer: any = null;
  quizClosed: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    // Get data passed from answer-page component
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.quiz = navigation.extras.state['quiz'];
      this.quizId = navigation.extras.state['quizId'];
      this.submittedAnswer = navigation.extras.state['submittedAnswer'];
      this.quizClosed = navigation.extras.state['quizClosed'] || false;
    }
  }

  ngOnInit(): void {
    // Get quiz ID from route params as fallback
    this.quizId = this.route.snapshot.params['id'] || this.quizId;
    
    // Always load full quiz data from API to ensure we have all properties
    // Router state might only contain partial data (id, title) but not answer, difficulty
    this.loadQuizData();
    
    console.log('Results page loaded with:', {
      quiz: this.quiz,
      quizId: this.quizId,
      submittedAnswer: this.submittedAnswer,
      quizClosed: this.quizClosed
    });
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

  // Copy difficulty methods from quiz-results component
  getDifficultyLevel(): number {
    return this.quiz?.difficulty || 3;
  }

  getDifficultyText(): string {
    const level = this.getDifficultyLevel();
    const difficultyMap: { [key: number]: string } = {
      1: 'Very Easy',
      2: 'Easy', 
      3: 'Moderate',
      4: 'Hard',
      5: 'Very Hard'
    };
    return difficultyMap[level] || 'Moderate';
  }

  rejoinQuiz(): void {
    this.router.navigate(['/student/join']);
  }

  returnHome(): void {
    this.router.navigate(['']);
  }
}
