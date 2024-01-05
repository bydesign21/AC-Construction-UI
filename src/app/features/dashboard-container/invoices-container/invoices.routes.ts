import { Route } from '@angular/router';
import { InvoicesContainerComponent } from './invoices-container.component';

export const routes: Route[] = [
  {
    path: '',
    component: InvoicesContainerComponent,
    pathMatch: 'full',
  },
];
