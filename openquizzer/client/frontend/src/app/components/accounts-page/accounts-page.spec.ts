import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsPage } from './accounts-page';

describe('AccountsPage', () => {
  let component: AccountsPage;
  let fixture: ComponentFixture<AccountsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
