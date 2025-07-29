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
  
  // Add LLM scoring properties
  isLoadingScore: boolean = false;
  scoreError: string | null = null;
  scoreGenerated: boolean = false;
  llmScore: any = null;

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
    this.loadQuizData();
    
    // Start LLM scoring if we have a submitted answer
    if (this.submittedAnswer && this.submittedAnswer !== 'Manual navigation') {
      this.generateScore();
    }
    
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

  generateScore(): void {
    this.isLoadingScore = true;
    this.scoreError = null;

    console.log('Starting LLM scoring for student answer:', this.submittedAnswer);

    this.http.post<{ 
      success: boolean; 
      score?: number;
      feedback?: string;
      correctness?: number;
      error?: string; 
    }>(`http://localhost:3000/api/score_answers`, {
      quizId: this.quizId,
      studentAnswer: this.submittedAnswer,
      expectedAnswer: this.quiz?.answer,
      question: this.quiz?.title  
    })
    .subscribe({
      next: (response) => {
        console.log('LLM scoring response:', response);
        if (response.success) {
          this.llmScore = response;
          this.scoreGenerated = true;
        } else {
          this.scoreError = response.error || 'Failed to generate score';
        }
        this.isLoadingScore = false;
      },
      error: (error) => {
        console.error('Error generating score:', error);
        this.scoreError = 'Failed to generate score. Please try again.';
        this.isLoadingScore = false;
      }
    });
  }

  retryScoring(): void {
    this.generateScore();
  }

  rejoinQuiz(): void {
    this.router.navigate(['/student/join']);
  }

  returnHome(): void {
    this.router.navigate(['']);
  }
}
