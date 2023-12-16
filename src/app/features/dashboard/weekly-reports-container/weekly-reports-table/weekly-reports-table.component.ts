import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { WeeklyReport } from '../weekly-reports-model/model';
import { BehaviorSubject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-weekly-reports-table',
  standalone: false,
  templateUrl: './weekly-reports-table.component.html',
  styleUrl: './weekly-reports-table.component.scss',
})
export class WeeklyReportsTableComponent {
  @Input() loading$ = new BehaviorSubject<boolean>(true);
  @Input() listOfData: WeeklyReport[] = [];
  @Input() limit: number = 10;
  @Input() totalRecords: number = 0;
  @Input() currentPage!: number;
  @Output() viewItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() printItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  visible = false;
  sortDateRangeFn = (a: WeeklyReport, b: WeeklyReport) => {
    return a.date[1].getTime() - b.date[1].getTime();
  };
  tableHeaders: any = [
    { label: 'Date Range', sortFn: this.sortDateRangeFn },
    {
      label: 'Revenue',
      sortFn: (a: WeeklyReport, b: WeeklyReport) =>
        a.revenue.toString().localeCompare(b.revenue.toString()),
    },
    {
      label: 'Expenses',
      sortFn: (a: WeeklyReport, b: WeeklyReport) =>
        a.totalExpenses.toString().localeCompare(b.totalExpenses.toString()),
    },
    {
      label: 'Net Profit',
      sortFn: (a: WeeklyReport, b: WeeklyReport) =>
        a.profit.toString().localeCompare(b.profit.toString()),
    },
    {
      label: 'Split Profit',
      sortFn: (a: WeeklyReport, b: WeeklyReport) =>
        a.profitSplit.toString().localeCompare(b.profitSplit.toString()),
    },
    { label: 'Actions' },
  ];

  parseEndDate(dateRange: string): Date {
    const startDateString = dateRange.split(' - ')[1];
    return new Date(startDateString);
  }

  handleDeleteItem(index: number) {
    this.deleteItem.emit(index);
  }

  handleViewItem(item: WeeklyReport) {
    this.viewItem.emit(item);
  }

  handlePrintItem(item: WeeklyReport) {
    this.printItem.emit(item);
  }

  handlePageChange(page: number) {
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
