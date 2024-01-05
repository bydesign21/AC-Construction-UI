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
import { ExpensesService } from '../../shared-components/expense-item-list/expenses.service';
import { WeeklyReportsService } from './weekly-reports-container/weekly-reports-services/weekly-reports.service';
import { ChecksService } from './checks-container/checks-services/checks.service';
import { InvoicesService } from './invoices-container/invoice-service/invoices.service';
import { ClientsModule } from './clients-container/clients/clients.module';
import { EmployeesModule } from './employees-container/employees.module';
import { DashboardModule } from './dashboard-container/dashboard.module';
import { WeeklyReportsModule } from './weekly-reports-container/weekly-reports.module';
import { ChecksModule } from './checks-container/checks.module';
import { InvoicesModule } from './invoices-container/invoices.module';
import { SharedUtilsService } from '../../shared-components/shared-utils.service';

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
    ExpensesService,
    WeeklyReportsService,
    ChecksService,
    InvoicesService,
    SharedUtilsService,
  ],
  exports: [AppContainerComponent, NavigationBarComponent],
})
export class DashboardContainerModule { }
