export interface WeeklyReportDataEmission {
  expenseList: ExpenseItem[];
  payroll: number;
  revenue: number;
  profit: number;
  profitSplit: number;
  moulding: number;
  framing: number;
  misc: number;
  decking: number;
  totalExpenses: number;
  date: string;
}

export enum ExpenseTypes {
  FRAMING = 'Framing',
  DECKING = 'Decking',
  MOULDING = 'Moulding',
  MISC = 'Misc',
}

export type ExpenseType = `${ExpenseTypes}`;

export interface ExpenseItem {
  id: string;
  employeeName?: string;
  address: string;
  sqftPrice?: number;
  sqft?: number;
  amount?: number;
  isPaid?: boolean;
  date?: string;
  expenseType: ExpenseType;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface WeeklyReportTotals {
  total: number;
  decking: number;
  framing: number;
  misc: number;
  moulding: number;
  profit: number;
  profitSplit: number;
}

export interface WeeklyReportInputRowProps {
  dateRange: Date[];
  revenueTotal: number | null;
  payrollTotal: number | null;
}

export interface WeeklyReport {
  id?: string;
  date: string;
  revenue: number;
  totalExpenses: number;
  profit: number;
  profitSplit: number;
  payroll: number;
  moulding: number;
  framing: number;
  misc: number;
  decking: number;
}
