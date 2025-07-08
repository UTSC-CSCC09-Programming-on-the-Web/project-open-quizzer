import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-join-quiz',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './join-quiz.component.html',
  styleUrls: ['./join-quiz.component.scss']
})

export class JoinQuizComponent implements OnInit {
  form!: FormGroup;
  //constructor to make singleton instances of form
  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      quizCode: [
        '',
        [Validators.required, Validators.pattern(/^[A-Z0-9]{4,10}$/)]
      ],
      nickname: ['']
    });
  }

  submit(): void {
    if (this.form.invalid) 
      return;
    const { quizCode, nickname } = this.form.value;
    console.log('Joining quiz:', quizCode, 'as', nickname);
    this.router.navigate(['/student/answer']);
  }

  get quizCode(): FormControl {
    return this.form.controls['quizCode'] as FormControl;
  }
}
