import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../auth/supabase.service';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChecksService {
  constructor(private sb: SupabaseService) {}

  // getChecks(): Observable<any> {
  //   return from(
  //     this.sb.client
  //       .from('checks')
  //       .select('*', { count: 'exact' })
  //       .order('date', { ascending: false, nullsFirst: false })
  //   ).pipe(
  //     map(res => {
  //       console.log('res', res);
  //       return { data: res.data || [], count: res.count || 0 };
  //     })
  //   );
  // }

  getChecks(page: number, limit: number): Observable<any> {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    return from(
      this.sb.client
        .from('checks')
        .select('*', { count: 'exact' })
        .range(start, end)
        .order('date', { ascending: false, nullsFirst: false })
    ).pipe(
      map(res => {
        return { data: res.data || [], count: res.count || 0 };
      })
    );
  }
}
