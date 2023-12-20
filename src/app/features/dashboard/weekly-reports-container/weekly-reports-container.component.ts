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
import {
  WeeklyReport,
  WeeklyReportDataEmission,
} from './weekly-reports-model/model';
import { WeeklyReportsService } from './weekly-reports-services/weekly-reports.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateWeeklyReportAnalysisModalComponent } from './create-weekly-report-analysis-modal/create-weekly-report-analysis-modal.component';

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

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const newPage = Number(params?.page) || 1;
      this.currentPage = newPage;
      this.loadData(this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  loadData(page: number = 1) {
    this.loading$.next(true);
    this.data
      .getWeeklyReports(page, this.limit)
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

  handleCreateAnalysisReport() {
    const modal = this.modal.create({
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
      .subscribe((report: WeeklyReportDataEmission) => {
        if (report) {
          // TODO: Update report in db
          this.reports$.next([...this.reports$.getValue(), report]);
          this.cd.detectChanges();
        }
      });
  }
}
