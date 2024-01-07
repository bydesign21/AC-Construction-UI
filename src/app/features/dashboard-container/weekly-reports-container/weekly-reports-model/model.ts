export enum ExpenseTypes {
  FRAMING = 'Framing',
  DECKING = 'Decking',
  MOULDING = 'Moulding',
  MISC = 'Misc',
}

export type ExpenseType = `${ExpenseTypes}`;

export interface ExpenseItem {
  id?: string;
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
  revenue: number;
  totalExpenses: number;
  profit: number;
  expenseList: ExpenseItem[];
  profitSplit: number;
  payroll: number;
  moulding: number;
  decking: number;
  framing: number;
  misc: number;
  date: Date[];
}
