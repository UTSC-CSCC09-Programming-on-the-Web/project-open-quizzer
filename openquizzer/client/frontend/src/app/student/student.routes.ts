import { Routes } from '@angular/router';
import { JoinQuizComponent } from './join-quiz/join-quiz.component';
import { AnswerPageComponent } from './answer-page/answer-page.component';

//setting up the student routes of frontend
export const STUDENT_ROUTES: Routes = [
  { path: '', redirectTo: 'join', pathMatch: 'full' },
  { path: 'join', component: JoinQuizComponent },
  { path: 'answer', component: AnswerPageComponent }
];
