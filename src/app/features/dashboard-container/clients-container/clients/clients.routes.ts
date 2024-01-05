import { Route } from '@angular/router';
import { ClientsContainerComponent } from './clients-container.component';

export const routes: Route[] = [
  {
    path: '',
    component: ClientsContainerComponent,
    pathMatch: 'full',
  },
];
