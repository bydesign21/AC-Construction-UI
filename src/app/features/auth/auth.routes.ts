import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthContainerComponent } from './auth-container/auth-container.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthContainerComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', pathMatch: 'full', component: LoginComponent },
      { path: 'sign-up', pathMatch: 'full', component: SignUpComponent },
      {
        path: 'password-reset',
        pathMatch: 'full',
        component: PasswordResetComponent,
      },
    ],
  },
];
