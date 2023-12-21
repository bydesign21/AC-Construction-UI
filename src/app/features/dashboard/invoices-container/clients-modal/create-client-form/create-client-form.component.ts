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
import { Client } from '../../invoices-model/model';

@Component({
  selector: 'app-create-client-form',
  standalone: false,
  templateUrl: './create-client-form.component.html',
  styleUrl: './create-client-form.component.scss',
})
export class CreateClientFormComponent implements OnInit, OnDestroy {
  @Output() clientUpdated: EventEmitter<Client> = new EventEmitter<Client>();
  @Output() clientCreated: EventEmitter<Client> = new EventEmitter<Client>();
  @Output() isOkDisabled: EventEmitter<boolean> = new EventEmitter<boolean>();
  createClientForm!: FormGroup;
  isEditMode: boolean = false;
  destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    @Inject(NZ_MODAL_DATA) public data?: { client: Client; isEditMode: boolean }
  ) {}

  ngOnInit(): void {
    this.isEditMode = this.data?.isEditMode || false;
    this.createClientForm = this.fb.group({
      companyName: [
        {
          value: this.data?.client?.companyName || '',
          disabled: !this.isEditMode,
        },
        [Validators.required],
      ],
      address: [
        { value: this.data?.client?.address || '', disabled: !this.isEditMode },
        [Validators.required],
      ],
      city: [
        { value: this.data?.client?.city || '', disabled: !this.isEditMode },
        [Validators.required],
      ],
      state: [
        { value: this.data?.client?.state || '', disabled: !this.isEditMode },
        [Validators.required],
      ],
      zipCode: [
        { value: this.data?.client?.zipCode || '', disabled: !this.isEditMode },
        [
          Validators.required,
          Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$'),
          Validators.maxLength(8),
        ],
      ],
      phone: [
        { value: this.data?.client?.phone || '', disabled: !this.isEditMode },
        [
          Validators.required,
          Validators.pattern('^\\+?[0-9]{10,12}$'),
          Validators.maxLength(12),
        ],
      ],
      email: [
        { value: this.data?.client?.email || '', disabled: !this.isEditMode },
        [Validators.required, Validators.email],
      ],
      fax: [
        { value: this.data?.client?.fax || '', disabled: !this.isEditMode },
      ],
      vendorId: [
        {
          value: this.data?.client?.vendorId || '',
          disabled: !this.isEditMode,
        },
      ],
    });

    this.createClientForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isOkDisabled.emit(!this.isFormValid() || !this.isFormDirty());
      });

    this.data?.client
      ? this.createClientForm.disable()
      : this.createClientForm.enable();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  onSubmit(): Client {
    if (this.data?.client) {
      console.log('createClientForm', this.data.client);
      this.clientUpdated.emit({
        id: this.data?.client.id,
        ...this.createClientForm.value,
      });
      return {
        id: this.data?.client.id,
        ...this.createClientForm.value,
      };
    } else {
      this.clientCreated.emit(this.createClientForm.value);
      return this.createClientForm.value;
    }
  }

  isFormValid(): boolean {
    return this.createClientForm.valid;
  }

  isFormTouched(): boolean {
    return this.createClientForm.touched;
  }

  isFormDirty(): boolean {
    return this.createClientForm.dirty;
  }

  handleEditToggleClicked() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.createClientForm.enable();
    } else {
      this.createClientForm.disable();
    }
  }
}
