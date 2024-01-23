import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { WeeklyReportInputRowProps } from '../../weekly-reports-model/model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-weekly-report-input-row',
  standalone: false,
  templateUrl: './weekly-report-input-row.component.html',
  styleUrl: './weekly-report-input-row.component.scss',
})
export class WeeklyReportInputRowComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() isDisabled: boolean = false;
  @Input() dateRange: Date[] = [];
  @Input() revenueTotal: number | null = null;
  @Input() payrollTotal: number | null = null;
  @Output() changed = new EventEmitter<WeeklyReportInputRowProps>();
  @Output() isValid = new EventEmitter<boolean>();
  @Output() isTouched = new EventEmitter<boolean>();
  destroy$ = new Subject<void>();
  form!: FormGroup;

  ngOnInit() {
    this.initializeForm();
    this.checkAndEmitValidityAndTouched();
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.form.markAllAsTouched();
      const formValue = this.form.value;
      this.checkAndEmitValidityAndTouched();
      this.changed.emit(formValue);
    });
  }

  initializeForm() {
    this.form = new FormGroup({
      dateRange: new FormControl(
        { value: [...this.dateRange], disabled: this.isDisabled },
        [Validators.required, this.dateRangeValidator]
      ),
      revenueTotal: new FormControl(
        { value: this.revenueTotal, disabled: this.isDisabled },
        [Validators.required]
      ),
      payrollTotal: new FormControl(
        { value: this.payrollTotal, disabled: this.isDisabled },
        [Validators.required]
      ),
    });
  }

  checkAndEmitValidityAndTouched() {
    this.isValid.emit(this.form?.valid);
    this.isTouched.emit(this.form?.touched);
  }

  getErrorMessageForField(field: string): string {
    const control = this.form.get(field);
    if (control && control.errors) {
      if (control.errors.required) {
        return 'This field is required';
      }
      if (control.errors.dateRangeInvalid) {
        return 'Please select a valid start and end date';
      }
    }
    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('isDisabled' in changes) {
      this.updateDisabledState();
      this.checkAndEmitValidityAndTouched();
    }
  }

  private updateDisabledState(): void {
    if (this.isDisabled) {
      this.form?.disable({ emitEvent: false });
    } else {
      this.form?.enable({ emitEvent: false });
    }
  }

  handleDateRangeChange(dateInput: Date[]) {
    this.form.patchValue({ dateRange: dateInput });
  }

  private dateRangeValidator(
    control: FormControl
  ): { [key: string]: any } | null {
    if (control.value && control.value.length === 2) {
      return null;
    }
    return { dateRangeInvalid: true };
  }
}
