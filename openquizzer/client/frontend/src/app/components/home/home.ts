import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  constructor(private router: Router) {}

  navigateToQuizMaster(): void {
    this.router.navigate(['/quiz-master']);
  }

  navigateToQuizTaker(): void {
    this.router.navigate(['/quiz-taker']);
  }
}
