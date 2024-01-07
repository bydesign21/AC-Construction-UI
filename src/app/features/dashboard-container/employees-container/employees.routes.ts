import { Route } from '@angular/router';
import { EmployeeContainerComponent } from './employee-container/employee-container.component';
import { AuthGuardService } from '../../auth/auth.guard';

export const routes: Route[] = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: EmployeeContainerComponent,
    children: [
      {
        path: '',
        component: EmployeeContainerComponent,
      },
      {
        path: '**',
        redirectTo: '/employees',
        pathMatch: 'full',
      },
    ],
  },
];
