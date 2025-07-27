// Update: src/app/student/answer-page/answer-page.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';
import { AnswerFormComponent } from '../answer-form/answer-form.component';

@Component({
  selector: 'app-answer-page',
  standalone: true,
  imports: [CommonModule, AnswerFormComponent],
  templateUrl: './answer-page.component.html',
  styleUrls: ['./answer-page.component.scss']
})
export class AnswerPageComponent implements OnInit, OnDestroy {
  quiz: any;
  quizId: string = ''; 
  isSubmitting = false;
  submitted = false;
  answerConfirmed = false;
  submittedAnswerText: string = '';
  waitingForQuizEnd = false; // New flag for waiting state
  private subscriptions: Subscription[] = [];

  constructor(
    public router: Router,
    private route: ActivatedRoute, 
    private socketService: SocketService
  ) {
    // Get quiz data from navigation state
    const navigation = this.router.getCurrentNavigation();
    this.quiz = navigation?.extras?.state?.['quiz'] || null;
    // fetching quiz id from url
    this.quizId = this.route.snapshot.params['id'] || 'Unknown';
  }

  ngOnInit(): void {
    if (!this.quiz) {
      // If no quiz data, redirect back to join page
      this.router.navigate(['/student/join']);
      return;
    }

    // Listen for socket events
    this.subscriptions.push(
      this.socketService.onAnswerConfirmed().subscribe((data) => {
        console.log('Answer confirmed:', data);
        this.isSubmitting = false;
        this.submitted = true;
        this.answerConfirmed = true;
        this.waitingForQuizEnd = true; // Set waiting flag
        
        // Remove auto-redirect - now wait for quiz-closed event
        console.log('Answer submitted successfully. Waiting for quiz to end...');
      }),

      this.socketService.onAnswerError().subscribe((error) => {
        console.error('Answer submission error:', error);
        this.isSubmitting = false;
        this.submittedAnswerText = ''; // Clear on error
        alert('Failed to submit answer. Please try again.');
      }),

      // Key navigation listener - navigate here when quiz master closes quiz
      this.socketService.onQuizClosed().subscribe((data) => {
        console.log('Quiz closed by instructor:', data);
        
        // Navigate to results with the stored answer
        this.router.navigate(['/student/results', this.quizId], {
          state: {
            quiz: this.quiz,
            quizId: this.quizId,
            submittedAnswer: this.submittedAnswerText,
            quizClosed: true
          }
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleSubmit(answer: string): void {
    if (this.isSubmitting || this.submitted) return;
    
    this.isSubmitting = true;
    this.submittedAnswerText = answer;
    console.log('Submitting answer:', answer);
    
    this.socketService.submitAnswer(answer);
  }
}