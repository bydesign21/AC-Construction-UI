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
import { take } from 'rxjs';
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
  ) {}

  dropdownOpen = false;
  isDropdownIconFocused = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  handleSignOut() {
    this.auth
      .signOut()
      .pipe(take(1))
      .subscribe({
        next: async () => {
          await this.router.navigate(['auth', 'login'], { replaceUrl: true });
          this.message.success('Successfully signed out');
          this.cd.detectChanges();
        },
        error: err => {
          this.message.error(err);
        },
      });
  }

  async handleLogoClicked() {
    await this.router.navigate([''], { replaceUrl: true });
    this.cd.detectChanges();
  }
}
