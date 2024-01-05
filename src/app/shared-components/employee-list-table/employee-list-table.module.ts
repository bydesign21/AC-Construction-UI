import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { EmployeeListTableComponent } from './employee-list-table.component';
import { TableStateTemplateModule } from '../table-state-template/table-state-template.module';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@NgModule({
  declarations: [EmployeeListTableComponent],
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
    TableStateTemplateModule,
    NzPaginationModule,
  ],
  exports: [EmployeeListTableComponent],
})
export class EmployeeListTableModule {}
