import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChecksReportTableComponent } from './checks-report-table.component';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { TableStateTemplateModule } from '../table-state-template/table-state-template.module';
import { TranslatePipe } from '../pipes/translate.pipe';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [ChecksReportTableComponent],
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
    NzSpinModule,
    NzPaginationModule,
    TableStateTemplateModule,
    TranslatePipe,
  ],
  providers: [provideHttpClient()],
  exports: [ChecksReportTableComponent],
})
export class ChecksReportTableModule {}
