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

  ngOnInit(): void {
    const isAuthenticated = JSON.parse(
      sessionStorage.getItem('isAuthenticated') || 'false'
    );
    if (isAuthenticated) {
      this.router
        .navigate(['/dashboard'], { replaceUrl: true })
        .then(() => this.cd.detectChanges());
    }
  }
}
