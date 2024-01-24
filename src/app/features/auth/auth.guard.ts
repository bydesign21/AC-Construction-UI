import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.checkSession().pipe(
      tap(isAuthenticated => {
        console.log('current route', this.router.url);
        if (!isAuthenticated) {
          const currentUrl = this.router.url;
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: currentUrl },
          });
        }
      })
    );
  }
}
