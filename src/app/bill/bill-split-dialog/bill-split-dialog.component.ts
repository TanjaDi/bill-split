import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BillEntry } from 'src/app/model/billl-entry.model';
import { Debtor } from 'src/app/model/debtor.model';
import { SettingsService } from 'src/app/service/settings.service';
import { CalculateService } from './../calculate.service';

export interface BillSplitDialogData {
  billEntries: BillEntry[];
  manuallyEditedTip: null | number;
}

@Component({
  selector: 'app-bill-split-dialog',
  templateUrl: './bill-split-dialog.component.html',
  styleUrls: ['./bill-split-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillSplitDialogComponent implements OnInit {
  billEntries: BillEntry[];
  numberOfPayers: number;
  payer: number;
  debtors: Debtor[] = [];
  manuallyEditedTip: number | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: BillSplitDialogData,
    public settingsService: SettingsService,
    private calculateService: CalculateService
  ) {
    this.billEntries = data.billEntries;
    this.manuallyEditedTip = data.manuallyEditedTip;
    this.payer = 1;
    this.numberOfPayers = this.settingsService.numberOfPayers;
    this.debtors = this.calculateService.calculateDebtorsForPayer(
      this.billEntries, this.manuallyEditedTip
    );
  }

  ngOnInit(): void {}

  onClickPayer(payerNumber: number): void {
    this.payer = payerNumber;
    this.debtors = this.calculateService.calculateDebtorsForPayer(
      this.billEntries,
      this.manuallyEditedTip
    );
  }
}
