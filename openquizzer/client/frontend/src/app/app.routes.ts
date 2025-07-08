import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { QuizMaster } from './components/quiz-master/quiz-master';
import { QuizTaker } from './components/quiz-taker/quiz-taker';
import { QuizList } from './components/quiz-list/quiz-list';
import { ActiveQuiz } from './components/active-quiz/active-quiz';
import { QuizResults } from './components/quiz-results/quiz-results';

export const routes: Routes = [
  { path: '', component: Home },                           // Home page
  { path: 'quiz-master', component: QuizMaster },          // Quiz master home page
  { path: 'quiz-taker', component: QuizTaker },            // Quiz taker home page
  { path: 'quiz-list', component: QuizList },              // Quiz list home page
  { path: 'active-quiz/:id', component: ActiveQuiz },      // Active quiz
  { path: 'quiz-results/:id', component: QuizResults },    // Quiz results 
  { path: '**', redirectTo: '' }                           // Else route -> redirect to home
];