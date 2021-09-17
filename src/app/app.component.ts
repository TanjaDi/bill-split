import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ThemeService } from './service/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isDarkTheme$: Observable<boolean>;

  constructor(
    private translateService: TranslateService,
    private themeService: ThemeService
  ) {
    this.translateService.setDefaultLang('de');
    this.translateService.use('de');
    this.isDarkTheme$ = this.themeService.isDarkTheme$;
  }
}
