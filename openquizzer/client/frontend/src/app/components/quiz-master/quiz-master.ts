import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Masterform } from '../quizform/masterform/masterform';

@Component({
  selector: 'app-quiz-master',
  imports: [CommonModule, Masterform],
  templateUrl: './quiz-master.html',
  styleUrl: './quiz-master.scss'
})
export class QuizMaster {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']);
  }
}