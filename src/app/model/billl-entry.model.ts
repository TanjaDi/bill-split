import { DebtorGroup } from './debtor-group.model';

export interface BillEntry {
  name: string;
  price: number;
  currency: 'EUR' | 'USD';
  debtors: DebtorGroup;
}
