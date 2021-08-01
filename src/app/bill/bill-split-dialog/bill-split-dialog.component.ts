import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingsService } from 'src/app/service/settings.service';
import { BillEntry } from '../bill.component';
import { CalculateService } from './../calculate.service';

export interface Debtor {
  personNumber: number;
  amount: number;
  tip: number;
  entries: { name: string; splitPrice: number }[];
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

  constructor(
    @Inject(MAT_DIALOG_DATA) data: BillEntry[],
    public settingsService: SettingsService,
    private calculateService: CalculateService
  ) {
    this.billEntries = data;
    this.payer = 1;
    this.numberOfPayers = this.settingsService.numberOfPayers;
    this.debtors = this.calculateService.calculateDebtorsForPayer(
      this.billEntries
    );
  }

  ngOnInit(): void {}

  onClickPayer(payerNumber: number): void {
    this.payer = payerNumber;
    this.debtors = this.calculateService.calculateDebtorsForPayer(
      this.billEntries
    );
  }
}
