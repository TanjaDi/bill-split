import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
} from '@angular/router';
import { SettingsComponent } from 'src/app/settings/settings.component';

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateSettingsGuard
  implements CanDeactivate<SettingsComponent>
{
  canDeactivate(
    component: SettingsComponent,
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean {
    return component.mayLeave();
  }
}
