import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationCardComponent } from './navigation-card.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavigationCardComponent],
  imports: [CommonModule, RouterModule],
  exports: [NavigationCardComponent],
})
export class NavigationCardModule {}
