import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  ExpenseItem,
  ExpenseTypes,
} from '../../../../shared-components/expense-item-list/expense-item-list.component';
import { WeeklyReportInputRowProps } from './weekly-report-input-row/weekly-report-input-row.component';
import { ExpensesService } from '../../../../shared-components/expense-item-list/expenses.service';
import { NzModalRef } from 'ng-zorro-antd/modal';

export interface WeeklyReportDataEmission {
  expenseList: ExpenseItem[];
  payroll: number;
  revenue: number;
  profit: number;
  profitSplit: number;
  moulding: number;
  framing: number;
  misc: number;
  decking: number;
  total: number;
  date: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-weekly-report-modal',
  standalone: false,
  templateUrl: './create-weekly-report-modal.component.html',
  styleUrl: './create-weekly-report-modal.component.scss',
})
export class CreateWeeklyReportModalComponent {
  constructor(
    private cd: ChangeDetectorRef,
    private expenses: ExpensesService,
    private modal: NzModalRef
  ) {}
  expenseList: ExpenseItem[] = [];
  payroll: number | null = null;
  revenue: number | null = null;
  deckingCost: number = 0;
  framingCost: number = 0;
  mouldingCost: number = 0;
  miscCost: number = 0;
  totalListExpenses: number = 0;
  totalExpenses: number = 0;
  profit: number = 0;
  profitSplit: number = 0;
  date: Date[] = [];

  handleExpenseListChange() {
    this.expenseList.forEach(expense => {
      expense.date = this.convertDateToString(expense.date || '');
    });
    this.calculateTotals();
  }

  convertDateToString(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(date));
  }

  onOk(): void {
    this.emitAndCloseModal();
  }

  emitAndCloseModal() {
    const reportData: WeeklyReportDataEmission = {
      expenseList: this.expenseList,
      payroll: this.payroll || 0,
      revenue: this.revenue || 0,
      profit: this.profit,
      profitSplit: this.profitSplit,
      moulding: this.mouldingCost,
      framing: this.framingCost,
      misc: this.miscCost,
      decking: this.deckingCost,
      total: this.totalExpenses,
      date: this.expenses.formatDateRange(this.date),
    };
    this.modal.destroy(reportData);
  }

  calculateTotals() {
    const { total, profit, profitSplit, moulding, misc, framing, decking } =
      this.expenses.calculateTotals({
        expenseList: this.expenseList,
        revenue: this.revenue || 0,
        payroll: this.payroll || 0,
      });
    this.profit = profit;
    this.profitSplit = profitSplit;
    this.totalExpenses = total;
    this.deckingCost = decking;
    this.framingCost = framing;
    this.miscCost = misc;
    this.mouldingCost = moulding;
    this.cd.detectChanges();
  }

  handleInputRowChanged(inputRowVals: WeeklyReportInputRowProps) {
    const { payrollTotal, revenueTotal, dateRange } = inputRowVals;
    this.payroll = payrollTotal;
    this.revenue = revenueTotal;
    this.date = dateRange;
    this.calculateTotals();
  }

  handleAddExpenseRow() {
    const generateId = () => {
      return Math.random().toString(36).substr(2, 9);
    };

    const newItemTemplate: ExpenseItem = {
      id: generateId(),
      employeeId: '',
      address: '',
      isPaid: false,
      date: new Date().toLocaleDateString(),
      type: ExpenseTypes.MISC,
    };

    this.expenseList = [...this.expenseList, newItemTemplate];
    this.cd.detectChanges();
  }

  handleDeleteExpenseRow(id: ExpenseItem['id']) {
    const expenses = this.expenseList;
    this.expenseList = expenses.filter(expenses => expenses.id !== id);
    this.calculateTotals();
  }
}
