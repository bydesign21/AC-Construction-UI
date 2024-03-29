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
export class CreateCheckModalComponent implements OnInit, OnDestroy {
  @ViewChild('checkItemListComponent')
  checkItemListComponentRef?: CheckItemListComponent;
  @ViewChild('modalFooter') modalFooter!: TemplateRef<any>;
  @Input() check?: CheckReport;
  IsCheckFormValid$ = new BehaviorSubject<boolean>(false);
  employeeList: Employee[] = [];
  searchTerm$ = new BehaviorSubject<string>('');
  destroy$ = new Subject<void>();
  checkItemList: CheckLineItem[] = [];
  checkNumber?: string;
  searchTermInternal: string = '';
  discount: number = 0;
  discountDisplay: string = '0';
  subtotal: number = 0;
  total: number = 0;
  isEditMode = false;
  employeeInputTouched$ = new BehaviorSubject<boolean>(false);
  checkFormTouched$ = new BehaviorSubject<boolean>(false);
  isDiscountTouched$ = new BehaviorSubject<boolean>(false);

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
      console.log('this.check', this.check);
      this.isEditMode = true;
      this.checkNumber = this.check.checkNumber;
      this.discount = this.check.discount || 0;
      this.onDiscountBlur();
      this.subtotal = this.check.subtotal || 0;
      this.total = this.check.total || 0;
      this.selectedEmployee = this.check.name;
      this.checkItemList = this.check.lineItems;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  handleEditModeToggled() {
    this.isEditMode = !this.isEditMode;
    this.cd.detectChanges();
  }

  isFormValid(): boolean {
    const isFormsValid =
      this.IsCheckFormValid$.getValue() && this.selectedEmployee.length > 0;
    const isAnyInputTouched =
      this.checkFormTouched$.getValue() ||
      this.employeeInputTouched$.getValue() ||
      this.isDiscountTouched$.getValue();

    console.log('isFormsValid', isFormsValid);
    console.log('isEitherFormOrInputTouched', isAnyInputTouched);
    return isFormsValid && isAnyInputTouched;
  }

  onCancel() {
    this.modal.destroy();
  }

  handleEmployeeSelected(employee: string) {
    this.selectedEmployee = employee;
    this.employeeInputTouched$.next(true);
    this.cd.detectChanges();
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
      discount: this.discount,
      total: this.total,
      subtotal: this.subtotal,
      isPaid: false,
      isVoid: false,
    };

    this.modal.destroy(check);
  }

  calculateTotals() {
    const discount = this.discount || 0;
    console.log('discount', discount);
    let total = 0;
    for (const item of this.checkItemList) {
      total += item?.total || 0;
    }
    this.subtotal = total;
    this.total = total - total * discount;
    this.cd.detectChanges();
  }

  onDiscountChange(value: string) {
    this.isDiscountTouched$.next(true);
    const numericValue = parseFloat(value.replace('%', ''));
    if (!isNaN(numericValue)) {
      this.discount = numericValue / 100;
    }
    this.calculateTotals();
  }

  onDiscountBlur() {
    this.discountDisplay = (this.discount * 100).toFixed(0);
  }

  handleLineItemsChanged(items: CheckLineItem[]) {
    this.checkItemList = items;
    this.calculateTotals();
  }

  handleIsValid(isValid: boolean) {
    this.IsCheckFormValid$.next(isValid);
  }

  handleCheckFormTouched(isTouched: boolean) {
    this.checkFormTouched$.next(isTouched);
  }

  handleEmployeeSearch(search: string) {
    this.searchTermInternal = search;
    if (search.length < 1) {
      this.employeeList = [];
      this.cd.detectChanges();
      return;
    }
    this.checks
      .getEmployees(1, 10, search)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(employees => {
        this.employeeList = employees.data;
        this.cd.detectChanges();
      });
  }
}
