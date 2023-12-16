import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CheckReport } from '../../features/dashboard/checks-container/check-model/model';
import { BehaviorSubject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checks-report-table',
  standalone: false,
  templateUrl: './checks-report-table.component.html',
  styleUrl: './checks-report-table.component.scss',
})
export class ChecksReportTableComponent implements OnInit {
  @Input() limit: number = 10;
  @Input() loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  @Input() listOfData: CheckReport[] = [];
  @Input() isActionRowVisible: boolean = false;
  @Input() totalRecords: number = 0;
  @Input() currentPage!: number;
  @Output() viewItem: EventEmitter<CheckReport> =
    new EventEmitter<CheckReport>();
  @Output() printItem: EventEmitter<CheckReport> =
    new EventEmitter<CheckReport>();
  @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  tableHeaders: any[] = [
    {
      label: 'Check #',
      sortFn: (a: CheckReport, b: CheckReport) =>
        a.checkNumber.localeCompare(b.checkNumber),
    },
    {
      label: 'Date',
      sortFn: (a: CheckReport, b: CheckReport) => a.date.localeCompare(b.date),
    },
    {
      label: 'Amount',
      sortFn: (a: CheckReport, b: CheckReport) =>
        a.total.toString().localeCompare(b.total.toString()),
    },
  ];

  ngOnInit(): void {
    if (this.isActionRowVisible) this.tableHeaders.push({ label: 'Actions' });
  }

  handleDeleteItem(index: number) {
    this.deleteItem.emit(index);
  }

  handleViewItem(item: CheckReport) {
    this.viewItem.emit(item);
  }

  handlePrintItem(item: CheckReport) {
    this.printItem.emit(item);
  }

  handlePageChange(page: number) {
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
