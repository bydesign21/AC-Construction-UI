import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { EmployeeContainerComponent } from './employee-container/employee-container.component';
import { CreateEmployeeFormComponent } from './employee-container/create-employee-form/create-employee-form.component';
import { EmployeeListTableModule } from '../../../shared-components/employee-list-table/employee-list-table.module';
import { provideRouter } from '@angular/router';
import { routes } from './employees.routes';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { TranslatePipe } from '../../../shared-components/pipes/translate.pipe';

@NgModule({
  declarations: [EmployeeContainerComponent, CreateEmployeeFormComponent],
  providers: [provideRouter(routes)],
  exports: [EmployeeContainerComponent, CreateEmployeeFormComponent],
  imports: [
    CommonModule,
    NzInputModule,
    NzIconModule,
    NzFormModule,
    ReactiveFormsModule,
    FormsModule,
    NzButtonModule,
    NzModalModule,
    EmployeeListTableModule,
    NzCheckboxModule,
    CurrencyMaskModule,
    TranslatePipe,
  ],
})
export class EmployeesModule {}
