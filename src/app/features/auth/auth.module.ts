import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import { routes } from './auth.routes';
import { AuthContainerComponent } from './auth-container/auth-container.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupabaseService } from './supabase.service';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PasswordResetModalComponent } from './password-reset-modal/password-reset-modal.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [
    AuthContainerComponent,
    LoginComponent,
    SignUpComponent,
    PasswordResetModalComponent,
    PasswordResetComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzMessageModule,
    NzModalModule,
    FormsModule,
    NzButtonModule,
  ],
  providers: [provideRouter(routes), SupabaseService, provideAnimations()],
  exports: [
    AuthContainerComponent,
    LoginComponent,
    SignUpComponent,
    PasswordResetModalComponent,
    PasswordResetComponent,
  ],
})
export class AuthModule { }
