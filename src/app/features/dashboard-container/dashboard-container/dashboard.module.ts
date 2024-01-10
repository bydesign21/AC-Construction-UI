import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { NavigationCardModule } from '../../../shared-components/navigation-card/navigation-card.module';
import { provideRouter } from '@angular/router';
import { routes } from './dashboard.routes';
import { TranslatePipe } from '../../../shared-components/pipes/translate.pipe';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { LanguageService } from '../../../shared-components/language-service/language.service';

@NgModule({
  declarations: [DashboardComponent],
  providers: [provideRouter(routes), provideHttpClient(), LanguageService],
  exports: [DashboardComponent],
  imports: [
    CommonModule,
    NavigationCardModule,
    TranslatePipe,
    HttpClientModule,
  ],
})
export class DashboardModule { }
