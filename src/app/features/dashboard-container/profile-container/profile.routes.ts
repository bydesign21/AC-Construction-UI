import { Route } from '@angular/router';
import { ProfileContainerComponent } from './profile-container.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Route[] = [
  {
    path: '',
    component: ProfileContainerComponent,
    children: [
      {
        path: '',
        component: ProfileComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: { breadcrumb: 'Settings' },
      },
      {
        path: '**',
        redirectTo: '/profile',
        pathMatch: 'full',
      },
    ],
  },
];
