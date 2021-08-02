import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { BillEntry } from '../model/billl-entry.model';
import { DebtorGroup } from '../model/debtor-group.model';
import {
  DebtorSelectionDialogComponent as DebtorsSelectionDialogComponent,
  DebtorSelectionDialogData as DebtorsSelectionDialogData,
} from '../payer/payer-selection-dialog/debtor-selection-dialog.component';
import { BillService } from './../service/bill.service';
import { SettingsService } from './../service/settings.service';
import { BillSplitDialogComponent } from './bill-split-dialog/bill-split-dialog.component';
import { CalculateService } from './calculate.service';
import { EditBillEntryDialogComponent } from './edit-bill-entry-dialog/edit-bill-entry-dialog.component';

@Component({
  selector: 'bsplit-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BillComponent implements OnInit {
  tipInPercent: number;
  bill$: Observable<BillEntry[]>;
  total = 0;
  roundedTip = 0;
  currency: 'EUR' | 'USD';
  readonly displayedColumns = ['name', 'price', 'edit'];
  readonly displayedColumnsForTipFooter = ['tip', 'tipAmount', 'calculateTip'];

  private subscriptions: Subscription[] = [];

  constructor(
    private billService: BillService,
    private settingsService: SettingsService,
    private calculateService: CalculateService,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.tipInPercent = this.settingsService.tipInPercent;
    this.currency = this.settingsService.currency;

    this.bill$ = this.billService.getBill$().asObservable();
    const billChangesSubscription = this.billService
      .getBill$()
      .subscribe((newBill) => this.onChangeBill(newBill));
    this.subscriptions.push(billChangesSubscription);
  }

  private onChangeBill(newBill: BillEntry[]) {
    newBill.forEach((entry) => {
      entry.debtors = new DebtorGroup(entry.debtors.personNumbers);
    });
    this.currency =
      newBill.find((a) => a)?.currency || this.settingsService.currency;
    this.total = this.calculateService.calculateTotal(newBill);
    this.roundedTip = this.calculateService.calculateRoundedTip(this.total);
  }

  ngOnInit(): void {}

  openDebtorsSelection(billEntry: BillEntry): void {
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

  onClickAddEntry(): void {
    const newEntry: BillEntry = {
      name: 'Eintrag ' + (this.billService.getBill().length + 1),
      price: 0,
      currency: this.currency,
      debtors: new DebtorGroup([1]),
    };
    this.billService.addBillEntry(newEntry);
    this.openEditDialog(newEntry);
  }

  onDoubleClickEntry(billEntry: BillEntry): void {
    this.openEditDialog(billEntry);
  }

  onClickSplitBill(): void {
    const dialogRef = this.matDialog.open<
      BillSplitDialogComponent,
      BillEntry[]
    >(BillSplitDialogComponent, { data: this.billService.getBill() });

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

    dialogRef.afterClosed().subscribe((_result) => {
      const bill = this.billService.getBill();
      this.billService.saveBill(bill);
      this.changeDetectorRef.markForCheck();
    });
  }
}
