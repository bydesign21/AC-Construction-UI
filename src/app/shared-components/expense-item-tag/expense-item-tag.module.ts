import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseItemTagComponent } from './expense-item-tag.component';
import { NzTagModule } from 'ng-zorro-antd/tag';

@NgModule({
  declarations: [ExpenseItemTagComponent],
  imports: [CommonModule, NzTagModule],
  exports: [ExpenseItemTagComponent],
})
export class ExpenseItemTagModule {}
