import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Client } from '../../../../shared-components/client-list-table/client-list-table.component';
import {
  Invoice,
  InvoiceItem,
} from '../../../../shared-components/invoice-item-list/invoice-item-list.component';
import { NzModalRef } from 'ng-zorro-antd/modal';

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
  selectedClient: Client | null = null;
  invoiceItemList: InvoiceItem[] = [];
  invoiceId: string = '';

  constructor(
    private cd: ChangeDetectorRef,
    private modal: NzModalRef
  ) {}

  ngOnInit(): void {
    if (this.invoice) {
      this.invoiceId = this.invoice.id;
      // this.selectedClient = this.invoice.clientId;
      this.invoiceItemList = this.invoice.items;
    } else {
      this.invoiceId = generateId();
    }
  }

  handleAddLineItem() {
    const newItemTemplate: InvoiceItem = {
      id: generateId(),
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

  handleClientChanged(client: Client) {
    this.selectedClient = client;
  }

  handleDeleteLineItem(id: string) {
    console.log('delete item', id);
    this.invoiceItemList = [
      ...this.invoiceItemList.filter(item => item.id !== id),
    ];
    console.log(this.invoiceItemList);
    this.cd.detectChanges();
  }

  emitAndCloseModal() {
    const invoice: Invoice = {
      id: this.invoiceId,
      clientId: this.selectedClient?.id || '',
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
    console.log('line items changed', items);
    this.cd.detectChanges();
  }
}
