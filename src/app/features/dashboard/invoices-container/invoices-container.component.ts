import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, take } from 'rxjs';
import { SecondaryNavigationBarService } from '../../../shared-components/secondary-navigation-bar/secondary-navigation-bar.service';
import { DeleteWeeklyReportModalComponent } from '../weekly-reports-container/delete-weekly-report-modal/delete-weekly-report-modal.component';
import { CreateReportModalComponent } from './create-report-modal/create-report-modal.component';
import { ClientsModalComponent } from './clients-modal/clients-modal.component';
import { CreateInvoiceModalComponent } from './create-invoice-modal/create-invoice-modal.component';
import { InvoiceReport } from '../../../shared-components/invoice-report-table/invoice-report-table.component';
import { Client } from '../../../shared-components/client-list-table/client-list-table.component';
import { Invoice } from '../../../shared-components/invoice-item-list/invoice-item-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-invoices-container',
  standalone: false,
  templateUrl: './invoices-container.component.html',
  styleUrl: './invoices-container.component.scss',
})
export class InvoicesContainerComponent {
  @ViewChild('CreateInvoiceReportModalTemplate')
  createReportModalRef!: TemplateRef<CreateReportModalComponent>;
  @ViewChild('ClientManagementModalTemplate')
  clientManagementModalRef!: TemplateRef<ClientsModalComponent>;
  constructor(
    private navigation: SecondaryNavigationBarService,
    private cd: ChangeDetectorRef,
    private modal: NzModalService
  ) {}
  invoices: BehaviorSubject<Invoice[]> = new BehaviorSubject<Invoice[]>([
    {
      id: '1',
      clientId: '1',
      items: [],
      date: '2021-01-01',
      total: 0,
      isPaid: false,
    },
  ]);
  reportInvoices$: BehaviorSubject<Invoice[]> = new BehaviorSubject<Invoice[]>([
    {
      id: '1',
      clientId: '1',
      items: [],
      date: '2021-01-01',
      total: 0,
      isPaid: false,
    },
  ]);
  clientList$: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>([
    {
      id: '1',
      name: 'Client 1',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      phone: '1234567890',
      email: 'loganvasquez@gmail.com',
    },
  ]);

  ngOnInit(): void {
    this.navigation.setNavigationLinks([
      { label: 'Dashboard', iconUrl: 'home', routerUrl: 'dashboard' },
      {
        label: 'Weekly Reports',
        iconUrl: 'project',
        routerUrl: 'weekly-reports',
      },
      { label: 'Invoices', iconUrl: 'profile', routerUrl: 'invoices' },
      { label: 'Checks', iconUrl: 'mail', routerUrl: 'checks' },
      { label: 'Bank', iconUrl: 'bank', routerUrl: 'bank' },
      { label: 'Taxes', iconUrl: 'stock', routerUrl: 'taxes' },
      {
        label: 'Payroll Reports',
        iconUrl: 'bar-chart',
        routerUrl: 'payroll-reports',
      },
    ]);
    this.navigation.setNavigationVisibility(true);
    this.cd.detectChanges();
  }

  // Invoices container

  handleViewItem(item: any) {
    console.log('item viewed', item);
  }

  handlePrintItem(item: any) {
    console.log('item printed', item);
  }

  handleDeleteItem(index: number) {
    const deleteItem = (index: number) => {
      const invoices = this.invoices.getValue();
      invoices.splice(index, 1);
      this.invoices.next([...invoices]);
    };
    this.modal.create({
      nzOkDanger: true,
      nzTitle: 'Confirm Deletion',
      nzContent: DeleteWeeklyReportModalComponent,
      nzOkText: 'Delete',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        deleteItem(index);
      },
    });
  }

  // Report Modal
  handleCreateInvoiceReport() {
    const modal = this.modal.create({
      nzTitle: 'Create Invoices Report',
      nzContent: this.createReportModalRef,
      nzWidth: '100dvw',
      nzBodyStyle: { height: '90dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzFooter: null,
    });

    modal.afterClose.pipe(take(1)).subscribe(() => {
      this.reportInvoices$.next([]);
    });
  }

  handleReportDateRangeChange(dateRange: string) {
    // handle getting new invoices from backend fitting date range
    // set reportInvoices to result
  }

  // Invoice Modal

  handleCreateInvoice() {
    const modal = this.modal.create({
      nzTitle: 'Create Invoice',
      nzOkText: 'Create',
      nzCancelText: 'Cancel',
      nzContent: CreateInvoiceModalComponent,
      nzWidth: '100dvw',
      nzBodyStyle: { height: '85dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzOnOk: componentInstance => {
        if (componentInstance instanceof CreateInvoiceModalComponent) {
          componentInstance.onOk();
        }
      },
    });

    modal.afterClose.pipe(take(1)).subscribe((invoice: Invoice) => {
      if (invoice) {
        // TODO: make api call to create invoice in backend
        console.log('invoice report created', invoice);
        this.invoices.next([...this.invoices.getValue(), invoice]);
        this.cd.detectChanges();
        console.log('invoices', this.invoices.getValue());
      }
    });
  }

  // Client Management Modal

  handleClientManagement() {
    this.modal.create({
      nzTitle: 'Manage Clients',
      nzFooter: null,
      nzContent: this.clientManagementModalRef,
      nzWidth: '100dvw',
      nzBodyStyle: { height: '90dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzOnOk: componentInstance => {
        if (componentInstance instanceof ClientsModalComponent) {
          // componentInstance.onOk();
        }
      },
    });
  }

  handleClientCreated(client: Client) {
    console.log('client created', client);
    this.clientList$.next([...this.clientList$.getValue(), client]);
    // TODO: make api call to create client in backend
  }

  handleClientSearched(searchTerm: string) {
    console.log('search term', searchTerm);
    // TODO: Search for clients matching search term
    // and set client list to result
  }

  handleClientEdited(client: Client) {
    console.log('client edited', client);
    const clientList = this.clientList$.getValue();
    const clientIndex = clientList.findIndex(c =>
      c.id ? c.id === client.id : null
    );
    clientList[clientIndex] = client;
    this.clientList$.next([...clientList]);
    // TODO: make api call to edit client in backend
  }

  handleClientDeleted(clientIndex: number) {
    console.log('client deleted', clientIndex);
    const clientList = this.clientList$
      .getValue()
      .filter((_, i) => i !== clientIndex);
    this.clientList$.next([...clientList]);
    // TODO: make api call to delete client in backend
    // and update client list
  }
}
