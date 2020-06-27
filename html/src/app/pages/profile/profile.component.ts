import { NbMenuService, NbDialogService } from '@nebular/theme';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../@service';
import { IssueService } from '../../@service/issue.service';
import { AlertDialogComponent } from '../alertdialog/alert-dialog.component';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ngx-profile',
  styleUrls: ['./profile.component.scss'],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  updatingUserData: any;
  myForm: FormGroup;
  constructor(private authService: AuthenticationService,
    private issueService: IssueService,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService) {

    this.myForm = this.formBuilder.group({
      newPassword: ['', [Validators.required]],
      retypeNew: ['']
    });
    // Check if "newPassword" and "retypeNew" matches.
    this.myForm.get('retypeNew').valueChanges.subscribe(val => {
      if (val) {
        if (val != this.myForm.get('newPassword').value) {
          this.myForm.get('retypeNew').setErrors({ "notMatch": true });
        }
        if (val == this.myForm.get('newPassword').value) {
          this.myForm.get('retypeNew').setErrors({ "doesMatch": true });
        }
      }
    });
  }

  ngOnInit() {
    this.getUserDets();
  }

  // Function to get user details.
  getUserDets() {
    this.authService.getUserDets().subscribe((data: any) => {
      this.updatingUserData = data;
      this.myForm.addControl('_id', this.formBuilder.control(data._id));
    })
  }

  // Function to update user details.
  updateDetails() {
    this.dialogService.open(AlertDialogComponent, {
      context: {
        title: "Are you sure want to update details ?",
      },
    })
      .onClose.subscribe((data: any) => {
        if (data) {
          this.authService.userUpdateDetails(this.updatingUserData).subscribe((data: any) => {
            this.updatingUserData = data;
            this.issueService.showToast('success', "Updated Details", "Successful");
          })
        }
      });
  }

  // Function to password reset.
  passwordReset() {
    this.dialogService.open(AlertDialogComponent, {
      context: {
        title: "Are you sure want to update details ?",
      },
    })
      .onClose.subscribe((data: any) => {
        if (data) {
          this.authService.userpasswordReset(this.myForm.value).subscribe((data: any) => {
            this.issueService.showToast('success', "Updated Password", "Successful");
          })
        }
      });
  }
}
