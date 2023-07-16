import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PersonService } from 'src/app/service/person.service';
import { v4 as uuidv4 } from 'uuid';
import { BillEntry } from '../model/billl-entry.model';
import { PersonGroup } from '../model/person-group.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  private bill$: BehaviorSubject<BillEntry[]>;

  constructor(
    private localStorageService: LocalStorageService,
    private personService: PersonService
  ) {
    this.bill$ = new BehaviorSubject<BillEntry[]>([]);
    this.personService.initFinished$.subscribe(() => {
      const bill = this.loadBillFromLocalStorage();
      this.bill$.next(bill);
    });
  }

  getBill(): BillEntry[] {
    return this.bill$.getValue().map((entry) => {
      // call new to create class
      entry.debtors = new PersonGroup(entry.debtors.personIds);
      return entry;
    });
  }

  getBill$(): BehaviorSubject<BillEntry[]> {
    return this.bill$;
  }

  createNewBillEntry(currency: 'EUR' | 'USD'): BillEntry {
    const personIds = this.personService.persons.map((f) => f.id);
    return {
      id: '',
      name: '',
      price: 0,
      currency: currency,
      debtors: new PersonGroup([personIds[0]]),
    };
  }

  addNewBillEntry(newEntry: BillEntry): void {
    const bill = this.bill$.getValue();
    if (newEntry.id === '') {
      newEntry.id = uuidv4();
    }
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

  updateBillEntry(billEntry: BillEntry): void {
    const bill = this.getBill();
    const indexToUpdate = bill.findIndex(
      (iEntry) => iEntry.id === billEntry.id
    );
    bill.splice(indexToUpdate, 1, billEntry);
    this.saveBill(bill);
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
