import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbAuthComponent } from '@nebular/auth';

@Component({
    selector: 'ngx-auth',
    styleUrls: ['./auth.component.scss'],
    template: ` <nb-layout>
    <nb-layout-column>
      <nb-card>
        <nb-card-body>
          <nb-auth-block>
            <router-outlet></router-outlet>
          </nb-auth-block>
        </nb-card-body>
      </nb-card>
    </nb-layout-column>
  </nb-layout>`,
})
export class AuthenticationComponent implements  OnInit {
    constructor() {}

    ngOnInit() {

    }
}