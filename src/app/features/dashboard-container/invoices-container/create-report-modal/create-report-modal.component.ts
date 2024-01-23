import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Invoice } from '../invoices-model/model';
import { InvoicesService } from '../invoice-service/invoices.service';
import {
  BehaviorSubject,
  Subject,
  distinctUntilChanged,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-report-modal',
  standalone: false,
  templateUrl: './create-report-modal.component.html',
  styleUrl: './create-report-modal.component.scss',
})
export class CreateReportModalComponent implements OnInit, OnDestroy {
  @Input() reports: Invoice[] = [];
  totalRecords = 0;
  limit = 10;
  dateRange$ = new BehaviorSubject<Date[]>([]);
  currentPage$ = new BehaviorSubject<number>(1);
  destroy$ = new Subject();

  constructor(
    private invoices: InvoicesService,
    private cd: ChangeDetectorRef
  ) {}

  handleDateChanged(dateRange: Date[]) {
    this.dateRange$.next(dateRange);
  }

  ngOnInit(): void {
    this.dateRange$
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe({
        next: dateRange => {
          if (dateRange.length === 2) {
            this.fetchDataForCurrentPage();
          } else {
            this.clearData();
          }
        },
        error: err => console.error(err),
      });
  }

  private fetchDataForCurrentPage() {
    this.currentPage$
      .pipe(
        take(1),
        switchMap(currentPage => {
          const dates = this.dateRange$
            .getValue()
            .map(date => date.toISOString());
          return this.invoices.getInvoices(currentPage, this.limit, dates);
        })
      )
      .subscribe({
        next: result => {
          this.reports = result.data;
          this.totalRecords = result.count;
        },
        error: err => console.error(err),
        complete: () => {
          this.cd.detectChanges();
        },
      });
  }

  private clearData() {
    this.reports = [];
    this.totalRecords = 0;
    this.currentPage$.next(1);
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  onPageChange(newPage: number): void {
    this.currentPage$.next(newPage);
    if (this.dateRange$.getValue().length === 2) {
      this.fetchDataForCurrentPage();
    }
  }
}
