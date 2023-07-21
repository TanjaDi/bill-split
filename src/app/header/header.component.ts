import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_BILL } from 'src/app/app-routing.module';
import { BillService } from './../service/bill.service';

@Component({
  selector: 'bsplit-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() context: 'settings' | 'bill' | 'bill-entry' | 'bill-split' | 'tip' = 'bill';
  @Input() headline: string = 'Headline';
  @Output() saveClick: EventEmitter<void>;
  @Output() shareClick: EventEmitter<void>;

  constructor(private billService: BillService, private router: Router) {
    this.saveClick = new EventEmitter();
    this.shareClick = new EventEmitter();
  }

  ngOnInit(): void {}

  onClickNewBill(): void {
    this.billService.clearBill();
    this.router.navigate(['/' + ROUTE_BILL]);
  }

  onClickSaveButton(): void {
    this.saveClick.emit();
  }

  onClickShareButton(): void {
    this.shareClick.emit();
  }
}
