import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_BILL } from 'src/app/app-routing.module';
import { BillEntry } from 'src/app/model/billl-entry.model';
import { Friend } from 'src/app/model/friend.model';
import { PersonGroup } from 'src/app/model/person-group.model';
import { BillService } from 'src/app/service/bill.service';
import { FriendService } from 'src/app/service/friend.service';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'bsplit-bill-entry',
  templateUrl: './bill-entry.component.html',
  styleUrls: ['./bill-entry.component.scss'],
})
export class BillEntryComponent implements OnInit {
  billEntry: BillEntry;
  readonly currencySymbol: string;
  readonly friends: Friend[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private friendService: FriendService,
    private billService: BillService,
    private translateService: TranslateService
  ) {
    this.billEntry = this.billService.createNewBillEntry(
      this.settingsService.currency
    );
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams.id) {
        const foundEntry = this.billService
          .getBill()
          .find((entry) => entry.id === queryParams.id);
        if (foundEntry) {
          this.billEntry = {
            ...foundEntry,
            debtors: new PersonGroup(foundEntry.debtors.getFriendIds()),
          };
        }
      }
    });
    this.friends = this.friendService.friends;
    this.currencySymbol = getCurrencySymbol(
      this.settingsService.currency,
      'narrow',
      'de'
    );
  }

  ngOnInit(): void {}

  toggleSelected(friendId: string): void {
    this.billEntry.debtors.toggleSelected(friendId);
  }

  isPersonSelected(friendId: string): boolean {
    return this.billEntry.debtors.isFriendSelected(friendId);
  }

  onClickDelete(): void {
    if (this.billEntry.id.length > 0) {
      this.billService.removeBillEntry(this.billEntry.id);
    }
    this.router.navigate(['/' + ROUTE_BILL]);
  }

  onClickSave(): void {
    if (this.billEntry.name === '') {
      this.billEntry.name = this.translateService.instant('BILL.ENTRY');
    }
    if (this.billEntry.id.length === 0) {
      // add new
      this.billService.addNewBillEntry(this.billEntry);
    } else {
      // update
      this.billService.updateBillEntry(this.billEntry);
    }
    this.router.navigate(['/' + ROUTE_BILL]);
  }
}
