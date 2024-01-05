import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeleteWeeklyReportModalComponent } from './delete-weekly-report-modal/delete-weekly-report-modal.component';
import { CreateWeeklyReportModalComponent } from './create-weekly-report-modal/create-weekly-report-modal.component';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { WeeklyReport } from './weekly-reports-model/model';
import { WeeklyReportsService } from './weekly-reports-services/weekly-reports.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateWeeklyReportAnalysisModalComponent } from './create-weekly-report-analysis-modal/create-weekly-report-analysis-modal.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-weekly-reports-container',
  standalone: false,
  templateUrl: './weekly-reports-container.component.html',
  styleUrl: './weekly-reports-container.component.scss',
})
export class WeeklyReportsContainerComponent implements OnInit, OnDestroy {
  constructor(
    private cd: ChangeDetectorRef,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private router: Router,
    private reports: WeeklyReportsService,
    private message: NzMessageService
  ) { }
  reports$: BehaviorSubject<WeeklyReport[]> = new BehaviorSubject<
    WeeklyReport[]
  >([]);
  loading$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject();
  currentPage = 1;
  totalRecords = 0;
  limit = 10;

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const newPage = Number(params?.page) || 1;
      this.currentPage = newPage;
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  loadData() {
    this.loading$.next(true);
    this.reports
      .getWeeklyReports(this.currentPage, this.limit)
      .pipe(take(1))
      .subscribe(reports => {
        this.reports$.next(reports.data);
        this.totalRecords = reports.count;
        this.loading$.next(false);
        this.cd.detectChanges();
      });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
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
      nzOkDisabled: true,
      nzCancelText: 'Cancel',
      nzContent: CreateWeeklyReportModalComponent,
      nzData: { report: item },
      nzWidth: '100dvw',
      nzBodyStyle: { height: '85dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzOnOk: componentInstance => {
        if (componentInstance instanceof CreateWeeklyReportModalComponent) {
          componentInstance.submitForm();
        }
      },
    });

    modal.afterOpen.pipe(takeUntil(this.destroy$)).subscribe(() => {
      modal.updateConfig({
        nzFooter: modal.componentInstance?.modalFooter,
      });
    });

    modal.afterClose.pipe(take(1)).subscribe((report: WeeklyReport) => {
      if (report) {
        this.updateReport(report);
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

  handleCreateAnalysisReport() {
    this.modal.create({
      nzTitle: 'Create Expenses Report',
      nzContent: CreateWeeklyReportAnalysisModalComponent,
      nzWidth: '100dvw',
      nzBodyStyle: { height: '90dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzFooter: null,
    });
  }

  handleCreateReport() {
    const modalRef = this.modal.create({
      nzTitle: 'Create Weekly Report',
      nzContent: CreateWeeklyReportModalComponent,
      nzWidth: '100dvw',
      nzOkDisabled: true,
      nzOkText: 'Create',
      nzCancelText: 'Cancel',
      nzBodyStyle: { height: '85dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
    });

    modalRef.afterOpen.pipe(takeUntil(this.destroy$)).subscribe(() => {
      modalRef.updateConfig({
        nzFooter: modalRef.componentInstance?.modalFooter,
      });
    });

    modalRef.afterClose
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((report: WeeklyReport) => {
        if (report) {
          this.putReport(report);
        }
      });
  }

  putReport(report: WeeklyReport) {
    this.reports
      .putWeeklyReport(report)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadData();
          this.message.success('Report created successfully');
        },
        error: err => {
          this.message.error(`Error creating report: ${err.message}`);
        },
        complete: () => this.cd.detectChanges(),
      });
  }

  updateReport(report: WeeklyReport) {
    this.reports
      .updateWeeklyReport(report)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loadData();
          this.message.success('Report updated successfully');
        },
        error: err => {
          this.message.error(`Error updating report: ${err.message}`);
        },
        complete: () => this.cd.detectChanges(),
      });
  }
}
