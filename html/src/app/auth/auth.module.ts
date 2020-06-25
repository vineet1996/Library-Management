import { NgModule } from '@angular/core';

import {
  NbMenuModule,
  NbSelectModule,
  NbCardModule,
  NbButtonModule,
  NbIconModule,
  NbSpinnerModule,
  NbCheckboxModule,
  NbLayoutModule,
  NbInputModule,
  
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { AuthenticationRoutingModule } from './auth-routing.module';
import { AuthenticationComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import {  NbAuthModule } from '@nebular/auth';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorService, ErrorInterceptorService } from '../_helpers';
@NgModule({
  imports: [
    AuthenticationRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbSelectModule,
    NbCardModule,
    RouterModule,
    NbButtonModule,
    NbIconModule,
    NbSpinnerModule,
    NbCheckboxModule,
    NbAuthModule,
    NbLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
  ],
  declarations: [
    AuthenticationComponent,
    LoginComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
  ],
})
export class AuthenticationModule {
}
