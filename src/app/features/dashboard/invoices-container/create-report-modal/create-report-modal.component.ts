import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SharedUtilsService } from '../../../../shared-components/shared-utils.service';
import { Invoice } from '../../../../shared-components/invoice-item-list/invoice-item-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-create-report-modal',
  standalone: false,
  templateUrl: './create-report-modal.component.html',
  styleUrl: './create-report-modal.component.scss',
})
export class CreateReportModalComponent {
  @Input() invoices: Invoice[] = [];
  @Output() dateRangeChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private cd: ChangeDetectorRef,
    private utils: SharedUtilsService
  ) { }

  handleDateChanged(dateRange: Date[]) {
    const rangeString = this.utils.formatDateRange(dateRange);
    this.dateRangeChanged.emit(rangeString);
    this.cd.detectChanges();
  }
}
