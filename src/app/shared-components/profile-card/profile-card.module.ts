import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from './profile-card.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { LanguageSwitchModule } from '../language-switch/language-switch.module';
import { TranslatePipe } from '../pipes/translate.pipe';

@NgModule({
  declarations: [ProfileCardComponent],
  imports: [
    CommonModule,
    NzInputModule,
    NzFormModule,
    ReactiveFormsModule,
    NzButtonModule,
    LanguageSwitchModule,
    TranslatePipe,
  ],
  exports: [ProfileCardComponent],
})
export class ProfileCardModule { }
