import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CheckItemListComponent } from './check-item-list.component';
import { TableStateTemplateModule } from '../table-state-template/table-state-template.module';

@NgModule({
  declarations: [CheckItemListComponent],
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
    CurrencyMaskModule,
    TableStateTemplateModule,
  ],
  providers: [TableFormService],
  exports: [CheckItemListComponent],
})
export class CheckItemListModule { }
