import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

export interface WeeklyReportInputRowProps {
  dateRange: Date[];
  revenueTotal: number | null;
  payrollTotal: number | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-weekly-report-input-row',
  standalone: false,
  templateUrl: './weekly-report-input-row.component.html',
  styleUrl: './weekly-report-input-row.component.scss',
})
export class WeeklyReportInputRowComponent {
  payrollTotal: number | null = null;
  revenueTotal: number | null = null;
  dateRange: Date[] = [];
  @Output() changed: EventEmitter<WeeklyReportInputRowProps> =
    new EventEmitter<WeeklyReportInputRowProps>();

  handleChange() {
    const output: WeeklyReportInputRowProps = {
      dateRange: this.dateRange,
      revenueTotal: this.revenueTotal,
      payrollTotal: this.payrollTotal,
    };
    this.changed.emit(output);
    console.log('inputRowOutput', output);
  }

  handleDateRangeChange(dateInput: Date[]) {
    this.dateRange = dateInput;
    this.handleChange();
  }
}
