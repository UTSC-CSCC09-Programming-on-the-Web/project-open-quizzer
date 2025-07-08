import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: '', redirectTo: 'student/join', pathMatch: 'full' },   // optional default
  {
    path: 'student',
    loadChildren: () =>
      import('./student/student.module').then(m => m.StudentModule)
  }
];
