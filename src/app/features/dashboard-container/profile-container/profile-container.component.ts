import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { Subject, filter, map, takeUntil } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-profile-container',
  standalone: false,
  templateUrl: './profile-container.component.html',
  styleUrl: './profile-container.component.scss',
})
export class ProfileContainerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  selectedTabIndex = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.setSelectedTabFromRoute();
    this.subscribeToRouteChanges();
  }

  private setSelectedTabFromRoute() {
    const currentRoute = this.getCurrentRoute();
    this.updateSelectedTab(currentRoute);
  }

  private subscribeToRouteChanges() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.getCurrentRoute()),
        takeUntil(this.destroy$)
      )
      .subscribe(route => this.updateSelectedTab(route));
  }

  private getCurrentRoute(): string {
    return this.activatedRoute.firstChild?.snapshot?.url?.[0]?.path ?? '';
  }

  private updateSelectedTab(route: string) {
    const tabIndex = this.items.findIndex(item =>
      item.routerUrl.endsWith(route)
    );
    if (tabIndex > -1) {
      this.selectedTabIndex = tabIndex;
      this.cd.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleTabChanged(event: NzTabChangeEvent) {
    this.selectedTabIndex = event?.index ?? 0;
    this.router?.navigate([this.items?.[this.selectedTabIndex]?.routerUrl]);
    this.cd.markForCheck();
  }

  items = [
    {
      label: 'COMMON.PERSONAL_DETAILS.PROFILE',
      routerUrl: '/profile',
      iconUrl: 'user',
      iconClass: '',
    },
    {
      label: 'COMMON.MISC.SETTINGS',
      routerUrl: '/profile/settings',
      iconUrl: 'setting',
      iconClass: '',
    },
  ];
}
