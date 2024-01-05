import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { Client, Invoice, InvoiceItemDetail } from '../invoices-model/model';
import { InvoicesService } from '../invoice-service/invoices.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-invoice-modal',
  standalone: false,
  templateUrl: './create-invoice-modal.component.html',
  styleUrl: './create-invoice-modal.component.scss',
})
export class CreateInvoiceModalComponent implements OnInit, OnDestroy {
  @ViewChild('modalFooter') modalFooter!: TemplateRef<any>;
  @Input() clientList: Client[] = [];
  @Input() order?: Invoice;
  isItemListValid$ = new BehaviorSubject<boolean>(false);
  isItemListTouched$ = new BehaviorSubject<boolean>(false);
  selectedClient$: BehaviorSubject<string> = new BehaviorSubject('');
  isSelectedClientTouched$ = new BehaviorSubject<boolean>(false);
  searchTerm$ = new BehaviorSubject<string>('');
  destroy$ = new Subject();
  invoiceItemList: InvoiceItemDetail[] = [];
  orderId: number | null = null;
  total$ = new BehaviorSubject<number>(0);
  subtotal$ = new BehaviorSubject<number>(0);
  isEditMode = false;
  searchTermInternal = '';

  constructor(
    private cd: ChangeDetectorRef,
    private modal: NzModalRef,
    private invoice: InvoicesService,
    private message: NzMessageService,
    @Inject(NZ_MODAL_DATA)
    public data?: { clientList: Client[]; invoice?: Invoice }
  ) { }

  get selectedClient() {
    return this.selectedClient$.getValue();
  }

  set selectedClient(clientId: string) {
    this.selectedClient$.next(clientId);
  }

  ngOnInit(): void {
    this.modal.afterOpen.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.modal.updateConfig({
          nzFooter: this.modalFooter,
        });
      },
    });

    if (this.data) {
      this.clientList = this.data?.clientList;
      this.order = this.data?.invoice;
    }
    if (this?.order?.orderId) {
      this.isEditMode = true;
      this.orderId = this.order.orderId;
      this.selectedClient$.next(this.order.client);
      this.invoiceItemList = this.order.orderItems;
      this.handleLineItemsChanged(this.invoiceItemList);
    }
    this.searchTerm$.pipe(takeUntil(this.destroy$)).subscribe({
      next: searchTerm => {
        this.searchTermInternal = searchTerm;
        this.loadClientData();
      },
      complete: () => this.cd.detectChanges(),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  loadClientData() {
    this.invoice
      .getClients(1, 10, this.searchTermInternal)
      .pipe(take(1))
      .subscribe({
        next: res => {
          this.clientList = res.data;
        },
        error: err => {
          this.message.error(`Error loading clients: ${err.message}`);
        },
        complete: () => this.cd.detectChanges(),
      });
  }

  handleAddLineItem() {
    const newItemTemplate: InvoiceItemDetail = {
      address: '',
      discount: undefined,
      total: undefined,
      quantity: undefined,
      planId: '',
      rate: undefined,
    };

    this.invoiceItemList = [...this.invoiceItemList, newItemTemplate];
    this.cd.detectChanges();
  }

  handleClientChanged(clientId: string) {
    this.isSelectedClientTouched$.next(true);
    this.selectedClient$.next(clientId);
  }

  handleDeleteLineItem(index: number) {
    this.invoiceItemList = this.invoiceItemList.filter((_, i) => i !== index);
    this.handleLineItemsChanged(this.invoiceItemList);
  }

  handleEditModeToggled() {
    this.isEditMode = !this.isEditMode;
    this.cd.detectChanges();
  }

  emitAndCloseModal() {
    const invoice: Invoice = {
      orderId: this.orderId || undefined,
      client: this.selectedClient$.getValue() || '',
      date: this.data?.invoice?.date || new Date().toISOString(),
      orderItems: this.invoiceItemList,
      orderTotal: this.total$.getValue() || 0,
      subtotal: this.subtotal$.getValue() || 0,
      isPrinted: this.data?.invoice?.isPrinted || false,
      isPaid: this.data?.invoice?.isPaid || false,
    };

    this.modal.destroy(invoice);
  }

  onOk(): void {
    this.emitAndCloseModal();
  }

  onCancel(): void {
    this.modal.destroy();
  }

  handleLineItemsChanged(items: InvoiceItemDetail[]) {
    const { subtotal, orderTotal, orderItems } =
      this.invoice.calculateTotals(items);
    this.invoiceItemList = orderItems || [];
    this.subtotal$.next(subtotal || 0);
    this.total$.next(orderTotal || 0);
    this.cd.detectChanges();
  }

  handleIsItemListValid(isValid: boolean) {
    this.isItemListValid$.next(isValid);
  }

  handleIsItemListTouched(isTouched: boolean) {
    this.isItemListTouched$.next(isTouched);
  }

  isFormValid(): boolean {
    const isEitherFormInvalid =
      !this.isItemListValid$.getValue() ||
      this.selectedClient$.getValue() === '';
    const isEitherFormTouched =
      this.isItemListTouched$.getValue() ||
      this.isSelectedClientTouched$.getValue();
    return !isEitherFormInvalid && isEitherFormTouched;
  }

  handleSearchTermChanged(searchTerm: string) {
    this.searchTerm$.next(searchTerm);
  }
}
