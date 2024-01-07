import { Route } from '@angular/router';
import { ClientsContainerComponent } from './clients-container.component';
import { AuthGuardService } from '../../../auth/auth.guard';

export const routes: Route[] = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: ClientsContainerComponent,
    children: [
      {
        path: '',
        component: ClientsContainerComponent,
      },
      {
        path: '**',
        redirectTo: '/clients',
        pathMatch: 'full',
      },
    ],
  },
];
