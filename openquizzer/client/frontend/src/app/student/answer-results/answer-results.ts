import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-answer-results',
  imports: [CommonModule],
  templateUrl: './answer-results.html',
  styleUrl: './answer-results.scss',
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

  // Email result properties
  isEmailLoading: boolean = false;
  emailSent: boolean = false;
  emailError: string | null = null;

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
    this.quizId = this.route.snapshot.params['id'] || this.quizId;

    // Always load full quiz data from API first
    this.loadQuizData().then(() => {
      // Only start LLM scoring after quiz data is loaded
      if (this.submittedAnswer && this.submittedAnswer !== 'Manual navigation') {
        this.generateScore();
      }
    });
    
    console.log('Results page loaded with:', {
      quiz: this.quiz,
      quizId: this.quizId,
      submittedAnswer: this.submittedAnswer,
      quizClosed: this.quizClosed,
    });
  }

  loadQuizData(): Promise<void> { // return promise becuase is is loading the llm call which may fail
    return new Promise((resolve, reject) => {
      this.isLoading = true;
      this.error = null;

      this.http.get<{ ok: boolean; message: string; quiz: any }>(
        `${environment.apiBaseUrl}/quiz/${this.quizId}`
      ).subscribe({
        next: (response) => {
          if (response.ok) {
            this.quiz = response.quiz;
          } else {
            this.error = response.message || 'Failed to load quiz data';
          }
          this.isLoading = false;
          resolve();
        },
        error: (error) => {
          console.error('Error loading quiz:', error);
          this.error = 'Failed to load quiz data. Please try again.';
          this.isLoading = false;
          reject(error);
        }
      });
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
      5: 'Very Hard',
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
    }>(`${environment.apiBaseUrl}/score_answers`, {
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

  sendResultsViaEmail(): void {
    this.isEmailLoading = true;
    this.emailError = null;
    this.emailSent = false;

    const token = localStorage.getItem('token');
    if (!token) {
      this.emailError = 'You must be logged in to email results';
      this.isEmailLoading = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Prepare email data
    const emailData = {
      quizName: this.quiz?.title || 'Unknown Quiz',
      quizQuestion: this.quiz?.title || 'No question available',
      expectedAnswer: this.quiz?.answer || 'No expected answer available',
      userAnswer: this.submittedAnswer || 'No answer submitted'
    };

    this.http.post(`${environment.apiBaseUrl}/email/send-quiz-results`, emailData, { headers })
      .subscribe({
        next: (response: any) => {
          console.log('Email sent successfully:', response);
          this.emailSent = true;
          this.isEmailLoading = false;
        },
        error: (error: any) => {
          console.error('Email sending failed:', error);
          this.emailError = error.error?.error || 'Failed to send email';
          this.isEmailLoading = false;
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
