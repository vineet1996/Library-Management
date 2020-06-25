import { NbMenuService, NbDialogRef } from '@nebular/theme';
import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../@service';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ngx-alert-dialog',
  styleUrls: ['./alert-dialog.component.scss'],
  templateUrl: './alert-dialog.component.html',
})
export class AlertDialogComponent implements OnInit {
    @Input() title;
    constructor(protected ref: NbDialogRef<AlertDialogComponent>) {}

    ngOnInit() {

    }

    cancel(res) {
        this.ref.close(res);
    }
}