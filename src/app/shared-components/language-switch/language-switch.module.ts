import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSwitchComponent } from './language-switch.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [LanguageSwitchComponent],
  imports: [CommonModule, NzSwitchModule, FormsModule, NzIconModule],
  exports: [LanguageSwitchComponent],
})
export class LanguageSwitchModule { }
