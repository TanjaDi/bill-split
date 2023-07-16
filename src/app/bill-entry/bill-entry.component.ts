import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_BILL } from 'src/app/app-routing.module';
import { BillEntry } from 'src/app/model/billl-entry.model';
import { PersonGroup } from 'src/app/model/person-group.model';
import { Person } from 'src/app/model/person.model';
import { BillService } from 'src/app/service/bill.service';
import { PersonService } from 'src/app/service/person.service';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'bsplit-bill-entry',
  templateUrl: './bill-entry.component.html',
  styleUrls: ['./bill-entry.component.scss'],
})
export class BillEntryComponent implements OnInit {
  billEntry: BillEntry;
  readonly currencySymbol: string;
  readonly persons: Person[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService,
    private personService: PersonService,
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
            debtors: new PersonGroup(foundEntry.debtors.getPersonIds()),
          };
        }
      }
    });
    this.persons = this.personService.persons;
    this.currencySymbol = getCurrencySymbol(
      this.settingsService.currency,
      'narrow',
      'de'
    );
  }

  ngOnInit(): void {}

  toggleSelected(personId: string): void {
    this.billEntry.debtors.toggleSelected(personId);
  }

  isPersonSelected(personId: string): boolean {
    return this.billEntry.debtors.isPersonSelected(personId);
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
