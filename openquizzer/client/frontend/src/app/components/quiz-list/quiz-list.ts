import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface Quiz {
  id: string;
  title: string;
  answer: string;
  userid: string;
  status: string;
  created_at: string;
}

@Component({
  selector: 'app-quiz-list',
  imports: [CommonModule],
  templateUrl: './quiz-list.html',
  styleUrl: './quiz-list.scss'
})
export class QuizList implements OnInit {
  quizzes: Quiz[] = [];
  isLoading = true;
  error: string | null = null;
  currentUtcTime: string = ''; // Add utc time property

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadQuizzes();
    this.updateUtcTime(); // Initialize utc time
  }

  loadQuizzes(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<{ ok: boolean; message: string; quizzes: Quiz[] }>('http://localhost:3000/api/quiz')
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.quizzes = response.quizzes;
          } else {
            this.error = response.message || 'Failed to load quizzes';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading quizzes:', error);
          this.error = 'Failed to load quizzes. Please try again.';
          this.isLoading = false;
        }
      });
  }

  trackByQuizId(index: number, quiz: Quiz): string {
    return quiz.id;
  }

  activateQuiz(quizId: string): void {
  this.http.patch(`http://localhost:3000/api/quiz/${quizId}`, {})
    .subscribe({
      next: (response: any) => {
        console.log('Quiz activated successfully:', response);
        // Update the local quiz status immediately
        const quiz = this.quizzes.find(q => q.id === quizId);
        if (quiz) {
          quiz.status = 'active';
        }
        // navigate to active quiz page
        this.router.navigate(['/active-quiz', quizId]);
      },
      error: (error) => {
        console.error('Failed to activate quiz:', error);
        alert('Failed to activate quiz. Please try again.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/quiz-master']);
  }

  refreshQuizzes(): void {
    this.loadQuizzes();
    this.updateUtcTime(); // Update UTC time on refresh
  }

  // Add UTC timer update method
  updateUtcTime(): void {
    const now = new Date();
    
    // Format with AM/PM
    const utcTimeFormatted = now.toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    // Replace comma with dash
    this.currentUtcTime = utcTimeFormatted.replace(',', ' -');
  }
  
  // Keep your existing getFormattedDate method unchanged
  getFormattedDate(utcTimeString: string): string {
    if (!utcTimeString) return 'Unknown';
    
    try {
      // Don't add 'Z' if the timestamp already has timezone info
      let dateToFormat: Date;
      
      if (utcTimeString.includes('T') && (utcTimeString.endsWith('Z') || utcTimeString.includes('+'))) {
        dateToFormat = new Date(utcTimeString);
      } else {
        dateToFormat = new Date(utcTimeString + 'Z');
      }
      if (isNaN(dateToFormat.getTime())) {
        return utcTimeString; // Fallback to original string
      }
      
      // Format using local timezone
      return dateToFormat.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date:', utcTimeString, error);
      return utcTimeString; // Fallback to original string
    }
  }
}
