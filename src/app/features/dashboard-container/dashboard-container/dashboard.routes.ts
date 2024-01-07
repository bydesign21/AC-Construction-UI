import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuardService } from '../../auth/auth.guard';

export const routes: Route[] = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: '**',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
