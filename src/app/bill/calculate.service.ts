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

  calculateDebtorsForPayer(
    billEntries: BillEntry[],
    manuallyEditedTip: number | null
  ): Debtor[] {
    const totalWithoutTip = this.calculateTotal(billEntries);
    const tip =
      manuallyEditedTip === null
        ? this.calculateRoundedTip(totalWithoutTip)
        : manuallyEditedTip;
    const debtors = this.calculateDebtors(billEntries);
    this.addTipProcentual(debtors, tip, totalWithoutTip);
    return debtors;
  }

  private addTipProcentual(
    debtors: Debtor[],
    tip: number,
    totalWithoutTip: number
  ): Debtor[] {
    return debtors.map((debtor) => {
      const percentage = debtor.amount / totalWithoutTip;
      const tipForThisTotal = percentage * tip;
      debtor.amount += tipForThisTotal;
      debtor.tip = tipForThisTotal;
      return debtor;
    });
  }

  private calculateDebtors(billEntries: BillEntry[]): Debtor[] {
    return billEntries.reduce((result, entry) => {
      const debtors = entry.debtors.getPersonIds();
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
