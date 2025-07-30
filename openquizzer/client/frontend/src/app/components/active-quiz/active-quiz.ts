import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-active-quiz',
  imports: [CommonModule],
  templateUrl: './active-quiz.html',
  styleUrl: './active-quiz.scss',
})
export class ActiveQuiz implements OnInit, OnDestroy {
  quizId: string;
  quiz: any = null;
  participants: any[] = [];
  answers: any[] = [];
  private subscriptions: Subscription[] = [];

  // Timer properties
  time_limit: number | null = null; // Time limit in seconds
  timeRemaining: number | null = null; // Current remaining time
  timerDisplay: string = '';
  isTimerActive: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private socketService: SocketService
  ) {
    // fetch quiz id from route url
    this.quizId = this.route.snapshot.params['id'] || 'Unknown';
  }

  ngOnInit(): void {
    // Load quiz data first to get time limit
    this.loadQuizData();

    // Join the quiz room as quiz master
    this.socketService.activateQuiz(this.quizId);

    // Listen for real-time events
    this.subscriptions.push(
      this.socketService.onParticipantJoined().subscribe((data) => {
        console.log('Participant joined:', data);
        this.participants.push(data);
      }),

      this.socketService.onAnswerSubmitted().subscribe((data) => {
        console.log('Answer submitted:', data);
        this.answers.push(data);
      }),

      this.socketService.onParticipantLeft().subscribe((data) => {
        console.log('Participant left:', data);
        this.participants = this.participants.filter(
          (p) => p.socketId !== data.socketId
        );
      })
    );
  }

  loadQuizData(): void {
    this.http
      .get<{ ok: boolean; message: string; quiz: any }>(
        `${environment.apiBaseUrl}/quiz/${this.quizId}`
      )
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.quiz = response.quiz;
            this.time_limit = response.quiz.time_limit;

            // Start timer if there's a time limit
            if (this.time_limit && this.time_limit > 0) {
              this.startTimer();
            }
          } else {
            console.error('Failed to load quiz data:', response.message);
          }
        },
        error: (error) => {
          console.error('Error loading quiz:', error);
        },
      });
  }

  startTimer(): void {
    if (!this.time_limit) return;

    this.timeRemaining = this.time_limit;
    this.isTimerActive = true;
    this.updateTimerDisplay();

    // Create timer that updates every second
    const timer = interval(1000).subscribe(() => {
      if (this.timeRemaining !== null && this.timeRemaining > 0) {
        this.timeRemaining--;
        this.updateTimerDisplay();
      } else {
        // Timer finished
        this.isTimerActive = false;
        this.timerDisplay = "Time's up!";
        timer.unsubscribe();
      }
    });

    this.subscriptions.push(timer);
  }

  updateTimerDisplay(): void {
    if (this.timeRemaining === null) {
      this.timerDisplay = '';
      return;
    }

    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    this.timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  getTimerClass(): string {
    if (!this.isTimerActive && this.timerDisplay === "Time's up!")
      return 'timer-finished'; // ✅ New case
    if (!this.isTimerActive || this.timeRemaining === null) return '';

    if (this.timeRemaining <= 10) return 'timer-critical';
    if (this.timeRemaining <= 30) return 'timer-warning';
    return 'timer-normal';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  closeQuiz(): void {
    const quizId = this.quizId;
    if (!quizId) {
      console.error('Quiz ID not found');
      return;
    }

    // Close via socket first
    this.socketService.closeQuiz(quizId);

    // Then update database status
    this.http
      .patch(`${environment.apiBaseUrl}/quiz/${quizId}/close`, {})
      .subscribe({
        next: (response: any) => {
          console.log('Quiz closed successfully:', response);
          // Navigate to quiz results page with answers
          this.router.navigate(['/quiz-results', quizId], {
            state: {
              participants: this.participants.length,
              totalAns: this.answers.length,
              submittedAnswers: this.answers 
            }
          });
        },
        error: (error) => {
          console.error('Failed to close quiz:', error);
          // Still navigate to results even if API call fails
          this.router.navigate(['/quiz-results', quizId], {
            state: {
              participants: this.participants.length,
              totalAns: this.answers.length,
              submittedAnswers: this.answers 
            }
          });
        },
      });
  }
}
