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
import { SharedUtilsService } from '../../shared-components/shared-utils.service';
import { NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NzButtonModule } from 'ng-zorro-antd/button';

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
    NzButtonModule,
    NzDrawerModule,
    SecondaryNavigationBarModule,
    CurrencyPipe,
    NgxMaskPipe,
  ],
  providers: [
    provideRouter(routes),
    provideNgxMask({}),
    AuthService,
    ExpensesService,
    WeeklyReportsService,
    ChecksService,
    InvoicesService,
    SharedUtilsService,
  ],
  exports: [AppContainerComponent, NavigationBarComponent],
})
export class DashboardContainerModule {}
