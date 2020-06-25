import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { LibraryComponent } from './library/library.component';
import { IssueComponent } from './issue/issue.component';
import { AdminGuardService } from '../_helpers';

const routes: Routes = [
  {
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'library', 
      component: LibraryComponent,
    },
    {
      path: 'profile', //user
      component: ProfileComponent,
      canActivate: [AdminGuardService]
    },
    {
      path: 'issue',
      component: IssueComponent,
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'library',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
  
  
}
