import { NgModule } from '@angular/core';
import { RouterModule }  from '@angular/router';
import { STUDENT_ROUTES } from './student.routes';
import { JoinQuizComponent } from './join-quiz/join-quiz.component';
import { AnswerFormComponent } from './answer-form/answer-form.component';
import { AnswerPageComponent } from './answer-page/answer-page.component';


//hold all the standalone components that we have to import in our student module
@NgModule({
  imports: [
    RouterModule.forChild(STUDENT_ROUTES),
    JoinQuizComponent,
    AnswerFormComponent,
    AnswerPageComponent
  ]
})
export class StudentModule {}
