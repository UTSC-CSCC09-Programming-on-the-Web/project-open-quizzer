import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

//Decorators
@Component({
  selector: 'app-answer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './answer-form.component.html',
  styleUrls: ['./answer-form.component.scss' ]
})

export class AnswerFormComponent {
  //used to send a string payload to the parent component 'AnswerPageComponent'
  @Output() submitted = new EventEmitter<string>();
  
  answerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.answerForm = this.fb.group({
      answer: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  //event listener for submit button in the template
  onSubmit(): void {
    if (this.answerForm.valid) {
      const answer = this.answerForm.get('answer')?.value;
      this.submitted.emit(answer);
    }
  }

  //getter method to render any text in template(optional)
  get answer() { return this.answerForm.get('answer'); }
}


