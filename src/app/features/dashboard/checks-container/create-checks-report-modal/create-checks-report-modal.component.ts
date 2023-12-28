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
  employees$: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  checks$: BehaviorSubject<any> = new BehaviorSubject([]);
  totalRecords = 0;
  currentPage = 1;
  limit = 10;
  loading$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject();
  searchTerm = '';

  constructor(
    private cd: ChangeDetectorRef,
    private checks: ChecksService
  ) { }

  loadData(): void {
    if (!this.dateRange.length && !this.selectedEmployee) {
      this.checks$.next([]);
      this.totalRecords = 0;
      this.loading$.next(false);
      this.cd.detectChanges();
      return;
    }
    this.checks
      .getChecks(
        this.currentPage,
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
    this.loadData();
  }

  handleEmployeeSelected(employee: string) {
    this.currentPage = 1;
    console.log('employee', employee);
    this.selectedEmployee = employee;
    this.loadData();
    this.cd.detectChanges();
  }

  handleDateChanged(dateRange: Date[]) {
    if (!dateRange || dateRange.length < 2) {
      this.dateRange = [];
    } else {
      this.dateRange = dateRange;
    }
    this.currentPage = 1;
    this.loadData();
    this.cd.detectChanges();
  }

  handleEmployeeSearch(search: string) {
    this.searchTerm = search;
    console.log('search', search);
    if (search.length < 3) {
      this.employees$.next([]);
      this.cd.detectChanges();
      return;
    }
    this.checks
      .getEmployees(1, 10, search)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(employees => {
        this.employees$.next(employees.data);
        this.cd.detectChanges();
      });
  }
}
