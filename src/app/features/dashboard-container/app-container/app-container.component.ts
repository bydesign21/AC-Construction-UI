import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SecondaryNavigationBarService } from '../../../shared-components/secondary-navigation-bar/secondary-navigation-bar.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-app-container',
  standalone: false,
  templateUrl: './app-container.component.html',
  styleUrl: './app-container.component.scss',
})
export class AppContainerComponent implements OnInit {
  constructor(private navigation: SecondaryNavigationBarService) {}
  ngOnInit(): void {
    this.navigation.setNavigationLinks([
      { label: 'Dashboard', iconUrl: 'home', routerUrl: 'dashboard' },
      {
        label: 'Weekly Reports',
        iconUrl: 'project',
        routerUrl: 'weekly-reports',
      },
      {
        label: 'Employees',
        iconUrl: 'team',
        routerUrl: 'employees',
      },
      {
        label: 'Clients',
        iconUrl: 'user',
        routerUrl: 'clients',
      },
      { label: 'Invoices', iconUrl: 'profile', routerUrl: 'invoices' },
      { label: 'Checks', iconUrl: 'mail', routerUrl: 'checks' },
    ]);
  }
}
