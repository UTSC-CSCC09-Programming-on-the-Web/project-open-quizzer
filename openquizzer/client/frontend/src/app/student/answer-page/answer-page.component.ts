import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnswerFormComponent } from '../answer-form/answer-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-answer-page',
  standalone: true,
  imports: [CommonModule, AnswerFormComponent],
  templateUrl: './answer-page.component.html',
  styleUrls: ['./answer-page.component.scss']
})
export class AnswerPageComponent implements OnInit {
  //later we will load the quiz question from the backend db and render the prompt question
  prompt = 'This is a mock prompt';

  //singleton instance of the router to navigate through screens
  constructor(private router: Router) {}
  
  //runs on initialization
  ngOnInit(): void {
    //Doing nothing for now, later can add some functionality on initialization
  }
  
  handleSubmit(text: string) {
    console.log('Student submitted:', text);
    //later will send to backend or socket for AI summarizing
    //should return 404 for now.
    this.router.navigate(['/student/waiting']);
  }
}
