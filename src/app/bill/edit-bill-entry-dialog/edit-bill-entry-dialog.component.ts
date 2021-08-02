import { getCurrencySymbol } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BillEntry } from 'src/app/model/billl-entry.model';
import { PersonGroup } from 'src/app/model/person-group.model';
import { BillService } from 'src/app/service/bill.service';
import { SettingsService } from './../../service/settings.service';

@Component({
  selector: 'app-edit-bill-entry-dialog',
  templateUrl: './edit-bill-entry-dialog.component.html',
  styleUrls: ['./edit-bill-entry-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBillEntryDialogComponent implements OnInit {
  billEntry: BillEntry;
  currencySymbol: string;
  numberOfPayers: number;
  debtors: PersonGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: BillEntry | null,
    private settingsService: SettingsService,
    private billService: BillService
  ) {
    if (data === null) {
      this.billEntry = this.billService.createNewBillEntry(
        this.settingsService.currency
      );
    } else {
      this.billEntry = data;
    }
    this.debtors = this.billEntry.debtors;
    this.numberOfPayers = this.settingsService.numberOfPayers;
    this.currencySymbol = getCurrencySymbol(
      this.settingsService.currency,
      'narrow',
      'de'
    );
  }

  ngOnInit(): void {}

  toggleSelected(personNumber: number): void {
    this.debtors.toggleSelected(personNumber);
  }

  isPersonSelected(personNumber: number): boolean {
    return this.debtors.isPersonSelected(personNumber);
  }
}
