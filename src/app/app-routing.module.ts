import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillOverviewComponent } from './bill/bill-overview/bill-overview.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: 'bill', component: BillOverviewComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '', redirectTo: '/bill', pathMatch: 'full' },
  { path: '**', component: BillOverviewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
