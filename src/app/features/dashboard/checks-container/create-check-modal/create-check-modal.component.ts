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
import {
  Check,
  CheckLineItem,
  CheckReport,
  Employee,
} from '../check-model/model';

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-check-modal',
  standalone: false,
  templateUrl: './create-check-modal.component.html',
  styleUrl: './create-check-modal.component.scss',
})
export class CreateCheckModalComponent implements OnInit {
  @Input() employeeList: Employee[] = [];
  @Input() check?: CheckReport;
  isValid$ = new BehaviorSubject<boolean>(false);
  selectedEmployee$: BehaviorSubject<string> = new BehaviorSubject('');
  checkItemList: CheckLineItem[] = [];
  checkId?: string;

  constructor(
    private cd: ChangeDetectorRef,
    private modal: NzModalRef,
    @Inject(NZ_MODAL_DATA)
    public data?: { employeeList: Employee[]; check?: Check }
  ) {}

  get selectedEmployee() {
    return this.selectedEmployee$.getValue();
  }

  set selectedEmployee(employeeId: string) {
    this.selectedEmployee$.next(employeeId);
  }

  ngOnInit(): void {
    if (this.data) {
      this.employeeList = this.data.employeeList;
      this.check = this.data.check;
    }
    if (this.check) {
      this.checkId = this.check.id;
      this.selectedEmployee$.next(this.check.employeeId);
      this.checkItemList = this.check.lineItems;
    } else {
      this.checkId = generateId();
    }
  }

  handleAddLineItem() {
    const newItemTemplate: CheckLineItem = {
      checkId: this?.checkId,
      amount: 0,
      description: '',
    };

    this.checkItemList = [...this.checkItemList, newItemTemplate];
    this.cd.detectChanges();
  }

  handleEmployeeChanged(employeeId: string) {
    this.selectedEmployee$.next(employeeId);
  }

  handleDeleteLineItem(index: number) {
    this.checkItemList = this.checkItemList.filter((_, i) => i !== index);
    this.cd.detectChanges();
  }

  emitAndCloseModal() {
    const check: Check = {
      id: this.checkId,
      employeeId: this.selectedEmployee$.getValue() || '',
      date: new Date().toISOString(),
      lineItems: this.checkItemList,
      total: 0,
      isCharged: false,
      isVoid: false,
      checkNumber: '',
      description: '',
    };

    this.modal.destroy(check);
  }

  onOk(): void {
    this.emitAndCloseModal();
  }

  handleLineItemsChanged(items: CheckLineItem[]) {
    this.checkItemList = items;
    this.cd.detectChanges();
  }

  handleIsValid(isValid: boolean) {
    this.isValid$.next(isValid);
  }
}
