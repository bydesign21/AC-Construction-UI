import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { Employee } from '../../../checks-container/check-model/model';

@Component({
  selector: 'app-create-employee-form',
  standalone: false,
  templateUrl: './create-employee-form.component.html',
  styleUrl: './create-employee-form.component.scss',
})
export class CreateEmployeeFormComponent implements OnInit, OnDestroy {
  @ViewChild('modalFooter') footerRef!: TemplateRef<any>;
  @Output() employeeUpdated: EventEmitter<Employee> =
    new EventEmitter<Employee>();
  @Output() employeeCreated: EventEmitter<Employee> =
    new EventEmitter<Employee>();
  createEmployeeForm!: FormGroup;
  isEditMode: boolean = false;
  destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    @Inject(NZ_MODAL_DATA)
    public data?: { employee: Employee; isEditMode: boolean }
  ) { }

  ngOnInit(): void {
    this.isEditMode = this.data?.isEditMode || false;
    this.createEmployeeForm = this.fb.group({
      name: [
        { value: this.data?.employee?.name || '', disabled: !this.isEditMode },
        [Validators.required],
      ],
      address: [
        {
          value: this.data?.employee?.address.trim() || '',
          disabled: !this.isEditMode,
        },
      ],
      city: [
        { value: this.data?.employee?.city || '', disabled: !this.isEditMode },
      ],
      state: [
        { value: this.data?.employee?.state || '', disabled: !this.isEditMode },
      ],
      zipCode: [
        {
          value: this.data?.employee?.zipCode || '',
          disabled: !this.isEditMode,
        },
        [
          Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$'),
          Validators.maxLength(8),
        ],
      ],
      phone: [
        { value: this.data?.employee?.phone || '', disabled: !this.isEditMode },
        [Validators.pattern('^\\+?[0-9]{10,12}$'), Validators.maxLength(12)],
      ],
      email: [
        { value: this.data?.employee?.email || '', disabled: !this.isEditMode },
        [Validators.email],
      ],
      hourlyRate: [
        {
          value: this.data?.employee?.hourlyRate || null,
          disabled: !this.isEditMode,
        },
      ],
      isContractor: [
        {
          value: this.data?.employee?.isContractor || false,
          disabled: !this.isEditMode,
        },
      ],
      jobTitle: [
        {
          value: this.data?.employee?.jobTitle || '',
          disabled: !this.isEditMode,
        },
      ],
      socialSecurityNumber: [
        {
          value: this.data?.employee?.socialSecurityNumber || '',
          disabled: !this.isEditMode,
        },
      ],
    });

    this.data?.employee
      ? this.createEmployeeForm.disable({ emitEvent: false })
      : this.createEmployeeForm.enable({ emitEvent: false });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  onSubmit(): void {
    if (this.data?.employee) {
      Object.keys(this.createEmployeeForm.controls).forEach(key => {
        if (typeof this.createEmployeeForm.controls[key].value === 'string') {
          this.createEmployeeForm.controls[key].setValue(
            this.createEmployeeForm.controls[key].value.trim()
          );
        }
      });
      this.modal.destroy({
        id: this.data?.employee.id,
        ...this.createEmployeeForm.value,
      });
    } else {
      this.modal.destroy(this.createEmployeeForm.value);
    }
  }

  isFormValid(): boolean {
    return this.createEmployeeForm.valid && this.isFormTouched();
  }

  isFormTouched(): boolean {
    return this.createEmployeeForm.touched;
  }

  isFormDirty(): boolean {
    return this.createEmployeeForm.dirty;
  }

  onCancel() {
    this.modal.destroy();
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
