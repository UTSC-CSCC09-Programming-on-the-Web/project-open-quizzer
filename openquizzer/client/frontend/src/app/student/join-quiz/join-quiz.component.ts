import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-join-quiz',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './join-quiz.component.html',
  styleUrls: ['./join-quiz.component.scss']
})
export class JoinQuizComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isConnecting = false;
  errorMessage = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      quizCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      nickname: ['', [Validators.required, Validators.minLength(2)]]
    });

    // Listen for socket events
    this.subscriptions.push(
      this.socketService.onQuizJoined().subscribe((data) => {
        console.log('Successfully joined quiz:', data);
        this.isConnecting = false;
        this.router.navigate(['/student/answer'], { 
          state: { quiz: data } 
        });
      }),

      this.socketService.onJoinError().subscribe((error) => {
        console.error('Failed to join quiz:', error);
        this.errorMessage = error.message;
        this.isConnecting = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  submit(): void {
    if (this.form.invalid) return;
    
    this.isConnecting = true;
    this.errorMessage = '';
    
    const { quizCode, nickname } = this.form.value;
    console.log('Joining quiz:', quizCode, 'as', nickname);
    
    // Use socket instead of HTTP request
    this.socketService.joinQuiz(quizCode, nickname);
  }

  get quizCode() { return this.form.get('quizCode'); }
  get nickname() { return this.form.get('nickname'); }
}
