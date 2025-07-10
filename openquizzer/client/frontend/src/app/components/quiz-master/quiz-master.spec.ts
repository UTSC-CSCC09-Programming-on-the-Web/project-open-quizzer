import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizMaster } from './quiz-master';

describe('QuizMaster', () => {
  let component: QuizMaster;
  let fixture: ComponentFixture<QuizMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
