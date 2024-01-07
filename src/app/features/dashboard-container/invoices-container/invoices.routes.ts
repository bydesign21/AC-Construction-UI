import { Route } from '@angular/router';
import { InvoicesContainerComponent } from './invoices-container.component';
import { AuthGuardService } from '../../auth/auth.guard';

export const routes: Route[] = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: InvoicesContainerComponent,
    children: [
      {
        path: '',
        component: InvoicesContainerComponent,
      },
      {
        path: '**',
        redirectTo: '/invoices',
        pathMatch: 'full',
      },
    ],
  },
];
