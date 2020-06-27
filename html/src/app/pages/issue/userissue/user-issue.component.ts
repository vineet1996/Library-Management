import { NbMenuService, NbDialogService } from '@nebular/theme';
import { Component, OnInit } from '@angular/core';
import { IssueService } from '../../../@service/issue.service';
import { AlertDialogComponent } from '../../alertdialog/alert-dialog.component';
import { AuthenticationService } from '../../../@service';
import * as moment from 'moment';
import { ReturnDialogComponent } from '../../returnalertdialog/return-alert.component';
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
    });

    this.issueService.userUpdatedReqList().subscribe(data => {
      this.getUserAllIssuedList();
    });
  }

  // deleting book issue request 
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

  // getting users history data
  getUserAllIssuedList(){
    this.issueService.getUserDataList(this.authService.currentUserValue).subscribe((data:any) => {
      this.issuedList = data;
      this.filterData();
    })
  }

  // changing format of timestamp to local time.
  filterData() {
     for(let item of this.issuedList) {
       item.requesttime = moment(item.requesttime).format('YYYY-MM-DD (HH:mm)');
       item.issuedtime = moment(item.issuedtime).format('YYYY-MM-DD (HH:mm)');
       if(item.returntime )item.returntime = moment(item.returntime).format('YYYY-MM-DD (HH:mm)');
     }
  }

  // deleting old data 
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

  // book return request to admin.
  async returnIssue(issue) {
    let checkTime = await this.checktime(); // check for action is happening in the given time slot.
    if(checkTime) {
      let lateDayReturn  = await this.oneDayReturnCheck(issue); // if issued to "Read" check if returning on the same day of issue.
      let lateTakeHomeReturn;
      if(issue.takehome) lateTakeHomeReturn = await this.takeHomeReturnCheck(issue); // if issued to "Take Home" check if returning before 7th day of issue.
      let note = '';
      if(lateDayReturn || lateTakeHomeReturn) note = 'There will be fine for late submission.';
      this.dialogService.open(ReturnDialogComponent,{
        context: {
          title: "Return book '"+issue.book.name+"' ?",
          note: note
        },})
        .onClose.subscribe((data:any) => {
          if(data) {
            this.issueService.userReturnBook(issue);
          }
        });
    }
    else {
      this.issueService.showToast('danger', "Book return time 10:00 AM to 05:00 PM", "Request Cancelled");
    }
  }

  checktime() {
    const currentTime = moment();
    const startTime = moment("10:00", 'HH:mm'); // start time fixed to 10:00AM
    const endTime = moment("17:00", 'HH:mm'); // end time fixed to 17:00 (5:00 PM)
    return currentTime.isBetween(startTime, endTime); // Boolean value if return time is between 10:00 AM and 5:00 PM
  }

  oneDayReturnCheck(issue) {
    const currentTime = moment();
    const getDate = moment(new Date(issue.issuedtime)).format("YYYY-MM-DD"); // getting issued date
    const expectedReturnTime = moment(getDate+' 17:00', 'YYYY-MM-DD HH:mm').format(); // fixing boundry to 5:00 PM
    return currentTime.isAfter(expectedReturnTime) ; // Boolean value return if return time exceeds issued date 5:00 PM
  }

  takeHomeReturnCheck(issue) {
    const currentTime = moment();
    const getDate = moment(new Date(issue.issuedtime)).add(7, 'days').format("YYYY-MM-DD"); // getting issued date and adding 7 days to it.
    const expectedReturnTime = moment(getDate+' 17:00', 'YYYY-MM-DD HH:mm').format(); // fixing boundry to 5:00 PM
    return currentTime.isAfter(expectedReturnTime) ; // Boolean value return if return time exceeds 7th day of issued date 5:00 PM
  }
}
