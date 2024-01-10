import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../auth/supabase.service';
import { Observable, from, map } from 'rxjs';
import { User, UserAttributes } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private sb: SupabaseService) { }

  getProfile(): Observable<User> {
    return from(this.sb.client.auth.getUser()).pipe(
      map(res => {
        if (res.error !== null) {
          throw new Error(res.error.message);
        } else {
          return res.data.user;
        }
      })
    );
  }

  updateProfile(user: UserAttributes): Observable<User> {
    return from(this.sb.client.auth.updateUser(user)).pipe(
      map(res => {
        if (res.error !== null) {
          throw new Error(res.error.message);
        } else {
          return res.data.user;
        }
      })
    );
  }

  updatePassword(password: string): Observable<User> {
    return from(this.sb.client.auth.updateUser({ password })).pipe(
      map(res => {
        if (res.error !== null) {
          throw new Error(res.error.message);
        } else {
          return res.data.user;
        }
      })
    );
  }

  deleteAccount(userId: string): Observable<User> {
    return from(this.sb.client.auth.admin.deleteUser(userId, true)).pipe(
      map(res => {
        if (res.error !== null) {
          throw new Error(res.error.message);
        } else {
          return res.data.user;
        }
      })
    );
  }
}
