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
import { BehaviorSubject, Observable, debounceTime } from 'rxjs';
import {
  Check,
  CheckLineItem,
  CheckReport,
  Employee,
} from '../check-model/model';
import { CheckItemListComponent } from '../../../../shared-components/check-item-list/check-item-list.component';
import { ChecksService } from '../checks-services/checks.service';

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
  @Input() check?: CheckReport;
  isValid$ = new BehaviorSubject<boolean>(false);
  employeeList$: Observable<Employee[]> = this.checks.getEmployees();
  searchTerm$ = new BehaviorSubject<string>('');
  checkItemList: CheckLineItem[] = [];
  checkNumber?: string;
  searchTermInternal: string = '';

  constructor(
    private cd: ChangeDetectorRef,
    private modal: NzModalRef,
    private checks: ChecksService,
    @Inject(NZ_MODAL_DATA)
    public data?: { check?: Check }
  ) {}

  get selectedEmployee() {
    return this.searchTerm$.getValue();
  }

  set selectedEmployee(employeeId: string) {
    this.searchTerm$.next(employeeId);
  }

  ngOnInit(): void {
    if (this.data) {
      this.check = this.data?.check;
    }
    if (this.check) {
      this.checkNumber = this.check.checkNumber;
      this.searchTerm$.next(this.check.name);
      this.searchTermInternal = this.check.name;
      console.log('checkName', this.check.name);
      this.checkItemList = this.check.lineItems;
    }

    this.searchTerm$.pipe(debounceTime(300)).subscribe(term => {
      this.employeeList$ = this.checks.getEmployeesBySearchTerm(term);
    });
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

  handleSearchTermChanged(term: string) {
    this.searchTermInternal = term;
    this.searchTerm$.next(term);
  }

  handleDeleteLineItem(index: number) {
    this.checkItemList = this.checkItemList.filter((_, i) => i !== index);
    this.cd.detectChanges();
  }

  submitForm() {
    this.checkItemListComponentRef?.stopEdit();
    const check: Check = {
      checkNumber: this.checkNumber || undefined,
      name: this.searchTerm$.getValue() || '',
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
