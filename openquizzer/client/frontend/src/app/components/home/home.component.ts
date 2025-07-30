import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToQuizMaster(): void {
    this.router.navigate(['/quiz-master']);
  }

  navigateToQuizTaker(): void {
    this.router.navigate(['/quiz-taker']);
  }

  navigateToCredits(): void {
    this.router.navigate(['/credits']);
  }
}