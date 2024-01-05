import { Route } from '@angular/router';
import { WeeklyReportsContainerComponent } from './weekly-reports-container.component';

export const routes: Route[] = [
  {
    path: '',
    component: WeeklyReportsContainerComponent,
    pathMatch: 'full',
  },
];
