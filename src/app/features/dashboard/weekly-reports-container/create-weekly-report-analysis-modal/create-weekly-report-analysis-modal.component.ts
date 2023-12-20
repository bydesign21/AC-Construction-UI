import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { WeeklyReport } from '../weekly-reports-model/model';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { WeeklyReportsService } from '../weekly-reports-services/weekly-reports.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-weekly-report-analysis-modal',
  standalone: false,
  templateUrl: './create-weekly-report-analysis-modal.component.html',
  styleUrl: './create-weekly-report-analysis-modal.component.scss',
})
export class CreateWeeklyReportAnalysisModalComponent implements OnDestroy {
  reports$: BehaviorSubject<WeeklyReport[]> = new BehaviorSubject<
    WeeklyReport[]
  >([]);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  limit = 8;
  currentPage = 1;
  totalRecords = 0;
  dateRange: Date[] = [];
  private destroy$ = new Subject();

  @Output() closeEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private weeklyReportsService: WeeklyReportsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  handleDateChanged(dateRange: Date[]) {
    if (!dateRange || dateRange.length < 2) {
      return;
    }
    this.dateRange = dateRange;
    this.currentPage = 1;
    this.loadData();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadData();
  }

  private loadData(page: number = this.currentPage) {
    this.loading$.next(true);
    this.weeklyReportsService
      .getWeeklyReports(page, this.limit, this.dateRange)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(reports => {
        this.reports$.next(reports.data);
        this.totalRecords = reports.count;
        this.currentPage = page;
        this.loading$.next(false);
        this.cd.detectChanges();
      });
  }

  handleClose() {
    this.closeEvent.emit();
  }
}
