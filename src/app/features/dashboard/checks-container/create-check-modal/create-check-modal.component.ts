import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import {
  Check,
  CheckLineItem,
  CheckReport,
  Employee,
} from '../check-model/model';
import { CheckItemListComponent } from '../../../../shared-components/check-item-list/check-item-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-check-modal',
  standalone: false,
  templateUrl: './create-check-modal.component.html',
  styleUrl: './create-check-modal.component.scss',
})
export class CreateCheckModalComponent implements OnInit {
  @ViewChild('checkItemListComponent')
  checkItemListComponentRef?: CheckItemListComponent;
  @Input() employeeList: Employee[] = [];
  @Input() check?: CheckReport;
  isValid$ = new BehaviorSubject<boolean>(false);
  selectedName$: BehaviorSubject<string> = new BehaviorSubject('');
  checkItemList: CheckLineItem[] = [];
  checkId?: string;

  constructor(
    private cd: ChangeDetectorRef,
    private modal: NzModalRef,
    @Inject(NZ_MODAL_DATA)
    public data?: { employeeList: Employee[]; check?: Check }
  ) { }

  get selectedEmployee() {
    return this.selectedName$.getValue();
  }

  set selectedEmployee(employeeId: string) {
    this.selectedName$.next(employeeId);
  }

  ngOnInit(): void {
    if (this.data) {
      this.employeeList = this.data.employeeList;
      this.check = this.data.check;
    }
    if (this.check) {
      this.checkId = this.check.id;
      this.selectedName$.next(this.check.name);
      this.checkItemList = this.check.lineItems;
    }
  }

  handleAddLineItem() {
    const newItemTemplate: CheckLineItem = {
      total: null,
      description: null,
    };

    this.checkItemList = [...this.checkItemList, newItemTemplate];
    this.cd.detectChanges();
  }

  handleEmployeeChanged(employeeId: string) {
    this.selectedName$.next(employeeId);
  }

  handleDeleteLineItem(index: number) {
    this.checkItemList = this.checkItemList.filter((_, i) => i !== index);
    this.cd.detectChanges();
  }

  emitAndCloseModal() {
    this.checkItemListComponentRef?.stopEdit();
    const check: Check = {
      id: this.checkId || '',
      name: this.selectedName$.getValue() || '',
      date: new Date().toISOString(),
      lineItems: this.checkItemList,
      total: this.calculateTotal(),
      isPaid: false,
      isVoid: false,
    };

    this.modal.destroy(check);
  }

  calculateTotal() {
    console.log(this.checkItemList, 'items');
    let total = 0;
    for (const item of this.checkItemList) {
      total += item?.total || 0;
    }
    return total;
  }

  onOk(): void {
    this.emitAndCloseModal();
  }

  handleLineItemsChanged(items: CheckLineItem[]) {
    this.checkItemList = items;
    console.log(this.calculateTotal());
    this.cd.detectChanges();
  }

  handleIsValid(isValid: boolean) {
    this.isValid$.next(isValid);
  }
}
