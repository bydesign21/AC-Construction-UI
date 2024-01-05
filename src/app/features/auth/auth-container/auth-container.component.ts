import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auth-container',
  standalone: false,
  templateUrl: './auth-container.component.html',
  styleUrl: './auth-container.component.scss',
})
export class AuthContainerComponent implements OnInit {
  constructor(
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const isAuthenticated = JSON.parse(
      sessionStorage.getItem('isAuthenticated') || 'false'
    );
    if (isAuthenticated) {
      await this.router.navigate(['/dashboard'], { replaceUrl: true });
      this.cd.detectChanges();
    }
  }
}
