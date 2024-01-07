import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeToSearchTemplateComponent } from './type-to-search-template.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [TypeToSearchTemplateComponent],
  imports: [CommonModule, NzIconModule],
  exports: [TypeToSearchTemplateComponent],
})
export class TypeToSearchTemplateModule {}
