import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, combineLatest, take, takeUntil } from 'rxjs';
import { SecondaryNavigationBarService } from '../../../shared-components/secondary-navigation-bar/secondary-navigation-bar.service';
import { CreateChecksReportModalComponent } from './create-checks-report-modal/create-checks-report-modal.component';
import { EmployeeModalComponent } from './employee-modal/employee-modal.component';
import { CreateCheckModalComponent } from './create-check-modal/create-check-modal.component';
import { DeleteWeeklyReportModalComponent } from '../weekly-reports-container/delete-weekly-report-modal/delete-weekly-report-modal.component';
import { Check, CheckReport, Employee } from './check-model/model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checks-container',
  standalone: false,
  templateUrl: './checks-container.component.html',
  styleUrl: './checks-container.component.scss',
})
export class ChecksContainerComponent implements OnInit {
  @ViewChild('CreateChecksReportModalTemplate')
  createChecksReportModalRef!: TemplateRef<CreateChecksReportModalComponent>;
  @ViewChild('EmployeeManagementModalTemplate')
  employeeManagementModalRef!: TemplateRef<EmployeeModalComponent>;
  constructor(
    private navigation: SecondaryNavigationBarService,
    private cd: ChangeDetectorRef,
    private modal: NzModalService
  ) { }
  checks: BehaviorSubject<Check[]> = new BehaviorSubject<Check[]>([]);
  reportChecks$: BehaviorSubject<CheckReport[]> = new BehaviorSubject<
    CheckReport[]
  >([]);
  employeeList$: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      address: '1234 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '12345',
      phone: '1234567890',
      email: '',
      socialSecurityNumber: '123456789',
      employeeIdentificationNumber: '',
      jobTitle: 'Construction Worker',
      hourlyRate: 15,
      isContractor: false,
    },
  ]);

  ngOnInit(): void {
    this.navigation.setNavigationLinks([
      { label: 'Dashboard', iconUrl: 'home', routerUrl: 'dashboard' },
      {
        label: 'Weekly Reports',
        iconUrl: 'project',
        routerUrl: 'weekly-reports',
      },
      { label: 'Invoices', iconUrl: 'profile', routerUrl: 'invoices' },
      { label: 'Checks', iconUrl: 'mail', routerUrl: 'checks' },
      { label: 'Bank', iconUrl: 'bank', routerUrl: 'bank' },
      { label: 'Taxes', iconUrl: 'stock', routerUrl: 'taxes' },
      {
        label: 'Payroll Reports',
        iconUrl: 'bar-chart',
        routerUrl: 'payroll-reports',
      },
    ]);
    this.navigation.setNavigationVisibility(true);
    this.cd.detectChanges();
  }

  // Checks container

  handleViewItem(item: any) {
    const modal = this.modal.create({
      nzTitle: 'View check',
      nzOkText: 'Update',
      nzCancelText: 'Cancel',
      nzContent: CreateCheckModalComponent,
      nzData: { employeeList: this.employeeList$.getValue(), check: item },
      nzWidth: '100dvw',
      nzBodyStyle: { height: '85dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzOnOk: componentInstance => {
        if (componentInstance instanceof CreateCheckModalComponent) {
          componentInstance.onOk();
        }
      },
    });

    if (
      modal.componentInstance?.isValid$ &&
      modal.componentInstance?.selectedName$
    ) {
      combineLatest([
        modal.componentInstance.isValid$,
        modal.componentInstance.selectedName$,
      ])
        .pipe(takeUntil(modal.afterClose))
        .subscribe(([isValid, selectedClient]) => {
          const isOkActive = selectedClient && isValid;
          modal.updateConfig({ nzOkDisabled: !isOkActive });
        });
    }

    modal.afterClose.pipe(take(1)).subscribe((check: any) => {
      if (check) {
        // TODO: make api call to update check in backend
        const checks = this.checks.getValue();
        const checkIndex = checks.findIndex(i => i.id === check.id);
        checks[checkIndex] = check;
        this.checks.next([...checks]);
        this.cd.detectChanges();
      }
    });
  }

  handlePrintItem(item: any) {
    console.log('item printed', item);
  }

  handleDeleteItem(index: number) {
    const deleteItem = (index: number) => {
      const checks = this.checks.getValue();
      checks.splice(index, 1);
      this.checks.next([...checks]);
    };

    // TODO: make api call to delete check in backend

    this.modal.create({
      nzOkDanger: true,
      nzTitle: 'Confirm Deletion',
      nzContent: DeleteWeeklyReportModalComponent,
      nzOkText: 'Delete',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        deleteItem(index);
      },
    });
  }

  // Report Modal
  handleCreateCheckReport() {
    const modal = this.modal.create({
      nzTitle: 'Create Check Report',
      nzContent: this.createChecksReportModalRef,
      nzWidth: '100dvw',
      nzBodyStyle: { height: '90dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzFooter: null,
    });

    modal.afterClose.pipe(take(1)).subscribe(() => {
      this.reportChecks$.next([]);
    });
  }

  handleReportDateRangeChange(dateRange: string) {
    // TODO: handle getting new checks from backend fitting date range
    // set reportchecks to result
  }

  // check Modal

  handleCreateCheck() {
    const modal = this.modal.create({
      nzTitle: 'Create Check',
      nzOkText: 'Create',
      nzCancelText: 'Cancel',
      nzContent: CreateCheckModalComponent,
      nzData: { employeeList: this.employeeList$.getValue() },
      nzWidth: '100dvw',
      nzBodyStyle: { height: '85dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzOnOk: componentInstance => {
        if (componentInstance instanceof CreateCheckModalComponent) {
          componentInstance.onOk();
        }
      },
    });

    modal.afterClose.pipe(take(1)).subscribe((check: any) => {
      if (check) {
        // TODO: make api call to create check in backend
        this.checks.next([...this.checks.getValue(), check]);
        this.cd.detectChanges();
      }
    });

    if (
      modal.componentInstance?.isValid$ &&
      modal.componentInstance?.selectedName$
    ) {
      combineLatest([
        modal.componentInstance.isValid$,
        modal.componentInstance.selectedName$,
      ])
        .pipe(takeUntil(modal.afterClose))
        .subscribe(([isValid, selectedClient]) => {
          const isOkActive = selectedClient && isValid;
          modal.updateConfig({ nzOkDisabled: !isOkActive });
        });
    }
  }

  // Employee Management Modal

  handleEmployeeManagement() {
    this.modal.create({
      nzTitle: 'Manage Employees',
      nzFooter: null,
      nzContent: this.employeeManagementModalRef,
      nzWidth: '100dvw',
      nzBodyStyle: { height: '90dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
    });
  }

  handleEmployeeCreated(client: any) {
    this.employeeList$.next([...this.employeeList$.getValue(), client]);
    // TODO: make api call to create client in backend
  }

  handleClientSearched(searchTerm: string) {
    console.log('search term', searchTerm);
    // TODO: Search for clients matching search term
    // and set client list to result
  }

  handleEmployeeEdited(employee: any) {
    const employeeList = this.employeeList$.getValue();

    const employeeIndex = employeeList.findIndex(e => {
      return e.id ? e.id === employee.id : null;
    });
    employeeList[employeeIndex] = employee;
    this.employeeList$.next([...employeeList]);
    // TODO: make api call to edit client in backend
  }

  handleEmployeeDeleted(employeeIndex: number) {
    const employeeList = this.employeeList$
      .getValue()
      .filter((_, i) => i !== employeeIndex);
    this.employeeList$.next([...employeeList]);
    // TODO: make api call to delete employee in backend
    // and update employee list
  }
}
