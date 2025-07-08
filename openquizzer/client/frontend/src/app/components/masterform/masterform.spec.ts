import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Masterform } from './masterform';

describe('Masterform', () => {
  let component: Masterform;
  let fixture: ComponentFixture<Masterform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Masterform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Masterform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
