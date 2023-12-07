import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CreateEmployeeFormComponent } from './create-employee-form/create-employee-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { Employee } from '../check-model/model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-employee-modal',
  standalone: false,
  templateUrl: './employee-modal.component.html',
  styleUrl: './employee-modal.component.scss',
})
export class EmployeeModalComponent implements OnInit, OnDestroy {
  @Input() employeeList: Employee[] = [];
  @Output() employeeCreated: EventEmitter<Employee> =
    new EventEmitter<Employee>();
  @Output() employeeDeleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() employeeEdited: EventEmitter<Employee> =
    new EventEmitter<Employee>();
  @Output() employeeSearched: EventEmitter<string> = new EventEmitter<string>();
  createEmployeeModalRef!: NzModalRef<CreateEmployeeFormComponent, any>;
  searchTerm$ = new Subject<string>();
  searchTerm: string = '';
  destroy$ = new Subject<void>();

  constructor(
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.searchTerm$
      .pipe(takeUntil(this.destroy$), debounceTime(300))
      .subscribe(term => {
        this.employeeSearched.emit(term);
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

    this.searchTerm = '';
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

    this.searchTerm = '';
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
    this.employeeCreated.emit(employee);
  }

  handleEmployeeDeleted(employeeIndex: number) {
    this.employeeDeleted.emit(employeeIndex);
  }

  handleEmployeeEdited(employee: Employee) {
    this.employeeEdited.emit(employee);
  }

  handleEmployeeSearch(searchTerm: string) {
    this.searchTerm$.next(searchTerm);
  }

  handleDeleteItem(itemIndex: number) {
    this.employeeDeleted.emit(itemIndex);
  }

  handlePrintItem(item: Employee) {
    console.log('print item', item);
  }
}
