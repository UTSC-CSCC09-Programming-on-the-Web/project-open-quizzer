import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizTaker } from './quiz-taker';

describe('QuizTaker', () => {
  let component: QuizTaker;
  let fixture: ComponentFixture<QuizTaker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizTaker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizTaker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
