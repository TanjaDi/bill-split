import { getCurrencySymbol } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingsService } from './../../service/settings.service';
import { BillEntry } from './../bill.component';

@Component({
  selector: 'app-edit-bill-entry-dialog',
  templateUrl: './edit-bill-entry-dialog.component.html',
  styleUrls: ['./edit-bill-entry-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBillEntryDialogComponent implements OnInit {
  billEntry: BillEntry;
  currencySymbol: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: BillEntry,
    private settingsService: SettingsService
  ) {
    this.billEntry = data;
    this.currencySymbol = getCurrencySymbol(
      this.settingsService.currency,
      'narrow',
      'de'
    );
  }

  ngOnInit(): void {}
}
