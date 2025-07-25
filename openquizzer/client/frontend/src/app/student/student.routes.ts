import { Routes } from '@angular/router';
import { JoinQuizComponent } from './join-quiz/join-quiz.component';
import { AnswerPageComponent } from './answer-page/answer-page.component';
import { AnswerResults } from './answer-results/answer-results';

//setting up the student routes of frontend
export const STUDENT_ROUTES: Routes = [
  { path: '', redirectTo: 'join', pathMatch: 'full' },
  { path: 'join', component: JoinQuizComponent },
  { path: 'answer/:id', component: AnswerPageComponent },
  { path: 'results/:id', component: AnswerResults }
];
