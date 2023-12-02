import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangePickerComponent } from './date-range-picker.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  exports: [DateRangePickerComponent],
})
export class DateRangePickerModule {}
