import { NbMenuService, NbDialogRef } from '@nebular/theme';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-return-alert',
  styleUrls: ['./return-alert.component.scss'],
  templateUrl: './return-alert.component.html',
})
export class ReturnDialogComponent implements OnInit {
    @Input() title;
    @Input() note;
    constructor(protected ref: NbDialogRef<ReturnDialogComponent>) {}

    ngOnInit() {

    }

    cancel(res) {
        this.ref.close(res);
    }
}