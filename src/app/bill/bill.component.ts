import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DebtorGroup } from '../payer/debtor-group.model';
import {
  DebtorSelectionDialogComponent as DebtorsSelectionDialogComponent,
  DebtorSelectionDialogData as DebtorsSelectionDialogData,
} from '../payer/payer-selection-dialog/debtor-selection-dialog.component';
import { LocalStorageService } from './../service/local-storage.service';
import { SettingsService } from './../service/settings.service';
import { BillSplitDialogComponent } from './bill-split-dialog/bill-split-dialog.component';
import { CalculateService } from './calculate.service';
import { EditBillEntryDialogComponent } from './edit-bill-entry-dialog/edit-bill-entry-dialog.component';

export interface BillEntry {
  name: string;
  price: number;
  currency: 'EUR' | 'USD';
  debtors: DebtorGroup;
}

@Component({
  selector: 'bsplit-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BillComponent implements OnInit {
  tipInPercent: number;
  entries: BillEntry[] = [];
  total: number = 0;
  roundedTip = 0;
  currency: 'EUR' | 'USD';
  readonly displayedColumns = ['name', 'price', 'edit'];
  readonly displayedColumnsForTipFooter = ['tip', 'tipAmount', 'calculateTip'];

  constructor(
    private settingsService: SettingsService,
    private calculateService: CalculateService,
    private matDialog: MatDialog,
    private localStorageService: LocalStorageService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.tipInPercent = this.settingsService.tipInPercent;
    const currentBillFromLS = this.localStorageService.getItem(
      LocalStorageService.CURRENT_BILL
    );
    if (currentBillFromLS !== null) {
      this.entries = JSON.parse(currentBillFromLS);
      this.entries.forEach((entry) => {
        entry.debtors = new DebtorGroup(entry.debtors.personNumbers);
      });
      this.currency =
        this.entries.find((a) => a)?.currency || this.settingsService.currency;
    } else {
      this.entries = [];
      this.currency = this.settingsService.currency;
    }
  }

  ngOnInit(): void {
    this.total = this.calculateService.calculateTotal(this.entries);
    this.roundedTip = this.calculateService.calculateRoundedTip(this.total);
  }

  openDebtorsSelection(billEntry: BillEntry): void {
    if (this.settingsService.numberOfPayers > 1) {
      const data: DebtorsSelectionDialogData = {
        debtors: billEntry.debtors,
        numberOfPayers: this.settingsService.numberOfPayers,
        entryName: billEntry.name,
      };
      const dialogRef = this.matDialog.open<
        DebtorsSelectionDialogComponent,
        DebtorsSelectionDialogData,
        DebtorGroup
      >(DebtorsSelectionDialogComponent, { data });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          billEntry.debtors = result;
          this.changeDetectorRef.markForCheck();
        }
      });
    }
  }

  onClickAddEntry(): void {
    const newEntry: BillEntry = {
      name: 'Eintrag ' + (this.entries.length + 1),
      price: 0,
      currency: this.currency,
      debtors: new DebtorGroup([1]),
    };
    this.entries.push(newEntry);
    this.openEditDialog(newEntry);
  }

  onDoubleClickEntry(billEntry: BillEntry): void {
    this.openEditDialog(billEntry);
  }

  onClickSplitBill(): void {
    const dialogRef = this.matDialog.open<
      BillSplitDialogComponent,
      BillEntry[]
    >(BillSplitDialogComponent, { data: this.entries });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  private openEditDialog(billEntry: BillEntry): void {
    const dialogRef = this.matDialog.open<
      EditBillEntryDialogComponent,
      BillEntry,
      BillEntry
    >(EditBillEntryDialogComponent, { data: billEntry });

    dialogRef.afterClosed().subscribe((result) => {
      this.saveToLocalStorage(this.entries);
      this.total = this.calculateService.calculateTotal(this.entries);
      this.roundedTip = this.calculateService.calculateRoundedTip(this.total);
      this.changeDetectorRef.markForCheck();
    });
  }

  private saveToLocalStorage(billEntries: BillEntry[]): void {
    const billAsString = JSON.stringify(billEntries);
    this.localStorageService.setItem(
      LocalStorageService.CURRENT_BILL,
      billAsString
    );
  }
}
