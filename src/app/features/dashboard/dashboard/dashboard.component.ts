import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SecondaryNavigationBarService } from '../../../shared-components/secondary-navigation-bar/secondary-navigation-bar.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-weekly-reports-container',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(
    private navigation: SecondaryNavigationBarService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.navigation.setNavigationLinks([
      { label: 'Dashboard', iconUrl: 'home', routerUrl: 'dashboard' },
      {
        label: 'Weekly Reports',
        iconUrl: 'project',
        routerUrl: 'weekly-reports',
      },
      { label: 'Invoices', iconUrl: 'profile', routerUrl: 'invoices' },
      { label: 'Checks', iconUrl: 'mail', routerUrl: 'checks' },
      { label: 'Bank', iconUrl: 'bank', routerUrl: 'bank' },
      { label: 'Taxes', iconUrl: 'stock', routerUrl: 'taxes' },
      {
        label: 'Payroll Reports',
        iconUrl: 'bar-chart',
        routerUrl: 'payroll-reports',
      },
    ]);
    this.cd.detectChanges();
  }
}
