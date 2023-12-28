import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ExpensesService } from '../../../../shared-components/expense-item-list/expenses.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import {
  ExpenseItem,
  ExpenseTypes,
  WeeklyReport,
  WeeklyReportInputRowProps,
} from '../weekly-reports-model/model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-weekly-report-modal',
  standalone: false,
  templateUrl: './create-weekly-report-modal.component.html',
  styleUrl: './create-weekly-report-modal.component.scss',
})
export class CreateWeeklyReportModalComponent implements OnInit {
  @ViewChild('modalFooter') modalFooter!: TemplateRef<any>;

  constructor(
    private cd: ChangeDetectorRef,
    private expenses: ExpensesService,
    private modal: NzModalRef,
    @Inject(NZ_MODAL_DATA)
    public data?: { report: WeeklyReport; isEditMode: boolean }
  ) { }
  isInputRowValid$ = new BehaviorSubject<boolean>(false);
  isInputRowTouched$ = new BehaviorSubject<boolean>(false);
  isExpenseListTouched$ = new BehaviorSubject<boolean>(false);
  isExpenseListValid$ = new BehaviorSubject<boolean>(false);
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
  isEditMode: boolean = false;

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.expenseList = this.data.report.expenseList;
      this.payroll = this.data.report.payroll;
      this.revenue = this.data.report.revenue;
      this.date = this.data.report.date;
      this.calculateTotals();
    }
  }

  handleExpenseListChange() {
    this.expenseList.forEach(expense => {
      expense.date = this.convertDateToString(expense.date || '');
    });
    this.calculateTotals();
  }

  onCancel() {
    this.modal.destroy();
  }

  handleInputRowValidity(isValid: boolean) {
    this.isInputRowValid$.next(isValid);
  }

  handleInputRowTouched(isTouched: boolean) {
    this.isInputRowTouched$.next(isTouched);
  }

  handleExpenseListTouched(isTouched: boolean) {
    this.isExpenseListTouched$.next(isTouched);
  }

  handleExpenseListValidity(isValid: boolean) {
    this.isExpenseListValid$.next(isValid);
  }

  convertDateToString(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(date));
  }

  handleEditModeToggled() {
    this.isEditMode = !this.isEditMode;
    this.cd.detectChanges();
  }

  isFormValid(): boolean {
    const isEitherFormInvalid =
      !this.isInputRowValid$.getValue() || !this.isExpenseListValid$.getValue();
    const isNeitherFormTouched =
      !this.isInputRowTouched$.getValue() &&
      !this.isExpenseListTouched$.getValue();
    return !isEitherFormInvalid && !isNeitherFormTouched;
  }

  submitForm() {
    const reportData: WeeklyReport = {
      id: this.data?.report?.id || undefined,
      expenseList: this.expenseList,
      payroll: this.payroll || 0,
      revenue: this.revenue || 0,
      profit: this.profit,
      profitSplit: this.profitSplit,
      moulding: this.mouldingCost,
      framing: this.framingCost,
      misc: this.miscCost,
      decking: this.deckingCost,
      totalExpenses: this.totalExpenses,
      date: this.date,
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
    const newItemTemplate: ExpenseItem = {
      employeeName: '',
      address: '',
      isPaid: false,
      date: new Date().toLocaleDateString(),
      expenseType: ExpenseTypes.MISC,
    };

    this.expenseList = [...this.expenseList, newItemTemplate];
    this.cd.detectChanges();
  }

  handleDeleteExpenseRow(index: number) {
    const expenses = this.expenseList;
    this.expenseList = expenses.filter((_, i) => i !== index);
    this.calculateTotals();
  }
}
