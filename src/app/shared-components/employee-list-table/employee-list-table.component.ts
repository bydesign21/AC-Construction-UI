import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Employee } from '../../features/dashboard/checks-container/check-model/model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-employee-list-table',
  standalone: false,
  templateUrl: './employee-list-table.component.html',
  styleUrl: './employee-list-table.component.scss',
})
export class EmployeeListTableComponent implements OnInit {
  @Input() listOfData: Employee[] = [];
  @Input() isActionRowVisible: boolean = true;
  @Output() viewItem: EventEmitter<Employee> = new EventEmitter<Employee>();
  @Output() printItem: EventEmitter<Employee> = new EventEmitter<Employee>();
  @Output() deleteItem: EventEmitter<number> = new EventEmitter<number>();

  tableHeaders: any[] = [
    {
      label: 'Name',
      sortFn: (a: Employee, b: Employee) => a.name.localeCompare(b.name),
    },
    {
      label: 'Phone',
      sortFn: (a: Employee, b: Employee) => a.phone.localeCompare(b.phone),
    },
    {
      label: 'Email',
      sortFn: (a: Employee, b: Employee) => a.email.localeCompare(b.email),
    },
  ];

  ngOnInit(): void {
    if (this.isActionRowVisible) this.tableHeaders.push({ label: 'Actions' });
  }

  handleDeleteItem(index: number) {
    this.deleteItem.emit(index);
  }

  handleViewItem(item: Employee) {
    this.viewItem.emit(item);
  }

  handlePrintItem(item: Employee) {
    this.printItem.emit(item);
  }
}
