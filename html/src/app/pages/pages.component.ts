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
    this.issueService.receiveRequest().subscribe(data => {
      let currentList = this.issueService.currentAdminIssueList;
      currentList.push(data);
      this.issueService.adminIssueList.next(currentList);
      this.issueService.showToast('primary', data.book.name, "New Request");
    });

    this.issueService.updatedReqList().subscribe((data: any) => {
      console.log(data);
      this.issueService.adminIssueList.next(data);
    })
  }

  userSocketsSubscribes() {
    this.issueService.userUpdatedReqList().subscribe(data => {
      let result = data.result;
      this.issueService.userIssueList.next(result.toUser);
      if(data.type == 'new') this.issueService.showToast('success', result.toAdmin.book.name, "Request Sent");
      if(data.type == 'delete') this.issueService.showToast('success', "Deleted Request", "Successfull");
    });

    this.issueService.approvalReceiveUser().subscribe((data:any) => {
      this.issueService.userIssueList.next(data.toUserReqList);
      if(data.approval) this.issueService.showToast('success', 'Book is approved', 'successfull')
      else this.issueService.showToast('warning', 'Book is declined', 'Rejected')
    })
  }


}
