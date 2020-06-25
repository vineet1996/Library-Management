import { NbMenuService } from '@nebular/theme';
import { Component } from '@angular/core';
import { AuthenticationService } from '../../@service';

@Component({
  selector: 'ngx-issue',
  styleUrls: ['./issue.component.scss'],
  templateUrl: './issue.component.html',
})
export class IssueComponent {
  isadmin: boolean = false;
  constructor(private authService: AuthenticationService) {
    if(this.authService.isAdmin) {
      this.isadmin = true;
    }
  }

}
