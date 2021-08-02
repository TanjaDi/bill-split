import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { BillEntry } from '../model/billl-entry.model';
import { DebtorGroup } from '../model/debtor-group.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  private bill$: BehaviorSubject<BillEntry[]>;

  constructor(private localStorageService: LocalStorageService) {
    const bill = this.loadBillFromLocalStorage();
    this.bill$ = new BehaviorSubject<BillEntry[]>(bill);
  }

  getBill(): BillEntry[] {
    return this.bill$.getValue();
  }

  getBill$(): BehaviorSubject<BillEntry[]> {
    return this.bill$;
  }

  createNewBillEntry(currency: 'EUR' | 'USD'): BillEntry {
    return {
      id: uuidv4(),
      name: 'Eintrag ' + (this.getBill().length + 1),
      price: 0,
      currency: currency,
      debtors: new DebtorGroup([1]),
    };
  }

  addBillEntry(newEntry: BillEntry): void {
    const bill = this.bill$.getValue();
    bill.push(newEntry);
    this.saveBill(bill);
  }

  removeBillEntry(billEntryId: string) {
    const bill = this.getBill();
    const indexToRemove = bill.findIndex((iEntry) => iEntry.id === billEntryId);
    bill.splice(indexToRemove, 1);
    this.saveBill(bill);
  }

  saveBill(bill: BillEntry[]): void {
    this.bill$.next(bill);
    this.localStorageService.setItem(
      LocalStorageService.CURRENT_BILL,
      JSON.stringify(bill)
    );
  }

  clearBill(): void {
    this.saveBill([]);
  }

  private loadBillFromLocalStorage(): BillEntry[] {
    const billAsString = this.localStorageService.getItem(
      LocalStorageService.CURRENT_BILL
    );
    if (billAsString !== null) {
      return JSON.parse(billAsString);
    }
    return [];
  }
}
