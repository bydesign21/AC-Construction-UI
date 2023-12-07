import {
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
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TableFormService } from '../table-form.service';
import {
  ExpenseItem,
  SelectOption,
  ExpenseTypes,
} from '../../features/dashboard/weekly-reports-container/weekly-reports-model/model';

@Component({
  selector: 'app-expense-item-list',
  templateUrl: './expense-item-list.component.html',
  styleUrls: ['./expense-item-list.component.scss'],
})
export class ExpenseItemListComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('table') table!: ElementRef;
  @Input() items: ExpenseItem[] = [];
  @Input() isDisabled: boolean = false;
  @Input() employeeList: SelectOption[] = [
    { label: 'Mark Zuckerburg', value: '908798' },
    { label: 'Logan Vasquez', value: '3248923' },
  ];
  @Output() changed: EventEmitter<ExpenseItem[]> = new EventEmitter<
    ExpenseItem[]
  >();
  @Output() itemDeleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() addItemRequest: EventEmitter<void> = new EventEmitter<void>();
  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() isTouched: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.table.nativeElement.contains(event.target);
    const clickedOnDropdown = (event.target as Element).classList.contains(
      'ant-select-item-option-content'
    );
    if (!clickedInside && !clickedOnDropdown) {
      this.stopEdit();
    }
  }

  constructor(private ts: TableFormService) {}

  rowForms: FormGroup[] = [];
  editIndex: number | null = null;
  fieldErrors: ValidationErrors[] = [];
  destroy$ = new Subject<void>();

  typeOptions = [
    { label: 'Framing', value: ExpenseTypes.FRAMING },
    { label: 'Decking', value: ExpenseTypes.DECKING },
    { label: 'Moulding', value: ExpenseTypes.MOULDING },
    { label: 'Misc', value: ExpenseTypes.MISC },
  ];

  ngOnInit(): void {
    if (!this.items.length) this.requestAddItem();
    this.initializeRowForms();
    this.recalculateIsValidAndEmit();
    this.fieldErrors = this.items.map(() => ({}));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && !changes.items.firstChange) {
      this.isTouched.emit(true);
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
    const isValid = this.rowForms.every(form => form.valid);
    this.isValid.emit(isValid);
  }

  recalculateFieldErrors(): void {
    this.fieldErrors = this.rowForms.map(form => this.ts.getFieldErrors(form));
  }

  initializeRowForms(): void {
    this.rowForms = this.items.map(item => this.createRowForm(item));
    this.recalculateIsValidAndEmit();
  }

  getFieldErrors(form: FormGroup): ValidationErrors {
    const errors = this.ts.getFieldErrors(form);
    return errors;
  }

  createRowForm(item: ExpenseItem): FormGroup {
    const formConfig = {
      employeeId: {
        defaultValue: item.employeeId,
        validators: [Validators.required],
      },
      address: {
        defaultValue: item.address,
        validators: [Validators.required],
      },
      sqftPrice: {
        defaultValue: item.sqftPrice,
        validators: [Validators.required, Validators.min(0)],
      },
      sqft: {
        defaultValue: item.sqft,
        validators: [Validators.required, Validators.min(0)],
      },
      amount: { defaultValue: item.amount, validators: [Validators.required] },
      isPaid: { defaultValue: item.isPaid },
      date: { defaultValue: item.date, validators: [Validators.required] },
      type: { defaultValue: item.type, validators: [Validators.required] },
    };

    const form = this.ts.createRowForm(item, formConfig);

    form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateFieldErrors(form, this.items.indexOf(item));
      this.isTouched.emit(true);
      this.recalculateIsValidAndEmit();
    });

    form
      ?.get('sqftPrice')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.handleSqftCostCalc(-1);
      });

    form
      ?.get('sqft')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.handleSqftCostCalc(-1);
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
    if (!form) {
      return;
    }
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

  handleSqftCostCalc(index: number) {
    const item = this.rowForms[index];
    const total = () => {
      if (item.value.sqft && item.value.sqftPrice) {
        return item?.value.sqft * item?.value.sqftPrice || undefined;
      } else return item.value.amount || undefined;
    };
    item?.get('amount')?.patchValue(total());
    this.rowForms[index] = item;
    this.emitValidItems();
  }

  getEmployeeLabelById(id: string): string {
    const employee = this.employeeList.find(e => e.value === id);
    return employee ? employee.label : '';
  }
}
