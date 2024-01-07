import { Injectable } from '@angular/core';
import {
  SupabaseClientDBResponse,
  SupabaseService,
} from '../../../auth/supabase.service';
import { Observable, from, map } from 'rxjs';
import { Client, Invoice, InvoiceItemDetail } from '../invoices-model/model';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  constructor(private sb: SupabaseService) { }

  getInvoices(
    page: number = 1,
    limit: number,
    dateRange?: string[]
  ): Observable<SupabaseClientDBResponse<Invoice>> {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    if (dateRange) {
      return this.getInvoicesByDateRange(page, limit, dateRange);
    }
    return from(
      this.sb.client
        .from('orders')
        .select('*', { count: 'exact' })
        .range(start, end)
        .order('date', { ascending: false, nullsFirst: false })
    ).pipe(
      map(res => {
        return {
          data: res.data || [],
          count: res.count || 0,
        };
      })
    );
  }

  private getInvoicesByDateRange(page = 1, limit: number, dateRange: string[]) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    return from(
      this.sb.client
        .from('orders')
        .select('*', { count: 'exact' })
        .range(start, end)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false, nullsFirst: false })
    ).pipe(
      map(res => {
        return {
          data: res.data || [],
          count: res.count || 0,
        };
      })
    );
  }

  putInvoice(invoice: any): Observable<any> {
    return from(this.sb.client.from('orders').insert(invoice).select());
  }

  updateInvoice(invoice: any): Observable<any> {
    return from(
      this.sb.client
        .from('orders')
        .update(invoice)
        .match({ orderId: invoice.orderId })
        .select()
    );
  }

  deleteInvoice(invoiceId: number): Observable<any> {
    return from(
      this.sb.client
        .from('orders')
        .delete()
        .match({ orderId: invoiceId })
        .select()
    );
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

  calculateTotals(invoiceItemList: InvoiceItemDetail[]): Partial<Invoice> {
    let orderTotal = 0;
    let subtotal = 0;

    if (invoiceItemList.length === 0) {
      return {
        orderItems: [],
        orderTotal,
        subtotal,
      };
    }

    invoiceItemList.forEach(item => {
      // Calculate item subtotal and total
      const itemSubtotal = (item?.quantity || 1) * (item?.rate || 0);
      const itemTotal = itemSubtotal - itemSubtotal * (item?.discount || 0);

      // Set calculated values to the item
      item.subtotal = itemSubtotal;
      item.total = itemTotal;

      // Accumulate order totals
      subtotal += itemSubtotal;
      orderTotal += itemTotal;
    });

    return {
      orderItems: invoiceItemList,
      orderTotal,
      subtotal,
    };
  }
}
