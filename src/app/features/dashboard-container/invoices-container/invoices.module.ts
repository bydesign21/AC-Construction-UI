import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter } from '@angular/router';
import { routes } from './invoices.routes';
import { InvoicesContainerComponent } from './invoices-container.component';
import { CreateInvoiceModalComponent } from './create-invoice-modal/create-invoice-modal.component';
import { CreateReportModalComponent } from './create-report-modal/create-report-modal.component';
import { InvoiceReportTableModule } from '../../../shared-components/invoice-report-table/invoice-report-table.module';
import { InvoiceItemListModule } from '../../../shared-components/invoice-item-list/invoice-item-list.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DateRangePickerModule } from '../../../shared-components/date-range-picker/date-range-picker.module';
import { TypeToSearchTemplateModule } from '../../../shared-components/type-to-search-template/type-to-search-template.module';
import { NoResultsInputTemplateModule } from '../../../shared-components/no-results-input-template/no-results-input-template.module';
import { ExpenseItemTagModule } from '../../../shared-components/expense-item-tag/expense-item-tag.module';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableStateTemplateModule } from '../../../shared-components/table-state-template/table-state-template.module';

@NgModule({
  declarations: [
    InvoicesContainerComponent,
    CreateInvoiceModalComponent,
    CreateReportModalComponent,
  ],
  imports: [
    CommonModule,
    InvoiceReportTableModule,
    InvoiceItemListModule,
    NzIconModule,
    NzButtonModule,
    DateRangePickerModule,
    TypeToSearchTemplateModule,
    NoResultsInputTemplateModule,
    ExpenseItemTagModule,
    NzCheckboxModule,
    NzSelectModule,
    NzFormModule,
    ReactiveFormsModule,
    FormsModule,
    TableStateTemplateModule,
  ],
  providers: [provideRouter(routes)],
  exports: [
    InvoicesContainerComponent,
    CreateInvoiceModalComponent,
    CreateReportModalComponent,
  ],
})
export class InvoicesModule { }
