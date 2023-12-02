import { Routes } from '@angular/router';
import { AppContainerComponent } from './app-container/app-container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from '../auth/auth.guard';
import { WeeklyReportsContainerComponent } from './weekly-reports-container/weekly-reports-container.component';
import { InvoicesContainerComponent } from './invoices-container/invoices-container.component';

export const routes: Routes = [
  {
    path: '',
    component: AppContainerComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
      {
        path: 'weekly-reports',
        component: WeeklyReportsContainerComponent,
        pathMatch: 'full',
      },
      {
        path: 'invoices',
        component: InvoicesContainerComponent,
        pathMatch: 'full',
      },
    ],
  },
];
