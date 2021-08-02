import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonGroup } from '../../model/person-group.model';

export interface DebtorSelectionDialogData {
  entryName: string;
  debtors: PersonGroup;
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
  personGroup: PersonGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DebtorSelectionDialogData) {
    this.entryName = data.entryName;
    this.numberOfPayers = data.numberOfPayers;
    this.personGroup = data.debtors;
  }

  ngOnInit(): void {}

  toggleSelected(personNumber: number): void {
    this.personGroup.toggleSelected(personNumber);
  }

  isPersonSelected(personNumber: number): boolean {
    return this.personGroup.isPersonSelected(personNumber);
  }
}
