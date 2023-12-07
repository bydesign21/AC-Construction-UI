import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SharedUtilsService } from '../../../../shared-components/shared-utils.service';
import { CheckReport } from '../check-model/model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-checks-report-modal',
  standalone: false,
  templateUrl: './create-checks-report-modal.component.html',
  styleUrl: './create-checks-report-modal.component.scss',
})
export class CreateChecksReportModalComponent {
  @Input() checks: CheckReport[] = [];
  @Output() dateRangeChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private cd: ChangeDetectorRef,
    private utils: SharedUtilsService
  ) {}

  handleDateChanged(dateRange: Date[]) {
    const rangeString = this.utils.formatDateRange(dateRange);
    this.dateRangeChanged.emit(rangeString);
    this.cd.detectChanges();
  }
}
