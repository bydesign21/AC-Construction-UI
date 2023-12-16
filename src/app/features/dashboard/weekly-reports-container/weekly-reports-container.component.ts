import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SecondaryNavigationBarService } from '../../../shared-components/secondary-navigation-bar/secondary-navigation-bar.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeleteWeeklyReportModalComponent } from './delete-weekly-report-modal/delete-weekly-report-modal.component';
import { CreateWeeklyReportModalComponent } from './create-weekly-report-modal/create-weekly-report-modal.component';
import { BehaviorSubject, Subject, combineLatest, take, takeUntil } from 'rxjs';
import {
  WeeklyReport,
  WeeklyReportDataEmission,
} from './weekly-reports-model/model';
import { WeeklyReportsService } from './weekly-reports-services/weekly-reports.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-weekly-reports-container',
  standalone: false,
  templateUrl: './weekly-reports-container.component.html',
  styleUrl: './weekly-reports-container.component.scss',
})
export class WeeklyReportsContainerComponent implements OnInit, OnDestroy {
  constructor(
    private navigation: SecondaryNavigationBarService,
    private cd: ChangeDetectorRef,
    private modal: NzModalService,
    private data: WeeklyReportsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  reports$: BehaviorSubject<WeeklyReport[]> = new BehaviorSubject<
    WeeklyReport[]
  >([]);
  loading$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject();
  currentPage = 1;
  totalRecords = 0;
  limit = 10;
  dateRange: Date[] = [];

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const newPage = Number(params?.page) || 1;
      this.currentPage = newPage;
      this.loadData(this.currentPage);
    });

    this.navigation.setNavigationLinks([
      { label: 'Dashboard', iconUrl: 'home', routerUrl: 'dashboard' },
      {
        label: 'Weekly Reports',
        iconUrl: 'project',
        routerUrl: 'weekly-reports',
      },
      { label: 'Invoices', iconUrl: 'profile', routerUrl: 'invoices' },
      { label: 'Checks', iconUrl: 'mail', routerUrl: 'checks' },
      {
        label: 'Payroll Reports',
        iconUrl: 'bar-chart',
        routerUrl: 'payroll-reports',
      },
    ]);
    this.navigation.setNavigationVisibility(true);
    this.loadData();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  handleDateRangeChange(dateRange: Date[]) {
    this.dateRange = dateRange;
    this.currentPage = 1;
    this.loadData();
  }

  loadData(page: number = 1) {
    this.loading$.next(true);
    this.data
      .getWeeklyReports(page, this.limit, this.dateRange)
      .pipe(take(1))
      .subscribe(reports => {
        this.reports$.next(reports.data);
        this.totalRecords = reports.count;
        this.currentPage = page;
        console.log('reports', reports);
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

  handleViewItem(item: WeeklyReport) {
    const modal = this.modal.create({
      nzTitle: 'View Weekly Report',
      nzOkText: 'Update',
      nzCancelText: 'Cancel',
      nzContent: CreateWeeklyReportModalComponent,
      nzData: { report: item },
      nzWidth: '100dvw',
      nzBodyStyle: { height: '85dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzOnOk: componentInstance => {
        if (componentInstance instanceof CreateWeeklyReportModalComponent) {
          componentInstance.onOk();
        }
      },
    });

    if (modal.componentInstance) {
      combineLatest([
        modal.componentInstance?.isInputRowValid$,
        modal.componentInstance?.isExpenseListValid$,
        modal.componentInstance?.isInputRowTouched$,
        modal.componentInstance?.isExpenseListTouched$,
      ])
        .pipe(takeUntil(modal.afterClose))
        .subscribe(
          ([
            isInputRowValid,
            isExpenseListValid,
            isInputRowTouched,
            isExpenseListTouched,
          ]) => {
            const isEitherFormInvalid = !isInputRowValid || !isExpenseListValid;
            const isNeitherFormTouched =
              !isInputRowTouched && !isExpenseListTouched;
            modal.updateConfig({
              nzOkDisabled: isEitherFormInvalid || isNeitherFormTouched,
            });
          }
        );
    }

    modal.afterClose
      .pipe(take(1))
      .subscribe((report: WeeklyReportDataEmission) => {
        if (report) {
          const reports = this.reports$.getValue();
          const reportIndex = reports.findIndex(
            report => report.id === item.id
          );
          if (reportIndex === -1) {
            console.error('Report not found in reports array', item);
            return;
          }
          reports[reportIndex] = report;
          this.reports$.next([...reports]);
          this.cd.detectChanges();
        }
      });
  }

  handlePrintItem(item: WeeklyReport) {
    console.log('item printed', item);
  }

  handleDeleteItem(index: number) {
    const deleteItem = (index: number) => {
      const reports = this.reports$.getValue();
      reports.splice(index, 1);
      this.reports$.next([...reports]);
    };
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

  handleCreateReport() {
    const modal = this.modal.create({
      nzTitle: 'Create Weekly Report',
      nzOkText: 'Create',
      nzCancelText: 'Cancel',
      nzContent: CreateWeeklyReportModalComponent,
      nzWidth: '100dvw',
      nzBodyStyle: { height: '85dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzOnOk: componentInstance => {
        if (componentInstance instanceof CreateWeeklyReportModalComponent) {
          componentInstance.onOk();
        }
      },
    });

    if (modal.componentInstance) {
      combineLatest([
        modal.componentInstance?.isInputRowValid$,
        modal.componentInstance?.isExpenseListValid$,
      ])
        .pipe(takeUntil(modal.afterClose))
        .subscribe(([isInputRowValid, isExpenseListValid]) => {
          modal.updateConfig({
            nzOkDisabled: !isInputRowValid || !isExpenseListValid,
          });
        });
    }

    modal.afterClose
      .pipe(take(1))
      .subscribe((report: WeeklyReportDataEmission) => {
        if (report) {
          this.reports$.next([...this.reports$.getValue(), report]);
          this.cd.detectChanges();
        }
      });
  }
}
