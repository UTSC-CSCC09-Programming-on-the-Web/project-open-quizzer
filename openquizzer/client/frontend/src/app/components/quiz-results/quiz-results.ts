import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-quiz-results',
  imports: [],
  templateUrl: './quiz-results.html',
  styleUrl: './quiz-results.scss'
})
export class QuizResults {
  quizId: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    // fetch quiz id from route url
    this.quizId = this.route.snapshot.params['id'] || 'Unknown';
  }

  viewQuiz(): void {
    this.router.navigate(['/quiz-list']);
  }

  navigateToQuizMaster(): void {
    this.router.navigate(['/quiz-master']);
  }
}
