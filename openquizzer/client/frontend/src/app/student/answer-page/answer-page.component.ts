// Update: src/app/student/answer-page/answer-page.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
  isSubmitting = false;
  submitted = false;
  private subscriptions: Subscription[] = [];

  constructor(
    public router: Router,
    private socketService: SocketService
  ) {
    // Get quiz data from navigation state
    const navigation = this.router.getCurrentNavigation();
    this.quiz = navigation?.extras?.state?.['quiz'] || null;
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
        
        // Show success message briefly, then redirect to join page
        setTimeout(() => {
          this.router.navigate(['/student/join']);
        }, 10000); // 10 second delay to show success message
      }),

      this.socketService.onAnswerError().subscribe((error) => {
        console.error('Answer submission error:', error);
        this.isSubmitting = false;
        alert('Failed to submit answer. Please try again.');
      }),

      this.socketService.onQuizClosed().subscribe((data) => {
        console.log('Quiz closed:', data);
        alert('Quiz has been closed by the instructor');
        this.router.navigate(['/student/join']);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handleSubmit(answer: string): void {
    if (this.isSubmitting || this.submitted) return;
    
    this.isSubmitting = true;
    console.log('Submitting answer:', answer);
    
    // Use socket instead of HTTP request
    this.socketService.submitAnswer(answer);
  }
}