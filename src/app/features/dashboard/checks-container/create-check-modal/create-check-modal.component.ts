import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  TemplateRef,
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
  @ViewChild('modalFooter') modalFooter!: TemplateRef<any>;
  @Input() employeeList: Employee[] = [];
  @Input() check?: CheckReport;
  isValid$ = new BehaviorSubject<boolean>(false);
  selectedName$: BehaviorSubject<string> = new BehaviorSubject('');
  checkItemList: CheckLineItem[] = [];
  checkNumber?: string;

  constructor(
    private cd: ChangeDetectorRef,
    private modal: NzModalRef,
    @Inject(NZ_MODAL_DATA)
    public data?: { check?: Check }
  ) {}

  get selectedEmployee() {
    return this.selectedName$.getValue();
  }

  set selectedEmployee(employeeId: string) {
    this.selectedName$.next(employeeId);
  }

  ngOnInit(): void {
    if (this.data) {
      this.check = this.data?.check;
    }
    if (this.check) {
      this.checkNumber = this.check.checkNumber;
      this.selectedName$.next(this.check.name);
      console.log('checkName', this.check.name);
      this.checkItemList = this.check.lineItems;
    }
  }

  isFormValid(): boolean {
    return this.isValid$.getValue();
  }

  onCancel() {
    this.modal.destroy();
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

  submitForm() {
    this.checkItemListComponentRef?.stopEdit();
    const check: Check = {
      checkNumber: this.checkNumber || '',
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

  handleLineItemsChanged(items: CheckLineItem[]) {
    this.checkItemList = items;
    console.log(this.calculateTotal());
    this.cd.detectChanges();
  }

  handleIsValid(isValid: boolean) {
    this.isValid$.next(isValid);
  }
}
