import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  forwardRef,
} from '@angular/core';
import { NzIconService } from 'ng-zorro-antd/icon';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-language-switch',
  standalone: false,
  templateUrl: './language-switch.component.html',
  styleUrl: './language-switch.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LanguageSwitchComponent),
      multi: true,
    },
  ],
})
export class LanguageSwitchComponent implements ControlValueAccessor {
  @Input() disabled = false;
  mexicanFlag = '\uD83C\uDDF2\uD83C\uDDFD';
  americanFlag = '\uD83C\uDDFA\uD83C\uDDF8';
  checked = false;
  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    private icon: NzIconService,
    private cd: ChangeDetectorRef
  ) { }

  writeValue(value: any): void {
    this.checked = value === 'en-US';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cd.markForCheck();
  }

  onLanguageChange(event: boolean): void {
    this.checked = event;
    this.onChange(this.checked ? 'en-US' : 'es-MX');
    this.cd.markForCheck();
  }
}
