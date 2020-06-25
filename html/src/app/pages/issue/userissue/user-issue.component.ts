import { NbMenuService, NbDialogService } from '@nebular/theme';
import { Component, OnInit } from '@angular/core';
import { IssueService } from '../../../@service/issue.service';
import { AlertDialogComponent } from '../../alertdialog/alert-dialog.component';
import { AuthenticationService } from '../../../@service';
import * as moment from 'moment';
@Component({
  selector: 'ngx-user-issue',
  styleUrls: ['./user-issue.component.scss'],
  templateUrl: './user-issue.component.html',
})
export class UserIssueComponent implements OnInit {
  requestList:any =[];
  issuedList: any = [];
  constructor(private issueService: IssueService, 
              private dialogService: NbDialogService,
              private authService: AuthenticationService
              ) {
    this.issueService.userIssueList.subscribe((data: any) => {
      if(data) this.requestList = data;
    })
  }

  ngOnInit() {
    this.getUserAllIssuedList();

    this.issueService.approvalReceiveUser().subscribe((data:any) => {
      this.issueService.userIssueList.next(data.toUserReqList);
      this.issuedList = data.toUserIssuedList;
      this.filterData();
    })
  }

  deleteRequest(issue) {
    this.dialogService.open(AlertDialogComponent,{
      context: {
        title: "Are you sure want to delete issue request '"+issue.book.name+"' ?",
      },})
      .onClose.subscribe((data:any) => {
        if(data) {
          let deleteData = {
            issueDets: issue,
            user: this.authService.currentUserValue
          }
          this.issueService.deleteRequest(deleteData);
        }
      });
  }

  getUserAllIssuedList(){
    this.issueService.getUserDataList(this.authService.currentUserValue).subscribe((data:any) => {
      this.issuedList = data;
      this.filterData();
    })
  }

  filterData() {
     for(let item of this.issuedList) {
       item.requesttime = moment(item.requesttime).format('YYYY-MM-DD (HH:mm)');
       item.issuedtime = moment(item.issuedtime).format('YYYY-MM-DD (HH:mm)');
       if(item.returntime )item.returntime = moment(item.returntime).format('YYYY-MM-DD (HH:mm)');
     }
  }

  deleteIssue(issue) {
    this.dialogService.open(AlertDialogComponent,{
      context: {
        title: "Are you sure want to delete info of '"+issue.book.name+"' ?",
      },})
      .onClose.subscribe((data:any) => {
        if(data) {
          this.issueService.deleteOldIssuedBook(issue).subscribe((data: any) => {
            this.issuedList = data;
            this.filterData();
            this.issueService.showToast('success', "Deleted Issued record", "Successful");
          });
        }
      });
  }

  returnIssue(issue) {
    this.dialogService.open(AlertDialogComponent,{
      context: {
        title: "Return book '"+issue.book.name+"' ?",
      },})
      .onClose.subscribe((data:any) => {
        if(data) {
          this.issueService.userReturnBook(issue).subscribe((data: any) => {
            this.issuedList = data;
            this.filterData();
            this.issueService.showToast('success', "Book Returned", "Successful");
          });
        }
      });
  }
}
