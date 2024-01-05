import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { NavigationCardModule } from '../../../shared-components/navigation-card/navigation-card.module';
import { provideRouter } from '@angular/router';
import { routes } from './dashboard.routes';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, NavigationCardModule],
  providers: [provideRouter(routes)],
  exports: [DashboardComponent],
})
export class DashboardModule { }
