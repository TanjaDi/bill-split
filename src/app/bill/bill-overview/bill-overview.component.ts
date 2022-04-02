import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import {
  EditTipDialogComponent,
  EditTipDialogData
} from 'src/app/edit-tip-dialog/edit-tip-dialog.component';
import { BillEntry } from 'src/app/model/billl-entry.model';
import { PersonGroup } from 'src/app/model/person-group.model';
import { BillService } from 'src/app/service/bill.service';
import { CalculateService } from 'src/app/service/calculate.service';
import { SettingsService } from 'src/app/service/settings.service';
import {
  BillSplitDialogComponent,
  BillSplitDialogData
} from '../bill-split-dialog/bill-split-dialog.component';
import { ROUTE_BILL_ENTRY } from './../../app-routing.module';

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
    private router: Router,
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
      entry.debtors = new PersonGroup(entry.debtors.friendIds);
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
    this.gotoBillEntry(null);
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

  gotoBillEntry(billEntryToEdit: BillEntry | null): void {
    this.router.navigate([ROUTE_BILL_ENTRY], billEntryToEdit ? {queryParams: {id: billEntryToEdit.id}} : undefined);
  }
}
