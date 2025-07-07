import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { QuizMaster } from './components/quiz-master/quiz-master';
import { QuizTaker } from './components/quiz-taker/quiz-taker';

export const routes: Routes = [
  { path: '', component: Home },                    // Home page
  { path: 'quiz-master', component: QuizMaster },   // Quiz master page
  { path: 'quiz-taker', component: QuizTaker },     // Quiz taker page
  { path: '**', redirectTo: '' }                    // Else route -> redirect to home
];
