import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/notification.service';
import { PersonService } from 'src/app/service/person.service';
import { SettingsService } from 'src/app/service/settings.service';
import { ThemeService } from 'src/app/service/theme.service';

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
    private notificationService: NotificationService,
    public personService: PersonService,
    public settingsService: SettingsService,
    private themeService: ThemeService
  ) {
    const subscription = this.translateService.onLangChange.subscribe(
      (lang) => (this.userLanguage = lang.lang as 'en' | 'de')
    );
    this.subscriptions.push(subscription);
    this.isDarkTheme$ = this.themeService.isDarkTheme$;
  }

  mayLeave(): boolean {
    const mayLeave = this.personService.persons.every((f) => f.name);
    if (!mayLeave) {
      this.subscriptions.push(
        this.translateService
          .get('SETTINGS.ERROR.NAME_NOT_SET')
          .subscribe((nameNotSet) => {
            this.notificationService.showError(nameNotSet, true, 10);
          })
      );
    } else {
      this.notificationService.clear();
    }
    return mayLeave;
  }

  ngOnDestroy() {
    this.personService.savePersons();
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onChangeLanguage(event: MatRadioChange) {
    const newLanguage = event.value as 'en' | 'de';
    this.translateService.use(newLanguage);
    this.settingsService.saveLanguage(newLanguage);
  }

  toggleDarkTheme(isChecked: boolean): void {
    this.themeService.setDarkTheme(isChecked);
  }

  onClickAddPerson(): void {
    const newPerson = this.personService.createNewPerson('');
    this.personService.persons.push(newPerson);
  }

  onChangePersonName(_event: any): void {
    this.mayLeave();
  }

  onClickRemove(index: number): void {
    if (this.personService.persons.length === 1) {
      return;
    }
    this.personService.persons.splice(index, 1);
  }
}
