import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerResults } from './answer-results';

describe('AnswerResults', () => {
  let component: AnswerResults;
  let fixture: ComponentFixture<AnswerResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnswerResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
