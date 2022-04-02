export interface Debtor {
  friendId: string;
  amount: number;
  tip: number;
  entries: { name: string; splitPrice: number }[];
}
