import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  numberOfPayers: number;
  maxNumberOfPayers: number;
  tipInPercent: number;
  currency: 'EUR' | 'USD';

  constructor(
    private translateService: TranslateService,
    private localStorageService: LocalStorageService
  ) {
    this.numberOfPayers = 2;
    this.maxNumberOfPayers = 4;
    this.tipInPercent = 8;
    this.currency = 'EUR';
    this.initLanguage();
  }

  private initLanguage() {
    const langFromLocalStorage = this.localStorageService.getItem(
      LocalStorageService.SETTINGS_LANGUAGE
    );
    if (langFromLocalStorage !== null) {
      this.translateService.use(langFromLocalStorage);
    } else {
      this.translateService.use(this.translateService.getBrowserLang() || 'de');
    }
  }

  saveLanguage(newLanguage: 'de' | 'en'): void {
    this.localStorageService.setItem(
      LocalStorageService.SETTINGS_LANGUAGE,
      newLanguage
    );
  }
}
