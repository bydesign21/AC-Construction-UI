import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoResultsInputTemplateComponent } from './no-results-input-template.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [NoResultsInputTemplateComponent],
  imports: [CommonModule, NzIconModule],
  exports: [NoResultsInputTemplateComponent],
})
export class NoResultsInputTemplateModule {}
