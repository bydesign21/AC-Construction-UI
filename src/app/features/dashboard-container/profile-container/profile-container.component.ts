import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
  breadcrumbs: Array<{ label: string; url: string }> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.generateBreadcrumbs(this.activatedRoute.root);
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.generateBreadcrumbs(this.activatedRoute.root);
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private generateBreadcrumbs(
    route: ActivatedRoute,
    path: string = '',
    breadcrumbs: Array<{ label: string; url: string }> = []
  ): void {
    if (route.snapshot.url.length > 0) {
      path += `/${route.snapshot.url.map(segment => segment.path).join('/')}`;

      if (route.snapshot.data.breadcrumb) {
        const label = route.snapshot.data.breadcrumb;
        console.log(label);
        breadcrumbs.push({ label, url: path });
      }
    }

    if (route.firstChild) {
      this.generateBreadcrumbs(route.firstChild, path, breadcrumbs);
    } else {
      this.breadcrumbs = breadcrumbs;
    }
  }

  items = [
    {
      label: 'Profile',
      routerUrl: '/profile',
      iconUrl: 'user',
      iconClass: '',
    },
    {
      label: 'Settings',
      routerUrl: '/profile/settings',
      iconUrl: 'setting',
      iconClass: '',
    },
  ];
}
