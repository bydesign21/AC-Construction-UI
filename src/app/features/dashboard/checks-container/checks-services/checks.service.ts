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

  getChecks(
    page: number,
    limit: number,
    startDate?: Date,
    endDate?: Date,
    name?: string
  ): Observable<any> {
    console.log('getChecks');
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = this.sb.client
      .from('checks')
      .select('*', { count: 'exact' })
      .range(start, end)
      .order('date', { ascending: false, nullsFirst: false });

    if (startDate) {
      query = query.gte('date', startDate.toDateString());
    }

    if (endDate) {
      query = query.lte('date', endDate.toDateString());
    }

    if (name) {
      query = query.eq('name', name);
    }

    return from(query).pipe(
      map(res => {
        return { data: res.data || [], count: res.count || 0 };
      })
    );
  }

  getEmployees(): Observable<any> {
    return from(this.sb.client.from('employees').select('*')).pipe(
      map(res => {
        return res.data || [];
      })
    );
  }

  getEmployeesBySearchTerm(searchTerm: string): Observable<any> {
    // Add % wildcards around the search term for partial matching
    const likeQuery = `%${searchTerm}%`;

    return from(
      this.sb.client.from('employees').select('*').ilike('name', likeQuery)
    ).pipe(
      map(res => {
        return res.data || [];
      })
    );
  }
}
