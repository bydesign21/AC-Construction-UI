import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientListTableComponent } from './client-list-table.component';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { TableStateTemplateModule } from '../table-state-template/table-state-template.module';

@NgModule({
  declarations: [ClientListTableComponent],
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
    NzPaginationModule,
    TableStateTemplateModule,
  ],
  exports: [ClientListTableComponent],
})
export class ClientListTableModule {}
