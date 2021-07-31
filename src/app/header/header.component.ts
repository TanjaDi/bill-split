import { Component, OnInit } from '@angular/core';
import { SettingsService } from './../service/settings.service';

@Component({
  selector: 'bsplit-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  numberOfPayers = 2;

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.numberOfPayers = this.settingsService.numberOfPayers;
  }
}
