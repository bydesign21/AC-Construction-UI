import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
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
        if (res.error !== null) throw res.error.message;
        else return res.data;
      }),
      catchError(err => throwError(() => new Error(err)))
    );
  }

  signUp(
    username: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    return from(
      this.sb.client.auth.signUp({
        email: username,
        password,
        options: {
          data: {
            firstName,
            lastName,
          },
        },
      })
    ).pipe(
      map(res => {
        if (res.error !== null) throw res.error.message;
        else return res.data;
      }),
      catchError(err => throwError(() => new Error(err)))
    );
  }

  signOut() {
    return from(this.sb.client.auth.signOut()).pipe(
      map(res => {
        if (res.error !== null) throw res.error.message;
        else {
          sessionStorage.clear();
          return res;
        }
      }),
      catchError(err => throwError(() => new Error(err)))
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
        this.signOut();
        return of(false);
      } else {
        return of(true);
      }
    } catch (error) {
      console.error('Error parsing credentials from session storage:', error);
      return of(false);
    }
  }

  resetPassword(email: string) {
    return from(
      this.sb.client.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:4200/auth/password-reset',
      })
    ).pipe(
      map(res => {
        if (res.error !== null) throw res.error.message;
        else return res;
      }),
      catchError(err => throwError(() => new Error(err)))
    );
  }

  updatePassword(email: string, password: string) {
    return from(this.sb.client.auth.updateUser({ email, password })).pipe(
      map(res => {
        if (res.error !== null) throw res.error.message;
        else return res;
      }),
      catchError(err => throwError(() => new Error(err)))
    );
  }
}
