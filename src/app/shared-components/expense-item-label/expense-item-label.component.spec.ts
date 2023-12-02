import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseItemLabelComponent } from './expense-item-label.component';

describe('ExpenseItemLabelComponent', () => {
  let component: ExpenseItemLabelComponent;
  let fixture: ComponentFixture<ExpenseItemLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseItemLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseItemLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
