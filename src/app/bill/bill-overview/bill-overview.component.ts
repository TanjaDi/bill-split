import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import {
  EditTipDialogComponent,
  EditTipDialogData,
} from 'src/app/edit-tip-dialog/edit-tip-dialog.component';
import { BillEntry } from 'src/app/model/billl-entry.model';
import { PersonGroup } from 'src/app/model/person-group.model';
import { BillService } from 'src/app/service/bill.service';
import { CalculateService } from 'src/app/service/calculate.service';
import { SettingsService } from 'src/app/service/settings.service';
import {
  BillSplitDialogComponent,
  BillSplitDialogData,
} from '../bill-split-dialog/bill-split-dialog.component';
import { EditBillEntryDialogComponent } from '../edit-bill-entry-dialog/edit-bill-entry-dialog.component';

@Component({
  selector: 'bsplit-bill-overview',
  templateUrl: './bill-overview.component.html',
  styleUrls: ['./bill-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BillOverviewComponent implements OnInit {
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

  onClickAddEntry(): void {
    this.openEditDialog(null);
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

  openEditDialog(billEntryToEdit: BillEntry | null): void {
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