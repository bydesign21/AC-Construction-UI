import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { getISOWeek } from 'date-fns';
import { NzI18nService, en_US } from 'ng-zorro-antd/i18n';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-date-range-picker',
  standalone: false,
  templateUrl: './date-range-picker.component.html',
  styleUrl: './date-range-picker.component.scss',
})
export class DateRangePickerComponent {
  @Input() label?: string;
  @Input() isRequired?: boolean;
  @Input() hideColon?: boolean = true;
  @Output() changed: EventEmitter<Date[]> = new EventEmitter<Date[]>();

  date = null;

  onChange(result: Date[]): void {
    this.changed.emit(result);
  }
}
