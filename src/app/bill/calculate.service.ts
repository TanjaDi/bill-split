import { Injectable } from '@angular/core';
import { BillEntry } from '../model/billl-entry.model';
import { Debtor } from '../model/debtor.model';
import { SettingsService } from './../service/settings.service';

@Injectable({
  providedIn: 'root',
})
export class CalculateService {
  constructor(private settingsService: SettingsService) {}

  private calculateExactTip(total: number): number {
    return total * (this.settingsService.tipInPercent / 100);
  }

  calculateRoundedTip(total: number): number {
    const exactTip = this.calculateExactTip(total);
    const exactSum = total + exactTip;
    return Math.round(exactSum) - total;
  }

  calculateTotal(billEntries: BillEntry[]): number {
    return billEntries
      .map((entry) => entry.price)
      .reduce((total, price) => {
        total += price;
        return total;
      }, 0);
  }

  calculateDebtorsForPayer(billEntries: BillEntry[]): Debtor[] {
    const total = this.calculateTotal(billEntries);
    const tip = this.calculateRoundedTip(total);
    const debtors = this.calculateDebtors(billEntries);
    this.addTipProcentual(debtors, tip, total);
    return debtors;
  }

  private addTipProcentual(
    debtors: Debtor[],
    tip: number,
    total: number
  ): Debtor[] {
    return debtors.map((debtor) => {
      const percentage = debtor.amount / total;
      const tipPercentage = percentage * tip;
      debtor.amount += tipPercentage;
      debtor.tip = tipPercentage;
      return debtor;
    });
  }

  private calculateDebtors(billEntries: BillEntry[]): Debtor[] {
    return billEntries.reduce((result, entry) => {
      const debtors = entry.debtors.getDebtors();
      const splitEqualAmount = entry.price / debtors.length;
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
