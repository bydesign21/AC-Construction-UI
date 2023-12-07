export interface InvoiceItem {
  planId?: string;
  invoiceId?: string;
  quantity: number | null;
  address: string;
  rate: number | null;
  total: number | null;
  discount?: number | null;
}

export interface Invoice {
  id: string;
  clientId: string;
  date: string;
  items: InvoiceItem[];
  total: number;
  isPaid: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface InvoiceReport extends Invoice {}

export interface Client {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  fax?: string;
  vendorNumber?: string;
}
