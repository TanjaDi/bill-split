import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BillEntry } from '../model/billl-entry.model';
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

  addBillEntry(newEntry: BillEntry): void {
    const bill = this.bill$.getValue();
    bill.push(newEntry);
    this.bill$.next(bill);
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
