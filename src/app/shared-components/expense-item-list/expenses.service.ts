import { Injectable } from '@angular/core';
import { SharedUtilsService } from '../shared-utils.service';
import {
  ExpenseItem,
  ExpenseTypes,
  WeeklyReportTotals,
} from '../../features/dashboard-container/weekly-reports-container/weekly-reports-model/model';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  constructor(private utils: SharedUtilsService) {}

  calculateTotals(params: {
    expenseList: ExpenseItem[];
    revenue: number;
    payroll: number;
  }) {
    const expenses: WeeklyReportTotals = {
      total: 0,
      decking: 0,
      framing: 0,
      misc: 0,
      moulding: 0,
      profit: 0,
      profitSplit: 0,
    };
    params.expenseList.forEach(expense => {
      expenses.total += expense.amount || 0;
      switch (expense.expenseType) {
        case ExpenseTypes.DECKING:
          expenses.decking += expense?.amount || 0;
          break;
        case ExpenseTypes.FRAMING:
          expenses.framing += expense?.amount || 0;
          break;
        case ExpenseTypes.MISC:
          expenses.misc += expense?.amount || 0;
          break;
        case ExpenseTypes.MOULDING:
          expenses.moulding += expense?.amount || 0;
          break;
        default:
          break;
      }
    });

    expenses.total += params.payroll;
    expenses.profit = params.revenue - expenses.total;
    expenses.profitSplit = expenses.profit / 2;
    return expenses as WeeklyReportTotals;
  }

  formatDateRange(dateRange: Date[]): string {
    return this.utils.formatDateRange(dateRange);
  }
}
