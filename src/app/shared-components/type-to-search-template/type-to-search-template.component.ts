import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-type-to-search-template',
  standalone: false,
  templateUrl: './type-to-search-template.component.html',
  styleUrl: './type-to-search-template.component.scss',
})
export class TypeToSearchTemplateComponent {
  @Input() text: string = 'Type to Search...';
  @Input() icon: string = 'search';
}
