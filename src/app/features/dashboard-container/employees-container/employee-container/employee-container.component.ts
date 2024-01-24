import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CreateEmployeeFormComponent } from './create-employee-form/create-employee-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Subject, debounceTime, take, takeUntil } from 'rxjs';
import { Employee } from '../../checks-container/check-model/model';
import { ChecksService } from '../../checks-container/checks-services/checks.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-employee-container',
  standalone: false,
  templateUrl: './employee-container.component.html',
  styleUrl: './employee-container.component.scss',
})
export class EmployeeContainerComponent implements OnInit, OnDestroy {
  createEmployeeModalRef!: NzModalRef<CreateEmployeeFormComponent, any>;
  searchTerm$ = new BehaviorSubject<string>('');
  employeeList: Employee[] = [];
  destroy$ = new Subject<void>();
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  searchTermInternal = '';
  currentPage = 1;
  limit = 10;
  totalEmployeeRecords = 0;

  constructor(
    private modal: NzModalService,
    private message: NzMessageService,
    private checks: ChecksService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.searchTerm$
      .pipe(takeUntil(this.destroy$), debounceTime(500))
      .subscribe(term => {
        if (term.length < 1) return;
        this.searchTermInternal = term;
        this.loadData();
      });
  }

  loadData() {
    this.loading$.next(true);
    this.checks
      .getEmployees(this.currentPage, this.limit, this.searchTermInternal)
      .pipe(take(1))
      .subscribe({
        next: employees => {
          this.employeeList = employees.data;
          this.totalEmployeeRecords = employees.count;
          this.loading$.next(false);
        },
        error: (err: Error) => {
          console.log('error', err);
          this.message.error(`Error getting employees: ${err.message}`);
        },
        complete: () => {
          this.cd.detectChanges();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  handleCreateEmployeeClicked() {
    this.createEmployeeModalRef = this.modal.create({
      nzContent: CreateEmployeeFormComponent,
      nzTitle: 'Create Employee',
      nzWidth: '60%',
      nzData: { isEditMode: true },
      nzStyle: { top: '2rem' },
      nzOkText: 'Create',
      nzOkDisabled: true,
      nzCancelText: 'Cancel',
    });

    this.createEmployeeModalRef.afterOpen
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.createEmployeeModalRef.updateConfig({
          nzFooter: this.createEmployeeModalRef.componentInstance?.footerRef,
        });
      });

    this.createEmployeeModalRef.afterClose
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((employee: Employee) => {
        if (employee) {
          this.handleModalOk(employee);
        }
      });
  }

  handleViewEmployeeClicked(employee: Employee) {
    this.createEmployeeModalRef = this.modal.create({
      nzContent: CreateEmployeeFormComponent,
      nzTitle: 'View Employee',
      nzWidth: '60%',
      nzData: { employee: employee, isEditMode: false },
      nzStyle: { top: '2rem' },
      nzOkText: 'Update',
      nzOkDisabled: true,
      nzCancelText: 'Cancel',
    });

    this.createEmployeeModalRef.afterOpen
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.createEmployeeModalRef.updateConfig({
          nzFooter: this.createEmployeeModalRef.componentInstance?.footerRef,
        });
      });

    this.createEmployeeModalRef.afterClose
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((employee: Employee) => {
        if (employee) {
          this.handleModalOk(employee, true);
        }
      });
  }

  handleModalOk(employee: Employee, isEmployeeUpdated: boolean = false) {
    if (isEmployeeUpdated) {
      this.handleEmployeeEdited(employee);
    } else {
      this.handleEmployeeCreated(employee);
    }
  }

  handleEmployeeCreated(employee: Employee) {
    this.checks
      .putEmployee(employee)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.message.success('Employee created successfully');
        },
        error: (err: Error) => {
          console.log('error', err);
          this.message.error(`Error creating employee: ${err.message}`);
        },
        complete: () => {
          this.loadData();
          this.cd.detectChanges();
        },
      });
  }

  handleEmployeeDeleted(employee: Employee) {
    if (!employee.id) return;
    this.checks
      .deleteEmployee(employee?.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.message.success('Employee deleted successfully');
        },
        error: (err: Error) => {
          console.log('error', err);
          this.message.error(`Error deleting employee: ${err.message}`);
        },
        complete: () => {
          this.loadData();
          this.cd.detectChanges();
        },
      });
  }

  handleEmployeeEdited(employee: Employee) {
    this.checks
      .updateEmployee(employee)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.message.success('Employee updated successfully');
        },
        error: (err: Error) => {
          console.log('error', err);
          this.message.error(`Error updating employee: ${err.message}`);
        },
        complete: () => {
          this.loadData();
          this.cd.detectChanges();
        },
      });
  }

  handleEmployeeSearch(searchTerm: string) {
    this.currentPage = 1;
    this.totalEmployeeRecords = 0;
    this.searchTermInternal = searchTerm.trim();
    if (this.searchTermInternal.length > 0) {
      this.searchTerm$.next(this.searchTermInternal);
    } else {
      this.loadData();
    }
  }

  handlePageChange(page: number) {
    this.currentPage = page;
    this.loadData();
  }

  handlePrintItem(item: Employee) {
    console.log('print item', item);
  }
}
