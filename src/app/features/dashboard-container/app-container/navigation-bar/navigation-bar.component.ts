import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, take } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-navigation-bar',
  standalone: false,
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss',
})
export class NavigationBarComponent {
  @ViewChild('dropdownMenu') dropdownMenu: ElementRef | null = null;
  @ViewChild('dropdownIcon')
  dropdownIcon: ElementRef<HTMLButtonElement> | null = null;
  isLoading$ = new BehaviorSubject<boolean>(false);
  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (
      this.dropdownMenu &&
      this.dropdownIcon &&
      !this.dropdownMenu.nativeElement.contains(event.target) &&
      !this.dropdownIcon.nativeElement.contains(event.target)
    ) {
      this.dropdownOpen = false;
      this.dropdownIcon.nativeElement.blur();
    }
  }

  constructor(
    private auth: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private message: NzMessageService
  ) { }

  dropdownOpen = false;
  isDropdownIconFocused = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.cd.markForCheck();
  }

  closeDropdown() {
    this.dropdownOpen = false;
    this.cd.markForCheck();
  }

  handleSignOut() {
    if (this.isLoading$.getValue()) return;
    this.isLoading$.next(true);
    this.auth
      .signOut()
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router
            .navigate(['auth', 'login'], { replaceUrl: true })
            .then(() => {
              this.message.success('Successfully signed out');
              this.cd.detectChanges();
            });
        },
        error: err => {
          this.message.error(err);
        },
        complete: () => {
          this.isLoading$.next(false);
        },
      });
  }

  handleLogoClicked() {
    this.router.navigate([''], { replaceUrl: true }).then(() => {
      this.cd.detectChanges();
    });
  }
}
