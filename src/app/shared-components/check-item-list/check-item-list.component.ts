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
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { FormConfig, TableFormService } from '../table-form.service';
import { CheckLineItem } from '../../features/dashboard-container/checks-container/check-model/model';

@Component({
  selector: 'app-check-item-list',
  templateUrl: './check-item-list.component.html',
  styleUrls: ['./check-item-list.component.scss'],
})
export class CheckItemListComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('table') table!: ElementRef;
  @Input() items: CheckLineItem[] = [];
  @Input() isDisabled = false;
  @Output() changed: EventEmitter<CheckLineItem[]> = new EventEmitter<
    CheckLineItem[]
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
      this.recalculateFormStatusAndEmit();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  recalculateFormStatusAndEmit(): void {
    this.isValid.emit(this.rowForms.every(form => form.valid));
  }

  recalculateFieldErrors(): void {
    this.fieldErrors = this.rowForms.map(form => this.ts.getFieldErrors(form));
  }

  initializeRowForms(): void {
    this.rowForms = this.items.map(item => this.createRowForm(item));
    this.recalculateFormStatusAndEmit();
  }

  createRowForm(item: CheckLineItem): FormGroup {
    const formConfig: FormConfig = {
      description: {
        defaultValue: item?.description || null,
        validators: [Validators.required],
      },
      total: {
        defaultValue: item?.total || null,
        validators: [Validators.required],
      },
    };

    const form = this.ts.createRowForm(item, formConfig);

    form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const itemIndex = this.items.indexOf(item);
      if (itemIndex === -1) {
        console.error('Item not found in items array', item);
        return;
      }
      this.isTouched.emit(true);
      this.updateFieldErrors(form, itemIndex);
      this.recalculateFormStatusAndEmit();
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
    this.isTouched.emit(true);
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
}
