export interface Debtor {
  personId: string;
  amount: number;
  tip: number;
  entries: { name: string; splitPrice: number }[];
}
