import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsContainerComponent } from './clients-container.component';
import { CreateClientFormComponent } from './create-client-form/create-client-form.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientListTableModule } from '../../../../shared-components/client-list-table/client-list-table.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { provideRouter } from '@angular/router';
import { routes } from './clients.routes';
import { TableStateTemplateModule } from '../../../../shared-components/table-state-template/table-state-template.module';

@NgModule({
  declarations: [ClientsContainerComponent, CreateClientFormComponent],
  imports: [
    CommonModule,
    NzInputModule,
    NzIconModule,
    NzFormModule,
    ReactiveFormsModule,
    ClientListTableModule,
    FormsModule,
    NzButtonModule,
    NzModalModule,
    TableStateTemplateModule,
  ],
  providers: [provideRouter(routes)],
  exports: [ClientsContainerComponent, CreateClientFormComponent],
})
export class ClientsModule { }
