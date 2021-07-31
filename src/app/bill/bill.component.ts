import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  readonly TIP_IN_PERCENT = 8;
  formGroup: FormGroup;
  entries: BillEntry[];
  total: number;
  tip = 0;
  displayedColumns = ['name', 'price', 'edit'];
  displayedColumnsForTipFooter = ['tip', 'tipAmount', 'calculateTip'];

  constructor(private formBuilder: FormBuilder) {
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
    this.tip = this.total * (this.TIP_IN_PERCENT / 100);
  }
}
