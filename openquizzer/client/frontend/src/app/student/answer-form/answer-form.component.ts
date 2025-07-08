import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators,FormGroup } from '@angular/forms';
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

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      userAnswer:
        [
          Validators.required
        ]
    });
  }

  //event listener for submit button in the template
  onSubmit(): void {
    if (this.form.invalid) 
      return;
    this.submitted.emit(this.form.controls['userAnswer'].value.trim());
    this.form.reset();
  }

  //getter method to render any text in template(optional)
  get getUserAnswer() {
    return this.form.controls['userAnswer'].value;
  }
}


