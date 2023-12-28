import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-results-input-template',
  standalone: false,
  templateUrl: './no-results-input-template.component.html',
  styleUrl: './no-results-input-template.component.scss',
})
export class NoResultsInputTemplateComponent {
  @Input() text: string = 'No Results Found';
  @Input() icon: string = 'frown';
}
