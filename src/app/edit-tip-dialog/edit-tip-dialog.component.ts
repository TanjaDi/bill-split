import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalculateService } from '../service/calculate.service';
import { SettingsService } from './../service/settings.service';

export interface EditTipDialogData {
  total: number;
  tipValue: number;
  currency: 'EUR' | 'USD';
}

@Component({
  selector: 'bsplit-edit-tip-dialog',
  templateUrl: './edit-tip-dialog.component.html',
  styleUrls: ['./edit-tip-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTipDialogComponent implements OnInit {
  total: number;
  totalWithTip: number;
  currentTipValue: number;
  currentTipPercent: number;
  readonly currency: 'EUR' | 'USD';
  readonly defaultTipInPercent: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) dialogData: EditTipDialogData,
    private dialogRef: MatDialogRef<EditTipDialogComponent, number | null>,
    private settingsService: SettingsService,
    private calculateService: CalculateService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.defaultTipInPercent = this.settingsService.tipInPercent;
    this.currency = dialogData.currency;
    this.currentTipValue = dialogData.tipValue;
    this.total = dialogData.total;
    this.totalWithTip = this.calculateService.calculateSumWithTip(
      this.currentTipValue,
      this.total
    );
    this.currentTipPercent = this.calculateService.calculateTipInPercent(
      this.currentTipValue,
      this.total
    );
  }

  ngOnInit(): void {}

  onClickOK(): void {
    this.dialogRef.close(this.currentTipValue);
  }

  onClickSetTip(newTipInPercent: number): void {
    this.currentTipValue = this.calculateService.calculateExactTip(
      this.total,
      newTipInPercent
    );
    this.updateAfterTipValueChange();
  }

  onClickRoundTip(newTipInPercent: number): void {
    this.currentTipValue = this.calculateService.calculateRoundedTip(
      this.total,
      newTipInPercent
    );
    this.updateAfterTipValueChange();
  }

  onEditSumWithTip(newTotalWithTip: number): void {
    this.totalWithTip = newTotalWithTip;
    this.currentTipValue = this.totalWithTip - this.total;
    this.currentTipPercent = this.calculateService.calculateTipInPercent(
      this.currentTipValue,
      this.total
    );
    this.changeDetectorRef.markForCheck();
  }

  private updateAfterTipValueChange() {
    this.totalWithTip = this.calculateService.calculateSumWithTip(
      this.currentTipValue,
      this.total
    );
    this.currentTipPercent = this.calculateService.calculateTipInPercent(
      this.currentTipValue,
      this.total
    );
    this.changeDetectorRef.markForCheck();
  }
}
