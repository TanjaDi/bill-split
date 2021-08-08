import { Injectable } from '@angular/core';
import { BillEntry } from '../model/billl-entry.model';
import { Debtor } from '../model/debtor.model';

@Injectable({
  providedIn: 'root',
})
export class CalculateService {
  constructor() {}

  calculateTipInPercent(tipValue: number, total: number): number {
    if (total === 0) {
      return 0;
    }
    return (tipValue / total) * 100;
  }

  calculateSumWithTip(tipValue: number, total: number): number {
    return total + tipValue;
  }

  calculateExactTip(total: number, tipInPercent: number): number {
    return total * (tipInPercent / 100);
  }

  calculateRoundedTip(total: number, tipInPercent: number): number {
    const exactTip = this.calculateExactTip(total, tipInPercent);
    const exactSum = total + exactTip;
    let roundedSum: number;
    if (exactTip < 1) {
      // round to 0.5
      roundedSum = Math.round(exactSum * 2) / 2;
    } else {
      roundedSum = Math.round(exactSum);
    }
    const roundedTip = roundedSum - total;
    if (roundedTip > 0) {
      return roundedTip;
    }
    return 0;
  }

  calculateTotal(billEntries: BillEntry[]): number {
    return billEntries
      .map((entry) => entry.price)
      .reduce((total, price) => {
        total += price;
        return total;
      }, 0);
  }

  calculateDebtorsForPayer(
    billEntries: BillEntry[],
    tipValue: number
  ): Debtor[] {
    const totalWithoutTip = this.calculateTotal(billEntries);
    const debtors = this.calculateDebtors(billEntries);
    this.addTipProcentual(debtors, tipValue, totalWithoutTip);
    return debtors;
  }

  private addTipProcentual(
    debtors: Debtor[],
    tip: number,
    totalWithoutTip: number
  ): Debtor[] {
    return debtors.map((debtor) => {
      let percentage: number;
      if (totalWithoutTip === 0) {
        percentage = 0;
      } else {
        percentage = debtor.amount / totalWithoutTip;
      }
      const tipForThisTotal = percentage * tip;
      debtor.amount += tipForThisTotal;
      debtor.tip = tipForThisTotal;
      return debtor;
    });
  }

  private calculateDebtors(billEntries: BillEntry[]): Debtor[] {
    return billEntries.reduce((result, entry) => {
      const debtors = entry.debtors.getPersonIds();
      let splitEqualAmount: number;
      if (debtors.length > 0) {
        splitEqualAmount = entry.price / debtors.length;
      } else {
        splitEqualAmount = 0;
      }
      debtors.forEach((debtorNumber) => {
        const debtorEntry = result.find(
          (debtor) => debtor.personNumber === debtorNumber
        );
        const splitEntry = {
          name: entry.name,
          splitPrice: splitEqualAmount,
        };
        if (debtorEntry) {
          debtorEntry.amount += splitEqualAmount;
          debtorEntry.entries.push(splitEntry);
        } else {
          const newDebt: Debtor = {
            amount: splitEqualAmount,
            personNumber: debtorNumber,
            entries: [splitEntry],
            tip: 0,
          };
          result.push(newDebt);
        }
      });
      return result;
    }, [] as Debtor[]);
  }
}
