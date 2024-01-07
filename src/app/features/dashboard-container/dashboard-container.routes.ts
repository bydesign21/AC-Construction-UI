import { Routes } from '@angular/router';
import { AppContainerComponent } from './app-container/app-container.component';
import { AuthGuardService } from '../auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppContainerComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import(
            '../dashboard-container/dashboard-container/dashboard.module'
          ).then(m => m.DashboardModule),
      },
      {
        path: 'weekly-reports',
        loadChildren: () => {
          return import(
            '../dashboard-container/weekly-reports-container/weekly-reports.module'
          ).then(m => m.WeeklyReportsModule);
        },
      },
      {
        path: 'invoices',
        loadChildren: () =>
          import(
            '../dashboard-container/invoices-container/invoices.module'
          ).then(m => m.InvoicesModule),
      },
      {
        path: 'checks',
        loadChildren: () =>
          import('../dashboard-container/checks-container/checks.module').then(
            m => m.ChecksModule
          ),
      },
      {
        path: 'employees',
        loadChildren: () =>
          import(
            '../dashboard-container/employees-container/employees.module'
          ).then(m => m.EmployeesModule),
      },
      {
        path: 'clients',
        loadChildren: () =>
          import(
            '../dashboard-container/clients-container/clients/clients.module'
          ).then(m => m.ClientsModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import(
            '../dashboard-container/profile-container/profile.module'
          ).then(m => m.ProfileModule),
        data: { breadcrumb: 'Profile' },
      },
    ],
  },
];
