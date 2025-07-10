import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveQuiz } from './active-quiz';

describe('ActiveQuiz', () => {
  let component: ActiveQuiz;
  let fixture: ComponentFixture<ActiveQuiz>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveQuiz]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveQuiz);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
