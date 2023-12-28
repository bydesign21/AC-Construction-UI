import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-table-state-template',
  standalone: false,
  templateUrl: './table-state-template.component.html',
  styleUrl: './table-state-template.component.scss',
})
export class TableStateTemplateComponent {
  @Input() iconType: string = 'info';
  @Input() mainMessage: string = 'Default Message';
  @Input() additionalInfo: string = 'Additional information';
}
