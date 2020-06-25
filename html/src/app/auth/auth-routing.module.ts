import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthenticationComponent } from './auth.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [{
  path: '',
  component: AuthenticationComponent,
  children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: '**', redirectTo: 'login' },
        {
            path: 'login',
            component: LoginComponent,
        },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {
}
