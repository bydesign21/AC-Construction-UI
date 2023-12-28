import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableStateTemplateComponent } from './table-state-template.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [TableStateTemplateComponent],
  imports: [CommonModule, NzIconModule],
  exports: [TableStateTemplateComponent],
})
export class TableStateTemplateModule {}
