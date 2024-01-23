import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  SecondaryNavigationBarService,
  SecondaryNavigationLink,
} from './secondary-navigation-bar.service';
import { Subject, combineLatest, takeUntil } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-secondary-navigation-bar',
  standalone: false,
  templateUrl: './secondary-navigation-bar.component.html',
  styleUrl: './secondary-navigation-bar.component.scss',
})
export class SecondaryNavigationBarComponent implements OnInit, OnDestroy {
  constructor(
    private navigation: SecondaryNavigationBarService,
    private cd: ChangeDetectorRef
  ) {}
  isMobileViewPort = window.innerWidth <= 640;
  isMobileMenuOpen = false;
  isMenuVisible = true;
  items: SecondaryNavigationLink[] = [];
  destroy$ = new Subject();

  ngOnInit(): void {
    const navigationLinks$ = this.navigation.getNavigationLinks();
    const mobileMenuState$ = this.navigation.getIsMobileNavigationOpen();
    const navigationVisibility = this.navigation.getNavigationVisibility();

    combineLatest([navigationLinks$, mobileMenuState$, navigationVisibility])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([links, menuState, visibility]) => {
        this.isMobileMenuOpen = menuState;
        this.isMenuVisible = visibility;
        this.items = links;
        this.cd.detectChanges();
      });

    window.addEventListener('resize', () => {
      this.isMobileViewPort = window.innerWidth <= 640;
      this.cd.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  handleMenuIconClicked() {
    this.navigation.toggleMobileNavigationState();
  }

  handleLinkClicked() {
    this.navigation.toggleMobileNavigationState();
  }
}
