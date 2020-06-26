import { NbMenuService, NbDialogService } from '@nebular/theme';
import { Component, OnInit } from '@angular/core';
import { IssueService } from '../../../@service/issue.service';
import { AlertDialogComponent } from '../../alertdialog/alert-dialog.component';
import * as moment from 'moment';
@Component({
  selector: 'ngx-admin-issue',
  styleUrls: ['./admin-issue.component.scss'],
  templateUrl: './admin-issue.component.html',
})
export class AdminIssueComponent implements OnInit {
  requestList: any = [];
  issuedList: any = [];
  constructor(private issueService: IssueService,
              private dialogService: NbDialogService) {

  }

  ngOnInit() {
    this.getAdminOldData();
    this.issueService.adminIssueList.subscribe((data: any) => {
      if(data) this.requestList = data;
    })

    this.issueService.updatedReqList().subscribe((data: any) => {
      this.getAdminOldData();
    });
  }

  approvalBook(issue, approval) {
    let title = "Accept the request of '"+ issue.book.name +"' by '"+issue.user.username+"' ?";
    if(!approval) title = "Decline the request of '"+ issue.book.name +"' by '"+issue.user.username+"' ?";
    if(issue.returnrequest) title = "Accept return request of '"+ issue.book.name +"' by '"+issue.user.username+"' ?";
    this.dialogService.open(AlertDialogComponent,{
      context: {
        title: title,
      },})
      .onClose.subscribe((data:any) => {
        if(data) {
          let approvalData = {
            issueDets: issue,
            approval: approval,
            returnreq: false,
          }
          if(issue.returnrequest) approvalData.returnreq = true;
          this.issueService.approvalByAdmin(approvalData);
        }
      });
  }

  getAdminOldData(){
    this.issueService.getAdminAllOldData().subscribe((data:any) => {
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
}
