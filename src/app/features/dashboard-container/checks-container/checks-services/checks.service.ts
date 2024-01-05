import { Injectable } from '@angular/core';
import {
  SupabaseClientDBResponse,
  SupabaseService,
} from '../../../auth/supabase.service';
import { Observable, from, map } from 'rxjs';
import { Check, Employee } from '../check-model/model';

@Injectable({
  providedIn: 'root',
})
export class ChecksService {
  constructor(private sb: SupabaseService) {}

  getChecks(
    page: number,
    limit: number,
    startDate?: Date,
    endDate?: Date,
    name?: string
  ): Observable<SupabaseClientDBResponse<Check>> {
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

  deleteCheck(checkNumber: string): Observable<any> {
    return from(this.sb.client.from('checks').delete().match({ checkNumber }));
  }

  updateCheck(check: Check): Observable<any> {
    return from(
      this.sb.client
        .from('checks')
        .update(check)
        .match({ checkNumber: check.checkNumber })
    );
  }

  putCheck(check: Check): Observable<Check> {
    return from(
      this.sb.client.from('checks').insert(check)
    ) as unknown as Observable<Check>;
  }

  putEmployee(employee: Employee): Observable<any> {
    return from(this.sb.client.from('employees').insert(employee));
  }

  updateEmployee(employee: Employee): Observable<any> {
    return from(
      this.sb.client
        .from('employees')
        .update(employee)
        .match({ id: employee.id })
    );
  }

  deleteEmployee(employeeId: string): Observable<any> {
    return from(
      this.sb.client.from('employees').delete().match({ id: employeeId })
    );
  }

  getEmployees(
    page: number = 1,
    limit: number,
    searchTerm?: string
  ): Observable<SupabaseClientDBResponse<Employee>> {
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    if (searchTerm) {
      return this.getEmployeesBySearchTerm(searchTerm, page, limit);
    } else {
      return from(
        this.sb.client
          .from('employees')
          .select('*', { count: 'exact' })
          .range(start, end)
      ).pipe(
        map(res => {
          return { data: res.data || [], count: res.count || 0 };
        })
      );
    }
  }

  private getEmployeesBySearchTerm(
    searchTerm: string,
    page: number = 1,
    limit: number
  ): Observable<SupabaseClientDBResponse<Employee>> {
    // Add % wildcards around the search term for partial matching
    const likeQuery = `%${searchTerm}%`;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    return from(
      this.sb.client
        .from('employees')
        .select('*', { count: 'exact' })
        .ilike('name', likeQuery)
        .range(start, end)
    ).pipe(
      map(res => {
        return { data: res.data || [], count: res.count || 0 };
      })
    );
  }
}
