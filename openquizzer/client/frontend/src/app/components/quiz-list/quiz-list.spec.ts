import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizList } from './quiz-list';

describe('QuizList', () => {
  let component: QuizList;
  let fixture: ComponentFixture<QuizList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
