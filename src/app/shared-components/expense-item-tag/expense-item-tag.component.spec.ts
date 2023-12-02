import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseItemTagComponent } from './expense-item-tag.component';

describe('ExpenseItemTagComponent', () => {
  let component: ExpenseItemTagComponent;
  let fixture: ComponentFixture<ExpenseItemTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseItemTagComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseItemTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
