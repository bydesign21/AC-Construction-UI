import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { Client, Invoice, InvoiceItem } from '../invoices-model/model';

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-invoice-modal',
  standalone: false,
  templateUrl: './create-invoice-modal.component.html',
  styleUrl: './create-invoice-modal.component.scss',
})
export class CreateInvoiceModalComponent implements OnInit {
  @Input() clientList: Client[] = [];
  @Input() invoice?: Invoice;
  isValid$ = new BehaviorSubject<boolean>(false);
  selectedClient$: BehaviorSubject<string> = new BehaviorSubject('');
  invoiceItemList: InvoiceItem[] = [];
  invoiceId: string = '';

  constructor(
    private cd: ChangeDetectorRef,
    private modal: NzModalRef,
    @Inject(NZ_MODAL_DATA)
    public data?: { clientList: Client[]; invoice?: Invoice }
  ) {}

  get selectedClient() {
    return this.selectedClient$.getValue();
  }

  set selectedClient(clientId: string) {
    this.selectedClient$.next(clientId);
  }

  ngOnInit(): void {
    if (this.data) {
      this.clientList = this.data.clientList;
      this.invoice = this.data.invoice;
    }
    if (this.invoice) {
      this.invoiceId = this.invoice.id;
      this.selectedClient$.next(this.invoice.clientId);
      this.invoiceItemList = this.invoice.items;
    } else {
      this.invoiceId = generateId();
    }
  }

  handleAddLineItem() {
    const newItemTemplate: InvoiceItem = {
      address: '',
      discount: null,
      total: null,
      quantity: null,
      planId: '',
      invoiceId: this.invoiceId,
      rate: null,
    };

    this.invoiceItemList = [...this.invoiceItemList, newItemTemplate];
    this.cd.detectChanges();
  }

  handleClientChanged(clientId: string) {
    this.selectedClient$.next(clientId);
  }

  handleDeleteLineItem(index: number) {
    this.invoiceItemList = this.invoiceItemList.filter((_, i) => i !== index);
    this.cd.detectChanges();
  }

  emitAndCloseModal() {
    const invoice: Invoice = {
      id: this.invoiceId,
      clientId: this.selectedClient$.getValue() || '',
      date: new Date().toISOString(),
      items: this.invoiceItemList,
      total: 0,
      isPaid: false,
    };

    this.modal.destroy(invoice);
  }

  onOk(): void {
    this.emitAndCloseModal();
  }

  handleLineItemsChanged(items: InvoiceItem[]) {
    this.invoiceItemList = items;
    this.cd.detectChanges();
  }

  handleIsValid(isValid: boolean) {
    this.isValid$.next(isValid);
  }
}
