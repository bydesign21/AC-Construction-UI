import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { WeeklyReport } from '../weekly-reports-model/model';
import { BehaviorSubject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-weekly-report-analysis-modal',
  standalone: false,
  templateUrl: './create-weekly-report-analysis-modal.component.html',
  styleUrl: './create-weekly-report-analysis-modal.component.scss',
})
export class CreateWeeklyReportAnalysisModalComponent {
  @Input() reports: WeeklyReport[] = [];
  @Input() loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  @Input() currentPage = 1;
  @Input() totalRecords = 0;
  @Output()
  dateRangeChanged: EventEmitter<Date[]> = new EventEmitter<Date[]>();

  constructor(private cd: ChangeDetectorRef) {}

  handleDateChanged(dateRange: Date[]) {
    if (!dateRange || dateRange.length < 2) {
      return;
    }
    this.dateRangeChanged.emit(dateRange);
    this.cd.detectChanges();
  }
}
