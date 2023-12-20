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
import {
  BehaviorSubject,
  Observable,
  Subject,
  debounceTime,
  takeUntil,
  tap,
} from 'rxjs';
import { Employee } from '../check-model/model';
import { ChecksService } from '../checks-services/checks.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-employee-modal',
  standalone: false,
  templateUrl: './employee-modal.component.html',
  styleUrl: './employee-modal.component.scss',
})
export class EmployeeModalComponent implements OnInit, OnDestroy {
  createEmployeeModalRef!: NzModalRef<CreateEmployeeFormComponent, any>;
  searchTerm$ = new Subject<string>();
  employeeList$: Observable<Employee[]> = this.checks.getEmployees();
  destroy$ = new Subject<void>();
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  searchTermInternal = '';

  constructor(
    private modal: NzModalService,
    private message: NzMessageService,
    private checks: ChecksService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchTerm$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        tap(() => this.loading$.next(true))
      )
      .subscribe(term => {
        console.log('searchTerm', term);
        this.searchTermInternal = term;
        this.employeeList$ = this.checks.getEmployeesBySearchTerm(term);
        this.loading$.next(false);
        this.cd.detectChanges();
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
      nzCancelText: 'Cancel',
      nzOnOk: () => this.handleCreateEmployeeModalOk(),
    });

    this.createEmployeeModalRef.componentInstance?.isOkDisabled
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDisabled: boolean) => {
        this.createEmployeeModalRef.updateConfig({
          nzOkDisabled: isDisabled,
        });
      });

    this.searchTerm$.next('');
  }

  handleViewEmployeeClicked(employee: Employee) {
    this.createEmployeeModalRef = this.modal.create({
      nzContent: CreateEmployeeFormComponent,
      nzTitle: 'View Employee',
      nzWidth: '60%',
      nzData: { employee: employee },
      nzStyle: { top: '2rem' },
      nzOkText: 'Update',
      nzCancelText: 'Cancel',
      nzOnOk: () => this.handleCreateEmployeeModalOk(),
    });

    this.createEmployeeModalRef.componentInstance?.isOkDisabled
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDisabled: boolean) => {
        this.createEmployeeModalRef.updateConfig({
          nzOkDisabled: isDisabled,
        });
      });
  }

  handleCreateEmployeeModalOk() {
    const instance = this.createEmployeeModalRef.getContentComponent();
    if (instance.isFormValid()) {
      const form = instance.onSubmit();
      const isEmployeeUpdated = Boolean(instance?.data?.employee);
      if (isEmployeeUpdated) {
        this.handleEmployeeEdited(form);
        this.message.success('Employee updated');
      } else {
        this.handleEmployeeCreated(form);
        this.message.success('Employee created');
      }
      return true;
    } else {
      this.message.error('Form is invalid');
      return false;
    }
  }

  handleIsFormTouched() {
    const instance = this.createEmployeeModalRef.getContentComponent();
    return instance.isFormTouched();
  }

  handleEmployeeCreated(employee: Employee) {
    // TODO: Add employee in db
    // TODO: Add employee in employee list
  }

  handleEmployeeDeleted(employeeIndex: number) {
    // TODO: Delete employee in db
    // TODO: Delete employee in employee list
  }

  handleEmployeeEdited(employee: Employee) {
    // TODO: Edit employee in db
    // TODO: Edit employee in employee list
  }

  handleEmployeeSearch(searchTerm: string) {
    console.log('searchTerm Changed', searchTerm);
    this.searchTermInternal = searchTerm.trim();
    if (this.searchTermInternal.length > 0) {
      this.searchTerm$.next(this.searchTermInternal);
    } else {
      this.employeeList$ = this.checks.getEmployees();
    }
  }

  handleDeleteItem(itemIndex: number) {
    // TODO: Delete item in db
    // TODO: Delete item in item list
  }

  handlePrintItem(item: Employee) {
    console.log('print item', item);
  }
}
