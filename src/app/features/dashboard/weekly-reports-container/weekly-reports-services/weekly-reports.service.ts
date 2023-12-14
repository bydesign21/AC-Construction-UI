import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../auth/supabase.service';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeeklyReportsService {
  constructor(private sb: SupabaseService) {}

  getWeeklyReports(): Observable<any[]> {
    return from(
      this.sb.client
        .from('weekly_reports')
        .select('*')
        .order('id', { ascending: false })
    ).pipe(map(res => res.data || []));
  }
}
