import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryNavigationBarComponent } from './secondary-navigation-bar.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SecondaryNavigationBarComponent],
  imports: [
    CommonModule,
    NzIconModule,
    NzMenuModule,
    NzDrawerModule,
    RouterModule,
  ],
  exports: [SecondaryNavigationBarComponent],
})
export class SecondaryNavigationBarModule {}
