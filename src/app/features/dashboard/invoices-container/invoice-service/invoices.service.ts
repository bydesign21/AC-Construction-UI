import { Injectable } from '@angular/core';
import {
  SupabaseClientDBResponse,
  SupabaseService,
} from '../../../auth/supabase.service';
import { Observable, from, map } from 'rxjs';
import { Client } from '../invoices-model/model';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  constructor(private sb: SupabaseService) {}

  getInvoices(): Observable<any> {
    return from(this.sb.client.from('invoices').select('*'));
  }

  getClients(
    page: number,
    limit: number,
    searchTerm?: string
  ): Observable<SupabaseClientDBResponse<Client>> {
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    if (searchTerm) {
      return this.getClientsBySearchTerm(page, limit, searchTerm);
    } else {
      return from(
        this.sb.client
          .from('clients')
          .select('*', { count: 'exact' })
          .range(start, end)
      ).pipe(
        map(res => {
          return {
            data: res.data || [],
            count: res.count || 0,
          };
        })
      );
    }
  }

  getClientsBySearchTerm(
    page: number,
    limit: number,
    searchTerm: string
  ): Observable<SupabaseClientDBResponse<Client>> {
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const likeQuery = `%${searchTerm}%`;
    return from(
      this.sb.client
        .from('clients')
        .select('*', { count: 'exact' })
        .range(start, end)
        .ilike('companyName', likeQuery)
    ).pipe(
      map(res => {
        return {
          data: res.data || [],
          count: res.count || 0,
        };
      })
    );
  }

  putClient(client: Client): Observable<SupabaseClientDBResponse<Client>> {
    return from(this.sb.client.from('clients').insert(client).select()).pipe(
      map(res => {
        return {
          data: res.data || [],
          count: res.count || 0,
        };
      })
    );
  }

  deleteClient(
    clientId: Client['id']
  ): Observable<SupabaseClientDBResponse<Client>> {
    return from(
      this.sb.client.from('clients').delete().match({ id: clientId }).select()
    ).pipe(
      map(res => {
        return {
          data: res.data || [],
          count: res.count || 0,
        };
      })
    );
  }

  updateClient(client: Client): Observable<SupabaseClientDBResponse<Client>> {
    return from(
      this.sb.client
        .from('clients')
        .update(client)
        .match({ id: client.id })
        .select()
    ).pipe(
      map(res => {
        return {
          data: res.data || [],
          count: res.count || 0,
        };
      })
    );
  }
}
