import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from './weekly-reports.routes';
import { provideRouter } from '@angular/router';
import { WeeklyReportsContainerComponent } from './weekly-reports-container.component';
import { CreateWeeklyReportModalComponent } from './create-weekly-report-modal/create-weekly-report-modal.component';
import { CreateWeeklyReportAnalysisModalComponent } from './create-weekly-report-analysis-modal/create-weekly-report-analysis-modal.component';
import { DeleteWeeklyReportModalComponent } from './delete-weekly-report-modal/delete-weekly-report-modal.component';
import { WeeklyReportsTableComponent } from './weekly-reports-table/weekly-reports-table.component';
import { TableStateTemplateModule } from '../../../shared-components/table-state-template/table-state-template.module';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzFormModule } from 'ng-zorro-antd/form';
import { DateRangePickerModule } from '../../../shared-components/date-range-picker/date-range-picker.module';
import { WeeklyReportInputRowComponent } from './create-weekly-report-modal/weekly-report-input-row/weekly-report-input-row.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpenseItemListModule } from '../../../shared-components/expense-item-list/expense-item-list.module';
import { ExpenseItemTagModule } from '../../../shared-components/expense-item-tag/expense-item-tag.module';
import { ExpenseItemLabelModule } from '../../../shared-components/expense-item-label/expense-item-label.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NoResultsInputTemplateModule } from '../../../shared-components/no-results-input-template/no-results-input-template.module';
import { WeeklyReportsService } from './weekly-reports-services/weekly-reports.service';

@NgModule({
  declarations: [
    WeeklyReportsContainerComponent,
    CreateWeeklyReportModalComponent,
    CreateWeeklyReportAnalysisModalComponent,
    DeleteWeeklyReportModalComponent,
    WeeklyReportsTableComponent,
    WeeklyReportInputRowComponent,
  ],
  imports: [
    CommonModule,
    TableStateTemplateModule,
    NzSpinModule,
    NzIconModule,
    NzInputModule,
    NzPaginationModule,
    NzTableModule,
    NzToolTipModule,
    NzFormModule,
    DateRangePickerModule,
    FormsModule,
    ReactiveFormsModule,
    ExpenseItemListModule,
    ExpenseItemTagModule,
    ExpenseItemLabelModule,
    NzButtonModule,
    NoResultsInputTemplateModule,
  ],
  providers: [provideRouter(routes), WeeklyReportsService],
  exports: [
    WeeklyReportsContainerComponent,
    CreateWeeklyReportModalComponent,
    CreateWeeklyReportAnalysisModalComponent,
    DeleteWeeklyReportModalComponent,
    WeeklyReportsTableComponent,
    WeeklyReportInputRowComponent,
  ],
})
export class WeeklyReportsModule { }
