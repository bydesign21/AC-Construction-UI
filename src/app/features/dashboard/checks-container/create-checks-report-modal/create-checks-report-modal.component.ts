import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SharedUtilsService } from '../../../../shared-components/shared-utils.service';
import { CheckReport, Employee } from '../check-model/model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-checks-report-modal',
  standalone: false,
  templateUrl: './create-checks-report-modal.component.html',
  styleUrl: './create-checks-report-modal.component.scss',
})
export class CreateChecksReportModalComponent {
  @Input() checks: CheckReport[] = [];
  @Input() employeeList: Employee[] = [];
  @Output() dateRangeChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() employeeSelected: EventEmitter<Employee> =
    new EventEmitter<Employee>();
  selectedEmployee: Employee | undefined;

  constructor(
    private cd: ChangeDetectorRef,
    private utils: SharedUtilsService
  ) {}

  handleEmployeeSelected(employee: Employee) {
    this.employeeSelected.emit(employee);
    this.cd.detectChanges();
  }

  handleDateChanged(dateRange: Date[]) {
    const rangeString = this.utils.formatDateRange(dateRange);
    this.dateRangeChanged.emit(rangeString);
    this.cd.detectChanges();
  }
}
