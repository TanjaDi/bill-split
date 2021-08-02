export interface Debtor {
  personNumber: number;
  amount: number;
  tip: number;
  entries: { name: string; splitPrice: number }[];
}
