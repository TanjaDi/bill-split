import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillService } from './../service/bill.service';

@Component({
  selector: 'bsplit-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() context: 'settings' | 'bill' = 'bill';
  @Input() headline: string = 'Headline';

  constructor(
    private billService: BillService,
    private router: Router
  ) {
  }

  ngOnInit(): void {}

  onClickNewBill(): void {
    this.billService.clearBill();
    this.router.navigate(['/bill']);
  }
}
