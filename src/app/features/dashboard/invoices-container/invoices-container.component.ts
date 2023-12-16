import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, combineLatest, take, takeUntil } from 'rxjs';
import { SecondaryNavigationBarService } from '../../../shared-components/secondary-navigation-bar/secondary-navigation-bar.service';
import { DeleteWeeklyReportModalComponent } from '../weekly-reports-container/delete-weekly-report-modal/delete-weekly-report-modal.component';
import { CreateReportModalComponent } from './create-report-modal/create-report-modal.component';
import { ClientsModalComponent } from './clients-modal/clients-modal.component';
import { CreateInvoiceModalComponent } from './create-invoice-modal/create-invoice-modal.component';
import { Client, Invoice } from './invoices-model/model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checks-container',
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
    {
      id: '2',
      name: 'Client 1',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      phone: '1234567890',
      email: 'loganvasquez@gmail.com',
    },
    {
      id: '3',
      name: 'Client 1',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      phone: '1234567890',
      email: 'loganvasquez@gmail.com',
    },
    {
      id: '4',
      name: 'Client 1',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      phone: '1234567890',
      email: 'loganvasquez@gmail.com',
    },
    {
      id: '5',
      name: 'Client 1',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      phone: '1234567890',
      email: 'loganvasquez@gmail.com',
    },
    {
      id: '6',
      name: 'Client 1',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      phone: '1234567890',
      email: 'loganvasquez@gmail.com',
    },
    {
      id: '7',
      name: 'Client 1',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      phone: '1234567890',
      email: 'loganvasquez@gmail.com',
    },
    {
      id: '8',
      name: 'Client 1',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      phone: '1234567890',
      email: 'loganvasquez@gmail.com',
    },
    {
      id: '9',
      name: 'Client 1',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      phone: '1234567890',
      email: 'loganvasquez@gmail.com',
    },
    {
      id: '10',
      name: 'Client 1',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      phone: '1234567890',
      email: 'loganvasquez@gmail.com',
    },
    {
      id: '11',
      name: 'Client 1',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      phone: '1234567890',
      email: 'loganvasquez@gmail.com',
    },
    {
      id: '12',
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

  handleViewItem(item: Invoice) {
    const modal = this.modal.create({
      nzTitle: 'View Invoice',
      nzOkText: 'Update',
      nzCancelText: 'Cancel',
      nzContent: CreateInvoiceModalComponent,
      nzData: { clientList: this.clientList$.getValue(), invoice: item },
      nzWidth: '100dvw',
      nzBodyStyle: { height: '85dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzOnOk: componentInstance => {
        if (componentInstance instanceof CreateInvoiceModalComponent) {
          componentInstance.onOk();
        }
      },
    });

    if (
      modal.componentInstance?.isValid$ &&
      modal.componentInstance?.selectedClient$
    ) {
      combineLatest([
        modal.componentInstance.isValid$,
        modal.componentInstance.selectedClient$,
      ])
        .pipe(takeUntil(modal.afterClose))
        .subscribe(([isValid, selectedClient]) => {
          const isOkActive = selectedClient && isValid;
          modal.updateConfig({ nzOkDisabled: !isOkActive });
        });
    }

    modal.afterClose.pipe(take(1)).subscribe((invoice: Invoice) => {
      if (invoice) {
        // TODO: make api call to update invoice in backend
        const invoices = this.invoices.getValue();
        const invoiceIndex = invoices.findIndex(i => i.id === invoice.id);
        invoices[invoiceIndex] = invoice;
        this.invoices.next([...invoices]);
        this.cd.detectChanges();
      }
    });
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

    // TODO: make api call to delete invoice in backend

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
    // TODO: handle getting new invoices from backend fitting date range
    // set reportInvoices to result
  }

  // Invoice Modal

  handleCreateInvoice() {
    const modal = this.modal.create({
      nzTitle: 'Create Invoice',
      nzOkText: 'Create',
      nzCancelText: 'Cancel',
      nzContent: CreateInvoiceModalComponent,
      nzData: { clientList: this.clientList$.getValue() },
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
        this.invoices.next([...this.invoices.getValue(), invoice]);
        this.cd.detectChanges();
      }
    });

    if (
      modal.componentInstance?.isValid$ &&
      modal.componentInstance?.selectedClient$
    ) {
      combineLatest([
        modal.componentInstance.isValid$,
        modal.componentInstance.selectedClient$,
      ])
        .pipe(takeUntil(modal.afterClose))
        .subscribe(([isValid, selectedClient]) => {
          const isOkActive = selectedClient && isValid;
          modal.updateConfig({ nzOkDisabled: !isOkActive });
        });
    }
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
    });
  }

  handleClientCreated(client: Client) {
    this.clientList$.next([...this.clientList$.getValue(), client]);
    // TODO: make api call to create client in backend
  }

  handleClientSearched(searchTerm: string) {
    console.log('search term', searchTerm);
    // TODO: Search for clients matching search term
    // and set client list to result
  }

  handleClientEdited(client: Client) {
    const clientList = this.clientList$.getValue();

    const clientIndex = clientList.findIndex(c => {
      return c.id ? c.id === client.id : null;
    });
    clientList[clientIndex] = client;
    this.clientList$.next([...clientList]);
    // TODO: make api call to edit client in backend
  }

  handleClientDeleted(clientIndex: number) {
    const clientList = this.clientList$
      .getValue()
      .filter((_, i) => i !== clientIndex);
    this.clientList$.next([...clientList]);
    // TODO: make api call to delete client in backend
    // and update client list
  }
}
