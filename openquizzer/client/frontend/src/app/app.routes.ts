import { Routes } from '@angular/router';
import { PayComponent } from './billing/subscripe/subscribe.component';
import { Home } from './components/home/home';
import { QuizMaster } from './components/quiz-master/quiz-master';
import { QuizTaker } from './components/quiz-taker/quiz-taker';
import { QuizList } from './components/quiz-list/quiz-list';
import { ActiveQuiz } from './components/active-quiz/active-quiz';
import { QuizResults } from './components/quiz-results/quiz-results';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'quiz-master', component: QuizMaster },
  { path: 'quiz-taker', component: QuizTaker },
  { path: 'quiz-list', component: QuizList },
  { path: 'active-quiz/:id', component: ActiveQuiz },
  { path: 'quiz-results/:id', component: QuizResults },
  { path: 'payhome', redirectTo: 'pay', pathMatch: 'full' },
  { path: 'pay', component: PayComponent },
  {
    path: 'student',
    loadChildren: () =>
      import('./student/student.module').then(m => m.StudentModule)
  },
  { path: '**', redirectTo: '' }  // ⬅️ wildcard route always last
];
