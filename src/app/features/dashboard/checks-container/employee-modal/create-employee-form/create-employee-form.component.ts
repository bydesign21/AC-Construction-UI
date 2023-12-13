import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { Subject, takeUntil } from 'rxjs';
import { Employee } from '../../check-model/model';

@Component({
  selector: 'app-create-employee-form',
  standalone: false,
  templateUrl: './create-employee-form.component.html',
  styleUrl: './create-employee-form.component.scss',
})
export class CreateEmployeeFormComponent implements OnInit, OnDestroy {
  @Output() employeeUpdated: EventEmitter<Employee> =
    new EventEmitter<Employee>();
  @Output() employeeCreated: EventEmitter<Employee> =
    new EventEmitter<Employee>();
  @Output() isOkDisabled: EventEmitter<boolean> = new EventEmitter<boolean>();
  createEmployeeForm!: FormGroup;
  isEditMode: boolean = false;
  destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    @Inject(NZ_MODAL_DATA)
    public data?: { employee: Employee; isEditMode: boolean }
  ) {}

  ngOnInit(): void {
    this.isEditMode = this.data?.isEditMode || false;
    this.createEmployeeForm = this.fb.group({
      name: [
        { value: this.data?.employee?.name || '', disabled: !this.isEditMode },
        [Validators.required],
      ],
      address: [
        {
          value: this.data?.employee?.address || '',
          disabled: !this.isEditMode,
        },
        [Validators.required],
      ],
      city: [
        { value: this.data?.employee?.city || '', disabled: !this.isEditMode },
        [Validators.required],
      ],
      state: [
        { value: this.data?.employee?.state || '', disabled: !this.isEditMode },
        [Validators.required],
      ],
      zipCode: [
        {
          value: this.data?.employee?.zipCode || '',
          disabled: !this.isEditMode,
        },
        [
          Validators.required,
          Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$'),
          Validators.maxLength(8),
        ],
      ],
      phone: [
        { value: this.data?.employee?.phone || '', disabled: !this.isEditMode },
        [
          Validators.required,
          Validators.pattern('^\\+?[0-9]{10,12}$'),
          Validators.maxLength(12),
        ],
      ],
      email: [
        { value: this.data?.employee?.email || '', disabled: !this.isEditMode },
        [Validators.required, Validators.email],
      ],
      hourlyRate: [
        {
          value: this.data?.employee?.hourlyRate || null,
          disabled: !this.isEditMode,
        },
        [Validators.required],
      ],
    });

    this.createEmployeeForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isOkDisabled.emit(!this.isFormValid() || !this.isFormDirty());
      });

    this.data?.employee
      ? this.createEmployeeForm.disable()
      : this.createEmployeeForm.enable();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  onSubmit(): Employee {
    if (this.data?.employee) {
      console.log('createEmployeeForm', this.data.employee);
      this.employeeUpdated.emit({
        id: this.data?.employee.id,
        ...this.createEmployeeForm.value,
      });
      return {
        id: this.data?.employee.id,
        ...this.createEmployeeForm.value,
      };
    } else {
      this.employeeCreated.emit(this.createEmployeeForm.value);
      return this.createEmployeeForm.value;
    }
  }

  isFormValid(): boolean {
    return this.createEmployeeForm.valid;
  }

  isFormTouched(): boolean {
    return this.createEmployeeForm.touched;
  }

  isFormDirty(): boolean {
    return this.createEmployeeForm.dirty;
  }

  handleEditToggleClicked() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.createEmployeeForm.enable();
    } else {
      this.createEmployeeForm.disable();
    }
  }
}
