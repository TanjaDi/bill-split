import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  numberOfPayers: number;
  maxNumberOfPayers: number;
  tipInPercent: number;
  currency: 'EUR'|'USD';

  constructor() {
    this.numberOfPayers = 2;
    this.maxNumberOfPayers = 4;
    this.tipInPercent = 8;
    this.currency = 'EUR';
  }
}
