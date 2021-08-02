import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BillSplitDialogComponent } from './bill/bill-split-dialog/bill-split-dialog.component';
import { BillComponent } from './bill/bill.component';
import { DebtorSelectionDialogComponent } from './bill/debtor-selection-dialog/debtor-selection-dialog.component';
import { EditBillEntryDialogComponent } from './bill/edit-bill-entry-dialog/edit-bill-entry-dialog.component';
import { HeaderComponent } from './header/header.component';
import { PeopleComponent } from './people/people.component';
import { EditTipDialogComponent } from './edit-tip-dialog/edit-tip-dialog.component';

registerLocaleData(localeDe);
registerLocaleData(localeEn);

@NgModule({
  declarations: [
    AppComponent,
    BillComponent,
    HeaderComponent,
    DebtorSelectionDialogComponent,
    EditBillEntryDialogComponent,
    BillSplitDialogComponent,
    PeopleComponent,
    EditTipDialogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
