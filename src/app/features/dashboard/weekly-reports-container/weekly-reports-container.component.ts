import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SecondaryNavigationBarService } from '../../../shared-components/secondary-navigation-bar/secondary-navigation-bar.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeleteWeeklyReportModalComponent } from './delete-weekly-report-modal/delete-weekly-report-modal.component';
import { CreateWeeklyReportModalComponent } from './create-weekly-report-modal/create-weekly-report-modal.component';
import { BehaviorSubject, combineLatest, take, takeUntil } from 'rxjs';
import {
  WeeklyReport,
  WeeklyReportDataEmission,
} from './weekly-reports-model/model';
import { WeeklyReportsService } from './weekly-reports-services/weekly-reports.service';

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
    private modal: NzModalService,
    private data: WeeklyReportsService
  ) {}
  reports$: BehaviorSubject<WeeklyReport[]> = new BehaviorSubject<
    WeeklyReport[]
  >([]);
  loading$ = new BehaviorSubject<boolean>(false);

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
    this.loadData();
    this.cd.detectChanges();
  }

  loadData() {
    this.loading$.next(true);
    this.data.getWeeklyReports().subscribe(reports => {
      this.reports$.next(reports as any);
      console.log('reports', reports);
      this.loading$.next(false);
      this.cd.detectChanges();
    });
  }

  handleViewItem(item: WeeklyReport) {
    const modal = this.modal.create({
      nzTitle: 'View Weekly Report',
      nzOkText: 'Update',
      nzCancelText: 'Cancel',
      nzContent: CreateWeeklyReportModalComponent,
      nzData: { report: item },
      nzWidth: '100dvw',
      nzBodyStyle: { height: '85dvh' },
      nzStyle: { top: '1rem', margin: '1rem' },
      nzOnOk: componentInstance => {
        if (componentInstance instanceof CreateWeeklyReportModalComponent) {
          componentInstance.onOk();
        }
      },
    });

    if (modal.componentInstance) {
      combineLatest([
        modal.componentInstance?.isInputRowValid$,
        modal.componentInstance?.isExpenseListValid$,
        modal.componentInstance?.isInputRowTouched$,
        modal.componentInstance?.isExpenseListTouched$,
      ])
        .pipe(takeUntil(modal.afterClose))
        .subscribe(
          ([
            isInputRowValid,
            isExpenseListValid,
            isInputRowTouched,
            isExpenseListTouched,
          ]) => {
            const isEitherFormInvalid = !isInputRowValid || !isExpenseListValid;
            const isNeitherFormTouched =
              !isInputRowTouched && !isExpenseListTouched;
            modal.updateConfig({
              nzOkDisabled: isEitherFormInvalid || isNeitherFormTouched,
            });
          }
        );
    }

    modal.afterClose
      .pipe(take(1))
      .subscribe((report: WeeklyReportDataEmission) => {
        if (report) {
          const reports = this.reports$.getValue();
          const reportIndex = reports.findIndex(
            report => report.id === item.id
          );
          if (reportIndex === -1) {
            console.error('Report not found in reports array', item);
            return;
          }
          reports[reportIndex] = report;
          this.reports$.next([...reports]);
          this.cd.detectChanges();
        }
      });
  }

  handlePrintItem(item: WeeklyReport) {
    console.log('item printed', item);
  }

  handleDeleteItem(index: number) {
    const deleteItem = (index: number) => {
      const reports = this.reports$.getValue();
      reports.splice(index, 1);
      this.reports$.next([...reports]);
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

    if (modal.componentInstance) {
      combineLatest([
        modal.componentInstance?.isInputRowValid$,
        modal.componentInstance?.isExpenseListValid$,
      ])
        .pipe(takeUntil(modal.afterClose))
        .subscribe(([isInputRowValid, isExpenseListValid]) => {
          modal.updateConfig({
            nzOkDisabled: !isInputRowValid || !isExpenseListValid,
          });
        });
    }

    modal.afterClose
      .pipe(take(1))
      .subscribe((report: WeeklyReportDataEmission) => {
        if (report) {
          this.reports$.next([...this.reports$.getValue(), report]);
          this.cd.detectChanges();
        }
      });
  }
}
