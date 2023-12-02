import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-delete-weekly-report-modal',
  standalone: false,
  templateUrl: './delete-weekly-report-modal.component.html',
  styleUrl: './delete-weekly-report-modal.component.scss',
})
export class DeleteWeeklyReportModalComponent {}
