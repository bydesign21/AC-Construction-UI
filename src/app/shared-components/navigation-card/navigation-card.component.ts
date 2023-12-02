import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navigation-card',
  standalone: false,
  templateUrl: './navigation-card.component.html',
  styleUrl: './navigation-card.component.scss',
})
export class NavigationCardComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() navigateTo: string = '';
}
