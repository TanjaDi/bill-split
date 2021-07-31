import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SettingsService } from './../service/settings.service';

export interface BillEntry {
  name: string;
  price: number;
  isEditMode: boolean;
}

const DATA_SOURCE: BillEntry[] = [
  { name: 'Cola zero', price: 3.3, isEditMode: false },
  { name: 'Pizza Fungi', price: 10.5, isEditMode: false },
  { name: 'Augustiner Helles', price: 4.5, isEditMode: false },
  { name: 'Pizza Vegana', price: 11.5, isEditMode: false },
];

@Component({
  selector: 'bsplit-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
})
export class BillComponent implements OnInit {
  tipInPercent: number;
  formGroup: FormGroup;
  entries: BillEntry[];
  total: number;
  tip = 0;
  displayedColumns = ['name', 'price', 'edit'];
  displayedColumnsForTipFooter = ['tip', 'tipAmount', 'calculateTip'];
  currency: 'EUR' | 'USD';

  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService
  ) {
    this.tipInPercent = this.settingsService.tipInPercent;
    this.currency = this.settingsService.currency;
    this.entries = DATA_SOURCE;
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([new FormControl()]),
    });
    this.total = this.entries.reduce((sum, entry) => {
      sum += entry.price;
      return sum;
    }, 0);
    this.calculateTip();
  }

  ngOnInit(): void {}

  calculateTip(): void {
    this.tip = this.total * (this.tipInPercent / 100);
  }
}
