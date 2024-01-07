import { Routes } from '@angular/router';
import { AuthGuardService } from './features/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import('./features/dashboard-container/dashboard-container.module').then(
        m => m.DashboardContainerModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];
