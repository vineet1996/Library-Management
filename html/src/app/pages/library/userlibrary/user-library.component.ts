import { Component, Input, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AlertDialogComponent } from '../../alertdialog/alert-dialog.component';
import { IssueService } from '../../../@service/issue.service';
import { AuthenticationService } from '../../../@service';
import * as moment from 'moment';
import { LibraryService } from '../../../@service/library.service';

@Component({
  selector: 'ngx-user-library',
  styleUrls: ['./user-library.component.scss'],
  templateUrl: './user-library.component.html',
})
export class UserLibraryComponent  implements OnInit{
  @Input() booksList;
  userData: any = '';
  membershipDays;
  constructor(private dialogService: NbDialogService, 
            private issueService: IssueService, 
            private libraryService: LibraryService, 
            private authService: AuthenticationService) {
   
  }

  ngOnInit() {
    this.userData = this.authService.currentUserValue;
    this.authService.reduceMemberShipDays();
    this.authService.currentUserSubject.subscribe((data: any) => {
      if(data) this.membershipDays = data.membership;
    })
  }

  // This funtion is triggered on click of "Read" or "Take home" button by user.
  async issueBook(book, takeHome) {
    let checkTime = await this.checktime();
    if (checkTime) {
      if(takeHome) {
        if(this.membershipDays > 5) this.issueFuntion(book, takeHome);
        else this.issueService.showToast('warning', "Your membership is expiring", "Request Cancelled");
      }
      else this.issueFuntion(book, takeHome);
    }
    else {
      this.issueService.showToast('danger', "Issue Time 10:00 AM to 03:00 PM", "Request Cancelled");
    }
  }

  // Function call to send issue request.
  issueFuntion(book, takeHome) {
    let title = 'Request book "' + book.name + '" to read ?'
      if (takeHome) title = 'Request book "' + book.name + '" to take home ?'
      this.dialogService.open(AlertDialogComponent, {
        context: {
          title: title,
        },
      })
        .onClose.subscribe((data: any) => {
          if (data) {
            const sendReqData = {
              userId: this.userData.id,
              takeHome,
              bookId: book._id
            }
            this.issueService.requestIssue(sendReqData);
          }
        });
  }

  // Function to check issue request is done in allowed time.
  checktime() {
    const currentTime = moment().format();
    const startTime = moment("10:00", 'HH:mm').format(); // start time fixed to 10:00AM
    const endTime = moment("15:00", 'HH:mm').format(); // end time fixed to 15:00 (3:00 PM)
    return moment(currentTime).isBetween(startTime, endTime);
  }

  // Function to search for books.
  searchText(event) {
    this.libraryService.getSearchResults(event.target.value).subscribe(data => {
      this.booksList = data;
    })
  }

}
