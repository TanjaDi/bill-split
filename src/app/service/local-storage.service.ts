import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private static readonly PREFIX = 'bsplit-';
  static readonly CURRENT_BILL = 'current-bill';
  private static readonly SETTINGS = 'settings';
  static readonly SETTINGS_LANGUAGE =
    LocalStorageService.SETTINGS + '-language';
  static readonly SETTING_THEME = LocalStorageService.SETTINGS + '-theme';

  constructor() {}

  getItem(key: string): string | null {
    return localStorage.getItem(LocalStorageService.PREFIX + key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(LocalStorageService.PREFIX + key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(LocalStorageService.PREFIX + key);
  }
}
