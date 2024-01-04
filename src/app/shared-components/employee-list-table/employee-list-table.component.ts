import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { Employee } from '../../features/dashboard/checks-container/check-model/model';
import { BehaviorSubject } from 'rxjs';

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
  @Input() emptyStateTemplate?: string | TemplateRef<any>;
  @Input() loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  @Input() totalRecords: number = 0;
  @Input() currentPage: number = 1;
  @Input() limit: number = 8;
  @Output() viewItem: EventEmitter<Employee> = new EventEmitter<Employee>();
  @Output() printItem: EventEmitter<Employee> = new EventEmitter<Employee>();
  @Output() deleteItem: EventEmitter<Employee> = new EventEmitter<Employee>();
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

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

  handleDeleteItem(item: Employee) {
    this.deleteItem.emit(item);
  }

  handleViewItem(item: Employee) {
    this.viewItem.emit(item);
  }

  handlePrintItem(item: Employee) {
    this.printItem.emit(item);
  }

  handlePageChange(page: number) {
    this.pageChange.emit(page);
  }
}
