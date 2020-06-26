import { Component, OnInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { AuthenticationService } from '../@service';
import { Router } from '@angular/router';
import { IssueService } from '../@service/issue.service';
import {
  NbDialogService,
} from '@nebular/theme';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {
  menu = MENU_ITEMS;
  constructor(private authService: AuthenticationService,
    private router: Router,
    private issueService: IssueService) {
  }

  ngOnInit() {
    this.issueService.setupSocketConnection();
    this.issueService.joinRoom(this.authService.currentUserValue);

    if (this.authService.isAdmin) {
      this.adminSocketsSubscribes();
    }
    else {
      this.userSocketsSubscribes();
    }

  }

  adminSocketsSubscribes() {
    //admin receiving any request from users;
    this.issueService.updatedReqList().subscribe((data: any) => {
      this.issueService.adminIssueList.next(data.result);
      switch(data.type) {
        case 'new': this.issueService.showToast('primary',"Book Issue request", "New Request");
                    break;
        case 'approval': this.issueService.showToast('success',"Approval status", "Submitted successfully");
                          break;
        case 'delete': this.issueService.showToast('warning',"Request List is updated", "Check updated list");
                      break;
        case 'return': this.issueService.showToast('primary',"Return book request", "Request");
                      break;
      }
    })
  }

  userSocketsSubscribes() {
    this.issueService.userUpdatedReqList().subscribe(data => {
      let result = data.result;
      this.issueService.userIssueList.next(result);
      switch(data.type) {
        case 'new': this.issueService.showToast('success',"Book Issue", "Request Sent");
                    break;
        case 'delete': this.issueService.showToast('success', "Deleted Request", "Successfull");
                        break;
        case 'return': this.issueService.showToast('success', "Return Request", "Successfull");
                        break
      }
    });

    this.issueService.approvalReceiveUser().subscribe((data:any) => {
      this.issueService.userIssueList.next(data.toUserReqList);
      if(data.approval ) {
        if(data.return) this.issueService.showToast('success', 'Return Book is approved', 'successfull')  
        else this.issueService.showToast('success', 'Book issue is approved', 'successfull')
      } 
      else this.issueService.showToast('warning', 'Book is declined', 'Rejected')
    })
  }


}
