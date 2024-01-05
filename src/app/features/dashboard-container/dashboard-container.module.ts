import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AppContainerComponent } from './app-container/app-container.component';
import { RouterModule, provideRouter, withDebugTracing } from '@angular/router';
import { routes } from './dashboard-container.routes';
import { NavigationBarComponent } from './app-container/navigation-bar/navigation-bar.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {
  SettingOutline,
  ArrowDownOutline,
  MenuFoldOutline,
  MenuOutline,
  PlusCircleOutline,
  DeleteOutline,
  PrinterOutline,
  EyeOutline,
  MailOutline,
  DownloadOutline,
  HomeOutline,
  UserAddOutline,
  ProjectOutline,
  ProfileOutline,
  StockOutline,
  BankOutline,
  BarChartOutline,
  EditOutline,
  ExclamationCircleOutline,
  LoadingOutline,
  FileSearchOutline,
  SearchOutline,
  FrownOutline,
  UserOutline,
  TeamOutline,
} from '@ant-design/icons-angular/icons';
import { AuthService } from '../auth/auth.service';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NavigationCardModule } from '../../shared-components/navigation-card/navigation-card.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { SecondaryNavigationBarModule } from '../../shared-components/secondary-navigation-bar/secondary-navigation-bar.module';
import { WeeklyReportsContainerComponent } from './weekly-reports-container/weekly-reports-container.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { WeeklyReportsTableComponent } from './weekly-reports-container/weekly-reports-table/weekly-reports-table.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DeleteWeeklyReportModalComponent } from './weekly-reports-container/delete-weekly-report-modal/delete-weekly-report-modal.component';
import { CreateWeeklyReportModalComponent } from './weekly-reports-container/create-weekly-report-modal/create-weekly-report-modal.component';
import { DateRangePickerModule } from '../../shared-components/date-range-picker/date-range-picker.module';
import { ExpenseItemListModule } from '../../shared-components/expense-item-list/expense-item-list.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ExpenseItemTagModule } from '../../shared-components/expense-item-tag/expense-item-tag.module';
import { ExpenseItemLabelModule } from '../../shared-components/expense-item-label/expense-item-label.module';
import { WeeklyReportInputRowComponent } from './weekly-reports-container/create-weekly-report-modal/weekly-report-input-row/weekly-report-input-row.component';
import { ExpensesService } from '../../shared-components/expense-item-list/expenses.service';
import { InvoicesContainerComponent } from './invoices-container/invoices-container.component';
import { CreateInvoiceModalComponent } from './invoices-container/create-invoice-modal/create-invoice-modal.component';
import { CreateReportModalComponent } from './invoices-container/create-report-modal/create-report-modal.component';
import { InvoiceReportTableModule } from '../../shared-components/invoice-report-table/invoice-report-table.module';
import { ClientListTableModule } from '../../shared-components/client-list-table/client-list-table.module';
import { InvoiceItemListModule } from '../../shared-components/invoice-item-list/invoice-item-list.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ChecksContainerComponent } from './checks-container/checks-container.component';
import { CreateCheckModalComponent } from './checks-container/create-check-modal/create-check-modal.component';
import { CreateChecksReportModalComponent } from './checks-container/create-checks-report-modal/create-checks-report-modal.component';
import { ChecksReportTableModule } from '../../shared-components/checks-report-table/checks-report-table.module';
import { EmployeeListTableModule } from '../../shared-components/employee-list-table/employee-list-table.module';
import { WeeklyReportsService } from './weekly-reports-container/weekly-reports-services/weekly-reports.service';
import { CheckItemListModule } from '../../shared-components/check-item-list/check-item-list.module';
import { ChecksService } from './checks-container/checks-services/checks.service';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CreateWeeklyReportAnalysisModalComponent } from './weekly-reports-container/create-weekly-report-analysis-modal/create-weekly-report-analysis-modal.component';
import { InvoicesService } from './invoices-container/invoice-service/invoices.service';
import { TypeToSearchTemplateModule } from '../../shared-components/type-to-search-template/type-to-search-template.module';
import { NoResultsInputTemplateModule } from '../../shared-components/no-results-input-template/no-results-input-template.module';
import { TableStateTemplateModule } from '../../shared-components/table-state-template/table-state-template.module';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ClientsModule } from './clients-container/clients/clients.module';
import { EmployeesModule } from './employees-container/employees.module';
import { DashboardModule } from './dashboard-container/dashboard.module';
import { WeeklyReportsModule } from './weekly-reports-container/weekly-reports.module';
import { ChecksModule } from './checks-container/checks.module';
import { InvoicesModule } from './invoices-container/invoices.module';

const icons = [
  SettingOutline,
  ArrowDownOutline,
  MenuFoldOutline,
  MenuOutline,
  PlusCircleOutline,
  PrinterOutline,
  DeleteOutline,
  EyeOutline,
  MailOutline,
  DownloadOutline,
  HomeOutline,
  UserAddOutline,
  ProjectOutline,
  ProfileOutline,
  StockOutline,
  BankOutline,
  BarChartOutline,
  EditOutline,
  ExclamationCircleOutline,
  LoadingOutline,
  FileSearchOutline,
  SearchOutline,
  FrownOutline,
  UserOutline,
  TeamOutline,
];

@NgModule({
  declarations: [AppContainerComponent, NavigationBarComponent],
  imports: [
    CommonModule,
    RouterModule,
    NzIconModule.forChild(icons),
    NzMessageModule,
    NavigationCardModule,
    NzMenuModule,
    NzDrawerModule,
    SecondaryNavigationBarModule,
    ClientsModule,
    EmployeesModule,
    DashboardModule,
    WeeklyReportsModule,
    ChecksModule,
    InvoicesModule,
  ],
  providers: [
    provideRouter(routes, withDebugTracing()),
    AuthService,
    CurrencyPipe,
  ],
  exports: [AppContainerComponent, NavigationBarComponent],
})
export class DashboardContainerModule {}
