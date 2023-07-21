import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
    private translateService: TranslateService,
    public settingsService: SettingsService,
    private calculateService: CalculateService,
    private billService: BillService,
    private personService: PersonService
  ) {
    this.billEntries = this.billService.getBill();
    this.activatedRoute.queryParams.subscribe(() => {
      this.tipValue = this.calculateService.currentTipValue;
      this.debtors = this.calculateService.calculateDebtorsForPayer(
        this.billEntries
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
      this.billEntries
    );
  }

  onShareClick(): void {
    const introAndTotal =
      'Our bill - ' +
      this.getPersonName(this.payer) +
      ' paid this time!\n\n' +
      'TOTAL (including tip): ' +
      this.calculateService.currentTotalWithTip +
      '\n';

    const table = this.debtors
      .map((debtor) => {
        return (
          this.getPersonName(debtor.personId) +
          '\n' +
          debtor.entries
            .map((entry) => {
              return '   ' + entry.name + '\t\t' + entry.splitPrice;
            })
            .join('\n') +
          '\n' +
          'SUM: ' +
          debtor.amount +
          '\n'
        );
      })
      .join('\n');
    const text = introAndTotal + table;
    console.log(text);

    if (navigator.share) {
      navigator
        .share({
          title: 'BillSplit - Split your bills with ease!',
          text,
        })
        .then(() => {
          console.log('Thanks for sharing!');
        })
        .catch(console.error);
    } else {
      // fallback
    }
  }

  getPersonName(personId: string): string {
    return this.personService.getPersonName(personId);
  }
}
