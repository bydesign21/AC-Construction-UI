import { NgModule, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangePickerComponent } from './date-range-picker.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  declarations: [DateRangePickerComponent],
  imports: [
    CommonModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true,
    },
  ],
  exports: [DateRangePickerComponent],
})
export class DateRangePickerModule {}
