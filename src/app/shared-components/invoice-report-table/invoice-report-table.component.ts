import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { Invoice } from '../../features/dashboard-container/invoices-container/invoices-model/model';
import { BehaviorSubject } from 'rxjs';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-invoice-report-table',
  standalone: false,
  templateUrl: './invoice-report-table.component.html',
  styleUrl: './invoice-report-table.component.scss',
})
export class InvoiceReportTableComponent implements OnInit {
  @Input() listOfData: Invoice[] = [];
  @Input() stateTemplate?: string | TemplateRef<any>;
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() limit: number = 10;
  @Input() loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  @Input() isActionRowVisible: boolean = false;
  @Output() viewItem: EventEmitter<Invoice> = new EventEmitter<Invoice>();
  @Output() printItem: EventEmitter<Invoice> = new EventEmitter<Invoice>();
  @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  tableHeaders: any[] = [
    {
      label: 'INVOICES.INVOICE_NUMBER',
      sortFn: (a: Invoice, b: Invoice) =>
        a?.orderId?.toString().localeCompare(b?.orderId?.toString() || ''),
    },
    {
      label: 'COMMON.MISC.DATE',
      sortFn: (a: Invoice, b: Invoice) =>
        a.date.toString().localeCompare(b.date.toString()),
    },
    {
      label: 'COMMON.BUSINESS.COMPANY',
      sortFn: (a: Invoice, b: Invoice) => a.client.localeCompare(b.client),
    },
    {
      label: 'COMMON.FINANCIAL.AMOUNT',
      sortFn: (a: Invoice, b: Invoice) =>
        a.orderTotal.toString().localeCompare(b.orderTotal.toString()),
    },
  ];

  ngOnInit(): void {
    if (this.isActionRowVisible)
      this.tableHeaders.push({ label: 'COMMON.ACTIONS.ACTIONS' });
  }

  handleDeleteItem(index: number) {
    this.deleteItem.emit(index);
  }

  handleViewItem(item: Invoice) {
    this.viewItem.emit(item);
  }

  handlePrintItem(item: Invoice) {
    this.printItem.emit(item);
  }

  handlePageChange(page: number) {
    this.pageChange.emit(page);
  }
}
