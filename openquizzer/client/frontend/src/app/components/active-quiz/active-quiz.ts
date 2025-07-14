import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-active-quiz',
  imports: [CommonModule],
  templateUrl: './active-quiz.html',
  styleUrl: './active-quiz.scss'
})
export class ActiveQuiz implements OnInit, OnDestroy {
  quizId: string;
  participants: any[] = [];
  answers: any[] = [];
  private subscriptions: Subscription[] = [];

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
        this.participants = this.participants.filter(p => p.socketId !== data.socketId);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
