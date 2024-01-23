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
      {
        label: 'COMMON.FEATURES.DASHBOARD',
        iconUrl: 'home',
        routerUrl: 'dashboard',
      },
      {
        label: 'COMMON.FEATURES.WEEKLY_REPORTS',
        iconUrl: 'project',
        routerUrl: 'weekly-reports',
      },
      {
        label: 'COMMON.FEATURES.EMPLOYEES',
        iconUrl: 'team',
        routerUrl: 'employees',
      },
      {
        label: 'COMMON.FEATURES.CLIENTS',
        iconUrl: 'user',
        routerUrl: 'clients',
      },
      {
        label: 'COMMON.FEATURES.INVOICES',
        iconUrl: 'profile',
        routerUrl: 'invoices',
      },
      { label: 'COMMON.FEATURES.CHECKS', iconUrl: 'mail', routerUrl: 'checks' },
    ]);
  }
}
