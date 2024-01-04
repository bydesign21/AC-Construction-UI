import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceItemListComponent } from './invoice-item-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TableFormService } from '../table-form.service';

@NgModule({
  declarations: [InvoiceItemListComponent],
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule,
    NzTableModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzIconModule,
    ReactiveFormsModule,
    NzToolTipModule,
  ],
  providers: [TableFormService],
  exports: [InvoiceItemListComponent],
})
export class InvoiceItemListModule { }
