import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillService } from './../service/bill.service';
import { SettingsService } from './../service/settings.service';

@Component({
  selector: 'bsplit-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() context: 'settings' | 'bill' = 'bill';
  @Input() headline: string = 'Headline';
  numberOfPayers: number;

  constructor(
    private settingsService: SettingsService,
    private billService: BillService,
    private router: Router
  ) {
    this.numberOfPayers = this.settingsService.numberOfPayers;
  }

  ngOnInit(): void {}

  toggleNumberOfPayers(): void {
    if (this.numberOfPayers < this.settingsService.maxNumberOfPayers) {
      this.numberOfPayers++;
    } else {
      this.numberOfPayers = 1;
    }
    this.settingsService.numberOfPayers = this.numberOfPayers;
  }

  onClickNewBill(): void {
    this.billService.clearBill();
    this.router.navigate(['/bill']);
  }
}
