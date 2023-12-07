import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { InvoiceReport } from '../../features/dashboard/invoices-container/invoices-model/model';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-invoice-report-table',
  standalone: false,
  templateUrl: './invoice-report-table.component.html',
  styleUrl: './invoice-report-table.component.scss',
})
export class InvoiceReportTableComponent implements OnInit {
  @Input() listOfData: InvoiceReport[] = [];
  @Input() isActionRowVisible: boolean = false;
  @Output() viewItem: EventEmitter<InvoiceReport> =
    new EventEmitter<InvoiceReport>();
  @Output() printItem: EventEmitter<InvoiceReport> =
    new EventEmitter<InvoiceReport>();
  @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();

  tableHeaders: any[] = [
    {
      label: 'Invoice #',
      sortFn: (a: InvoiceReport, b: InvoiceReport) => a.id.localeCompare(b.id),
    },
    {
      label: 'Date',
      sortFn: (a: InvoiceReport, b: InvoiceReport) =>
        a.date.localeCompare(b.date),
    },
    {
      label: 'Company',
      sortFn: (a: InvoiceReport, b: InvoiceReport) =>
        a.clientId.localeCompare(b.clientId),
    },
    {
      label: 'Amount',
      sortFn: (a: InvoiceReport, b: InvoiceReport) =>
        a.total.toString().localeCompare(b.total.toString()),
    },
  ];

  ngOnInit(): void {
    if (this.isActionRowVisible) this.tableHeaders.push({ label: 'Actions' });
  }

  handleDeleteItem(index: number) {
    this.deleteItem.emit(index);
  }

  handleViewItem(item: InvoiceReport) {
    this.viewItem.emit(item);
  }

  handlePrintItem(item: InvoiceReport) {
    this.printItem.emit(item);
  }
}
