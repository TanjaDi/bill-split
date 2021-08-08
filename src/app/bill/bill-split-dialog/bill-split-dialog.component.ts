import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BillEntry } from 'src/app/model/billl-entry.model';
import { Debtor } from 'src/app/model/debtor.model';
import { CalculateService } from 'src/app/service/calculate.service';
import { SettingsService } from 'src/app/service/settings.service';

export interface BillSplitDialogData {
  billEntries: BillEntry[];
  tipValue: number;
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
  tipValue: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: BillSplitDialogData,
    public settingsService: SettingsService,
    private calculateService: CalculateService
  ) {
    this.billEntries = data.billEntries;
    this.tipValue = data.tipValue;
    this.payer = 1;
    this.numberOfPayers = this.settingsService.numberOfPayers;
    this.debtors = this.calculateService.calculateDebtorsForPayer(
      this.billEntries,
      this.tipValue
    );
  }

  ngOnInit(): void {}

  onClickPayer(payerNumber: number): void {
    this.payer = payerNumber;
    this.debtors = this.calculateService.calculateDebtorsForPayer(
      this.billEntries,
      this.tipValue
    );
  }
}
