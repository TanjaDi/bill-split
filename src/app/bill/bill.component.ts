import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { BillEntry } from '../model/billl-entry.model';
import { PersonGroup } from '../model/person-group.model';
import { BillService } from './../service/bill.service';
import { SettingsService } from './../service/settings.service';
import { BillSplitDialogComponent } from './bill-split-dialog/bill-split-dialog.component';
import { CalculateService } from './calculate.service';
import {
  DebtorSelectionDialogComponent as DebtorsSelectionDialogComponent,
  DebtorSelectionDialogData as DebtorsSelectionDialogData,
} from './debtor-selection-dialog/debtor-selection-dialog.component';
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
      entry.debtors = new PersonGroup(entry.debtors.personNumbers);
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
      PersonGroup
    >(DebtorsSelectionDialogComponent, { data });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        billEntry.debtors = result;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  onClickAddEntry(): void {
    this.openEditDialog(null);
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

  private openEditDialog(billEntryToEdit: BillEntry | null): void {
    const dialogRef = this.matDialog.open<
      EditBillEntryDialogComponent,
      BillEntry | null,
      BillEntry | null
    >(EditBillEntryDialogComponent, { data: billEntryToEdit });

    dialogRef.afterClosed().subscribe((updatedBill) => {
      if (updatedBill === null && billEntryToEdit !== null) {
        // delete existing
        this.billService.removeBillEntry(billEntryToEdit.id);
      } else if (updatedBill != null && billEntryToEdit === null) {
        // add new
        this.billService.addBillEntry(updatedBill);
      } else {
        // update
        const bill = this.billService.getBill();
        this.billService.saveBill(bill);
      }
      this.changeDetectorRef.markForCheck();
    });
  }
}
