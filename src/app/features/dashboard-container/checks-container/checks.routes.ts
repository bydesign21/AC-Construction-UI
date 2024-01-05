import { Route } from '@angular/router';
import { ChecksContainerComponent } from './checks-container.component';

export const routes: Route[] = [
  {
    path: '',
    component: ChecksContainerComponent,
    pathMatch: 'full',
  },
];
