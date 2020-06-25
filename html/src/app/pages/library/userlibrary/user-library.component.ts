import { Component, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AlertDialogComponent } from '../../alertdialog/alert-dialog.component';
import { title } from 'process';
import { IssueService } from '../../../@service/issue.service';
import { AuthenticationService } from '../../../@service';

@Component({
  selector: 'ngx-user-library',
  styleUrls: ['./user-library.component.scss'],
  templateUrl: './user-library.component.html',
})
export class UserLibraryComponent {
  @Input() booksList;
  userData: any = '';
  constructor(private dialogService: NbDialogService, private issueService: IssueService, private authService: AuthenticationService) {
    this.userData = authService.currentUserValue;
  }

  issueBook(book, takeHome) {
    let title = 'Request book "' + book.name + '" to read ?'
    if(takeHome) title = 'Request book "' + book.name + '" to take home ?'
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

}
