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
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ProfileService } from './profile-services/profile.service';
import { ProfileCardModule } from '../../../shared-components/profile-card/profile-card.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { LanguageSwitchModule } from '../../../shared-components/language-switch/language-switch.module';
import { TranslatePipe } from '../../../shared-components/pipes/translate.pipe';
@NgModule({
  declarations: [
    ProfileContainerComponent,
    ProfileComponent,
    SettingsComponent,
  ],
  providers: [provideRouter(routes), ProfileService],
  exports: [ProfileContainerComponent, ProfileComponent, SettingsComponent],
  imports: [
    CommonModule,
    RouterModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzTabsModule,
    ProfileCardModule,
    NzModalModule,
    LanguageSwitchModule,
    TranslatePipe,
  ],
})
export class ProfileModule { }
