import { Injectable } from '@angular/core';
import { SettingsService } from 'src/app/service/settings.service';
import { BillEntry } from '../model/billl-entry.model';
import { Debtor } from '../model/debtor.model';

@Injectable({
  providedIn: 'root',
})
export class CalculateService {
  private _currentTipValue = 0;
  private _currentTipInPercent: number;
  private _currentTotal = 0;
  private _currentTotalWithTip = 0;

  constructor(private settingsService: SettingsService) {
    this._currentTipInPercent = this.settingsService.defaultTipInPercent;
  }

  get currentTipValue(): number {
    return this._currentTipValue;
  }

  get currentTipInPercent(): number {
    return this._currentTipInPercent;
  }

  get currentTotal(): number {
    return this._currentTotal;
  }

  get currentTotalWithTip(): number {
    return this._currentTotalWithTip;
  }

  updateTipInPercentUsingTipValueAndTotal(): void {
    if (this.currentTotal > 0) {
      this._currentTipInPercent =
        (this.currentTipValue / this.currentTotal) * 100;
    }
  }

  updateTotalWithTip(): void {
    this._currentTotalWithTip = this.currentTotal + this.currentTipValue;
  }

  updateTipValueToExactTip(newTipInPercent: number): void {
    this._currentTipInPercent = newTipInPercent;
    const newTipValue = this.getExactTipValueAsNumber(
      this.currentTotal,
      this.currentTipInPercent
    );
    this._currentTipValue = newTipValue;
    this.updateTotalWithTip();
  }

  setNewTotalWithTip(newTotalWithTip: number) {
    if (newTotalWithTip >= this.currentTotal) {
      this._currentTotalWithTip = newTotalWithTip;
      this._currentTipValue = this._currentTotalWithTip - this.currentTotal;
      this.updateTipInPercentUsingTipValueAndTotal();
    }
  }

  private getExactTipValueAsNumber(
    total: number,
    tipInPercent: number
  ): number {
    return total * (tipInPercent / 100);
  }

  updateTipValueToRoundedTip(newTipInPercent?: number): void {
    if (newTipInPercent !== undefined) {
      this._currentTipInPercent = newTipInPercent;
    }
    const exactTip = this.getExactTipValueAsNumber(
      this.currentTotal,
      this.currentTipInPercent
    );
    const exactSum = this.currentTotal + exactTip;
    let roundedSum: number;
    if (exactTip < 1) {
      // round to 0.5
      roundedSum = Math.round(exactSum * 2) / 2;
    } else {
      // round to integer
      roundedSum = Math.round(exactSum);
    }
    const roundedTip = roundedSum - this.currentTotal;
    // make sure tip is not negative
    this._currentTipValue = roundedTip > 0 ? roundedTip : 0;
    this.updateTotalWithTip();
  }

  updateTotal(billEntries: BillEntry[]): void {
    const total = billEntries
      .map((entry) => entry.price)
      .reduce((total, price) => {
        total += price;
        return total;
      }, 0);
    this._currentTotal = total;
    this.updateTotalWithTip();
  }

  calculateDebtorsForPayer(billEntries: BillEntry[]): Debtor[] {
    this.updateTotal(billEntries);
    const totalWithoutTip = this.currentTotal;
    const debtors = this.calculateDebtors(billEntries);
    this.addTipProcentual(debtors, this.currentTipValue, totalWithoutTip);
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
      debtors.forEach((personId) => {
        const debtorEntry = result.find(
          (debtor) => debtor.personId === personId
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
            personId: personId,
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
