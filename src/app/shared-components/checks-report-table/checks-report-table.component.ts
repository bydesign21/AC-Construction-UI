import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { Check } from '../../features/dashboard-container/checks-container/check-model/model';
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
  @Input() stateTemplate?: TemplateRef<any> | string;
  @Input() loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  @Input() listOfData: Check[] = [];
  @Input() isActionRowVisible: boolean = false;
  @Input() totalRecords: number = 0;
  @Input() currentPage!: number;
  @Output() viewItem: EventEmitter<Check> = new EventEmitter<Check>();
  @Output() printItem: EventEmitter<Check> = new EventEmitter<Check>();
  @Output() deleteItem: EventEmitter<string> = new EventEmitter<string>();
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  tableHeaders: any[] = [
    {
      label: 'CHECKS.CHECK_NUMBER',
      sortFn: (a: Check, b: Check) =>
        a?.checkNumber
          ?.toString()
          .localeCompare(b?.checkNumber?.toString() || ''),
    },
    {
      label: 'CHECKS.CHECK_DATE',
      sortFn: (a: Check, b: Check) => a.date.localeCompare(b.date),
    },
    {
      label: 'CHECKS.CHECK_AMOUNT',
      sortFn: (a: Check, b: Check) =>
        a.total.toString().localeCompare(b.total.toString()),
    },
  ];

  ngOnInit(): void {
    if (this.isActionRowVisible)
      this.tableHeaders.push({ label: 'COMMON.ACTIONS.ACTIONS' });
  }

  handleDeleteItem(checkNumber: string) {
    this.deleteItem.emit(checkNumber);
  }

  handleViewItem(item: Check) {
    this.viewItem.emit(item);
  }

  handlePrintItem(item: Check) {
    this.printItem.emit(item);
  }

  handlePageChange(page: number) {
    if (page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
