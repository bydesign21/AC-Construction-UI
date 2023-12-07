import {
  Component,
  EventEmitter,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true,
    },
  ],
})
export class DateRangePickerComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() isRequired?: boolean;
  @Input() hideColon?: boolean = true;
  @Input() disabled: boolean = false;
  @Output() changed = new EventEmitter<Date[]>();

  private innerValue: Date[] = [];
  private onChange: (value: Date[]) => void = () => {};
  private onTouched: () => void = () => {};

  get value(): Date[] {
    return this.innerValue;
  }

  set value(v: Date[]) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChange(v);
      this.changed.emit(v);
    }
  }

  writeValue(value: Date[]): void {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  registerOnChange(fn: (value: Date[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onBlur(): void {
    this.onTouched();
  }

  onChangeResult(result: Date[]): void {
    this.value = result;
    this.onTouched();
  }
}
