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

export enum ExpenseTypes {
  FRAMING = 'Framing',
  DECKING = 'Decking',
  MOULDING = 'Moulding',
  MISC = 'Misc',
}

export type ExpenseType = `${ExpenseTypes}`;

export interface ExpenseItem {
  id: string;
  employeeId?: string;
  address: string;
  sqftPrice?: number;
  sqft?: number;
  amount?: number;
  isPaid?: boolean;
  date?: string;
  type: ExpenseType;
}

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-expense-item-list',
  templateUrl: './expense-item-list.component.html',
  styleUrls: ['./expense-item-list.component.scss'],
})
export class ExpenseItemListComponent implements OnInit {
  @ViewChild('table') table!: ElementRef;
  @Input() items: ExpenseItem[] = [];
  @Input() employeeList: SelectOption[] = [
    { label: 'Mark Zuckerburg', value: '908798' },
    { label: 'Logan Vasquez', value: '3248923' },
  ];
  @Output() changed: EventEmitter<ExpenseItem[]> = new EventEmitter<
    ExpenseItem[]
  >();
  @Output() itemDeleted: EventEmitter<string> = new EventEmitter<string>();
  @Output() addItemRequest: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    console.log(event.target);
    const clickedInside = this.table.nativeElement.contains(event.target);
    const clickedOnDropdown = (event.target as Element).classList.contains(
      'ant-select-item-option-content'
    );
    if (this.editId && !clickedInside && !clickedOnDropdown) {
      this.stopEdit();
    }
  }

  typeOptions = [
    { label: 'Framing', value: ExpenseTypes.FRAMING },
    { label: 'Decking', value: ExpenseTypes.DECKING },
    { label: 'Moulding', value: ExpenseTypes.MOULDING },
    { label: 'Misc', value: ExpenseTypes.MISC },
  ];

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
    this.itemDeleted.emit(id);
  }

  requestAddItem(): void {
    this.addItemRequest.emit();
    console.log('add item');
  }

  handleSqftCostCalc(index: number) {
    const item = this.items[index];
    const total = () => {
      if (item.sqft && item.sqftPrice) {
        return item?.sqft! * item?.sqftPrice! || undefined;
      } else return item.amount || undefined;
    };
    item.amount = total();
    this.items[index] = item;
    this.handleChange();
  }

  getEmployeeLabelById(id: string): string {
    const employee = this.employeeList.find(e => e.value === id);
    return employee ? employee.label : '';
  }
}
