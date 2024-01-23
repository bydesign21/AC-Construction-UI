import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { NavigationCardModule } from '../../../shared-components/navigation-card/navigation-card.module';
import { provideRouter } from '@angular/router';
import { routes } from './dashboard.routes';
import { TranslatePipe } from '../../../shared-components/pipes/translate.pipe';

@NgModule({
  declarations: [DashboardComponent],
  providers: [provideRouter(routes)],
  exports: [DashboardComponent],
  imports: [CommonModule, NavigationCardModule, TranslatePipe],
})
export class DashboardModule {}
