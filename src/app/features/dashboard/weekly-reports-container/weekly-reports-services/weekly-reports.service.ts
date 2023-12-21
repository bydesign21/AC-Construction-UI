import { Injectable } from '@angular/core';
import { SupabaseService } from '../../../auth/supabase.service';
import { Observable, from, map, tap } from 'rxjs';
import { WeeklyReport } from '../weekly-reports-model/model';

@Injectable({
  providedIn: 'root',
})
export class WeeklyReportsService {
  constructor(private sb: SupabaseService) {}

  getWeeklyReports(
    page: number,
    limit: number,
    dateRange?: Date[]
  ): Observable<any> {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    if (dateRange && dateRange.length === 2) {
      const startDate = dateRange[0]?.toDateString();
      const endDate = dateRange[1]?.toDateString();
      return this.getWeeklyReportsInRange(startDate, endDate, page, limit);
    }
    return from(
      this.sb.client
        .from('weekly_reports')
        .select('*', { count: 'exact' })
        .range(start, end)
        .order('id', { ascending: false, nullsFirst: false })
    ).pipe(
      map(res => {
        return { data: res.data || [], count: res.count || 0 };
      })
    );
  }

  getWeeklyReportsInRange(
    startDate: string,
    endDate: string,
    page: number,
    limit: number
  ): Observable<any> {
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    return from(
      this.sb.client
        .from('v_weekly_reports')
        .select('*', { count: 'exact' })
        .gte('dateend', startDate)
        .lte('dateend', endDate)
        .range(start, end)
        .order('dateend', { ascending: false })
    ).pipe(
      map(res => {
        // Transforming each item to have a date array
        const transformedData =
          res.data?.map(item => ({
            ...item,
            date: [item.datestart, item.dateend],
          })) || [];

        return { data: transformedData, count: res.count || 0 };
      })
    );
  }

  putWeeklyReport(weeklyReport: WeeklyReport): Observable<any> {
    return from(
      this.sb.client.from('weekly_reports').insert(weeklyReport).select()
    ).pipe(map(res => res?.data?.[0]));
  }

  updateWeeklyReport(weeklyReport: WeeklyReport): Observable<any> {
    return from(
      this.sb.client
        .from('weekly_reports')
        .update(weeklyReport)
        .eq('id', weeklyReport.id)
        .select()
    ).pipe(map(res => res?.data?.[0]));
  }
}
