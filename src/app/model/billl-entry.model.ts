import { DebtorGroup } from './debtor-group.model';

export interface BillEntry {
  id: string;
  name: string;
  price: number;
  currency: 'EUR' | 'USD';
  debtors: DebtorGroup;
}
