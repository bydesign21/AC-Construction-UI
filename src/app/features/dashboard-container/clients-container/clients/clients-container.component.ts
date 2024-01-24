import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CreateClientFormComponent } from './create-client-form/create-client-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, Subject, debounceTime, take, takeUntil } from 'rxjs';
import { Client } from '../../invoices-container/invoices-model/model';
import { InvoicesService } from '../../invoices-container/invoice-service/invoices.service';
import { TranslatePipe } from '../../../../shared-components/pipes/translate.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-clients-container',
  standalone: false,
  templateUrl: './clients-container.component.html',
  styleUrl: './clients-container.component.scss',
})
export class ClientsContainerComponent implements OnInit, OnDestroy {
  createClientModalRef!: NzModalRef<CreateClientFormComponent, any>;
  clientList: Client[] = [];
  count: number = 0;
  currentPage: number = 1;
  limit: number = 10;
  searchTerm$ = new Subject<string>();
  loading$ = new BehaviorSubject<boolean>(false);
  searchTerm: string = '';
  destroy$ = new Subject<void>();

  constructor(
    private modal: NzModalService,
    private message: NzMessageService,
    private cd: ChangeDetectorRef,
    private invoices: InvoicesService,
    private translate: TranslatePipe
  ) {}

  ngOnInit(): void {
    this.loadClientData();
    this.searchTerm$
      .pipe(takeUntil(this.destroy$), debounceTime(300))
      .subscribe(term => {
        this.searchTerm = term;
        this.loadClientData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  loadClientData() {
    this.loading$.next(true);
    this.invoices
      .getClients(this.currentPage, this.limit, this.searchTerm)
      .pipe(take(1))
      .subscribe({
        next: clients => {
          this.clientList = clients.data;
          this.count = clients.count;
        },
        error: err => {
          this.message.error(`Error loading clients: ${err.message}`);
        },
        complete: () => {
          this.loading$.next(false);
          this.cd.detectChanges();
        },
      });
  }

  loadInvoicesData(searchTerm?: string) {
    return searchTerm;
  }

  handlePageChange(page: number) {
    if (page === this.currentPage) return;
    this.currentPage = page;
    this.loadClientData();
  }

  handleCreateClientClicked() {
    this.createClientModalRef = this.modal.create({
      nzContent: CreateClientFormComponent,
      nzTitle: 'Create Client',
      nzWidth: '60%',
      nzData: { isEditMode: true },
      nzStyle: { top: '2rem' },
      nzOkText: 'Create',
      nzCancelText: 'Cancel',
      nzOnOk: () => this.handleCreateClientModalOk(),
    });

    this.createClientModalRef.componentInstance?.isOkDisabled
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDisabled: boolean) => {
        this.createClientModalRef.updateConfig({
          nzOkDisabled: isDisabled,
        });
      });
  }

  handleViewClientClicked(client: Client) {
    this.createClientModalRef = this.modal.create({
      nzContent: CreateClientFormComponent,
      nzTitle: 'View Client',
      nzWidth: '60%',
      nzData: { client },
      nzStyle: { top: '2rem' },
      nzOkText: 'Update',
      nzCancelText: 'Cancel',
      nzOnOk: () => this.handleCreateClientModalOk(),
    });

    this.createClientModalRef.componentInstance?.isOkDisabled
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDisabled: boolean) => {
        this.createClientModalRef.updateConfig({
          nzOkDisabled: isDisabled,
        });
      });
  }

  handleCreateClientModalOk() {
    const instance = this.createClientModalRef.getContentComponent();
    if (instance.isFormValid()) {
      const form = instance.onSubmit();
      const isClientUpdated = Boolean(instance?.data?.client);
      if (isClientUpdated) {
        this.handleClientEdited(form);
      } else {
        this.handleClientCreated(form);
      }
      return true;
    } else {
      this.message.error('Form is invalid');
      return false;
    }
  }

  handleIsFormTouched() {
    const instance = this.createClientModalRef.getContentComponent();
    return instance.isFormTouched();
  }

  handleClientCreated(client: Client) {
    this.invoices
      .putClient(client)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.message.success('Client created');
          this.loadClientData();
        },
        error: err => {
          this.message.error(`Error creating client: ${err.message}`);
        },
      });
  }

  handleClientDeleted(itemId: string) {
    // TODO: make api call to delete client in backend
    this.invoices
      .deleteClient(itemId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.message.success('Client deleted');
          this.loadClientData();
        },
        error: err => {
          this.message.error(`Error deleting client: ${err.message}`);
        },
      });
  }

  handleClientEdited(client: Client) {
    this.invoices
      .updateClient(client)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.message.success('Client updated');
          this.loadClientData();
        },
        error: err => {
          this.message.error(`Error updating client: ${err.message}`);
        },
      });
  }

  handleClientSearch(searchTerm: string) {
    this.searchTerm$.next(searchTerm);
  }

  handlePrintItem(item: Client) {
    console.log('print item', item);
  }
}
