import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-item-label',
  standalone: false,
  templateUrl: './expense-item-label.component.html',
  styleUrl: './expense-item-label.component.scss',
})
export class ExpenseItemLabelComponent {
  @Input() value: number | null = null;
  @Input() label: string = '';
  @Input() isExpense: boolean = false;
}
