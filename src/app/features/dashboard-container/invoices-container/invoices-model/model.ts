export interface InvoiceItemDetail {
  orderId?: number;
  planId?: string;
  address?: string;
  quantity?: number;
  rate?: number;
  discount?: number;
  total?: number;
  subtotal?: number;
}

export interface Invoice {
  orderId?: number;
  date: string | Date;
  isPrinted: boolean;
  isPaid: boolean;
  paidDate?: string | Date;
  checkNumber?: string;
  orderItems: InvoiceItemDetail[];
  client: string;
  orderTotal: number;
  subtotal: number;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface Client {
  id: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  fax?: string;
  vendorId?: string;
}
