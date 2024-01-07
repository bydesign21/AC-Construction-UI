import { Route } from '@angular/router';
import { ChecksContainerComponent } from './checks-container.component';
import { AuthGuardService } from '../../auth/auth.guard';

export const routes: Route[] = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: ChecksContainerComponent,
    children: [
      {
        path: '',
        component: ChecksContainerComponent,
      },
      {
        path: '**',
        redirectTo: '/checks',
        pathMatch: 'full',
      },
    ],
  },
];
