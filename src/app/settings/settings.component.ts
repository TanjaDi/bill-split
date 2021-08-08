import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subscription } from 'rxjs';
import { SettingsService } from 'src/app/service/settings.service';

@Component({
  selector: 'bsplit-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnDestroy {
  isDarkTheme$: Observable<boolean>;
  userLanguage: 'en' | 'de' = 'de';
  readonly languages = ['de', 'en'];

  private subscriptions: Subscription[] = [];

  constructor(
    private translateService: TranslateService,
    private settingsService: SettingsService
  ) {
    const subscription = this.translateService.onLangChange.subscribe(
      (lang) => (this.userLanguage = lang.lang as 'en' | 'de')
    );
    this.subscriptions.push(subscription);
    this.isDarkTheme$ = of(false);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onChangeLanguage(event: MatRadioChange) {
    const newLanguage = event.value as 'en' | 'de';
    this.translateService.use(newLanguage);
    this.settingsService.saveLanguage(newLanguage);
  }

  toggleDarkTheme(isChecked: boolean): void {
    // this.themeService.setDarkTheme(isChecked);
  }
}
