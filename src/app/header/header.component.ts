import { BillService } from './../service/bill.service';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './../service/local-storage.service';
import { SettingsService } from './../service/settings.service';

@Component({
  selector: 'bsplit-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  numberOfPayers = 2;

  constructor(
    private settingsService: SettingsService,
    private billService: BillService
  ) {}

  ngOnInit(): void {
    this.numberOfPayers = this.settingsService.numberOfPayers;
  }

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
  }

  onClickSplitBill(): void {}
}
