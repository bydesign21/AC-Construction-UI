import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseItemLabelComponent } from './expense-item-label.component';

@NgModule({
  declarations: [ExpenseItemLabelComponent],
  imports: [CommonModule],
  exports: [ExpenseItemLabelComponent],
})
export class ExpenseItemLabelModule {}
