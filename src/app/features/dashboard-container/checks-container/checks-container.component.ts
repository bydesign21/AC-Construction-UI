import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject, Subject, take, takeUntil, tap } from 'rxjs';
import { CreateChecksReportModalComponent } from './create-checks-report-modal/create-checks-report-modal.component';
import { EmployeeContainerComponent } from '../employees-container/employee-container/employee-container.component';
import { CreateCheckModalComponent } from './create-check-modal/create-check-modal.component';
import { DeleteWeeklyReportModalComponent } from '../weekly-reports-container/delete-weekly-report-modal/delete-weekly-report-modal.component';
import { Check } from './check-model/model';
import { ChecksService } from './checks-services/checks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslatePipe } from '../../../shared-components/pipes/translate.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checks-container',
  standalone: false,
  templateUrl: './checks-container.component.html',
  styleUrl: './checks-container.component.scss',
})
export class ChecksContainerComponent implements OnInit {
  constructor(
    private cd: ChangeDetectorRef,
    private modal: NzModalService,
    private checks: ChecksService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService,
    private translate: TranslatePipe
  ) {}
  checks$: BehaviorSubject<Check[]> = new BehaviorSubject<Check[]>([]);
  reportChecks$: BehaviorSubject<Check[]> = new BehaviorSubject<Check[]>([]);
  loading$ = new BehaviorSubject<boolean>(true);
  destroy$ = new Subject<void>();
  currentPage: number = 1;
  limit = 10;
  totalRecords = 0;

  loadData(page: number = 1): void {
    this.checks
      .getChecks(page, this.limit)
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        tap(() => this.loading$.next(true))
      )
      .subscribe(response => {
        this.checks$.next(response.data);
        this.totalRecords = response.count;
        this.loading$.next(false);
        this.cd.detectChanges();
      });
  }

  onPageChange(newPage: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: newPage },
      queryParamsHandling: 'merge',
    });
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const newPage = Number(params?.page) || 1;
      this.currentPage = newPage;
      this.loadData(this.currentPage);
    });
    this.cd.detectChanges();
  }

  // Checks container

  handleViewItem(item: Check) {
    const modal = this.modal.create({
      nzTitle:
        this.translate.syncTransform('CHECKS.VIEW_CHECK') || 'View Check',
      nzOkText:
        this.translate.syncTransform('COMMON.ACTIONS.UPDATE') || 'Update',
      nzOkDisabled: true,
      nzCancelText:
        this.translate.syncTransform('COMMON.ACTIONS.CANCEL') || 'Cancel',
      nzContent: CreateCheckModalComponent,
      nzData: { check: item },
      nzWidth: '100dvw',
      nzBodyStyle: { height: '85dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
    });

    modal.afterOpen.pipe(takeUntil(this.destroy$)).subscribe(() => {
      modal.updateConfig({
        nzFooter: modal.componentInstance?.modalFooter,
      });
    });

    modal.afterClose.pipe(take(1)).subscribe((check: Check) => {
      if (check) {
        this.updateCheck(check);
      }
    });
  }

  updateCheck(check: Check) {
    this.checks
      .updateCheck(check)
      .pipe(take(1))
      .subscribe({
        next: () => {
          const checks = this.checks$.getValue();
          const checkIndex = checks.findIndex(
            i => i.checkNumber === check.checkNumber
          );
          checks[checkIndex] = check;
          this.checks$.next([...checks]);
          this.message.success(
            this.translate.syncTransform('CHECKS.CHECK_UPDATE_SUCCESS') ||
              'Check updated successfully'
          );
        },
        error: err => {
          this.message.error(
            `${
              this.translate.syncTransform('CHECKS.CHECK_UPDATE_ERROR') ||
              'Error updating check'
            }: ${err.message}`
          );
        },
        complete: () => this.cd.detectChanges(),
      });
  }

  handlePrintItem(item: Check) {
    console.log('item printed', item);
  }

  handleDeleteItem(checkNumber: string) {
    this.modal.create({
      nzOkDanger: true,
      nzTitle:
        this.translate.syncTransform('COMMON.MISC.CONFIRM_DELETION') ||
        'Confirm Deletion',
      nzContent: DeleteWeeklyReportModalComponent,
      nzOkText:
        this.translate.syncTransform('COMMON.ACTIONS.DELETE') || 'Delete',
      nzCancelText:
        this.translate.syncTransform('COMMON.ACTIONS.CANCEL') || 'Cancel',
      nzOnOk: () => {
        this.deleteCheck(checkNumber);
      },
    });
  }

  deleteCheck(checkNumber: string) {
    this.checks
      .deleteCheck(checkNumber)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadData(this.currentPage);
          this.message.success(
            this.translate.syncTransform('CHECKS.CHECK_DELETE_SUCCESS') ||
              'Check deleted successfully'
          );
        },
        error: err => {
          this.message.error(
            `${
              this.translate.syncTransform('CHECKS.CHECK_DELETE_ERROR') ||
              'Error deleting check'
            }: ${err.message}`
          );
        },
        complete: () => this.cd.detectChanges(),
      });
  }

  // Report Modal
  handleCreateCheckReport() {
    const modal = this.modal.create({
      nzTitle:
        this.translate.syncTransform('CHECKS.CREATE_CHECK_REPORTs') ||
        'Create Check Report',
      nzContent: CreateChecksReportModalComponent,
      nzWidth: '100dvw',
      nzBodyStyle: { height: '90dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzFooter: null,
    });

    modal.afterClose.pipe(take(1)).subscribe(() => {
      this.reportChecks$.next([]);
    });
  }

  // check Modal

  handleCreateCheck() {
    const modal = this.modal.create({
      nzTitle:
        this.translate.syncTransform('CHECKS.CREATE_CHECK') || 'Create Check',
      nzOkText:
        this.translate.syncTransform('COMMON.ACTIONS.CREATE') || 'Create',
      nzCancelText:
        this.translate.syncTransform('COMMON.ACTIONS.CANCEL') || 'Cancel',
      nzOkDisabled: true,
      nzContent: CreateCheckModalComponent,
      nzWidth: '100dvw',
      nzBodyStyle: { height: '85dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
    });

    modal.afterClose.pipe(take(1)).subscribe((check: Check) => {
      if (check) {
        this.putCheck(check);
      }
    });

    modal.afterOpen.pipe(takeUntil(this.destroy$)).subscribe(() => {
      modal.updateConfig({
        nzFooter: modal.componentInstance?.modalFooter,
      });
    });
  }

  putCheck(check: Check) {
    this.checks
      .putCheck(check)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadData(this.currentPage);
          this.message.success(
            this.translate.syncTransform('CHECKS.CHECK_CREATED_SUCCESS') ||
              'Check created successfully'
          );
        },
        error: err => {
          this.message.error(
            `${
              this.translate.syncTransform('CHECKS.CHECK_CREATED_ERROR') ||
              'Error creating check'
            }: ${err.message}`
          );
        },
        complete: () => this.cd.detectChanges(),
      });
  }

  // Employee Management Modal

  handleEmployeeManagement() {
    this.modal.create({
      nzTitle:
        this.translate.syncTransform('EMPLOYEES.MANAGE_EMPLOYEES') ||
        'Manage Employees',
      nzFooter: null,
      nzContent: EmployeeContainerComponent,
      nzWidth: '100dvw',
      nzBodyStyle: { height: '90dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
    });
  }
}
