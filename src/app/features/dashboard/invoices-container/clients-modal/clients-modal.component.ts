import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CreateClientFormComponent } from './create-client-form/create-client-form.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { Client } from '../../../../shared-components/client-list-table/client-list-table.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-clients-modal',
  standalone: false,
  templateUrl: './clients-modal.component.html',
  styleUrl: './clients-modal.component.scss',
})
export class ClientsModalComponent implements OnInit, OnDestroy {
  @Input() clientList: Client[] = [
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
  ];
  @Output() clientCreated: EventEmitter<Client> = new EventEmitter<Client>();
  @Output() clientDeleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() clientEdited: EventEmitter<Client> = new EventEmitter<Client>();
  @Output() clientSearched: EventEmitter<string> = new EventEmitter<string>();
  createClientModalRef!: NzModalRef<CreateClientFormComponent, any>;
  searchTerm$ = new Subject<string>();
  searchTerm: string = '';
  destroy$ = new Subject<void>();

  constructor(
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.searchTerm$
      .pipe(takeUntil(this.destroy$), debounceTime(300))
      .subscribe(term => {
        this.clientSearched.emit(term);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
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

    this.searchTerm = '';
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

    this.searchTerm = '';
  }

  handleCreateClientModalOk() {
    const instance = this.createClientModalRef.getContentComponent();
    console.log('instance', instance);
    if (instance.isFormValid()) {
      const form = instance.onSubmit();
      const isClientUpdated = Boolean(instance?.data?.client);
      if (isClientUpdated) {
        this.handleClientEdited(form);
        this.message.success('Client updated');
      } else {
        this.handleClientCreated(form);
        this.message.success('Client created');
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
    this.clientCreated.emit(client);
  }

  handleClientDeleted(clientIndex: number) {
    this.clientDeleted.emit(clientIndex);
  }

  handleClientEdited(client: Client) {
    this.clientEdited.emit(client);
  }

  handleClientSearch(searchTerm: string) {
    this.searchTerm$.next(searchTerm);
  }

  handleDeleteItem(itemIndex: number) {
    this.clientDeleted.emit(itemIndex);
  }

  handlePrintItem(item: Client) {
    console.log('print item', item);
  }
}
