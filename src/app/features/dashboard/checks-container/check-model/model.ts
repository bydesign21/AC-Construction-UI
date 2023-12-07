export interface CheckReport extends Check {}

export interface Check {
  id?: string;
  date: string;
  checkNumber: string;
  description: string;
  employeeId: string;
  isVoid: boolean;
  isCharged: boolean;
  lineItems: CheckLineItem[];
  total: number;
  discount?: number;
  subtotal?: number;
}

export interface CheckLineItem {
  id?: string;
  checkId?: string;
  amount: number;
  description: string;
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
}
