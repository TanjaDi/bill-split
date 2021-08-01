import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DebtorGroup } from '../debtor-group.model';

export interface DebtorSelectionDialogData {
  entryName: string;
  debtors: DebtorGroup;
  numberOfPayers: number;
}

@Component({
  selector: 'bsplit-debtor-selection-dialog',
  templateUrl: './debtor-selection-dialog.component.html',
  styleUrls: ['./debtor-selection-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtorSelectionDialogComponent implements OnInit {
  entryName: string;
  numberOfPayers: number;
  debtors: DebtorGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DebtorSelectionDialogData) {
    this.entryName = data.entryName;
    this.numberOfPayers = data.numberOfPayers;
    this.debtors = data.debtors;
  }

  ngOnInit(): void {}

  toggleDebtor(personNumber: number): void {
    this.debtors.toggleDebtor(personNumber);
  }

  isPersonDebtor(personNumber: number): boolean {
    return this.debtors.isPersonDebtor(personNumber);
  }
}
