import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { DeleteWeeklyReportModalComponent } from '../weekly-reports-container/delete-weekly-report-modal/delete-weekly-report-modal.component';
import { CreateReportModalComponent } from './create-report-modal/create-report-modal.component';
import { ClientsContainerComponent } from '../clients-container/clients/clients-container.component';
import { CreateInvoiceModalComponent } from './create-invoice-modal/create-invoice-modal.component';
import { Invoice } from './invoices-model/model';
import { InvoicesService } from './invoice-service/invoices.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checks-container',
  standalone: false,
  templateUrl: './invoices-container.component.html',
  styleUrl: './invoices-container.component.scss',
})
export class InvoicesContainerComponent implements OnInit, OnDestroy {
  constructor(
    private cd: ChangeDetectorRef,
    private modal: NzModalService,
    private invoices: InvoicesService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  orders$: BehaviorSubject<Invoice[]> = new BehaviorSubject<Invoice[]>([]);
  loading$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject();
  currentPage = 1;
  totalRecords = 0;
  limit = 10;

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const newPage = Number(params?.page) || 1;
      this.currentPage = newPage;
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  loadData() {
    this.loading$.next(true);
    this.invoices
      .getInvoices(this.currentPage, this.limit)
      .pipe(take(1))
      .subscribe({
        next: reports => {
          this.orders$.next(reports.data);
          this.totalRecords = reports.count;
        },
        error: err => {
          this.message.error(`Error loading invoices: ${err.message}`);
        },
        complete: () => {
          this.loading$.next(false);
          this.cd.detectChanges();
        },
      });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: newPage },
      queryParamsHandling: 'merge',
    });
  }

  // Invoices container

  handleViewItem(item: Invoice) {
    const modal = this.modal.create({
      nzTitle: 'View Invoice',
      nzOkText: 'Update',
      nzCancelText: 'Cancel',
      nzOkDisabled: true,
      nzContent: CreateInvoiceModalComponent,
      nzData: { invoice: item },
      nzWidth: '100dvw',
      nzBodyStyle: { height: '85dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
    });

    modal.afterClose.pipe(take(1)).subscribe((invoice: Invoice) => {
      if (invoice) {
        // TODO: make api call to update invoice in backend
        this.handleUpdateInvoice(invoice);
      }
    });
  }

  handlePrintItem(item: any) {
    console.log('item printed', item);
  }

  handleDeleteItem(index: number) {
    const deleteItem = (index: number) => {
      const invoices = this.orders$.getValue();
      invoices.splice(index, 1);
      this.orders$.next([...invoices]);
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
      nzContent: CreateReportModalComponent,
      nzWidth: '100dvw',
      nzBodyStyle: { height: '90dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzFooter: null,
    });
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
      nzOkDisabled: true,
    });

    modal.afterClose.pipe(take(1)).subscribe((invoice: Invoice) => {
      if (invoice) {
        // TODO: make api call to create invoice in backend
        this.handlePutInvoice(invoice);
      }
    });
  }

  handlePutInvoice(invoice: Invoice) {
    this.invoices
      .putInvoice(invoice)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadData();
          this.message.success('Invoice created successfully');
        },
        error: err => {
          this.message.error(`Error creating invoice: ${err.message}`);
        },
        complete: () => this.cd.detectChanges(),
      });
  }

  handleUpdateInvoice(invoice: Invoice) {
    this.invoices
      .updateInvoice(invoice)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadData();
          this.message.success('Invoice updated successfully');
        },
        error: err => {
          this.message.error(`Error updating invoice: ${err.message}`);
        },
        complete: () => this.cd.detectChanges(),
      });
  }

  handleDeleteInvoice(invoice: Invoice) {
    if (invoice.orderId) {
      this.invoices
        .deleteInvoice(invoice.orderId)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.loadData();
            this.message.success('Invoice deleted successfully');
          },
          error: err => {
            this.message.error(`Error deleting invoice: ${err.message}`);
          },
          complete: () => this.cd.detectChanges(),
        });
    }
  }
  // Client Management Modal

  handleClientManagement() {
    this.modal.create({
      nzTitle: 'Manage Clients',
      nzFooter: null,
      nzContent: ClientsContainerComponent,
      nzWidth: '100dvw',
      nzBodyStyle: { height: '90dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
    });
  }
}
