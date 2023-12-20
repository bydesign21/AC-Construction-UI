import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Employee } from '../check-model/model';
import { ChecksService } from '../checks-services/checks.service';
import {
  BehaviorSubject,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-checks-report-modal',
  standalone: false,
  templateUrl: './create-checks-report-modal.component.html',
  styleUrl: './create-checks-report-modal.component.scss',
})
export class CreateChecksReportModalComponent {
  selectedEmployee: Employee['name'] | undefined = undefined;
  dateRange: Date[] = [];
  employees$: Observable<Employee[]> = this.checks.getEmployees();
  checks$: BehaviorSubject<any> = new BehaviorSubject([]);
  totalRecords = 0;
  currentPage = 1;
  limit = 10;
  loading$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject();

  constructor(
    private cd: ChangeDetectorRef,
    private checks: ChecksService
  ) {}

  loadData(page: number = 1): void {
    this.checks
      .getChecks(
        page,
        this.limit,
        this.dateRange[0],
        this.dateRange[1],
        this.selectedEmployee
      )
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        tap(() => this.loading$.next(true))
      )
      .subscribe(response => {
        console.log(
          this.limit,
          this.dateRange[0],
          this.dateRange[1],
          this.selectedEmployee
        );
        this.checks$.next(response.data);
        this.totalRecords = response.count;
        this.loading$.next(false);
        this.cd.detectChanges();
      });
  }

  handlePageChange(page: any) {
    this.currentPage = page;
    this.loadData(this.currentPage);
  }

  handleEmployeeSelected(employee: string) {
    this.currentPage = 1;
    console.log('employee', employee);
    this.selectedEmployee = employee;
    this.loadData(this.currentPage);
    this.cd.detectChanges();
  }

  handleDateChanged(dateRange: Date[]) {
    if (!dateRange || dateRange.length < 2) {
      this.dateRange = [];
    } else {
      this.dateRange = dateRange;
    }
    this.currentPage = 1;
    this.loadData(this.currentPage);
    this.cd.detectChanges();
  }
}
