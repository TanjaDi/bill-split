import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingsService } from './../service/settings.service';

@Component({
  selector: 'bsplit-edit-tip-dialog',
  templateUrl: './edit-tip-dialog.component.html',
  styleUrls: ['./edit-tip-dialog.component.scss'],
})
export class EditTipDialogComponent implements OnInit {
  manuallyEditedTip: number | null = null;
  readonly tipInPercent: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) manuallyEditedTip: number | null,
    private settingsService: SettingsService
  ) {
    this.manuallyEditedTip = manuallyEditedTip;
    this.tipInPercent = this.settingsService.tipInPercent;
  }

  ngOnInit(): void {}
}
