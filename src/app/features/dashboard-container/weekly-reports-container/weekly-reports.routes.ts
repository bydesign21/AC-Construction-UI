import { Route } from '@angular/router';
import { WeeklyReportsContainerComponent } from './weekly-reports-container.component';
import { AuthGuardService } from '../../auth/auth.guard';

export const routes: Route[] = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: WeeklyReportsContainerComponent,
    children: [
      {
        path: '',
        component: WeeklyReportsContainerComponent,
      },
      {
        path: '**',
        redirectTo: '/weekly-reports',
        pathMatch: 'full',
      },
    ],
  },
];
