import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BillEntry } from 'src/app/model/billl-entry.model';
import { Debtor } from 'src/app/model/debtor.model';
import { BillService } from 'src/app/service/bill.service';
import { CalculateService } from 'src/app/service/calculate.service';
import { PersonService } from 'src/app/service/person.service';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'bsplit-bill-split',
  templateUrl: './bill-split.component.html',
  styleUrls: ['./bill-split.component.scss'],
})
export class BillSplitComponent implements OnInit {
  billEntries: BillEntry[];
  payer: string;
  debtors: Debtor[] = [];
  tipValue: number = -1;

  constructor(
    private activatedRoute: ActivatedRoute,
    public settingsService: SettingsService,
    private calculateService: CalculateService,
    private billService: BillService,
    private personService: PersonService
  ) {
    this.billEntries = this.billService.getBill();
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.tipValue = queryParams.tipValue;
      this.debtors = this.calculateService.calculateDebtorsForPayer(
        this.billEntries,
        this.tipValue
      );
    });
    this.payer = this.billEntries
      .find((first) => first)!
      .debtors.getPersonIds()
      .find((first) => first)!;
  }

  ngOnInit(): void {}

  onClickPayer(personId: string): void {
    this.payer = personId;
    this.debtors = this.calculateService.calculateDebtorsForPayer(
      this.billEntries,
      this.tipValue
    );
  }

  onShareClick(): void {
    // TODO
  }

  getPersonName(personId: string): string {
    return (
      this.personService.persons.find((person) => person.id === personId)
        ?.name ?? personId
    );
  }
}
