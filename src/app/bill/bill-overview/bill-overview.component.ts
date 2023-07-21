import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, filter, tap } from 'rxjs';
import { BillEntry } from 'src/app/model/billl-entry.model';
import { PersonGroup } from 'src/app/model/person-group.model';
import { BillService } from 'src/app/service/bill.service';
import { CalculateService } from 'src/app/service/calculate.service';
import { PersonService } from 'src/app/service/person.service';
import { SettingsService } from 'src/app/service/settings.service';
import {
  ROUTE_BILL_ENTRY,
  ROUTE_BILL_SPLIT,
  ROUTE_BILL_TIP,
  ROUTE_SETTINGS,
} from './../../app-routing.module';

@Component({
  selector: 'bsplit-bill-overview',
  templateUrl: './bill-overview.component.html',
  styleUrls: ['./bill-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BillOverviewComponent implements OnInit {
  bill$: Observable<BillEntry[]>;
  readonly displayedColumns = ['name', 'price', 'edit'];
  readonly displayedColumnsForTipFooter = ['tip', 'tipAmount', 'calculateTip'];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private billService: BillService,
    public settingsService: SettingsService,
    public calculateService: CalculateService,
    private personService: PersonService
  ) {
    this.bill$ = this.billService.getBill$().asObservable();
    const billChangesSubscription = this.billService
      .getBill$()
      .subscribe((newBill) => this.onChangeBill(newBill));
    this.subscriptions.push(billChangesSubscription);
  }

  private onChangeBill(newBill: BillEntry[]): void {
    newBill.forEach((entry) => {
      entry.debtors = new PersonGroup(entry.debtors.personIds);
    });
    this.calculateService.updateTotal(newBill);
    this.calculateService.updateTipValueToRoundedTip();
    this.calculateService.updateTipInPercentUsingTipValueAndTotal();
  }

  ngOnInit(): void {
    this.personService.initFinished$
      .pipe(
        filter((init) => init),
        tap(() => {
          if (this.personService.getPersons().length < 2) {
            this.router.navigate([ROUTE_SETTINGS]);
          }
        })
      )
      .subscribe();
  }

  onClickAddEntry(): void {
    this.gotoBillEntry(null);
  }

  onClickSplitBill(): void {
    this.router.navigate([ROUTE_BILL_SPLIT]);
  }

  gotoEditTip(): void {
    this.router.navigate([ROUTE_BILL_TIP]);
  }

  gotoBillEntry(billEntryToEdit: BillEntry | null): void {
    this.router.navigate(
      [ROUTE_BILL_ENTRY],
      billEntryToEdit ? { queryParams: { id: billEntryToEdit.id } } : undefined
    );
  }
}
