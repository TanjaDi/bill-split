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
import { CalculateService } from '../service/calculate.service';
import {
  EditTipDialogComponent,
  EditTipDialogData,
} from './../edit-tip-dialog/edit-tip-dialog.component';
import { BillService } from './../service/bill.service';
import { SettingsService } from './../service/settings.service';
import {
  BillSplitDialogComponent,
  BillSplitDialogData,
} from './bill-split-dialog/bill-split-dialog.component';
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
  bill$: Observable<BillEntry[]>;
  total = 0;
  currentTipValue: number;
  currentTipPercent: number;
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
    this.currentTipPercent = this.settingsService.tipInPercent;
    this.currency = this.settingsService.currency;
    this.currentTipValue = 0;

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
    this.currentTipValue = this.calculateService.calculateRoundedTip(
      this.total,
      this.settingsService.tipInPercent
    );
    this.currentTipPercent = this.calculateService.calculateTipInPercent(
      this.currentTipValue,
      this.total
    );
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
    const data: BillSplitDialogData = {
      billEntries: this.billService.getBill(),
      tipValue: this.currentTipValue,
    };
    const dialogRef = this.matDialog.open<
      BillSplitDialogComponent,
      BillSplitDialogData
    >(BillSplitDialogComponent, { data });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  onClickEditTip(): void {
    const data: EditTipDialogData = {
      tipValue: this.currentTipValue,
      total: this.total,
      currency: this.currency,
    };
    const dialogRef = this.matDialog.open<
      EditTipDialogComponent,
      EditTipDialogData,
      number | null
    >(EditTipDialogComponent, { data });

    dialogRef.afterClosed().subscribe((newTip) => {
      if (newTip !== undefined && newTip !== null) {
        this.currentTipValue = newTip;
        this.currentTipPercent = this.calculateService.calculateTipInPercent(
          this.currentTipValue,
          this.total
        );
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

    dialogRef.afterClosed().subscribe((updatedOrNewBill) => {
      if (updatedOrNewBill !== undefined) {
        if (updatedOrNewBill === null && billEntryToEdit !== null) {
          // delete existing
          this.billService.removeBillEntry(billEntryToEdit.id);
        } else if (updatedOrNewBill !== null && billEntryToEdit === null) {
          // add new
          this.billService.addNewBillEntry(updatedOrNewBill);
        } else if (updatedOrNewBill !== null) {
          // update
          this.billService.updateBillEntry(updatedOrNewBill);
        }
        this.changeDetectorRef.markForCheck();
      }
    });
  }
}
