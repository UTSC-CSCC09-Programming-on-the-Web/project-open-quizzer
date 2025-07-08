import { Routes } from '@angular/router';
import { PayComponent } from './billing/subscripe/subscribe.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pay', pathMatch: 'full' }, 
  { path: 'pay', component: PayComponent },
  {
    path: 'student',
    loadChildren: () =>
      import('./student/student.module').then(m => m.StudentModule)
  }
];
