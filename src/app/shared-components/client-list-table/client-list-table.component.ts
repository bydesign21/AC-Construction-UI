import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Client } from '../../features/dashboard/invoices-container/invoices-model/model';

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
  @Output() viewItem: EventEmitter<Client> = new EventEmitter<Client>();
  @Output() printItem: EventEmitter<Client> = new EventEmitter<Client>();
  @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();

  tableHeaders: any[] = [
    {
      label: 'Name',
      sortFn: (a: Client, b: Client) => a.name.localeCompare(b.name),
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

  handleDeleteItem(index: number) {
    this.deleteItem.emit(index);
  }

  handleViewItem(item: Client) {
    this.viewItem.emit(item);
  }

  handlePrintItem(item: Client) {
    this.printItem.emit(item);
  }
}
