import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-active-quiz',
  imports: [],
  templateUrl: './active-quiz.html',
  styleUrl: './active-quiz.scss'
})
export class ActiveQuiz {
  quizId: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    // fetch quiz id from route url
    this.quizId = this.route.snapshot.params['id'] || 'Unknown';
  }

  closeQuiz(): void {
    const quizId = this.route.snapshot.params['id'];
    this.router.navigate(['/quiz-results', quizId]);
  }

}
