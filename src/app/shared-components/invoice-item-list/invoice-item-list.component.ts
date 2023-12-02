import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

export interface InvoiceItem {
  id: string;
  planId?: string;
  invoiceId: string;
  quantity: number | null;
  address: string;
  rate: number | null;
  total: number | null;
  discount?: number | null;
}

export interface Invoice {
  id: string;
  clientId: string;
  date: string;
  items: InvoiceItem[];
  total: number;
  isPaid: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-invoice-item-list',
  templateUrl: './invoice-item-list.component.html',
  styleUrls: ['./invoice-item-list.component.scss'],
})
export class InvoiceItemListComponent implements OnInit {
  @ViewChild('table') table!: ElementRef;
  @Input() items: InvoiceItem[] = [];
  @Output() changed: EventEmitter<InvoiceItem[]> = new EventEmitter<
    InvoiceItem[]
  >();
  @Output() itemDeleted: EventEmitter<string> = new EventEmitter<string>();
  @Output() addItemRequest: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.table.nativeElement.contains(event.target);
    const clickedOnDropdown = (event.target as Element).classList.contains(
      'ant-select-item-option-content'
    );
    if (this.editId && !clickedInside && !clickedOnDropdown) {
      this.stopEdit();
    }
  }

  editId: string | null = null;

  ngOnInit(): void {
    this.requestAddItem();
  }

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
    this.handleChange();
  }

  handleChange(): void {
    this.changed.emit(this.items);
  }

  deleteItem(id: string): void {
    console.log('delete item', id);
    this.itemDeleted.emit(id);
  }

  requestAddItem(): void {
    this.addItemRequest.emit();
  }

  // handleCalculateRowTotal() {

  // }
}
