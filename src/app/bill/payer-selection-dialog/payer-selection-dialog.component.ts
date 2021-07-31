import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Payer } from '../bill.component';

export interface PayerSelectionDialogData {
  entryName: string;
  payer: Payer;
  numberOfPayers: number;
}

@Component({
  selector: 'app-payer-selection-dialog',
  templateUrl: './payer-selection-dialog.component.html',
  styleUrls: ['./payer-selection-dialog.component.scss'],
})
export class PayerSelectionDialogComponent implements OnInit {
  entryName: string;
  numberOfPayers: number;
  payer: Payer;

  constructor(@Inject(MAT_DIALOG_DATA) public data: PayerSelectionDialogData) {
    this.entryName = data.entryName;
    this.numberOfPayers = data.numberOfPayers;
    this.payer = data.payer;
  }

  ngOnInit(): void {}

  togglePayer(payerNumber: number): void {
    const foundIndex = this.payer.payers.findIndex(
      (iPayer) => iPayer === payerNumber
    );
    if (foundIndex > -1) {
      if (this.payer.payers.length > 1) {
        // only allow deselection if there is more than one payer left
        this.payer.payers.splice(foundIndex, 1);
      }
    } else {
      this.payer.payers.push(payerNumber);
      this.payer.payers.sort();
    }
  }

  isPayerSelected(payerNumber: number): boolean {
    const foundIndex = this.payer.payers.findIndex(
      (iPayer) => iPayer === payerNumber
    );
    if (foundIndex > -1) {
      return true;
    }
    return false;
  }
}
