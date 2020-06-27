import { NgModule } from '@angular/core';

import {
  NbMenuModule,
  NbSelectModule,
  NbCardModule,
  NbButtonModule,
  NbIconModule,
  NbSpinnerModule,
  NbCheckboxModule,
  NbListModule,
  NbUserModule,
  NbLayoutModule,
  NbDialogModule,
  NbInputModule,
  NbAlertModule,
  NbRadioModule,
  NbBadgeModule
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { LibraryComponent } from './library/library.component';
import { UserIssueComponent } from './issue/userissue/user-issue.component';
import { AdminIssueComponent } from './issue/adminissue/admin-issue.component';
import { IssueComponent } from './issue/issue.component';
import { AdminLibraryComponent } from './library/adminlibrary/admin-library.component';
import { UserLibraryComponent } from './library/userlibrary/user-library.component';
import { AddBookComponent } from './addbookdialog/add-book.component';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from './alertdialog/alert-dialog.component';
import { ReturnDialogComponent } from './returnalertdialog/return-alert.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbSelectModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbSpinnerModule,
    NbCheckboxModule,
    NbListModule,
    NbUserModule,
    NbLayoutModule,
    NbDialogModule,
    NbInputModule,
    NbAlertModule,
    NbRadioModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbBadgeModule
  ],
  declarations: [
    PagesComponent,
    ProfileComponent,
    LibraryComponent,
    UserIssueComponent,
    AdminIssueComponent,
    IssueComponent,
    AdminLibraryComponent,
    UserLibraryComponent,
    AddBookComponent,
    AlertDialogComponent,
    ReturnDialogComponent
  ],
  entryComponents: [
    LibraryComponent,
    ProfileComponent,
    UserIssueComponent,
    AdminIssueComponent,
    IssueComponent,
    AdminLibraryComponent,
    UserLibraryComponent,
    AddBookComponent,
    AlertDialogComponent,
    ReturnDialogComponent
  ]
})
export class PagesModule {
}
