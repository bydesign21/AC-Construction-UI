import { Route } from '@angular/router';
import { EmployeeContainerComponent } from './employee-container/employee-container.component';

export const routes: Route[] = [
  {
    path: '',
    component: EmployeeContainerComponent,
    pathMatch: 'full',
  },
];
