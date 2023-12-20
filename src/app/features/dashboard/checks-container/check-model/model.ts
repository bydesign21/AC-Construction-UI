export interface CheckReport extends Check {}

export interface Check {
  checkNumber?: string;
  date: string;
  name: string;
  isVoid: boolean;
  isPaid: boolean;
  lineItems: CheckLineItem[];
  total: number;
  discount?: number;
  subtotal?: number;
}

export interface CheckLineItem {
  total: number | null;
  description: string | null;
}

export interface Employee {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  socialSecurityNumber: string;
  jobTitle: string;
  hourlyRate: number;
  isContractor: boolean;
  employeeIdentificationNumber?: string;
}
