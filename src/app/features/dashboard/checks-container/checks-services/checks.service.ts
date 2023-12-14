import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../auth/supabase.service';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChecksService {
  constructor(private sb: SupabaseService) {}

  getChecks(): Observable<any[]> {
    return from(
      this.sb.client
        .from('checks')
        .select('*')
        .order('date', { ascending: false, nullsFirst: false })
    ).pipe(map(res => res.data || []));
  }
}
