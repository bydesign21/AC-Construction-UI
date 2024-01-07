import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormConfig, TableFormService } from '../table-form.service';
import { InvoiceItemDetail } from '../../features/dashboard-container/invoices-container/invoices-model/model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-invoice-item-list',
  templateUrl: './invoice-item-list.component.html',
  styleUrls: ['./invoice-item-list.component.scss'],
})
export class InvoiceItemListComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('table') table!: ElementRef;
  @Input() items: InvoiceItemDetail[] = [];
  @Input() isDisabled: boolean = false;
  @Output() changed: EventEmitter<InvoiceItemDetail[]> = new EventEmitter<
    InvoiceItemDetail[]
  >();
  @Output() itemDeleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() addItemRequest: EventEmitter<void> = new EventEmitter<void>();
  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isTouched: EventEmitter<boolean> = new EventEmitter<boolean>();
  rowForms: FormGroup[] = [];
  fieldErrors: ValidationErrors[] = [];
  destroy$ = new Subject<void>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.table.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.stopEdit();
    }
  }

  constructor(private ts: TableFormService) {}

  editIndex: number | null = null;

  ngOnInit(): void {
    if (!this.items.length) this.requestAddItem();
    this.initializeRowForms();
    this.fieldErrors = this.items.map(() => ({}));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && !changes.items.firstChange) {
      this.initializeRowForms();
      this.recalculateFieldErrors();
      this.recalculateIsValidAndEmit();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  recalculateIsValidAndEmit(): void {
    this.isValid.emit(this.rowForms.every(form => form.valid));
  }

  recalculateFieldErrors(): void {
    this.fieldErrors = this.rowForms.map(form => this.ts.getFieldErrors(form));
  }

  initializeRowForms(): void {
    this.rowForms = this.items.map((item, index) => {
      const form = this.createRowForm(item, index);
      this.handleCalculateRowTotal(index); // Initial calculation
      return form;
    });
    this.recalculateIsValidAndEmit();
  }

  createRowForm(item: InvoiceItemDetail, index: number): FormGroup {
    const formConfig: FormConfig = {
      planId: { defaultValue: item.planId },
      address: {
        defaultValue: item.address,
        validators: [Validators.required],
      },
      quantity: {
        defaultValue: item.quantity,
        validators: [Validators.required, Validators.min(1)],
      },
      rate: { defaultValue: item.rate },
      subtotal: {
        defaultValue: item.subtotal,
        validators: [Validators.required],
      },
      total: { defaultValue: item.total, validators: [Validators.required] },
      discount: { defaultValue: item.discount },
    };

    const form = this.ts.createRowForm(item, formConfig);

    form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (index === -1) {
        console.error('Item not found in items array', item);
        return;
      }
      this.isTouched.emit(true);
      this.handleCalculateRowTotal(index);
      this.updateFieldErrors(form, index);
      this.recalculateIsValidAndEmit();
    });

    return form;
  }

  updateFieldErrors(form: FormGroup, rowIndex: number): void {
    this.ts.updateFieldErrors(form, this.fieldErrors, rowIndex);
  }

  startEdit(index: number): void {
    if (this.isDisabled) return;
    if (this.editIndex !== null && this.editIndex !== index) {
      this.validateAndEmitRow(this.editIndex);
    }
    this.editIndex = index;
  }

  validateAndEmitRow(index: number): void {
    const form = this.rowForms[index];
    if (this.ts.validateRow(form)) {
      this.items[index] = { ...this.items[index], ...form.value };
      this.emitValidItems();
    }
  }

  isFieldErrorPresent(fieldName: string): boolean {
    return this.fieldErrors.some(errors => errors[fieldName]);
  }

  getErrorMessageForField(fieldName: string): string | null {
    for (const errors of this.fieldErrors) {
      if (errors[fieldName]) {
        return errors[fieldName];
      }
    }
    return null;
  }

  stopEdit(): void {
    if (this.editIndex !== null) {
      this.validateAndEmitRow(this.editIndex);
    }
    this.editIndex = null;
  }

  emitValidItems(): void {
    const validItems = this.items.filter(
      (_, index) => this.rowForms[index].valid
    );
    this.changed.emit(validItems);
  }

  deleteItem(index: number): void {
    this.itemDeleted.emit(index);
    this.isTouched.emit(true);
  }

  getFormControl(row: FormGroup, controlName: string): FormControl {
    return this.ts.getFormControl(row, controlName);
  }

  requestAddItem(): void {
    if (
      this.rowForms.length &&
      !this.rowForms[this.rowForms.length - 1].valid
    ) {
      return;
    }
    this.stopEdit();
    this.addItemRequest.emit();
    this.initializeRowForms();
  }

  handleCalculateRowTotal(index: number) {
    const item = this.rowForms[index];

    if (!item) {
      return;
    }

    const quantity = item.value.quantity || 0;
    const rate = item.value.rate || 0;
    const discount = item.value.discount || 0;

    const subtotal = quantity * rate;
    const total = subtotal - subtotal * discount;

    item.get('subtotal')?.patchValue(subtotal, { emitEvent: false });
    item.get('total')?.patchValue(total, { emitEvent: false });
    this.items[index] = { ...this.items[index], ...item.value };
    this.changed.emit(this.items);
  }
}
