import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import { routes } from './checks.routes';
import { ChecksContainerComponent } from './checks-container.component';
import { CreateCheckModalComponent } from './create-check-modal/create-check-modal.component';
import { CreateChecksReportModalComponent } from './create-checks-report-modal/create-checks-report-modal.component';
import { ChecksService } from './checks-services/checks.service';
import { CheckItemListModule } from '../../../shared-components/check-item-list/check-item-list.module';
import { ChecksReportTableModule } from '../../../shared-components/checks-report-table/checks-report-table.module';
import { TableStateTemplateModule } from '../../../shared-components/table-state-template/table-state-template.module';
import { TypeToSearchTemplateModule } from '../../../shared-components/type-to-search-template/type-to-search-template.module';
import { NoResultsInputTemplateModule } from '../../../shared-components/no-results-input-template/no-results-input-template.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateRangePickerModule } from '../../../shared-components/date-range-picker/date-range-picker.module';
import { ExpenseItemTagModule } from '../../../shared-components/expense-item-tag/expense-item-tag.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EmployeesModule } from '../employees-container/employees.module';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [
    ChecksContainerComponent,
    CreateCheckModalComponent,
    CreateChecksReportModalComponent,
  ],
  imports: [
    CommonModule,
    CheckItemListModule,
    ChecksReportTableModule,
    TableStateTemplateModule,
    TypeToSearchTemplateModule,
    NoResultsInputTemplateModule,
    NzSelectModule,
    NzFormModule,
    ReactiveFormsModule,
    FormsModule,
    DateRangePickerModule,
    ExpenseItemTagModule,
    NzIconModule,
    NzButtonModule,
    RouterModule,
  ],
  providers: [provideRouter(routes), ChecksService],
  exports: [
    ChecksContainerComponent,
    CreateCheckModalComponent,
    CreateChecksReportModalComponent,
  ],
})
export class ChecksModule {}
