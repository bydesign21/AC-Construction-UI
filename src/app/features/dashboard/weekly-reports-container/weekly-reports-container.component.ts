import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SecondaryNavigationBarService } from '../../../shared-components/secondary-navigation-bar/secondary-navigation-bar.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeleteWeeklyReportModalComponent } from './delete-weekly-report-modal/delete-weekly-report-modal.component';
import { WeeklyReport } from './weekly-reports-table/weekly-reports-table.component';
import {
  CreateWeeklyReportModalComponent,
  WeeklyReportDataEmission,
} from './create-weekly-report-modal/create-weekly-report-modal.component';
import { BehaviorSubject, take } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-weekly-reports-container',
  standalone: false,
  templateUrl: './weekly-reports-container.component.html',
  styleUrl: './weekly-reports-container.component.scss',
})
export class WeeklyReportsContainerComponent implements OnInit {
  constructor(
    private navigation: SecondaryNavigationBarService,
    private cd: ChangeDetectorRef,
    private modal: NzModalService
  ) {}
  reports: BehaviorSubject<WeeklyReport[]> = new BehaviorSubject<
    WeeklyReport[]
  >([]);

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
    this.navigation.setNavigationVisibility(true);
    this.cd.detectChanges();
  }

  handleViewItem(item: WeeklyReport) {
    console.log('item viewed', item);
  }

  handlePrintItem(item: WeeklyReport) {
    console.log('item printed', item);
  }

  handleDeleteItem(index: number) {
    const deleteItem = (index: number) => {
      const reports = this.reports.getValue();
      reports.splice(index, 1);
      this.reports.next([...reports]);
    };
    this.modal.create({
      nzOkDanger: true,
      nzTitle: 'Confirm Deletion',
      nzContent: DeleteWeeklyReportModalComponent,
      nzOkText: 'Delete',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        deleteItem(index);
      },
    });
  }

  handleCreateReport() {
    const modal = this.modal.create({
      nzTitle: 'Create Weekly Report',
      nzOkText: 'Create',
      nzCancelText: 'Cancel',
      nzContent: CreateWeeklyReportModalComponent,
      nzWidth: '100dvw',
      nzBodyStyle: { height: '85dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzOnOk: componentInstance => {
        if (componentInstance instanceof CreateWeeklyReportModalComponent) {
          componentInstance.onOk();
        }
      },
    });

    modal.afterClose
      .pipe(take(1))
      .subscribe((report: WeeklyReportDataEmission) => {
        if (report) {
          console.log('report created', report);
          this.reports.next([...this.reports.getValue(), report]);
          this.cd.detectChanges();
          console.log('reports', this.reports.getValue());
        }
      });
  }
}
