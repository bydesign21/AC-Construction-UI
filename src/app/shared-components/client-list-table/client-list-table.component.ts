import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Client } from '../../features/dashboard/invoices-container/invoices-model/model';
import { BehaviorSubject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-client-list-table',
  standalone: false,
  templateUrl: './client-list-table.component.html',
  styleUrl: './client-list-table.component.scss',
})
export class ClientListTableComponent implements OnInit {
  @Input() listOfData: Client[] = [];
  @Input() isActionRowVisible: boolean = true;
  @Input() loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  @Input() limit: number = 10;
  @Input() currentPage: number = 1;
  @Input() count: number = 0;
  @Output() viewItem: EventEmitter<Client> = new EventEmitter<Client>();
  @Output() printItem: EventEmitter<Client> = new EventEmitter<Client>();
  @Output() deleteItem: EventEmitter<string> = new EventEmitter<string>();
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  tableHeaders: any[] = [
    {
      label: 'Name',
      sortFn: (a: Client, b: Client) =>
        a.companyName.localeCompare(b.companyName),
    },
    {
      label: 'Phone',
      sortFn: (a: Client, b: Client) => a.phone.localeCompare(b.phone),
    },
    {
      label: 'Email',
      sortFn: (a: Client, b: Client) => a.email.localeCompare(b.email),
    },
  ];

  ngOnInit(): void {
    if (this.isActionRowVisible) this.tableHeaders.push({ label: 'Actions' });
  }

  handleDeleteItem(itemId: string) {
    this.deleteItem.emit(itemId);
  }

  handleViewItem(item: Client) {
    this.viewItem.emit(item);
  }

  handlePrintItem(item: Client) {
    this.printItem.emit(item);
  }

  handlePageChange(page: number) {
    if (page === this.currentPage) return;
    this.pageChange.emit(page);
  }
}
