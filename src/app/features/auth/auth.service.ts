import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Observable, catchError, from, map, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private sb: SupabaseService) {}

  login(username: string, password: string): Observable<any> {
    return from(
      this.sb.client.auth.signInWithPassword({ email: username, password })
    ).pipe(
      map(res => {
        if (res.error !== null) throw new Error(res.error.message);
        else return res.data;
      }),
      catchError(err => throwError(() => new Error(err)))
    );
  }

  signUp(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    langPref: string = 'en'
  ) {
    return from(
      this.sb.client.auth.signUp({
        email: username,
        password,
        options: {
          data: {
            firstName,
            lastName,
            langPref,
          },
        },
      })
    ).pipe(
      map(res => {
        if (res.error !== null) throw new Error(res.error.message);
        else return res.data;
      }),
      catchError(err => throwError(() => new Error(err)))
    );
  }

  signOut() {
    return from(this.sb.client.auth.signOut()).pipe(
      map(res => {
        if (res.error !== null) throw new Error(res.error.message);
        else {
          sessionStorage.clear();
          return res;
        }
      }),
      catchError(err => throwError(() => new Error(err)))
    );
  }

  resetPassword(email: string) {
    return from(
      this.sb.client.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:4200/auth/password-reset',
      })
    ).pipe(
      map(res => {
        if (res.error !== null) throw new Error(res.error.message);
        else return res;
      }),
      catchError(err => throwError(() => new Error(err)))
    );
  }

  updatePassword(email: string, password: string) {
    return from(this.sb.client.auth.updateUser({ email, password })).pipe(
      map(res => {
        if (res.error !== null) throw new Error(res.error.message);
        else return res;
      }),
      catchError(err => throwError(() => new Error(err)))
    );
  }

  refreshSession(): Observable<boolean> {
    return from(this.sb.client.auth.refreshSession()).pipe(
      map(res => {
        if (res.error !== null) throw new Error(res.error.message);
        else {
          const { session } = res.data;
          sessionStorage.setItem('session', JSON.stringify(session));
          sessionStorage.setItem('isAuthenticated', 'true');
          return true;
        }
      }),
      catchError(err => {
        console.error('Failed to refresh session:', err);
        return throwError(() => new Error(err));
      })
    );
  }

  checkSession(): Observable<boolean> {
    const sessionItem = sessionStorage.getItem('session');

    if (!sessionItem) {
      console.error('No session found in session storage');
      return of(false);
    }

    try {
      const creds = JSON.parse(sessionItem);
      const { expires_at } = creds;
      const currentTime = new Date().getTime();
      const expiryDateInMilliseconds = expires_at * 1000;

      if (currentTime > expiryDateInMilliseconds) {
        // Session has already expired
        this.signOut();
        return of(false);
      } else {
        // Check if session is close to expiration, attempt to refresh
        const timeToExpiry = expiryDateInMilliseconds - currentTime;
        const timeToExpiryInMinutes = timeToExpiry / 60000;
        const isCloseToExpiry = timeToExpiryInMinutes < 5;
        if (!isCloseToExpiry) {
          return of(true);
        }
        return this.refreshSession().pipe(
          map(() => true),
          catchError(() => {
            this.signOut();
            return of(false);
          })
        );
      }
    } catch (error) {
      console.error('Error parsing credentials from session storage:', error);
      this.signOut();
      return of(false);
    }
  }
}
