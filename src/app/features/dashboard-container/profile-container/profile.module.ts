import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import { routes } from './profile.routes';
import { ProfileContainerComponent } from './profile-container.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@NgModule({
  declarations: [
    ProfileContainerComponent,
    ProfileComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NzMenuModule,
    NzIconModule,
    NzBreadCrumbModule,
  ],
  providers: [provideRouter(routes)],
  exports: [ProfileContainerComponent, ProfileComponent, SettingsComponent],
})
export class ProfileModule { }
