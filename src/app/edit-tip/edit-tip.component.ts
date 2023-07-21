import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';
import { BillEntry } from 'src/app/model/billl-entry.model';
import { PersonGroup } from 'src/app/model/person-group.model';
import { BillService } from 'src/app/service/bill.service';
import { CalculateService } from '../service/calculate.service';
import { SettingsService } from '../service/settings.service';

export interface EditTipDialogData {
  total: number;
  tipValue: number;
}

@Component({
  selector: 'bsplit-edit-tip',
  templateUrl: './edit-tip.component.html',
  styleUrls: ['./edit-tip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTipComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private billService: BillService,
    public settingsService: SettingsService,
    public calculateService: CalculateService
  ) {
    const activatedRouteSub = this.activatedRoute.queryParams
      .pipe(
        switchMap(() => this.billService.getBill$()),
        tap((newBill) => {
          this.onChangeBill(newBill);
        })
      )
      .subscribe();
    this.subscriptions.push(activatedRouteSub);
  }

  ngOnInit(): void {}

  private onChangeBill(newBill: BillEntry[]): void {
    newBill.forEach((entry) => {
      entry.debtors = new PersonGroup(entry.debtors.personIds);
    });
    this.calculateService.updateTotal(newBill);
    this.calculateService.updateTipValueToRoundedTip();
    this.calculateService.updateTipInPercentUsingTipValueAndTotal();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onClickSetTip(newTipInPercent: number): void {
    this.calculateService.updateTipValueToExactTip(newTipInPercent);
  }

  onClickRoundTip(newTipInPercent: number): void {
    this.calculateService.updateTipValueToRoundedTip(newTipInPercent);
  }

  onEditSumWithTip(newTotalWithTip: number): void {
    this.calculateService.setNewTotalWithTip(newTotalWithTip);
  }
}
