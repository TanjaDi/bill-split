import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillEntryComponent } from 'src/app/bill-entry/bill-entry.component';
import { BillOverviewComponent } from 'src/app/bill/bill-overview/bill-overview.component';
import { SettingsComponent } from 'src/app/settings/settings.component';

export const ROUTE_BILL = 'bill';
export const ROUTE_BILL_ENTRY = 'bill-entry';
export const ROUTE_SETTINGS = 'settings';

const routes: Routes = [
  { path: ROUTE_BILL, component: BillOverviewComponent },
  { path: ROUTE_BILL_ENTRY, component: BillEntryComponent },
  { path: ROUTE_SETTINGS, component: SettingsComponent },
  { path: '', redirectTo: '/' + ROUTE_BILL, pathMatch: 'full' },
  { path: '**', component: BillOverviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
