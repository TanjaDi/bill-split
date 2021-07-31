import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from './../service/settings.service';
import {
  PayerSelectionDialogComponent,
  PayerSelectionDialogData,
} from './payer-selection-dialog/payer-selection-dialog.component';

export interface BillEntry {
  name: string;
  price: number;
  payer: Payer;
  isEditMode: boolean;
}

export interface Payer {
  payers: number[];
}

const DATA_SOURCE: BillEntry[] = [
  { name: 'Cola zero', price: 3.3, payer: { payers: [1] }, isEditMode: false },
  {
    name: 'Pizza Fungi',
    price: 10.5,
    payer: { payers: [1] },
    isEditMode: false,
  },
  {
    name: 'Augustiner Helles',
    price: 4.5,
    payer: { payers: [1] },
    isEditMode: false,
  },
  {
    name: 'Pizza Vegana',
    price: 11.5,
    payer: { payers: [1] },
    isEditMode: false,
  },
];

@Component({
  selector: 'bsplit-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
})
export class BillComponent implements OnInit {
  tipInPercent: number;
  formGroup: FormGroup;
  entries: BillEntry[];
  total: number;
  tip = 0;
  displayedColumns = ['name', 'price', 'edit'];
  displayedColumnsForTipFooter = ['tip', 'tipAmount', 'calculateTip'];
  currency: 'EUR' | 'USD';

  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    public matDialog: MatDialog
  ) {
    this.tipInPercent = this.settingsService.tipInPercent;
    this.currency = this.settingsService.currency;
    this.entries = DATA_SOURCE;
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([new FormControl()]),
    });
    this.total = this.entries.reduce((sum, entry) => {
      sum += entry.price;
      return sum;
    }, 0);
    this.calculateTip();
  }

  ngOnInit(): void {}

  calculateTip(): void {
    this.tip = this.total * (this.tipInPercent / 100);
  }

  openPayerSelection(billEntry: BillEntry): void {
    if (this.settingsService.numberOfPayers > 1) {
      const data: PayerSelectionDialogData = {
        payer: billEntry.payer,
        numberOfPayers: this.settingsService.numberOfPayers,
        entryName: billEntry.name,
      };
      const dialogRef = this.matDialog.open<
        PayerSelectionDialogComponent,
        PayerSelectionDialogData,
        Payer
      >(PayerSelectionDialogComponent, { data });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          billEntry.payer = result;
        }
      });
    }
  }

  onClickAddEntry(): void {
    this.entries.push({
      name: 'Eintrag ' + (this.entries.length + 1),
      price: 0,
      isEditMode: true,
      payer: { payers: [1] },
    });
  }
}
