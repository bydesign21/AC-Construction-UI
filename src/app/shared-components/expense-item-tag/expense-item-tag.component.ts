import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-expense-item-tag',
  standalone: false,
  templateUrl: './expense-item-tag.component.html',
  styleUrl: './expense-item-tag.component.scss',
})
export class ExpenseItemTagComponent {
  @Input() value: number = 0;
  @Input() label: string = '';
}
